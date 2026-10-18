import { prisma, DB_ENABLED } from "@/lib/db";
import { getSavedFunderShortlistEntries } from "@/lib/funderShortlists";

export async function getFunderPipeline(funderId: string) {
  if (!DB_ENABLED || !prisma) {
    return [];
  }

  // First, get explicit pipeline entries
  const entries = await prisma.pipelineEntry.findMany({
    where: { funderId },
    include: {
      entrepreneur: {
        include: {
          entrepreneurProfile: true,
        },
      },
    },
    orderBy: { updatedAt: "desc" },
  });

  // Then, get shortlists (which act as the default SOURCING stage)
  const shortlists = await getSavedFunderShortlistEntries(funderId);
  
  // Create a map to avoid duplicates (PipelineEntry overrides Shortlist)
  const pipelineMap = new Map();
  
  // Add explicit pipeline entries first
  entries.forEach((entry) => {
    pipelineMap.set(entry.entrepreneurId, {
      ...entry,
      entrepreneur: {
        name: entry.entrepreneur.name || "Unknown",
        businessName: entry.entrepreneur.entrepreneurProfile?.businessName || "Unknown Business",
        country: entry.entrepreneur.entrepreneurProfile?.country || "Unknown Location",
        sector: entry.entrepreneur.entrepreneurProfile?.sector || "Unknown Sector",
        readinessLevel: entry.entrepreneur.entrepreneurProfile?.readinessLevel || "EMERGING",
      }
    });
  });

  // Add shortlists only if they aren't already in the pipeline
  shortlists.forEach((shortlist) => {
    if (!pipelineMap.has(shortlist.entrepreneurId)) {
      pipelineMap.set(shortlist.entrepreneurId, {
        id: `shortlist-${shortlist.id}`,
        funderId,
        entrepreneurId: shortlist.entrepreneurId,
        stage: "SOURCING",
        capital: shortlist.fundingNeed || "Funding need to be confirmed",
        nextStep: "Shortlisted from the directory. Review fit and move to diligence when ready.",
        createdAt: new Date(),
        updatedAt: new Date(),
        entrepreneur: {
          name: shortlist.entrepreneurName,
          businessName: shortlist.businessName,
          country: shortlist.country,
          sector: shortlist.sector,
          readinessLevel: shortlist.readinessLevel,
        }
      });
    }
  });

  return Array.from(pipelineMap.values());
}
