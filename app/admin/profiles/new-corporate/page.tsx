import Link from "next/link";
import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { AdminCorporateCreationForm } from "@/components/admin/AdminCorporateCreationForm";

export const metadata = { title: "Onboard Corporate Partner · BHAF Admin" };
export const dynamic = "force-dynamic";

export default async function AdminNewCorporatePage() {
  const session = await auth();
  if (!session?.user) redirect("/auth/sign-in?next=/admin/profiles/new-corporate");
  if (session.user.role !== "ADMIN" && session.user.role !== "AUDITOR") redirect("/");

  return (
    <section className="bg-cream-50 py-12 md:py-16">
      <div className="container-edge max-w-3xl">
        <Link href="/admin/profiles" className="text-xs font-medium text-forest-700 hover:text-gold-700">
          ← Back to profiles
        </Link>
        <p className="mt-4 text-[11px] font-semibold uppercase tracking-[0.18em] text-gold-700">
          Admin Provisioning
        </p>
        <h1 className="mt-2 font-serif text-3xl text-forest-900 md:text-4xl">
          Onboard Corporate Buyer / Partner
        </h1>
        <p className="mt-2 text-sm text-charcoal-500">
          Create an active, approved Corporate Partner account on behalf of a procurement buyer to eliminate onboarding friction.
        </p>

        <div className="mt-8">
          <AdminCorporateCreationForm />
        </div>
      </div>
    </section>
  );
}
