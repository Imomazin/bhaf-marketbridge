import Link from "next/link";
import { performEmailVerification } from "@/app/actions/verify-email";

export const metadata = {
  title: "Verify email · BHAF MarketBridge",
  robots: { index: false, follow: false },
};
export const dynamic = "force-dynamic";

export default async function VerifyEmailPage({
  searchParams,
}: {
  searchParams: { token?: string; uid?: string };
}) {
  if (!searchParams.token || !searchParams.uid) {
    return (
      <div className="card p-8">
        <h1 className="font-serif text-2xl text-forest-900">Invalid verification link</h1>
        <p className="mt-2 text-sm text-charcoal-500">
          The link is incomplete. Sign in and request a new one.
        </p>
        <p className="mt-6 text-center text-xs">
          <Link href="/auth/sign-in" className="font-medium text-forest-800 hover:text-gold-700">
            Back to sign in
          </Link>
        </p>
      </div>
    );
  }

  const result = await performEmailVerification(searchParams.token, searchParams.uid);

  return (
    <div className="card p-8">
      <h1 className="font-serif text-2xl text-forest-900">
        {result.ok ? "Email verified" : "Couldn't verify"}
      </h1>
      <p className="mt-2 text-sm text-charcoal-500">{result.message}</p>
      <p className="mt-6 text-center text-xs">
        <Link href={result.ok ? "/portal" : "/auth/sign-in"} className="font-medium text-forest-800 hover:text-gold-700">
          {result.ok ? "Continue to your workspace →" : "Back to sign in"}
        </Link>
      </p>
    </div>
  );
}
