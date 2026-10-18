import { prisma, DB_ENABLED } from "@/lib/db";
import { isEntrepreneurProfileComplete, getEntrepreneurReadinessLevel } from "@/lib/queries/onboarding";
import type { ReadinessLevel } from "@/data/entrepreneurs";

export interface ReadinessPipelineRow {
  label: ReadinessLevel;
  count: number;
  pct: number;
}

const LABELS: ReadinessLevel[] = ["Emerging", "Developing", "Market-Ready", "Funding-Ready"];

/**
 * Computed live from the same 4 onboarding signals the entrepreneur's own
 * dashboard badge uses (profile completeness, ESG text, a verification
 * artefact, a marketplace listing) — NOT the static
 * EntrepreneurProfile.readinessLevel column, which nothing in the app keeps
 * up to date. Uploading a listing (the last signal) is what takes an
 * entrepreneur to Funding-Ready here too, matching their own dashboard.
 */
export async function getReadinessPipeline(): Promise<ReadinessPipelineRow[]> {
  if (!DB_ENABLED || !prisma) {
    return LABELS.map((label) => ({ label, count: 0, pct: 0 }));
  }

  const profiles = await prisma.entrepreneurProfile.findMany({
    where: { user: { deletedAt: null } },
    select: {
      businessName: true,
      country: true,
      sector: true,
      description: true,
      fundingNeed: true,
      yearFounded: true,
      womenSupported: true,
      jobsCreated: true,
      esgActivity: true,
      user: {
        select: {
          _count: { select: { artefacts: true, listings: true } },
        },
      },
    },
  });

  const countByLabel: Partial<Record<ReadinessLevel, number>> = {};
  for (const p of profiles) {
    const score = [
      isEntrepreneurProfileComplete(p),
      (p.esgActivity ?? "").trim().length > 20,
      p.user._count.artefacts > 0,
      p.user._count.listings > 0,
    ].filter(Boolean).length;
    const label = getEntrepreneurReadinessLevel(score);
    countByLabel[label] = (countByLabel[label] ?? 0) + 1;
  }

  const total = profiles.length;

  return LABELS.map((label) => {
    const count = countByLabel[label] ?? 0;
    return { label, count, pct: total > 0 ? Math.round((count / total) * 100) : 0 };
  });
}
