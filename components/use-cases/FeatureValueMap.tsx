import Link from "next/link";
import { featureValueMap } from "@/data/use-cases";

const stakeholderTone: Record<string, string> = {
  Entrepreneur: "border-forest-200 bg-forest-50 text-forest-800",
  Buyer: "border-gold-200 bg-gold-50 text-gold-800",
  Funder: "border-blue-200 bg-blue-50 text-blue-800",
  All: "border-cream-300 bg-cream-100 text-charcoal-700",
};

export function FeatureValueMap() {
  return (
    <section id="feature-value-map" className="border-t border-cream-200 bg-cream-50 py-16 md:py-20">
      <div className="container-edge max-w-6xl">
        <header>
          <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-gold-700">
            Feature → value mapping
          </p>
          <h2 className="mt-2 font-serif text-2xl text-forest-900 md:text-3xl">
            How MarketBridge features create stakeholder value
          </h2>
          <p className="mt-2 max-w-2xl text-sm text-charcoal-600">
            Each capability already exists on the platform. The use cases above orchestrate them
            into a journey; this table makes the underlying value-creation legible at a glance.
          </p>
        </header>

        <ul className="mt-8 grid gap-3 md:grid-cols-2">
          {featureValueMap.map((r) => {
            const inner = (
              <div className="flex h-full items-start gap-4 rounded-xl border border-cream-200 bg-white p-5 shadow-soft transition hover:-translate-y-0.5 hover:shadow-card">
                <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg bg-forest-50 text-forest-700">
                  <svg
                    width="18"
                    height="18"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    aria-hidden
                  >
                    <path d="M3 12h13" />
                    <path d="M16 6l6 6-6 6" />
                  </svg>
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <p className="text-sm font-semibold text-forest-900">{r.feature}</p>
                    <span
                      className={`inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-[10px] font-semibold uppercase tracking-[0.12em] ${
                        stakeholderTone[r.stakeholder]
                      }`}
                    >
                      <span aria-hidden className="h-1.5 w-1.5 rounded-full bg-current opacity-70" />
                      {r.stakeholder}
                    </span>
                  </div>
                  <p className="mt-1 text-[13px] leading-relaxed text-charcoal-700">{r.value}</p>
                </div>
              </div>
            );
            return (
              <li key={r.feature}>
                {r.href ? (
                  <Link href={r.href} className="block">
                    {inner}
                  </Link>
                ) : (
                  inner
                )}
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
