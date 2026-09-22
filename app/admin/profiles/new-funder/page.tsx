import Link from "next/link";
import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { AdminFunderCreationForm } from "@/components/admin/AdminFunderCreationForm";

export const metadata = { title: "Onboard Funder · BHAF Admin" };
export const dynamic = "force-dynamic";

export default async function AdminNewFunderPage() {
  const session = await auth();
  if (!session?.user) redirect("/auth/sign-in?next=/admin/profiles/new-funder");
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
          Onboard Funder / Investor Partner
        </h1>
        <p className="mt-2 text-sm text-charcoal-500">
          Create an active, approved Funder account on behalf of an institutional partner or donor to eliminate onboarding friction.
        </p>

        <div className="mt-8">
          <AdminFunderCreationForm />
        </div>
      </div>
    </section>
  );
}
