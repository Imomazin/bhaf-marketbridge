import Link from "next/link";
import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { prisma, DB_ENABLED } from "@/lib/db";
import { PortalSidebar } from "@/components/layout/PortalSidebar";
import { getEntrepreneurNav } from "@/lib/portalNav";
import { EditListingForm } from "@/components/listings/EditListingForm";

export const metadata = { title: "Edit listing · BHAF MarketBridge" };
export const dynamic = "force-dynamic";

export default async function EditListingPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const session = await auth();
  if (!session?.user) redirect("/auth/sign-in");

  if (!DB_ENABLED || !prisma) {
    return (
      <div className="flex min-h-screen flex-col lg:flex-row">
        <PortalSidebar currentRole="entrepreneur" nav={getEntrepreneurNav("/portal/entrepreneur/listings")} />
        <section className="flex-1 bg-cream-50 py-12 md:py-16">
          <div className="container-edge max-w-2xl">
            <div className="card p-6">Database not configured.</div>
          </div>
        </section>
      </div>
    );
  }

  const listing = await prisma.listing.findUnique({
    where: { id },
  });

  if (!listing) return redirect("/portal/entrepreneur/listings");
  if (listing.ownerId !== session.user.id) return redirect("/portal/entrepreneur/listings");

  return (
    <div className="flex min-h-screen flex-col lg:flex-row">
      <PortalSidebar currentRole="entrepreneur" nav={getEntrepreneurNav("/portal/entrepreneur/listings")} />

      <section className="flex-1 bg-cream-50 py-12 md:py-16">
        <div className="container-edge max-w-2xl lg:px-8">
          <Link href="/portal/entrepreneur/listings" className="text-xs font-medium text-forest-700 hover:text-gold-700">
            ← Back to listings
          </Link>
          <div className="mt-4">
            <h1 className="font-serif text-3xl text-forest-900 md:text-4xl">Edit listing</h1>
            <p className="mt-2 text-sm text-charcoal-500">
              Update the details of your listing.
            </p>
          </div>

          <div className="card mt-8 p-6">
            <EditListingForm id={listing.id} initialData={listing} />
          </div>
        </div>
      </section>
    </div>
  );
}
