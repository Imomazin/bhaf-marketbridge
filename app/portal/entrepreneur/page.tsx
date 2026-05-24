import Link from "next/link";
import { PortalSidebar } from "@/components/layout/PortalSidebar";
import { PortalWorkflowStrip } from "@/components/layout/PortalWorkflowStrip";
import { DashboardCard } from "@/components/cards/DashboardCard";
import { ReadinessBadge } from "@/components/ui/ReadinessBadge";
import { entrepreneurs } from "@/data/entrepreneurs";
import { opportunities } from "@/data/opportunities";

const nav = [
  { label: "Dashboard", href: "/portal/entrepreneur", active: true },
  { label: "My profile", href: "/portal/entrepreneur#profile" },
  { label: "ESG documentation", href: "/portal/entrepreneur#esg" },
  { label: "My listings", href: "/portal/entrepreneur#listings" },
  { label: "Opportunities", href: "/opportunities" },
  { label: "Enquiries", href: "/portal/entrepreneur#enquiries" },
];

const readinessChecklist = [
  { item: "Business profile", status: "complete" },
  { item: "Verification documents", status: "complete" },
  { item: "ESG self-assessment", status: "complete" },
  { item: "Marketplace listing(s)", status: "complete" },
  { item: "Funding readiness questionnaire", status: "in-progress" },
  { item: "Market access portfolio", status: "todo" },
] as const;

const recentEnquiries = [
  { buyer: "Consumer Goods Alliance", item: "Upcycled Heritage Apparel Collection", time: "2 hours ago" },
  { buyer: "Mosaic Impact Partners", item: "Funding Readiness shortlist", time: "Yesterday" },
  { buyer: "UK Trade Network", item: "Marketplace enquiry", time: "3 days ago" },
];

export default function EntrepreneurPortalPage() {
  const me = entrepreneurs[0];
  const completion = 78;

  return (
    <div className="flex min-h-screen flex-col lg:flex-row">
      <PortalSidebar currentRole="entrepreneur" nav={nav} />

      <div className="flex-1">
        <header className="border-b border-cream-200 bg-white">
          <div className="container-edge flex flex-wrap items-center justify-between gap-4 py-6 lg:px-8">
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-forest-800 font-serif text-cream-50">
                {me.initials}
              </div>
              <div>
                <p className="text-xs text-charcoal-400">Welcome back</p>
                <p className="font-serif text-xl text-forest-900">{me.name}</p>
                <p className="text-xs text-charcoal-500">
                  {me.businessName} · {me.country} · {me.sector}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <ReadinessBadge level={me.readinessLevel} />
              <Link href="#profile" className="btn-secondary !py-2 !px-3 text-xs">
                Edit profile
              </Link>
              <Link href="#listings" className="btn-primary !py-2 !px-3 text-xs">
                New listing
              </Link>
            </div>
          </div>
        </header>

        <PortalWorkflowStrip roleId="entrepreneur" currentStep={5} />

        <div className="container-edge py-8 lg:px-8">
          {/* Profile completion + readiness */}
          <div className="grid gap-6 lg:grid-cols-3">
            <div className="rounded-2xl border border-gold-200 bg-gradient-to-br from-gold-50 to-cream-50 p-6 lg:col-span-2">
              <div className="flex items-baseline justify-between">
                <div>
                  <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-gold-700">
                    Profile readiness
                  </p>
                  <p className="mt-2 font-serif text-3xl text-forest-900">{completion}% complete</p>
                  <p className="mt-1 text-sm text-charcoal-500">
                    Finish the funding readiness questionnaire to move from Market-Ready to Funding-Ready.
                  </p>
                </div>
                <Link href="#esg" className="btn-gold !py-2 !px-3 text-xs">
                  Complete checklist
                </Link>
              </div>
              <div className="mt-5 h-2 overflow-hidden rounded-full bg-cream-200">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-forest-700 to-gold-400"
                  style={{ width: `${completion}%` }}
                />
              </div>
            </div>

            <DashboardCard title="This week" description="Activity across your profile">
              <ul className="space-y-3 text-sm">
                <li className="flex items-baseline justify-between">
                  <span className="text-charcoal-500">Profile views</span>
                  <span className="font-serif text-lg text-forest-900">142</span>
                </li>
                <li className="flex items-baseline justify-between">
                  <span className="text-charcoal-500">Enquiries</span>
                  <span className="font-serif text-lg text-forest-900">7</span>
                </li>
                <li className="flex items-baseline justify-between">
                  <span className="text-charcoal-500">Funder shortlists</span>
                  <span className="font-serif text-lg text-forest-900">2</span>
                </li>
              </ul>
            </DashboardCard>
          </div>

          <div className="mt-6 grid gap-6 lg:grid-cols-3">
            <DashboardCard
              title="Readiness checklist"
              description="Complete every item to unlock Funding-Ready status."
              action="Open"
              className="lg:col-span-2"
            >
              <ul className="divide-y divide-cream-200">
                {readinessChecklist.map((c) => (
                  <li key={c.item} className="flex items-center justify-between py-3">
                    <div className="flex items-center gap-3">
                      <span
                        className={
                          c.status === "complete"
                            ? "flex h-5 w-5 items-center justify-center rounded-full bg-forest-700 text-cream-50"
                            : c.status === "in-progress"
                            ? "flex h-5 w-5 items-center justify-center rounded-full bg-gold-400 text-forest-900"
                            : "flex h-5 w-5 items-center justify-center rounded-full border border-cream-300 text-charcoal-300"
                        }
                      >
                        {c.status === "complete" ? "✓" : c.status === "in-progress" ? "…" : ""}
                      </span>
                      <span className="text-sm text-forest-900">{c.item}</span>
                    </div>
                    <span
                      className={
                        c.status === "complete"
                          ? "text-[11px] font-medium uppercase tracking-wide text-forest-700"
                          : c.status === "in-progress"
                          ? "text-[11px] font-medium uppercase tracking-wide text-gold-700"
                          : "text-[11px] font-medium uppercase tracking-wide text-charcoal-400"
                      }
                    >
                      {c.status.replace("-", " ")}
                    </span>
                  </li>
                ))}
              </ul>
            </DashboardCard>

            <DashboardCard title="Recommended opportunities" action="See all">
              <ul className="space-y-3">
                {opportunities.slice(0, 3).map((o) => (
                  <li key={o.id} className="rounded-lg border border-cream-200 p-3">
                    <p className="text-[10px] uppercase tracking-wide text-gold-700">{o.type}</p>
                    <p className="mt-0.5 text-sm font-medium text-forest-900">{o.title}</p>
                    <p className="mt-1 text-[11px] text-charcoal-400">Closes {o.deadline}</p>
                  </li>
                ))}
              </ul>
            </DashboardCard>
          </div>

          <div className="mt-6 grid gap-6 lg:grid-cols-3">
            <DashboardCard
              title="My listings"
              description="Products and services visible to buyers and partners."
              action="New listing"
              className="lg:col-span-2"
            >
              <ul className="space-y-3">
                {me.products.map((p) => (
                  <li key={p} className="flex items-center justify-between rounded-lg border border-cream-200 px-4 py-3">
                    <div>
                      <p className="text-sm font-medium text-forest-900">{p}</p>
                      <p className="text-[11px] text-charcoal-400">Live · 24 views this week</p>
                    </div>
                    <Link href="/marketplace" className="text-xs font-medium text-forest-700 hover:text-gold-700">
                      Edit
                    </Link>
                  </li>
                ))}
              </ul>
            </DashboardCard>

            <DashboardCard title="Recent enquiries">
              <ul className="space-y-3 text-sm">
                {recentEnquiries.map((e) => (
                  <li key={e.buyer} className="border-l-2 border-gold-300 pl-3">
                    <p className="font-medium text-forest-900">{e.buyer}</p>
                    <p className="text-xs text-charcoal-500">{e.item}</p>
                    <p className="text-[10px] uppercase tracking-wide text-charcoal-400">{e.time}</p>
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
