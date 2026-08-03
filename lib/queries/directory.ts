import { prisma, DB_ENABLED } from "@/lib/db";
import { entrepreneurs as mockEntrepreneurs, type Entrepreneur, type ReadinessLevel } from "@/data/entrepreneurs";
import { getAllDemoArtefacts, getAllDemoEntrepreneurProfiles, getAllDemoListings } from "@/lib/demoState";
import { getAllDemoUsers } from "@/lib/demoUsers";
import { buildInitials, getReadinessLevel } from "@/lib/demoPresentation";

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

function sortByReadiness(rows: Entrepreneur[]) {
  const order: Record<ReadinessLevel, number> = {
    "Funding-Ready": 0,
    "Market-Ready": 1,
    Developing: 2,
    Emerging: 3,
  };
  return [...rows].sort((a, b) => order[a.readinessLevel] - order[b.readinessLevel]);
}

function mergeDemoEntrepreneurs(
  rows: Entrepreneur[],
  demoRows: Entrepreneur[],
): Entrepreneur[] {
  const byId = new Map<string, Entrepreneur>();
  for (const row of rows) byId.set(row.id, row);
  for (const row of demoRows) byId.set(row.id, row);
  return Array.from(byId.values());
}

const READINESS_DB_MAP: Record<string, "EMERGING" | "DEVELOPING" | "MARKET_READY" | "FUNDING_READY"> = {
  Emerging: "EMERGING",
  Developing: "DEVELOPING",
  "Market-Ready": "MARKET_READY",
  "Funding-Ready": "FUNDING_READY",
};

export async function loadDirectory(filters: DirectoryFilters = {}): Promise<{ entrepreneurs: Entrepreneur[]; isReal: boolean }> {
  if (!DB_ENABLED || !prisma) {
    const [demoUsers, demoProfiles, demoListings, demoArtefacts] = await Promise.all([
      getAllDemoUsers(),
      getAllDemoEntrepreneurProfiles(),
      getAllDemoListings(),
      getAllDemoArtefacts(),
    ]);

    const demoRows: Entrepreneur[] = demoUsers
      .filter((user) => user.role === "ENTREPRENEUR")
      .map((user) => {
        const profile = demoProfiles.find((entry) => entry.userId === user.id);
        const listings = demoListings.filter((entry) => entry.ownerId === user.id);
        const artefacts = demoArtefacts.filter((entry) => entry.userId === user.id);
        const profileSignals = [
          Boolean(profile?.businessName?.trim()),
          Boolean(profile?.description?.trim()),
          Boolean(profile?.esgActivity?.trim()),
          listings.length > 0,
          artefacts.length > 0,
        ].filter(Boolean).length;

        return {
          id: user.id,
          name: user.name,
          country: profile?.country || "Pending country",
          sector: profile?.sector || "Pending sector",
          businessName: profile?.businessName || "Business profile in progress",
          description: profile?.description || "This entrepreneur has started onboarding on MarketBridge.",
          fundingNeed: profile?.fundingNeed || "To be added",
          esgActivity: profile?.esgActivity || "To be added",
          readinessLevel: getReadinessLevel(profileSignals),
          products: listings.map((listing) => listing.title),
          certifications: artefacts.length > 0 ? ["Documents uploaded"] : [],
          womenSupported: profile?.womenSupported ?? 0,
          jobsCreated: profile?.jobsCreated ?? 0,
          yearFounded: profile?.yearFounded ?? new Date().getFullYear(),
          initials: buildInitials(user.name),
        };
      })
      .filter((row) => row.country !== "Pending country" || row.businessName !== "Business profile in progress");

    return {
      entrepreneurs: sortByReadiness(applyMockFilters(mergeDemoEntrepreneurs(mockEntrepreneurs, demoRows), filters)),
      isReal: false,
    };
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
    return { entrepreneurs: sortByReadiness(real), isReal: true };
  } catch (err) {
    console.error("[directory] DB load failed, falling back to mock", err);
    return { entrepreneurs: sortByReadiness(mockEntrepreneurs), isReal: false };
  }
}

export async function loadDirectoryEntrepreneurById(id: string): Promise<Entrepreneur | null> {
  if (!DB_ENABLED || !prisma) {
    const { entrepreneurs } = await loadDirectory();
    return entrepreneurs.find((entrepreneur) => entrepreneur.id === id) ?? null;
  }

  try {
    const row = await prisma.entrepreneurProfile.findUnique({
      where: { id },
      include: {
        user: { select: { name: true, email: true } },
        products: { select: { name: true } },
        certifications: { select: { name: true } },
      },
    });

    if (!row || !row.verified) return null;

    const name = row.user.name ?? row.user.email;
    const initials = name
      .split(/\s+/)
      .map((part) => part.charAt(0).toUpperCase())
      .slice(0, 2)
      .join("");

    return {
      id: row.id,
      name,
      country: row.country,
      sector: row.sector,
      businessName: row.businessName,
      description: row.description,
      fundingNeed: row.fundingNeed ?? "—",
      esgActivity: row.esgActivity ?? "—",
      readinessLevel: READINESS_MAP[row.readinessLevel] ?? "Emerging",
      products: row.products.map((product) => product.name),
      certifications: row.certifications.map((certification) => certification.name),
      womenSupported: row.womenSupported,
      jobsCreated: row.jobsCreated,
      yearFounded: row.yearFounded ?? new Date().getFullYear(),
      initials,
    };
  } catch (err) {
    console.error("[directory] profile load failed, falling back to mock", err);
    const { entrepreneurs } = await loadDirectory();
    return entrepreneurs.find((entrepreneur) => entrepreneur.id === id) ?? null;
  }
}
