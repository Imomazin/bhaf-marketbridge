"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { sendVerificationEmail, verifyEmailOtp } from "@/app/actions/verify-email";
import { normalizeAppRedirectTarget } from "@/lib/searchParams";

interface EmailVerificationOtpFormProps {
  email: string;
  verified: boolean;
  next?: string;
  autoSend?: boolean;
}

export function EmailVerificationOtpForm({
  email,
  verified,
  next,
  autoSend = false,
}: EmailVerificationOtpFormProps) {
  const router = useRouter();
  const target = normalizeAppRedirectTarget(next, "/portal");
  const hasAutoSent = useRef(false);
  const [code, setCode] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [resending, setResending] = useState(false);
  const [retryAfter, setRetryAfter] = useState(0);
  const [status, setStatus] = useState<{
    ok: boolean;
    message: string;
    resendAvailableInSeconds?: number;
  } | null>(null);

  function applyCooldown(seconds?: number) {
    if (seconds && seconds > 0) {
      setRetryAfter(seconds);
    }
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    const result = await verifyEmailOtp(code);
    setSubmitting(false);
    setStatus(result);
    if (result.ok) {
      router.push(target);
      router.refresh();
    }
  }

  async function onResend() {
    setResending(true);
    const result = await sendVerificationEmail();
    setResending(false);
    setStatus(result);
    applyCooldown(result.resendAvailableInSeconds);
  }

  useEffect(() => {
    if (verified || !autoSend || hasAutoSent.current) return;
    hasAutoSent.current = true;
    void (async () => {
      setResending(true);
      const result = await sendVerificationEmail();
      setResending(false);
      setStatus(result);
      applyCooldown(result.resendAvailableInSeconds);
    })();
  }, [autoSend, verified]);

  useEffect(() => {
    if (retryAfter <= 0) return;

    const timer = window.setInterval(() => {
      setRetryAfter((current) => {
        if (current <= 1) {
          window.clearInterval(timer);
          return 0;
        }
        return current - 1;
      });
    }, 1000);

    return () => window.clearInterval(timer);
  }, [retryAfter]);

  function formatRetryAfter(seconds: number) {
    const minutes = Math.floor(seconds / 60);
    const remainder = seconds % 60;
    return minutes > 0 ? `${minutes}:${remainder.toString().padStart(2, "0")}` : `${remainder}s`;
  }

  if (verified) {
    return (
      <p className="rounded-md bg-forest-50 px-3 py-2 text-xs text-forest-800">
        Your email is already verified.
      </p>
    );
  }

  return (
    <div className="space-y-4">
      <p className="text-xs text-charcoal-500">
        We&apos;ll send the verification code to <strong>{email}</strong>.
      </p>

      <form onSubmit={onSubmit} className="space-y-4">
        <label className="block">
          <span className="text-[11px] font-semibold uppercase tracking-wide text-charcoal-500">
            Verification code
          </span>
          <input
            value={code}
            maxLength={6}
            inputMode="numeric"
            autoComplete="one-time-code"
            onChange={(e) => setCode(e.target.value.replace(/\D/g, "").slice(0, 6))}
            placeholder="123456"
            className="mt-1.5 block w-full rounded-md border border-cream-300 bg-cream-50 px-3 py-2 text-sm text-forest-900 tracking-[0.25em] placeholder:tracking-normal focus:border-forest-700 focus:outline-none"
          />
        </label>

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

        <div className="flex flex-wrap items-center gap-3">
          <button
            type="submit"
            disabled={submitting}
            className="btn-primary !px-3 !py-2 text-xs disabled:opacity-60"
          >
            {submitting ? "Verifying…" : "Verify email"}
          </button>
          <button
            type="button"
            onClick={onResend}
            disabled={resending || retryAfter > 0}
            className="btn-secondary !px-3 !py-2 text-xs disabled:opacity-60"
          >
            {resending ? "Sending…" : retryAfter > 0 ? `Resend in ${formatRetryAfter(retryAfter)}` : "Resend code"}
          </button>
        </div>
      </form>
    </div>
  );
}
