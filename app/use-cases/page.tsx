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
import { ComparisonBlock } from "@/components/use-cases/ComparisonBlock";
import { MockUIPeek } from "@/components/use-cases/MockUIPeek";
import { FeatureValueMap } from "@/components/use-cases/FeatureValueMap";
import { DemoFlow } from "@/components/use-cases/DemoFlow";
import { UseCasesCTA } from "@/components/use-cases/UseCasesCTA";
import { LiveMetricRibbon } from "@/components/use-cases/LiveMetricRibbon";
import { StickyJourneyNav } from "@/components/use-cases/StickyJourneyNav";
import { ImpactProjector } from "@/components/use-cases/ImpactProjector";
import { StickyCTABar } from "@/components/use-cases/StickyCTABar";
import { PartnerRail } from "@/components/use-cases/PartnerRail";
import { QuoteCarousel } from "@/components/use-cases/QuoteCarousel";

export const metadata: Metadata = {
  title: "Use Cases · Prototype MVP demonstration",
  description:
    "Three demonstrator journeys plus an interactive impact projector showing how MarketBridge can unlock capital, contracts and credibility for women-led enterprises.",
};

export const dynamic = "force-dynamic";

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

      {/* Live metric ribbon — pulls real DB counts to prove the platform is live */}
      <LiveMetricRibbon />

      {/* Programme partner category rail */}
      <PartnerRail />

      {/* Sticky scroll-spy navigator */}
      <StickyJourneyNav />

      {/* Use-case overview cards */}
      <section id="use-cases-overview" className="scroll-mt-28 bg-cream-50 py-16 md:py-20">
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

      {/* Use case 1 — Entrepreneur */}
      <UseCaseJourney
        uc={useCases[0]}
        extra={
          <div className="space-y-6">
            <EntrepreneurProfileCard />
            <div className="grid gap-6 lg:grid-cols-[1.1fr_1fr]">
              <MockUIPeek variant="entrepreneur" />
              <ComparisonBlock rows={useCases[0].comparison} accent={useCases[0].accent} />
            </div>
          </div>
        }
      />

      {/* Use case 2 — Corporate RFP */}
      <UseCaseJourney
        uc={useCases[1]}
        extra={
          <div className="space-y-6">
            <SupplierComparisonTable />
            <div className="grid gap-6 lg:grid-cols-[1.1fr_1fr]">
              <MockUIPeek variant="buyer" />
              <ComparisonBlock rows={useCases[1].comparison} accent={useCases[1].accent} />
            </div>
          </div>
        }
      />

      {/* Use case 3 — Funder */}
      <UseCaseJourney
        uc={useCases[2]}
        extra={
          <div className="space-y-6">
            <EvidenceReadiness />
            <div className="grid gap-6 lg:grid-cols-[1.1fr_1fr]">
              <MockUIPeek variant="funder" />
              <ComparisonBlock rows={useCases[2].comparison} accent={useCases[2].accent} />
            </div>
          </div>
        }
      />

      {/* Interactive Impact Projector */}
      <ImpactProjector />

      {/* Placeholder testimonial carousel */}
      <QuoteCarousel />

      {/* Feature → value mapping */}
      <FeatureValueMap />

      {/* How the demo flows */}
      <DemoFlow />

      {/* Final CTA */}
      <UseCasesCTA />

      {/* Floating CTA bar that appears once user has scrolled past the hero */}
      <StickyCTABar />
    </>
  );
}
