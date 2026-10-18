import Link from "next/link";
import { auth } from "@/auth";
import { prisma, DB_ENABLED } from "@/lib/db";
import { PortalSidebar } from "@/components/layout/PortalSidebar";
import { PortalWorkflowStrip } from "@/components/layout/PortalWorkflowStrip";
import { DashboardCard } from "@/components/cards/DashboardCard";
import { DocumentVault } from "@/components/sections/DocumentVault";
import { ProfileStatusBanner } from "@/components/settings/ProfileStatusBanner";
import { ReviewStatusBadge } from "@/components/ui/ReviewStatusBadge";
import { marketplaceListings } from "@/data/marketplace";
import { getDemoRfpsByOwner } from "@/lib/demoCorporate";
import { loadMyArtefacts } from "@/lib/queries/artefacts";

export const dynamic = "force-dynamic";

import { getCorporateNav } from "@/lib/portalNav";

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
  const [{ artefacts: myArtefacts }, demoRfps] = session?.user
    ? await Promise.all([loadMyArtefacts(session.user.id, "corporate"), getDemoRfpsByOwner(session.user.id)])
    : [{ artefacts: [] }, []];
  const reviewProfile =
    session?.user && DB_ENABLED && prisma
      ? await prisma.corporateProfile.findUnique({
          where: { userId: session.user.id },
          select: { status: true, rejectionReason: true },
        })
      : null;

  const dbRfps = session?.user && DB_ENABLED && prisma
    ? await prisma.rfp.findMany({
        where: { ownerId: session.user.id, status: { not: "DRAFT" } },
        include: { _count: { select: { responses: true } } },
        orderBy: { createdAt: "desc" },
      })
    : [];

  const dbShortlistEntries = session?.user && DB_ENABLED && prisma
    ? await prisma.shortlistEntry.findMany({
        where: { shortlist: { ownerId: session.user.id } },
        include: {
          entrepreneur: {
            include: { entrepreneurProfile: true }
          }
        },
        orderBy: { createdAt: "desc" },
        take: 6,
      })
    : [];

  const shortlistedSuppliers = (DB_ENABLED && prisma)
    ? dbShortlistEntries.map(e => ({
        id: e.entrepreneur.id,
        category: e.entrepreneur.entrepreneurProfile?.sector || "Uncategorised",
        title: e.entrepreneur.entrepreneurProfile?.businessName || "Supplier",
        business: e.entrepreneur.name || e.entrepreneur.email || "Contact",
        country: e.entrepreneur.entrepreneurProfile?.country || "Location pending",
        esgHighlight: e.entrepreneur.entrepreneurProfile?.esgActivity || "",
      }))
    : marketplaceListings.slice(0, 6);

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

  let currentStep = 2; // Browse the marketplace
  if (shortlistedSuppliers.length > 0) {
    currentStep = 3; // Shortlist verified suppliers
  }
  if (activeRfps.length > 0) {
    currentStep = 5; // Flow completed, wait, step 4 is Post RFPs. Let's say if activeRfps > 0 then step is 5 (all complete)
  } else if (shortlistedSuppliers.length > 0) {
    currentStep = 4; // Moving on to Post RFPs
  }

  return (
    <div className="flex min-h-screen flex-col lg:flex-row">
      <PortalSidebar currentRole="corporate" nav={getCorporateNav("/portal/corporate")} />

      <div className="flex-1">
        <header className="border-b border-cream-200 bg-white">
          <div className="container-edge flex flex-wrap items-center justify-between gap-4 py-6 lg:px-8">
            <div>
              <p className="text-xs text-charcoal-400">Welcome back</p>
              <p className="font-serif text-xl text-forest-900">Consumer Goods Alliance</p>
              <p className="text-xs text-charcoal-500">FMCG · West & Southern Africa procurement programme</p>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              {reviewProfile && <ReviewStatusBadge status={reviewProfile.status} />}
              <Link href="/marketplace" className="btn-secondary !py-2 !px-3 text-xs">
                Browse marketplace
              </Link>
              <Link href="/portal/corporate/rfps" className="btn-secondary !py-2 !px-3 text-xs">
                All RFPs
              </Link>
              <Link href="/portal/corporate/rfps/new" className="btn-primary !py-2 !px-3 text-xs">
                Post RFP
              </Link>
            </div>
          </div>
        </header>

        <PortalWorkflowStrip roleId="corporate" currentStep={currentStep} />

        <div className="container-edge py-8 lg:px-8">
          {reviewProfile && (
            <div className="mb-6">
              <ProfileStatusBanner status={reviewProfile.status} rejectionReason={reviewProfile.rejectionReason} />
            </div>
          )}

          <div className="mt-6" id="shortlisted-suppliers">
            <DashboardCard
              title="Shortlisted suppliers"
              description="Saved from the marketplace · review and route to procurement teams"
              action="View all"
              actionHref="/portal/corporate/shortlists"
            >
              {shortlistedSuppliers.length === 0 ? (
                <div className="py-8 text-center text-sm text-charcoal-400">
                  No shortlisted suppliers yet. Browse the directory to add some.
                </div>
              ) : (
                <ul className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
                  {shortlistedSuppliers.slice(0, 6).map((l) => (
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
              )}
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
