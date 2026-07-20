import { prisma, DB_ENABLED } from "@/lib/db";
import { getDemoArtefacts, getDemoEntrepreneurProfile, getDemoListings } from "@/lib/demoState";

export interface OnboardingState {
  hasProfile: boolean;
  hasFirstArtefact: boolean;
  hasFirstListing: boolean;
  emailVerified: boolean;
  percent: number;
}

function hasCoreProfileFields(profile: {
  businessName?: string | null;
  country?: string | null;
  sector?: string | null;
}) {
  return Boolean(
    profile.businessName?.trim() &&
      profile.country?.trim() &&
      profile.sector?.trim(),
  );
}

function isEntrepreneurProfileComplete(profile: {
  businessName?: string | null;
  country?: string | null;
  sector?: string | null;
  description?: string | null;
  fundingNeed?: string | null;
  yearFounded?: number | null;
  womenSupported?: number | null;
  jobsCreated?: number | null;
}) {
  if (!hasCoreProfileFields(profile)) return false;

  const detailSignals = [
    Boolean(profile.description?.trim()),
    Boolean(profile.fundingNeed?.trim()),
    profile.yearFounded != null,
    (profile.womenSupported ?? 0) > 0,
    (profile.jobsCreated ?? 0) > 0,
  ];

  return detailSignals.filter(Boolean).length >= 2;
}

export async function loadOnboardingState(userId: string, role: string): Promise<OnboardingState> {
  if (!DB_ENABLED || !prisma) {
    if (role !== "ENTREPRENEUR") {
      return { hasProfile: true, hasFirstArtefact: true, hasFirstListing: true, emailVerified: true, percent: 100 };
    }
    if (userId === "demo-entrepreneur") {
      return { hasProfile: true, hasFirstArtefact: true, hasFirstListing: true, emailVerified: true, percent: 100 };
    }

    const [profile, artefacts, listings] = await Promise.all([
      getDemoEntrepreneurProfile(userId),
      getDemoArtefacts(userId),
      getDemoListings(userId),
    ]);

    const hasProfile = isEntrepreneurProfileComplete(profile ?? {});
    const hasFirstArtefact = artefacts.length > 0;
    const hasFirstListing = listings.length > 0;
    const emailVerified = true;
    const steps = [hasProfile, hasFirstArtefact, hasFirstListing, emailVerified];
    const completed = steps.filter(Boolean).length;
    const percent = Math.round((completed / steps.length) * 100);

    return { hasProfile, hasFirstArtefact, hasFirstListing, emailVerified, percent };
  }

  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: {
      emailVerified: true,
      entrepreneurProfile: {
        select: {
          businessName: true,
          country: true,
          sector: true,
          description: true,
          fundingNeed: true,
          yearFounded: true,
          womenSupported: true,
          jobsCreated: true,
          products: { select: { id: true } },
        },
      },
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
      ? isEntrepreneurProfileComplete(user.entrepreneurProfile ?? {})
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
