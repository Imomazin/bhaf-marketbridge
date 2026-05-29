import Link from "next/link";
import { auth } from "@/auth";
import { PortalSidebar } from "@/components/layout/PortalSidebar";
import { PortalWorkflowStrip } from "@/components/layout/PortalWorkflowStrip";
import { DashboardCard } from "@/components/cards/DashboardCard";
import { DocumentVault } from "@/components/sections/DocumentVault";
import { marketplaceListings } from "@/data/marketplace";
import { loadMyArtefacts } from "@/lib/queries/artefacts";

export const dynamic = "force-dynamic";

const nav = [
  { label: "Procurement desk", href: "/portal/corporate", active: true },
  { label: "Suppliers", href: "/portal/corporate#suppliers" },
  { label: "Active RFPs", href: "/portal/corporate#rfps" },
  { label: "Supplier diversity", href: "/portal/corporate#diversity" },
  { label: "Marketplace", href: "/marketplace" },
  { label: "ESG reports", href: "/impact" },
];

const rfps = [
  { title: "Sustainable apparel — Q3 cohort", responses: 14, deadline: "30 June 2026", category: "Fashion & Textiles" },
  { title: "Clean energy productive-use kits", responses: 8, deadline: "12 July 2026", category: "Clean Energy" },
  { title: "Hospitality amenity programme", responses: 11, deadline: "5 August 2026", category: "Beauty & Wellness" },
];

const diversityStats = [
  { label: "Women-led suppliers onboarded", value: "42", change: "+8 this quarter" },
  { label: "Procurement spend with women suppliers", value: "$1.8M", change: "+24% YoY" },
  { label: "Countries sourced from", value: "9", change: "Pan-African coverage" },
];

export default async function CorporatePortalPage() {
  const session = await auth();
  const { artefacts: myArtefacts } = session?.user
    ? await loadMyArtefacts(session.user.id, "corporate")
    : { artefacts: [] };

  return (
    <div className="flex min-h-screen flex-col lg:flex-row">
      <PortalSidebar currentRole="corporate" nav={nav} />

      <div className="flex-1">
        <header className="border-b border-cream-200 bg-white">
          <div className="container-edge flex flex-wrap items-center justify-between gap-4 py-6 lg:px-8">
            <div>
              <p className="text-xs text-charcoal-400">Welcome back</p>
              <p className="font-serif text-xl text-forest-900">Consumer Goods Alliance</p>
              <p className="text-xs text-charcoal-500">FMCG · West & Southern Africa procurement programme</p>
            </div>
            <div className="flex items-center gap-3">
              <Link href="/marketplace" className="btn-secondary !py-2 !px-3 text-xs">
                Browse marketplace
              </Link>
              <Link href="#rfps" className="btn-primary !py-2 !px-3 text-xs">
                Post RFP
              </Link>
            </div>
          </div>
        </header>

        <PortalWorkflowStrip roleId="corporate" currentStep={3} />

        <div className="container-edge py-8 lg:px-8">
          <div className="grid gap-4 sm:grid-cols-3">
            {diversityStats.map((s, i) => (
              <div
                key={s.label}
                className={
                  i === 0
                    ? "rounded-2xl border border-[#102d4a]/15 bg-[#0d2840] p-5 text-cream-50"
                    : "rounded-2xl border border-cream-200 bg-white p-5 shadow-card"
                }
              >
                <p className={i === 0 ? "text-[11px] uppercase tracking-wide text-cream-100/70" : "text-[11px] uppercase tracking-wide text-charcoal-500"}>
                  {s.label}
                </p>
                <p className={i === 0 ? "mt-3 font-serif text-3xl text-cream-50" : "mt-3 font-serif text-3xl text-forest-900"}>
                  {s.value}
                </p>
                <p className={i === 0 ? "mt-1 text-xs text-cream-100/70" : "mt-1 text-xs text-charcoal-500"}>
                  {s.change}
                </p>
              </div>
            ))}
          </div>

          <div className="mt-6 grid gap-6 lg:grid-cols-3">
            <DashboardCard
              title="Active RFPs & sourcing"
              description="Open requests visible to verified women-led suppliers"
              action="Post new"
              className="lg:col-span-2"
            >
              <ul className="divide-y divide-cream-200">
                {rfps.map((r) => (
                  <li key={r.title} className="flex flex-wrap items-center gap-4 py-4">
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-medium text-forest-900">{r.title}</p>
                      <p className="text-xs text-charcoal-400">{r.category}</p>
                    </div>
                    <div className="text-right text-xs">
                      <p className="font-medium text-forest-900">{r.responses} responses</p>
                      <p className="text-charcoal-400">Closes {r.deadline}</p>
                    </div>
                    <Link href="/marketplace" className="rounded-md border border-cream-300 px-3 py-1.5 text-xs font-medium text-charcoal-600 hover:border-forest-700 hover:text-forest-900">
                      Review
                    </Link>
                  </li>
                ))}
              </ul>
            </DashboardCard>

            <DashboardCard title="ESG supplier scorecard">
              <ul className="space-y-3 text-sm">
                <li className="flex items-baseline justify-between">
                  <span className="text-charcoal-500">ESG-aligned suppliers</span>
                  <span className="font-serif text-lg text-forest-900">38</span>
                </li>
                <li className="flex items-baseline justify-between">
                  <span className="text-charcoal-500">Circular practices verified</span>
                  <span className="font-serif text-lg text-forest-900">22</span>
                </li>
                <li className="flex items-baseline justify-between">
                  <span className="text-charcoal-500">Avg readiness score</span>
                  <span className="font-serif text-lg text-forest-900">74%</span>
                </li>
                <li className="border-t border-cream-200 pt-3 text-[11px] text-charcoal-400">
                  Auto-compiled from supplier profiles · refreshed daily
                </li>
              </ul>
            </DashboardCard>
          </div>

          <div className="mt-6">
            <DashboardCard
              title="Shortlisted suppliers"
              description="Saved from the marketplace · review and route to procurement teams"
              action="Open marketplace"
            >
              <ul className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
                {marketplaceListings.slice(0, 6).map((l) => (
                  <li key={l.id} className="rounded-lg border border-cream-200 p-3">
                    <p className="text-[10px] uppercase tracking-wide text-gold-700">{l.category}</p>
                    <p className="mt-0.5 text-sm font-medium text-forest-900">{l.title}</p>
                    <p className="mt-1 text-[11px] text-charcoal-400">
                      {l.business} · {l.country}
                    </p>
                    <p className="mt-2 text-[11px] text-charcoal-500">{l.esgHighlight}</p>
                  </li>
                ))}
              </ul>
            </DashboardCard>
          </div>

          <div className="mt-10">
            <DocumentVault
              artefacts={myArtefacts}
              title="Procurement & ESG policy vault"
              intro="Your corporate KYC, supplier diversity policy and ESG disclosure artefacts. BHAF revalidates these before exposing your RFPs to verified suppliers."
            />
          </div>
        </div>
      </div>
    </div>
  );
}
