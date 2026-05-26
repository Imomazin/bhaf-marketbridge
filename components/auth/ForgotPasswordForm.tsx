"use client";

import { useState } from "react";
import { requestPasswordReset } from "@/app/actions/password";

export function ForgotPasswordForm() {
  const [email, setEmail] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [status, setStatus] = useState<{ ok: boolean; message: string } | null>(null);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    const res = await requestPasswordReset({ email: email.trim().toLowerCase() });
    setStatus(res);
    setSubmitting(false);
  }

  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <label className="block">
        <span className="text-[11px] font-semibold uppercase tracking-wide text-charcoal-500">Email</span>
        <input
          type="email"
          required
          autoComplete="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="mt-1.5 block w-full rounded-md border border-cream-300 bg-cream-50 px-3 py-2 text-sm text-forest-900 placeholder:text-charcoal-300 focus:border-forest-700 focus:outline-none"
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

      <button
        type="submit"
        disabled={submitting}
        className="btn-primary w-full disabled:opacity-60"
      >
        {submitting ? "Sending…" : "Send reset link"}
      </button>
    </form>
  );
}
