import Link from "next/link";
import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { prisma, DB_ENABLED } from "@/lib/db";
import { ApplicationActions } from "@/components/admin/ApplicationActions";
import { cn } from "@/lib/utils";

export const metadata = { title: "Applications · BHAF Admin" };
export const dynamic = "force-dynamic";

const statusTone: Record<string, string> = {
  SUBMITTED: "bg-cream-100 text-charcoal-600 border-cream-300",
  UNDER_REVIEW: "bg-blue-50 text-[#0d2840] border-blue-200",
  SHORTLISTED: "bg-gold-50 text-gold-800 border-gold-200",
  REJECTED: "bg-red-50 text-red-700 border-red-200",
  WITHDRAWN: "bg-cream-100 text-charcoal-500 border-cream-300",
  AWARDED: "bg-forest-50 text-forest-800 border-forest-200",
};

export default async function AdminApplicationsPage({ searchParams }: { searchParams: { status?: string } }) {
  const session = await auth();
  if (!session?.user) redirect("/auth/sign-in?next=/admin/applications");
  if (session.user.role !== "ADMIN" && session.user.role !== "AUDITOR") redirect("/");

  let apps: Array<{
    id: string;
    coverNote: string | null;
    status: string;
    adminNote: string | null;
    createdAt: Date;
    user: { id: string; name: string | null; email: string };
    opportunityId: string;
  }> = [];
  const oppMap: Record<string, { title: string; organisation: string }> = {};

  if (DB_ENABLED && prisma) {
    apps = await prisma.application.findMany({
      where: searchParams.status ? { status: searchParams.status as never } : {},
      include: { user: { select: { id: true, name: true, email: true } } },
      orderBy: { createdAt: "desc" },
      take: 100,
    });
    if (apps.length > 0) {
      const oppRows = await prisma.opportunity.findMany({
        where: { id: { in: apps.map((a) => a.opportunityId) } },
        select: { id: true, title: true, organisation: true },
      });
      for (const o of oppRows) oppMap[o.id] = { title: o.title, organisation: o.organisation };
    }
  }

  return (
    <section className="bg-cream-50 py-12 md:py-16">
      <div className="container-edge max-w-5xl">
        <Link href="/admin" className="text-xs font-medium text-forest-700 hover:text-gold-700">
          ← Admin
        </Link>
        <p className="mt-4 text-[11px] font-semibold uppercase tracking-[0.18em] text-gold-700">Admin</p>
        <h1 className="mt-2 font-serif text-3xl text-forest-900 md:text-4xl">Applications</h1>
        <p className="mt-2 text-sm text-charcoal-500">
          Review entrepreneur applications. Decisions notify the applicant by email and in-app.
        </p>

        <div className="card mt-8 flex flex-wrap items-center gap-2 p-3">
          {["", "SUBMITTED", "UNDER_REVIEW", "SHORTLISTED", "REJECTED", "AWARDED"].map((s) => (
            <Link
              key={s || "all"}
              href={s ? `/admin/applications?status=${s}` : "/admin/applications"}
              className={cn(
                "rounded-full px-3 py-1 text-[10px] font-medium uppercase tracking-wider",
                searchParams.status === s || (!s && !searchParams.status)
                  ? "bg-forest-800 text-cream-50"
                  : "border border-cream-300 text-charcoal-600 hover:border-forest-700",
              )}
            >
              {s ? s.toLowerCase().replace(/_/g, " ") : "All"}
            </Link>
          ))}
        </div>

        {apps.length === 0 && (
          <div className="card mt-8 p-10 text-center text-sm text-charcoal-500">No applications match this filter.</div>
        )}

        <ul className="mt-6 space-y-3">
          {apps.map((a) => {
            const opp = oppMap[a.opportunityId];
            return (
              <li key={a.id} className="card p-5">
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div className="min-w-0">
                    <p className="font-serif text-base text-forest-900">{opp?.title ?? "Opportunity"}</p>
                    <p className="text-xs text-charcoal-500">
                      {opp?.organisation ?? ""} · applicant <strong>{a.user.name ?? a.user.email}</strong>
                    </p>
                    <p className="mt-1 text-[11px] text-charcoal-400">
                      Submitted {a.createdAt.toISOString().slice(0, 10)}
                    </p>
                  </div>
                  <span className={cn("rounded-full border px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wider", statusTone[a.status])}>
                    {a.status.toLowerCase().replace(/_/g, " ")}
                  </span>
                </div>
                {a.coverNote && (
                  <p className="mt-3 rounded-md bg-cream-50 px-3 py-2 text-xs text-charcoal-700">{a.coverNote}</p>
                )}
                <div className="mt-4">
                  <ApplicationActions applicationId={a.id} currentStatus={a.status} />
                </div>
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
