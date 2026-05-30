import Link from "next/link";
import { prisma, DB_ENABLED } from "@/lib/db";

export const metadata = { title: "Open RFPs · BHAF MarketBridge" };
export const dynamic = "force-dynamic";

export default async function RfpsBrowsePage() {
  let rfps: Array<{
    id: string;
    title: string;
    category: string;
    region: string | null;
    budgetUsd: string | null;
    deadline: Date | null;
    description: string;
    owner: { name: string | null; corporateProfile: { orgName: string } | null };
  }> = [];

  if (DB_ENABLED && prisma) {
    rfps = await prisma.rfp.findMany({
      where: { status: "OPEN" },
      include: {
        owner: { select: { name: true, corporateProfile: { select: { orgName: true } } } },
      },
      orderBy: [{ deadline: "asc" }, { createdAt: "desc" }],
      take: 50,
    });
  }

  return (
    <section className="bg-cream-50 py-12 md:py-16">
      <div className="container-edge">
        <Link href="/marketplace" className="text-xs font-medium text-forest-700 hover:text-gold-700">
          ← Marketplace
        </Link>
        <p className="mt-4 text-[11px] font-semibold uppercase tracking-[0.18em] text-gold-700">
          RFPs
        </p>
        <h1 className="mt-2 font-serif text-3xl text-forest-900 md:text-4xl">Open corporate RFPs</h1>
        <p className="mt-2 max-w-2xl text-sm text-charcoal-500">
          Verified corporate partners post procurement requests here. Respond directly through the platform —
          BHAF tracks shortlisting and award.
        </p>

        {rfps.length === 0 && (
          <div className="card mt-8 p-10 text-center text-sm text-charcoal-500">
            No open RFPs right now. Check back soon, or sign up to receive alerts when corporates publish.
          </div>
        )}

        <ul className="mt-8 grid gap-4 md:grid-cols-2">
          {rfps.map((r) => (
            <li key={r.id}>
              <Link href={`/marketplace/rfps/${r.id}`} className="card block p-5 transition hover:-translate-y-0.5 hover:shadow-soft">
                <div className="flex flex-wrap items-start justify-between gap-2">
                  <p className="font-serif text-base text-forest-900">{r.title}</p>
                  <span className="rounded-full bg-[#0d2840] px-2 py-0.5 text-[9px] font-semibold uppercase tracking-wider text-cream-50">
                    {r.category}
                  </span>
                </div>
                <p className="mt-1 text-xs text-charcoal-500">
                  {r.owner.corporateProfile?.orgName ?? r.owner.name ?? "Corporate buyer"}
                  {r.region && <> · {r.region}</>}
                  {r.budgetUsd && <> · {r.budgetUsd}</>}
                </p>
                <p className="mt-3 line-clamp-3 text-xs text-charcoal-600">{r.description}</p>
                {r.deadline && (
                  <p className="mt-3 text-[11px] text-charcoal-400">
                    Closes {r.deadline.toISOString().slice(0, 10)}
                  </p>
                )}
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
