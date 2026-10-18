"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";

import { prisma, DB_ENABLED } from "@/lib/db";
import { uploadFileToStorage } from "@/lib/storage";
import { writeAudit } from "@/lib/audit";
import { rateLimit } from "@/lib/ratelimit";
import { checkBySha256 } from "@/lib/integrations/virusTotal";
import { saveDemoArtefact } from "@/lib/demoState";
import { syncEntrepreneurReadiness } from "@/lib/readinessSync";
import { verifyDocumentWithAI } from "@/lib/ai/documentVerifier";
import { sendEmail } from "@/lib/email";
import { loadOnboardingState } from "@/lib/queries/onboarding";

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
  const fileBuffer = Buffer.from(await file.arrayBuffer());

  // Fetch profile context for AI verification cross-checks
  const user = await prisma.user.findUnique({
    where: { id: actor.id },
    include: {
      entrepreneurProfile: true,
      corporateProfile: true,
      funderProfile: true,
    },
  });

  const businessName =
    user?.entrepreneurProfile?.businessName ??
    user?.corporateProfile?.orgName ??
    user?.funderProfile?.orgName ??
    null;

  // Run AI automated verification
  const aiResult = await verifyDocumentWithAI({
    buffer: fileBuffer,
    mimeType: a.mimeType,
    fileName: a.fileName,
    category: parsed.data.category,
    profileContext: {
      businessName,
      founderName: user?.name,
      country: user?.entrepreneurProfile?.country,
      sector: user?.entrepreneurProfile?.sector,
    },
  });

  const isApprovedByAI = aiResult.decision === "APPROVE";
  const artefactStatus = isApprovedByAI 
    ? "VALIDATED" 
    : (aiResult.decision === "FLAG" ? "PENDING_REVIEW" : "REJECTED");

  const initialChecks = await buildInitialChecks(a.sha256);
  const aiChecksToCreate = [
    ...initialChecks,
    ...aiResult.checks.map((c) => ({
      name: c.name,
      status: c.status,
      detail: c.detail,
    })),
  ];

  const artefact = await prisma.artefact.create({
    data: {
      userId: actor.id,
      name: parsed.data.name,
      category: parsed.data.category,
      required: parsed.data.required,
      status: artefactStatus,
      fileName: a.fileName,
      fileSize: a.size,
      mimeType: a.mimeType,
      storageKey: a.storageKey,
      sha256: a.sha256,
      uploadedAt: new Date(),
      validatedAt: isApprovedByAI ? new Date() : null,
      rejectionReason: !isApprovedByAI ? aiResult.reason : null,
      checks: {
        create: aiChecksToCreate,
      },
    },
  });

  // Automatically update profile status based on onboarding progress
  if (user) {
    const onboarding = await loadOnboardingState(user.id, user.role);
    const isFullyOnboarded = onboarding.percent === 100;
    
    if (isApprovedByAI) {
      const newStatus = isFullyOnboarded ? "APPROVED" : "PARTIALLY_APPROVED";

      if (user.role === "ENTREPRENEUR" && user.entrepreneurProfile) {
        if (user.entrepreneurProfile.status !== "APPROVED" || newStatus === "APPROVED") {
          await prisma.entrepreneurProfile.update({
            where: { userId: actor.id },
            data: { status: newStatus, verified: true, rejectionReason: null },
          });
        }
      } else if (user.role === "FUNDER" && user.funderProfile) {
        if (user.funderProfile.status !== "APPROVED" || newStatus === "APPROVED") {
          await prisma.funderProfile.update({
            where: { userId: actor.id },
            data: { status: newStatus, verified: true, rejectionReason: null },
          });
        }
      } else if (user.role === "CORPORATE" && user.corporateProfile) {
        if (user.corporateProfile.status !== "APPROVED" || newStatus === "APPROVED") {
          await prisma.corporateProfile.update({
            where: { userId: actor.id },
            data: { status: newStatus, verified: true, rejectionReason: null },
          });
        }
      }

      const titleMsg = isFullyOnboarded ? `Profile fully approved` : `Document AI-Verified: ${parsed.data.name}`;
      const bodyMsg = isFullyOnboarded 
        ? `Your onboarding is 100% complete. Your profile is fully approved by AI and active on the platform.`
        : `Your document passed automated verification. Your profile is now partially approved with full platform access.`;

      await prisma.notification.create({
        data: {
          userId: actor.id,
          kind: "ARTEFACT_VALIDATED",
          title: titleMsg,
          body: bodyMsg,
          link: `/portal/${user.role.toLowerCase()}`,
        },
      });

      if (user.email) {
        if (isFullyOnboarded) {
          await sendEmail({
            to: user.email,
            subject: "Your BHAF MarketBridge Profile is Approved!",
            body: `Hi there,\n\nGreat news! Your recent document upload was successfully verified by our AI system, and your onboarding is now 100% complete.\n\nYour profile is fully approved and active on the platform. You can now access all features.\n\nBest,\nBHAF MarketBridge Team`,
          });
        } else {
          await sendEmail({
            to: user.email,
            subject: "Your Document is Verified!",
            body: `Hi there,\n\nGreat news! Your document "${parsed.data.name}" passed our automated verification.\n\nYour profile is now partially approved and active on the platform. You have full platform access while our admins conduct a final review.\n\nBest,\nBHAF MarketBridge Team`,
          });
        }
      }
    } else {
      // AI Flagged / Rejected
      if (user.role === "ENTREPRENEUR" && user.entrepreneurProfile && user.entrepreneurProfile.status !== "APPROVED") {
        await prisma.entrepreneurProfile.update({
          where: { userId: actor.id },
          data: { status: "REJECTED", rejectionReason: aiResult.reason, verified: false },
        });
      } else if (user.role === "FUNDER" && user.funderProfile && user.funderProfile.status !== "APPROVED") {
        await prisma.funderProfile.update({
          where: { userId: actor.id },
          data: { status: "REJECTED", rejectionReason: aiResult.reason, verified: false },
        });
      } else if (user.role === "CORPORATE" && user.corporateProfile && user.corporateProfile.status !== "APPROVED") {
        await prisma.corporateProfile.update({
          where: { userId: actor.id },
          data: { status: "REJECTED", rejectionReason: aiResult.reason, verified: false },
        });
      }

      await prisma.notification.create({
        data: {
          userId: actor.id,
          kind: "ARTEFACT_REJECTED",
          title: `Document rejected: ${parsed.data.name}`,
          body: `AI verification issue: ${aiResult.reason}`,
          link: `/portal/${user.role.toLowerCase()}`,
        },
      });

      // Send instant rejection email to the user
      if (user.email) {
        await sendEmail({
          to: user.email,
          subject: `Action Required: Document "${parsed.data.name}" could not be verified`,
          body: `Hi there,\n\nWe couldn't verify your document "${parsed.data.name}".\n\nAI Reason: ${aiResult.reason}\n\nPlease check your compliance vault and try uploading a clearer version.`,
        });
      }
    }
  }

  console.info(
    `[artefacts] persisted id=${artefact.id} user=${actor.id} key=${a.storageKey} aiDecision=${aiResult.decision} status=${artefact.status}`,
  );

  await writeAudit({
    actorId: actor.id,
    actorLabel: actor.email ?? actor.id,
    action: `Uploaded & AI Evaluated (${aiResult.decision}) · ${parsed.data.name}`,
    entityType: "Artefact",
    entityId: artefact.id,
    metadata: {
      sha256: a.sha256,
      size: a.size,
      mime: a.mimeType,
      aiDecision: aiResult.decision,
      aiReason: aiResult.reason,
    },
  });

  await syncEntrepreneurReadiness(actor.id);

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
  if (existing.status !== "REJECTED" && existing.status !== "FLAGGED" && existing.status !== "PENDING_REVIEW" && existing.status !== "VALIDATED") {
    return { ok: false, message: "This artefact cannot be replaced in its current status." };
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
  const fileBuffer = Buffer.from(await file.arrayBuffer());

  const user = await prisma.user.findUnique({
    where: { id: actor.id },
    include: { entrepreneurProfile: true, corporateProfile: true, funderProfile: true },
  });

  const businessName =
    user?.entrepreneurProfile?.businessName ??
    user?.corporateProfile?.orgName ??
    user?.funderProfile?.orgName ??
    null;

  // Run AI automated verification on resubmission
  const aiResult = await verifyDocumentWithAI({
    buffer: fileBuffer,
    mimeType: a.mimeType,
    fileName: a.fileName,
    category: existing.category,
    profileContext: {
      businessName,
      founderName: user?.name,
      country: user?.entrepreneurProfile?.country,
      sector: user?.entrepreneurProfile?.sector,
    },
  });

  const isApprovedByAI = aiResult.decision === "APPROVE";
  const nextStatus = isApprovedByAI ? "VALIDATED" : "REJECTED";

  const initialChecks = await buildInitialChecks(a.sha256);
  const aiChecksToCreate = [
    ...initialChecks,
    ...aiResult.checks.map((c) => ({
      name: c.name,
      status: c.status,
      detail: c.detail,
    })),
  ];

  await prisma.$transaction([
    prisma.artefactCheck.deleteMany({ where: { artefactId } }),
    prisma.artefact.update({
      where: { id: artefactId },
      data: {
        status: nextStatus,
        fileName: a.fileName,
        fileSize: a.size,
        mimeType: a.mimeType,
        storageKey: a.storageKey,
        sha256: a.sha256,
        uploadedAt: new Date(),
        validatedAt: isApprovedByAI ? new Date() : null,
        rejectionReason: !isApprovedByAI ? aiResult.reason : null,
        checks: { create: aiChecksToCreate },
      },
    }),
  ]);

  if (user) {
    const onboarding = await loadOnboardingState(user.id, user.role);
    const isFullyOnboarded = onboarding.percent === 100;
    
    if (isApprovedByAI) {
      const newStatus = isFullyOnboarded ? "APPROVED" : "PARTIALLY_APPROVED";

      if (user.role === "ENTREPRENEUR" && user.entrepreneurProfile) {
        if (user.entrepreneurProfile.status !== "APPROVED" || newStatus === "APPROVED") {
          await prisma.entrepreneurProfile.update({
            where: { userId: actor.id },
            data: { status: newStatus, verified: true, rejectionReason: null },
          });
        }
      } else if (user.role === "FUNDER" && user.funderProfile) {
        if (user.funderProfile.status !== "APPROVED" || newStatus === "APPROVED") {
          await prisma.funderProfile.update({
            where: { userId: actor.id },
            data: { status: newStatus, verified: true, rejectionReason: null },
          });
        }
      } else if (user.role === "CORPORATE" && user.corporateProfile) {
        if (user.corporateProfile.status !== "APPROVED" || newStatus === "APPROVED") {
          await prisma.corporateProfile.update({
            where: { userId: actor.id },
            data: { status: newStatus, verified: true, rejectionReason: null },
          });
        }
      }

      const titleMsg = isFullyOnboarded ? `Profile fully approved` : `Document AI-Verified: ${existing.name}`;
      const bodyMsg = isFullyOnboarded 
        ? `Your onboarding is 100% complete. Your profile is fully approved by AI and active on the platform.`
        : `Your document passed automated verification. Your profile is now partially approved with full platform access.`;

      await prisma.notification.create({
        data: {
          userId: actor.id,
          kind: "ARTEFACT_VALIDATED",
          title: titleMsg,
          body: bodyMsg,
          link: `/portal/${user.role.toLowerCase()}`,
        },
      });

      if (user.email) {
        if (isFullyOnboarded) {
          await sendEmail({
            to: user.email,
            subject: "Your BHAF MarketBridge Profile is Approved!",
            body: `Hi there,\n\nGreat news! Your resubmitted document was successfully verified by our AI system, and your onboarding is now 100% complete.\n\nYour profile is fully approved and active on the platform. You can now access all features.\n\nBest,\nBHAF MarketBridge Team`,
          });
        } else {
          await sendEmail({
            to: user.email,
            subject: "Your Resubmitted Document is Verified!",
            body: `Hi there,\n\nGreat news! Your resubmitted document "${existing.name}" passed our automated verification.\n\nYour profile is now partially approved and active on the platform. You have full platform access while our admins conduct a final review.\n\nBest,\nBHAF MarketBridge Team`,
          });
        }
      }
    } else {
      // AI Flagged / Rejected
      if (user.role === "ENTREPRENEUR" && user.entrepreneurProfile && user.entrepreneurProfile.status !== "APPROVED") {
        await prisma.entrepreneurProfile.update({
          where: { userId: actor.id },
          data: { status: "REJECTED", rejectionReason: aiResult.reason, verified: false },
        });
      } else if (user.role === "FUNDER" && user.funderProfile && user.funderProfile.status !== "APPROVED") {
        await prisma.funderProfile.update({
          where: { userId: actor.id },
          data: { status: "REJECTED", rejectionReason: aiResult.reason, verified: false },
        });
      } else if (user.role === "CORPORATE" && user.corporateProfile && user.corporateProfile.status !== "APPROVED") {
        await prisma.corporateProfile.update({
          where: { userId: actor.id },
          data: { status: "REJECTED", rejectionReason: aiResult.reason, verified: false },
        });
      }

      await prisma.notification.create({
        data: {
          userId: actor.id,
          kind: "ARTEFACT_REJECTED",
          title: `Document rejected: ${existing.name}`,
          body: `AI verification issue: ${aiResult.reason}`,
          link: `/portal/${user.role.toLowerCase()}`,
        },
      });

      if (user.email) {
        await sendEmail({
          to: user.email,
          subject: `Action Required: Resubmitted document "${existing.name}" could not be verified`,
          body: `Hi there,\n\nWe couldn't verify your resubmitted document "${existing.name}".\n\nAI Reason: ${aiResult.reason}\n\nPlease check your compliance vault and try uploading a clearer version.`,
        });
      }
    }
  }

  await writeAudit({
    actorId: actor.id,
    actorLabel: actor.email ?? actor.id,
    action: `Resubmitted & AI Evaluated (${aiResult.decision}) · ${existing.name}`,
    entityType: "Artefact",
    entityId: artefactId,
    metadata: {
      archivedRejectionReason: existing.rejectionReason ?? undefined,
      sha256: a.sha256,
      aiDecision: aiResult.decision,
      aiReason: aiResult.reason,
    },
  });

  await syncEntrepreneurReadiness(actor.id);

  revalidateArtefactViews();
  return { ok: true, id: artefactId, sha256: a.sha256, status: nextStatus };
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
