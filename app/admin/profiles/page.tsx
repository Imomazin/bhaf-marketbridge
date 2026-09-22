
import Link from "next/link";
import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { DB_ENABLED } from "@/lib/db";
import { listProfilesForReview, type ProfileReviewFilter } from "@/lib/queries/profileReview";
import { cn } from "@/lib/utils";

export const metadata = { title: "Profile review · BHAF Admin" };
export const dynamic = "force-dynamic";

const roleTone: Record<string, string> = {
  entrepreneur: "bg-forest-50 text-forest-800 border-forest-200",
  funder: "bg-gold-50 text-gold-800 border-gold-200",
  corporate: "bg-blue-50 text-[#0d2840] border-blue-200",
};

const statusTone: Record<string, string> = {
  PENDING: "bg-gold-50 text-gold-800 border-gold-200",
  PARTIALLY_APPROVED: "bg-blue-50 text-blue-800 border-blue-200",
  APPROVED: "bg-forest-50 text-forest-800 border-forest-200",
  REJECTED: "bg-red-50 text-red-800 border-red-200",
};

const statusLabel: Record<string, string> = {
  PENDING: "Pending Manual Review",
  PARTIALLY_APPROVED: "AI-Verified (Partially Approved)",
  APPROVED: "Approved",
  REJECTED: "Rejected / Flagged",
};

export default async function AdminProfileReviewPage(props: {
  searchParams: Promise<{ status?: string }>;
}) {
  const session = await auth();
  if (!session?.user) redirect("/auth/sign-in?next=/admin/profiles");
  if (session.user.role !== "ADMIN" && session.user.role !== "AUDITOR") redirect("/");

  const searchParams = await props.searchParams;
  const currentFilter = (searchParams.status?.toUpperCase() as ProfileReviewFilter) || "ALL";

  const validFilter: ProfileReviewFilter = [
    "ALL",
    "PENDING",
    "PARTIALLY_APPROVED",
    "REJECTED",
    "APPROVED",
  ].includes(currentFilter)
    ? currentFilter
    : "ALL";

  const rows = DB_ENABLED ? await listProfilesForReview(validFilter) : [];

  const tabs: { label: string; value: ProfileReviewFilter }[] = [
    { label: "All Profiles", value: "ALL" },
    { label: "Pending", value: "PENDING" },
    { label: "AI Partially Approved", value: "PARTIALLY_APPROVED" },
    { label: "Rejected / Flagged", value: "REJECTED" },
    { label: "Approved", value: "APPROVED" },
  ];

  return (
    <section className="bg-cream-50 py-12 md:py-16">
      <div className="container-edge max-w-4xl">
        <Link href="/admin" className="text-xs font-medium text-forest-700 hover:text-gold-700">
          ← Admin dashboard
        </Link>
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <p className="mt-4 text-[11px] font-semibold uppercase tracking-[0.18em] text-gold-700">Admin</p>
            <h1 className="mt-2 font-serif text-3xl text-forest-900 md:text-4xl">Profile Management & Reviews</h1>
            <p className="mt-2 text-sm text-charcoal-500">
              Review, approve, or inspect AI-verified and rejected submissions across the BHAF network.
            </p>
          </div>
          <div className="mt-4 flex flex-wrap items-center gap-2.5">
            <Link
              href="/admin/profiles/new-funder"
              className="rounded-md bg-forest-800 px-3.5 py-2 text-xs font-semibold text-cream-50 hover:bg-forest-700 transition shadow-sm"
            >
              + Onboard Funder
            </Link>
            <Link
              href="/admin/profiles/new-corporate"
              className="rounded-md border border-forest-800 bg-white px-3.5 py-2 text-xs font-semibold text-forest-800 hover:bg-cream-100 transition shadow-sm"
            >
              + Onboard Corporate
            </Link>
          </div>
        </div>

        {/* Filter Tabs */}
        <div className="mt-6 flex flex-wrap items-center gap-2 border-b border-cream-200 pb-3">
          {tabs.map((tab) => {
            const isActive = validFilter === tab.value;
            return (
              <Link
                key={tab.value}
                href={tab.value === "ALL" ? "/admin/profiles" : `/admin/profiles?status=${tab.value}`}
                className={cn(
                  "rounded-full px-3.5 py-1.5 text-xs font-medium transition",
                  isActive
                    ? "bg-forest-800 text-cream-50 shadow-sm"
                    : "bg-white text-charcoal-600 border border-cream-200 hover:border-forest-700 hover:text-forest-900"
                )}
              >
                {tab.label}
              </Link>
            );
          })}
        </div>

        {!DB_ENABLED && (
          <div className="card mt-8 p-6 text-sm text-charcoal-500">
            Database not configured — profile review runs against live data only.
          </div>
        )}

        {DB_ENABLED && rows.length === 0 && (
          <div className="card mt-8 p-10 text-center text-sm text-charcoal-500">
            No profiles found matching this filter.
          </div>
        )}

        {rows.length > 0 && (
          <ul className="mt-6 space-y-3">
            {rows.map((row) => (
              <li key={`${row.role}-${row.profileId}`} className="card flex flex-wrap items-center gap-4 p-5">
                <div className="flex flex-col gap-1.5">
                  <span className={cn("inline-block rounded-full border px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider", roleTone[row.role])}>
                    {row.role}
                  </span>
                  <span className={cn("inline-block rounded-full border px-2.5 py-0.5 text-[10px] font-semibold tracking-wide", statusTone[row.status])}>
                    {statusLabel[row.status] ?? row.status}
                  </span>
                </div>

                <div className="min-w-0 flex-1">
                  <p className="font-medium text-forest-900">{row.name}</p>
                  <p className="text-xs text-charcoal-500">
                    {row.orgLabel} · {row.email}
                  </p>
                  {row.rejectionReason && (
                    <div className="mt-2 rounded-md bg-red-50 p-2 text-xs text-red-700 border border-red-200">
                      <strong>AI / Review Note:</strong> {row.rejectionReason}
                    </div>
                  )}
                  <p className="mt-1 text-[11px] text-charcoal-400">
                    Updated {row.submittedAt.toISOString().slice(0, 10)}
                  </p>
                </div>

                <Link
                  href={`/admin/profiles/${row.role}/${row.profileId}`}
                  className="rounded-md border border-cream-300 px-3 py-1.5 text-xs font-medium text-charcoal-600 hover:border-forest-700 hover:text-forest-900"
                >
                  Inspect / Action
                </Link>
              </li>
            ))}
          </ul>
        )}
      </div>
    </section>
  );
}

