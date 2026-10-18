import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { auth } from "@/auth";
import { DB_ENABLED } from "@/lib/db";
import { getOpportunityForAdmin } from "@/lib/queries/opportunityAdmin";
import { OpportunityPublishToggle } from "@/components/admin/OpportunityPublishToggle";
import { OpportunityDeleteButton } from "@/components/admin/OpportunityDeleteButton";
import { NewOpportunityForm } from "@/components/opportunities/NewOpportunityForm";
import { ApplicationActions } from "@/components/admin/ApplicationActions";
import { cn } from "@/lib/utils";

export const dynamic = "force-dynamic";

const statusTone: Record<string, string> = {
  SUBMITTED: "bg-cream-100 text-charcoal-600 border-cream-300",
  UNDER_REVIEW: "bg-blue-50 text-[#0d2840] border-blue-200",
  SHORTLISTED: "bg-gold-50 text-gold-800 border-gold-200",
  REJECTED: "bg-red-50 text-red-700 border-red-200",
  WITHDRAWN: "bg-cream-100 text-charcoal-500 border-cream-300",
  AWARDED: "bg-forest-50 text-forest-800 border-forest-200",
};

export default async function AdminOpportunityDetailPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ q?: string; status?: string; page?: string }>;
}) {
  const session = await auth();
  if (!session?.user) redirect("/auth/sign-in?next=/admin/opportunities");
  if (session.user.role !== "ADMIN" && session.user.role !== "AUDITOR") redirect("/");

  const [{ id }, query] = await Promise.all([params, searchParams]);
  const page = Math.max(1, parseInt(query.page || "1", 10));

  if (!DB_ENABLED) {
    return (
      <section className="bg-cream-50 py-12 md:py-16">
        <div className="container-edge max-w-3xl">
          <div className="card p-10 text-center text-sm text-charcoal-500">Database not configured.</div>
        </div>
      </section>
    );
  }

  const opp = await getOpportunityForAdmin(id, {
    search: query.q,
    status: query.status,
    page,
    pageSize: 10,
  });
  if (!opp) notFound();

  // For building pagination/filter links
  const buildHref = (overrides: Record<string, string | undefined>) => {
    const p = new URLSearchParams();
    if (query.q) p.set("q", query.q);
    if (query.status) p.set("status", query.status);
    if (page > 1) p.set("page", page.toString());
    
    Object.entries(overrides).forEach(([k, v]) => {
      if (v === undefined) p.delete(k);
      else p.set(k, v);
    });

    return `/admin/opportunities/${id}?${p.toString()}`;
  };

  return (
    <section className="bg-cream-50 py-12 md:py-16">
      <div className="container-edge max-w-4xl">
        <Link href="/admin/opportunities" className="text-xs font-medium text-forest-700 hover:text-gold-700">
          ← Opportunities
        </Link>

        <div className="mt-4 flex flex-wrap items-center justify-between gap-4">
          <div>
            <div className="flex flex-wrap items-center gap-3">
              <span
                className={cn(
                  "rounded-full border px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wider",
                  opp.published
                    ? "border-forest-200 bg-forest-50 text-forest-800"
                    : "border-cream-300 bg-cream-100 text-charcoal-500",
                )}
              >
                {opp.published ? "Published" : "Draft"}
              </span>
              <span className="text-[11px] font-semibold uppercase tracking-[0.18em] text-gold-700">{opp.type}</span>
            </div>
            <h1 className="mt-2 font-serif text-3xl text-forest-900 md:text-4xl">{opp.title}</h1>
            <p className="mt-1 text-sm text-charcoal-500">
              {opp.organisation}
            </p>
          </div>
          <div className="flex items-center gap-2">
            <OpportunityPublishToggle id={opp.id} published={opp.published} />
            <OpportunityDeleteButton id={opp.id} title={opp.title} applicantCount={opp.totalApplications ?? 0} />
          </div>
        </div>

        <div className="card mt-6 p-6">
          <h2 className="font-serif text-lg text-forest-900">Edit</h2>
          <div className="mt-4">
            <NewOpportunityForm
              opportunityId={opp.id}
              initial={{
                title: opp.title,
                organisation: opp.organisation,
                type: opp.type,
                region: opp.region ?? undefined,
                amount: opp.amount ?? undefined,
                deadline: opp.deadline ? opp.deadline.toISOString().slice(0, 10) : undefined,
                description: opp.description,
                eligibility: opp.eligibility.join("\n"),
              }}
            />
          </div>
        </div>

        <div className="card mt-6 p-6">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <h2 className="font-serif text-lg text-forest-900">Applicants ({opp.totalApplications})</h2>
          </div>

          <div className="mt-4 flex flex-wrap items-center justify-between gap-4">
            <form action={`/admin/opportunities/${id}`} className="flex w-full max-w-sm items-center gap-2">
              {query.status && <input type="hidden" name="status" value={query.status} />}
              <input
                type="text"
                name="q"
                defaultValue={query.q}
                placeholder="Search by name or email..."
                className="input-field"
              />
              <button type="submit" className="btn-primary py-2 text-xs">
                Search
              </button>
            </form>

            <div className="flex flex-wrap items-center gap-2">
              <span className="text-[10px] font-semibold uppercase tracking-wider text-charcoal-400">Status:</span>
              <Link
                href={buildHref({ status: undefined, page: "1" })}
                className={cn(
                  "rounded-full px-3 py-1 text-[10px] font-medium uppercase tracking-wider",
                  !query.status ? "bg-forest-800 text-cream-50" : "border border-cream-300 text-charcoal-600 hover:border-forest-700",
                )}
              >
                All
              </Link>
              {Object.keys(statusTone).map((s) => (
                <Link
                  key={s}
                  href={buildHref({ status: s, page: "1" })}
                  className={cn(
                    "rounded-full px-3 py-1 text-[10px] font-medium uppercase tracking-wider",
                    query.status === s ? "bg-forest-800 text-cream-50" : "border border-cream-300 text-charcoal-600 hover:border-forest-700",
                  )}
                >
                  {s.toLowerCase().replace(/_/g, " ")}
                </Link>
              ))}
            </div>
          </div>

          {opp.applications.length === 0 ? (
            <div className="mt-8 rounded-lg border border-dashed border-cream-300 p-8 text-center">
              <p className="text-sm text-charcoal-500">No applications match your criteria.</p>
            </div>
          ) : (
            <>
              <div className="mt-6 overflow-x-auto rounded-lg border border-cream-200">
                <table className="w-full min-w-[700px] text-left text-sm">
                  <thead>
                    <tr className="border-b border-cream-200 bg-cream-50 text-[11px] uppercase tracking-wide text-charcoal-400">
                      <th className="px-4 py-3 font-semibold">Applicant</th>
                      <th className="px-4 py-3 font-semibold">Date Applied</th>
                      <th className="px-4 py-3 font-semibold">Status</th>
                      <th className="px-4 py-3 font-semibold">Note</th>
                      <th className="px-4 py-3 text-right font-semibold">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-cream-200">
                    {opp.applications.map((a) => (
                      <tr key={a.id} className="hover:bg-cream-50/50">
                        <td className="px-4 py-4">
                          <p className="font-medium text-forest-900">{a.user.name ?? a.user.email}</p>
                          <p className="text-xs text-charcoal-500">{a.user.email}</p>
                        </td>
                        <td className="px-4 py-4 text-charcoal-600">
                          {a.createdAt.toISOString().slice(0, 10)}
                        </td>
                        <td className="px-4 py-4">
                          <span className={cn("rounded-full border px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wider whitespace-nowrap", statusTone[a.status])}>
                            {a.status.toLowerCase().replace(/_/g, " ")}
                          </span>
                        </td>
                        <td className="px-4 py-4 max-w-[200px]">
                          {a.coverNote ? (
                            <p className="truncate text-xs text-charcoal-500" title={a.coverNote}>
                              {a.coverNote}
                            </p>
                          ) : (
                            <span className="text-charcoal-300">—</span>
                          )}
                        </td>
                        <td className="px-4 py-4 text-right">
                          <ApplicationActions applicationId={a.id} currentStatus={a.status} />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {opp.totalPages > 1 && (
                <div className="mt-6 flex items-center justify-between border-t border-cream-200 pt-4">
                  <p className="text-xs text-charcoal-500">
                    Showing page {page} of {opp.totalPages}
                  </p>
                  <div className="flex gap-2">
                    {page > 1 ? (
                      <Link href={buildHref({ page: (page - 1).toString() })} className="btn-secondary px-3 py-1 text-xs">
                        Previous
                      </Link>
                    ) : (
                      <button disabled className="btn-secondary px-3 py-1 text-xs opacity-50 cursor-not-allowed">
                        Previous
                      </button>
                    )}
                    {page < opp.totalPages ? (
                      <Link href={buildHref({ page: (page + 1).toString() })} className="btn-secondary px-3 py-1 text-xs">
                        Next
                      </Link>
                    ) : (
                      <button disabled className="btn-secondary px-3 py-1 text-xs opacity-50 cursor-not-allowed">
                        Next
                      </button>
                    )}
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </section>
  );
}
