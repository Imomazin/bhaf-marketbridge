import Link from "next/link";
import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { DB_ENABLED } from "@/lib/db";
import { listPendingProfiles } from "@/lib/queries/profileReview";
import { cn } from "@/lib/utils";

export const metadata = { title: "Profile review · BHAF Admin" };
export const dynamic = "force-dynamic";

const roleTone: Record<string, string> = {
  entrepreneur: "bg-forest-50 text-forest-800 border-forest-200",
  funder: "bg-gold-50 text-gold-800 border-gold-200",
  corporate: "bg-blue-50 text-[#0d2840] border-blue-200",
};

export default async function AdminProfileReviewPage() {
  const session = await auth();
  if (!session?.user) redirect("/auth/sign-in?next=/admin/profiles");
  if (session.user.role !== "ADMIN" && session.user.role !== "AUDITOR") redirect("/");

  const rows = DB_ENABLED ? await listPendingProfiles() : [];

  return (
    <section className="bg-cream-50 py-12 md:py-16">
      <div className="container-edge max-w-4xl">
        <Link href="/admin" className="text-xs font-medium text-forest-700 hover:text-gold-700">
          ← Admin dashboard
        </Link>
        <p className="mt-4 text-[11px] font-semibold uppercase tracking-[0.18em] text-gold-700">Admin</p>
        <h1 className="mt-2 font-serif text-3xl text-forest-900 md:text-4xl">Pending profile approvals</h1>
        <p className="mt-2 text-sm text-charcoal-500">
          Entrepreneur, funder, and corporate profiles awaiting review before they go live.
        </p>

        {!DB_ENABLED && (
          <div className="card mt-8 p-6 text-sm text-charcoal-500">
            Database not configured — profile review runs against live data only.
          </div>
        )}

        {DB_ENABLED && rows.length === 0 && (
          <div className="card mt-8 p-10 text-center text-sm text-charcoal-500">
            Nothing waiting on review right now.
          </div>
        )}

        {rows.length > 0 && (
          <ul className="mt-6 space-y-3">
            {rows.map((row) => (
              <li key={`${row.role}-${row.profileId}`} className="card flex flex-wrap items-center gap-4 p-5">
                <span className={cn("rounded-full border px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wider", roleTone[row.role])}>
                  {row.role}
                </span>
                <div className="min-w-0 flex-1">
                  <p className="font-medium text-forest-900">{row.name}</p>
                  <p className="text-xs text-charcoal-500">
                    {row.orgLabel} · {row.email}
                  </p>
                  <p className="mt-1 text-[11px] text-charcoal-400">
                    Submitted {row.submittedAt.toISOString().slice(0, 10)}
                  </p>
                </div>
                <Link
                  href={`/admin/profiles/${row.role}/${row.profileId}`}
                  className="rounded-md border border-cream-300 px-3 py-1.5 text-xs font-medium text-charcoal-600 hover:border-forest-700 hover:text-forest-900"
                >
                  Review
                </Link>
              </li>
            ))}
          </ul>
        )}
      </div>
    </section>
  );
}
