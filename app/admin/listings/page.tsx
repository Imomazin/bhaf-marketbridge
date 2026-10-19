import Link from "next/link";
import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { prisma, DB_ENABLED } from "@/lib/db";
import { DeactivateListingButton } from "@/components/admin/DeactivateListingButton";
import { UnarchiveListingButton } from "@/components/admin/UnarchiveListingButton";
import { ApproveListingButton } from "@/components/admin/ApproveListingButton";
import { cn } from "@/lib/utils";

export const metadata = { title: "Marketplace Listings · BHAF Admin" };
export const dynamic = "force-dynamic";

export default async function AdminListingsPage() {
  const session = await auth();
  if (!session?.user) redirect("/auth/sign-in?next=/admin/listings");
  if (session.user.role !== "ADMIN" && session.user.role !== "AUDITOR") redirect("/");

  const rows = DB_ENABLED && prisma ? await prisma.listing.findMany({
    include: {
      owner: { select: { name: true, email: true } }
    },
    orderBy: { createdAt: "desc" }
  }) : [];

  return (
    <section className="bg-cream-50 py-12 md:py-16">
      <div className="container-edge max-w-6xl">
        <Link href="/admin" className="text-xs font-medium text-forest-700 hover:text-gold-700">
          ← Admin dashboard
        </Link>
        <div className="mt-4">
          <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-gold-700">Admin</p>
          <h1 className="mt-2 font-serif text-3xl text-forest-900 md:text-4xl">Marketplace Listings</h1>
          <p className="mt-2 text-sm text-charcoal-500">
            Monitor and moderate all products and services listed by entrepreneurs.
          </p>
        </div>

        {!DB_ENABLED && (
          <div className="card mt-8 p-6 text-sm text-charcoal-500">
            Database not configured — listing moderation requires a live database.
          </div>
        )}

        {DB_ENABLED && rows.length === 0 && (
          <div className="card mt-8 p-10 text-center text-sm text-charcoal-500">
            No listings on the platform yet.
          </div>
        )}

        {rows.length > 0 && (
          <div className="card mt-6 overflow-x-auto p-0">
            <table className="w-full min-w-[800px] text-left text-sm">
              <thead>
                <tr className="border-b border-cream-200 text-[11px] uppercase tracking-wide text-charcoal-400">
                  <th className="px-4 py-3">Listing</th>
                  <th className="px-4 py-3">Entrepreneur</th>
                  <th className="px-4 py-3">Category</th>
                  <th className="px-4 py-3">Status</th>
                  <th className="px-4 py-3">Created</th>
                  <th className="px-4 py-3" />
                </tr>
              </thead>
              <tbody className="divide-y divide-cream-200">
                {rows.map((o) => (
                  <tr key={o.id}>
                    <td className="px-4 py-3">
                      <p className="font-medium text-forest-900">{o.title}</p>
                    </td>
                    <td className="px-4 py-3">
                      <p className="text-charcoal-600">{o.owner.name || o.owner.email}</p>
                    </td>
                    <td className="px-4 py-3 text-charcoal-600">{o.category}</td>
                    <td className="px-4 py-3">
                      <span
                        className={cn(
                          "rounded-full border px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wider",
                          o.status === "PUBLISHED"
                            ? "border-forest-200 bg-forest-50 text-forest-800"
                            : o.status === "PENDING_REVIEW"
                            ? "border-gold-300 bg-gold-50 text-gold-800"
                            : "border-cream-300 bg-cream-100 text-charcoal-500",
                        )}
                      >
                        {o.status.replace("_", " ")}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-charcoal-400">
                      {o.createdAt.toISOString().slice(0, 10)}
                    </td>
                    <td className="px-4 py-3 text-right">
                      <div className="flex items-center justify-end gap-2">
                        {o.status === "PENDING_REVIEW" && (
                          <ApproveListingButton id={o.id} title={o.title} />
                        )}
                        {o.status === "ARCHIVED" ? (
                          <UnarchiveListingButton id={o.id} title={o.title} />
                        ) : (
                          <DeactivateListingButton id={o.id} title={o.title} />
                        )}
                      </div>
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
