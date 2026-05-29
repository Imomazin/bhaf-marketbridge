import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { prisma, DB_ENABLED } from "@/lib/db";
import { ChangePasswordForm } from "@/components/settings/ChangePasswordForm";
import { UpdateProfileForm } from "@/components/settings/UpdateProfileForm";
import { DeleteAccountSection } from "@/components/settings/DeleteAccountSection";
import { EntrepreneurProfileForm } from "@/components/settings/EntrepreneurProfileForm";
import { FunderProfileForm } from "@/components/settings/FunderProfileForm";
import { CorporateProfileForm } from "@/components/settings/CorporateProfileForm";

export const metadata = { title: "Account settings · BHAF MarketBridge" };
export const dynamic = "force-dynamic";

export default async function SettingsPage() {
  const session = await auth();
  if (!session?.user) redirect("/auth/sign-in?next=/settings");

  let user = null;
  let entrepreneurProfile = null;
  let funderProfile = null;
  let corporateProfile = null;
  if (DB_ENABLED && prisma) {
    user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: { id: true, email: true, name: true, role: true, createdAt: true, emailVerified: true },
    });
    if (session.user.role === "ENTREPRENEUR") {
      entrepreneurProfile = await prisma.entrepreneurProfile.findUnique({
        where: { userId: session.user.id },
      });
    }
    if (session.user.role === "FUNDER") {
      funderProfile = await prisma.funderProfile.findUnique({
        where: { userId: session.user.id },
      });
    }
    if (session.user.role === "CORPORATE") {
      corporateProfile = await prisma.corporateProfile.findUnique({
        where: { userId: session.user.id },
      });
    }
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
          {user?.emailVerified ? " · email verified" : " · email not verified"}
        </p>

        <div className="mt-10 space-y-6">
          <section className="card p-6">
            <h2 className="font-serif text-lg text-forest-900">Display name</h2>
            <div className="mt-5">
              <UpdateProfileForm initialName={user?.name ?? ""} />
            </div>
          </section>

          {session.user.role === "ENTREPRENEUR" && (
            <section className="card p-6">
              <h2 className="font-serif text-lg text-forest-900">Business profile</h2>
              <p className="mt-1 text-xs text-charcoal-500">
                These details appear on your public verified profile in the directory.
              </p>
              <div className="mt-5">
                <EntrepreneurProfileForm
                  initial={{
                    businessName: entrepreneurProfile?.businessName ?? "",
                    country: entrepreneurProfile?.country ?? "",
                    sector: entrepreneurProfile?.sector ?? "",
                    description: entrepreneurProfile?.description ?? "",
                    fundingNeed: entrepreneurProfile?.fundingNeed ?? "",
                    esgActivity: entrepreneurProfile?.esgActivity ?? "",
                    yearFounded: entrepreneurProfile?.yearFounded ?? null,
                    womenSupported: entrepreneurProfile?.womenSupported ?? 0,
                    jobsCreated: entrepreneurProfile?.jobsCreated ?? 0,
                  }}
                />
              </div>
            </section>
          )}

          {session.user.role === "FUNDER" && (
            <section className="card p-6">
              <h2 className="font-serif text-lg text-forest-900">Fund profile</h2>
              <div className="mt-5">
                <FunderProfileForm
                  initial={{
                    orgName: funderProfile?.orgName ?? "",
                    mandate: funderProfile?.mandate ?? "",
                    geoFocus: (funderProfile?.geoFocus ?? []).join(", "),
                    sectorFocus: (funderProfile?.sectorFocus ?? []).join(", "),
                    ticketMin: funderProfile?.ticketMin ?? null,
                    ticketMax: funderProfile?.ticketMax ?? null,
                  }}
                />
              </div>
            </section>
          )}

          {session.user.role === "CORPORATE" && (
            <section className="card p-6">
              <h2 className="font-serif text-lg text-forest-900">Corporate profile</h2>
              <div className="mt-5">
                <CorporateProfileForm
                  initial={{
                    orgName: corporateProfile?.orgName ?? "",
                    industry: corporateProfile?.industry ?? "",
                    procurementGeo: (corporateProfile?.procurementGeo ?? []).join(", "),
                    esgFramework: corporateProfile?.esgFramework ?? "",
                  }}
                />
              </div>
            </section>
          )}

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
