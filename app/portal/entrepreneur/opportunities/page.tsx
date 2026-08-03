import { redirect } from "next/navigation";
import Link from "next/link";
import { auth } from "@/auth";
import { PortalSidebar } from "@/components/layout/PortalSidebar";
import { OpportunityCard } from "@/components/cards/OpportunityCard";
import { loadOpportunities } from "@/lib/queries/opportunities";
import { getEntrepreneurNav } from "@/lib/portalNav";
import { normalizeSearchParam } from "@/lib/searchParams";

export const metadata = { title: "Opportunities · BHAF MarketBridge" };
export const dynamic = "force-dynamic";

const types = ["All types", "Grant", "Investment", "Procurement", "Programme", "Certification", "Government"];

export default async function EntrepreneurOpportunitiesPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string | string[]; type?: string | string[] }>;
}) {
  const session = await auth();
  if (!session?.user) redirect("/auth/sign-in?next=/portal/entrepreneur/opportunities");

  const resolved = await searchParams;
  const filters = {
    q: normalizeSearchParam(resolved.q),
    type: normalizeSearchParam(resolved.type),
  };
  const { opportunities } = await loadOpportunities(filters);

  return (
    <div className="flex min-h-screen flex-col lg:flex-row">
      <PortalSidebar currentRole="entrepreneur" nav={getEntrepreneurNav("/portal/entrepreneur/opportunities")} />

      <section className="flex-1 bg-cream-50 py-12 md:py-16">
        <div className="container-edge lg:px-8">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-gold-700">Opportunity board</p>
              <h1 className="mt-2 font-serif text-3xl text-forest-900 md:text-4xl">Opportunities</h1>
              <p className="mt-2 max-w-2xl text-sm text-charcoal-500">
                Apply directly from this page. Successful demo applications also appear in your entrepreneur workspace
                and the admin application list.
              </p>
            </div>
            <Link href="/portal/entrepreneur/applications" className="btn-secondary !px-3 !py-2 text-xs">
              View my applications
            </Link>
          </div>

          <form action="/portal/entrepreneur/opportunities" method="GET" className="card mt-8 flex flex-wrap items-center gap-3 p-4">
            <input
              type="text"
              name="q"
              defaultValue={filters.q ?? ""}
              placeholder="Search opportunities"
              className="min-w-[200px] flex-1 rounded-md border border-cream-300 bg-cream-50 px-3 py-2 text-sm text-forest-900 placeholder:text-charcoal-300 focus:border-forest-700 focus:outline-none"
            />
            <select
              name="type"
              defaultValue={filters.type ?? "All types"}
              className="rounded-md border border-cream-300 bg-cream-50 px-3 py-2 text-sm text-forest-900 focus:border-forest-700 focus:outline-none"
            >
              {types.map((type) => (
                <option key={type}>{type}</option>
              ))}
            </select>
            <button type="submit" className="btn-primary !px-4 !py-2 text-xs">
              Search
            </button>
          </form>

          <div className="mt-6 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            {opportunities.map((opportunity) => (
              <OpportunityCard key={opportunity.id} opportunity={opportunity} />
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
