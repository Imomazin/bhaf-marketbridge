import Link from "next/link";
import { cn } from "@/lib/utils";

interface DashboardCardProps {
  title: string;
  description?: string;
  action?: string;
  actionHref?: string;
  children: React.ReactNode;
  className?: string;
}

export function DashboardCard({ title, description, action, actionHref, children, className }: DashboardCardProps) {
  return (
    <section className={cn("card flex flex-col p-6", className)}>
      <header className="flex items-start justify-between gap-4 border-b border-cream-200 pb-4">
        <div>
          <h3 className="font-serif text-base text-forest-900">{title}</h3>
          {description && <p className="mt-1 text-xs text-charcoal-400">{description}</p>}
        </div>
        {action && (
          actionHref ? (
            <Link href={actionHref} className="text-xs font-medium text-forest-700 transition hover:text-gold-700">
              {action}
            </Link>
          ) : (
            <button className="text-xs font-medium text-forest-700 transition hover:text-gold-700">
              {action}
            </button>
          )
        )}
      </header>
      <div className="pt-4">{children}</div>
    </section>
  );
}
