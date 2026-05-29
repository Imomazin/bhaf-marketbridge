import { prisma, DB_ENABLED } from "@/lib/db";

export async function loadMyCohorts(userId: string) {
  if (!DB_ENABLED || !prisma) return [];
  return await prisma.cohortMembership.findMany({
    where: { userId },
    include: { cohort: true },
    orderBy: { joinedAt: "desc" },
    take: 10,
  });
}
