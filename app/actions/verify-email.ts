"use server";

import crypto from "crypto";
import { prisma, DB_ENABLED } from "@/lib/db";
import { sendEmail } from "@/lib/email";
import { writeAudit } from "@/lib/audit";

const PURPOSE = "email-verify";
const TOKEN_TTL_MS = 1000 * 60 * 60 * 24; // 24h

export interface ActionResult {
  ok: boolean;
  message: string;
}

export async function sendVerificationEmail(userId: string): Promise<ActionResult> {
  if (!DB_ENABLED || !prisma) return { ok: false, message: "Database not configured." };
  const user = await prisma.user.findUnique({ where: { id: userId } });
  if (!user) return { ok: false, message: "User not found." };
  if (user.emailVerified) return { ok: true, message: "Already verified." };

  const token = crypto.randomBytes(32).toString("hex");
  const expires = new Date(Date.now() + TOKEN_TTL_MS);

  await prisma.verificationToken.create({
    data: {
      identifier: `${PURPOSE}:${user.id}`,
      token,
      expires,
    },
  });

  const baseUrl = process.env.NEXT_PUBLIC_APP_URL ?? "https://bhaf-marketbridge.vercel.app";
  const link = `${baseUrl}/auth/verify-email?token=${token}&uid=${user.id}`;

  await sendEmail({
    to: user.email,
    subject: "Confirm your BHAF MarketBridge email",
    body: `Hi ${user.name ?? "there"},\n\nClick the link below within the next 24 hours to confirm your email and activate your account.\n\n${link}\n\nIf you didn't sign up, you can safely ignore this email.\n\n— BHAF Circular Academy`,
  });

  return { ok: true, message: "Verification email sent." };
}

export async function performEmailVerification(token: string, uid: string): Promise<ActionResult> {
  if (!DB_ENABLED || !prisma) return { ok: false, message: "Database not configured." };

  const record = await prisma.verificationToken.findUnique({ where: { token } });
  if (!record) return { ok: false, message: "Invalid or already-used verification link." };
  if (record.expires < new Date()) {
    await prisma.verificationToken.delete({ where: { token } });
    return { ok: false, message: "Verification link expired. Sign in and request a new one." };
  }
  if (record.identifier !== `${PURPOSE}:${uid}`) {
    return { ok: false, message: "Token mismatch." };
  }

  await prisma.$transaction([
    prisma.user.update({
      where: { id: uid },
      data: { emailVerified: new Date(), status: "ACTIVE" },
    }),
    prisma.verificationToken.delete({ where: { token } }),
  ]);

  await writeAudit({
    actorId: uid,
    actorLabel: "User",
    action: "Email verified",
    entityType: "User",
    entityId: uid,
  });

  return { ok: true, message: "Email verified — your account is fully active." };
}
