import { prisma, DB_ENABLED } from "@/lib/db";

export interface AdminOpportunityRow {
  id: string;
  title: string;
  organisation: string;
  type: string;
  published: boolean;
  deadline: Date | null;
  applicantCount: number;
  createdAt: Date;
}

export async function listOpportunitiesForAdmin(): Promise<AdminOpportunityRow[]> {
  if (!DB_ENABLED || !prisma) return [];

  const rows = await prisma.opportunity.findMany({
    include: { _count: { select: { applications: true } } },
    orderBy: { createdAt: "desc" },
  });

  return rows.map((o) => ({
    id: o.id,
    title: o.title,
    organisation: o.organisation,
    type: o.type,
    published: o.published,
    deadline: o.deadline,
    applicantCount: o._count.applications,
    createdAt: o.createdAt,
  }));
}

export async function getOpportunityForAdmin(id: string) {
  if (!DB_ENABLED || !prisma) return null;

  return prisma.opportunity.findUnique({
    where: { id },
    include: {
      applications: {
        include: { user: { select: { id: true, name: true, email: true } } },
        orderBy: { createdAt: "desc" },
      },
    },
  });
}
