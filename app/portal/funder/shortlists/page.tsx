import Link from "next/link";
import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { PortalSidebar } from "@/components/layout/PortalSidebar";
import { ReadinessBadge } from "@/components/ui/ReadinessBadge";
import { buildFunderShortlistsFromEntries, getSavedFunderShortlistEntries } from "@/lib/funderShortlists";
import { FUNDER_MATCHES, SEEDED_FUNDER_SHORTLISTS, isSeededFunderAccount } from "@/lib/funderPortal";
import { getFunderNav } from "@/lib/portalNav";

export const metadata = { title: "Shortlists · BHAF MarketBridge" };
export const dynamic = "force-dynamic";

export default async function FunderShortlistsPage() {
  const session = await auth();
  if (!session?.user) redirect("/auth/sign-in?next=/portal/funder/shortlists");

  const savedEntries = await getSavedFunderShortlistEntries(session.user.id);
  const shortlists = [
    ...buildFunderShortlistsFromEntries(savedEntries),
    ...(isSeededFunderAccount(session.user.id) ? SEEDED_FUNDER_SHORTLISTS : []),
  ];
  const suggestedMatches = FUNDER_MATCHES.slice(0, 3);

  return (
    <div className="flex min-h-screen flex-col lg:flex-row">
      <PortalSidebar currentRole="funder" nav={getFunderNav("/portal/funder/shortlists")} />

      <section className="flex-1 bg-cream-50 py-12 md:py-16">
        <div className="container-edge max-w-6xl lg:px-8">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-gold-700">Investment desk</p>
              <h1 className="mt-2 font-serif text-3xl text-forest-900 md:text-4xl">Shortlists</h1>
              <p className="mt-2 max-w-2xl text-sm text-charcoal-500">
                Shortlists help the funder group strong ventures before deeper diligence or committee review.
              </p>
            </div>
            <Link href="/directory" className="btn-primary !px-3 !py-2 text-xs">
              Browse directory
            </Link>
          </div>

          {shortlists.length > 0 ? (
            <div className="mt-8 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
              {shortlists.map((shortlist) => (
                <article key={shortlist.id} className="card p-6">
                  <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-gold-700">
                    {shortlist.owner}
                  </p>
                  <h2 className="mt-2 font-serif text-2xl text-forest-900">{shortlist.name}</h2>
                  <p className="mt-2 text-sm text-charcoal-600">{shortlist.focus}</p>
                  <p className="mt-3 text-xs text-charcoal-400">
                    {shortlist.count} entrepreneurs · updated {shortlist.updatedAt}
                  </p>

                  <ul className="mt-4 space-y-2">
                    {shortlist.members.map((member) => (
                      <li key={member} className="rounded-lg border border-cream-200 bg-cream-50 px-3 py-2 text-sm text-forest-900">
                        {member}
                      </li>
                    ))}
                  </ul>
                </article>
              ))}
            </div>
          ) : (
            <div className="card mt-8 p-10 text-center">
              <h2 className="font-serif text-2xl text-forest-900">No shortlists yet</h2>
              <p className="mt-2 max-w-2xl text-sm text-charcoal-500">
                Once a funder finds promising ventures in the directory, they can group them here for team review or
                donor conversations.
              </p>
            </div>
          )}

          <div className="mt-8">
            <div className="flex flex-wrap items-end justify-between gap-3">
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-gold-700">Suggested matches</p>
                <h2 className="mt-1 font-serif text-2xl text-forest-900">Funding-ready ventures to review</h2>
              </div>
              <Link href="/directory" className="text-xs font-medium text-forest-700 hover:text-gold-700">
                View all in directory →
              </Link>
            </div>

            <div className="mt-4 grid gap-4 md:grid-cols-3">
              {suggestedMatches.map((entrepreneur) => (
                <article key={entrepreneur.id} className="card p-5">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <h3 className="font-serif text-xl text-forest-900">{entrepreneur.businessName}</h3>
                      <p className="mt-1 text-xs text-charcoal-500">
                        {entrepreneur.name} · {entrepreneur.country}
                      </p>
                    </div>
                    <ReadinessBadge level={entrepreneur.readinessLevel} />
                  </div>
                  <p className="mt-3 text-sm leading-relaxed text-charcoal-600">{entrepreneur.description}</p>
                  <p className="mt-3 text-xs text-charcoal-500">{entrepreneur.fundingNeed}</p>
                </article>
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
