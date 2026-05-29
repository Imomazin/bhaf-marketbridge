import { prisma, DB_ENABLED } from "@/lib/db";
import { entrepreneurs as mockEntrepreneurs, type Entrepreneur, type ReadinessLevel } from "@/data/entrepreneurs";

const READINESS_MAP: Record<string, ReadinessLevel> = {
  EMERGING: "Emerging",
  DEVELOPING: "Developing",
  MARKET_READY: "Market-Ready",
  FUNDING_READY: "Funding-Ready",
};

/**
 * Returns the directory entries to render. When the DB is enabled and has
 * verified entrepreneur profiles, returns those. Otherwise falls back to
 * the mock data so the marketing pages still look complete on a fresh
 * install.
 */
export async function loadDirectory(): Promise<{ entrepreneurs: Entrepreneur[]; isReal: boolean }> {
  if (!DB_ENABLED || !prisma) {
    return { entrepreneurs: mockEntrepreneurs, isReal: false };
  }

  try {
    const rows = await prisma.entrepreneurProfile.findMany({
      where: { verified: true },
      include: {
        user: { select: { name: true, email: true } },
        products: { select: { name: true } },
        certifications: { select: { name: true } },
      },
      orderBy: { updatedAt: "desc" },
      take: 50,
    });

    if (rows.length === 0) {
      // No real profiles yet — show mock so the page isn't empty
      return { entrepreneurs: mockEntrepreneurs, isReal: false };
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
