import Image from "next/image";
import Link from "next/link";
import { bhafLogo } from "@/data/photos";

const navLinks = [
  { href: "/directory", label: "Directory" },
  { href: "/marketplace", label: "Marketplace" },
  { href: "/opportunities", label: "Opportunities" },
  { href: "/impact", label: "Impact & ESG" },
  { href: "/admin", label: "Admin" },
];

export function Navbar() {
  return (
    <header className="sticky top-0 z-40 border-b border-cream-200 bg-cream-50/90 backdrop-blur">
      <div className="container-edge flex h-16 items-center justify-between">
        <Link href="/" className="flex items-center gap-2.5">
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
              Circular Academy · Consulting · Marketplace
            </span>
          </span>
        </Link>

        <nav className="hidden items-center gap-7 md:flex">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-sm font-medium text-charcoal-600 transition hover:text-forest-800"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-3">
          <Link href="/admin" className="hidden text-sm font-medium text-forest-900 hover:text-forest-700 md:inline">
            Sign in
          </Link>
          <Link href="#register" className="btn-gold !py-2 !px-4 text-xs">
            Register
          </Link>
        </div>
      </div>
    </header>
  );
}
