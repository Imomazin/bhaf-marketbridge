import Link from "next/link";
import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { DashboardCard } from "@/components/cards/DashboardCard";
import { PortalSidebar } from "@/components/layout/PortalSidebar";
import { PortalWorkflowStrip } from "@/components/layout/PortalWorkflowStrip";
import { OnboardingCard } from "@/components/onboarding/OnboardingCard";
import { DocumentVault } from "@/components/sections/DocumentVault";
import { ReadinessBadge } from "@/components/ui/ReadinessBadge";
import { loadMyArtefacts } from "@/lib/queries/artefacts";
import { loadOnboardingState } from "@/lib/queries/onboarding";
import { getDemoFunderProfile } from "@/lib/demoState";
import { buildInitials } from "@/lib/demoPresentation";
import { buildFunderShortlistsFromEntries, getSavedFunderShortlistEntries } from "@/lib/funderShortlists";
import {
  FUNDER_MATCHES,
  FUNDER_REPORT_TEMPLATES,
  SEEDED_FUNDER_PIPELINE,
  SEEDED_FUNDER_SHORTLISTS,
  formatTicketRange,
  getDemoSeedFunderProfile,
  getFunderWorkflowStep,
  isSeededFunderAccount,
} from "@/lib/funderPortal";
import { getFunderNav } from "@/lib/portalNav";
import { getDemoUserById } from "@/lib/demoUsers";

export const dynamic = "force-dynamic";

export default async function FunderPortalPage() {
  const session = await auth();
  if (!session?.user) redirect("/auth/sign-in?next=/portal/funder");

  const [{ artefacts }, onboarding, demoProfile, demoUser, savedShortlistEntries] = await Promise.all([
    loadMyArtefacts(session.user.id, "funder"),
    loadOnboardingState(session.user.id, session.user.role),
    getDemoFunderProfile(session.user.id),
    getDemoUserById(session.user.id),
    getSavedFunderShortlistEntries(session.user.id),
  ]);

  const seeded = isSeededFunderAccount(session.user.id);
  const profile = demoProfile ?? getDemoSeedFunderProfile(session.user.id);
  const orgName = profile?.orgName ?? "Your fund or organisation";
  const contactName = demoUser?.name ?? session.user.name ?? "Funder team";
  const mandate = profile?.mandate?.trim() || "Define your investment or donor mandate in Manage account.";
  const geoFocus = profile?.geoFocus ?? [];
  const sectorFocus = profile?.sectorFocus ?? [];
  const savedShortlists = buildFunderShortlistsFromEntries(savedShortlistEntries);
  const shortlists = [...savedShortlists, ...(seeded ? SEEDED_FUNDER_SHORTLISTS : [])];
  const pipeline = seeded
    ? SEEDED_FUNDER_PIPELINE.map((row) =>
        row.stage === "Sourcing"
          ? { ...row, count: row.count + savedShortlistEntries.length }
          : row,
      )
    : [
        {
          stage: "Sourcing",
          count: savedShortlistEntries.length,
          capital: "—",
          description:
            savedShortlistEntries.length > 0
              ? "Ventures saved from the directory and ready for first review."
              : "No saved ventures yet.",
        },
        { stage: "Diligence", count: 0, capital: "—", description: "No active diligence yet." },
        { stage: "Term sheet", count: 0, capital: "—", description: "No active term sheets yet." },
        { stage: "Closed", count: 0, capital: "—", description: "No closed deals yet." },
      ];
  const matches = FUNDER_MATCHES.slice(0, 4);
  const workflowStep = getFunderWorkflowStep({
    hasProfile: onboarding.hasProfile,
    hasFirstArtefact: onboarding.hasFirstArtefact,
    seeded,
  });

  return (
    <div className="flex min-h-screen flex-col lg:flex-row">
      <PortalSidebar currentRole="funder" nav={getFunderNav("/portal/funder")} />

      <div className="flex-1">
        <header className="border-b border-cream-200 bg-white">
          <div className="container-edge flex flex-wrap items-center justify-between gap-4 py-6 lg:px-8">
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-forest-800 font-serif text-cream-50">
                {buildInitials(orgName)}
              </div>
              <div>
                <p className="text-xs text-charcoal-400">Welcome back</p>
                <p className="font-serif text-xl text-forest-900">{orgName}</p>
                <p className="text-xs text-charcoal-500">
                  {contactName}
                  {geoFocus.length > 0 ? ` · ${geoFocus.join(", ")}` : ""}
                </p>
              </div>
            </div>
            <div className="flex flex-wrap items-center gap-3">
              <Link href="/settings" className="btn-secondary !px-3 !py-2 text-xs">
                Manage mandate
              </Link>
              <Link href="/directory" className="btn-secondary !px-3 !py-2 text-xs">
                Browse directory
              </Link>
              <Link href="/portal/funder/vault" className="btn-primary !px-3 !py-2 text-xs">
                Open vault
              </Link>
            </div>
          </div>
        </header>

        <PortalWorkflowStrip roleId="funder" currentStep={workflowStep} />

        <div className="container-edge py-8 lg:px-8">
          <div className="mb-8">
            <OnboardingCard state={onboarding} role="funder" />
          </div>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {[
              {
                label: "Mandate profile",
                value: onboarding.hasProfile ? "Ready" : "Needs setup",
                caption: onboarding.hasProfile ? "Profile is complete enough for sourcing" : "Add focus areas and ticket size",
              },
              {
                label: "Compliance documents",
                value: String(artefacts.length),
                caption: artefacts.length > 0 ? "Saved in your vault" : "No artefacts uploaded yet",
              },
              {
                label: "Shortlists",
                value: String(shortlists.length),
                caption: shortlists.length > 0 ? "Named lists saved for review" : "Create your first shortlist from the directory",
              },
              {
                label: "Funding-ready matches",
                value: String(matches.length),
                caption: "Visible from the public directory right now",
              },
            ].map((item, index) => (
              <div
                key={item.label}
                className={
                  index === 0
                    ? "rounded-2xl border border-forest-200 bg-forest-50 p-5"
                    : "rounded-2xl border border-cream-200 bg-white p-5 shadow-card"
                }
              >
                <p className="text-[11px] uppercase tracking-wide text-charcoal-500">{item.label}</p>
                <p className="mt-3 font-serif text-3xl text-forest-900">{item.value}</p>
                <p className="mt-1 text-xs text-charcoal-500">{item.caption}</p>
              </div>
            ))}
          </div>

          <div className="mt-6 grid gap-6 lg:grid-cols-3">
            <DashboardCard
              title="Mandate snapshot"
              description="This is the investment or donor profile other workflow steps are built around."
              action="Edit"
              actionHref="/settings"
              className="lg:col-span-2"
            >
              <div className="space-y-4">
                <div>
                  <p className="text-[11px] font-semibold uppercase tracking-wide text-charcoal-500">Mandate summary</p>
                  <p className="mt-2 text-sm leading-relaxed text-charcoal-600">{mandate}</p>
                </div>
                <div className="grid gap-4 md:grid-cols-3">
                  <div className="rounded-xl border border-cream-200 bg-cream-50 p-4">
                    <p className="text-[10px] uppercase tracking-wide text-charcoal-400">Geographies</p>
                    <p className="mt-2 text-sm font-medium text-forest-900">
                      {geoFocus.length > 0 ? geoFocus.join(", ") : "Add your focus markets"}
                    </p>
                  </div>
                  <div className="rounded-xl border border-cream-200 bg-cream-50 p-4">
                    <p className="text-[10px] uppercase tracking-wide text-charcoal-400">Sectors</p>
                    <p className="mt-2 text-sm font-medium text-forest-900">
                      {sectorFocus.length > 0 ? sectorFocus.join(", ") : "Add your priority sectors"}
                    </p>
                  </div>
                  <div className="rounded-xl border border-cream-200 bg-cream-50 p-4">
                    <p className="text-[10px] uppercase tracking-wide text-charcoal-400">Ticket size</p>
                    <p className="mt-2 text-sm font-medium text-forest-900">
                      {formatTicketRange(profile?.ticketMin, profile?.ticketMax)}
                    </p>
                  </div>
                </div>
              </div>
            </DashboardCard>

            <DashboardCard
              title="My shortlists"
              description="Saved venture groups for diligence, programme design or committee review."
              action="Open"
              actionHref="/portal/funder/shortlists"
            >
              {shortlists.length > 0 ? (
                <ul className="space-y-3">
                  {shortlists.map((shortlist) => (
                    <li key={shortlist.id} className="rounded-lg border border-cream-200 p-3">
                      <p className="text-sm font-medium text-forest-900">{shortlist.name}</p>
                      <p className="mt-0.5 text-[11px] text-charcoal-400">
                        {shortlist.count} entrepreneurs · {shortlist.owner}
                      </p>
                    </li>
                  ))}
                </ul>
              ) : (
                <div className="rounded-xl border border-dashed border-cream-300 bg-cream-50 p-4 text-sm text-charcoal-500">
                  No shortlists yet. Browse the directory and start saving ventures for review.
                </div>
              )}
            </DashboardCard>
          </div>

          <div className="mt-6 grid gap-6 lg:grid-cols-3">
            <DashboardCard
              title="Pipeline by stage"
              description="A simple view of how your review pipeline is progressing."
              action="View pipeline"
              actionHref="/portal/funder/pipeline"
              className="lg:col-span-2"
            >
              <div className="space-y-4">
                {pipeline.map((row, index) => (
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
                        style={{
                          width: `${seeded ? [90, 55, 35, 20][index] : savedShortlistEntries.length > 0 && index === 0 ? 40 : 6}%`,
                        }}
                      />
                    </div>
                    <p className="mt-1 text-[11px] text-charcoal-400">{row.description}</p>
                  </div>
                ))}
              </div>
            </DashboardCard>

            <DashboardCard
              title="Impact reporting"
              description="Templates you can use to turn live platform data into funder-facing updates."
              action="Open"
              actionHref="/portal/funder/impact"
            >
              <ul className="space-y-3">
                {FUNDER_REPORT_TEMPLATES.map((template) => (
                  <li key={template.id} className="rounded-lg border border-cream-200 p-3">
                    <p className="text-sm font-medium text-forest-900">{template.title}</p>
                    <p className="mt-0.5 text-[11px] text-charcoal-400">{template.audience}</p>
                  </li>
                ))}
              </ul>
            </DashboardCard>
          </div>

          <div className="mt-6 grid gap-6 lg:grid-cols-3">
            <DashboardCard
              title="Funding-ready entrepreneurs"
              description="Verified women-led ventures currently visible through the MarketBridge directory."
              action="Open directory"
              actionHref="/directory"
              className="lg:col-span-2"
            >
              <ul className="divide-y divide-cream-200">
                {matches.map((entrepreneur) => (
                  <li key={entrepreneur.id} className="flex flex-wrap items-center gap-3 py-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-forest-800 text-cream-50">
                      <span className="font-serif text-sm">{entrepreneur.initials}</span>
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-medium text-forest-900">
                        {entrepreneur.name} · {entrepreneur.businessName}
                      </p>
                      <p className="text-xs text-charcoal-400">
                        {entrepreneur.country} · {entrepreneur.sector}
                      </p>
                    </div>
                    <span className="hidden text-xs text-charcoal-500 md:inline">{entrepreneur.fundingNeed}</span>
                    <ReadinessBadge level={entrepreneur.readinessLevel} />
                  </li>
                ))}
              </ul>
            </DashboardCard>

            <DashboardCard title="What to do next" description="A simple guide for the next best step in the funder flow.">
              <ul className="space-y-3 text-sm text-charcoal-600">
                <li className="rounded-lg border border-cream-200 bg-cream-50 p-3">
                  {!onboarding.hasProfile
                    ? "Start by defining your mandate so the platform reflects who you want to support."
                    : !onboarding.hasFirstArtefact
                    ? "Upload your first compliance document so diligence and introductions have supporting evidence."
                    : "Use the directory and shortlists to move businesses into your diligence process."}
                </li>
                <li className="rounded-lg border border-cream-200 bg-white p-3">
                  The public directory, marketplace and opportunities board stay available while you build the private
                  funder workspace.
                </li>
              </ul>
            </DashboardCard>
          </div>

          <div className="mt-10">
            <DocumentVault
              artefacts={artefacts}
              title="Compliance & mandate vault"
              intro="Store your mandate letter, KYC documents, impact-policy files and any supporting evidence used during introductions or diligence."
            />
          </div>
        </div>
      </div>
    </div>
  );
}
