import Link from "next/link";
import { Reveal } from "@/components/ui/Reveal";
import { EcosystemDiagram } from "./EcosystemDiagram";
import { StakeholderSwitcher } from "./StakeholderSwitcher";

const tags = [
  "Prototype scenarios",
  "Women-led enterprise pipeline",
  "Trust, data and market access",
];

const stakeholderChips: Array<{ label: string; tone: "forest" | "gold" | "navy" | "charcoal" }> = [
  { label: "Entrepreneur", tone: "forest" },
  { label: "Buyer", tone: "gold" },
  { label: "Funder", tone: "navy" },
  { label: "Impact evidence", tone: "charcoal" },
];

const toneClass: Record<string, string> = {
  forest: "border-forest-200 bg-forest-50 text-forest-800",
  gold: "border-gold-300 bg-gold-50 text-gold-800",
  navy: "border-blue-200 bg-blue-50 text-blue-800",
  charcoal: "border-cream-300 bg-cream-100 text-charcoal-700",
};

const miniMetrics = [
  { label: "Profile completed", hint: "Entrepreneur side" },
  { label: "Documents verified", hint: "Trust infrastructure" },
  { label: "Supplier matches", hint: "Buyer side" },
  { label: "Data room shared", hint: "Funder side" },
];

export function UseCasesHero() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-forest-900 via-forest-800 to-forest-900 text-cream-50">
      {/* decorative pattern */}
      <div
        aria-hidden
        className="absolute inset-0 opacity-[0.07]"
        style={{
          backgroundImage:
            "radial-gradient(circle at 1px 1px, rgba(255,255,255,0.6) 1px, transparent 0)",
          backgroundSize: "26px 26px",
        }}
      />
      <div
        aria-hidden
        className="pointer-events-none absolute -right-32 -top-32 h-96 w-96 rounded-full bg-gold-400/20 blur-3xl"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute -bottom-40 -left-20 h-96 w-96 rounded-full bg-gold-400/10 blur-3xl"
      />

      <div className="container-edge relative py-16 md:py-24">
        <div className="grid gap-12 lg:grid-cols-[1.15fr_1fr] lg:items-center">
          <Reveal>
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-gold-300">
                Use Cases · MVP demonstration
              </p>
              <h1 className="mt-3 font-serif text-3xl leading-tight md:text-5xl">
                Prototype Use Cases: How MarketBridge Can Unlock{" "}
                <span className="text-gold-300">Capital, Contracts and Credibility</span> for
                Women-Led Enterprises
              </h1>
              <p className="mt-5 max-w-2xl text-sm leading-relaxed text-cream-200 md:text-base">
                Three demonstrator journeys showing how verified profiles, structured procurement,
                controlled data rooms and impact reporting can connect women-led businesses to
                buyers, funders and ecosystem partners.
              </p>

              <ul className="mt-6 flex flex-wrap gap-2">
                {tags.map((t) => (
                  <li
                    key={t}
                    className="inline-flex items-center gap-1.5 rounded-full border border-gold-300/40 bg-white/5 px-3 py-1 text-[11px] font-medium tracking-wide text-cream-100 backdrop-blur"
                  >
                    <span aria-hidden className="h-1.5 w-1.5 rounded-full bg-gold-400" />
                    {t}
                  </li>
                ))}
              </ul>

              <div className="mt-8 flex flex-wrap gap-3">
                <Link href="#use-case-1" className="btn-gold !py-2.5 !px-5 text-xs">
                  Explore the use cases
                </Link>
                <Link
                  href="#impact-pathway"
                  className="inline-flex items-center justify-center rounded-md border border-cream-50/30 bg-white/5 px-5 py-2.5 text-xs font-medium text-cream-50 transition hover:bg-white/10"
                >
                  View the impact pathway
                </Link>
              </div>

              <StakeholderSwitcher />
            </div>
          </Reveal>

          {/* Animated ecosystem diagram */}
          <Reveal from="right" delayMs={120}>
            <div className="relative">
              {/* Stakeholder chip row above the diagram */}
              <div className="mb-4 flex flex-wrap gap-2">
                {stakeholderChips.map((c) => (
                  <span
                    key={c.label}
                    className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-[11px] font-semibold ${toneClass[c.tone]}`}
                  >
                    <span aria-hidden className="h-1.5 w-1.5 rounded-full bg-current opacity-70" />
                    {c.label}
                  </span>
                ))}
              </div>

              <div className="rounded-2xl border border-white/15 bg-white/[0.04] p-4 backdrop-blur">
                <EcosystemDiagram />
              </div>

              {/* Mini label strip */}
              <div className="mt-4 grid grid-cols-2 gap-2 sm:grid-cols-4">
                {miniMetrics.map((m) => (
                  <div
                    key={m.label}
                    className="rounded-lg border border-white/15 bg-white/[0.05] p-2.5 text-cream-50 backdrop-blur"
                  >
                    <p className="text-[10px] uppercase tracking-[0.14em] text-gold-300">
                      {m.hint}
                    </p>
                    <p className="mt-1 text-[12px] font-semibold leading-tight">{m.label}</p>
                  </div>
                ))}
              </div>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}

