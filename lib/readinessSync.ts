import { prisma, DB_ENABLED } from "@/lib/db";
import { getEntrepreneurReadinessLevel } from "@/lib/queries/onboarding";

export async function syncEntrepreneurReadiness(userId: string) {
  if (!DB_ENABLED || !prisma) return;

  const profile = await prisma.entrepreneurProfile.findUnique({
    where: { userId },
    include: {
      user: {
        include: {
          artefacts: true,
          listings: true,
        },
      },
    },
  });

  if (!profile) return;

  const hasProfile = Boolean(profile.businessName && profile.sector && profile.country);
  const hasEsgActivity = Boolean(profile.esgActivity && profile.esgActivity.trim().length > 20);
  const hasArtefact = profile.user.artefacts.length > 0;
  const hasListing = profile.user.listings.length > 0;

  const score = [hasProfile, hasEsgActivity, hasArtefact, hasListing].filter(Boolean).length;
  
  const levelMap = {
    0: "EMERGING",
    1: "DEVELOPING",
    2: "MARKET_READY",
    3: "FUNDING_READY",
    4: "FUNDING_READY"
  } as const;

  const newLevel = levelMap[score as 0|1|2|3|4];

  if (profile.readinessLevel !== newLevel) {
    await prisma.entrepreneurProfile.update({
      where: { id: profile.id },
      data: { readinessLevel: newLevel },
    });
  }
}
