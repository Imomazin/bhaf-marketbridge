import { prisma, DB_ENABLED } from "@/lib/db";

export type ArtefactReviewFilter = "ALL" | "PENDING_REVIEW" | "VALIDATED" | "REJECTED" | "FLAGGED";

export interface PendingArtefactRow {
  id: string;
  name: string;
  category: string;
  status: string;
  rejectionReason?: string | null;
  uploadedAt: Date;
  userName: string;
  userEmail: string;
  checksPassed: number;
  checksTotal: number;
}

export async function listArtefactsForReview(
  filter: ArtefactReviewFilter = "ALL",
): Promise<PendingArtefactRow[]> {
  if (!DB_ENABLED || !prisma) return [];

  const whereClause =
    filter === "ALL"
      ? { user: { deletedAt: null } }
      : filter === "PENDING_REVIEW"
      ? { status: { in: ["PENDING_REVIEW", "UNDER_REVIEW"] as const }, user: { deletedAt: null } }
      : { status: filter as any, user: { deletedAt: null } };

  const rows = await prisma.artefact.findMany({
    where: whereClause,
    include: { user: { select: { name: true, email: true } }, checks: true },
    orderBy: { uploadedAt: "desc" },
  });

  return rows.map((a) => ({
    id: a.id,
    name: a.name,
    category: a.category,
    status: a.status,
    rejectionReason: a.rejectionReason,
    uploadedAt: a.uploadedAt,
    userName: a.user.name ?? a.user.email,
    userEmail: a.user.email,
    checksPassed: a.checks.filter((c) => c.status === "PASS").length,
    checksTotal: a.checks.length,
  }));
}

export async function listPendingArtefacts(): Promise<PendingArtefactRow[]> {
  return listArtefactsForReview("PENDING_REVIEW");
}

export async function getArtefactForReview(id: string) {
  if (!DB_ENABLED || !prisma) return null;
  return prisma.artefact.findUnique({
    where: { id },
    include: {
      user: { select: { id: true, name: true, email: true } },
      checks: true,
      reviews: { include: { reviewer: { select: { name: true, email: true } } }, orderBy: { reviewedAt: "desc" } },
    },
  });
}
