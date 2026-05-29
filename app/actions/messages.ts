"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";

import { auth } from "@/auth";
import { prisma, DB_ENABLED } from "@/lib/db";
import { writeAudit } from "@/lib/audit";
import { sendEmail } from "@/lib/email";

const startSchema = z.object({
  recipientEmail: z.string().email(),
  subject: z.string().max(200).optional(),
  body: z.string().min(1).max(8000),
});

const replySchema = z.object({
  conversationId: z.string().min(1),
  body: z.string().min(1).max(8000),
});

export type MessageResult = { ok: true; id: string; message: string } | { ok: false; message: string };

export async function startConversation(input: z.infer<typeof startSchema>): Promise<MessageResult> {
  const session = await auth();
  if (!session?.user) return { ok: false, message: "Sign-in required." };
  if (!DB_ENABLED || !prisma) return { ok: false, message: "Database not configured." };

  const parsed = startSchema.safeParse(input);
  if (!parsed.success) return { ok: false, message: parsed.error.issues[0]?.message ?? "Invalid input." };

  const recipient = await prisma.user.findUnique({ where: { email: parsed.data.recipientEmail.toLowerCase() } });
  if (!recipient) return { ok: false, message: "We couldn't find a user with that email." };
  if (recipient.id === session.user.id) return { ok: false, message: "You can't message yourself." };

  const conversation = await prisma.conversation.create({
    data: {
      subject: parsed.data.subject ?? null,
      participants: {
        create: [{ userId: session.user.id }, { userId: recipient.id }],
      },
      messages: {
        create: [{ senderId: session.user.id, body: parsed.data.body }],
      },
    },
  });

  await prisma.notification.create({
    data: {
      userId: recipient.id,
      kind: "GENERIC",
      title: `New message from ${session.user.name ?? session.user.email}`,
      body: parsed.data.body.slice(0, 240),
      link: `/messages/${conversation.id}`,
    },
  });

  if (recipient.email) {
    await sendEmail({
      to: recipient.email,
      subject: `New message on BHAF MarketBridge: ${parsed.data.subject ?? "(no subject)"}`,
      body: `Hi ${recipient.name ?? "there"},\n\n${session.user.name ?? session.user.email} sent you a message:\n\n${parsed.data.body}\n\nReply in your inbox.\n\n— BHAF MarketBridge`,
    });
  }

  await writeAudit({
    actorId: session.user.id,
    actorLabel: session.user.email ?? session.user.id,
    action: `Conversation started with ${recipient.email}`,
    entityType: "Conversation",
    entityId: conversation.id,
  });

  revalidatePath("/messages");
  return { ok: true, id: conversation.id, message: "Message sent." };
}

export async function replyToConversation(input: z.infer<typeof replySchema>): Promise<MessageResult> {
  const session = await auth();
  if (!session?.user) return { ok: false, message: "Sign-in required." };
  if (!DB_ENABLED || !prisma) return { ok: false, message: "Database not configured." };

  const parsed = replySchema.safeParse(input);
  if (!parsed.success) return { ok: false, message: parsed.error.issues[0]?.message ?? "Invalid input." };

  // Ensure the user is a participant
  const participation = await prisma.conversationParticipant.findUnique({
    where: { conversationId_userId: { conversationId: parsed.data.conversationId, userId: session.user.id } },
  });
  if (!participation) return { ok: false, message: "You're not a participant in that conversation." };

  await prisma.message.create({
    data: {
      conversationId: parsed.data.conversationId,
      senderId: session.user.id,
      body: parsed.data.body,
    },
  });

  await prisma.conversation.update({
    where: { id: parsed.data.conversationId },
    data: { updatedAt: new Date() },
  });

  // Notify the other participants
  const others = await prisma.conversationParticipant.findMany({
    where: { conversationId: parsed.data.conversationId, userId: { not: session.user.id } },
    include: { user: true },
  });
  for (const o of others) {
    await prisma.notification.create({
      data: {
        userId: o.userId,
        kind: "GENERIC",
        title: `New message from ${session.user.name ?? session.user.email}`,
        body: parsed.data.body.slice(0, 240),
        link: `/messages/${parsed.data.conversationId}`,
      },
    });
  }

  revalidatePath(`/messages/${parsed.data.conversationId}`);
  revalidatePath("/messages");
  return { ok: true, id: parsed.data.conversationId, message: "Reply sent." };
}

export async function markConversationRead(conversationId: string): Promise<{ ok: boolean }> {
  const session = await auth();
  if (!session?.user || !prisma) return { ok: false };
  await prisma.conversationParticipant.updateMany({
    where: { conversationId, userId: session.user.id },
    data: { lastReadAt: new Date() },
  });
  revalidatePath(`/messages/${conversationId}`);
  return { ok: true };
}
