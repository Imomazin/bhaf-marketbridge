"use server";

import bcrypt from "bcryptjs";
import crypto from "crypto";

import { prisma, DB_ENABLED } from "@/lib/db";
import { sendEmail } from "@/lib/email";
import { writeAudit } from "@/lib/audit";
import {
  requestResetSchema,
  resetPasswordSchema,
  type RequestResetInput,
  type ResetPasswordInput,
} from "@/lib/schemas/password";

const RESET_PURPOSE = "password-reset";

export interface ActionResult {
  ok: boolean;
  message: string;
}

export async function requestPasswordReset(input: RequestResetInput): Promise<ActionResult> {
  const parsed = requestResetSchema.safeParse(input);
  if (!parsed.success) {
    return { ok: false, message: parsed.error.issues[0]?.message ?? "Invalid email." };
  }

  // Deliberately return a generic success message regardless of whether the
  // email exists — prevents account enumeration.
  const generic = "If an account exists for that email, a reset link is on its way.";

  if (!DB_ENABLED || !prisma) {
    return { ok: true, message: generic };
  }

  const user = await prisma.user.findUnique({
    where: { email: parsed.data.email.toLowerCase() },
  });
  if (!user) return { ok: true, message: generic };

  // 64-char URL-safe token, 1-hour expiry
  const token = crypto.randomBytes(32).toString("hex");
  const expires = new Date(Date.now() + 60 * 60 * 1000);

  await prisma.verificationToken.create({
    data: {
      identifier: `${RESET_PURPOSE}:${user.id}`,
      token,
      expires,
    },
  });

  const baseUrl = process.env.NEXT_PUBLIC_APP_URL ?? "https://localhost:3000";
  const link = `${baseUrl}/auth/reset-password?token=${token}&uid=${user.id}`;

  await sendEmail({
    to: user.email,
    subject: "Reset your BHAF MarketBridge password",
    body: `Hi ${user.name ?? "there"},\n\nWe received a request to reset your password. Click the link below within the next hour to choose a new one.\n\n${link}\n\nIf you didn't request this, you can safely ignore this email.\n\n— BHAF Circular Academy`,
  });

  await writeAudit({
    actorId: user.id,
    actorLabel: user.email,
    action: "Password reset requested",
    entityType: "User",
    entityId: user.id,
  });

  return { ok: true, message: generic };
}

export async function performPasswordReset(
  input: ResetPasswordInput & { uid: string },
): Promise<ActionResult> {
  const parsed = resetPasswordSchema.safeParse({ token: input.token, password: input.password });
  if (!parsed.success) {
    return { ok: false, message: parsed.error.issues[0]?.message ?? "Invalid input." };
  }
  if (!DB_ENABLED || !prisma) {
    return { ok: false, message: "Password reset requires a configured database." };
  }

  const record = await prisma.verificationToken.findUnique({
    where: { token: parsed.data.token },
  });
  if (!record) return { ok: false, message: "That reset link is invalid or has been used." };
  if (record.expires < new Date()) {
    await prisma.verificationToken.delete({ where: { token: record.token } });
    return { ok: false, message: "That reset link has expired. Request a new one." };
  }

  const expectedIdentifier = `${RESET_PURPOSE}:${input.uid}`;
  if (record.identifier !== expectedIdentifier) {
    return { ok: false, message: "Token mismatch. Request a new reset link." };
  }

  const passwordHash = await bcrypt.hash(parsed.data.password, 12);
  await prisma.user.update({
    where: { id: input.uid },
    data: { passwordHash },
  });
  await prisma.verificationToken.delete({ where: { token: record.token } });

  await writeAudit({
    actorId: input.uid,
    actorLabel: "User",
    action: "Password reset completed",
    entityType: "User",
    entityId: input.uid,
  });

  return { ok: true, message: "Password updated. You can sign in now." };
}
