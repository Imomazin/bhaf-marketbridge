import { prisma, DB_ENABLED } from "@/lib/db";

export type ProfileRole = "entrepreneur" | "funder" | "corporate";

export interface PendingProfileRow {
  role: ProfileRole;
  profileId: string;
  userId: string;
  name: string;
  email: string;
  orgLabel: string;
  submittedAt: Date;
}

export async function listPendingProfiles(): Promise<PendingProfileRow[]> {
  if (!DB_ENABLED || !prisma) return [];

  const [entrepreneurs, funders, corporates] = await Promise.all([
    prisma.entrepreneurProfile.findMany({
      where: { status: "PENDING", user: { deletedAt: null } },
      include: { user: { select: { id: true, name: true, email: true } } },
      orderBy: { updatedAt: "desc" },
    }),
    prisma.funderProfile.findMany({
      where: { status: "PENDING", user: { deletedAt: null } },
      include: { user: { select: { id: true, name: true, email: true } } },
      orderBy: { updatedAt: "desc" },
    }),
    prisma.corporateProfile.findMany({
      where: { status: "PENDING", user: { deletedAt: null } },
      include: { user: { select: { id: true, name: true, email: true } } },
      orderBy: { updatedAt: "desc" },
    }),
  ]);

  const rows: PendingProfileRow[] = [
    ...entrepreneurs.map((p) => ({
      role: "entrepreneur" as const,
      profileId: p.id,
      userId: p.userId,
      name: p.user.name ?? p.user.email,
      email: p.user.email,
      orgLabel: p.businessName,
      submittedAt: p.updatedAt,
    })),
    ...funders.map((p) => ({
      role: "funder" as const,
      profileId: p.id,
      userId: p.userId,
      name: p.user.name ?? p.user.email,
      email: p.user.email,
      orgLabel: p.orgName,
      submittedAt: p.updatedAt,
    })),
    ...corporates.map((p) => ({
      role: "corporate" as const,
      profileId: p.id,
      userId: p.userId,
      name: p.user.name ?? p.user.email,
      email: p.user.email,
      orgLabel: p.orgName,
      submittedAt: p.updatedAt,
    })),
  ];

  return rows.sort((a, b) => b.submittedAt.getTime() - a.submittedAt.getTime());
}

export async function countPendingProfiles(): Promise<number> {
  if (!DB_ENABLED || !prisma) return 0;
  const [a, b, c] = await Promise.all([
    prisma.entrepreneurProfile.count({ where: { status: "PENDING", user: { deletedAt: null } } }),
    prisma.funderProfile.count({ where: { status: "PENDING", user: { deletedAt: null } } }),
    prisma.corporateProfile.count({ where: { status: "PENDING", user: { deletedAt: null } } }),
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
