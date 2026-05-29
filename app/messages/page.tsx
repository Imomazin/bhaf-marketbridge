import Link from "next/link";
import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { prisma, DB_ENABLED } from "@/lib/db";
import { StartConversationForm } from "@/components/messages/StartConversationForm";
import { cn } from "@/lib/utils";

export const metadata = { title: "Messages · BHAF MarketBridge" };
export const dynamic = "force-dynamic";

export default async function MessagesIndex() {
  const session = await auth();
  if (!session?.user) redirect("/auth/sign-in?next=/messages");

  let conversations: Array<{
    id: string;
    subject: string | null;
    updatedAt: Date;
    lastReadAt: Date | null;
    others: Array<{ name: string | null; email: string; role: string }>;
    lastMessage: { body: string; senderId: string; createdAt: Date } | null;
    unread: boolean;
  }> = [];

  if (DB_ENABLED && prisma) {
    const rows = await prisma.conversation.findMany({
      where: { participants: { some: { userId: session.user.id } } },
      include: {
        participants: {
          include: { user: { select: { id: true, name: true, email: true, role: true } } },
        },
        messages: { orderBy: { createdAt: "desc" }, take: 1 },
      },
      orderBy: { updatedAt: "desc" },
      take: 50,
    });
    conversations = rows.map((c) => {
      const mine = c.participants.find((p) => p.userId === session.user!.id);
      const others = c.participants
        .filter((p) => p.userId !== session.user!.id)
        .map((p) => ({ name: p.user.name, email: p.user.email, role: p.user.role }));
      const last = c.messages[0] ?? null;
      const unread = Boolean(last && (!mine?.lastReadAt || last.createdAt > mine.lastReadAt) && last.senderId !== session.user!.id);
      return {
        id: c.id,
        subject: c.subject,
        updatedAt: c.updatedAt,
        lastReadAt: mine?.lastReadAt ?? null,
        others,
        lastMessage: last ? { body: last.body, senderId: last.senderId, createdAt: last.createdAt } : null,
        unread,
      };
    });
  }

  return (
    <section className="bg-cream-50 py-12 md:py-16">
      <div className="container-edge max-w-4xl">
        <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-gold-700">Messages</p>
        <h1 className="mt-2 font-serif text-3xl text-forest-900 md:text-4xl">Conversations</h1>
        <p className="mt-2 text-sm text-charcoal-500">
          Reach out to entrepreneurs, funders or corporate partners. Every reply is delivered in-app and by email.
        </p>

        <details className="card mt-8 p-4">
          <summary className="cursor-pointer text-sm font-medium text-forest-900">Start a new conversation</summary>
          <div className="mt-4">
            <StartConversationForm />
          </div>
        </details>

        {conversations.length === 0 && (
          <div className="card mt-8 p-10 text-center text-sm text-charcoal-500">
            No conversations yet. Open "Start a new conversation" above to message anyone on the platform by email.
          </div>
        )}

        <ul className="mt-6 space-y-2">
          {conversations.map((c) => (
            <li key={c.id}>
              <Link
                href={`/messages/${c.id}`}
                className={cn(
                  "flex items-start justify-between gap-3 rounded-xl border bg-white p-4 transition hover:border-forest-700",
                  c.unread ? "border-gold-300 bg-gold-50/40" : "border-cream-200",
                )}
              >
                <div className="min-w-0">
                  <p className={cn("truncate text-sm", c.unread ? "font-semibold text-forest-900" : "text-forest-800")}>
                    {c.others.map((o) => o.name ?? o.email).join(", ") || "Conversation"}
                  </p>
                  {c.subject && <p className="text-xs text-charcoal-500">{c.subject}</p>}
                  {c.lastMessage && (
                    <p className="mt-1 truncate text-xs text-charcoal-500">{c.lastMessage.body}</p>
                  )}
                </div>
                <span className="flex-shrink-0 text-[10px] uppercase tracking-wide text-charcoal-400">
                  {c.updatedAt.toISOString().slice(0, 10)}
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
