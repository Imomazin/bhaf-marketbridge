import { redirect } from "next/navigation";
import Link from "next/link";
import { auth } from "@/auth";
import { prisma, DB_ENABLED } from "@/lib/db";
import { PortalSidebar } from "@/components/layout/PortalSidebar";
import { DashboardCard } from "@/components/cards/DashboardCard";
import { getCorporateNav } from "@/lib/portalNav";
import { marketplaceListings } from "@/data/marketplace";

export const dynamic = "force-dynamic";

export default async function CorporateShortlistsPage() {
  const session = await auth();
  if (!session?.user) redirect("/auth/sign-in");

  const dbShortlistEntries = session?.user && DB_ENABLED && prisma
    ? await prisma.shortlistEntry.findMany({
        where: { shortlist: { ownerId: session.user.id } },
        include: {
          entrepreneur: {
            include: { entrepreneurProfile: { select: { esgActivity: true } } },
          },
        },
      })
    : [];

  const shortlistedSuppliers = DB_ENABLED
    ? dbShortlistEntries.map((e) => ({
        id: e.entrepreneurId,
        title: e.entrepreneur.name || "Unknown",
        category: "Shortlisted",
        business: "Business",
        country: "Country",
        esgHighlight: e.entrepreneur.entrepreneurProfile?.esgActivity || "",
      }))
    : marketplaceListings.slice(0, 6);

  return (
    <div className="flex min-h-screen flex-col lg:flex-row">
      <PortalSidebar currentRole="corporate" nav={getCorporateNav("/portal/corporate/shortlists")} />
      
      <div className="flex-1 bg-cream-50">
        <div className="container-edge py-8 lg:px-8">
          <h1 className="font-serif text-3xl text-forest-900">Shortlisted suppliers</h1>
          <p className="mt-2 text-sm text-charcoal-500">Saved from the marketplace · review and route to procurement teams</p>

          <div className="mt-6">
            <DashboardCard title="Suppliers">
              {shortlistedSuppliers.length === 0 ? (
                <div className="py-12 flex flex-col items-center justify-center text-center">
                  <p className="text-sm text-charcoal-500 mb-4">No shortlisted suppliers yet. Browse the directory to find and save verified entrepreneurs.</p>
                  <Link href="/directory" className="btn-primary !px-4 !py-2 text-xs">
                    Browse Directory
                  </Link>
                </div>
              ) : (
                <ul className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
                  {shortlistedSuppliers.map((l) => (
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
        </div>
      </div>
    </div>
  );
}
