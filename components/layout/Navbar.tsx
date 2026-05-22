import Link from "next/link";

const navLinks = [
  { href: "/directory", label: "Directory" },
  { href: "/marketplace", label: "Marketplace" },
  { href: "/opportunities", label: "Opportunities" },
  { href: "/impact", label: "Impact & ESG" },
  { href: "/admin", label: "Admin" },
];

export function Navbar() {
  return (
    <header className="sticky top-0 z-40 border-b border-cream-200 bg-cream-50/85 backdrop-blur">
      <div className="container-edge flex h-16 items-center justify-between">
        <Link href="/" className="flex items-center gap-2.5">
          <span className="flex h-9 w-9 items-center justify-center rounded-md bg-forest-800 text-cream-50">
            <span className="font-serif text-base">B</span>
          </span>
          <span className="flex flex-col leading-none">
            <span className="font-serif text-base text-forest-900">BHAF MarketBridge</span>
            <span className="text-[10px] uppercase tracking-[0.22em] text-charcoal-400">
              Build Her A Future
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
