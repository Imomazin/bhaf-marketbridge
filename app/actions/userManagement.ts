"use server";

import { revalidatePath } from "next/cache";

import { auth } from "@/auth";
import { prisma, DB_ENABLED } from "@/lib/db";
import { writeAudit } from "@/lib/audit";

export type UserManagementResult = { ok: true; message: string } | { ok: false; message: string };

async function requireAdmin() {
  const session = await auth();
  if (!session?.user) return { ok: false as const, message: "Sign-in required." };
  if (session.user.role !== "ADMIN" && session.user.role !== "AUDITOR") {
    return { ok: false as const, message: "Admin only." };
  }
  return { ok: true as const, session };
}

import { sendEmail } from "@/lib/email";

export async function deactivateUser(userId: string, reason: string): Promise<UserManagementResult> {
  const gate = await requireAdmin();
  if (!gate.ok) return gate;
  if (!DB_ENABLED || !prisma) return { ok: false, message: "Database not configured." };
  if (userId === gate.session.user.id) return { ok: false, message: "You can't deactivate your own account." };

  const target = await prisma.user.findUnique({ where: { id: userId }, select: { id: true, email: true, status: true, name: true } });
  if (!target) return { ok: false, message: "User not found." };
  if (target.status === "DELETED") return { ok: false, message: "This account was deleted, not just suspended." };
  if (target.status === "SUSPENDED") return { ok: false, message: "Already deactivated." };

  if (!reason || reason.trim() === "") return { ok: false, message: "Reason for deactivation is required." };

  await prisma.user.update({ where: { id: userId }, data: { status: "SUSPENDED" } });

  await writeAudit({
    actorId: gate.session.user.id,
    actorLabel: gate.session.user.email ?? gate.session.user.id,
    action: `User deactivated · ${target.email} · Reason: ${reason}`,
    entityType: "User",
    entityId: userId,
  });

  if (target.email) {
    try {
      await sendEmail({
        to: target.email,
        subject: "Action Required: Your BHAF MarketBridge Account has been suspended",
        body: `Hi ${target.name ?? "there"},\n\nYour account on BHAF MarketBridge has been temporarily suspended by our administration team.\n\nReason for suspension:\n${reason}\n\nIf you believe this is an error or would like to appeal this decision, please contact support.\n\n— The BHAF MarketBridge Team`,
      });
    } catch (e) {
      console.error("[UserManagement] Failed to send suspension email:", e);
    }
  }

  revalidatePath("/admin/users");
  revalidatePath("/admin");
  return { ok: true, message: "User deactivated." };
}

export async function reactivateUser(userId: string): Promise<UserManagementResult> {
  const gate = await requireAdmin();
  if (!gate.ok) return gate;
  if (!DB_ENABLED || !prisma) return { ok: false, message: "Database not configured." };

  const target = await prisma.user.findUnique({ where: { id: userId }, select: { id: true, email: true, status: true } });
  if (!target) return { ok: false, message: "User not found." };
  if (target.status !== "SUSPENDED") return { ok: false, message: "Only deactivated accounts can be reactivated." };

  await prisma.user.update({ where: { id: userId }, data: { status: "ACTIVE" } });

  await writeAudit({
    actorId: gate.session.user.id,
    actorLabel: gate.session.user.email ?? gate.session.user.id,
    action: `User reactivated · ${target.email}`,
    entityType: "User",
    entityId: userId,
  });

  revalidatePath("/admin/users");
  revalidatePath("/admin");
  return { ok: true, message: "User reactivated." };
}
