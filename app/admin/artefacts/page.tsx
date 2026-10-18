import Link from "next/link";
import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { DB_ENABLED } from "@/lib/db";
import { listArtefactsForReview, type ArtefactReviewFilter } from "@/lib/queries/artefactReview";
import { cn } from "@/lib/utils";

export const metadata = { title: "Artefact reviews · BHAF Admin" };
export const dynamic = "force-dynamic";

const statusTone: Record<string, string> = {
  PENDING_REVIEW: "bg-gold-50 text-gold-800 border-gold-200",
  UNDER_REVIEW: "bg-gold-50 text-gold-800 border-gold-200",
  VALIDATED: "bg-forest-50 text-forest-800 border-forest-200",
  REJECTED: "bg-red-50 text-red-800 border-red-200",
  FLAGGED: "bg-red-50 text-red-800 border-red-200",
};

const statusLabel: Record<string, string> = {
  PENDING_REVIEW: "Pending Review",
  UNDER_REVIEW: "Under Review",
  VALIDATED: "AI-Validated",
  REJECTED: "Rejected",
  FLAGGED: "Flagged",
};

export default async function AdminArtefactsPage(props: {
  searchParams: Promise<{ status?: string }>;
}) {
  const session = await auth();
  if (!session?.user) redirect("/auth/sign-in?next=/admin/artefacts");
  if (session.user.role !== "ADMIN" && session.user.role !== "AUDITOR") redirect("/");

  const searchParams = await props.searchParams;
  const currentFilter = (searchParams.status?.toUpperCase() as ArtefactReviewFilter) || "ALL";

  const validFilter: ArtefactReviewFilter = [
    "ALL",
    "PENDING_REVIEW",
    "VALIDATED",
    "REJECTED",
    "FLAGGED",
  ].includes(currentFilter)
    ? currentFilter
    : "ALL";

  const rows = DB_ENABLED ? await listArtefactsForReview(validFilter) : [];

  const tabs: { label: string; value: ArtefactReviewFilter }[] = [
    { label: "All Documents", value: "ALL" },
    { label: "Pending", value: "PENDING_REVIEW" },
    { label: "AI Validated", value: "VALIDATED" },
    { label: "Rejected / Flagged", value: "REJECTED" },
  ];

  return (
    <section className="bg-cream-50 py-12 md:py-16">
      <div className="container-edge max-w-4xl">
        <Link href="/admin" className="text-xs font-medium text-forest-700 hover:text-gold-700">
          ← Admin dashboard
        </Link>
        <p className="mt-4 text-[11px] font-semibold uppercase tracking-[0.18em] text-gold-700">Admin</p>
        <h1 className="mt-2 font-serif text-3xl text-forest-900 md:text-4xl">Artefact & Document Reviews</h1>
        <p className="mt-2 text-sm text-charcoal-500">
          Inspect uploaded KYC documents, AI validation checks, and flagged submissions.
        </p>

        {/* Filter Tabs */}
        <div className="mt-6 flex flex-wrap items-center gap-2 border-b border-cream-200 pb-3">
          {tabs.map((tab) => {
            const isActive = validFilter === tab.value;
            return (
              <Link
                key={tab.value}
                href={tab.value === "ALL" ? "/admin/artefacts" : `/admin/artefacts?status=${tab.value}`}
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
            Database not configured — artefact review runs against live data only.
          </div>
        )}

        {DB_ENABLED && rows.length === 0 && (
          <div className="card mt-8 p-10 text-center text-sm text-charcoal-500">No documents found matching this filter.</div>
        )}

        {rows.length > 0 && (
          <ul className="mt-6 space-y-3">
            {rows.map((row) => (
              <li key={row.id} className="card flex flex-wrap items-center gap-4 p-5">
                <div className="flex flex-col gap-1">
                  <span className={cn("inline-block rounded-full border px-2.5 py-0.5 text-[10px] font-semibold tracking-wide", statusTone[row.status] || "bg-cream-100 text-charcoal-700")}>
                    {statusLabel[row.status] ?? row.status}
                  </span>
                </div>

                <div className="min-w-0 flex-1">
                  <p className="font-medium text-forest-900">{row.name}</p>
                  <p className="text-xs text-charcoal-500">
                    {row.category} · {row.userName} · {row.userEmail}
                  </p>
                  {row.rejectionReason && (
                    <div className="mt-2 rounded-md bg-red-50 p-2 text-xs text-red-700 border border-red-200">
                      <strong>AI Rejection Reason:</strong> {row.rejectionReason}
                    </div>
                  )}
                  <p className="mt-1 text-[11px] text-charcoal-400">
                    Uploaded {row.uploadedAt.toISOString().slice(0, 10)} · {row.checksPassed}/{row.checksTotal} auto-checks passed
                  </p>
                </div>
                <Link
                  href={`/admin/artefacts/${row.id}`}
                  className="rounded-md border border-cream-300 px-3 py-1.5 text-xs font-medium text-charcoal-600 hover:border-forest-700 hover:text-forest-900"
                >
                  Review Details
                </Link>
              </li>
            ))}
          </ul>
        )}
      </div>
    </section>
  );
}

