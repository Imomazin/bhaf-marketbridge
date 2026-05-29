import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { prisma, DB_ENABLED } from "@/lib/db";
import { ChangePasswordForm } from "@/components/settings/ChangePasswordForm";
import { UpdateProfileForm } from "@/components/settings/UpdateProfileForm";
import { DeleteAccountSection } from "@/components/settings/DeleteAccountSection";

export const metadata = { title: "Account settings · BHAF MarketBridge" };
export const dynamic = "force-dynamic";

export default async function SettingsPage() {
  const session = await auth();
  if (!session?.user) redirect("/auth/sign-in?next=/settings");

  let user = null;
  if (DB_ENABLED && prisma) {
    user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: { id: true, email: true, name: true, role: true, createdAt: true, emailVerified: true },
    });
  }

  return (
    <section className="bg-cream-50 py-12 md:py-16">
      <div className="container-edge max-w-3xl">
        <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-gold-700">
          Account settings
        </p>
        <h1 className="mt-2 font-serif text-3xl text-forest-900 md:text-4xl">
          Manage your account
        </h1>
        <p className="mt-2 text-sm text-charcoal-500">
          Signed in as <strong>{user?.email ?? session.user.email}</strong> · {user?.role ?? session.user.role}
        </p>

        <div className="mt-10 space-y-6">
          <section className="card p-6">
            <h2 className="font-serif text-lg text-forest-900">Profile</h2>
            <p className="mt-1 text-xs text-charcoal-500">Your display name. Email cannot be changed here.</p>
            <div className="mt-5">
              <UpdateProfileForm initialName={user?.name ?? ""} />
            </div>
          </section>

          <section className="card p-6">
            <h2 className="font-serif text-lg text-forest-900">Change password</h2>
            <p className="mt-1 text-xs text-charcoal-500">
              At least 10 characters, including an uppercase letter and a digit.
            </p>
            <div className="mt-5">
              <ChangePasswordForm />
            </div>
          </section>

          <DeleteAccountSection />
        </div>
      </div>
    </section>
  );
}
