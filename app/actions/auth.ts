"use server";

import bcrypt from "bcryptjs";

import { prisma, DB_ENABLED } from "@/lib/db";
import { findDemoAccountByEmail } from "@/lib/demoAccounts";
import { getDemoRegisteredUsers, saveDemoRegisteredUser } from "@/lib/demoRegistrations";
import { saveDemoEntrepreneurProfile, saveDemoFunderProfile } from "@/lib/demoState";
import { saveDemoCorporateProfile } from "@/lib/demoCorporate";
import { writeAudit } from "@/lib/audit";
import { signIn } from "@/auth";
import { registerSchema, type RegisterInput } from "@/lib/schemas/auth";
import { verifyTurnstile } from "@/lib/integrations/turnstile";

export type ActionResult<T = void> =
  | { ok: true; data?: T; message?: string }
  | { ok: false; fieldErrors?: Record<string, string>; message: string };

export async function registerAction(raw: RegisterInput & { turnstileToken?: string }): Promise<ActionResult> {
  // Bot check (no-op when Turnstile not configured)
  const captcha = await verifyTurnstile(raw.turnstileToken);
  if (!captcha.ok) {
    return { ok: false, message: "Bot protection failed. Refresh and try again." };
  }

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
    const email = input.email.toLowerCase();
    const existingDemoAccount = findDemoAccountByEmail(email);
    const existingRegistered = (await getDemoRegisteredUsers()).find((user) => user.email === email);

    if (existingDemoAccount || existingRegistered) {
      return {
        ok: false,
        fieldErrors: { email: "An account with this email already exists." },
        message: "Email already in use.",
      };
    }

    const passwordHash = await bcrypt.hash(input.password, 12);
    const saved = await saveDemoRegisteredUser({
      email,
      name: input.name.trim(),
      role: input.role,
      passwordHash,
    });

    if (input.role === "ENTREPRENEUR" && input.businessName && input.country && input.sector) {
      await saveDemoEntrepreneurProfile(saved.id, {
        businessName: input.businessName.trim(),
        country: input.country.trim(),
        sector: input.sector.trim(),
        description: input.description?.trim() ?? "",
        fundingNeed: "",
        esgActivity: "",
        yearFounded: null,
        womenSupported: 0,
        jobsCreated: 0,
      });
    }
    if (input.role === "FUNDER" && input.orgName) {
      await saveDemoFunderProfile(saved.id, {
        orgName: input.orgName.trim(),
        mandate: "",
        geoFocus: [],
        sectorFocus: [],
        ticketMin: null,
        ticketMax: null,
      });
    }
    if (input.role === "CORPORATE" && input.orgName) {
      await saveDemoCorporateProfile(saved.id, {
        orgName: input.orgName.trim(),
        industry: "",
        procurementGeo: [],
        esgFramework: "",
      });
    }

    return { ok: true, message: "Account created. Signing you in…" };
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

  return { ok: true, message: "Account created. Signing you in…" };
}

export async function signInAfterRegister(email: string, password: string) {
  return signIn("credentials", { email, password, redirect: false });
}
