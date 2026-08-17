import { prisma, DB_ENABLED } from "@/lib/db";

export async function loadActiveRfps(filters?: { q?: string; category?: string }) {
  if (!DB_ENABLED || !prisma) return { rfps: [] };

  const where: any = {
    status: "OPEN",
    owner: {
      corporateProfile: {
        status: "APPROVED"
      }
    }
  };

  if (filters?.q) {
    where.OR = [
      { title: { contains: filters.q, mode: "insensitive" } },
      { description: { contains: filters.q, mode: "insensitive" } },
    ];
  }
  
  if (filters?.category && filters.category !== "All categories") {
    where.category = filters.category;
  }

  const rfps = await prisma.rfp.findMany({
    where,
    orderBy: { createdAt: "desc" },
    include: { owner: { select: { name: true } } },
  });

  return { rfps };
}

export async function getUserAppliedRfpIds(userId: string) {
  if (!DB_ENABLED || !prisma) return new Set<string>();

  const responses = await prisma.rfpResponse.findMany({
    where: { responderId: userId },
    select: { rfpId: true },
  });

  return new Set(responses.map((r) => r.rfpId));
}
