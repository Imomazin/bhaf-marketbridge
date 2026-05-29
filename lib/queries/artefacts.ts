import { prisma, DB_ENABLED } from "@/lib/db";
import {
  entrepreneurArtefacts as mockEntrepreneur,
  funderArtefacts as mockFunder,
  corporateArtefacts as mockCorporate,
  type Artefact,
  type ArtefactStatus,
  type ArtefactCheck,
} from "@/data/artefacts";
import type { RoleId } from "@/data/roles";

const STATUS_MAP: Record<string, ArtefactStatus> = {
  PENDING_UPLOAD: "pending_upload",
  PENDING_REVIEW: "pending_review",
  UNDER_REVIEW: "under_review",
  VALIDATED: "validated",
  REJECTED: "rejected",
  EXPIRES_SOON: "expires_soon",
  EXPIRED: "expired",
  FLAGGED: "flagged",
  QUARANTINED: "flagged",
};

const CHECK_STATUS_MAP: Record<string, ArtefactCheck["status"]> = {
  PASS: "pass",
  FAIL: "fail",
  WARN: "warn",
  PENDING: "pending",
};

export async function loadMyArtefacts(
  userId: string,
  role: RoleId,
): Promise<{ artefacts: Artefact[]; isReal: boolean }> {
  const fallback: Artefact[] =
    role === "funder" ? mockFunder : role === "corporate" ? mockCorporate : mockEntrepreneur;

  if (!DB_ENABLED || !prisma) {
    return { artefacts: fallback, isReal: false };
  }

  try {
    const rows = await prisma.artefact.findMany({
      where: { userId },
      include: { checks: true, reviews: true },
      orderBy: { uploadedAt: "desc" },
    });

    if (rows.length === 0) {
      return { artefacts: fallback, isReal: false };
    }

    const real: Artefact[] = rows.map((r) => ({
      id: r.id,
      name: r.name,
      description: r.description ?? "",
      category: r.category,
      required: r.required,
      status: STATUS_MAP[r.status] ?? "pending_review",
      fileName: r.fileName ?? undefined,
      fileSize: r.fileSize ? `${(r.fileSize / 1024).toFixed(0)} KB` : undefined,
      uploadedAt: r.uploadedAt.toISOString().slice(0, 10),
      validatedAt: r.validatedAt?.toISOString().slice(0, 10),
      expiresAt: r.expiresAt?.toISOString().slice(0, 10),
      rejectionReason: r.rejectionReason ?? undefined,
      hash: r.sha256 ?? undefined,
      requiresDualSignOff: r.requiresDualSignOff,
      checks: r.checks.map((c) => ({
        name: c.name,
        status: CHECK_STATUS_MAP[c.status] ?? "pending",
        detail: c.detail ?? undefined,
      })),
    }));

    return { artefacts: real, isReal: true };
  } catch (err) {
    console.error("[artefacts] DB load failed", err);
    return { artefacts: fallback, isReal: false };
  }
}
