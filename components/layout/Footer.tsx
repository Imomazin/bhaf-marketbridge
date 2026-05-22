import Link from "next/link";

const footerColumns = [
  {
    title: "Platform",
    links: [
      { href: "/directory", label: "Entrepreneur Directory" },
      { href: "/marketplace", label: "Marketplace" },
      { href: "/opportunities", label: "Opportunities" },
      { href: "/impact", label: "Impact & ESG" },
    ],
  },
  {
    title: "For partners",
    links: [
      { href: "#funders", label: "Funders & donors" },
      { href: "#corporates", label: "Corporate buyers" },
      { href: "#esg", label: "ESG & procurement" },
      { href: "#training", label: "Training partners" },
    ],
  },
  {
    title: "About",
    links: [
      { href: "#about", label: "BHAF Mission" },
      { href: "#case-studies", label: "Case studies" },
      { href: "#governance", label: "Governance" },
      { href: "#contact", label: "Contact" },
    ],
  },
];

export function Footer() {
  return (
    <footer className="mt-24 border-t border-forest-900/10 bg-forest-900 text-cream-100">
      <div className="container-edge py-16">
        <div className="grid gap-12 md:grid-cols-4">
          <div>
            <div className="flex items-center gap-2.5">
              <span className="flex h-9 w-9 items-center justify-center rounded-md bg-gold-400 text-forest-900">
                <span className="font-serif text-base">B</span>
              </span>
              <span className="font-serif text-base">BHAF MarketBridge</span>
            </div>
            <p className="mt-4 max-w-xs text-sm text-cream-100/70">
              A marketplace and impact infrastructure platform connecting African women entrepreneurs with funders,
              corporate partners and global markets.
            </p>
          </div>

          {footerColumns.map((column) => (
            <div key={column.title}>
              <h4 className="text-xs font-semibold uppercase tracking-[0.18em] text-gold-300">
                {column.title}
              </h4>
              <ul className="mt-4 space-y-3">
                {column.links.map((link) => (
                  <li key={link.label}>
                    <Link href={link.href} className="text-sm text-cream-100/80 transition hover:text-gold-200">
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-14 flex flex-col items-start justify-between gap-4 border-t border-cream-100/10 pt-6 text-xs text-cream-100/60 md:flex-row md:items-center">
          <span>© {new Date().getFullYear()} Build Her A Future. All rights reserved.</span>
          <span>MarketBridge MVP · For demonstration and partner preview</span>
        </div>
      </div>
    </footer>
  );
}
