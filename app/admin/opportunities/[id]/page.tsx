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

export default async function AdminOpportunityDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const session = await auth();
  if (!session?.user) redirect("/auth/sign-in?next=/admin/opportunities");
  if (session.user.role !== "ADMIN" && session.user.role !== "AUDITOR") redirect("/");

  const { id } = await params;

  if (!DB_ENABLED) {
    return (
      <section className="bg-cream-50 py-12 md:py-16">
        <div className="container-edge max-w-3xl">
          <div className="card p-10 text-center text-sm text-charcoal-500">Database not configured.</div>
        </div>
      </section>
    );
  }

  const opp = await getOpportunityForAdmin(id);
  if (!opp) notFound();

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
              {opp.organisation} · {opp.applications.length} applicant{opp.applications.length === 1 ? "" : "s"}
            </p>
          </div>
          <div className="flex items-center gap-2">
            <OpportunityPublishToggle id={opp.id} published={opp.published} />
            <OpportunityDeleteButton id={opp.id} title={opp.title} applicantCount={opp.applications.length} />
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
          <h2 className="font-serif text-lg text-forest-900">Applicants</h2>
          {opp.applications.length === 0 ? (
            <p className="mt-2 text-sm text-charcoal-500">No applications yet.</p>
          ) : (
            <ul className="mt-4 space-y-3">
              {opp.applications.map((a) => (
                <li key={a.id} className="rounded-lg border border-cream-200 p-4">
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div className="min-w-0">
                      <p className="font-medium text-forest-900">{a.user.name ?? a.user.email}</p>
                      <p className="text-xs text-charcoal-500">{a.user.email}</p>
                      <p className="mt-1 text-[11px] text-charcoal-400">
                        Applied {a.createdAt.toISOString().slice(0, 10)}
                      </p>
                    </div>
                    <span className={cn("rounded-full border px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wider", statusTone[a.status])}>
                      {a.status.toLowerCase().replace(/_/g, " ")}
                    </span>
                  </div>
                  {a.coverNote && (
                    <p className="mt-3 rounded-md bg-cream-50 px-3 py-2 text-xs text-charcoal-700">{a.coverNote}</p>
                  )}
                  <div className="mt-3">
                    <ApplicationActions applicationId={a.id} currentStatus={a.status} />
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </section>
  );
}
