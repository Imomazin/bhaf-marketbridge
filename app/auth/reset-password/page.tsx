import Link from "next/link";
import { ResetPasswordForm } from "@/components/auth/ResetPasswordForm";

export const metadata = { title: "Set new password · BHAF MarketBridge" };

export default async function ResetPasswordPage({
  searchParams,
}: {
  searchParams: Promise<{ email?: string }>;
}) {
  const query = await searchParams;

  if (!query.email) {
    return (
      <div className="card p-8">
        <h1 className="font-serif text-2xl text-forest-900">Missing Information</h1>
        <p className="mt-2 text-sm text-charcoal-500">
          We need your email address to reset your password. Please start the process over.
        </p>
        <p className="mt-6 text-center text-xs">
          <Link href="/auth/forgot-password" className="font-medium text-forest-800 hover:text-gold-700">
            Request a new verification code
          </Link>
        </p>
      </div>
    );
  }

  return (
    <div className="card p-8">
      <h1 className="font-serif text-2xl text-forest-900">Enter verification code</h1>
      <p className="mt-1 text-sm text-charcoal-500">Check your email for the 6-digit code.</p>
      <div className="mt-6">
        <ResetPasswordForm email={query.email} />
      </div>
    </div>
  );
}
