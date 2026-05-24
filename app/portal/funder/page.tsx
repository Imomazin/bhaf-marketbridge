import Link from "next/link";
import { PortalSidebar } from "@/components/layout/PortalSidebar";
import { DashboardCard } from "@/components/cards/DashboardCard";
import { ReadinessBadge } from "@/components/ui/ReadinessBadge";
import { entrepreneurs } from "@/data/entrepreneurs";
import { impactMetrics } from "@/data/impact";

const nav = [
  { label: "Investment desk", href: "/portal/funder", active: true },
  { label: "Pipeline", href: "/portal/funder#pipeline" },
  { label: "Shortlists", href: "/portal/funder#shortlists" },
  { label: "Impact reports", href: "/portal/funder#impact" },
  { label: "Directory", href: "/directory" },
  { label: "Opportunities", href: "/opportunities" },
];

const pipeline = [
  { stage: "Sourcing", count: 24, capital: "—" },
  { stage: "Diligence", count: 8, capital: "$1.4M" },
  { stage: "Term sheet", count: 3, capital: "$680k" },
  { stage: "Closed", count: 2, capital: "$420k" },
];

const shortlists = [
  { name: "Clean Energy Q3 cohort", count: 6, owner: "Investment team" },
  { name: "Circular FMCG procurement", count: 9, owner: "ESG advisory" },
  { name: "Funding-Ready women in tech", count: 4, owner: "Catalyst Equity" },
];

export default function FunderPortalPage() {
  const investable = entrepreneurs.filter((e) => e.readinessLevel === "Funding-Ready");

  return (
    <div className="flex min-h-screen flex-col lg:flex-row">
      <PortalSidebar currentRole="funder" nav={nav} />

      <div className="flex-1">
        <header className="border-b border-cream-200 bg-white">
          <div className="container-edge flex flex-wrap items-center justify-between gap-4 py-6 lg:px-8">
            <div>
              <p className="text-xs text-charcoal-400">Welcome back</p>
              <p className="font-serif text-xl text-forest-900">Mosaic Impact Partners</p>
              <p className="text-xs text-charcoal-500">Catalyst Equity · East & Southern Africa mandate</p>
            </div>
            <div className="flex items-center gap-3">
              <Link href="/directory" className="btn-secondary !py-2 !px-3 text-xs">
                Browse directory
              </Link>
              <Link href="#shortlists" className="btn-primary !py-2 !px-3 text-xs">
                New shortlist
              </Link>
            </div>
          </div>
        </header>

        <div className="container-edge py-8 lg:px-8">
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {[
              { label: "Verified pipeline", value: "39", caption: "Funding-Ready entrepreneurs" },
              { label: "In diligence", value: "8", caption: "Across 4 sectors" },
              { label: "Capital deployed YTD", value: "$420k", caption: "2 closed deals" },
              { label: "Programmes supported", value: "5", caption: "BHAF cohorts" },
            ].map((s, i) => (
              <div
                key={s.label}
                className={
                  i === 0
                    ? "rounded-2xl border border-forest-200 bg-forest-50 p-5"
                    : "rounded-2xl border border-cream-200 bg-white p-5 shadow-card"
                }
              >
                <p className="text-[11px] uppercase tracking-wide text-charcoal-500">{s.label}</p>
                <p className="mt-3 font-serif text-3xl text-forest-900">{s.value}</p>
                <p className="mt-1 text-xs text-charcoal-500">{s.caption}</p>
              </div>
            ))}
          </div>

          <div className="mt-6 grid gap-6 lg:grid-cols-3">
            <DashboardCard
              title="Pipeline by stage"
              description="Active opportunities tracked through your investment workflow"
              className="lg:col-span-2"
            >
              <div className="space-y-4">
                {pipeline.map((row, i) => (
                  <div key={row.stage}>
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-medium text-forest-900">{row.stage}</span>
                      <span className="text-charcoal-500">
                        {row.count} ventures · {row.capital}
                      </span>
                    </div>
                    <div className="mt-1.5 h-2 overflow-hidden rounded-full bg-cream-200">
                      <div
                        className="h-full rounded-full bg-gradient-to-r from-forest-700 to-gold-400"
                        style={{ width: `${[88, 60, 32, 16][i]}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </DashboardCard>

            <DashboardCard title="My shortlists" action="View all">
              <ul className="space-y-3">
                {shortlists.map((s) => (
                  <li key={s.name} className="rounded-lg border border-cream-200 p-3">
                    <p className="text-sm font-medium text-forest-900">{s.name}</p>
                    <p className="mt-0.5 text-[11px] text-charcoal-400">
                      {s.count} entrepreneurs · {s.owner}
                    </p>
                  </li>
                ))}
              </ul>
            </DashboardCard>
          </div>

          <div className="mt-6 grid gap-6 lg:grid-cols-3">
            <DashboardCard
              title="Funding-Ready entrepreneurs"
              description="Top matches against your mandate this week"
              action="Open directory"
              className="lg:col-span-2"
            >
              <ul className="divide-y divide-cream-200">
                {investable.map((e) => (
                  <li key={e.id} className="flex flex-wrap items-center gap-3 py-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-forest-800 text-cream-50">
                      <span className="font-serif text-sm">{e.initials}</span>
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-medium text-forest-900">{e.name} · {e.businessName}</p>
                      <p className="text-xs text-charcoal-400">{e.country} · {e.sector}</p>
                    </div>
                    <span className="hidden text-xs text-charcoal-500 md:inline">
                      Asking {e.fundingNeed.split(" ")[0]}
                    </span>
                    <ReadinessBadge level={e.readinessLevel} />
                    <Link href="/directory" className="text-xs font-medium text-forest-700 hover:text-gold-700">
                      View
                    </Link>
                  </li>
                ))}
              </ul>
            </DashboardCard>

            <DashboardCard title="Portfolio impact" description="Aggregate across deployed capital">
              <ul className="space-y-3">
                {impactMetrics.slice(0, 4).map((m) => (
                  <li key={m.id} className="border-l-2 border-gold-300 pl-3">
                    <p className="text-[10px] uppercase tracking-wide text-charcoal-400">{m.label}</p>
                    <p className="font-serif text-xl text-forest-900">{m.value}</p>
                  </li>
                ))}
              </ul>
            </DashboardCard>
          </div>
        </div>
      </div>
    </div>
  );
}
