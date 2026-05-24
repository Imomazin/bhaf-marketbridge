"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { bhafLogo } from "@/data/photos";
import { cn } from "@/lib/utils";

const navLinks = [
  { href: "/directory", label: "Directory" },
  { href: "/marketplace", label: "Marketplace" },
  { href: "/opportunities", label: "Opportunities" },
  { href: "/impact", label: "Impact & ESG" },
  { href: "/portal", label: "Portals" },
];

export function Navbar() {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 border-b border-cream-200 bg-cream-50/90 backdrop-blur">
      <div className="container-edge flex h-16 items-center justify-between">
        <Link href="/" className="flex items-center gap-2.5" onClick={() => setMobileOpen(false)}>
          <span className="relative flex h-10 w-10 items-center justify-center overflow-hidden rounded-lg bg-white ring-1 ring-cream-200">
            <Image
              src={bhafLogo.src}
              alt={bhafLogo.alt}
              fill
              sizes="40px"
              className="object-contain p-0.5"
            />
          </span>
          <span className="flex flex-col leading-none">
            <span className="font-serif text-base text-forest-900">BHAF MarketBridge</span>
            <span className="text-[10px] uppercase tracking-[0.22em] text-charcoal-400">
              Circular Academy · Marketplace
            </span>
          </span>
        </Link>

        <nav className="hidden items-center gap-7 md:flex">
          {navLinks.map((link) => {
            const active = pathname === link.href || pathname?.startsWith(link.href + "/");
            return (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  "text-sm font-medium transition",
                  active ? "text-forest-900" : "text-charcoal-600 hover:text-forest-800",
                )}
              >
                {link.label}
              </Link>
            );
          })}
        </nav>

        <div className="hidden items-center gap-3 md:flex">
          <Link href="/portal" className="text-sm font-medium text-forest-900 hover:text-forest-700">
            Sign in
          </Link>
          <Link href="/portal/entrepreneur" className="btn-gold !py-2 !px-4 text-xs">
            Register
          </Link>
        </div>

        <button
          className="flex h-9 w-9 items-center justify-center rounded-md border border-cream-200 text-forest-900 md:hidden"
          aria-label="Toggle menu"
          onClick={() => setMobileOpen((o) => !o)}
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

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="border-t border-cream-200 bg-cream-50 md:hidden">
          <nav className="container-edge flex flex-col gap-1 py-3">
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
            <div className="mt-2 flex gap-2 border-t border-cream-200 pt-3">
              <Link href="/portal" onClick={() => setMobileOpen(false)} className="btn-secondary flex-1 !py-2 text-xs">
                Sign in
              </Link>
              <Link href="/portal/entrepreneur" onClick={() => setMobileOpen(false)} className="btn-gold flex-1 !py-2 text-xs">
                Register
              </Link>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}
