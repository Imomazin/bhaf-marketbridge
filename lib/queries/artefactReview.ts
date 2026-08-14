import { prisma, DB_ENABLED } from "@/lib/db";

export interface PendingArtefactRow {
  id: string;
  name: string;
  category: string;
  uploadedAt: Date;
  userName: string;
  userEmail: string;
  checksPassed: number;
  checksTotal: number;
}

export async function listPendingArtefacts(): Promise<PendingArtefactRow[]> {
  if (!DB_ENABLED || !prisma) return [];

  const rows = await prisma.artefact.findMany({
    where: { status: { in: ["PENDING_REVIEW", "UNDER_REVIEW"] }, user: { deletedAt: null } },
    include: { user: { select: { name: true, email: true } }, checks: true },
    orderBy: { uploadedAt: "desc" },
  });

  return rows.map((a) => ({
    id: a.id,
    name: a.name,
    category: a.category,
    uploadedAt: a.uploadedAt,
    userName: a.user.name ?? a.user.email,
    userEmail: a.user.email,
    checksPassed: a.checks.filter((c) => c.status === "PASS").length,
    checksTotal: a.checks.length,
  }));
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
