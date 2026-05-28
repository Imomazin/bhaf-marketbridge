import Link from "next/link";
import { ForgotPasswordForm } from "@/components/auth/ForgotPasswordForm";

export const metadata = { title: "Forgot password · BHAF MarketBridge" };

export default function ForgotPasswordPage() {
  return (
    <div className="card p-8">
      <h1 className="font-serif text-2xl text-forest-900">Reset your password</h1>
      <p className="mt-1 text-sm text-charcoal-500">
        We'll email you a secure link to choose a new password.
      </p>
      <div className="mt-6">
        <ForgotPasswordForm />
      </div>
      <p className="mt-6 text-center text-xs text-charcoal-500">
        Remembered it?{" "}
        <Link href="/auth/sign-in" className="font-medium text-forest-800 hover:text-gold-700">
          Sign in
        </Link>
      </p>
    </div>
  );
}
