import Link from "next/link";
import { SignUpWizard } from "@/components/auth/SignUpWizard";

export const metadata = { title: "Create account · BHAF MarketBridge" };

export default function SignUpPage() {
  return (
    <div className="card p-8">
      <h1 className="font-serif text-2xl text-forest-900">Create your account</h1>
      <p className="mt-1 text-sm text-charcoal-500">
        Choose your role, then complete your profile.
      </p>

      <div className="mt-6">
        <SignUpWizard />
      </div>

      <p className="mt-6 text-center text-xs text-charcoal-500">
        Already have an account?{" "}
        <Link href="/auth/sign-in" className="font-medium text-forest-800 hover:text-gold-700">
          Sign in
        </Link>
      </p>
    </div>
  );
}
