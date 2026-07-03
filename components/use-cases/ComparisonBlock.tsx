import type { ComparisonRow, UseCase } from "@/data/use-cases";

const accentEyebrow: Record<UseCase["accent"], string> = {
  forest: "text-forest-700",
  gold: "text-gold-700",
  navy: "text-blue-700",
};

export function ComparisonBlock({
  rows,
  accent,
}: {
  rows: ComparisonRow[];
  accent: UseCase["accent"];
}) {
  return (
    <section className="card overflow-hidden p-0">
      <header className="border-b border-cream-200 bg-cream-50 px-5 py-4">
        <p className={`text-[10px] font-semibold uppercase tracking-[0.18em] ${accentEyebrow[accent]}`}>
          Without vs with MarketBridge
        </p>
        <h3 className="mt-1 font-serif text-base text-forest-900">
          The shift the platform creates
        </h3>
      </header>

      <div className="grid md:grid-cols-2">
        {/* Without column */}
        <div className="border-b border-cream-200 bg-cream-50/40 p-5 md:border-b-0 md:border-r">
          <p className="inline-flex items-center gap-1.5 text-[10px] font-semibold uppercase tracking-[0.18em] text-charcoal-500">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" aria-hidden>
              <path d="M6 18L18 6M6 6l12 12" strokeLinecap="round" />
            </svg>
            Without MarketBridge
          </p>
          <ul className="mt-3 space-y-2.5">
            {rows.map((r) => (
              <li key={r.without} className="flex items-start gap-2 text-[13px] text-charcoal-600">
                <span aria-hidden className="mt-1.5 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-charcoal-300" />
                <span className="leading-relaxed">{r.without}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* With column */}
        <div className="bg-white p-5">
          <p className={`inline-flex items-center gap-1.5 text-[10px] font-semibold uppercase tracking-[0.18em] ${accentEyebrow[accent]}`}>
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" aria-hidden>
              <path d="M5 12l5 5L20 7" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            With MarketBridge
          </p>
          <ul className="mt-3 space-y-2.5">
            {rows.map((r) => (
              <li key={r.withPlatform} className="flex items-start gap-2 text-[13px] text-forest-900">
                <span aria-hidden className="gold-dot mt-1.5" />
                <span className="leading-relaxed">{r.withPlatform}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
