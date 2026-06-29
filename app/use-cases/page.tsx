import type { Metadata } from "next";
import { useCases, PROTOTYPE_DISCLAIMER_LONG } from "@/data/use-cases";
import { Reveal } from "@/components/ui/Reveal";
import { UseCasesHero } from "@/components/use-cases/UseCasesHero";
import { PrototypeDisclaimer } from "@/components/use-cases/PrototypeDisclaimer";
import { UseCaseCard } from "@/components/use-cases/UseCaseCard";
import { UseCaseJourney } from "@/components/use-cases/UseCaseJourney";
import { EntrepreneurProfileCard } from "@/components/use-cases/EntrepreneurProfileCard";
import { SupplierComparisonTable } from "@/components/use-cases/SupplierComparisonTable";
import { EvidenceReadiness } from "@/components/use-cases/EvidenceReadiness";
import { FeatureValueMap } from "@/components/use-cases/FeatureValueMap";
import { DemoFlow } from "@/components/use-cases/DemoFlow";
import { UseCasesCTA } from "@/components/use-cases/UseCasesCTA";

export const metadata: Metadata = {
  title: "Use Cases · Prototype MVP demonstration",
  description:
    "Three demonstrator journeys showing how MarketBridge can unlock capital, contracts and credibility for women-led enterprises across Africa.",
};

export default function UseCasesPage() {
  return (
    <>
      <UseCasesHero />

      {/* Disclaimer strip — visible immediately below the hero */}
      <section className="border-y border-gold-200/60 bg-cream-50">
        <div className="container-edge max-w-5xl py-4">
          <PrototypeDisclaimer text={PROTOTYPE_DISCLAIMER_LONG} />
        </div>
      </section>

      {/* Use-case overview cards */}
      <section className="bg-cream-50 py-16 md:py-20">
        <div className="container-edge max-w-6xl">
          <Reveal>
            <header className="max-w-3xl">
              <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-gold-700">
                Three demonstrator journeys
              </p>
              <h2 className="mt-2 font-serif text-2xl text-forest-900 md:text-3xl">
                Pick a stakeholder, see the simulated pathway
              </h2>
              <p className="mt-2 text-sm text-charcoal-600">
                Each use case is an illustrative MVP scenario built on platform features that
                already exist in MarketBridge — profiles, artefact validation, listings, RFPs, data
                rooms and impact reporting.
              </p>
            </header>
          </Reveal>

          <div className="mt-10 grid gap-5 lg:grid-cols-3">
            {useCases.map((uc, i) => (
              <Reveal key={uc.slug} delayMs={i * 80}>
                <UseCaseCard uc={uc} />
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Use case 1 — Entrepreneur, with profile card */}
      <UseCaseJourney uc={useCases[0]} extra={<EntrepreneurProfileCard />} />

      {/* Use case 2 — Corporate RFP, with supplier comparison */}
      <UseCaseJourney uc={useCases[1]} extra={<SupplierComparisonTable />} />

      {/* Use case 3 — Funder, with evidence readiness panel */}
      <UseCaseJourney uc={useCases[2]} extra={<EvidenceReadiness />} />

      {/* Feature → value mapping */}
      <FeatureValueMap />

      {/* How the demo flows */}
      <DemoFlow />

      {/* Final CTA */}
      <UseCasesCTA />
    </>
  );
}
