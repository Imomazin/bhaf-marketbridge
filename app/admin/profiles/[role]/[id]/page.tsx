import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { auth } from "@/auth";
import { prisma, DB_ENABLED } from "@/lib/db";
import { getProfileForReview, type ProfileRole } from "@/lib/queries/profileReview";
import { ProfileReviewActions } from "@/components/admin/ProfileReviewActions";
import { cn } from "@/lib/utils";

export const dynamic = "force-dynamic";

const VALID_ROLES: ProfileRole[] = ["entrepreneur", "funder", "corporate"];

const statusTone: Record<string, string> = {
  PENDING: "bg-gold-50 text-gold-800 border-gold-200",
  PARTIALLY_APPROVED: "bg-blue-50 text-blue-800 border-blue-200",
  APPROVED: "bg-forest-50 text-forest-800 border-forest-200",
  REJECTED: "bg-red-50 text-red-700 border-red-200",
};

export default async function AdminProfileReviewDetailPage({
  params,
}: {
  params: Promise<{ role: string; id: string }>;
}) {
  const session = await auth();
  if (!session?.user) redirect("/auth/sign-in?next=/admin/profiles");
  if (session.user.role !== "ADMIN" && session.user.role !== "AUDITOR") redirect("/");

  const { role: rawRole, id } = await params;
  if (!VALID_ROLES.includes(rawRole as ProfileRole)) notFound();
  const role = rawRole as ProfileRole;

  if (!DB_ENABLED || !prisma) {
    return (
      <section className="bg-cream-50 py-12 md:py-16">
        <div className="container-edge max-w-3xl">
          <div className="card p-10 text-center text-sm text-charcoal-500">Database not configured.</div>
        </div>
      </section>
    );
  }

  const profile = await getProfileForReview(role, id);
  if (!profile) notFound();

  const artefacts = await prisma.artefact.findMany({
    where: { userId: profile.user.id },
    select: { id: true, name: true, status: true, uploadedAt: true },
    orderBy: { uploadedAt: "desc" },
  });

  const orgLabel =
    "businessName" in profile ? profile.businessName : profile.orgName;

  return (
    <section className="bg-cream-50 py-12 md:py-16">
      <div className="container-edge max-w-3xl">
        <Link href="/admin/profiles" className="text-xs font-medium text-forest-700 hover:text-gold-700">
          ← Pending profiles
        </Link>

        <div className="mt-4 flex flex-wrap items-center gap-3">
          <span className={cn("rounded-full border px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wider", statusTone[profile.status])}>
            {profile.status}
          </span>
          <span className="text-[11px] font-semibold uppercase tracking-[0.18em] text-gold-700">
            {role} profile
          </span>
        </div>
        <h1 className="mt-2 font-serif text-3xl text-forest-900 md:text-4xl">{orgLabel}</h1>
        <p className="mt-1 text-sm text-charcoal-500">
          {profile.user.name ?? "—"} · {profile.user.email}
        </p>

        {profile.status === "REJECTED" && profile.rejectionReason && (
          <div className="mt-4 rounded-md border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800">
            <p className="text-[11px] font-semibold uppercase tracking-wide text-red-600">Previous rejection reason</p>
            <p className="mt-1">{profile.rejectionReason}</p>
            {profile.reviewedAt && (
              <p className="mt-1 text-[11px] text-red-500">Reviewed {profile.reviewedAt.toISOString().slice(0, 10)}</p>
            )}
          </div>
        )}

        <div className="card mt-6 p-6">
          <h2 className="font-serif text-lg text-forest-900">Submitted details</h2>
          <dl className="mt-4 grid gap-4 sm:grid-cols-2">
            {role === "entrepreneur" && "description" in profile && (
              <>
                <Field label="Country" value={profile.country} />
                <Field label="Sector" value={profile.sector} />
                <Field label="Readiness level" value={profile.readinessLevel} />
                <Field label="Year founded" value={profile.yearFounded ?? "—"} />
                <Field label="Funding need" value={profile.fundingNeed ?? "—"} full />
                <Field label="Description" value={profile.description} full />
                <Field label="ESG activity" value={profile.esgActivity ?? "—"} full />
              </>
            )}
            {role === "funder" && "mandate" in profile && (
              <>
                <Field label="Mandate" value={profile.mandate} full />
                <Field label="Geo focus" value={profile.geoFocus.join(", ") || "—"} />
                <Field label="Sector focus" value={profile.sectorFocus.join(", ") || "—"} />
                <Field label="Ticket range" value={`${profile.ticketMin ?? "?"} – ${profile.ticketMax ?? "?"}`} />
              </>
            )}
            {role === "corporate" && "industry" in profile && (
              <>
                <Field label="Industry" value={profile.industry} />
                <Field label="Procurement geography" value={profile.procurementGeo.join(", ") || "—"} />
                <Field label="ESG framework" value={profile.esgFramework ?? "—"} />
              </>
            )}
          </dl>
        </div>

        <div className="card mt-6 p-6">
          <h2 className="font-serif text-lg text-forest-900">Attached documents</h2>
          {artefacts.length === 0 ? (
            <p className="mt-2 text-sm text-charcoal-500">No artefacts uploaded yet.</p>
          ) : (
            <ul className="mt-3 divide-y divide-cream-200">
              {artefacts.map((a) => (
                <li key={a.id} className="flex items-center justify-between py-2 text-sm">
                  <span className="text-forest-900">{a.name}</span>
                  <span className="text-[11px] uppercase tracking-wide text-charcoal-400">{a.status}</span>
                </li>
              ))}
            </ul>
          )}
        </div>

        {profile.status !== "APPROVED" && (
          <div className="card mt-6 p-6">
            <h2 className="font-serif text-lg text-forest-900">Decision / Override</h2>
            <p className="mt-1 text-xs text-charcoal-500">
              {profile.status === "PARTIALLY_APPROVED"
                ? "This profile was automatically partially approved by AI. You can give full manual approval or reject it."
                : profile.status === "REJECTED"
                ? "This profile is currently rejected. You can override and approve it if appropriate."
                : "Reject requires a reason; approve requires confirmation."}
            </p>
            <div className="mt-4">
              <ProfileReviewActions role={role} profileId={profile.id} />
            </div>
          </div>
        )}
      </div>
    </section>
  );
}

function Field({ label, value, full }: { label: string; value: string | number; full?: boolean }) {
  return (
    <div className={full ? "sm:col-span-2" : undefined}>
      <dt className="text-[11px] font-semibold uppercase tracking-wide text-charcoal-400">{label}</dt>
      <dd className="mt-1 text-sm text-charcoal-700">{value}</dd>
    </div>
  );
}
