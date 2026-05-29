"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

const STORAGE_KEY = "bhaf-mb-cookie-choice";

export function CookieConsent() {
  const [decided, setDecided] = useState<boolean | null>(null); // null until mount

  useEffect(() => {
    try {
      const v = localStorage.getItem(STORAGE_KEY);
      setDecided(v === "accepted" || v === "essential-only");
    } catch {
      setDecided(true); // fail open — no banner
    }
  }, []);

  function choose(choice: "accepted" | "essential-only") {
    try {
      localStorage.setItem(STORAGE_KEY, choice);
    } catch {
      /* noop */
    }
    setDecided(true);
  }

  if (decided !== false) return null;

  return (
    <div
      role="dialog"
      aria-live="polite"
      aria-label="Cookie preferences"
      className="fixed inset-x-3 bottom-3 z-40 mx-auto max-w-3xl rounded-2xl border border-cream-200 bg-white p-4 shadow-soft md:bottom-6 md:inset-x-6"
    >
      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <p className="text-xs text-charcoal-600">
          We use only the cookies needed to keep you signed in and to remember your preferences. With your consent
          we may also enable privacy-respecting analytics.{" "}
          <Link href="/legal/cookies" className="font-medium text-forest-800 hover:text-gold-700">
            Read the policy
          </Link>
          .
        </p>
        <div className="flex flex-shrink-0 gap-2">
          <button
            onClick={() => choose("essential-only")}
            className="rounded-md border border-cream-300 px-3 py-1.5 text-xs font-medium text-charcoal-600 hover:border-forest-700 hover:text-forest-900"
          >
            Essential only
          </button>
          <button
            onClick={() => choose("accepted")}
            className="rounded-md bg-forest-800 px-3 py-1.5 text-xs font-medium text-cream-50 hover:bg-forest-700"
          >
            Accept all
          </button>
        </div>
      </div>
    </div>
  );
}
