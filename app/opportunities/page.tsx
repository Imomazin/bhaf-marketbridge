import { PageHero } from "@/components/ui/PageHero";
import { OpportunityCard } from "@/components/cards/OpportunityCard";
import { AnnotatedPhoto } from "@/components/ui/AnnotatedPhoto";
import { Reveal } from "@/components/ui/Reveal";
import { loadOpportunities } from "@/lib/queries/opportunities";
import { photos } from "@/data/photos";

export const dynamic = "force-dynamic";

const types = ["All types", "Grant", "Investment", "Procurement", "Programme", "Certification", "Government"];

export default async function OpportunitiesPage({
  searchParams,
}: {
  searchParams: { q?: string; type?: string };
}) {
  const { opportunities, isReal } = await loadOpportunities(searchParams);

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
          <form className="card mb-10 flex flex-wrap items-center gap-3 p-4">
            <input
              type="text"
              name="q"
              defaultValue={searchParams.q ?? ""}
              placeholder="Search opportunities"
              className="flex-1 min-w-[200px] rounded-md border border-cream-300 bg-cream-50 px-3 py-2 text-sm text-forest-900 placeholder:text-charcoal-300 focus:border-forest-700 focus:outline-none"
            />
            <select
              name="type"
              defaultValue={searchParams.type ?? "All types"}
              className="rounded-md border border-cream-300 bg-cream-50 px-3 py-2 text-sm text-forest-900 focus:border-forest-700 focus:outline-none"
            >
              {types.map((t) => (
                <option key={t}>{t}</option>
              ))}
            </select>
            <button type="submit" className="btn-primary !py-2 !px-4 text-xs">Search</button>
            <a href="/opportunities" className="btn-secondary !py-2 !px-4 text-xs">Reset</a>
            <span className="ml-auto text-xs text-charcoal-500">
              <strong className="text-forest-900">{opportunities.length}</strong> open
              {!isReal && (
                <span className="ml-2 rounded-full bg-cream-100 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-charcoal-500">
                  Sample data
                </span>
              )}
            </span>
          </form>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {opportunities.map((o, idx) => (
              <Reveal key={o.id} delayMs={idx * 80}>
                <OpportunityCard opportunity={o} />
              </Reveal>
            ))}
          </div>

          <div className="mt-16 grid gap-6 md:grid-cols-2">
            <AnnotatedPhoto photo={photos.nyc3} tag="BHAF NYC Launch" caption="Where global stakeholders meet African women entrepreneurs." aspect="auto" className="min-h-[260px]" />
            <AnnotatedPhoto photo={photos.abuja5} tag="Abuja Accelerator" caption="Speakers framing opportunities for the Cohort 1 entrepreneurs." aspect="auto" className="min-h-[260px]" />
          </div>
        </div>
      </section>
    </>
  );
}
