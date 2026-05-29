import { PageHero } from "@/components/ui/PageHero";
import { OpportunityCard } from "@/components/cards/OpportunityCard";
import { AnnotatedPhoto } from "@/components/ui/AnnotatedPhoto";
import { Reveal } from "@/components/ui/Reveal";
import { loadOpportunities } from "@/lib/queries/opportunities";
import { photos } from "@/data/photos";

export const dynamic = "force-dynamic";

const types = ["All types", "Grant", "Investment", "Procurement", "Programme", "Certification"];

export default async function OpportunitiesPage() {
  const { opportunities, isReal } = await loadOpportunities();
  return (
    <>
      <PageHero
        eyebrow="Opportunity board"
        title="Grants, investments, procurement and certification — curated for women entrepreneurs."
        description="BHAF and partners publish funding, market access and training opportunities here. Eligibility is matched against your MarketBridge profile."
        photo={photos.drc5}
        caption="DRC training cohort with completion certificates — every certification opens a new tier of opportunities on MarketBridge."
      />

      <section className="bg-cream-50 py-16">
        <div className="container-edge">
          <div className="card mb-10 flex flex-wrap items-center justify-between gap-4 p-4">
            <div className="flex flex-wrap items-center gap-2">
              {types.map((t, idx) => (
                <button
                  key={t}
                  className={
                    idx === 0
                      ? "rounded-full bg-forest-800 px-3.5 py-1.5 text-xs font-medium text-cream-50"
                      : "rounded-full border border-cream-300 px-3.5 py-1.5 text-xs font-medium text-charcoal-600 transition hover:border-forest-700 hover:text-forest-900"
                  }
                >
                  {t}
                </button>
              ))}
            </div>
            <span className="text-xs text-charcoal-500">
              <strong className="text-forest-900">{opportunities.length}</strong> open opportunities
              {!isReal && (
                <span className="ml-2 rounded-full bg-cream-100 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-charcoal-500">
                  Sample data
                </span>
              )}
            </span>
          </div>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {opportunities.map((o, idx) => (
              <Reveal key={o.id} delayMs={idx * 80}>
                <OpportunityCard opportunity={o} />
              </Reveal>
            ))}
          </div>

          <div className="mt-16 grid gap-6 md:grid-cols-2">
            <AnnotatedPhoto
              photo={photos.nyc3}
              tag="BHAF NYC Launch"
              caption="Where global stakeholders meet African women entrepreneurs — and partnership pipelines begin."
              aspect="auto"
              className="min-h-[260px]"
            />
            <AnnotatedPhoto
              photo={photos.abuja5}
              tag="Abuja Accelerator"
              caption="Speakers framing opportunities for the Cohort 1 entrepreneurs."
              aspect="auto"
              className="min-h-[260px]"
            />
          </div>
        </div>
      </section>
    </>
  );
}
