"use server";

import bcrypt from "bcryptjs";

import { prisma, DB_ENABLED } from "@/lib/db";
import { writeAudit } from "@/lib/audit";
import { sendEmail } from "@/lib/email";
import { signIn } from "@/auth";
import { registerSchema, type RegisterInput } from "@/lib/schemas/auth";

export type ActionResult<T = void> =
  | { ok: true; data?: T; message?: string }
  | { ok: false; fieldErrors?: Record<string, string>; message: string };

export async function registerAction(raw: RegisterInput): Promise<ActionResult> {
  const parsed = registerSchema.safeParse(raw);
  if (!parsed.success) {
    const fieldErrors: Record<string, string> = {};
    for (const issue of parsed.error.issues) {
      const key = issue.path.join(".");
      if (!fieldErrors[key]) fieldErrors[key] = issue.message;
    }
    return { ok: false, fieldErrors, message: "Please fix the highlighted fields." };
  }
  const input = parsed.data;

  if (!DB_ENABLED || !prisma) {
    return {
      ok: false,
      message:
        "The database isn't configured yet. Add DATABASE_URL to your environment to enable real registration.",
    };
  }

  const existing = await prisma.user.findUnique({
    where: { email: input.email.toLowerCase() },
  });
  if (existing) {
    return {
      ok: false,
      fieldErrors: { email: "An account with this email already exists." },
      message: "Email already in use.",
    };
  }

  const passwordHash = await bcrypt.hash(input.password, 12);

  const user = await prisma.user.create({
    data: {
      email: input.email.toLowerCase(),
      name: input.name.trim(),
      passwordHash,
      role: input.role,
      status: "PENDING_VERIFICATION",
    },
  });

  // Role-specific profile stub
  if (input.role === "ENTREPRENEUR" && input.businessName && input.country && input.sector) {
    await prisma.entrepreneurProfile.create({
      data: {
        userId: user.id,
        businessName: input.businessName,
        country: input.country,
        sector: input.sector,
        description: input.description ?? "",
      },
    });
  } else if (input.role === "FUNDER" && input.orgName) {
    await prisma.funderProfile.create({
      data: { userId: user.id, orgName: input.orgName, mandate: "" },
    });
  } else if (input.role === "CORPORATE" && input.orgName) {
    await prisma.corporateProfile.create({
      data: { userId: user.id, orgName: input.orgName, industry: "" },
    });
  }

  // Tamper-evident audit entry
  await writeAudit({
    actorId: user.id,
    actorLabel: `${user.name ?? user.email}`,
    action: "User registered",
    entityType: "User",
    entityId: user.id,
    metadata: { role: input.role },
  });

  // Welcome email
  await sendEmail({
    to: user.email,
    subject: "Welcome to BHAF MarketBridge",
    body: `Hi ${user.name ?? "there"},\n\nWelcome to MarketBridge. Your account is created and you can sign in now. We'll guide you through profile setup and document verification step by step.\n\n— BHAF Circular Academy`,
  });

  return { ok: true, message: "Account created. Signing you in…" };
}

export async function signInAfterRegister(email: string, password: string) {
  return signIn("credentials", { email, password, redirect: false });
}
