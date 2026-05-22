import { SectionHeader } from "@/components/ui/SectionHeader";
import { OpportunityCard } from "@/components/cards/OpportunityCard";
import { opportunities } from "@/data/opportunities";

const types = ["All types", "Grant", "Investment", "Procurement", "Programme", "Certification"];

export default function OpportunitiesPage() {
  return (
    <>
      <section className="border-b border-cream-200 bg-cream-50 py-16">
        <div className="container-edge">
          <SectionHeader
            eyebrow="Opportunity board"
            title="Grants, investments, procurement and certification — curated for women entrepreneurs."
            description="BHAF and partners publish funding, market access and training opportunities here. Eligibility is matched against your MarketBridge profile."
          />
        </div>
      </section>

      <section className="bg-cream-50 pb-24">
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
            </span>
          </div>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {opportunities.map((o) => (
              <OpportunityCard key={o.id} opportunity={o} />
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
