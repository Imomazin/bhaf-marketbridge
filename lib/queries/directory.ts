import { prisma, DB_ENABLED } from "@/lib/db";
import { entrepreneurs as mockEntrepreneurs, type Entrepreneur, type ReadinessLevel } from "@/data/entrepreneurs";

const READINESS_MAP: Record<string, ReadinessLevel> = {
  EMERGING: "Emerging",
  DEVELOPING: "Developing",
  MARKET_READY: "Market-Ready",
  FUNDING_READY: "Funding-Ready",
};

export interface DirectoryFilters {
  q?: string;
  sector?: string;
  country?: string;
  readiness?: string;
}

function applyMockFilters(rows: Entrepreneur[], f: DirectoryFilters): Entrepreneur[] {
  const q = f.q?.toLowerCase().trim();
  return rows.filter((r) => {
    if (f.sector && f.sector !== "All sectors" && r.sector !== f.sector) return false;
    if (f.country && f.country !== "All countries" && r.country !== f.country) return false;
    if (f.readiness && f.readiness !== "All levels" && r.readinessLevel !== f.readiness) return false;
    if (q) {
      const hay = `${r.name} ${r.businessName} ${r.description} ${r.products.join(" ")}`.toLowerCase();
      if (!hay.includes(q)) return false;
    }
    return true;
  });
}

const READINESS_DB_MAP: Record<string, "EMERGING" | "DEVELOPING" | "MARKET_READY" | "FUNDING_READY"> = {
  Emerging: "EMERGING",
  Developing: "DEVELOPING",
  "Market-Ready": "MARKET_READY",
  "Funding-Ready": "FUNDING_READY",
};

export async function loadDirectory(filters: DirectoryFilters = {}): Promise<{ entrepreneurs: Entrepreneur[]; isReal: boolean }> {
  if (!DB_ENABLED || !prisma) {
    return { entrepreneurs: applyMockFilters(mockEntrepreneurs, filters), isReal: false };
  }

  try {
    const where: Record<string, unknown> = { verified: true };
    if (filters.sector && filters.sector !== "All sectors") where.sector = filters.sector;
    if (filters.country && filters.country !== "All countries") where.country = filters.country;
    if (filters.readiness && filters.readiness !== "All levels") {
      where.readinessLevel = READINESS_DB_MAP[filters.readiness] ?? undefined;
    }
    if (filters.q) {
      where.OR = [
        { businessName: { contains: filters.q, mode: "insensitive" } },
        { description: { contains: filters.q, mode: "insensitive" } },
        { user: { name: { contains: filters.q, mode: "insensitive" } } },
      ];
    }
    const rows = await prisma.entrepreneurProfile.findMany({
      where,
      include: {
        user: { select: { name: true, email: true } },
        products: { select: { name: true } },
        certifications: { select: { name: true } },
      },
      orderBy: { updatedAt: "desc" },
      take: 50,
    });

    if (rows.length === 0) {
      // No real DB rows — fall back to mock and apply the same filters there
      return { entrepreneurs: applyMockFilters(mockEntrepreneurs, filters), isReal: false };
    }

    const real: Entrepreneur[] = rows.map((r) => {
      const name = r.user.name ?? r.user.email;
      const initials = name
        .split(/\s+/)
        .map((s) => s.charAt(0).toUpperCase())
        .slice(0, 2)
        .join("");
      return {
        id: r.id,
        name,
        country: r.country,
        sector: r.sector,
        businessName: r.businessName,
        description: r.description,
        fundingNeed: r.fundingNeed ?? "—",
        esgActivity: r.esgActivity ?? "—",
        readinessLevel: READINESS_MAP[r.readinessLevel] ?? "Emerging",
        products: r.products.map((p) => p.name),
        certifications: r.certifications.map((c) => c.name),
        womenSupported: r.womenSupported,
        jobsCreated: r.jobsCreated,
        yearFounded: r.yearFounded ?? new Date().getFullYear(),
        initials,
      };
    });
    return { entrepreneurs: real, isReal: true };
  } catch (err) {
    console.error("[directory] DB load failed, falling back to mock", err);
    return { entrepreneurs: mockEntrepreneurs, isReal: false };
  }
}
