import Link from "next/link";
import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { prisma, DB_ENABLED } from "@/lib/db";
import { NewCohortForm } from "@/components/cohorts/NewCohortForm";
import { InviteForm } from "@/components/cohorts/InviteForm";

export const metadata = { title: "Cohorts · BHAF Admin" };
export const dynamic = "force-dynamic";

export default async function CohortsAdminPage() {
  const session = await auth();
  if (!session?.user) redirect("/auth/sign-in?next=/admin/cohorts");
  if (session.user.role !== "ADMIN" && session.user.role !== "AUDITOR") redirect("/");

  let cohorts: Array<{
    id: string;
    name: string;
    programme: string | null;
    region: string | null;
    status: string;
    startDate: Date | null;
    endDate: Date | null;
    capacity: number | null;
    _count: { memberships: number };
  }> = [];
  if (DB_ENABLED && prisma) {
    cohorts = await prisma.cohort.findMany({
      orderBy: { createdAt: "desc" },
      include: { _count: { select: { memberships: true } } },
      take: 50,
    });
  }

  return (
    <section className="bg-cream-50 py-12 md:py-16">
      <div className="container-edge max-w-4xl">
        <Link href="/admin" className="text-xs font-medium text-forest-700 hover:text-gold-700">
          ← Admin dashboard
        </Link>
        <p className="mt-4 text-[11px] font-semibold uppercase tracking-[0.18em] text-gold-700">Admin</p>
        <h1 className="mt-2 font-serif text-3xl text-forest-900 md:text-4xl">Cohorts</h1>
        <p className="mt-2 text-sm text-charcoal-500">
          Run Abuja Accelerator, FEMEC RDC, InvestHer and other programmes. Invite members by email; they'll see
          the cohort in their workspace.
        </p>

        <details className="card mt-8 p-4">
          <summary className="cursor-pointer text-sm font-medium text-forest-900">New cohort</summary>
          <div className="mt-4">
            <NewCohortForm />
          </div>
        </details>

        <ul className="mt-8 space-y-3">
          {cohorts.map((c) => (
            <li key={c.id} className="card p-5">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <p className="font-serif text-lg text-forest-900">{c.name}</p>
                  <p className="text-xs text-charcoal-500">
                    {c.programme && <>{c.programme} · </>}
                    {c.region && <>{c.region} · </>}
                    {c._count.memberships} member{c._count.memberships === 1 ? "" : "s"}
                    {c.capacity ? ` / ${c.capacity} cap` : ""}
                  </p>
                  {(c.startDate || c.endDate) && (
                    <p className="text-[11px] text-charcoal-400">
                      {c.startDate?.toISOString().slice(0, 10) ?? "—"} →{" "}
                      {c.endDate?.toISOString().slice(0, 10) ?? "—"}
                    </p>
                  )}
                </div>
                <span className="rounded-full bg-gold-50 px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-gold-800">
                  {c.status.toLowerCase()}
                </span>
              </div>
              <details className="mt-4">
                <summary className="cursor-pointer text-xs font-medium text-forest-700">Invite members</summary>
                <div className="mt-3">
                  <InviteForm cohortId={c.id} />
                </div>
              </details>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
