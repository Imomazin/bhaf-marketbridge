import { prisma, DB_ENABLED } from "@/lib/db";
import { marketplaceListings as mockListings, type MarketplaceListing } from "@/data/marketplace";
import { getAllDemoEntrepreneurProfiles, getAllDemoListings } from "@/lib/demoState";
import { getAllDemoUsers } from "@/lib/demoUsers";

export interface MarketplaceFilters {
  q?: string;
  category?: string;
}

function applyMockFilters(rows: MarketplaceListing[], f: MarketplaceFilters): MarketplaceListing[] {
  const q = f.q?.toLowerCase().trim();
  return rows.filter((r) => {
    if (f.category && f.category !== "All categories" && r.category !== f.category) return false;
    if (q) {
      const hay = `${r.title} ${r.business} ${r.entrepreneur} ${r.country} ${r.description} ${r.esgHighlight} ${r.tags.join(" ")}`.toLowerCase();
      if (!hay.includes(q)) return false;
    }
    return true;
  });
}

export async function loadMarketplace(filters: MarketplaceFilters = {}): Promise<{ listings: MarketplaceListing[]; isReal: boolean }> {
  if (!DB_ENABLED || !prisma) {
    const [demoListings, demoProfiles, demoUsers] = await Promise.all([
      getAllDemoListings(),
      getAllDemoEntrepreneurProfiles(),
      getAllDemoUsers(),
    ]);

    const demoRows: MarketplaceListing[] = demoListings.map((listing) => {
      const owner = demoUsers.find((user) => user.id === listing.ownerId);
      const profile = demoProfiles.find((entry) => entry.userId === listing.ownerId);
      return {
        id: listing.id,
        title: listing.title,
        category: listing.category,
        business: profile?.businessName || owner?.name || "Demo business",
        entrepreneur: owner?.name ?? "Demo entrepreneur",
        country: profile?.country || "—",
        priceRange: listing.priceRange || "On request",
        minOrder: listing.minOrder || "On request",
        description: listing.description,
        tags: listing.tags,
        esgHighlight: listing.esgHighlight || "ESG activity documented on MarketBridge",
      };
    });

    return { listings: applyMockFilters([...demoRows, ...mockListings], filters), isReal: false };
  }

  try {
    const where: Record<string, unknown> = { status: "PUBLISHED" };
    if (filters.category && filters.category !== "All categories") where.category = filters.category;
    if (filters.q) {
      where.OR = [
        { title: { contains: filters.q, mode: "insensitive" } },
        { description: { contains: filters.q, mode: "insensitive" } },
        { esgHighlight: { contains: filters.q, mode: "insensitive" } },
        { owner: { name: { contains: filters.q, mode: "insensitive" } } },
      ];
    }
    const rows = await prisma.listing.findMany({
      where,
      include: {
        owner: {
          select: {
            name: true,
            email: true,
            entrepreneurProfile: { select: { businessName: true, country: true } },
          },
        },
      },
      orderBy: { publishedAt: "desc" },
      take: 50,
    });

    if (rows.length === 0) {
      return { listings: applyMockFilters(mockListings, filters), isReal: false };
    }

    const real: MarketplaceListing[] = rows.map((l) => ({
      id: l.id,
      title: l.title,
      category: l.category,
      business: l.owner.entrepreneurProfile?.businessName ?? l.owner.name ?? "—",
      entrepreneur: l.owner.name ?? l.owner.email,
      country: l.owner.entrepreneurProfile?.country ?? "—",
      priceRange: l.priceRange ?? "On request",
      minOrder: l.minOrder ?? "—",
      description: l.description,
      tags: l.tags,
      esgHighlight: l.esgHighlight ?? "ESG documentation verified by BHAF",
    }));

    return { listings: real, isReal: true };
  } catch (err) {
    console.error("[marketplace] DB load failed", err);
    return { listings: mockListings, isReal: false };
  }
}
