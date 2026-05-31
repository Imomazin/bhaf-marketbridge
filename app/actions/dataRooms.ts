"use server";

import { revalidatePath } from "next/cache";
import { auth } from "@/auth";
import { prisma, DB_ENABLED } from "@/lib/db";
import { writeAudit } from "@/lib/audit";
import { sendEmail } from "@/lib/email";

export type DataRoomResult = { ok: true; id: string; message: string } | { ok: false; message: string };

export async function createDataRoom(input: {
  title: string;
  description?: string;
  contextType?: "OPPORTUNITY" | "RFP" | "ADHOC";
  contextId?: string;
}): Promise<DataRoomResult> {
  const session = await auth();
  if (!session?.user) return { ok: false, message: "Sign-in required." };
  if (!DB_ENABLED || !prisma) return { ok: false, message: "Database not configured." };

  if (!input.title || input.title.length < 3) return { ok: false, message: "Title required." };

  const room = await prisma.dataRoom.create({
    data: {
      ownerId: session.user.id,
      title: input.title,
      description: input.description ?? null,
      contextType: input.contextType ?? "ADHOC",
      contextId: input.contextId ?? null,
      status: "RESTRICTED",
    },
  });

  await writeAudit({
    actorId: session.user.id,
    actorLabel: session.user.email ?? session.user.id,
    action: `Data room created · ${room.title}`,
    entityType: "DataRoom",
    entityId: room.id,
  });

  revalidatePath("/data-rooms");
  return { ok: true, id: room.id, message: "Data room created." };
}

export async function grantDataRoomAccess(input: {
  dataRoomId: string;
  recipientEmail: string;
  level?: "VIEW" | "DOWNLOAD" | "EDIT";
  expiresInDays?: number;
}): Promise<DataRoomResult> {
  const session = await auth();
  if (!session?.user) return { ok: false, message: "Sign-in required." };
  if (!DB_ENABLED || !prisma) return { ok: false, message: "Database not configured." };

  const room = await prisma.dataRoom.findUnique({ where: { id: input.dataRoomId } });
  if (!room) return { ok: false, message: "Data room not found." };
  if (room.ownerId !== session.user.id && session.user.role !== "ADMIN") {
    return { ok: false, message: "Only the room owner can grant access." };
  }

  const recipient = await prisma.user.findUnique({
    where: { email: input.recipientEmail.toLowerCase() },
  });
  if (!recipient) return { ok: false, message: "We couldn't find a user with that email." };

  const expiresAt = input.expiresInDays
    ? new Date(Date.now() + input.expiresInDays * 24 * 60 * 60 * 1000)
    : null;

  await prisma.dataRoomAccess.upsert({
    where: { dataRoomId_userId: { dataRoomId: room.id, userId: recipient.id } },
    update: { level: input.level ?? "VIEW", expiresAt },
    create: {
      dataRoomId: room.id,
      userId: recipient.id,
      level: input.level ?? "VIEW",
      expiresAt,
    },
  });

  await writeAudit({
    actorId: session.user.id,
    actorLabel: session.user.email ?? session.user.id,
    action: `Granted ${input.level ?? "VIEW"} access · ${room.title} → ${recipient.email}`,
    entityType: "DataRoom",
    entityId: room.id,
    metadata: { recipientId: recipient.id, expiresAt: expiresAt?.toISOString() ?? null },
  });

  await prisma.notification.create({
    data: {
      userId: recipient.id,
      kind: "GENERIC",
      title: `Data room access granted: ${room.title}`,
      body: `You now have ${input.level ?? "VIEW"} access${expiresAt ? ` until ${expiresAt.toISOString().slice(0, 10)}` : ""}.`,
      link: `/data-rooms/${room.id}`,
    },
  });
  if (recipient.email) {
    await sendEmail({
      to: recipient.email,
      subject: `Data room access: ${room.title}`,
      body: `You've been granted access to a BHAF MarketBridge data room: ${room.title}.\n\nOpen at /data-rooms/${room.id}.\n\n— BHAF MarketBridge`,
    });
  }

  revalidatePath(`/data-rooms/${room.id}`);
  return { ok: true, id: room.id, message: "Access granted." };
}

export async function revokeDataRoomAccess(input: { dataRoomId: string; userId: string }): Promise<DataRoomResult> {
  const session = await auth();
  if (!session?.user) return { ok: false, message: "Sign-in required." };
  if (!DB_ENABLED || !prisma) return { ok: false, message: "Database not configured." };

  const room = await prisma.dataRoom.findUnique({ where: { id: input.dataRoomId } });
  if (!room) return { ok: false, message: "Data room not found." };
  if (room.ownerId !== session.user.id && session.user.role !== "ADMIN") {
    return { ok: false, message: "Only the room owner can revoke access." };
  }

  await prisma.dataRoomAccess.deleteMany({
    where: { dataRoomId: input.dataRoomId, userId: input.userId },
  });

  await writeAudit({
    actorId: session.user.id,
    actorLabel: session.user.email ?? session.user.id,
    action: `Revoked data room access · ${room.title}`,
    entityType: "DataRoom",
    entityId: room.id,
    metadata: { revokedUserId: input.userId },
  });

  revalidatePath(`/data-rooms/${input.dataRoomId}`);
  return { ok: true, id: input.dataRoomId, message: "Access revoked." };
}
