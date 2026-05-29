import { redirect } from "next/navigation";
import Link from "next/link";
import { auth } from "@/auth";
import { NewListingForm } from "@/components/listings/NewListingForm";

export const metadata = { title: "New listing · BHAF MarketBridge" };
export const dynamic = "force-dynamic";

export default async function NewListingPage() {
  const session = await auth();
  if (!session?.user) redirect("/auth/sign-in?next=/portal/entrepreneur/listings/new");

  return (
    <section className="bg-cream-50 py-12 md:py-16">
      <div className="container-edge max-w-3xl">
        <Link href="/portal/entrepreneur" className="text-xs font-medium text-forest-700 hover:text-gold-700">
          ← Back to my workspace
        </Link>
        <p className="mt-4 text-[11px] font-semibold uppercase tracking-[0.18em] text-gold-700">
          Marketplace
        </p>
        <h1 className="mt-2 font-serif text-3xl text-forest-900 md:text-4xl">Publish a new listing</h1>
        <p className="mt-2 text-sm text-charcoal-500">
          Your listing goes to BHAF for review. Once approved, it appears in the public marketplace and routes
          enquiries to your inbox.
        </p>

        <div className="card mt-8 p-6">
          <NewListingForm />
        </div>

        <div className="mt-6 rounded-xl border border-gold-200 bg-gold-50 p-4 text-xs text-gold-900">
          <p className="font-semibold uppercase tracking-wide">What happens next</p>
          <ol className="mt-2 list-decimal space-y-1 pl-5">
            <li>BHAF reviews your listing (usually within 24 hours).</li>
            <li>Once approved it shows on /marketplace with your verified status.</li>
            <li>Buyer enquiries land in your workspace.</li>
          </ol>
        </div>
      </div>
    </section>
  );
}
