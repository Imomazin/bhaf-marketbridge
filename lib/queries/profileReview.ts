import { prisma, DB_ENABLED } from "@/lib/db";

export type ProfileRole = "entrepreneur" | "funder" | "corporate";

export type ProfileReviewFilter = "ALL" | "PENDING" | "PARTIALLY_APPROVED" | "APPROVED" | "REJECTED";

export interface ProfileReviewRow {
  role: ProfileRole;
  profileId: string;
  userId: string;
  name: string;
  email: string;
  orgLabel: string;
  status: "PENDING" | "PARTIALLY_APPROVED" | "APPROVED" | "REJECTED";
  rejectionReason?: string | null;
  verified: boolean;
  submittedAt: Date;
}

export async function listProfilesForReview(
  filter: ProfileReviewFilter = "ALL",
): Promise<ProfileReviewRow[]> {
  if (!DB_ENABLED || !prisma) return [];

  const statusFilter = filter === "ALL" ? undefined : filter;

  const [entrepreneurs, funders, corporates] = await Promise.all([
    prisma.entrepreneurProfile.findMany({
      where: {
        ...(statusFilter ? { status: statusFilter } : {}),
        user: { deletedAt: null },
      },
      include: { user: { select: { id: true, name: true, email: true } } },
      orderBy: { updatedAt: "desc" },
    }),
    prisma.funderProfile.findMany({
      where: {
        ...(statusFilter ? { status: statusFilter } : {}),
        user: { deletedAt: null },
      },
      include: { user: { select: { id: true, name: true, email: true } } },
      orderBy: { updatedAt: "desc" },
    }),
    prisma.corporateProfile.findMany({
      where: {
        ...(statusFilter ? { status: statusFilter } : {}),
        user: { deletedAt: null },
      },
      include: { user: { select: { id: true, name: true, email: true } } },
      orderBy: { updatedAt: "desc" },
    }),
  ]);

  const rows: ProfileReviewRow[] = [
    ...entrepreneurs.map((p) => ({
      role: "entrepreneur" as const,
      profileId: p.id,
      userId: p.userId,
      name: p.user.name ?? p.user.email,
      email: p.user.email,
      orgLabel: p.businessName,
      status: p.status,
      rejectionReason: p.rejectionReason,
      verified: p.verified,
      submittedAt: p.updatedAt,
    })),
    ...funders.map((p) => ({
      role: "funder" as const,
      profileId: p.id,
      userId: p.userId,
      name: p.user.name ?? p.user.email,
      email: p.user.email,
      orgLabel: p.orgName,
      status: p.status,
      rejectionReason: p.rejectionReason,
      verified: p.verified,
      submittedAt: p.updatedAt,
    })),
    ...corporates.map((p) => ({
      role: "corporate" as const,
      profileId: p.id,
      userId: p.userId,
      name: p.user.name ?? p.user.email,
      email: p.user.email,
      orgLabel: p.orgName,
      status: p.status,
      rejectionReason: p.rejectionReason,
      verified: p.verified,
      submittedAt: p.updatedAt,
    })),
  ];

  return rows.sort((a, b) => b.submittedAt.getTime() - a.submittedAt.getTime());
}

export async function listPendingProfiles(): Promise<ProfileReviewRow[]> {
  return listProfilesForReview("PENDING");
}

export async function countPendingProfiles(): Promise<number> {
  if (!DB_ENABLED || !prisma) return 0;
  const [a, b, c] = await Promise.all([
    prisma.entrepreneurProfile.count({
      where: { status: { in: ["PENDING", "PARTIALLY_APPROVED"] }, user: { deletedAt: null } },
    }),
    prisma.funderProfile.count({
      where: { status: { in: ["PENDING", "PARTIALLY_APPROVED"] }, user: { deletedAt: null } },
    }),
    prisma.corporateProfile.count({
      where: { status: { in: ["PENDING", "PARTIALLY_APPROVED"] }, user: { deletedAt: null } },
    }),
  ]);
  return a + b + c;
}

export async function getProfileForReview(role: ProfileRole, profileId: string) {
  if (!DB_ENABLED || !prisma) return null;

  const userSelect = {
    select: { id: true, name: true, email: true, createdAt: true, kycFullName: true, kycCountry: true },
  } as const;

  if (role === "entrepreneur") {
    return prisma.entrepreneurProfile.findUnique({
      where: { id: profileId },
      include: { user: userSelect, products: true, certifications: true, reviewedBy: { select: { name: true, email: true } } },
    });
  }
  if (role === "funder") {
    return prisma.funderProfile.findUnique({
      where: { id: profileId },
      include: { user: userSelect, reviewedBy: { select: { name: true, email: true } } },
    });
  }
  return prisma.corporateProfile.findUnique({
    where: { id: profileId },
    include: { user: userSelect, reviewedBy: { select: { name: true, email: true } } },
  });
}
