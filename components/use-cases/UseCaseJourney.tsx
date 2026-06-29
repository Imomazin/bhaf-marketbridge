import Link from "next/link";
import type { UseCase } from "@/data/use-cases";
import { PROTOTYPE_DISCLAIMER_SHORT } from "@/data/use-cases";
import { Reveal } from "@/components/ui/Reveal";
import { PrototypeDisclaimer } from "./PrototypeDisclaimer";

const accentClass: Record<
  UseCase["accent"],
  {
    bar: string;
    dot: string;
    stepBorder: string;
    eyebrow: string;
    chip: string;
    softBg: string;
  }
> = {
  forest: {
    bar: "bg-gradient-to-b from-forest-500 to-forest-200",
    dot: "bg-forest-700 ring-forest-100",
    stepBorder: "border-forest-100",
    eyebrow: "text-forest-700",
    chip: "border-forest-200 bg-forest-50 text-forest-800",
    softBg: "bg-forest-50/40",
  },
  gold: {
    bar: "bg-gradient-to-b from-gold-500 to-gold-200",
    dot: "bg-gold-600 ring-gold-100",
    stepBorder: "border-gold-100",
    eyebrow: "text-gold-700",
    chip: "border-gold-200 bg-gold-50 text-gold-800",
    softBg: "bg-gold-50/40",
  },
  navy: {
    bar: "bg-gradient-to-b from-blue-500 to-blue-200",
    dot: "bg-blue-700 ring-blue-100",
    stepBorder: "border-blue-100",
    eyebrow: "text-blue-700",
    chip: "border-blue-200 bg-blue-50 text-blue-800",
    softBg: "bg-blue-50/30",
  },
};

export function UseCaseJourney({ uc, extra }: { uc: UseCase; extra?: React.ReactNode }) {
  const a = accentClass[uc.accent];
  return (
    <section
      id={`use-case-${uc.number}`}
      className={`scroll-mt-24 border-t border-cream-200 py-16 md:py-20 ${a.softBg}`}
    >
      <div className="container-edge max-w-6xl">
        <Reveal>
          <header className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
            <div>
              <p className={`text-[11px] font-semibold uppercase tracking-[0.2em] ${a.eyebrow}`}>
                Use case 0{uc.number} · {uc.stakeholder}
              </p>
              <h2 className="mt-2 font-serif text-2xl text-forest-900 md:text-4xl">{uc.title}</h2>
              <p className="mt-2 max-w-3xl text-sm text-charcoal-600">{uc.audienceMoment}</p>
            </div>
            <span
              className={`inline-flex w-fit items-center gap-1.5 rounded-full border px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.14em] ${a.chip}`}
            >
              <span aria-hidden className="h-1.5 w-1.5 rounded-full bg-current opacity-70" />
              {uc.badge}
            </span>
          </header>
        </Reveal>

        <PrototypeDisclaimer text={PROTOTYPE_DISCLAIMER_SHORT} variant="badge" className="mt-4" />

        {/* Challenge + Scenario */}
        <div className="mt-8 grid gap-5 md:grid-cols-2">
          <Reveal>
            <div className="card p-6">
              <p className={`text-[10px] font-semibold uppercase tracking-[0.18em] ${a.eyebrow}`}>
                The challenge
              </p>
              <p className="mt-3 text-sm leading-relaxed text-charcoal-700">{uc.challenge}</p>
            </div>
          </Reveal>
          <Reveal delayMs={80}>
            <div className="card p-6">
              <p className={`text-[10px] font-semibold uppercase tracking-[0.18em] ${a.eyebrow}`}>
                Prototype scenario
              </p>
              <p className="mt-3 text-sm leading-relaxed text-charcoal-700">{uc.scenario}</p>
            </div>
          </Reveal>
        </div>

        {/* Optional extra (e.g. entrepreneur profile card, supplier comparison) */}
        {extra && <div className="mt-8">{extra}</div>}

        {/* Journey timeline */}
        <Reveal>
          <div className="mt-10">
            <h3 className="font-serif text-lg text-forest-900">MarketBridge journey</h3>
            <ol className="mt-5 relative">
              <span
                aria-hidden
                className={`absolute left-3 top-1.5 bottom-1.5 w-px ${a.bar}`}
              />
              <div className="space-y-4">
                {uc.journey.map((step, i) => (
                  <li
                    key={step.label}
                    className={`relative flex gap-4 rounded-xl border ${a.stepBorder} bg-white p-4 pl-10 shadow-soft`}
                  >
                    <span
                      aria-hidden
                      className={`absolute left-1.5 top-4 inline-flex h-3 w-3 items-center justify-center rounded-full ${a.dot} ring-4`}
                    />
                    <span className="absolute left-[3.25rem] top-3.5 text-[10px] font-semibold uppercase tracking-[0.14em] text-charcoal-400">
                      Step {String(i + 1).padStart(2, "0")}
                    </span>
                    <div className="flex-1 pt-5 md:pt-0 md:pl-32">
                      <p className="text-sm font-semibold text-forest-900">{step.label}</p>
                      <p className="mt-0.5 text-[13px] leading-relaxed text-charcoal-600">
                        {step.detail}
                      </p>
                    </div>
                  </li>
                ))}
              </div>
            </ol>
          </div>
        </Reveal>

        {/* Features used + Expected value */}
        <div className="mt-10 grid gap-6 md:grid-cols-2">
          <Reveal>
            <div className="card p-6">
              <p className={`text-[10px] font-semibold uppercase tracking-[0.18em] ${a.eyebrow}`}>
                Platform features used
              </p>
              <ul className="mt-4 flex flex-wrap gap-2">
                {uc.featuresUsed.map((f) => {
                  const inner = (
                    <span
                      className={`inline-flex items-center gap-1.5 rounded-full border ${a.chip} px-3 py-1.5 text-[12px] font-medium transition hover:shadow-soft`}
                    >
                      <span aria-hidden className="h-1.5 w-1.5 rounded-full bg-current opacity-70" />
                      {f.name}
                    </span>
                  );
                  return (
                    <li key={f.name}>
                      {f.href ? (
                        <Link href={f.href} className="inline-block">
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
          </Reveal>
          <Reveal delayMs={80}>
            <div className="card p-6">
              <p className={`text-[10px] font-semibold uppercase tracking-[0.18em] ${a.eyebrow}`}>
                Expected value created
              </p>
              <ul className="mt-4 space-y-2 text-sm text-charcoal-700">
                {uc.expectedValuesList.map((v) => (
                  <li key={v} className="flex items-start gap-2">
                    <span aria-hidden className="gold-dot mt-1.5" />
                    <span className="leading-relaxed">{v}</span>
                  </li>
                ))}
              </ul>
            </div>
          </Reveal>
        </div>

        {/* Metric tiles */}
        <Reveal>
          <div className="mt-10">
            <div className="flex items-end justify-between">
              <div>
                <p className={`text-[10px] font-semibold uppercase tracking-[0.18em] ${a.eyebrow}`}>
                  Suggested demo metrics
                </p>
                <h3 className="mt-1 font-serif text-lg text-forest-900">
                  Prototype metric tiles
                </h3>
              </div>
              <PrototypeDisclaimer text={PROTOTYPE_DISCLAIMER_SHORT} variant="badge" />
            </div>
            <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {uc.suggestedMetrics.map((m) => (
                <div
                  key={m.label}
                  className={`rounded-xl border ${a.stepBorder} bg-white p-4 shadow-soft`}
                >
                  <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-charcoal-500">
                    {m.label}
                  </p>
                  <p className="mt-1.5 text-sm font-semibold text-forest-900">{m.value}</p>
                </div>
              ))}
            </div>
          </div>
        </Reveal>

        {/* CTA strip */}
        <Reveal>
          <div className="mt-12 flex flex-col items-start justify-between gap-3 rounded-2xl border border-cream-200 bg-white p-5 md:flex-row md:items-center">
            <div>
              <p className={`text-[10px] font-semibold uppercase tracking-[0.18em] ${a.eyebrow}`}>
                What the audience should see
              </p>
              <p className="mt-1 text-sm text-charcoal-700">{uc.audienceMoment}</p>
            </div>
            <Link href={uc.cta.href} className="btn-secondary !py-2 !px-4 text-xs whitespace-nowrap">
              {uc.cta.label} →
            </Link>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
