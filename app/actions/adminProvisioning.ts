"use server";

import { revalidatePath } from "next/cache";
import bcrypt from "bcryptjs";
import crypto from "crypto";

import { auth } from "@/auth";
import { prisma, DB_ENABLED } from "@/lib/db";
import { writeAudit } from "@/lib/audit";
import { sendEmail } from "@/lib/email";
import {
  adminCreateFunderSchema,
  adminCreateCorporateSchema,
  generateSecurePassword,
  type AdminCreateFunderInput,
  type AdminCreateCorporateInput,
} from "@/lib/schemas/adminProvisioning";

export interface ProvisioningResult {
  ok: boolean;
  message: string;
  credentials?: {
    email: string;
    temporaryPassword?: string;
    role: string;
    orgName: string;
    loginUrl: string;
  };
}

function parseCommaList(input?: string | null): string[] {
  if (!input) return [];
  return input
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);
}

export async function createFunderByAdmin(
  input: AdminCreateFunderInput,
): Promise<ProvisioningResult> {
  const session = await auth();
  if (!session?.user) return { ok: false, message: "Sign-in required." };
  if (session.user.role !== "ADMIN" && session.user.role !== "AUDITOR") {
    return { ok: false, message: "Only BHAF administrators can provision partner accounts." };
  }
  if (!DB_ENABLED || !prisma) {
    return { ok: false, message: "Database is not configured." };
  }

  const parsed = adminCreateFunderSchema.safeParse(input);
  if (!parsed.success) {
    return { ok: false, message: parsed.error.issues[0]?.message ?? "Invalid input parameters." };
  }

  const email = parsed.data.email.trim().toLowerCase();
  const existingUser = await prisma.user.findUnique({
    where: { email },
    include: { funderProfile: true },
  });

  if (existingUser?.funderProfile) {
    return { ok: false, message: "A funder profile already exists for this email address." };
  }

  const rawPassword = parsed.data.password?.trim() || generateSecurePassword();
  const passwordHash = await bcrypt.hash(rawPassword, 12);
  const geoFocus = parseCommaList(parsed.data.geoFocus);
  const sectorFocus = parseCommaList(parsed.data.sectorFocus);
  const loginUrl = `${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"}/auth/sign-in`;

  let userId: string;

  if (existingUser) {
    userId = existingUser.id;
    await prisma.user.update({
      where: { id: userId },
      data: {
        name: parsed.data.contactName.trim(),
        role: "FUNDER",
        status: "ACTIVE",
        passwordHash,
        emailVerified: existingUser.emailVerified ?? new Date(),
      },
    });
  } else {
    const newUser = await prisma.user.create({
      data: {
        name: parsed.data.contactName.trim(),
        email,
        passwordHash,
        role: "FUNDER",
        status: "ACTIVE",
        emailVerified: new Date(),
      },
    });
    userId = newUser.id;
  }

  await prisma.funderProfile.create({
    data: {
      userId,
      orgName: parsed.data.orgName.trim(),
      mandate: parsed.data.mandate.trim(),
      geoFocus,
      sectorFocus,
      ticketMin: parsed.data.ticketMin ?? null,
      ticketMax: parsed.data.ticketMax ?? null,
      verified: true,
      status: "APPROVED",
      reviewedById: session.user.id,
      reviewedAt: new Date(),
    },
  });

  await writeAudit({
    actorId: session.user.id,
    actorLabel: session.user.email ?? "Admin",
    action: `Admin provisioned Funder profile · ${parsed.data.orgName}`,
    entityType: "FunderProfile",
    entityId: userId,
    metadata: {
      email,
      orgName: parsed.data.orgName,
      contactName: parsed.data.contactName,
    },
  });

  // Welcome email
  if (parsed.data.sendWelcomeEmail) {
    try {
      await sendEmail({
        to: email,
        subject: `Welcome to BHAF MarketBridge — Your Funder Account is Ready`,
        body: `Hi ${parsed.data.contactName.trim()},\n\nA Funder account for "${parsed.data.orgName.trim()}" has been created and verified for you on BHAF MarketBridge by our administration team.\n\nYour Login Credentials:\n• Email: ${email}\n• Temporary Password: ${rawPassword}\n• Sign-in URL: ${loginUrl}\n\nWith your funder profile, you can discover verified women-led enterprises by readiness tier, build private shortlists, and track impact investments.\n\nPlease sign in and change your password upon your first visit.\n\n— The BHAF MarketBridge Team`,
      });
    } catch (err) {
      console.error("[adminProvisioning] Failed to send funder welcome email:", err);
    }
  }

  revalidatePath("/admin/users");
  revalidatePath("/admin/profiles");
  revalidatePath("/directory");
  revalidatePath("/portal/funder");

  return {
    ok: true,
    message: `Funder account for "${parsed.data.orgName}" provisioned successfully.`,
    credentials: {
      email,
      temporaryPassword: rawPassword,
      role: "Funder",
      orgName: parsed.data.orgName.trim(),
      loginUrl,
    },
  };
}

export async function createCorporateByAdmin(
  input: AdminCreateCorporateInput,
): Promise<ProvisioningResult> {
  const session = await auth();
  if (!session?.user) return { ok: false, message: "Sign-in required." };
  if (session.user.role !== "ADMIN" && session.user.role !== "AUDITOR") {
    return { ok: false, message: "Only BHAF administrators can provision partner accounts." };
  }
  if (!DB_ENABLED || !prisma) {
    return { ok: false, message: "Database is not configured." };
  }

  const parsed = adminCreateCorporateSchema.safeParse(input);
  if (!parsed.success) {
    return { ok: false, message: parsed.error.issues[0]?.message ?? "Invalid input parameters." };
  }

  const email = parsed.data.email.trim().toLowerCase();
  const existingUser = await prisma.user.findUnique({
    where: { email },
    include: { corporateProfile: true },
  });

  if (existingUser?.corporateProfile) {
    return { ok: false, message: "A corporate partner profile already exists for this email address." };
  }

  const rawPassword = parsed.data.password?.trim() || generateSecurePassword();
  const passwordHash = await bcrypt.hash(rawPassword, 12);
  const procurementGeo = parseCommaList(parsed.data.procurementGeo);
  const loginUrl = `${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"}/auth/sign-in`;

  let userId: string;

  if (existingUser) {
    userId = existingUser.id;
    await prisma.user.update({
      where: { id: userId },
      data: {
        name: parsed.data.contactName.trim(),
        role: "CORPORATE",
        status: "ACTIVE",
        passwordHash,
        emailVerified: existingUser.emailVerified ?? new Date(),
      },
    });
  } else {
    const newUser = await prisma.user.create({
      data: {
        name: parsed.data.contactName.trim(),
        email,
        passwordHash,
        role: "CORPORATE",
        status: "ACTIVE",
        emailVerified: new Date(),
      },
    });
    userId = newUser.id;
  }

  await prisma.corporateProfile.create({
    data: {
      userId,
      orgName: parsed.data.orgName.trim(),
      industry: parsed.data.industry.trim(),
      procurementGeo,
      esgFramework: parsed.data.esgFramework?.trim() || null,
      verified: true,
      status: "APPROVED",
      reviewedById: session.user.id,
      reviewedAt: new Date(),
    },
  });

  await writeAudit({
    actorId: session.user.id,
    actorLabel: session.user.email ?? "Admin",
    action: `Admin provisioned Corporate Partner profile · ${parsed.data.orgName}`,
    entityType: "CorporateProfile",
    entityId: userId,
    metadata: {
      email,
      orgName: parsed.data.orgName,
      contactName: parsed.data.contactName,
      industry: parsed.data.industry,
    },
  });

  // Welcome email
  if (parsed.data.sendWelcomeEmail) {
    try {
      await sendEmail({
        to: email,
        subject: `Welcome to BHAF MarketBridge — Your Corporate Partner Account is Ready`,
        body: `Hi ${parsed.data.contactName.trim()},\n\nA Corporate Partner account for "${parsed.data.orgName.trim()}" has been created and verified on BHAF MarketBridge by our administration team.\n\nYour Login Credentials:\n• Email: ${email}\n• Temporary Password: ${rawPassword}\n• Sign-in URL: ${loginUrl}\n\nWith your corporate profile, you can source verified women-led suppliers, post targeted RFPs, and track ESG supplier diversity outcomes.\n\nPlease sign in and change your password upon your first visit.\n\n— The BHAF MarketBridge Team`,
      });
    } catch (err) {
      console.error("[adminProvisioning] Failed to send corporate welcome email:", err);
    }
  }

  revalidatePath("/admin/users");
  revalidatePath("/admin/profiles");
  revalidatePath("/marketplace");
  revalidatePath("/portal/corporate");

  return {
    ok: true,
    message: `Corporate Partner account for "${parsed.data.orgName}" provisioned successfully.`,
    credentials: {
      email,
      temporaryPassword: rawPassword,
      role: "Corporate Partner",
      orgName: parsed.data.orgName.trim(),
      loginUrl,
    },
  };
}
