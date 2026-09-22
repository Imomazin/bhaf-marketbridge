"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { performPasswordReset, verifyPasswordResetOtp } from "@/app/actions/password";
import { PasswordField } from "@/components/ui/PasswordField";

interface ResetPasswordFormProps {
  email: string;
}

type Step = "VERIFY" | "RESET";

export function ResetPasswordForm({ email }: ResetPasswordFormProps) {
  const router = useRouter();
  const [step, setStep] = useState<Step>("VERIFY");
  const [otp, setOtp] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [status, setStatus] = useState<{ ok: boolean; message: string } | null>(null);

  async function onVerify(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    setStatus(null);
    const res = await verifyPasswordResetOtp({ email, otp });
    if (res.ok) {
      setStep("RESET");
      setStatus(null);
    } else {
      setStatus(res);
    }
    setSubmitting(false);
  }

  async function onReset(e: React.FormEvent) {
    e.preventDefault();
    if (password !== confirm) {
      setStatus({ ok: false, message: "Passwords don't match." });
      return;
    }
    setSubmitting(true);
    const res = await performPasswordReset({ email, otp, password });
    setStatus(res);
    setSubmitting(false);
    if (res.ok) {
      setTimeout(() => router.push("/auth/sign-in"), 1500);
    }
  }

  if (step === "VERIFY") {
    return (
      <form onSubmit={onVerify} className="space-y-4">
        <label className="block">
          <span className="text-[11px] font-semibold uppercase tracking-wide text-charcoal-500">6-Digit Code</span>
          <input
            type="text"
            required
            maxLength={6}
            autoComplete="one-time-code"
            value={otp}
            onChange={(e) => setOtp(e.target.value.replace(/\D/g, ""))}
            placeholder="123456"
            className="mt-1.5 block w-full rounded-md border border-cream-300 bg-cream-50 px-3 py-2 text-sm text-forest-900 placeholder:text-charcoal-300 focus:border-forest-700 focus:outline-none"
          />
        </label>
        {status && (
          <p className="rounded-md bg-red-50 px-3 py-2 text-xs text-red-700">
            {status.message}
          </p>
        )}
        <button type="submit" disabled={submitting || otp.length !== 6} className="btn-primary w-full disabled:opacity-60">
          {submitting ? "Verifying…" : "Verify Code"}
        </button>
      </form>
    );
  }

  return (
    <form onSubmit={onReset} className="space-y-4">
      <PasswordField
        label="New password"
        required
        autoComplete="new-password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        hint="At least 10 characters with a capital letter and a number."
      />
      <PasswordField
        label="Confirm password"
        required
        autoComplete="new-password"
        value={confirm}
        onChange={(e) => setConfirm(e.target.value)}
      />

      {status && (
        <p
          className={
            status.ok
              ? "rounded-md bg-forest-50 px-3 py-2 text-xs text-forest-800"
              : "rounded-md bg-red-50 px-3 py-2 text-xs text-red-700"
          }
        >
          {status.message}
        </p>
      )}

      <button type="submit" disabled={submitting} className="btn-primary w-full disabled:opacity-60">
        {submitting ? "Saving…" : "Set new password"}
      </button>
    </form>
  );
}
