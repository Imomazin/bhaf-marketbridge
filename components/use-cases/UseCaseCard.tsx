import Link from "next/link";
import type { UseCase } from "@/data/use-cases";
import { PROTOTYPE_DISCLAIMER_SHORT } from "@/data/use-cases";
import { PrototypeDisclaimer } from "./PrototypeDisclaimer";

const accentClass: Record<UseCase["accent"], { border: string; eyebrow: string; ring: string; chip: string }> = {
  forest: {
    border: "border-forest-200",
    eyebrow: "text-forest-700",
    ring: "ring-forest-100",
    chip: "border-forest-200 bg-forest-50 text-forest-800",
  },
  gold: {
    border: "border-gold-200",
    eyebrow: "text-gold-700",
    ring: "ring-gold-100",
    chip: "border-gold-200 bg-gold-50 text-gold-800",
  },
  navy: {
    border: "border-blue-200",
    eyebrow: "text-blue-700",
    ring: "ring-blue-100",
    chip: "border-blue-200 bg-blue-50 text-blue-800",
  },
};

export function UseCaseCard({ uc }: { uc: UseCase }) {
  const a = accentClass[uc.accent];
  return (
    <article
      className={`group relative flex h-full flex-col rounded-2xl border ${a.border} bg-white p-6 shadow-card ring-1 ${a.ring} transition hover:-translate-y-0.5 hover:shadow-lg`}
    >
      <header className="flex items-start justify-between gap-3">
        <div>
          <p className={`text-[10px] font-semibold uppercase tracking-[0.18em] ${a.eyebrow}`}>
            Use case 0{uc.number} · {uc.stakeholder}
          </p>
          <h3 className="mt-2 font-serif text-xl leading-tight text-forest-900">{uc.title}</h3>
        </div>
        <span
          className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.14em] ${a.chip}`}
        >
          <span aria-hidden className="h-1.5 w-1.5 rounded-full bg-current opacity-70" />
          {uc.badge}
        </span>
      </header>

      <dl className="mt-5 grid grid-cols-2 gap-3 text-[11px]">
        <div>
          <dt className="font-semibold uppercase tracking-wide text-charcoal-500">Region</dt>
          <dd className="mt-0.5 text-charcoal-700">{uc.region}</dd>
        </div>
        <div>
          <dt className="font-semibold uppercase tracking-wide text-charcoal-500">Sector</dt>
          <dd className="mt-0.5 text-charcoal-700">{uc.sector}</dd>
        </div>
      </dl>

      <div className="mt-5 space-y-3 text-sm">
        <Section label="Pain point" body={uc.painPoint} />
        <Section label="MarketBridge intervention" body={uc.intervention} />
        <Section label="Expected value" body={uc.expectedValue} />
      </div>

      <div className="mt-5 rounded-lg border border-cream-200 bg-cream-50 p-3">
        <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-gold-700">
          Suggested demo metric
        </p>
        <p className="mt-1 text-sm font-medium text-forest-900">{uc.headlineMetric}</p>
      </div>

      <div className="mt-auto pt-5">
        <PrototypeDisclaimer text={PROTOTYPE_DISCLAIMER_SHORT} variant="badge" />
        <div className="mt-4 flex items-center justify-between gap-3">
          <Link
            href={`/use-cases/${uc.slug}`}
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-forest-900 underline-offset-2 transition hover:text-gold-700 hover:underline"
          >
            Open the full detail page
            <span aria-hidden>→</span>
          </Link>
          <Link
            href={`#use-case-${uc.number}`}
            className="text-[11px] font-medium text-charcoal-500 hover:text-forest-800"
          >
            Or jump to summary ↓
          </Link>
        </div>
      </div>
    </article>
  );
}

function Section({ label, body }: { label: string; body: string }) {
  return (
    <div>
      <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-charcoal-500">
        {label}
      </p>
      <p className="mt-0.5 text-[13px] leading-relaxed text-charcoal-700">{body}</p>
    </div>
  );
}
