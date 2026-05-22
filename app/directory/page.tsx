import { SectionHeader } from "@/components/ui/SectionHeader";
import { EntrepreneurCard } from "@/components/cards/EntrepreneurCard";
import { entrepreneurs } from "@/data/entrepreneurs";

const sectors = ["All sectors", "Circular Economy", "Clean Energy", "Agri-Processing", "Health & Beauty", "Technology", "Education"];
const countries = ["All countries", "Nigeria", "South Africa", "Senegal", "Kenya", "Zimbabwe", "Ghana"];
const readiness = ["All levels", "Emerging", "Developing", "Market-Ready", "Funding-Ready"];

export default function EntrepreneursPage() {
  return (
    <>
      <section className="border-b border-cream-200 bg-cream-50 py-16">
        <div className="container-edge">
          <SectionHeader
            eyebrow="Entrepreneur directory"
            title="A verified directory of African women entrepreneurs."
            description="Filter by sector, country and readiness level. Profiles surface ESG activity, funding needs and product or service offerings ready for partners."
          />
        </div>
      </section>

      <section className="bg-cream-50 pb-24">
        <div className="container-edge">
          <div className="card mb-10 grid gap-4 p-5 md:grid-cols-4">
            <div>
              <label className="text-[11px] font-semibold uppercase tracking-wide text-charcoal-400">Search</label>
              <input
                type="text"
                placeholder="Name, business or product"
                className="mt-1.5 w-full rounded-md border border-cream-200 bg-cream-50 px-3 py-2 text-sm text-forest-900 placeholder:text-charcoal-300 focus:border-forest-700 focus:outline-none"
              />
            </div>
            {[
              { label: "Sector", options: sectors },
              { label: "Country", options: countries },
              { label: "Readiness", options: readiness },
            ].map((filter) => (
              <div key={filter.label}>
                <label className="text-[11px] font-semibold uppercase tracking-wide text-charcoal-400">
                  {filter.label}
                </label>
                <select className="mt-1.5 w-full rounded-md border border-cream-200 bg-cream-50 px-3 py-2 text-sm text-forest-900 focus:border-forest-700 focus:outline-none">
                  {filter.options.map((opt) => (
                    <option key={opt}>{opt}</option>
                  ))}
                </select>
              </div>
            ))}
          </div>

          <div className="mb-6 flex items-center justify-between text-sm text-charcoal-500">
            <span>
              Showing <strong className="text-forest-900">{entrepreneurs.length}</strong> verified entrepreneurs
            </span>
            <span>Sorted by readiness level</span>
          </div>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {entrepreneurs.map((e) => (
              <EntrepreneurCard key={e.id} entrepreneur={e} />
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
