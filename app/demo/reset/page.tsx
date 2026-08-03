"use client";

import { useEffect, useState } from "react";

export const dynamic = "force-dynamic";

export default function DemoResetPage() {
  const [status, setStatus] = useState("Clearing demo data…");

  useEffect(() => {
    let cancelled = false;

    async function run() {
      try {
        localStorage.clear();
        sessionStorage.clear();
      } catch {
        // Ignore storage errors and still clear server cookies.
      }

      try {
        const response = await fetch("/api/demo/reset", {
          method: "POST",
          cache: "no-store",
        });
        if (!response.ok) throw new Error("Reset request failed.");
        if (!cancelled) setStatus("Demo data cleared. Redirecting to sign in…");
      } catch {
        if (!cancelled) setStatus("Could not clear everything automatically. Refresh and try again.");
        return;
      }

      window.setTimeout(() => {
        window.location.href = "/auth/sign-in";
      }, 900);
    }

    void run();

    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <section className="bg-cream-50 py-24">
      <div className="container-edge max-w-2xl">
        <div className="card p-8 text-center">
          <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-gold-700">
            Demo reset
          </p>
          <h1 className="mt-2 font-serif text-3xl text-forest-900">Resetting your demo session</h1>
          <p className="mt-4 text-sm text-charcoal-500">
            This page clears the demo browser storage, demo cookies, and current sign-in session so you can start the
            walkthrough fresh.
          </p>
          <p className="mt-6 text-sm font-medium text-forest-800">{status}</p>
        </div>
      </div>
    </section>
  );
}
