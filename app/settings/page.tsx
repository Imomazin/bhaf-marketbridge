import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { prisma, DB_ENABLED } from "@/lib/db";
import { ChangePasswordForm } from "@/components/settings/ChangePasswordForm";
import { UpdateProfileForm } from "@/components/settings/UpdateProfileForm";
import { DeleteAccountSection } from "@/components/settings/DeleteAccountSection";
import { EntrepreneurProfileForm } from "@/components/settings/EntrepreneurProfileForm";
import { FunderProfileForm } from "@/components/settings/FunderProfileForm";
import { CorporateProfileForm } from "@/components/settings/CorporateProfileForm";
import { KycSection } from "@/components/settings/KycSection";
import { EmailVerificationOtpForm } from "@/components/auth/EmailVerificationOtpForm";
import { getDemoCorporateProfile, getDemoSeedCorporateProfile } from "@/lib/demoCorporate";
import { getDemoEntrepreneurProfile, getDemoFunderProfile } from "@/lib/demoState";
import { getDemoUserById } from "@/lib/demoUsers";
import { getDemoSeedFunderProfile } from "@/lib/funderPortal";
import { entrepreneurs } from "@/data/entrepreneurs";

export const metadata = { title: "Account settings · BHAF MarketBridge" };
export const dynamic = "force-dynamic";

export default async function SettingsPage() {
  const session = await auth();
  if (!session?.user) redirect("/auth/sign-in?next=/settings");

  let user: {
    id: string;
    email: string;
    name: string | null;
    role: string;
    createdAt: Date;
    emailVerified: Date | null;
    kycFullName: string | null;
    kycCountry: string | null;
    kycIdType: string | null;
    kycIdNumber: string | null;
  } | null = null;
  let entrepreneurProfile: {
    businessName: string;
    country: string;
    sector: string;
    description: string;
    fundingNeed: string | null;
    esgActivity: string | null;
    yearFounded: number | null;
    womenSupported: number;
    jobsCreated: number;
  } | null = null;
  let funderProfile: {
    orgName: string;
    mandate: string;
    geoFocus: string[];
    sectorFocus: string[];
    ticketMin: number | null;
    ticketMax: number | null;
  } | null = null;
  let corporateProfile: {
    orgName: string;
    industry: string;
    procurementGeo: string[];
    esgFramework: string | null;
  } | null = null;
  if (DB_ENABLED && prisma) {
    user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        createdAt: true,
        emailVerified: true,
        kycFullName: true,
        kycCountry: true,
        kycIdType: true,
        kycIdNumber: true,
      },
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
  if (!DB_ENABLED || !prisma) {
    const demoUser = await getDemoUserById(session.user.id);
    const showcase = session.user.id === "demo-entrepreneur" ? entrepreneurs[0] : null;
    const [profile, demoFunderProfile, demoCorporateProfile] = await Promise.all([
      session.user.role === "ENTREPRENEUR" ? getDemoEntrepreneurProfile(session.user.id) : Promise.resolve(null),
      session.user.role === "FUNDER" ? getDemoFunderProfile(session.user.id) : Promise.resolve(null),
      session.user.role === "CORPORATE" ? getDemoCorporateProfile(session.user.id) : Promise.resolve(null),
    ]);
    const seededFunderProfile = session.user.role === "FUNDER" ? getDemoSeedFunderProfile(session.user.id) : null;
    const seededCorporateProfile =
      session.user.role === "CORPORATE" ? getDemoSeedCorporateProfile(session.user.id) : null;

    user = {
      id: session.user.id,
      email: demoUser?.email ?? session.user.email ?? "",
      name: demoUser?.name ?? session.user.name ?? null,
      role: demoUser?.role ?? session.user.role,
      createdAt: demoUser?.createdAt ? new Date(demoUser.createdAt) : new Date(),
      emailVerified: new Date(),
      kycFullName: null,
      kycCountry: null,
      kycIdType: null,
      kycIdNumber: null,
    };

    if (session.user.role === "ENTREPRENEUR") {
      entrepreneurProfile = {
        businessName: profile?.businessName ?? showcase?.businessName ?? "",
        country: profile?.country ?? showcase?.country ?? "",
        sector: profile?.sector ?? showcase?.sector ?? "",
        description: profile?.description ?? showcase?.description ?? "",
        fundingNeed: profile?.fundingNeed ?? showcase?.fundingNeed ?? "",
        esgActivity: profile?.esgActivity ?? showcase?.esgActivity ?? "",
        yearFounded: profile?.yearFounded ?? showcase?.yearFounded ?? null,
        womenSupported: profile?.womenSupported ?? showcase?.womenSupported ?? 0,
        jobsCreated: profile?.jobsCreated ?? showcase?.jobsCreated ?? 0,
      };
    }
    if (session.user.role === "FUNDER") {
      const activeProfile = demoFunderProfile ?? seededFunderProfile;
      funderProfile = {
        orgName: activeProfile?.orgName ?? demoUser?.name ?? "",
        mandate: activeProfile?.mandate ?? "",
        geoFocus: activeProfile?.geoFocus ?? [],
        sectorFocus: activeProfile?.sectorFocus ?? [],
        ticketMin: activeProfile?.ticketMin ?? null,
        ticketMax: activeProfile?.ticketMax ?? null,
      };
    }
    if (session.user.role === "CORPORATE") {
      const activeProfile = demoCorporateProfile ?? seededCorporateProfile;
      corporateProfile = {
        orgName: activeProfile?.orgName ?? demoUser?.name ?? "",
        industry: activeProfile?.industry ?? "",
        procurementGeo: activeProfile?.procurementGeo ?? [],
        esgFramework: activeProfile?.esgFramework ?? "",
      };
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
            <h2 className="font-serif text-lg text-forest-900">Email verification</h2>
            <p className="mt-1 text-xs text-charcoal-500">
              {user?.emailVerified
                ? "Your sign-in email is confirmed."
                : "Your email is still unverified. Enter the 6-digit code from your inbox or resend a new one."}
            </p>
            <div className="mt-5">
              <EmailVerificationOtpForm
                email={user?.email ?? session.user.email ?? ""}
                verified={Boolean(user?.emailVerified)}
              />
            </div>
          </section>

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

          <KycSection
            initialFullName={user?.kycFullName ?? user?.name ?? ""}
            initialCountry={user?.kycCountry ?? entrepreneurProfile?.country ?? "Nigeria"}
            initialIdType={user?.kycIdType ?? "National ID"}
            initialIdNumber={user?.kycIdNumber ?? ""}
          />

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
