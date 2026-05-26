import Link from "next/link";
import { ResetPasswordForm } from "@/components/auth/ResetPasswordForm";

export const metadata = { title: "Set new password · BHAF MarketBridge" };

export default function ResetPasswordPage({
  searchParams,
}: {
  searchParams: { token?: string; uid?: string };
}) {
  if (!searchParams.token || !searchParams.uid) {
    return (
      <div className="card p-8">
        <h1 className="font-serif text-2xl text-forest-900">Invalid reset link</h1>
        <p className="mt-2 text-sm text-charcoal-500">
          The link you used is incomplete. Request a new one.
        </p>
        <p className="mt-6 text-center text-xs">
          <Link href="/auth/forgot-password" className="font-medium text-forest-800 hover:text-gold-700">
            Request a new reset link
          </Link>
        </p>
      </div>
    );
  }

  return (
    <div className="card p-8">
      <h1 className="font-serif text-2xl text-forest-900">Set a new password</h1>
      <p className="mt-1 text-sm text-charcoal-500">Choose something you'll remember.</p>
      <div className="mt-6">
        <ResetPasswordForm token={searchParams.token} uid={searchParams.uid} />
      </div>
    </div>
  );
}
