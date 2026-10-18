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

export async function getOpportunityForAdmin(
  id: string,
  params?: {
    search?: string;
    status?: string;
    page?: number;
    pageSize?: number;
  }
) {
  if (!DB_ENABLED || !prisma) return null;

  const page = params?.page ?? 1;
  const pageSize = params?.pageSize ?? 10;
  
  const whereFilter: any = { opportunityId: id };
  if (params?.status) {
    whereFilter.status = params.status;
  }
  if (params?.search) {
    whereFilter.user = {
      OR: [
        { name: { contains: params.search, mode: "insensitive" } },
        { email: { contains: params.search, mode: "insensitive" } },
      ],
    };
  }

  const opp = await prisma.opportunity.findUnique({
    where: { id },
  });

  if (!opp) return null;

  const totalApplications = await prisma.application.count({
    where: whereFilter,
  });

  const applications = await prisma.application.findMany({
    where: whereFilter,
    include: { user: { select: { id: true, name: true, email: true } } },
    orderBy: { createdAt: "desc" },
    skip: (page - 1) * pageSize,
    take: pageSize,
  });

  return {
    ...opp,
    applications,
    totalApplications,
    totalPages: Math.ceil(totalApplications / pageSize),
  };
}
