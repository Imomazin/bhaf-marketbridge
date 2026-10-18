import Link from "next/link";
import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { NewOpportunityForm } from "@/components/opportunities/NewOpportunityForm";

export const metadata = { title: "Publish opportunity · BHAF MarketBridge" };
export const dynamic = "force-dynamic";

export default async function PublishOpportunityPage() {
  const session = await auth();
  if (!session?.user) redirect("/auth/sign-in?next=/admin/opportunities/new");
  if (session.user.role !== "ADMIN" && session.user.role !== "AUDITOR") redirect("/");

  return (
    <section className="bg-cream-50 py-12 md:py-16">
      <div className="container-edge max-w-3xl">
        <Link href="/admin/opportunities" className="text-xs font-medium text-forest-700 hover:text-gold-700">
          ← Opportunities
        </Link>
        <p className="mt-4 text-[11px] font-semibold uppercase tracking-[0.18em] text-gold-700">
          Admin
        </p>
        <h1 className="mt-2 font-serif text-3xl text-forest-900 md:text-4xl">New opportunity</h1>
        <p className="mt-2 text-sm text-charcoal-500">
          Save as a draft to keep working on it, or publish now to make it visible on /opportunities immediately.
        </p>

        <div className="card mt-8 p-6">
          <NewOpportunityForm />
        </div>
      </div>
    </section>
  );
}
