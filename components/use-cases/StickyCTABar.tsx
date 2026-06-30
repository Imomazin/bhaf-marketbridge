"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

/**
 * Fades in once the user has scrolled past the hero. Dismissable for
 * the session — re-appears on next visit.
 */
export function StickyCTABar() {
  const [visible, setVisible] = useState(false);
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    try {
      // eslint-disable-next-line react-hooks/set-state-in-effect -- sessionStorage is browser-only; must hydrate after mount.
      if (sessionStorage.getItem("uc-cta-dismissed") === "1") setDismissed(true);
    } catch {
      /* sessionStorage unavailable — show anyway */
    }
  }, []);

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > 1200);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const dismiss = () => {
    setDismissed(true);
    try {
      sessionStorage.setItem("uc-cta-dismissed", "1");
    } catch {
      /* noop */
    }
  };

  if (dismissed) return null;

  return (
    <div
      aria-hidden={!visible}
      className={cn(
        "fixed inset-x-3 bottom-3 z-30 mx-auto max-w-3xl rounded-2xl border border-forest-700/40 bg-forest-900/95 px-4 py-3 text-cream-50 shadow-card backdrop-blur transition-all duration-500 md:inset-x-6 md:bottom-6",
        visible ? "translate-y-0 opacity-100" : "pointer-events-none translate-y-4 opacity-0",
      )}
    >
      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div className="min-w-0">
          <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-gold-300">
            Use cases · continuous partnership
          </p>
          <p className="mt-0.5 text-sm font-medium">
            Ready to deploy these journeys with BHAF and ecosystem partners?
          </p>
        </div>
        <div className="flex flex-shrink-0 items-center gap-2">
          <Link
            href="/messages"
            className="btn-gold !py-2 !px-4 text-xs whitespace-nowrap"
          >
            Start a conversation
          </Link>
          <Link
            href="#closing-cta"
            className="inline-flex items-center justify-center rounded-md border border-cream-50/30 bg-white/5 px-4 py-2 text-xs font-medium text-cream-50 transition hover:bg-white/10 whitespace-nowrap"
          >
            Read the call to action
          </Link>
          <button
            type="button"
            onClick={dismiss}
            aria-label="Dismiss"
            className="ml-1 inline-flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-md text-cream-50/70 transition hover:bg-white/10 hover:text-cream-50"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" aria-hidden>
              <path d="M18 6 6 18M6 6l12 12" strokeLinecap="round" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}
