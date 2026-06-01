import Link from "next/link";
import { cn } from "@/lib/utils";

interface EmptyStateProps {
  title: string;
  description?: string;
  cta?: { label: string; href: string };
  icon?: React.ReactNode;
  className?: string;
}

/**
 * Consistent empty-state for tables / lists / dashboards. Used when a
 * data view legitimately has no rows yet — gives the user a clear
 * next step rather than a bare card.
 */
export function EmptyState({ title, description, cta, icon, className }: EmptyStateProps) {
  return (
    <div
      className={cn(
        "card flex flex-col items-center justify-center gap-3 p-10 text-center",
        className,
      )}
    >
      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-cream-100 text-forest-700">
        {icon ?? (
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="12" cy="12" r="9" />
            <path d="M9 12h6M12 9v6" strokeLinecap="round" />
          </svg>
        )}
      </div>
      <p className="font-serif text-base text-forest-900">{title}</p>
      {description && <p className="max-w-md text-xs text-charcoal-500">{description}</p>}
      {cta && (
        <Link href={cta.href} className="btn-primary mt-2 !py-2 !px-4 text-xs">
          {cta.label}
        </Link>
      )}
    </div>
  );
}
