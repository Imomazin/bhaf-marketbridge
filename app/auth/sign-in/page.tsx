import Link from "next/link";
import { SignInForm } from "@/components/auth/SignInForm";

export const metadata = { title: "Sign in · BHAF MarketBridge" };

export default function SignInPage({
  searchParams,
}: {
  searchParams: { next?: string; error?: string };
}) {
  return (
    <div className="card p-8">
      <h1 className="font-serif text-2xl text-forest-900">Welcome back</h1>
      <p className="mt-1 text-sm text-charcoal-500">
        Sign in to your MarketBridge workspace.
      </p>

      {searchParams.error && (
        <div className="mt-4 rounded-md border border-red-200 bg-red-50 px-3 py-2 text-xs text-red-700">
          {searchParams.error === "CredentialsSignin"
            ? "Those credentials didn't match. Try again or reset your password."
            : "Something went wrong. Please try again."}
        </div>
      )}

      <div className="mt-6">
        <SignInForm next={searchParams.next} />
      </div>

      <div className="mt-6 flex items-center justify-between text-xs text-charcoal-500">
        <Link href="/auth/forgot-password" className="font-medium text-forest-800 hover:text-gold-700">
          Forgot password?
        </Link>
        <Link href="/auth/sign-up" className="font-medium text-forest-800 hover:text-gold-700">
          Create an account
        </Link>
      </div>
    </div>
  );
}
