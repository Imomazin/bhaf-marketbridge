import Link from "next/link";

export const metadata = { title: "Sign-in error · BHAF MarketBridge" };

export default function AuthErrorPage({ searchParams }: { searchParams: { error?: string } }) {
  const code = searchParams.error ?? "Default";
  const message: Record<string, string> = {
    Configuration: "Authentication isn't fully configured yet. Ask the BHAF admin to set up the auth env vars.",
    AccessDenied: "Your account doesn't have access to that area.",
    Verification: "That sign-in link is invalid or has expired.",
    Default: "Something went wrong signing you in. Try again.",
  };
  return (
    <div className="card p-8">
      <h1 className="font-serif text-2xl text-forest-900">Sign-in problem</h1>
      <p className="mt-2 text-sm text-charcoal-500">{message[code] ?? message.Default}</p>
      <p className="mt-6 text-center text-xs">
        <Link href="/auth/sign-in" className="font-medium text-forest-800 hover:text-gold-700">
          Back to sign in
        </Link>
      </p>
    </div>
  );
}
