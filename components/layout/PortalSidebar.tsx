import Link from "next/link";
import { roles, type RoleId, accentClasses } from "@/data/roles";
import { cn } from "@/lib/utils";

interface PortalSidebarProps {
  currentRole: RoleId;
  nav: { label: string; href: string; active?: boolean }[];
}

export function PortalSidebar({ currentRole, nav }: PortalSidebarProps) {
  const role = roles.find((r) => r.id === currentRole)!;
  const accent = accentClasses[role.accent];

  return (
    <aside className="border-b border-cream-200 bg-white lg:sticky lg:top-16 lg:h-[calc(100vh-4rem)] lg:w-72 lg:border-b-0 lg:border-r">
      <div className="container-edge py-6 lg:px-6">
        <div className={cn("rounded-2xl bg-gradient-to-br p-5 text-cream-50", accent.gradient)}>
          <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-cream-100/80">
            Logged in as
          </p>
          <p className="mt-1 font-serif text-lg">{role.shortLabel}</p>
          <p className="mt-1 text-[11px] text-cream-100/75">{role.tagline}</p>
        </div>

        <nav className="mt-6 space-y-1">
          {nav.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "block rounded-lg px-3 py-2 text-sm transition",
                item.active
                  ? "bg-forest-50 font-medium text-forest-900"
                  : "text-charcoal-600 hover:bg-cream-100 hover:text-forest-900",
              )}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="mt-6 border-t border-cream-200 pt-4">
          <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-charcoal-400">
            Switch role
          </p>
          <ul className="mt-2 space-y-1 text-xs">
            {roles
              .filter((r) => r.id !== currentRole)
              .map((r) => (
                <li key={r.id}>
                  <Link
                    href={r.href}
                    className="block rounded-md px-2 py-1.5 text-charcoal-500 transition hover:bg-cream-100 hover:text-forest-900"
                  >
                    {r.shortLabel} portal →
                  </Link>
                </li>
              ))}
          </ul>
        </div>

        <p className="mt-6 text-[10px] text-charcoal-400">
          Demo portal · mock data only · no auth wired
        </p>
      </div>
    </aside>
  );
}
