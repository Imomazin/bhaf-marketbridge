import { prisma, DB_ENABLED } from "@/lib/db";

export interface OnboardingState {
  hasProfile: boolean;
  hasFirstArtefact: boolean;
  hasFirstListing: boolean;
  emailVerified: boolean;
  percent: number;
}

export async function loadOnboardingState(userId: string, role: string): Promise<OnboardingState> {
  if (!DB_ENABLED || !prisma) {
    return { hasProfile: true, hasFirstArtefact: true, hasFirstListing: true, emailVerified: true, percent: 100 };
  }

  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: {
      emailVerified: true,
      entrepreneurProfile: { select: { description: true, products: { select: { id: true } } } },
      funderProfile: { select: { mandate: true } },
      corporateProfile: { select: { industry: true } },
      _count: {
        select: {
          artefacts: true,
          listings: true,
        },
      },
    },
  });

  if (!user) {
    return { hasProfile: false, hasFirstArtefact: false, hasFirstListing: false, emailVerified: false, percent: 0 };
  }

  const hasProfile =
    role === "ENTREPRENEUR"
      ? Boolean(user.entrepreneurProfile?.description && user.entrepreneurProfile.description.length > 20)
      : role === "FUNDER"
      ? Boolean(user.funderProfile?.mandate && user.funderProfile.mandate.length > 20)
      : role === "CORPORATE"
      ? Boolean(user.corporateProfile?.industry && user.corporateProfile.industry.length > 1)
      : true;

  const hasFirstArtefact = user._count.artefacts > 0;
  const hasFirstListing = role === "ENTREPRENEUR" ? user._count.listings > 0 : true;
  const emailVerified = Boolean(user.emailVerified);

  const steps = [hasProfile, hasFirstArtefact, hasFirstListing, emailVerified];
  const completed = steps.filter(Boolean).length;
  const percent = Math.round((completed / steps.length) * 100);

  return { hasProfile, hasFirstArtefact, hasFirstListing, emailVerified, percent };
}
