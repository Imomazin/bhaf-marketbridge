import Link from "next/link";
import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { prisma, DB_ENABLED } from "@/lib/db";
import { PortalSidebar } from "@/components/layout/PortalSidebar";
import { entrepreneurs } from "@/data/entrepreneurs";
import { getDemoListings } from "@/lib/demoState";
import { getEntrepreneurNav } from "@/lib/portalNav";
import { formatIsoDate } from "@/lib/demoPresentation";
import { cn } from "@/lib/utils";

export const metadata = { title: "My listings · BHAF MarketBridge" };
export const dynamic = "force-dynamic";

const statusTone: Record<string, string> = {
  DRAFT: "bg-cream-100 text-charcoal-500 border-cream-300",
  PENDING_REVIEW: "bg-gold-50 text-gold-800 border-gold-200",
  PUBLISHED: "bg-forest-50 text-forest-800 border-forest-200",
  REJECTED: "bg-red-50 text-red-700 border-red-200",
  ARCHIVED: "bg-cream-100 text-charcoal-400 border-cream-300",
};

export default async function EntrepreneurListingsPage({
  searchParams,
}: {
  searchParams?: { created?: string };
}) {
  const session = await auth();
  if (!session?.user) redirect("/auth/sign-in?next=/portal/entrepreneur/listings");

  const sample = session.user.id === "demo-entrepreneur" ? entrepreneurs[0] : null;

  let showcaseListings: { id: string; title: string; description: string; meta: string; status: string }[];

  if (DB_ENABLED && prisma) {
    const realListings = await prisma.listing.findMany({
      where: { ownerId: session.user.id },
      orderBy: { createdAt: "desc" },
    });
    showcaseListings = realListings.map((listing) => ({
      id: listing.id,
      title: listing.title,
      description: listing.description,
      meta: `${listing.category} · ${listing.status.toLowerCase().replace(/_/g, " ")}`,
      status: listing.status,
    }));
  } else {
    const demoListings = await getDemoListings(session.user.id);
    showcaseListings =
      demoListings.length > 0
        ? demoListings.map((listing) => ({
            id: listing.id,
            title: listing.title,
            description: listing.description,
            meta: `${listing.category} · published ${formatIsoDate(listing.publishedAt)}`,
            status: "PUBLISHED",
          }))
        : sample
        ? sample.products.map((product) => ({
            id: product,
            title: product,
            description: sample.description,
            meta: "Showcase listing from the seeded entrepreneur demo account",
            status: "PUBLISHED",
          }))
        : [];
  }
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
                New listings go to BHAF for review before they appear on the public marketplace.
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
              Listing submitted for review — it'll appear here and on the marketplace once approved.
            </div>
          )}

          {showcaseListings.length > 0 ? (
            <div className="mt-8 grid gap-4 md:grid-cols-2">
              {showcaseListings.map((listing) => (
                <article key={listing.id} className="card p-6">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <p className="text-[11px] font-semibold uppercase tracking-wide text-gold-700">{listing.meta}</p>
                    <span
                      className={cn(
                        "rounded-full border px-2 py-0.5 text-[9px] font-semibold uppercase tracking-wider",
                        statusTone[listing.status] ?? statusTone.DRAFT,
                      )}
                    >
                      {listing.status.toLowerCase().replace(/_/g, " ")}
                    </span>
                  </div>
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
