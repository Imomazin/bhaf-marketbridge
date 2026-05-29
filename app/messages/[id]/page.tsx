import Link from "next/link";
import { redirect, notFound } from "next/navigation";
import { auth } from "@/auth";
import { prisma, DB_ENABLED } from "@/lib/db";
import { markConversationRead } from "@/app/actions/messages";
import { ReplyForm } from "@/components/messages/ReplyForm";
import { cn } from "@/lib/utils";

export const metadata = { title: "Conversation · BHAF MarketBridge" };
export const dynamic = "force-dynamic";

export default async function ConversationPage({ params }: { params: { id: string } }) {
  const session = await auth();
  if (!session?.user) redirect(`/auth/sign-in?next=/messages/${params.id}`);
  if (!DB_ENABLED || !prisma) notFound();

  const conv = await prisma.conversation.findUnique({
    where: { id: params.id },
    include: {
      participants: { include: { user: { select: { id: true, name: true, email: true, role: true } } } },
      messages: { orderBy: { createdAt: "asc" } },
    },
  });
  if (!conv) notFound();
  const iAmParticipant = conv.participants.some((p) => p.userId === session.user!.id);
  if (!iAmParticipant) notFound();

  await markConversationRead(conv.id);

  const others = conv.participants.filter((p) => p.userId !== session.user!.id);

  return (
    <section className="bg-cream-50 py-12 md:py-16">
      <div className="container-edge max-w-3xl">
        <Link href="/messages" className="text-xs font-medium text-forest-700 hover:text-gold-700">
          ← All conversations
        </Link>
        <p className="mt-4 text-[11px] font-semibold uppercase tracking-[0.18em] text-gold-700">
          Conversation
        </p>
        <h1 className="mt-2 font-serif text-2xl text-forest-900 md:text-3xl">
          {conv.subject ?? others.map((o) => o.user.name ?? o.user.email).join(", ")}
        </h1>
        <p className="mt-1 text-xs text-charcoal-500">
          With {others.map((o) => `${o.user.name ?? o.user.email} (${o.user.role.toLowerCase()})`).join(", ")}
        </p>

        <div className="card mt-8 space-y-4 p-6">
          {conv.messages.map((m) => {
            const mine = m.senderId === session.user!.id;
            const sender = conv.participants.find((p) => p.userId === m.senderId)?.user;
            return (
              <div key={m.id} className={cn("flex flex-col gap-1", mine ? "items-end" : "items-start")}>
                <div
                  className={cn(
                    "max-w-[80%] rounded-2xl px-4 py-3 text-sm leading-relaxed",
                    mine ? "rounded-tr-md bg-forest-800 text-cream-50" : "rounded-tl-md bg-cream-100 text-forest-900",
                  )}
                >
                  {m.body}
                </div>
                <p className="text-[10px] text-charcoal-400">
                  {mine ? "You" : sender?.name ?? sender?.email ?? "—"} · {m.createdAt.toISOString().slice(0, 16).replace("T", " ")}
                </p>
              </div>
            );
          })}
        </div>

        <div className="mt-6">
          <ReplyForm conversationId={conv.id} />
        </div>
      </div>
    </section>
  );
}
