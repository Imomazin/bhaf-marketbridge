import Link from "next/link";
import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { NewRfpForm } from "@/components/rfps/NewRfpForm";

export const metadata = { title: "New RFP · BHAF MarketBridge" };
export const dynamic = "force-dynamic";

export default async function NewRfpPage() {
  const session = await auth();
  if (!session?.user) redirect("/auth/sign-in?next=/portal/corporate/rfps/new");
  if (session.user.role !== "CORPORATE" && session.user.role !== "ADMIN") redirect("/");

  return (
    <section className="bg-cream-50 py-12 md:py-16">
      <div className="container-edge max-w-3xl">
        <Link href="/portal/corporate" className="text-xs font-medium text-forest-700 hover:text-gold-700">
          ← Workspace
        </Link>
        <p className="mt-4 text-[11px] font-semibold uppercase tracking-[0.18em] text-gold-700">
          Procurement
        </p>
        <h1 className="mt-2 font-serif text-3xl text-forest-900 md:text-4xl">Post a new RFP</h1>
        <p className="mt-2 text-sm text-charcoal-500">
          Verified women-led suppliers will see your RFP on the marketplace. You'll review responses from the
          corporate workspace.
        </p>

        <div className="card mt-8 p-6">
          <NewRfpForm />
        </div>
      </div>
    </section>
  );
}
