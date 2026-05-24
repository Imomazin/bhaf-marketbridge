"use client";

import Link from "next/link";
import { useState } from "react";
import { roles, accentClasses, type RoleId } from "@/data/roles";
import { roleFlows } from "@/data/roleFlows";
import { cn } from "@/lib/utils";

export function RoleFlowTabs() {
  const [active, setActive] = useState<RoleId>("entrepreneur");
  const flow = roleFlows[active];
  const role = roles.find((r) => r.id === active)!;
  const accent = accentClasses[role.accent];

  return (
    <div>
      {/* Tabs */}
      <div role="tablist" className="flex flex-wrap gap-1 border-b border-cream-200">
        {roles.map((r) => {
          const isActive = r.id === active;
          const rAccent = accentClasses[r.accent];
          return (
            <button
              key={r.id}
              role="tab"
              aria-selected={isActive}
              onClick={() => setActive(r.id)}
              className={cn(
                "relative px-4 py-3 text-sm font-medium transition md:px-5",
                isActive ? "text-forest-900" : "text-charcoal-500 hover:text-forest-800",
              )}
            >
              {r.shortLabel}
              <span
                className={cn(
                  "absolute inset-x-3 -bottom-px h-[3px] rounded-full transition-all duration-300",
                  isActive ? rAccent.bg + " opacity-100" : "bg-transparent opacity-0",
                )}
              />
            </button>
          );
        })}
      </div>

      {/* Intro */}
      <p key={`intro-${active}`} className="animate-fade-in mt-6 max-w-2xl text-base text-charcoal-500">
        {flow.intro}
      </p>

      {/* Numbered steps */}
      <ol className="mt-10 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {flow.steps.map((step, idx) => (
          <li
            key={`${active}-${step.number}`}
            className="animate-fade-in"
            style={{ animationDelay: `${idx * 70}ms` }}
          >
            <div className="card relative flex h-full flex-col p-6 transition hover:-translate-y-1 hover:shadow-soft">
              {/* Connector arrow on desktop (visual only) */}
              {idx < flow.steps.length - 1 && (
                <span className="pointer-events-none absolute -right-3 top-9 hidden h-6 w-6 items-center justify-center rounded-full bg-cream-50 text-gold-500 lg:flex">
                  <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <path d="M9 6l6 6-6 6" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </span>
              )}
              <div className="flex items-center gap-3">
                <span
                  className={cn(
                    "flex h-10 w-10 items-center justify-center rounded-xl font-serif text-sm font-bold text-cream-50 shadow-[0_4px_12px_rgba(11,40,32,0.18)]",
                    accent.bg,
                  )}
                >
                  {step.number}
                </span>
                <h3 className="font-serif text-base text-forest-900">{step.title}</h3>
              </div>
              <p className="mt-3 text-xs leading-relaxed text-charcoal-500">{step.description}</p>
              {step.href && (
                <Link
                  href={step.href}
                  className="mt-4 inline-flex items-center gap-1 text-xs font-semibold text-forest-800 hover:text-gold-700"
                >
                  {step.hrefLabel} <span aria-hidden>→</span>
                </Link>
              )}
            </div>
          </li>
        ))}
      </ol>

      {/* Footer CTA */}
      <div className="mt-10 flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-cream-200 bg-cream-50 p-5">
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-gold-700">
            Ready to begin?
          </p>
          <p className="mt-1 text-sm text-forest-900">
            Sign in as a {role.shortLabel.toLowerCase()} and start your journey on MarketBridge.
          </p>
        </div>
        <Link href={role.href} className="btn-primary !py-2.5 !px-4 text-xs">
          {role.signInLabel} →
        </Link>
      </div>
    </div>
  );
}
