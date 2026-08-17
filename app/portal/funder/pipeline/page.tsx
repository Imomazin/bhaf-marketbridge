import Link from "next/link";
import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { PortalSidebar } from "@/components/layout/PortalSidebar";
import { ReadinessBadge } from "@/components/ui/ReadinessBadge";
import type { ReadinessLevel } from "@/data/entrepreneurs";
import {
  SEEDED_FUNDER_PIPELINE,
  SEEDED_FUNDER_PIPELINE_ENTRIES,
  getDemoSeedFunderProfile,
  isSeededFunderAccount,
} from "@/lib/funderPortal";
import { getFunderPipeline } from "@/lib/queries/pipeline";
import { getFunderNav } from "@/lib/portalNav";
import { loadOnboardingState } from "@/lib/queries/onboarding";
import { loadMyArtefacts } from "@/lib/queries/artefacts";
import { MoveStageDropdown } from "@/components/ui/MoveStageDropdown";

export const metadata = { title: "Pipeline · BHAF MarketBridge" };
export const dynamic = "force-dynamic";

export default async function FunderPipelinePage() {
  const session = await auth();
  if (!session?.user) redirect("/auth/sign-in?next=/portal/funder/pipeline");

  const [onboarding, { artefacts }, pipelineEntries] = await Promise.all([
    loadOnboardingState(session.user.id, session.user.role),
    loadMyArtefacts(session.user.id, "funder"),
    getFunderPipeline(session.user.id),
  ]);

  const seeded = isSeededFunderAccount(session.user.id);
  const profile = getDemoSeedFunderProfile(session.user.id);
  const getStageCount = (stage: string) => pipelineEntries.filter(e => e.stage === stage).length;
  
  const pipelineRows = seeded
    ? SEEDED_FUNDER_PIPELINE.map((row) =>
        row.stage === "Sourcing"
          ? { ...row, count: row.count + getStageCount("SOURCING") }
          : row,
      )
    : [
        {
          stage: "Sourcing",
          count: getStageCount("SOURCING"),
          capital: "—",
          description:
            getStageCount("SOURCING") > 0
              ? "Saved from the directory and waiting for first review."
              : "No sourced ventures yet.",
        },
        { stage: "Diligence", count: getStageCount("DILIGENCE"), capital: "—", description: "Active diligence." },
        { stage: "Term sheet", count: getStageCount("TERM_SHEET"), capital: "—", description: "Active negotiations." },
        { stage: "Closed", count: getStageCount("CLOSED"), capital: "—", description: "Closed deals." },
      ];

  return (
    <div className="flex min-h-screen flex-col lg:flex-row">
      <PortalSidebar currentRole="funder" nav={getFunderNav("/portal/funder/pipeline")} />

      <section className="flex-1 bg-cream-50 py-12 md:py-16">
        <div className="container-edge lg:px-8">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-gold-700">Investment desk</p>
              <h1 className="mt-2 font-serif text-3xl text-forest-900 md:text-4xl">Pipeline</h1>
              <p className="mt-2 max-w-2xl text-sm text-charcoal-500">
                This screen shows how ventures move from discovery into diligence and closing.
              </p>
            </div>
            <div className="flex flex-wrap gap-2">
              <Link href="/directory" className="btn-secondary !px-3 !py-2 text-xs">
                Browse directory
              </Link>
              <Link href="/portal/funder/shortlists" className="btn-primary !px-3 !py-2 text-xs">
                Open shortlists
              </Link>
            </div>
          </div>

          <div className="mt-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            {pipelineRows.map((row) => (
              <article key={row.stage} className="card p-5">
                <p className="text-[11px] uppercase tracking-wide text-charcoal-500">{row.stage}</p>
                <p className="mt-3 font-serif text-3xl text-forest-900">{row.count}</p>
                <p className="mt-1 text-xs text-charcoal-500">{row.capital}</p>
                <p className="mt-3 text-sm text-charcoal-600">{row.description}</p>
              </article>
            ))}
          </div>

          {seeded || pipelineEntries.length > 0 ? (
            <div className="mt-8 space-y-4">
              {[...pipelineEntries, ...(seeded ? SEEDED_FUNDER_PIPELINE_ENTRIES.map((entry) => ({
                ...entry,
                entrepreneur: {
                  name:
                    entry.entrepreneurId === "fatou-diop"
                      ? "Fatou Diop"
                      : entry.entrepreneurId === "amara-okafor"
                      ? "Amara Okafor"
                      : entry.entrepreneurId === "thandiwe-ncube"
                      ? "Thandiwe Ncube"
                      : entry.entrepreneurId === "naledi-mokoena"
                      ? "Naledi Mokoena"
                      : "Wanjiru Kamau",
                  businessName:
                    entry.entrepreneurId === "fatou-diop"
                      ? "Solara Mini-Grids"
                      : entry.entrepreneurId === "amara-okafor"
                      ? "GreenWeave Textiles"
                      : entry.entrepreneurId === "thandiwe-ncube"
                      ? "Sira Logistics Cloud"
                      : entry.entrepreneurId === "naledi-mokoena"
                      ? "Khaya Harvest"
                      : "Acacia Botanicals",
                  country:
                    entry.entrepreneurId === "fatou-diop"
                      ? "Senegal"
                      : entry.entrepreneurId === "amara-okafor"
                      ? "Nigeria"
                      : entry.entrepreneurId === "thandiwe-ncube"
                      ? "Zimbabwe"
                      : entry.entrepreneurId === "naledi-mokoena"
                      ? "South Africa"
                      : "Kenya",
                  sector:
                    entry.entrepreneurId === "fatou-diop"
                      ? "Clean Energy"
                      : entry.entrepreneurId === "amara-okafor"
                      ? "Circular Economy"
                      : entry.entrepreneurId === "thandiwe-ncube"
                      ? "Technology"
                      : entry.entrepreneurId === "naledi-mokoena"
                      ? "Agri-Processing"
                      : "Health & Beauty",
                  readinessLevel:
                    entry.entrepreneurId === "naledi-mokoena" || entry.entrepreneurId === "wanjiru-kamau"
                      ? ("MARKET_READY" as ReadinessLevel)
                      : ("FUNDING_READY" as ReadinessLevel),
                  description: "",
                },
              })) : [])].map((entry) => {
                const entrepreneur = entry.entrepreneur;

                return (
                  <article key={`${entry.stage}-${entry.entrepreneurId}`} className="card p-6">
                    <div className="flex flex-wrap items-start justify-between gap-4">
                      <div>
                        <div className="flex flex-1 items-center gap-3">
                          <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-gold-700">
                            {entry.stage.replace("_", " ")}
                          </p>
                          <MoveStageDropdown entrepreneurId={entry.entrepreneurId} currentStage={entry.stage} />
                        </div>
                        <h2 className="mt-2 font-serif text-2xl text-forest-900">
                          {entrepreneur.businessName}
                        </h2>
                        <p className="mt-1 text-sm text-charcoal-500">
                          {entrepreneur.name} · {entrepreneur.country} · {entrepreneur.sector}
                        </p>
                      </div>
                      <ReadinessBadge level={entrepreneur.readinessLevel} />
                    </div>

                    <div className="mt-5 grid gap-4 md:grid-cols-2">
                      <div className="rounded-xl border border-cream-200 bg-cream-50 p-4">
                        <p className="text-[10px] uppercase tracking-wide text-charcoal-400">Capital need</p>
                        <p className="mt-2 text-sm font-medium text-forest-900">{entry.capital || "To be confirmed"}</p>
                      </div>
                      <div className="rounded-xl border border-cream-200 bg-cream-50 p-4">
                        <p className="text-[10px] uppercase tracking-wide text-charcoal-400">Next step</p>
                        <p className="mt-2 text-sm font-medium text-forest-900">{entry.nextStep || "Review fit and move to next stage when ready."}</p>
                      </div>
                    </div>
                  </article>
                );
              })}
            </div>
          ) : (
            <div className="card mt-8 p-10 text-center">
              <h2 className="font-serif text-2xl text-forest-900">Your pipeline is still empty</h2>
              <p className="mt-2 max-w-2xl text-sm text-charcoal-500">
                Complete your mandate, upload at least one compliance document, then use the directory to identify the
                first ventures you want to track.
              </p>
              <div className="mt-5 flex flex-wrap justify-center gap-3">
                {!onboarding.hasProfile && (
                  <Link href="/settings" className="btn-secondary !px-4 !py-2 text-xs">
                    Set my mandate
                  </Link>
                )}
                {artefacts.length === 0 && (
                  <Link href="/portal/funder/vault" className="btn-secondary !px-4 !py-2 text-xs">
                    Upload a document
                  </Link>
                )}
                <Link href="/directory" className="btn-primary !px-4 !py-2 text-xs">
                  Find entrepreneurs
                </Link>
              </div>
            </div>
          )}

          <div className="card mt-8 p-6">
            <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-gold-700">Pipeline Guide</p>
            <p className="mt-3 text-sm leading-relaxed text-charcoal-600 mb-6">
              The pipeline is your deal-flow tracker. Once you shortlist an entrepreneur, they enter your Sourcing pipeline. Use the <strong className="text-forest-900">Move</strong> button on their card to advance them through the following stages as your relationship progresses:
            </p>
            
            <div className="grid gap-4 md:grid-cols-3">
              <div className="rounded-xl border border-cream-200 bg-cream-50 p-4">
                <p className="text-[10px] uppercase tracking-wide text-charcoal-500 font-semibold mb-2">1. Diligence</p>
                <p className="text-xs text-charcoal-600 leading-relaxed">
                  You are actively reviewing their profile, holding introductory calls, or requesting and reviewing compliance documents from their Vault.
                </p>
              </div>
              
              <div className="rounded-xl border border-cream-200 bg-cream-50 p-4">
                <p className="text-[10px] uppercase tracking-wide text-charcoal-500 font-semibold mb-2">2. Term Sheet</p>
                <p className="text-xs text-charcoal-600 leading-relaxed">
                  You have decided to invest and are currently negotiating commercial terms, structuring the deal, or awaiting final signatures.
                </p>
              </div>
              
              <div className="rounded-xl border border-cream-200 bg-cream-50 p-4">
                <p className="text-[10px] uppercase tracking-wide text-charcoal-500 font-semibold mb-2">3. Closed</p>
                <p className="text-xs text-charcoal-600 leading-relaxed">
                  The deal is signed and capital has been deployed. Post-investment impact tracking will begin shortly.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
