import Link from "next/link";
import type { UseCase } from "@/data/use-cases";

const accentClass: Record<
  UseCase["accent"],
  { chip: string; bg: string; eyebrow: string; ring: string }
> = {
  forest: {
    chip: "border-forest-300/40 bg-white/10 text-cream-50",
    bg: "from-forest-900 via-forest-800 to-forest-900",
    eyebrow: "text-gold-300",
    ring: "ring-forest-500/30",
  },
  gold: {
    chip: "border-gold-300/40 bg-white/10 text-cream-50",
    bg: "from-forest-900 via-forest-800 to-forest-800",
    eyebrow: "text-gold-300",
    ring: "ring-gold-500/30",
  },
  navy: {
    chip: "border-blue-300/40 bg-white/10 text-cream-50",
    bg: "from-forest-900 via-blue-950 to-forest-900",
    eyebrow: "text-gold-300",
    ring: "ring-blue-500/30",
  },
};

export function UseCaseDetailHero({ uc }: { uc: UseCase }) {
  const a = accentClass[uc.accent];
  return (
    <section
      className={`relative overflow-hidden bg-gradient-to-br ${a.bg} text-cream-50 print:bg-white print:text-forest-900`}
    >
      <div
        aria-hidden
        className="absolute inset-0 opacity-[0.07] print:hidden"
        style={{
          backgroundImage:
            "radial-gradient(circle at 1px 1px, rgba(255,255,255,0.6) 1px, transparent 0)",
          backgroundSize: "26px 26px",
        }}
      />
      <div
        aria-hidden
        className="pointer-events-none absolute -right-24 -top-24 h-72 w-72 rounded-full bg-gold-400/20 blur-3xl print:hidden"
      />

      <div className="container-edge relative py-14 md:py-20">
        <nav
          aria-label="Breadcrumb"
          className="text-[11px] font-medium text-cream-200 print:text-charcoal-500"
        >
          <Link href="/use-cases" className="hover:text-gold-300">
            ← All use cases
          </Link>
        </nav>

        <div className="mt-4 flex flex-wrap items-center gap-2">
          <span
            className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.14em] ${a.chip} print:border-forest-300 print:bg-white print:text-forest-800`}
          >
            <span aria-hidden className="h-1.5 w-1.5 rounded-full bg-current opacity-70" />
            Use case 0{uc.number} · {uc.stakeholder}
          </span>
          <span
            className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.14em] ${a.chip} print:border-gold-300 print:bg-gold-50 print:text-gold-800`}
          >
            {uc.badge}
          </span>
        </div>

        <h1 className="mt-4 max-w-4xl font-serif text-3xl leading-tight md:text-5xl">
          {uc.title}
        </h1>
        <p className="mt-4 max-w-3xl text-sm leading-relaxed text-cream-200 md:text-base print:text-charcoal-600">
          {uc.audienceMoment}
        </p>

        <dl className="mt-8 grid gap-4 sm:grid-cols-3">
          <MetaField label="Region" value={uc.region} accent={a.eyebrow} />
          <MetaField label="Sector" value={uc.sector} accent={a.eyebrow} />
          <MetaField label="Headline metric" value={uc.headlineMetric} accent={a.eyebrow} />
        </dl>
      </div>
    </section>
  );
}

function MetaField({
  label,
  value,
  accent,
}: {
  label: string;
  value: string;
  accent: string;
}) {
  return (
    <div className="rounded-xl border border-white/15 bg-white/[0.05] p-4 backdrop-blur print:border-cream-200 print:bg-cream-50 print:backdrop-blur-none">
      <dt
        className={`text-[10px] font-semibold uppercase tracking-[0.18em] ${accent} print:text-gold-700`}
      >
        {label}
      </dt>
      <dd className="mt-1 text-sm font-medium text-cream-50 print:text-forest-900">{value}</dd>
    </div>
  );
}
