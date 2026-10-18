"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";

import { auth } from "@/auth";
import { prisma, DB_ENABLED } from "@/lib/db";
import { writeAudit } from "@/lib/audit";
import { sendEmail } from "@/lib/email";
import { uploadArtefactForUser, type ArtefactActionResult } from "@/lib/server/artefactUploads";

export async function uploadArtefact(formData: FormData): Promise<ArtefactActionResult> {
  const session = await auth();
  if (!session?.user) return { ok: false, message: "You must be signed in to upload." };
  return uploadArtefactForUser(
    { id: session.user.id, email: session.user.email ?? null },
    formData,
  );
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
          ? `Hi ${artefact.user.name ?? "there"},\n\nWe're sorry to let you know that your "${artefact.name}" couldn't be accepted at this time.\n\nHere is the reason provided by our review team:\n${parsed.data.comment ?? "Please check your dashboard for more details."}\n\nWe know this can be frustrating, but we'd love for you to upload a corrected version whenever you're ready!\n\nBest,\nThe Review Team`
          : `Hi ${artefact.user.name ?? "there"},\n\nYour "${artefact.name}" needs a few changes before we can validate it.\n\nHere's what our review team noted:\n${parsed.data.comment ?? "Please check your dashboard for details."}\n\nWe look forward to seeing your updated version!\n\nBest,\nThe Review Team`,
    });
  }

  revalidatePath("/portal/entrepreneur");
  revalidatePath("/admin");

  return { ok: true, id: artefact.id, sha256: artefact.sha256 ?? "", status: nextStatus };
}
