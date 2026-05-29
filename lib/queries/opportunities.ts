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

export interface OpportunityFilters {
  q?: string;
  type?: string;
}

const TYPE_DB: Record<string, "GRANT" | "INVESTMENT" | "PROCUREMENT" | "PROGRAMME" | "CERTIFICATION"> = {
  Grant: "GRANT",
  Investment: "INVESTMENT",
  Procurement: "PROCUREMENT",
  Programme: "PROGRAMME",
  Certification: "CERTIFICATION",
};

function applyMockFilters(rows: Opportunity[], f: OpportunityFilters): Opportunity[] {
  const q = f.q?.toLowerCase().trim();
  return rows.filter((r) => {
    if (f.type && f.type !== "All types" && r.type !== f.type) return false;
    if (q) {
      const hay = `${r.title} ${r.organisation} ${r.description}`.toLowerCase();
      if (!hay.includes(q)) return false;
    }
    return true;
  });
}

export async function loadOpportunities(filters: OpportunityFilters = {}): Promise<{ opportunities: Opportunity[]; isReal: boolean }> {
  if (!DB_ENABLED || !prisma) {
    return { opportunities: applyMockFilters(mockOpportunities, filters), isReal: false };
  }

  try {
    const where: Record<string, unknown> = { published: true };
    if (filters.type && filters.type !== "All types" && TYPE_DB[filters.type]) {
      where.type = TYPE_DB[filters.type];
    }
    if (filters.q) {
      where.OR = [
        { title: { contains: filters.q, mode: "insensitive" } },
        { organisation: { contains: filters.q, mode: "insensitive" } },
        { description: { contains: filters.q, mode: "insensitive" } },
      ];
    }
    const rows = await prisma.opportunity.findMany({
      where,
      orderBy: [{ deadline: "asc" }, { createdAt: "desc" }],
      take: 50,
    });

    if (rows.length === 0) {
      return { opportunities: applyMockFilters(mockOpportunities, filters), isReal: false };
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
