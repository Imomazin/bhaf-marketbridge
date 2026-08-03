import Link from "next/link";
import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { PortalSidebar } from "@/components/layout/PortalSidebar";
import { entrepreneurs } from "@/data/entrepreneurs";
import { getDemoListings } from "@/lib/demoState";
import { getEntrepreneurNav } from "@/lib/portalNav";
import { formatIsoDate } from "@/lib/demoPresentation";

export const metadata = { title: "My listings · BHAF MarketBridge" };
export const dynamic = "force-dynamic";

export default async function EntrepreneurListingsPage({
  searchParams,
}: {
  searchParams?: { created?: string };
}) {
  const session = await auth();
  if (!session?.user) redirect("/auth/sign-in?next=/portal/entrepreneur/listings");

  const sample = session.user.id === "demo-entrepreneur" ? entrepreneurs[0] : null;
  const listings = await getDemoListings(session.user.id);
  const showcaseListings =
    listings.length > 0
      ? listings.map((listing) => ({
          id: listing.id,
          title: listing.title,
          description: listing.description,
          meta: `${listing.category} · published ${formatIsoDate(listing.publishedAt)}`,
        }))
      : sample
      ? sample.products.map((product) => ({
          id: product,
          title: product,
          description: sample.description,
          meta: "Showcase listing from the seeded entrepreneur demo account",
        }))
      : [];
  const created = searchParams?.created;

  return (
    <div className="flex min-h-screen flex-col lg:flex-row">
      <PortalSidebar currentRole="entrepreneur" nav={getEntrepreneurNav("/portal/entrepreneur/listings")} />

      <section className="flex-1 bg-cream-50 py-12 md:py-16">
        <div className="container-edge max-w-5xl lg:px-8">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-gold-700">Marketplace</p>
              <h1 className="mt-2 font-serif text-3xl text-forest-900 md:text-4xl">My listings</h1>
              <p className="mt-2 max-w-2xl text-sm text-charcoal-500">
                This is where your products and services appear once you add them. New demo listings publish instantly
                so you can see the marketplace flow end to end.
              </p>
            </div>
            <div className="flex gap-2">
              <Link href="/portal/entrepreneur" className="btn-secondary !px-3 !py-2 text-xs">
                Back to dashboard
              </Link>
              <Link href="/portal/entrepreneur/listings/new" className="btn-primary !px-3 !py-2 text-xs">
                New listing
              </Link>
            </div>
          </div>

          {created && (
            <div className="mt-6 rounded-xl border border-forest-200 bg-forest-50 px-4 py-3 text-sm text-forest-800">
              Listing created successfully. It is now visible in this demo account and on the marketplace.
            </div>
          )}

          {showcaseListings.length > 0 ? (
            <div className="mt-8 grid gap-4 md:grid-cols-2">
              {showcaseListings.map((listing) => (
                <article key={listing.id} className="card p-6">
                  <p className="text-[11px] font-semibold uppercase tracking-wide text-gold-700">{listing.meta}</p>
                  <h2 className="mt-2 font-serif text-xl text-forest-900">{listing.title}</h2>
                  <p className="mt-3 text-sm leading-relaxed text-charcoal-500">{listing.description}</p>
                  <div className="mt-5">
                    <Link href="/marketplace" className="text-xs font-medium text-forest-700 hover:text-gold-700">
                      View on marketplace →
                    </Link>
                  </div>
                </article>
              ))}
            </div>
          ) : (
            <div className="card mt-8 p-10 text-center">
              <h2 className="font-serif text-2xl text-forest-900">No listings yet</h2>
              <p className="mt-2 text-sm text-charcoal-500">
                Create your first listing and it will show here and on the public marketplace.
              </p>
              <Link href="/portal/entrepreneur/listings/new" className="btn-primary mt-5 inline-flex !px-4 !py-2 text-xs">
                Create my first listing
              </Link>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
