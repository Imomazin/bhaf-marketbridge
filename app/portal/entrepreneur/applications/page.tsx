import Link from "next/link";
import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { prisma, DB_ENABLED } from "@/lib/db";
import { cn } from "@/lib/utils";

export const metadata = { title: "My applications · BHAF MarketBridge" };
export const dynamic = "force-dynamic";

const statusTone: Record<string, string> = {
  SUBMITTED: "bg-cream-100 text-charcoal-600 border-cream-300",
  UNDER_REVIEW: "bg-blue-50 text-[#0d2840] border-blue-200",
  SHORTLISTED: "bg-gold-50 text-gold-800 border-gold-200",
  REJECTED: "bg-red-50 text-red-700 border-red-200",
  WITHDRAWN: "bg-cream-100 text-charcoal-500 border-cream-300",
  AWARDED: "bg-forest-50 text-forest-800 border-forest-200",
};

export default async function MyApplicationsPage() {
  const session = await auth();
  if (!session?.user) redirect("/auth/sign-in?next=/portal/entrepreneur/applications");

  let apps: Array<{
    id: string;
    coverNote: string | null;
    status: string;
    adminNote: string | null;
    createdAt: Date;
    decidedAt: Date | null;
    opportunityId: string;
  }> = [];
  const oppMap: Record<string, { title: string; organisation: string }> = {};

  if (DB_ENABLED && prisma) {
    apps = await prisma.application.findMany({
      where: { userId: session.user.id },
      orderBy: { createdAt: "desc" },
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
      <div className="container-edge max-w-4xl">
        <Link href="/portal/entrepreneur" className="text-xs font-medium text-forest-700 hover:text-gold-700">
          ← Workspace
        </Link>
        <p className="mt-4 text-[11px] font-semibold uppercase tracking-[0.18em] text-gold-700">
          My applications
        </p>
        <h1 className="mt-2 font-serif text-3xl text-forest-900 md:text-4xl">Application history</h1>
        <p className="mt-2 text-sm text-charcoal-500">
          Every opportunity you've applied to and where it stands.
        </p>

        {apps.length === 0 && (
          <div className="card mt-8 p-10 text-center text-sm text-charcoal-500">
            No applications yet. Browse <Link href="/opportunities" className="font-medium text-forest-800 underline">open opportunities</Link>.
          </div>
        )}

        <ul className="mt-8 space-y-3">
          {apps.map((a) => {
            const opp = oppMap[a.opportunityId];
            return (
              <li key={a.id} className="card p-5">
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <p className="font-serif text-base text-forest-900">{opp?.title ?? "Opportunity"}</p>
                    <p className="text-xs text-charcoal-500">{opp?.organisation ?? ""}</p>
                    <p className="mt-1 text-[11px] text-charcoal-400">
                      Submitted {a.createdAt.toISOString().slice(0, 10)}
                      {a.decidedAt && <> · decided {a.decidedAt.toISOString().slice(0, 10)}</>}
                    </p>
                  </div>
                  <span className={cn("rounded-full border px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wider", statusTone[a.status])}>
                    {a.status.toLowerCase().replace(/_/g, " ")}
                  </span>
                </div>
                {a.coverNote && (
                  <p className="mt-3 rounded-md bg-cream-50 px-3 py-2 text-xs text-charcoal-600">
                    <span className="font-semibold uppercase tracking-wide text-charcoal-500">Your note:</span>{" "}
                    {a.coverNote}
                  </p>
                )}
                {a.adminNote && (
                  <p className="mt-2 rounded-md bg-gold-50 px-3 py-2 text-xs text-gold-900">
                    <span className="font-semibold uppercase tracking-wide">BHAF:</span> {a.adminNote}
                  </p>
                )}
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
