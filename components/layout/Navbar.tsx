"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { useSession } from "next-auth/react";
import { SignOutButton } from "@/components/auth/SignOutButton";
import { LanguageToggle } from "@/components/ui/LanguageToggle";
import { bhafLogo } from "@/data/photos";
import { cn } from "@/lib/utils";

const navLinks = [
  { href: "/directory", label: "Directory" },
  { href: "/marketplace", label: "Marketplace" },
  { href: "/opportunities", label: "Opportunities" },
  { href: "/use-cases", label: "Use Cases" },
  { href: "/impact", label: "Impact & ESG" },
  { href: "/portal", label: "Portals" },
];

const accountLinks = [
  { href: "/data-rooms", label: "Data rooms" },
  { href: "/messages", label: "Messages" },
  { href: "/inbox", label: "Inbox" },
  { href: "/billing/dashboard", label: "Billing" },
  { href: "/settings", label: "Settings" },
];

export function Navbar() {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [accountOpen, setAccountOpen] = useState(false);
  const { data: session } = useSession();
  const portalHref =
    session?.user?.role === "ADMIN" || session?.user?.role === "AUDITOR"
      ? "/admin"
      : session?.user?.role === "FUNDER"
      ? "/portal/funder"
      : session?.user?.role === "CORPORATE"
      ? "/portal/corporate"
      : session?.user
      ? "/portal/entrepreneur"
      : "/portal";

  return (
    <header className="sticky top-0 z-40 border-b border-cream-200 bg-cream-50/90 backdrop-blur">
      <div className="flex h-16 items-center gap-4 px-3 sm:px-5 lg:px-6 xl:px-8">
        <Link href="/" className="flex min-w-0 shrink-0 items-center gap-2.5" onClick={() => setMobileOpen(false)}>
          <span className="relative flex h-10 w-10 items-center justify-center overflow-hidden rounded-lg bg-white ring-1 ring-cream-200">
            <Image
              src={bhafLogo.src}
              alt={bhafLogo.alt}
              fill
              sizes="40px"
              className="object-contain p-0.5"
            />
          </span>
          <span className="flex min-w-0 flex-col leading-none">
            <span className="truncate whitespace-nowrap font-serif text-base text-forest-900">BHAF MarketBridge</span>
            <span className="truncate whitespace-nowrap text-[10px] uppercase tracking-[0.22em] text-charcoal-400">
              Circular Academy · Marketplace
            </span>
          </span>
        </Link>

        <nav className="hidden min-w-0 flex-1 items-center justify-center gap-5 xl:flex">
          {navLinks.map((link) => {
            const active = pathname === link.href || pathname?.startsWith(link.href + "/");
            return (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  "whitespace-nowrap text-sm font-medium transition",
                  active ? "text-forest-900" : "text-charcoal-600 hover:text-forest-800",
                )}
              >
                {link.label}
              </Link>
            );
          })}
        </nav>

        <div className="ml-auto hidden shrink-0 items-center gap-3 xl:flex">
          <div className="hidden 2xl:block">
            <LanguageToggle />
          </div>
          {session?.user ? (
            <>
              <Link
                href={portalHref}
                className="btn-secondary !px-3 !py-2 text-xs"
              >
                My workspace
              </Link>
              <div className="relative">
                <button
                  type="button"
                  onClick={() => setAccountOpen((open) => !open)}
                  className="inline-flex items-center gap-2 rounded-md border border-cream-200 bg-white px-3 py-2 text-xs font-medium text-forest-900 transition hover:border-forest-300 hover:bg-cream-100"
                  aria-expanded={accountOpen}
                  aria-haspopup="menu"
                >
                  Account
                  <svg
                    width="14"
                    height="14"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    className={cn("transition", accountOpen && "rotate-180")}
                  >
                    <path d="m6 9 6 6 6-6" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </button>
                {accountOpen && (
                  <div className="absolute right-0 top-full mt-2 w-56 rounded-2xl border border-cream-200 bg-white p-2 shadow-soft">
                    {accountLinks.map((link) => (
                      <Link
                        key={link.href}
                        href={link.href}
                        onClick={() => setAccountOpen(false)}
                        className="block rounded-xl px-3 py-2 text-sm font-medium text-charcoal-600 transition hover:bg-cream-100 hover:text-forest-900"
                      >
                        {link.label}
                      </Link>
                    ))}
                    <div className="mt-2 border-t border-cream-200 pt-2">
                      <SignOutButton className="block w-full rounded-xl px-3 py-2 text-left text-sm font-medium text-charcoal-600 transition hover:bg-cream-100 hover:text-forest-900" />
                    </div>
                  </div>
                )}
              </div>
            </>
          ) : (
            <>
              <Link href="/auth/sign-in" className="whitespace-nowrap text-sm font-medium text-forest-900 hover:text-forest-700">
                Sign in
              </Link>
              <Link href="/auth/sign-up" className="btn-gold !px-4 !py-2 text-xs">
                Register
              </Link>
            </>
          )}
        </div>

        <button
          className="ml-auto flex h-9 w-9 shrink-0 items-center justify-center rounded-md border border-cream-200 text-forest-900 xl:hidden"
          aria-label="Toggle menu"
          onClick={() => {
            setAccountOpen(false);
            setMobileOpen((o) => !o);
          }}
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            {mobileOpen ? (
              <path d="M18 6 6 18M6 6l12 12" strokeLinecap="round" />
            ) : (
              <path d="M3 6h18M3 12h18M3 18h18" strokeLinecap="round" />
            )}
          </svg>
        </button>
      </div>

      {mobileOpen && (
        <div className="border-t border-cream-200 bg-cream-50 xl:hidden">
          <nav className="flex flex-col gap-1 px-3 py-3 sm:px-5 lg:px-6 xl:px-8">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileOpen(false)}
                className="rounded-md px-3 py-2 text-sm font-medium text-forest-900 hover:bg-cream-100"
              >
                {link.label}
              </Link>
            ))}
            <div className="px-3 py-2">
              <LanguageToggle />
            </div>
            <div className="mt-2 flex gap-2 border-t border-cream-200 pt-3">
              {session?.user ? (
                <>
                  <Link href={portalHref} onClick={() => setMobileOpen(false)} className="btn-secondary flex-1 !py-2 text-xs">
                    My workspace
                  </Link>
                  <SignOutButton className="btn-gold flex-1 !py-2 text-xs" />
                </>
              ) : (
                <>
                  <Link href="/auth/sign-in" onClick={() => setMobileOpen(false)} className="btn-secondary flex-1 !py-2 text-xs">
                    Sign in
                  </Link>
                  <Link href="/auth/sign-up" onClick={() => setMobileOpen(false)} className="btn-gold flex-1 !py-2 text-xs">
                    Register
                  </Link>
                </>
              )}
            </div>
            {session?.user && (
              <div className="mt-2 grid gap-1 border-t border-cream-200 pt-3">
                {accountLinks.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={() => setMobileOpen(false)}
                    className="rounded-md px-3 py-2 text-sm font-medium text-charcoal-600 hover:bg-cream-100 hover:text-forest-900"
                  >
                    {link.label}
                  </Link>
                ))}
              </div>
            )}
          </nav>
        </div>
      )}
    </header>
  );
}
