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
      <div className="container-edge py-4 lg:px-6 lg:py-6">
        <div className={cn("rounded-2xl bg-gradient-to-br p-4 text-cream-50 lg:p-5", accent.gradient)}>
          <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-cream-100/80">
            Logged in as
          </p>
          <p className="mt-1 font-serif text-base lg:text-lg">{role.shortLabel}</p>
          <p className="mt-1 hidden text-[11px] text-cream-100/75 lg:block">{role.tagline}</p>
        </div>

        {/* On mobile this is collapsible; on desktop it's always open */}
        <details className="mt-4 lg:mt-6" open>
          <summary className="cursor-pointer text-[10px] font-semibold uppercase tracking-[0.18em] text-charcoal-500 lg:hidden">
            Navigate ▾
          </summary>

          <nav className="mt-3 space-y-1 lg:mt-0">
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

          <div className="mt-6 hidden border-t border-cream-200 pt-4 lg:block">
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

          <p className="mt-6 hidden text-[10px] text-charcoal-400 lg:block">
            Demo portal · mock data only · no auth wired
          </p>
        </details>
      </div>
    </aside>
  );
}
