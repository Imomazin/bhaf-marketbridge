import { redirect } from "next/navigation";
import Link from "next/link";
import { auth } from "@/auth";
import { PortalSidebar } from "@/components/layout/PortalSidebar";
import { DocumentVault } from "@/components/sections/DocumentVault";
import { entrepreneurs } from "@/data/entrepreneurs";
import { loadMyArtefacts } from "@/lib/queries/artefacts";
import { getDemoEntrepreneurProfile } from "@/lib/demoState";
import { getEntrepreneurNav } from "@/lib/portalNav";

export const metadata = { title: "ESG documentation · BHAF MarketBridge" };
export const dynamic = "force-dynamic";

export default async function EntrepreneurEsgPage() {
  const session = await auth();
  if (!session?.user) redirect("/auth/sign-in?next=/portal/entrepreneur/esg");

  const sample = session.user.id === "demo-entrepreneur" ? entrepreneurs[0] : null;
  const [profile, { artefacts }] = await Promise.all([
    getDemoEntrepreneurProfile(session.user.id),
    loadMyArtefacts(session.user.id, "entrepreneur"),
  ]);

  const esgNarrative = profile?.esgActivity ?? sample?.esgActivity ?? "";
  const womenSupported = profile?.womenSupported ?? sample?.womenSupported ?? 0;
  const jobsCreated = profile?.jobsCreated ?? sample?.jobsCreated ?? 0;
  const yearFounded = profile?.yearFounded ?? sample?.yearFounded ?? null;

  return (
    <div className="flex min-h-screen flex-col lg:flex-row">
      <PortalSidebar currentRole="entrepreneur" nav={getEntrepreneurNav("/portal/entrepreneur/esg")} />

      <section className="flex-1 bg-cream-50 py-12 md:py-16">
        <div className="container-edge lg:px-8">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-gold-700">Impact</p>
              <h1 className="mt-2 font-serif text-3xl text-forest-900 md:text-4xl">ESG documentation</h1>
              <p className="mt-2 max-w-2xl text-sm text-charcoal-500">
                Add your impact story here, then upload the supporting documents that prove it.
              </p>
            </div>
            <Link href="/settings" className="btn-secondary !px-3 !py-2 text-xs">
              Edit profile details
            </Link>
          </div>

          <div className="mt-8 grid gap-4 md:grid-cols-3">
            <div className="card p-5">
              <p className="text-[11px] uppercase tracking-wide text-charcoal-400">Women supported</p>
              <p className="mt-2 font-serif text-3xl text-forest-900">{womenSupported}</p>
            </div>
            <div className="card p-5">
              <p className="text-[11px] uppercase tracking-wide text-charcoal-400">Jobs created</p>
              <p className="mt-2 font-serif text-3xl text-forest-900">{jobsCreated}</p>
            </div>
            <div className="card p-5">
              <p className="text-[11px] uppercase tracking-wide text-charcoal-400">Year founded</p>
              <p className="mt-2 font-serif text-3xl text-forest-900">{yearFounded ?? "—"}</p>
            </div>
          </div>

          <div className="card mt-6 p-6">
            <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-gold-700">ESG story</p>
            <p className="mt-3 text-sm leading-relaxed text-charcoal-600">
              {esgNarrative ||
                "You have not added your ESG activity yet. Use Manage your account to describe your environmental, social and governance work before uploading supporting evidence."}
            </p>
          </div>

          <div className="mt-10">
            <DocumentVault artefacts={artefacts} />
          </div>
        </div>
      </section>
    </div>
  );
}
