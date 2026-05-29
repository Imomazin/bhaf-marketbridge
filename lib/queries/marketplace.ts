import { prisma, DB_ENABLED } from "@/lib/db";
import { marketplaceListings as mockListings, type MarketplaceListing } from "@/data/marketplace";

export async function loadMarketplace(): Promise<{ listings: MarketplaceListing[]; isReal: boolean }> {
  if (!DB_ENABLED || !prisma) {
    return { listings: mockListings, isReal: false };
  }

  try {
    const rows = await prisma.listing.findMany({
      where: { status: "PUBLISHED" },
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
      return { listings: mockListings, isReal: false };
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
