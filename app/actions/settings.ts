"use server";

import bcrypt from "bcryptjs";
import { revalidatePath } from "next/cache";

import { auth } from "@/auth";
import { prisma, DB_ENABLED } from "@/lib/db";
import { writeAudit } from "@/lib/audit";
import { changePasswordSchema, updateProfileSchema, type ChangePasswordInput, type UpdateProfileInput } from "@/lib/schemas/account";

export type ActionResult = { ok: true; message: string } | { ok: false; message: string; field?: string };

export async function changePassword(input: ChangePasswordInput): Promise<ActionResult> {
  const session = await auth();
  if (!session?.user) return { ok: false, message: "Sign-in required." };
  if (!DB_ENABLED || !prisma) return { ok: false, message: "Database not configured." };

  const parsed = changePasswordSchema.safeParse(input);
  if (!parsed.success) {
    const issue = parsed.error.issues[0];
    return { ok: false, message: issue?.message ?? "Invalid input.", field: issue?.path.join(".") };
  }

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: { id: true, email: true, passwordHash: true },
  });
  if (!user || !user.passwordHash) {
    return { ok: false, message: "Account not found." };
  }

  const ok = await bcrypt.compare(parsed.data.currentPassword, user.passwordHash);
  if (!ok) {
    return { ok: false, message: "Current password is wrong.", field: "currentPassword" };
  }

  const newHash = await bcrypt.hash(parsed.data.newPassword, 12);
  await prisma.user.update({
    where: { id: user.id },
    data: { passwordHash: newHash },
  });

  await writeAudit({
    actorId: user.id,
    actorLabel: user.email,
    action: "Password changed",
    entityType: "User",
    entityId: user.id,
  });

  revalidatePath("/settings");
  return { ok: true, message: "Password updated." };
}

export async function updateProfile(input: UpdateProfileInput): Promise<ActionResult> {
  const session = await auth();
  if (!session?.user) return { ok: false, message: "Sign-in required." };
  if (!DB_ENABLED || !prisma) return { ok: false, message: "Database not configured." };

  const parsed = updateProfileSchema.safeParse(input);
  if (!parsed.success) {
    const issue = parsed.error.issues[0];
    return { ok: false, message: issue?.message ?? "Invalid input.", field: issue?.path.join(".") };
  }

  await prisma.user.update({
    where: { id: session.user.id },
    data: { name: parsed.data.name.trim() },
  });

  await writeAudit({
    actorId: session.user.id,
    actorLabel: session.user.email ?? session.user.id,
    action: "Profile name updated",
    entityType: "User",
    entityId: session.user.id,
  });

  revalidatePath("/settings");
  return { ok: true, message: "Profile updated." };
}
