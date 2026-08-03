import Link from "next/link";
import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { PortalSidebar } from "@/components/layout/PortalSidebar";
import { PortalWorkflowStrip } from "@/components/layout/PortalWorkflowStrip";
import { DashboardCard } from "@/components/cards/DashboardCard";
import { ReadinessBadge } from "@/components/ui/ReadinessBadge";
import { DocumentVault } from "@/components/sections/DocumentVault";
import { OnboardingCard } from "@/components/onboarding/OnboardingCard";
import { entrepreneurs } from "@/data/entrepreneurs";
import { opportunities } from "@/data/opportunities";
import { loadMyArtefacts } from "@/lib/queries/artefacts";
import { loadOnboardingState } from "@/lib/queries/onboarding";
import { getDemoApplications, getDemoEnquiries, getDemoEntrepreneurProfile, getDemoListings } from "@/lib/demoState";
import { getDemoUserById } from "@/lib/demoUsers";
import { getEntrepreneurNav } from "@/lib/portalNav";
import { buildInitials, formatIsoDate, getEntrepreneurWorkflowStep, getReadinessLevel } from "@/lib/demoPresentation";

export const dynamic = "force-dynamic";

const sampleEnquiries = [
  { buyer: "Consumer Goods Alliance", item: "Upcycled Heritage Apparel Collection", time: "2 hours ago" },
  { buyer: "Mosaic Impact Partners", item: "Funding Readiness shortlist", time: "Yesterday" },
  { buyer: "UK Trade Network", item: "Marketplace enquiry", time: "3 days ago" },
];

function statusForProfile(ready: boolean, started: boolean) {
  if (ready) return "complete";
  if (started) return "in-progress";
  return "todo";
}

export default async function EntrepreneurPortalPage() {
  const session = await auth();
  if (!session?.user) redirect("/auth/sign-in?next=/portal/entrepreneur");

  const sample = session.user.id === "demo-entrepreneur" ? entrepreneurs[0] : null;
  const [
    { artefacts: myArtefacts },
    onboarding,
    demoProfile,
    demoListings,
    demoApplications,
    demoEnquiries,
    demoUser,
  ] = await Promise.all([
    loadMyArtefacts(session.user.id, "entrepreneur"),
    loadOnboardingState(session.user.id, session.user.role),
    getDemoEntrepreneurProfile(session.user.id),
    getDemoListings(session.user.id),
    getDemoApplications(session.user.id),
    getDemoEnquiries(session.user.id),
    getDemoUserById(session.user.id),
  ]);

  const name = demoUser?.name ?? session.user.name ?? sample?.name ?? "Entrepreneur";
  const businessName = demoProfile?.businessName ?? sample?.businessName ?? "Your business";
  const country = demoProfile?.country ?? sample?.country ?? "Add your country";
  const sector = demoProfile?.sector ?? sample?.sector ?? "Add your sector";
  const esgActivity = demoProfile?.esgActivity ?? sample?.esgActivity ?? "";
  const hasProfileStarted = Boolean(demoProfile?.businessName || demoProfile?.country || demoProfile?.sector || sample);
  const hasEsgActivity = esgActivity.trim().length > 20;
  const hasApplication = demoApplications.length > 0;
  const readinessScore = [
    onboarding?.hasProfile ?? false,
    hasEsgActivity,
    onboarding?.hasFirstArtefact ?? false,
    onboarding?.hasFirstListing ?? false,
    hasApplication,
  ].filter(Boolean).length;
  const completion = Math.round((readinessScore / 5) * 100);
  const workflowStep = getEntrepreneurWorkflowStep({
    hasProfile: onboarding?.hasProfile ?? false,
    hasEsgActivity,
    hasFirstListing: onboarding?.hasFirstListing ?? false,
    hasFirstArtefact: onboarding?.hasFirstArtefact ?? false,
  });

  const listingItems =
    demoListings.length > 0
      ? demoListings.map((listing) => ({
          id: listing.id,
          title: listing.title,
          meta: `${listing.category} · published ${formatIsoDate(listing.publishedAt)}`,
        }))
      : sample
      ? sample.products.map((product) => ({
          id: product,
          title: product,
          meta: "Showcase sample listing",
        }))
      : [];

  const recentEnquiries =
    demoEnquiries.length > 0
      ? demoEnquiries.map((enquiry) => ({
          buyer: enquiry.targetBusiness,
          item: enquiry.listingTitle,
          time: formatIsoDate(enquiry.createdAt),
        }))
      : sample
      ? sampleEnquiries
      : [];

  const readinessChecklist = [
    {
      item: "Business profile",
      status: statusForProfile(Boolean(onboarding?.hasProfile), hasProfileStarted),
    },
    {
      item: "Verification documents",
      status: statusForProfile(Boolean(onboarding?.hasFirstArtefact), myArtefacts.length > 0),
    },
    {
      item: "ESG self-assessment",
      status: statusForProfile(hasEsgActivity, Boolean(esgActivity.trim())),
    },
    {
      item: "Marketplace listing(s)",
      status: statusForProfile(Boolean(onboarding?.hasFirstListing), demoListings.length > 0),
    },
    {
      item: "Funding readiness questionnaire",
      status:
        onboarding?.hasProfile && hasEsgActivity && onboarding.hasFirstArtefact
          ? "in-progress"
          : "todo",
    },
    {
      item: "Market access portfolio",
      status:
        onboarding?.hasProfile && hasEsgActivity && onboarding?.hasFirstListing
          ? "in-progress"
          : "todo",
    },
  ] as const;

  const nextAction =
    !(onboarding?.hasProfile ?? false)
      ? "Finish your business profile so funders and buyers can understand what you do."
      : !hasEsgActivity
      ? "Add your ESG activity next so the platform can show your impact story."
      : !(onboarding?.hasFirstListing ?? false)
      ? "Create your first marketplace listing so buyers can find you."
      : !(onboarding?.hasFirstArtefact ?? false)
      ? "Upload verification documents to complete your readiness checklist."
      : "You are ready to apply for curated opportunities and buyer enquiries.";

  return (
    <div className="flex min-h-screen flex-col lg:flex-row">
      <PortalSidebar currentRole="entrepreneur" nav={getEntrepreneurNav("/portal/entrepreneur")} />

      <div className="flex-1">
        <header className="border-b border-cream-200 bg-white">
          <div className="container-edge flex flex-wrap items-center justify-between gap-4 py-6 lg:px-8">
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-forest-800 font-serif text-cream-50">
                {buildInitials(name)}
              </div>
              <div>
                <p className="text-xs text-charcoal-400">Welcome back</p>
                <p className="font-serif text-xl text-forest-900">{name}</p>
                <p className="text-xs text-charcoal-500">
                  {businessName} · {country} · {sector}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <ReadinessBadge level={getReadinessLevel(readinessScore)} />
              <Link href="/portal/entrepreneur/applications" className="btn-secondary !px-3 !py-2 text-xs">
                My applications
              </Link>
              <Link href="/portal/entrepreneur/opportunities" className="btn-secondary !px-3 !py-2 text-xs">
                Open opportunities
              </Link>
              <Link href="/portal/entrepreneur/listings/new" className="btn-primary !px-3 !py-2 text-xs">
                New listing
              </Link>
            </div>
          </div>
        </header>

        <PortalWorkflowStrip roleId="entrepreneur" currentStep={workflowStep} />

        <div className="container-edge py-8 lg:px-8">
          <div className="mb-8">
            <OnboardingCard state={onboarding} role="entrepreneur" />
          </div>

          <div className="grid gap-6 lg:grid-cols-3">
            <div className="rounded-2xl border border-gold-200 bg-gradient-to-br from-gold-50 to-cream-50 p-6 lg:col-span-2">
              <div className="flex items-baseline justify-between gap-4">
                <div>
                  <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-gold-700">
                    Profile readiness
                  </p>
                  <p className="mt-2 font-serif text-3xl text-forest-900">{completion}% complete</p>
                  <p className="mt-1 text-sm text-charcoal-500">{nextAction}</p>
                </div>
                <Link href="/settings" className="btn-gold !px-3 !py-2 text-xs">
                  Continue setup
                </Link>
              </div>
              <div className="mt-5 h-2 overflow-hidden rounded-full bg-cream-200">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-forest-700 to-gold-400"
                  style={{ width: `${completion}%` }}
                />
              </div>
            </div>

            <DashboardCard title="Your workspace" description="Live progress for this account">
              <ul className="space-y-3 text-sm">
                <li className="flex items-baseline justify-between">
                  <span className="text-charcoal-500">Documents uploaded</span>
                  <span className="font-serif text-lg text-forest-900">{myArtefacts.length}</span>
                </li>
                <li className="flex items-baseline justify-between">
                  <span className="text-charcoal-500">Listings live</span>
                  <span className="font-serif text-lg text-forest-900">{listingItems.length}</span>
                </li>
                <li className="flex items-baseline justify-between">
                  <span className="text-charcoal-500">Applications sent</span>
                  <span className="font-serif text-lg text-forest-900">{demoApplications.length}</span>
                </li>
                <li className="flex items-baseline justify-between">
                  <span className="text-charcoal-500">Enquiries sent</span>
                  <span className="font-serif text-lg text-forest-900">{demoEnquiries.length}</span>
                </li>
              </ul>
            </DashboardCard>
          </div>

          <div className="mt-6 grid gap-6 lg:grid-cols-3">
            <DashboardCard
              title="Readiness checklist"
              description="This updates as you complete each step in your entrepreneur flow."
              action="Open"
              className="lg:col-span-2"
            >
              <ul className="divide-y divide-cream-200">
                {readinessChecklist.map((check) => (
                  <li key={check.item} className="flex items-center justify-between py-3">
                    <div className="flex items-center gap-3">
                      <span
                        className={
                          check.status === "complete"
                            ? "flex h-5 w-5 items-center justify-center rounded-full bg-forest-700 text-cream-50"
                            : check.status === "in-progress"
                            ? "flex h-5 w-5 items-center justify-center rounded-full bg-gold-400 text-forest-900"
                            : "flex h-5 w-5 items-center justify-center rounded-full border border-cream-300 text-charcoal-300"
                        }
                      >
                        {check.status === "complete" ? "✓" : check.status === "in-progress" ? "…" : ""}
                      </span>
                      <span className="text-sm text-forest-900">{check.item}</span>
                    </div>
                    <span
                      className={
                        check.status === "complete"
                          ? "text-[11px] font-medium uppercase tracking-wide text-forest-700"
                          : check.status === "in-progress"
                          ? "text-[11px] font-medium uppercase tracking-wide text-gold-700"
                          : "text-[11px] font-medium uppercase tracking-wide text-charcoal-400"
                      }
                    >
                      {check.status.replace("-", " ")}
                    </span>
                  </li>
                ))}
              </ul>
            </DashboardCard>

            <DashboardCard title="Recommended opportunities" action="See all">
              <ul className="space-y-3">
                {opportunities.slice(0, 3).map((opportunity) => (
                  <li key={opportunity.id} className="rounded-lg border border-cream-200 p-3">
                    <p className="text-[10px] uppercase tracking-wide text-gold-700">{opportunity.type}</p>
                    <p className="mt-0.5 text-sm font-medium text-forest-900">{opportunity.title}</p>
                    <p className="mt-1 text-[11px] text-charcoal-400">Closes {opportunity.deadline}</p>
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
              {listingItems.length > 0 ? (
                <ul className="space-y-3">
                  {listingItems.map((listing) => (
                    <li
                      key={listing.id}
                      className="flex items-center justify-between rounded-lg border border-cream-200 px-4 py-3"
                    >
                      <div>
                        <p className="text-sm font-medium text-forest-900">{listing.title}</p>
                        <p className="text-[11px] text-charcoal-400">{listing.meta}</p>
                      </div>
                      <Link
                        href="/portal/entrepreneur/listings"
                        className="text-xs font-medium text-forest-700 hover:text-gold-700"
                      >
                        View
                      </Link>
                    </li>
                  ))}
                </ul>
              ) : (
                <div className="rounded-xl border border-dashed border-cream-300 bg-cream-50 p-6 text-sm text-charcoal-500">
                  No listings yet. Create your first product or service to make the marketplace section come alive.
                </div>
              )}
            </DashboardCard>

            <DashboardCard title="Recent enquiries">
              {recentEnquiries.length > 0 ? (
                <ul className="space-y-3 text-sm">
                  {recentEnquiries.map((enquiry) => (
                    <li key={`${enquiry.buyer}-${enquiry.item}`} className="border-l-2 border-gold-300 pl-3">
                      <p className="font-medium text-forest-900">{enquiry.buyer}</p>
                      <p className="text-xs text-charcoal-500">{enquiry.item}</p>
                      <p className="text-[10px] uppercase tracking-wide text-charcoal-400">{enquiry.time}</p>
                    </li>
                  ))}
                </ul>
              ) : (
                <div className="rounded-xl border border-dashed border-cream-300 bg-cream-50 p-6 text-sm text-charcoal-500">
                  No enquiries yet. When you use the marketplace enquiry flow, they will appear here.
                </div>
              )}
            </DashboardCard>
          </div>

          <div className="mt-10">
            <DocumentVault artefacts={myArtefacts} />
          </div>
        </div>
      </div>
    </div>
  );
}
