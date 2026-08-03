import { PageHero } from "@/components/ui/PageHero";
import { MarketplaceCard } from "@/components/cards/MarketplaceCard";
import { AnnotatedPhoto } from "@/components/ui/AnnotatedPhoto";
import { Reveal } from "@/components/ui/Reveal";
import { loadMarketplace } from "@/lib/queries/marketplace";
import { photos } from "@/data/photos";
import { normalizeSearchParam } from "@/lib/searchParams";

export const dynamic = "force-dynamic";

const categories = [
  "All categories",
  "Fashion & Textiles",
  "Agri-Processing",
  "Clean Energy",
  "Beauty & Wellness",
  "Technology Services",
  "Training",
  "Crafts & Lifestyle",
  "Health",
  "Other",
];

export default async function MarketplacePage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string | string[]; category?: string | string[] }>;
}) {
  const resolved = await searchParams;
  const filters = {
    q: normalizeSearchParam(resolved.q),
    category: normalizeSearchParam(resolved.category),
  };
  const { listings: marketplaceListings, isReal } = await loadMarketplace(filters);

  return (
    <>
      <PageHero
        eyebrow="Marketplace"
        title="Products and services from verified women-led enterprises."
        description="Browse export-ready, ESG-aligned offers from African women entrepreneurs. The MVP supports buyer enquiries; full e-commerce checkout comes later."
        photo={photos.baloni3}
        caption="Product showcase at the Baloni Farm visit — the kind of real, traceable goods this marketplace exists to surface."
      />

      <section className="bg-cream-50 py-16">
        <div className="container-edge">
          <form action="/marketplace" method="GET" className="card mb-10 flex flex-wrap items-center gap-3 p-4">
            <input
              type="text"
              name="q"
              defaultValue={filters.q ?? ""}
              placeholder="Search products and services"
              className="flex-1 min-w-[200px] rounded-md border border-cream-300 bg-cream-50 px-3 py-2 text-sm text-forest-900 placeholder:text-charcoal-300 focus:border-forest-700 focus:outline-none"
            />
            <select
              name="category"
              defaultValue={filters.category ?? "All categories"}
              className="rounded-md border border-cream-300 bg-cream-50 px-3 py-2 text-sm text-forest-900 focus:border-forest-700 focus:outline-none"
            >
              {categories.map((c) => (
                <option key={c}>{c}</option>
              ))}
            </select>
            <button type="submit" className="btn-primary !py-2 !px-4 text-xs">Search</button>
            <a href="/marketplace" className="btn-secondary !py-2 !px-4 text-xs">Reset</a>
          </form>

          <div className="mb-6 flex items-center justify-between text-sm text-charcoal-500">
            <span>
              <strong className="text-forest-900">{marketplaceListings.length}</strong> listings · all entrepreneurs
              verified by BHAF
              {!isReal && (
                <span className="ml-2 rounded-full bg-cream-100 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-charcoal-500">
                  Sample data
                </span>
              )}
            </span>
            <span>Sorted by relevance</span>
          </div>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {marketplaceListings.map((l, idx) => (
              <Reveal key={l.id} delayMs={idx * 80}>
                <MarketplaceCard listing={l} />
              </Reveal>
            ))}
          </div>

          <div className="mt-16 overflow-hidden rounded-2xl">
            <AnnotatedPhoto
              photo={photos.ihs1}
              aspect="wide"
              tag="Networking Lunch & Marketplace · Dublin"
              caption="BHAF entrepreneurs on the InvestHer Summit marketplace stage — exactly the kind of buyer-meets-supplier moments this directory unlocks every day."
            />
          </div>
        </div>
      </section>
    </>
  );
}
