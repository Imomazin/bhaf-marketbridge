"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { performPasswordReset } from "@/app/actions/password";

interface ResetPasswordFormProps {
  token: string;
  uid: string;
}

export function ResetPasswordForm({ token, uid }: ResetPasswordFormProps) {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [status, setStatus] = useState<{ ok: boolean; message: string } | null>(null);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (password !== confirm) {
      setStatus({ ok: false, message: "Passwords don't match." });
      return;
    }
    setSubmitting(true);
    const res = await performPasswordReset({ token, uid, password });
    setStatus(res);
    setSubmitting(false);
    if (res.ok) {
      setTimeout(() => router.push("/auth/sign-in"), 1500);
    }
  }

  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <label className="block">
        <span className="text-[11px] font-semibold uppercase tracking-wide text-charcoal-500">New password</span>
        <input
          type="password"
          required
          autoComplete="new-password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="mt-1.5 block w-full rounded-md border border-cream-300 bg-cream-50 px-3 py-2 text-sm text-forest-900 focus:border-forest-700 focus:outline-none"
        />
        <span className="mt-1 block text-[10px] text-charcoal-400">
          At least 10 characters with a capital letter and a number.
        </span>
      </label>
      <label className="block">
        <span className="text-[11px] font-semibold uppercase tracking-wide text-charcoal-500">Confirm password</span>
        <input
          type="password"
          required
          autoComplete="new-password"
          value={confirm}
          onChange={(e) => setConfirm(e.target.value)}
          className="mt-1.5 block w-full rounded-md border border-cream-300 bg-cream-50 px-3 py-2 text-sm text-forest-900 focus:border-forest-700 focus:outline-none"
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

      <button type="submit" disabled={submitting} className="btn-primary w-full disabled:opacity-60">
        {submitting ? "Saving…" : "Set new password"}
      </button>
    </form>
  );
}
