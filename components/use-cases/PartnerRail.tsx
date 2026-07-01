/**
 * Programme-partner category rail. Uses category labels rather than
 * named institutions — safer as a placeholder until BHAF confirms
 * which partners we can show with consent. Visually reads like a
 * monochrome logo strip.
 */

const categories = [
  { name: "African DFIs", tag: "Development finance" },
  { name: "European DFIs", tag: "Development finance" },
  { name: "UN system", tag: "Multilateral" },
  { name: "Foundations", tag: "Philanthropic" },
  { name: "Ministries", tag: "Public sector" },
  { name: "Corporate buyers", tag: "Procurement" },
  { name: "Sector networks", tag: "Ecosystem" },
  { name: "Academic partners", tag: "Research" },
];

export function PartnerRail() {
  return (
    <section
      aria-labelledby="partner-rail-title"
      className="border-y border-cream-200 bg-white py-10"
    >
      <div className="container-edge max-w-6xl">
        <div className="flex items-end justify-between gap-3">
          <div>
            <p
              id="partner-rail-title"
              className="text-[11px] font-semibold uppercase tracking-[0.2em] text-gold-700"
            >
              Programme partner categories
            </p>
            <p className="mt-1 text-sm text-charcoal-600">
              Illustrative partner archetypes MarketBridge is designed to serve.
              <span className="ml-1 text-charcoal-400">Named partners added once consented.</span>
            </p>
          </div>
          <span className="hidden shrink-0 rounded-full border border-cream-300 bg-cream-50 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.14em] text-charcoal-500 md:inline-flex">
            Placeholder
          </span>
        </div>

        <ul className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-8">
          {categories.map((c) => (
            <li
              key={c.name}
              className="group flex flex-col items-center justify-center rounded-xl border border-cream-200 bg-cream-50/50 px-3 py-4 text-center transition hover:border-forest-300 hover:bg-white"
            >
              <span className="font-serif text-[13px] leading-tight text-forest-900">
                {c.name}
              </span>
              <span className="mt-1 text-[9px] uppercase tracking-[0.14em] text-charcoal-500">
                {c.tag}
              </span>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
