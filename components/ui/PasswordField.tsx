"use client";

import { forwardRef, useState, type InputHTMLAttributes } from "react";
import { cn } from "@/lib/utils";

interface PasswordFieldProps
  extends Omit<InputHTMLAttributes<HTMLInputElement>, "type"> {
  label: string;
  error?: string;
  hint?: string;
  inputClassName?: string;
}

const defaultInputClassName =
  "mt-1.5 block w-full rounded-md border border-cream-300 bg-cream-50 px-3 py-2 text-sm text-forest-900 placeholder:text-charcoal-300 focus:border-forest-700 focus:outline-none";

export const PasswordField = forwardRef<HTMLInputElement, PasswordFieldProps>(
  function PasswordField({ label, error, hint, inputClassName, className, ...rest }, ref) {
    const [revealed, setRevealed] = useState(false);

    return (
      <label className={cn("block", className)}>
        <span className="text-[11px] font-semibold uppercase tracking-wide text-charcoal-500">
          {label}
        </span>
        <div className="relative">
          <input
            ref={ref}
            type={revealed ? "text" : "password"}
            {...rest}
            className={cn(defaultInputClassName, inputClassName, "pr-12")}
          />
          <button
            type="button"
            aria-label={revealed ? "Hide password" : "Show password"}
            aria-pressed={revealed}
            onClick={() => setRevealed((current) => !current)}
            className="absolute inset-y-0 right-0 flex items-center px-3 text-charcoal-400 transition hover:text-forest-800"
          >
            {revealed ? <EyeOffIcon /> : <EyeIcon />}
          </button>
        </div>
        {hint && !error && <span className="mt-1 block text-[10px] text-charcoal-400">{hint}</span>}
        {error && <span className="mt-1 block text-[10px] text-red-700">{error}</span>}
      </label>
    );
  },
);

function EyeIcon() {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" className="h-4 w-4 fill-none stroke-current" strokeWidth="1.8">
      <path
        d="M2.75 12s3.25-5.5 9.25-5.5S21.25 12 21.25 12s-3.25 5.5-9.25 5.5S2.75 12 2.75 12Z"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <circle cx="12" cy="12" r="3" />
    </svg>
  );
}

function EyeOffIcon() {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" className="h-4 w-4 fill-none stroke-current" strokeWidth="1.8">
      <path d="M3 3l18 18" strokeLinecap="round" strokeLinejoin="round" />
      <path
        d="M10.58 10.58A2 2 0 0 0 12 15a1.98 1.98 0 0 0 1.42-.58"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M6.72 6.72C4.23 8.17 2.75 12 2.75 12s3.25 5.5 9.25 5.5c1.8 0 3.38-.5 4.74-1.24"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M14.82 7.37A9.78 9.78 0 0 0 12 6.5c-6 0-9.25 5.5-9.25 5.5"
        stroke="none"
      />
      <path
        d="M17.28 9.28C19.77 10.73 21.25 12 21.25 12"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M21.25 12s-3.25 5.5-9.25 5.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
