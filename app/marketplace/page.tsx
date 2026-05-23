import { PageHero } from "@/components/ui/PageHero";
import { MarketplaceCard } from "@/components/cards/MarketplaceCard";
import { AnnotatedPhoto } from "@/components/ui/AnnotatedPhoto";
import { marketplaceListings } from "@/data/marketplace";
import { photos } from "@/data/photos";

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
      <PageHero
        eyebrow="Marketplace"
        title="Products and services from verified women-led enterprises."
        description="Browse export-ready, ESG-aligned offers from African women entrepreneurs. The MVP supports buyer enquiries; full e-commerce checkout comes later."
        photo={photos.baloni3}
        caption="Product showcase at the Baloni Farm visit — the kind of real, traceable goods this marketplace exists to surface."
      />

      <section className="bg-cream-50 py-16">
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
