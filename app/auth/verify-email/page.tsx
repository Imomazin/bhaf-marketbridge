import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { prisma, DB_ENABLED } from "@/lib/db";
import { EmailVerificationOtpForm } from "@/components/auth/EmailVerificationOtpForm";
import { getRoleHome } from "@/lib/routeAccess";
import { normalizeAppRedirectTarget } from "@/lib/searchParams";

export const metadata = {
  title: "Verify email · BHAF MarketBridge",
  robots: { index: false, follow: false },
};
export const dynamic = "force-dynamic";

export default async function VerifyEmailPage({
  searchParams,
}: {
  searchParams: Promise<{ next?: string; auto?: string }>;
}) {
  const query = await searchParams;
  const session = await auth();
  const defaultNext = session?.user?.role ? getRoleHome(session.user.role) : "/portal";
  const next = normalizeAppRedirectTarget(query.next, defaultNext);

  if (!session?.user) {
    redirect(
      `/auth/sign-in?next=${encodeURIComponent(
        next ? `/auth/verify-email?next=${encodeURIComponent(next)}` : "/auth/verify-email",
      )}`,
    );
  }

  if (!DB_ENABLED || !prisma) {
    return (
      <div className="card p-8">
        <h1 className="font-serif text-2xl text-forest-900">Email verification</h1>
        <p className="mt-2 text-sm text-charcoal-500">
          Email OTP verification requires a configured database.
        </p>
      </div>
    );
  }

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: { email: true, emailVerified: true, role: true },
  });
  if (!user) {
    redirect("/auth/sign-in");
  }
  if (user.emailVerified) {
    redirect(next || getRoleHome(user.role));
  }

  return (
    <div className="card p-8">
      <h1 className="font-serif text-2xl text-forest-900">Verify your email</h1>
      <p className="mt-2 text-sm text-charcoal-500">
        Enter the 6-digit verification code we sent to your inbox to activate your account.
      </p>
      <div className="mt-6">
        <EmailVerificationOtpForm
          email={user.email}
          verified={false}
          next={next || getRoleHome(user.role)}
          autoSend={query.auto === "1"}
        />
      </div>
    </div>
  );
}
