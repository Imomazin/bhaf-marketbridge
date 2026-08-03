import Link from "next/link";
import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { PortalSidebar } from "@/components/layout/PortalSidebar";
import { DocumentVault } from "@/components/sections/DocumentVault";
import { getDemoFunderProfile } from "@/lib/demoState";
import { getDemoSeedFunderProfile } from "@/lib/funderPortal";
import { getFunderNav } from "@/lib/portalNav";
import { loadMyArtefacts } from "@/lib/queries/artefacts";
import { loadOnboardingState } from "@/lib/queries/onboarding";

export const metadata = { title: "Compliance vault · BHAF MarketBridge" };
export const dynamic = "force-dynamic";

export default async function FunderVaultPage() {
  const session = await auth();
  if (!session?.user) redirect("/auth/sign-in?next=/portal/funder/vault");

  const [{ artefacts }, onboarding, demoProfile] = await Promise.all([
    loadMyArtefacts(session.user.id, "funder"),
    loadOnboardingState(session.user.id, session.user.role),
    getDemoFunderProfile(session.user.id),
  ]);

  const profile = demoProfile ?? getDemoSeedFunderProfile(session.user.id);
  const requiredArtefacts = artefacts.filter((artefact) => artefact.required).length;

  return (
    <div className="flex min-h-screen flex-col lg:flex-row">
      <PortalSidebar currentRole="funder" nav={getFunderNav("/portal/funder/vault")} />

      <section className="flex-1 bg-cream-50 py-12 md:py-16">
        <div className="container-edge lg:px-8">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-gold-700">Compliance</p>
              <h1 className="mt-2 font-serif text-3xl text-forest-900 md:text-4xl">Compliance vault</h1>
              <p className="mt-2 max-w-2xl text-sm text-charcoal-500">
                Upload the documents that support your funder profile, mandate and diligence process.
              </p>
            </div>
            <Link href="/settings" className="btn-secondary !px-3 !py-2 text-xs">
              Edit mandate
            </Link>
          </div>

          <div className="mt-8 grid gap-4 md:grid-cols-3">
            <article className="card p-5">
              <p className="text-[11px] uppercase tracking-wide text-charcoal-400">Mandate status</p>
              <p className="mt-2 font-serif text-3xl text-forest-900">{onboarding.hasProfile ? "Ready" : "Pending"}</p>
            </article>
            <article className="card p-5">
              <p className="text-[11px] uppercase tracking-wide text-charcoal-400">Documents uploaded</p>
              <p className="mt-2 font-serif text-3xl text-forest-900">{artefacts.length}</p>
            </article>
            <article className="card p-5">
              <p className="text-[11px] uppercase tracking-wide text-charcoal-400">Required documents</p>
              <p className="mt-2 font-serif text-3xl text-forest-900">{requiredArtefacts}</p>
            </article>
          </div>

          <div className="card mt-6 p-6">
            <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-gold-700">What belongs here</p>
            <p className="mt-3 text-sm leading-relaxed text-charcoal-600">
              Use this vault for fund mandate files, KYC, governance documents, impact-policy notes, donor compliance
              requirements and any other evidence you want available during introductions or diligence.
            </p>
            {profile?.mandate && (
              <p className="mt-4 rounded-xl border border-cream-200 bg-cream-50 px-4 py-3 text-sm text-charcoal-600">
                <span className="font-semibold text-forest-900">Current mandate:</span> {profile.mandate}
              </p>
            )}
          </div>

          <div className="mt-10">
            <DocumentVault
              artefacts={artefacts}
              title="Compliance & mandate vault"
              intro="Upload what your team needs for introductions, review and reporting. New demo uploads appear here immediately so the flow is visible in the video."
            />
          </div>
        </div>
      </section>
    </div>
  );
}
