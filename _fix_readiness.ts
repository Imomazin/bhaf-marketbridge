import { prisma } from "./lib/db";
import { getEntrepreneurReadinessLevel } from "./lib/queries/onboarding";

async function main() {
  if (!prisma) {
    console.error("Prisma client is null. Is DB configured?");
    return;
  }
  const profiles = await prisma.entrepreneurProfile.findMany({
    include: {
      user: {
        include: {
          artefacts: true,
          listings: true,
        },
      },
    },
  });

  for (const profile of profiles) {
    const hasProfile = Boolean(profile.businessName && profile.sector && profile.country);
    const hasEsgActivity = Boolean(profile.esgActivity && profile.esgActivity.trim().length > 20);
    const hasArtefact = profile.user.artefacts.length > 0;
    const hasListing = profile.user.listings.length > 0;

    const score = [hasProfile, hasEsgActivity, hasArtefact, hasListing].filter(Boolean).length;
    
    // level: 0: Emerging, 1: Developing, 2: Market-Ready, 3-4: Funding-Ready
    const levelMap = {
      0: "EMERGING",
      1: "DEVELOPING",
      2: "MARKET_READY",
      3: "FUNDING_READY",
      4: "FUNDING_READY"
    } as const;

    const newLevel = levelMap[score as 0|1|2|3|4];

    if (profile.readinessLevel !== newLevel) {
      console.log(`Updating ${profile.user.email} from ${profile.readinessLevel} to ${newLevel}`);
      await prisma.entrepreneurProfile.update({
        where: { id: profile.id },
        data: { readinessLevel: newLevel },
      });
    }
  }

  console.log("Done syncing readiness levels.");
}

main().catch(console.error);
