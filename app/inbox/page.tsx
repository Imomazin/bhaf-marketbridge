import Link from "next/link";
import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { prisma, DB_ENABLED } from "@/lib/db";
import { MarkAllReadButton } from "@/components/inbox/MarkAllReadButton";
import { MarkOneReadButton } from "@/components/inbox/MarkOneReadButton";
import { cn } from "@/lib/utils";

export const metadata = { title: "Inbox · BHAF MarketBridge" };
export const dynamic = "force-dynamic";

export default async function InboxPage() {
  const session = await auth();
  if (!session?.user) redirect("/auth/sign-in?next=/inbox");

  let notifications: Array<{
    id: string;
    title: string;
    body: string;
    kind: string;
    read: boolean;
    link: string | null;
    createdAt: Date;
  }> = [];
  if (DB_ENABLED && prisma) {
    notifications = await prisma.notification.findMany({
      where: { userId: session.user.id },
      orderBy: { createdAt: "desc" },
      take: 100,
    });
  }

  const unread = notifications.filter((n) => !n.read).length;

  return (
    <section className="bg-cream-50 py-12 md:py-16">
      <div className="container-edge max-w-3xl">
        <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-gold-700">Inbox</p>
        <div className="mt-2 flex flex-wrap items-end justify-between gap-3">
          <h1 className="font-serif text-3xl text-forest-900 md:text-4xl">
            Notifications
            {unread > 0 && (
              <span className="ml-3 align-middle text-base text-gold-700">{unread} unread</span>
            )}
          </h1>
          {unread > 0 && <MarkAllReadButton />}
        </div>

        {notifications.length === 0 && (
          <div className="card mt-10 p-10 text-center text-sm text-charcoal-500">
            No notifications yet. Apply to an opportunity or upload an artefact to start seeing updates here.
          </div>
        )}

        <ul className="mt-8 space-y-3">
          {notifications.map((n) => (
            <li
              key={n.id}
              className={cn(
                "flex items-start justify-between gap-3 rounded-xl border bg-white p-4",
                n.read ? "border-cream-200" : "border-gold-300 bg-gold-50/30",
              )}
            >
              <div className="min-w-0">
                <div className="flex items-center gap-2">
                  <span
                    className={cn(
                      "rounded-full border px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider",
                      n.read
                        ? "border-cream-300 bg-cream-100 text-charcoal-500"
                        : "border-gold-300 bg-gold-50 text-gold-800",
                    )}
                  >
                    {n.kind.replace(/_/g, " ").toLowerCase()}
                  </span>
                  <span className="text-[10px] text-charcoal-400">{n.createdAt.toISOString().slice(0, 16).replace("T", " ")}</span>
                </div>
                <p className={cn("mt-1.5 text-sm", n.read ? "text-forest-700" : "font-medium text-forest-900")}>
                  {n.title}
                </p>
                <p className="mt-1 text-xs text-charcoal-500">{n.body}</p>
                {n.link && (
                  <Link href={n.link} className="mt-2 inline-block text-xs font-medium text-forest-700 hover:text-gold-700">
                    Open →
                  </Link>
                )}
              </div>
              {!n.read && <MarkOneReadButton id={n.id} />}
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
