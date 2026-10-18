import { redirect } from "next/navigation";
import Link from "next/link";
import { auth } from "@/auth";
import { prisma, DB_ENABLED } from "@/lib/db";
import { PortalSidebar } from "@/components/layout/PortalSidebar";
import { DashboardCard } from "@/components/cards/DashboardCard";
import { getCorporateNav } from "@/lib/portalNav";
import { getDemoRfpsByOwner } from "@/lib/demoCorporate";

export const dynamic = "force-dynamic";

export default async function CorporateRfpsPage() {
  const session = await auth();
  if (!session?.user) redirect("/auth/sign-in");

  const dbRfps = session?.user && DB_ENABLED && prisma
    ? await prisma.rfp.findMany({
        where: { ownerId: session.user.id, status: { not: "DRAFT" } },
        include: { _count: { select: { responses: true } } },
        orderBy: { createdAt: "desc" },
      })
    : [];

  const demoRfps = session?.user && !DB_ENABLED ? await getDemoRfpsByOwner(session.user.id) : [];

  const activeRfps = DB_ENABLED
    ? dbRfps.map((r) => ({
        title: r.title,
        category: r.category,
        responses: r._count.responses,
        deadline: r.deadline ? r.deadline.toISOString().slice(0, 10) : "Rolling",
        reviewHref: `/portal/corporate/rfps/${r.id}`,
      }))
    : demoRfps.map((r) => ({
        title: r.title,
        category: r.category,
        responses: 0,
        deadline: r.deadline || "Rolling",
        reviewHref: `/portal/corporate/rfps/${r.id}`,
      }));

  return (
    <div className="flex min-h-screen flex-col lg:flex-row">
      <PortalSidebar currentRole="corporate" nav={getCorporateNav("/portal/corporate/rfps")} />
      
      <div className="flex-1 bg-cream-50">
        <div className="container-edge py-8 lg:px-8">
          <div className="flex items-center justify-between mb-2">
            <div>
              <h1 className="font-serif text-3xl text-forest-900">Active RFPs & sourcing</h1>
              <p className="mt-2 text-sm text-charcoal-500">Open requests visible to verified women-led suppliers</p>
            </div>
            <Link href="/portal/corporate/rfps/new" className="btn-primary !py-2 !px-3 text-xs">
              Post new RFP
            </Link>
          </div>

          <div className="mt-6">
            <DashboardCard title="Your active RFPs">
              {activeRfps.length === 0 ? (
                <div className="py-8 text-center text-sm text-charcoal-400">
                  You have no active RFPs. Post a new request to start sourcing.
                </div>
              ) : (
                <ul className="divide-y divide-cream-200">
                  {activeRfps.map((r) => (
                    <li key={r.title} className="flex flex-wrap items-center gap-4 py-4">
                      <div className="min-w-0 flex-1">
                        <p className="text-sm font-medium text-forest-900">{r.title}</p>
                        <p className="text-xs text-charcoal-400">{r.category}</p>
                      </div>
                      <div className="text-right text-xs">
                        <p className="font-medium text-forest-900">{r.responses} responses</p>
                        <p className="text-charcoal-400">Closes {r.deadline}</p>
                      </div>
                      <Link href={r.reviewHref} className="rounded-md border border-cream-300 px-3 py-1.5 text-xs font-medium text-charcoal-600 hover:border-forest-700 hover:text-forest-900">
                        Review
                      </Link>
                    </li>
                  ))}
                </ul>
              )}
            </DashboardCard>
          </div>
        </div>
      </div>
    </div>
  );
}
