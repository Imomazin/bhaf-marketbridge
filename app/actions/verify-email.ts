"use server";

import crypto from "crypto";
import { auth, unstable_update } from "@/auth";
import { prisma, DB_ENABLED } from "@/lib/db";
import { sendEmail } from "@/lib/email";
import { writeAudit } from "@/lib/audit";

const PURPOSE = "email-verify";
const CODE_TTL_MS = 1000 * 60 * 15; // 15 minutes
const RESEND_COOLDOWN_MS = 1000 * 60; // 60 seconds

export interface ActionResult {
  ok: boolean;
  message: string;
  resendAvailableInSeconds?: number;
}

function identifierFor(userId: string) {
  return `${PURPOSE}:${userId}`;
}

function buildOtpToken(code: string) {
  return `${code}.${crypto.randomBytes(8).toString("hex")}`;
}

function generateOtpCode() {
  return crypto.randomInt(0, 1_000_000).toString().padStart(6, "0");
}

export async function sendVerificationEmailToUser(userId: string): Promise<ActionResult> {
  if (!DB_ENABLED || !prisma) return { ok: false, message: "Database not configured." };

  const user = await prisma.user.findUnique({ where: { id: userId } });
  if (!user) return { ok: false, message: "User not found." };
  if (user.emailVerified) return { ok: true, message: "Already verified." };

  const identifier = identifierFor(user.id);
  const existing = await prisma.verificationToken.findFirst({
    where: { identifier },
    orderBy: { expires: "desc" },
  });

  if (existing) {
    const cooldownRemainingMs =
      existing.expires.getTime() - Date.now() - (CODE_TTL_MS - RESEND_COOLDOWN_MS);

    if (cooldownRemainingMs > 0) {
      const resendAvailableInSeconds = Math.ceil(cooldownRemainingMs / 1000);
      return {
        ok: false,
        message: `Please wait ${resendAvailableInSeconds} seconds before requesting another code.`,
        resendAvailableInSeconds,
      };
    }
  }

  const code = generateOtpCode();
  const expires = new Date(Date.now() + CODE_TTL_MS);

  await prisma.verificationToken.deleteMany({
    where: { identifier },
  });

  await prisma.verificationToken.create({
    data: {
      identifier,
      token: buildOtpToken(code),
      expires,
    },
  });

  if (process.env.NODE_ENV !== "production") {
    console.info(
      `[email:otp] purpose=email-verify email=${user.email} code=${code} expires=${expires.toISOString()}`,
    );
  }

  const delivered = await sendEmail({
    to: user.email,
    subject: "Your BHAF MarketBridge verification code",
    body:
      `Hi ${user.name ?? "there"},\n\n` +
      `Your BHAF MarketBridge verification code is ${code}.\n\n` +
      `It expires in 15 minutes.\n\n` +
      `If you didn't create this account, you can safely ignore this email.\n\n` +
      `— BHAF Circular Academy`,
  });

  if (!delivered) {
    if (process.env.NODE_ENV !== "production") {
      return {
        ok: true,
        message: "Email delivery failed, but the verification code was logged in the server terminal for local testing.",
        resendAvailableInSeconds: Math.ceil(RESEND_COOLDOWN_MS / 1000),
      };
    }

    return {
      ok: false,
      message: "We couldn't send the verification code right now. Check the email provider setup and try again.",
    };
  }

  return {
    ok: true,
    message: "Verification code sent.",
    resendAvailableInSeconds: Math.ceil(RESEND_COOLDOWN_MS / 1000),
  };
}

export async function sendVerificationEmail(): Promise<ActionResult> {
  const session = await auth();
  if (!session?.user) return { ok: false, message: "Sign-in required." };
  return sendVerificationEmailToUser(session.user.id);
}

export async function verifyEmailOtp(code: string): Promise<ActionResult> {
  const session = await auth();
  if (!session?.user) return { ok: false, message: "Sign-in required." };
  if (!DB_ENABLED || !prisma) return { ok: false, message: "Database not configured." };

  const normalized = code.trim();
  if (!/^\d{6}$/.test(normalized)) {
    return { ok: false, message: "Enter the 6-digit verification code." };
  }

  const identifier = identifierFor(session.user.id);
  const record = await prisma.verificationToken.findFirst({
    where: { identifier },
    orderBy: { expires: "desc" },
  });

  if (!record) {
    return { ok: false, message: "No active verification code was found. Request a new code." };
  }

  if (record.expires < new Date()) {
    await prisma.verificationToken.deleteMany({ where: { identifier } });
    return { ok: false, message: "That code has expired. Request a new one." };
  }

  if (!record.token.startsWith(`${normalized}.`)) {
    return { ok: false, message: "That verification code is not valid." };
  }

  await prisma.$transaction([
    prisma.user.update({
      where: { id: session.user.id },
      data: { emailVerified: new Date(), status: "ACTIVE" },
    }),
    prisma.verificationToken.deleteMany({
      where: { identifier },
    }),
  ]);

  await writeAudit({
    actorId: session.user.id,
    actorLabel: session.user.email ?? session.user.id,
    action: "Email verified with OTP",
    entityType: "User",
    entityId: session.user.id,
  });

  await unstable_update({
    user: {
      id: session.user.id,
      role: session.user.role,
      status: "ACTIVE",
    },
  });

  return { ok: true, message: "Email verified — your account is fully active." };
}
