import { PageHero } from "@/components/ui/PageHero";
import { OpportunityCard } from "@/components/cards/OpportunityCard";
import { AnnotatedPhoto } from "@/components/ui/AnnotatedPhoto";
import { Reveal } from "@/components/ui/Reveal";
import { loadOpportunities, getUserAppliedOpportunityIds } from "@/lib/queries/opportunities";
import { photos } from "@/data/photos";
import { normalizeSearchParam } from "@/lib/searchParams";
import { auth } from "@/auth";

export const dynamic = "force-dynamic";

const types = ["All types", "Grant", "Investment", "Procurement", "Programme", "Certification", "Government"];

export default async function OpportunitiesPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string | string[]; type?: string | string[] }>;
}) {
  const resolved = await searchParams;
  const filters = {
    q: normalizeSearchParam(resolved.q),
    type: normalizeSearchParam(resolved.type),
  };
  const session = await auth();
  const [{ opportunities, isReal }, appliedIds] = await Promise.all([
    loadOpportunities(filters),
    session?.user ? getUserAppliedOpportunityIds(session.user.id) : Promise.resolve(new Set<string>()),
  ]);

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
          <form action="/opportunities" method="GET" className="card mb-10 flex flex-wrap items-center gap-3 p-4">
            <input
              type="text"
              name="q"
              defaultValue={filters.q ?? ""}
              placeholder="Search opportunities"
              className="flex-1 min-w-[200px] rounded-md border border-cream-300 bg-cream-50 px-3 py-2 text-sm text-forest-900 placeholder:text-charcoal-300 focus:border-forest-700 focus:outline-none"
            />
            <select
              name="type"
              defaultValue={filters.type ?? "All types"}
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
              {!isReal && opportunities.length > 0 && (
                <span className="ml-2 rounded-full bg-cream-100 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-charcoal-500">
                  Sample data
                </span>
              )}
            </span>
          </form>

          {opportunities.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-cream-300 bg-white p-10 text-center text-sm text-charcoal-500">
              No opportunities match this filter yet. Check back soon.
            </div>
          ) : (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {opportunities.map((o, idx) => (
                <Reveal key={o.id} delayMs={idx * 80}>
                  <OpportunityCard opportunity={o} hasApplied={appliedIds.has(o.id)} />
                </Reveal>
              ))}
            </div>
          )}

          <div className="mt-16 grid gap-6 md:grid-cols-2">
            <AnnotatedPhoto photo={photos.nyc3} tag="BHAF NYC Launch" caption="Where global stakeholders meet African women entrepreneurs." aspect="auto" className="min-h-[260px]" />
            <AnnotatedPhoto photo={photos.abuja5} tag="Abuja Accelerator" caption="Speakers framing opportunities for the Cohort 1 entrepreneurs." aspect="auto" className="min-h-[260px]" />
          </div>
        </div>
      </section>
    </>
  );
}
