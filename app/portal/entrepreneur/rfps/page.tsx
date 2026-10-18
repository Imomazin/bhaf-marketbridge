import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { PortalSidebar } from "@/components/layout/PortalSidebar";
import { RfpCard } from "@/components/cards/RfpCard";
import { loadActiveRfps, getUserAppliedRfpIds } from "@/lib/queries/rfps";
import { getEntrepreneurNav } from "@/lib/portalNav";
import { normalizeSearchParam } from "@/lib/searchParams";

export const metadata = { title: "Active RFPs · BHAF MarketBridge" };
export const dynamic = "force-dynamic";

export default async function EntrepreneurRfpsPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string | string[]; category?: string | string[] }>;
}) {
  const session = await auth();
  if (!session?.user) redirect("/auth/sign-in?next=/portal/entrepreneur/rfps");

  const resolved = await searchParams;
  const filters = {
    q: normalizeSearchParam(resolved.q),
    category: normalizeSearchParam(resolved.category),
  };
  
  const [{ rfps }, appliedIds] = await Promise.all([
    loadActiveRfps(filters),
    getUserAppliedRfpIds(session.user.id),
  ]);

  return (
    <div className="flex min-h-screen flex-col lg:flex-row">
      <PortalSidebar currentRole="entrepreneur" nav={getEntrepreneurNav("/portal/entrepreneur/rfps")} />

      <section className="flex-1 bg-cream-50 py-12 md:py-16">
        <div className="container-edge lg:px-8">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-gold-700">Procurement Board</p>
              <h1 className="mt-2 font-serif text-3xl text-forest-900 md:text-4xl">Active RFPs</h1>
              <p className="mt-2 max-w-2xl text-sm text-charcoal-500">
                Review active sourcing requests and Request for Proposals (RFPs) posted by corporate partners. 
                Submit a response with pricing details to initiate procurement discussions.
              </p>
            </div>
          </div>

          <form action="/portal/entrepreneur/rfps" method="GET" className="card mt-8 flex flex-wrap items-center gap-3 p-4">
            <input
              type="text"
              name="q"
              defaultValue={filters.q ?? ""}
              placeholder="Search RFPs..."
              className="min-w-[200px] flex-1 rounded-md border border-cream-300 bg-cream-50 px-3 py-2 text-sm text-forest-900 placeholder:text-charcoal-300 focus:border-[#0d2840] focus:outline-none"
            />
            <button type="submit" className="btn-primary !px-4 !py-2 text-xs !bg-[#0d2840] hover:!bg-[#1a3a5a]">
              Search
            </button>
          </form>

          {rfps.length === 0 ? (
            <div className="mt-6 rounded-2xl border border-dashed border-cream-300 bg-white p-10 text-center text-sm text-charcoal-500">
              No active RFPs match your search. Check back soon.
            </div>
          ) : (
            <div className="mt-6 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
              {rfps.map((rfp) => (
                <RfpCard key={rfp.id} rfp={rfp} hasApplied={appliedIds.has(rfp.id)} />
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
