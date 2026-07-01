import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { useCases, PROTOTYPE_DISCLAIMER_LONG } from "@/data/use-cases";
import { PrototypeDisclaimer } from "@/components/use-cases/PrototypeDisclaimer";
import { UseCaseDetailHero } from "@/components/use-cases/UseCaseDetailHero";
import { DetailNarrative } from "@/components/use-cases/DetailNarrative";
import { UseCaseJourney } from "@/components/use-cases/UseCaseJourney";
import { ComparisonBlock } from "@/components/use-cases/ComparisonBlock";
import { MockUIPeek } from "@/components/use-cases/MockUIPeek";
import { EntrepreneurProfileCard } from "@/components/use-cases/EntrepreneurProfileCard";
import { SupplierComparisonTable } from "@/components/use-cases/SupplierComparisonTable";
import { EvidenceReadiness } from "@/components/use-cases/EvidenceReadiness";
import { PrintOnePagerButton } from "@/components/use-cases/PrintOnePagerButton";
import { RelatedUseCases } from "@/components/use-cases/RelatedUseCases";

export function generateStaticParams() {
  return useCases.map((u) => ({ slug: u.slug }));
}

export function generateMetadata({ params }: { params: { slug: string } }): Metadata {
  const uc = useCases.find((u) => u.slug === params.slug);
  if (!uc) return { title: "Use case not found" };
  return {
    title: `${uc.title} · Prototype use case`,
    description: uc.audienceMoment,
  };
}

function ExtraForSlug({ slug }: { slug: string }) {
  if (slug === "entrepreneur-market-access") {
    return (
      <div className="space-y-6">
        <EntrepreneurProfileCard />
        <MockUIPeek variant="entrepreneur" />
      </div>
    );
  }
  if (slug === "corporate-rfp-supplier-discovery") {
    return (
      <div className="space-y-6">
        <SupplierComparisonTable />
        <MockUIPeek variant="buyer" />
      </div>
    );
  }
  if (slug === "funder-due-diligence-impact") {
    return (
      <div className="space-y-6">
        <EvidenceReadiness />
        <MockUIPeek variant="funder" />
      </div>
    );
  }
  return null;
}

export default function UseCaseDetailPage({ params }: { params: { slug: string } }) {
  const uc = useCases.find((u) => u.slug === params.slug);
  if (!uc) notFound();

  return (
    <>
      <UseCaseDetailHero uc={uc} />

      {/* Disclaimer + print action */}
      <section className="border-y border-gold-200/60 bg-cream-50 print:hidden">
        <div className="container-edge max-w-6xl py-4">
          <div className="flex flex-col items-start justify-between gap-3 md:flex-row md:items-center">
            <PrototypeDisclaimer text={PROTOTYPE_DISCLAIMER_LONG} />
            <div className="flex flex-shrink-0 items-center gap-2">
              <PrintOnePagerButton />
              <Link
                href="/use-cases"
                className="text-[11px] font-medium text-forest-800 hover:text-gold-700"
              >
                ← All use cases
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Three-move story */}
      <DetailNarrative uc={uc} />

      {/* Full journey with the use-case-specific extras */}
      <UseCaseJourney uc={uc} extra={<ExtraForSlug slug={uc.slug} />} />

      {/* Without vs With comparison */}
      <section className="border-t border-cream-200 bg-white py-14 print:py-4">
        <div className="container-edge max-w-6xl">
          <ComparisonBlock rows={uc.comparison} accent={uc.accent} />
        </div>
      </section>

      {/* Related use cases (hidden in print) */}
      <RelatedUseCases currentSlug={uc.slug} />

      {/* Print footer — only visible on print */}
      <footer className="hidden border-t border-cream-200 py-4 text-center text-[10px] text-charcoal-500 print:block">
        BHAF MarketBridge · Prototype use case · {uc.title} · {new Date().toISOString().slice(0, 10)}
      </footer>
    </>
  );
}
