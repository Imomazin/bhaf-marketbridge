"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";

import { prisma, DB_ENABLED } from "@/lib/db";
import { uploadFileToStorage } from "@/lib/storage";
import { writeAudit } from "@/lib/audit";
import { rateLimit } from "@/lib/ratelimit";
import { checkBySha256 } from "@/lib/integrations/virusTotal";
import { saveDemoArtefact } from "@/lib/demoState";

const uploadSchema = z.object({
  name: z.string().min(2).max(160),
  category: z.string().min(2).max(60),
  required: z.coerce.boolean().default(false),
});

export type ArtefactActionResult =
  | { ok: true; id: string; sha256: string; status: string }
  | { ok: false; message: string };

interface UploadActor {
  id: string;
  email?: string | null;
}

export async function uploadArtefactForUser(
  actor: UploadActor,
  formData: FormData,
): Promise<ArtefactActionResult> {
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

  if (!DB_ENABLED || !prisma) {
    const artefact = await saveDemoArtefact({
      userId: actor.id,
      name: parsed.data.name,
      category: parsed.data.category,
      required: parsed.data.required,
      fileName: file.name,
      fileSizeBytes: file.size,
    });

    revalidateArtefactViews();
    return { ok: true, id: artefact.id, sha256: artefact.sha256, status: artefact.status };
  }

  const rl = await rateLimit("upload", actor.id);
  if (!rl.success) {
    return { ok: false, message: "Too many uploads. Slow down and try again in a minute." };
  }

  const result = await uploadFileToStorage(file, actor.id);
  if (!result.ok) {
    await writeAudit({
      actorId: actor.id,
      actorLabel: actor.email ?? actor.id,
      action: `Upload rejected · ${parsed.data.name} · ${result.reason}`,
      entityType: "Artefact",
    });
    return { ok: false, message: result.reason };
  }

  const a = result.artefact;

  const artefact = await prisma.artefact.create({
    data: {
      userId: actor.id,
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
        create: await buildInitialChecks(a.sha256),
      },
    },
  });

  console.info(
    `[artefacts] persisted id=${artefact.id} user=${actor.id} key=${a.storageKey} status=${artefact.status}`,
  );

  await writeAudit({
    actorId: actor.id,
    actorLabel: actor.email ?? actor.id,
    action: `Uploaded · ${parsed.data.name}`,
    entityType: "Artefact",
    entityId: artefact.id,
    metadata: { sha256: a.sha256, size: a.size, mime: a.mimeType },
  });

  revalidateArtefactViews();
  return { ok: true, id: artefact.id, sha256: a.sha256, status: artefact.status };
}

export async function resubmitArtefactForUser(
  actor: UploadActor,
  artefactId: string,
  formData: FormData,
): Promise<ArtefactActionResult> {
  if (!DB_ENABLED || !prisma) {
    return { ok: false, message: "Database not configured." };
  }

  const existing = await prisma.artefact.findUnique({ where: { id: artefactId } });
  if (!existing || existing.userId !== actor.id) {
    return { ok: false, message: "Artefact not found." };
  }
  if (existing.status !== "REJECTED") {
    return { ok: false, message: "Only rejected artefacts can be resubmitted." };
  }

  const file = formData.get("file");
  if (!(file instanceof File)) {
    return { ok: false, message: "No file received." };
  }

  const rl = await rateLimit("upload", actor.id);
  if (!rl.success) {
    return { ok: false, message: "Too many uploads. Slow down and try again in a minute." };
  }

  const result = await uploadFileToStorage(file, actor.id);
  if (!result.ok) {
    return { ok: false, message: result.reason };
  }
  const a = result.artefact;

  await prisma.$transaction([
    prisma.artefactCheck.deleteMany({ where: { artefactId } }),
    prisma.artefact.update({
      where: { id: artefactId },
      data: {
        status: "PENDING_REVIEW",
        fileName: a.fileName,
        fileSize: a.size,
        mimeType: a.mimeType,
        storageKey: a.storageKey,
        sha256: a.sha256,
        uploadedAt: new Date(),
        validatedAt: null,
        rejectionReason: null,
        checks: { create: await buildInitialChecks(a.sha256) },
      },
    }),
  ]);

  await writeAudit({
    actorId: actor.id,
    actorLabel: actor.email ?? actor.id,
    action: `Resubmitted after rejection · ${existing.name}`,
    entityType: "Artefact",
    entityId: artefactId,
    metadata: { archivedRejectionReason: existing.rejectionReason ?? undefined, sha256: a.sha256 },
  });

  revalidateArtefactViews();
  return { ok: true, id: artefactId, sha256: a.sha256, status: "PENDING_REVIEW" };
}

function revalidateArtefactViews() {
  revalidatePath("/portal/entrepreneur");
  revalidatePath("/portal/entrepreneur/esg");
  revalidatePath("/portal/funder");
  revalidatePath("/portal/funder/vault");
  revalidatePath("/portal/funder/pipeline");
  revalidatePath("/portal/funder/impact");
  revalidatePath("/portal/corporate");
  revalidatePath("/settings");
  revalidatePath("/admin");
}

async function buildInitialChecks(sha256: string) {
  const base = [
    { name: "File integrity (SHA-256)", status: "PASS" as const },
    { name: "MIME & magic-byte match", status: "PASS" as const },
    { name: "Size & format limits", status: "PASS" as const },
  ];

  let avRow:
    | { name: string; status: "PASS" | "FAIL" | "WARN" | "PENDING"; detail?: string }
    | null = null;
  try {
    const av = await checkBySha256(sha256);
    if (av.status !== "NOT_CONFIGURED") {
      avRow =
        av.status === "CLEAN"
          ? { name: "Antivirus scan (VirusTotal)", status: "PASS", detail: `${av.total ?? 0} engines · ${av.message}` }
          : av.status === "INFECTED"
            ? { name: "Antivirus scan (VirusTotal)", status: "FAIL", detail: av.message }
            : av.status === "PENDING"
              ? { name: "Antivirus scan (VirusTotal)", status: "PENDING", detail: av.message }
              : { name: "Antivirus scan", status: "WARN", detail: av.message };
    }
  } catch {
    avRow = { name: "Antivirus scan", status: "PENDING" };
  }

  return [...base, ...(avRow ? [avRow] : []), { name: "Cross-check against profile", status: "PENDING" as const }];
}
