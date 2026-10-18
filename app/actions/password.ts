"use server";

import bcrypt from "bcryptjs";
import crypto from "crypto";

import { prisma, DB_ENABLED } from "@/lib/db";
import { sendEmail } from "@/lib/email";
import { writeAudit } from "@/lib/audit";
import {
  requestResetSchema,
  resetPasswordSchema,
  verifyOtpSchema,
  type RequestResetInput,
  type ResetPasswordInput,
  type VerifyOtpInput,
} from "@/lib/schemas/password";

const RESET_PURPOSE = "password-reset";

export interface ActionResult {
  ok: boolean;
  message: string;
}

export async function verifyPasswordResetOtp(input: VerifyOtpInput): Promise<ActionResult> {
  const parsed = verifyOtpSchema.safeParse(input);
  if (!parsed.success) {
    return { ok: false, message: parsed.error.issues[0]?.message ?? "Invalid input." };
  }
  if (!DB_ENABLED || !prisma) {
    return { ok: false, message: "Verification requires a configured database." };
  }

  const user = await prisma.user.findUnique({
    where: { email: parsed.data.email.toLowerCase() },
  });

  if (!user) {
    return { ok: false, message: "Invalid or expired verification code." };
  }

  const expectedIdentifier = `${RESET_PURPOSE}:${user.id}`;
  
  const record = await prisma.verificationToken.findUnique({
    where: {
      identifier_token: {
        identifier: expectedIdentifier,
        token: parsed.data.otp,
      }
    },
  });

  if (!record) return { ok: false, message: "Invalid or expired verification code." };
  
  if (record.expires < new Date()) {
    await prisma.verificationToken.delete({ where: { token: record.token } });
    return { ok: false, message: "That verification code has expired. Request a new one." };
  }

  return { ok: true, message: "Code verified." };
}

export async function requestPasswordReset(input: RequestResetInput): Promise<ActionResult> {
  const parsed = requestResetSchema.safeParse(input);
  if (!parsed.success) {
    return { ok: false, message: parsed.error.issues[0]?.message ?? "Invalid email." };
  }

  // Deliberately return a generic success message regardless of whether the
  // email exists — prevents account enumeration.
  const generic = "If an account exists for that email, a verification code is on its way.";

  if (!DB_ENABLED || !prisma) {
    return { ok: true, message: generic };
  }

  const user = await prisma.user.findUnique({
    where: { email: parsed.data.email.toLowerCase() },
  });
  if (!user) return { ok: true, message: generic };

  // Generate 6-digit OTP
  const otp = crypto.randomInt(100000, 999999).toString();
  // OTP is valid for 15 minutes
  const expires = new Date(Date.now() + 15 * 60 * 1000);

  // Clear any existing reset tokens for this user to avoid conflicts
  await prisma.verificationToken.deleteMany({
    where: { identifier: `${RESET_PURPOSE}:${user.id}` },
  });

  await prisma.verificationToken.create({
    data: {
      identifier: `${RESET_PURPOSE}:${user.id}`,
      token: otp,
      expires,
    },
  });

  await sendEmail({
    to: user.email,
    subject: "Your Password Reset Code",
    body: `Hi ${user.name ?? "there"},\n\nWe received a request to reset your password. Here is your 6-digit verification code:\n\n${otp}\n\nThis code will expire in 15 minutes.\n\nIf you didn't request this, you can safely ignore this email.\n\n— BHAF Circular Academy`,
  });

  await writeAudit({
    actorId: user.id,
    actorLabel: user.email,
    action: "Password reset requested (OTP sent)",
    entityType: "User",
    entityId: user.id,
  });

  return { ok: true, message: generic };
}

export async function performPasswordReset(
  input: ResetPasswordInput,
): Promise<ActionResult> {
  const parsed = resetPasswordSchema.safeParse(input);
  if (!parsed.success) {
    return { ok: false, message: parsed.error.issues[0]?.message ?? "Invalid input." };
  }
  if (!DB_ENABLED || !prisma) {
    return { ok: false, message: "Password reset requires a configured database." };
  }

  const user = await prisma.user.findUnique({
    where: { email: parsed.data.email.toLowerCase() },
  });

  if (!user) {
    // Return generic message so we don't leak account existence via OTP attempts easily,
    // though the best approach is just rejecting.
    return { ok: false, message: "Invalid or expired verification code." };
  }

  const expectedIdentifier = `${RESET_PURPOSE}:${user.id}`;
  
  const record = await prisma.verificationToken.findUnique({
    where: {
      identifier_token: {
        identifier: expectedIdentifier,
        token: parsed.data.otp,
      }
    },
  });

  if (!record) return { ok: false, message: "Invalid or expired verification code." };
  
  if (record.expires < new Date()) {
    await prisma.verificationToken.delete({ where: { token: record.token } });
    return { ok: false, message: "That verification code has expired. Request a new one." };
  }

  const passwordHash = await bcrypt.hash(parsed.data.password, 12);
  await prisma.user.update({
    where: { id: user.id },
    data: { passwordHash },
  });
  await prisma.verificationToken.delete({ where: { token: record.token } });

  await writeAudit({
    actorId: user.id,
    actorLabel: "User",
    action: "Password reset completed (OTP verified)",
    entityType: "User",
    entityId: user.id,
  });

  return { ok: true, message: "Password updated. You can sign in now." };
}
