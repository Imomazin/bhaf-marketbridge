"use server";

import { revalidatePath } from "next/cache";
import { auth } from "@/auth";
import { prisma, DB_ENABLED } from "@/lib/db";

export async function markNotificationRead(id: string): Promise<{ ok: boolean }> {
  const session = await auth();
  if (!session?.user || !prisma) return { ok: false };
  await prisma.notification.updateMany({
    where: { id, userId: session.user.id },
    data: { read: true },
  });
  revalidatePath("/inbox");
  return { ok: true };
}

export async function markAllRead(): Promise<{ ok: boolean }> {
  const session = await auth();
  if (!session?.user || !prisma) return { ok: false };
  await prisma.notification.updateMany({
    where: { userId: session.user.id, read: false },
    data: { read: true },
  });
  revalidatePath("/inbox");
  return { ok: true };
}

export async function unreadCount(): Promise<number> {
  const session = await auth();
  if (!session?.user || !DB_ENABLED || !prisma) return 0;
  try {
    return await prisma.notification.count({ where: { userId: session.user.id, read: false } });
  } catch {
    return 0;
  }
}
