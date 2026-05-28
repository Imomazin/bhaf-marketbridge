"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";

interface SignInFormProps {
  next?: string;
}

export function SignInForm({ next }: SignInFormProps) {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setErr(null);
    setSubmitting(true);
    const res = await signIn("credentials", {
      email: email.trim().toLowerCase(),
      password,
      redirect: false,
    });
    setSubmitting(false);
    if (res?.error) {
      setErr("Those credentials didn't match. Try again.");
      return;
    }
    router.push(next || "/portal");
    router.refresh();
  }

  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <Field
        label="Email"
        type="email"
        autoComplete="email"
        value={email}
        onChange={setEmail}
        required
      />
      <Field
        label="Password"
        type="password"
        autoComplete="current-password"
        value={password}
        onChange={setPassword}
        required
      />
      {err && <p className="rounded-md bg-red-50 px-3 py-2 text-xs text-red-700">{err}</p>}
      <button
        type="submit"
        disabled={submitting}
        className="btn-primary w-full disabled:cursor-not-allowed disabled:opacity-60"
      >
        {submitting ? "Signing in…" : "Sign in"}
      </button>
    </form>
  );
}

function Field({
  label,
  type,
  value,
  onChange,
  required,
  autoComplete,
}: {
  label: string;
  type: string;
  value: string;
  onChange: (v: string) => void;
  required?: boolean;
  autoComplete?: string;
}) {
  return (
    <label className="block">
      <span className="text-[11px] font-semibold uppercase tracking-wide text-charcoal-500">
        {label}
      </span>
      <input
        type={type}
        autoComplete={autoComplete}
        required={required}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="mt-1.5 block w-full rounded-md border border-cream-300 bg-cream-50 px-3 py-2 text-sm text-forest-900 placeholder:text-charcoal-300 focus:border-forest-700 focus:outline-none"
      />
    </label>
  );
}
