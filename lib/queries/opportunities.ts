import { prisma, DB_ENABLED } from "@/lib/db";
import {
  opportunities as mockOpportunities,
  type Opportunity,
  type OpportunityType,
} from "@/data/opportunities";

const TYPE_MAP: Record<string, OpportunityType> = {
  GRANT: "Grant",
  INVESTMENT: "Investment",
  PROCUREMENT: "Procurement",
  PROGRAMME: "Programme",
  CERTIFICATION: "Certification",
};

export async function loadOpportunities(): Promise<{ opportunities: Opportunity[]; isReal: boolean }> {
  if (!DB_ENABLED || !prisma) {
    return { opportunities: mockOpportunities, isReal: false };
  }

  try {
    const rows = await prisma.opportunity.findMany({
      where: { published: true },
      orderBy: [{ deadline: "asc" }, { createdAt: "desc" }],
      take: 50,
    });

    if (rows.length === 0) {
      return { opportunities: mockOpportunities, isReal: false };
    }

    const real: Opportunity[] = rows.map((o) => ({
      id: o.id,
      title: o.title,
      type: TYPE_MAP[o.type] ?? "Grant",
      organisation: o.organisation,
      region: o.region ?? "—",
      amount: o.amount ?? "—",
      deadline: o.deadline ? o.deadline.toISOString().slice(0, 10) : "Rolling",
      description: o.description,
      eligibility: o.eligibility,
    }));

    return { opportunities: real, isReal: true };
  } catch (err) {
    console.error("[opportunities] DB load failed", err);
    return { opportunities: mockOpportunities, isReal: false };
  }
}
