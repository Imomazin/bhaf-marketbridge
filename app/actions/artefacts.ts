"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";

import { auth } from "@/auth";
import { prisma, DB_ENABLED } from "@/lib/db";
import { uploadFileToStorage } from "@/lib/storage";
import { writeAudit } from "@/lib/audit";
import { sendEmail } from "@/lib/email";
import { rateLimit } from "@/lib/ratelimit";

const uploadSchema = z.object({
  name: z.string().min(2).max(160),
  category: z.string().min(2).max(60),
  required: z.coerce.boolean().default(false),
});

export type ArtefactActionResult =
  | { ok: true; id: string; sha256: string; status: string }
  | { ok: false; message: string };

export async function uploadArtefact(formData: FormData): Promise<ArtefactActionResult> {
  const session = await auth();
  if (!session?.user) return { ok: false, message: "You must be signed in to upload." };
  if (!DB_ENABLED || !prisma) {
    return { ok: false, message: "Database not configured — cannot persist uploads yet." };
  }

  const rl = await rateLimit("upload", session.user.id);
  if (!rl.success) {
    return { ok: false, message: "Too many uploads. Slow down and try again in a minute." };
  }

  const parsed = uploadSchema.safeParse({
    name: formData.get("name"),
    category: formData.get("category"),
    required: formData.get("required") === "true",
  });
  if (!parsed.success) {
    return { ok: false, message: "Please fill in name and category." };
  }

  const file = formData.get("file");
  if (!(file instanceof File)) {
    return { ok: false, message: "No file received." };
  }

  const result = await uploadFileToStorage(file, session.user.id);
  if (!result.ok) {
    // Audit the rejected upload attempt so anti-fraud monitoring sees it.
    await writeAudit({
      actorId: session.user.id,
      actorLabel: session.user.email ?? session.user.id,
      action: `Upload rejected · ${parsed.data.name} · ${result.reason}`,
      entityType: "Artefact",
    });
    return { ok: false, message: result.reason };
  }

  const a = result.artefact;

  const artefact = await prisma.artefact.create({
    data: {
      userId: session.user.id,
      name: parsed.data.name,
      category: parsed.data.category,
      required: parsed.data.required,
      status: "PENDING_REVIEW",
      fileName: a.fileName,
      fileSize: a.size,
      mimeType: a.mimeType,
      storageKey: a.storageKey,
      sha256: a.sha256,
      uploadedAt: new Date(),
      checks: {
        create: [
          { name: "File integrity (SHA-256)", status: "PASS" },
          { name: "MIME & magic-byte match", status: "PASS" },
          { name: "Size & format limits", status: "PASS" },
          { name: "Antivirus scan", status: "PENDING", detail: "Queued for ClamAV / VirusTotal" },
          { name: "Cross-check against profile", status: "PENDING" },
        ],
      },
    },
  });

  await writeAudit({
    actorId: session.user.id,
    actorLabel: session.user.email ?? session.user.id,
    action: `Uploaded · ${parsed.data.name}`,
    entityType: "Artefact",
    entityId: artefact.id,
    metadata: { sha256: a.sha256, size: a.size, mime: a.mimeType },
  });

  revalidatePath("/portal/entrepreneur");
  revalidatePath("/portal/funder");
  revalidatePath("/portal/corporate");
  revalidatePath("/admin");

  return { ok: true, id: artefact.id, sha256: a.sha256, status: artefact.status };
}

const reviewSchema = z.object({
  artefactId: z.string().min(1),
  decision: z.enum(["APPROVE", "REJECT", "REQUEST_CHANGES"]),
  comment: z.string().max(2000).optional(),
});

export async function reviewArtefact(input: z.infer<typeof reviewSchema>): Promise<ArtefactActionResult> {
  const session = await auth();
  if (!session?.user) return { ok: false, message: "Sign-in required." };
  if (session.user.role !== "ADMIN" && session.user.role !== "AUDITOR") {
    return { ok: false, message: "Only BHAF administrators can review artefacts." };
  }
  if (!DB_ENABLED || !prisma) {
    return { ok: false, message: "Database not configured." };
  }

  const parsed = reviewSchema.safeParse(input);
  if (!parsed.success) return { ok: false, message: "Invalid review payload." };

  const artefact = await prisma.artefact.findUnique({
    where: { id: parsed.data.artefactId },
    include: { user: true },
  });
  if (!artefact) return { ok: false, message: "Artefact not found." };

  const nextStatus =
    parsed.data.decision === "APPROVE"
      ? "VALIDATED"
      : parsed.data.decision === "REJECT"
      ? "REJECTED"
      : "PENDING_REVIEW";

  await prisma.$transaction([
    prisma.artefact.update({
      where: { id: artefact.id },
      data: {
        status: nextStatus,
        validatedAt: parsed.data.decision === "APPROVE" ? new Date() : null,
        rejectionReason: parsed.data.decision === "REJECT" ? parsed.data.comment ?? null : null,
      },
    }),
    prisma.artefactReview.create({
      data: {
        artefactId: artefact.id,
        reviewerId: session.user.id,
        decision: parsed.data.decision,
        comment: parsed.data.comment ?? null,
      },
    }),
  ]);

  await writeAudit({
    actorId: session.user.id,
    actorLabel: session.user.email ?? "Admin",
    action: `${parsed.data.decision} · ${artefact.name}`,
    entityType: "Artefact",
    entityId: artefact.id,
    metadata: { comment: parsed.data.comment ?? null },
  });

  if (artefact.user.email) {
    await sendEmail({
      to: artefact.user.email,
      subject:
        parsed.data.decision === "APPROVE"
          ? `Validated: ${artefact.name}`
          : parsed.data.decision === "REJECT"
          ? `Action needed: ${artefact.name}`
          : `Update on: ${artefact.name}`,
      body:
        parsed.data.decision === "APPROVE"
          ? `Your "${artefact.name}" has been validated. It now counts toward your readiness status.`
          : parsed.data.decision === "REJECT"
          ? `Your "${artefact.name}" was rejected.\n\nReason: ${parsed.data.comment ?? "See your dashboard."}\n\nPlease re-upload a corrected version.`
          : `Your "${artefact.name}" needs changes.\n\n${parsed.data.comment ?? "Check your dashboard for details."}`,
    });
  }

  revalidatePath("/portal/entrepreneur");
  revalidatePath("/admin");

  return { ok: true, id: artefact.id, sha256: artefact.sha256 ?? "", status: nextStatus };
}
