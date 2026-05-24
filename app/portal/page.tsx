import Link from "next/link";
import { roles, accentClasses } from "@/data/roles";
import { cn } from "@/lib/utils";

export default function PortalIndexPage() {
  return (
    <section className="bg-cream-50 py-16 md:py-24">
      <div className="container-edge">
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-gold-700">
            Sign in to MarketBridge
          </p>
          <h1 className="mt-3 font-serif text-3xl text-forest-900 md:text-5xl">
            Choose how you'll use MarketBridge today.
          </h1>
          <p className="mt-4 text-base text-charcoal-500">
            Each role has its own workspace. Pick yours to continue.
          </p>
        </div>

        <div className="mt-14 grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {roles.map((role) => {
            const accent = accentClasses[role.accent];
            return (
              <Link
                key={role.id}
                href={role.href}
                className={cn(
                  "group flex h-full flex-col rounded-2xl border border-cream-200 bg-white p-7 transition hover:-translate-y-0.5 hover:shadow-soft",
                )}
              >
                <span className={cn("inline-flex h-8 w-8 items-center justify-center rounded-md text-cream-50", accent.bg)}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M5 12h14M13 6l6 6-6 6" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </span>
                <h2 className="mt-5 font-serif text-xl text-forest-900">{role.label}</h2>
                <p className="mt-1 text-sm text-charcoal-500">{role.tagline}</p>

                <ul className="mt-5 space-y-2 border-t border-cream-200 pt-4">
                  {role.primaryActions.map((a) => (
                    <li key={a} className="flex items-start gap-2 text-xs text-charcoal-600">
                      <span className="mt-1.5 h-1 w-1 flex-shrink-0 rounded-full bg-gold-500" />
                      {a}
                    </li>
                  ))}
                </ul>

                <span className="mt-auto pt-6 text-sm font-medium text-forest-900 group-hover:text-gold-700">
                  {role.signInLabel} →
                </span>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}
