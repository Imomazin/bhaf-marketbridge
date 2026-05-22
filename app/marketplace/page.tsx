import { SectionHeader } from "@/components/ui/SectionHeader";
import { MarketplaceCard } from "@/components/cards/MarketplaceCard";
import { marketplaceListings } from "@/data/marketplace";

const categories = [
  "All categories",
  "Fashion & Textiles",
  "Agri-Processing",
  "Clean Energy",
  "Beauty & Wellness",
  "Technology Services",
  "Training",
];

export default function MarketplacePage() {
  return (
    <>
      <section className="border-b border-cream-200 bg-cream-50 py-16">
        <div className="container-edge">
          <SectionHeader
            eyebrow="Marketplace"
            title="Products and services from verified women-led enterprises."
            description="Browse export-ready, ESG-aligned offers from African women entrepreneurs. The MVP supports buyer enquiries; full e-commerce checkout comes later."
          />
        </div>
      </section>

      <section className="bg-cream-50 pb-24">
        <div className="container-edge">
          <div className="card mb-10 flex flex-wrap items-center gap-2 p-4">
            {categories.map((cat, idx) => (
              <button
                key={cat}
                className={
                  idx === 0
                    ? "rounded-full bg-forest-800 px-3.5 py-1.5 text-xs font-medium text-cream-50"
                    : "rounded-full border border-cream-300 px-3.5 py-1.5 text-xs font-medium text-charcoal-600 transition hover:border-forest-700 hover:text-forest-900"
                }
              >
                {cat}
              </button>
            ))}
          </div>

          <div className="mb-6 flex items-center justify-between text-sm text-charcoal-500">
            <span>
              <strong className="text-forest-900">{marketplaceListings.length}</strong> listings · all entrepreneurs
              verified by BHAF
            </span>
            <span>Sorted by relevance</span>
          </div>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {marketplaceListings.map((l) => (
              <MarketplaceCard key={l.id} listing={l} />
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
