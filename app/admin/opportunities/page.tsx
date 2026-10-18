import Link from "next/link";
import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { DB_ENABLED } from "@/lib/db";
import { listOpportunitiesForAdmin } from "@/lib/queries/opportunityAdmin";
import { cn } from "@/lib/utils";

export const metadata = { title: "Opportunities · BHAF Admin" };
export const dynamic = "force-dynamic";

export default async function AdminOpportunitiesPage() {
  const session = await auth();
  if (!session?.user) redirect("/auth/sign-in?next=/admin/opportunities");
  if (session.user.role !== "ADMIN" && session.user.role !== "AUDITOR") redirect("/");

  const rows = DB_ENABLED ? await listOpportunitiesForAdmin() : [];

  return (
    <section className="bg-cream-50 py-12 md:py-16">
      <div className="container-edge max-w-5xl">
        <Link href="/admin" className="text-xs font-medium text-forest-700 hover:text-gold-700">
          ← Admin dashboard
        </Link>
        <div className="mt-4 flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-gold-700">Admin</p>
            <h1 className="mt-2 font-serif text-3xl text-forest-900 md:text-4xl">Opportunities</h1>
            <p className="mt-2 text-sm text-charcoal-500">
              Grants, investments and calls published to the opportunity board.
            </p>
          </div>
          <Link href="/admin/opportunities/new" className="btn-primary !py-2 !px-3 text-xs">
            New opportunity
          </Link>
        </div>

        {!DB_ENABLED && (
          <div className="card mt-8 p-6 text-sm text-charcoal-500">
            Database not configured — opportunity management runs against live data only.
          </div>
        )}

        {DB_ENABLED && rows.length === 0 && (
          <div className="card mt-8 p-10 text-center text-sm text-charcoal-500">
            No opportunities yet.{" "}
            <Link href="/admin/opportunities/new" className="font-medium text-forest-700 hover:text-gold-700">
              Create the first one
            </Link>
            .
          </div>
        )}

        {rows.length > 0 && (
          <div className="card mt-6 overflow-x-auto p-0">
            <table className="w-full min-w-[640px] text-left text-sm">
              <thead>
                <tr className="border-b border-cream-200 text-[11px] uppercase tracking-wide text-charcoal-400">
                  <th className="px-4 py-3">Title</th>
                  <th className="px-4 py-3">Type</th>
                  <th className="px-4 py-3">Status</th>
                  <th className="px-4 py-3">Applicants</th>
                  <th className="px-4 py-3">Deadline</th>
                  <th className="px-4 py-3" />
                </tr>
              </thead>
              <tbody className="divide-y divide-cream-200">
                {rows.map((o) => (
                  <tr key={o.id}>
                    <td className="px-4 py-3">
                      <p className="font-medium text-forest-900">{o.title}</p>
                      <p className="text-xs text-charcoal-500">{o.organisation}</p>
                    </td>
                    <td className="px-4 py-3 text-charcoal-600">{o.type.toLowerCase()}</td>
                    <td className="px-4 py-3">
                      <span
                        className={cn(
                          "rounded-full border px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wider",
                          o.published
                            ? "border-forest-200 bg-forest-50 text-forest-800"
                            : "border-cream-300 bg-cream-100 text-charcoal-500",
                        )}
                      >
                        {o.published ? "Published" : "Draft"}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-charcoal-600">{o.applicantCount}</td>
                    <td className="px-4 py-3 text-charcoal-400">
                      {o.deadline ? o.deadline.toISOString().slice(0, 10) : "Rolling"}
                    </td>
                    <td className="px-4 py-3 text-right">
                      <Link
                        href={`/admin/opportunities/${o.id}`}
                        className="rounded-md border border-cream-300 px-3 py-1.5 text-xs font-medium text-charcoal-600 hover:border-forest-700 hover:text-forest-900"
                      >
                        Manage
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </section>
  );
}
