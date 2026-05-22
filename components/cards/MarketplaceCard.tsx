import type { MarketplaceListing } from "@/data/marketplace";

interface MarketplaceCardProps {
  listing: MarketplaceListing;
}

export function MarketplaceCard({ listing }: MarketplaceCardProps) {
  return (
    <article className="card group flex h-full flex-col overflow-hidden">
      <div className="relative h-32 bg-gradient-to-br from-forest-800 via-forest-700 to-forest-900">
        <div className="absolute inset-0 opacity-30 mix-blend-overlay" style={{
          backgroundImage:
            "radial-gradient(circle at 30% 30%, rgba(212, 167, 58, 0.45), transparent 55%), radial-gradient(circle at 80% 70%, rgba(255,255,255,0.18), transparent 50%)",
        }} />
        <div className="relative flex h-full items-end justify-between p-5 text-cream-50">
          <span className="rounded-full bg-cream-50/15 px-2.5 py-0.5 text-[11px] font-medium backdrop-blur">
            {listing.category}
          </span>
          <span className="text-[11px] text-cream-100/80">{listing.country}</span>
        </div>
      </div>

      <div className="flex flex-1 flex-col p-6">
        <h3 className="font-serif text-lg text-forest-900">{listing.title}</h3>
        <p className="mt-1 text-xs text-charcoal-400">
          By {listing.business} · {listing.entrepreneur}
        </p>

        <p className="mt-4 text-sm leading-relaxed text-charcoal-500">{listing.description}</p>

        <div className="mt-5 grid grid-cols-2 gap-3 border-t border-cream-200 pt-4 text-xs">
          <div>
            <p className="text-charcoal-400">Price range</p>
            <p className="mt-0.5 font-medium text-forest-900">{listing.priceRange}</p>
          </div>
          <div>
            <p className="text-charcoal-400">Minimum order</p>
            <p className="mt-0.5 font-medium text-forest-900">{listing.minOrder}</p>
          </div>
        </div>

        <div className="mt-4 flex flex-wrap gap-1.5">
          {listing.tags.map((tag) => (
            <span key={tag} className="chip">
              {tag}
            </span>
          ))}
        </div>

        <div className="mt-5 rounded-lg bg-gold-50 px-3 py-2 text-[11px] font-medium text-gold-800">
          ESG · {listing.esgHighlight}
        </div>

        <div className="mt-6 flex items-center gap-2">
          <button className="btn-primary !py-2 !px-4 text-xs">Request enquiry</button>
          <button className="btn-secondary !py-2 !px-4 text-xs">Save</button>
        </div>
      </div>
    </article>
  );
}
