import { DashboardCard } from "@/components/cards/DashboardCard";
import { ReadinessBadge } from "@/components/ui/ReadinessBadge";
import { AnnotatedPhoto } from "@/components/ui/AnnotatedPhoto";
import { PortalWorkflowStrip } from "@/components/layout/PortalWorkflowStrip";
import { VerificationQueue } from "@/components/sections/VerificationQueue";
import { AuditLog } from "@/components/sections/AuditLog";
import { auditTrail, verificationQueue } from "@/data/artefacts";
import { entrepreneurs } from "@/data/entrepreneurs";
import { opportunities } from "@/data/opportunities";
import { photos } from "@/data/photos";

const overviewStats = [
  { label: "Pending approvals", value: "12", trend: "+3 this week", tone: "gold" as const },
  { label: "Verified entrepreneurs", value: "165", trend: "+8 this month", tone: "forest" as const },
  { label: "Active opportunities", value: "24", trend: "6 closing this week", tone: "neutral" as const },
  { label: "Marketplace enquiries", value: "318", trend: "+42 last 7 days", tone: "neutral" as const },
];

const pendingProfiles = entrepreneurs.slice(0, 4);
const activity = [
  { time: "08:42", actor: "Amara Okafor", action: "Uploaded ESG documentation pack" },
  { time: "Yesterday", actor: "Mosaic Impact Partners", action: "Shortlisted 6 entrepreneurs for review" },
  { time: "Yesterday", actor: "Lumina Skill Studios", action: "Submitted certification application" },
  { time: "2 days ago", actor: "BHAF Admin", action: "Published Green Trade Accelerator Grant 2026" },
  { time: "3 days ago", actor: "Khaya Harvest", action: "Marketplace listing approved" },
];

export default function AdminPage() {
  return (
    <>
      <PortalWorkflowStrip roleId="admin" currentStep={2} />
      <section className="bg-cream-50 py-12 md:py-16">
        <div className="container-edge">
        <div className="flex flex-wrap items-end justify-between gap-6">
          <div>
            <p className="eyebrow">Administrator</p>
            <h1 className="mt-2 font-serif text-3xl text-forest-900 md:text-4xl">BHAF Admin Dashboard</h1>
            <p className="mt-2 max-w-2xl text-sm text-charcoal-500">
              Moderate entrepreneur profiles, manage listings, publish opportunities and monitor live impact data
              across the MarketBridge network.
            </p>
          </div>
          <div className="flex gap-2">
            <button className="btn-secondary !py-2 !px-3 text-xs">Export report</button>
            <button className="btn-primary !py-2 !px-3 text-xs">Publish opportunity</button>
          </div>
        </div>

        {/* Overview */}
        <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {overviewStats.map((s) => (
            <div
              key={s.label}
              className={
                s.tone === "gold"
                  ? "rounded-2xl border border-gold-200 bg-gold-50 p-5"
                  : s.tone === "forest"
                  ? "rounded-2xl border border-forest-200 bg-forest-50 p-5"
                  : "card p-5"
              }
            >
              <p className="text-[11px] uppercase tracking-wide text-charcoal-500">{s.label}</p>
              <p className="mt-3 font-serif text-3xl text-forest-900">{s.value}</p>
              <p className="mt-1 text-xs text-charcoal-500">{s.trend}</p>
            </div>
          ))}
        </div>

        <div className="mt-10 grid gap-6 lg:grid-cols-3">
          {/* Pending profiles */}
          <DashboardCard
            title="Pending profile approvals"
            description="Profiles awaiting verification before listing publishes."
            action="View all"
            className="lg:col-span-2"
          >
            <ul className="divide-y divide-cream-200">
              {pendingProfiles.map((p) => (
                <li key={p.id} className="flex flex-wrap items-center gap-4 py-4">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-forest-800 text-cream-50">
                    <span className="font-serif text-sm">{p.initials}</span>
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="font-medium text-forest-900">{p.name}</p>
                    <p className="text-xs text-charcoal-400">
                      {p.businessName} · {p.country} · {p.sector}
                    </p>
                  </div>
                  <ReadinessBadge level={p.readinessLevel} />
                  <div className="flex gap-2">
                    <button className="rounded-md border border-cream-300 px-3 py-1.5 text-xs font-medium text-charcoal-600 hover:border-forest-700 hover:text-forest-900">
                      Review
                    </button>
                    <button className="rounded-md bg-forest-800 px-3 py-1.5 text-xs font-medium text-cream-50 hover:bg-forest-700">
                      Approve
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          </DashboardCard>

          {/* Activity */}
          <DashboardCard title="Recent activity" description="Live across the platform">
            <ul className="space-y-4">
              {activity.map((a, idx) => (
                <li key={idx} className="flex gap-3">
                  <span className="mt-1.5 h-2 w-2 flex-shrink-0 rounded-full bg-gold-500" />
                  <div className="flex-1">
                    <p className="text-sm text-forest-900">
                      <span className="font-medium">{a.actor}</span> {a.action.toLowerCase()}
                    </p>
                    <p className="text-[11px] text-charcoal-400">{a.time}</p>
                  </div>
                </li>
              ))}
            </ul>
          </DashboardCard>
        </div>

        {/* Readiness pipeline */}
        <div className="mt-6 grid gap-6 lg:grid-cols-3">
          <DashboardCard
            title="Readiness pipeline"
            description="Entrepreneurs progressing toward funding and market readiness"
            className="lg:col-span-2"
          >
            <div className="space-y-4">
              {[
                { label: "Emerging", count: 38, pct: 22 },
                { label: "Developing", count: 47, pct: 36 },
                { label: "Market-Ready", count: 41, pct: 58 },
                { label: "Funding-Ready", count: 39, pct: 81 },
              ].map((row) => (
                <div key={row.label}>
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-medium text-forest-900">{row.label}</span>
                    <span className="text-charcoal-400">{row.count} entrepreneurs</span>
                  </div>
                  <div className="mt-1.5 h-2 overflow-hidden rounded-full bg-cream-200">
                    <div
                      className="h-full rounded-full bg-gradient-to-r from-forest-700 to-gold-400"
                      style={{ width: `${row.pct}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </DashboardCard>

          <DashboardCard title="Opportunities" description="Currently published" action="Manage">
            <ul className="space-y-3">
              {opportunities.slice(0, 4).map((o) => (
                <li key={o.id} className="rounded-lg border border-cream-200 p-3">
                  <p className="text-sm font-medium text-forest-900">{o.title}</p>
                  <div className="mt-1 flex items-center justify-between text-[11px] text-charcoal-400">
                    <span>{o.type}</span>
                    <span>{o.deadline}</span>
                  </div>
                </li>
              ))}
            </ul>
          </DashboardCard>
        </div>

        {/* Quality assurance — verification queue */}
        <div className="mt-10">
          <VerificationQueue items={verificationQueue} />
        </div>

        {/* Tamper-evident audit trail */}
        <div className="mt-6">
          <AuditLog entries={auditTrail} />
        </div>

        <div className="mt-10 grid gap-4 md:grid-cols-4">
          <AnnotatedPhoto
            photo={photos.abuja2}
            aspect="square"
            tag="Cohort"
            caption="Abuja Accelerator — live sessions admins moderate."
          />
          <AnnotatedPhoto
            photo={photos.drc2}
            aspect="square"
            tag="DRC"
            caption="FEMEC training cohort — Kinshasa."
          />
          <AnnotatedPhoto
            photo={photos.baloni5}
            aspect="square"
            tag="Site visit"
            caption="Field verification at Baloni Farm."
          />
          <AnnotatedPhoto
            photo={photos.nyc4}
            aspect="square"
            tag="NYC"
            caption="BHAF Launch — partner pipeline source."
          />
          </div>
        </div>
      </section>
    </>
  );
}
