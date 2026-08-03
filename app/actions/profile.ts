"use server";

import { revalidatePath } from "next/cache";

import { auth } from "@/auth";
import { prisma, DB_ENABLED } from "@/lib/db";
import { writeAudit } from "@/lib/audit";
import { saveDemoEntrepreneurProfile, saveDemoFunderProfile } from "@/lib/demoState";
import { saveDemoCorporateProfile } from "@/lib/demoCorporate";
import {
  entrepreneurProfileSchema,
  funderProfileSchema,
  corporateProfileSchema,
  type EntrepreneurProfileInput,
  type FunderProfileInput,
  type CorporateProfileInput,
} from "@/lib/schemas/profile";

export type ProfileResult = { ok: true; message: string } | { ok: false; message: string };

function splitList(raw?: string): string[] {
  if (!raw) return [];
  return raw.split(/[,\n]/).map((s) => s.trim()).filter(Boolean).slice(0, 20);
}

export async function saveEntrepreneurProfile(input: EntrepreneurProfileInput): Promise<ProfileResult> {
  const session = await auth();
  if (!session?.user) return { ok: false, message: "Sign-in required." };

  const parsed = entrepreneurProfileSchema.safeParse(input);
  if (!parsed.success) return { ok: false, message: parsed.error.issues[0]?.message ?? "Invalid input." };

  if (!DB_ENABLED || !prisma) {
    await saveDemoEntrepreneurProfile(session.user.id, {
      businessName: parsed.data.businessName,
      country: parsed.data.country,
      sector: parsed.data.sector,
      description: parsed.data.description ?? "",
      fundingNeed: parsed.data.fundingNeed ?? "",
      esgActivity: parsed.data.esgActivity ?? "",
      yearFounded: parsed.data.yearFounded ?? null,
      womenSupported: parsed.data.womenSupported ?? 0,
      jobsCreated: parsed.data.jobsCreated ?? 0,
    });

    revalidatePath("/settings");
    revalidatePath("/portal/entrepreneur");
    revalidatePath("/portal/entrepreneur/esg");
    revalidatePath("/directory");
    return { ok: true, message: "Profile saved." };
  }

  await prisma.entrepreneurProfile.upsert({
    where: { userId: session.user.id },
    update: {
      businessName: parsed.data.businessName,
      country: parsed.data.country,
      sector: parsed.data.sector,
      description: parsed.data.description ?? "",
      fundingNeed: parsed.data.fundingNeed ?? null,
      esgActivity: parsed.data.esgActivity ?? null,
      yearFounded: parsed.data.yearFounded ?? null,
      womenSupported: parsed.data.womenSupported ?? 0,
      jobsCreated: parsed.data.jobsCreated ?? 0,
    },
    create: {
      userId: session.user.id,
      businessName: parsed.data.businessName,
      country: parsed.data.country,
      sector: parsed.data.sector,
      description: parsed.data.description ?? "",
      fundingNeed: parsed.data.fundingNeed ?? null,
      esgActivity: parsed.data.esgActivity ?? null,
      yearFounded: parsed.data.yearFounded ?? null,
      womenSupported: parsed.data.womenSupported ?? 0,
      jobsCreated: parsed.data.jobsCreated ?? 0,
    },
  });

  await writeAudit({
    actorId: session.user.id,
    actorLabel: session.user.email ?? session.user.id,
    action: "Entrepreneur profile updated",
    entityType: "EntrepreneurProfile",
    entityId: session.user.id,
  });

  revalidatePath("/settings");
  revalidatePath("/portal/entrepreneur");
  revalidatePath("/directory");
  return { ok: true, message: "Profile saved." };
}

export async function saveFunderProfile(input: FunderProfileInput): Promise<ProfileResult> {
  const session = await auth();
  if (!session?.user) return { ok: false, message: "Sign-in required." };

  const parsed = funderProfileSchema.safeParse(input);
  if (!parsed.success) return { ok: false, message: parsed.error.issues[0]?.message ?? "Invalid input." };

  if (!DB_ENABLED || !prisma) {
    await saveDemoFunderProfile(session.user.id, {
      orgName: parsed.data.orgName,
      mandate: parsed.data.mandate ?? "",
      geoFocus: splitList(parsed.data.geoFocus),
      sectorFocus: splitList(parsed.data.sectorFocus),
      ticketMin: parsed.data.ticketMin ?? null,
      ticketMax: parsed.data.ticketMax ?? null,
    });

    revalidatePath("/settings");
    revalidatePath("/portal/funder");
    revalidatePath("/portal/funder/pipeline");
    revalidatePath("/portal/funder/shortlists");
    revalidatePath("/portal/funder/impact");
    revalidatePath("/portal/funder/vault");
    return { ok: true, message: "Profile saved." };
  }

  await prisma.funderProfile.upsert({
    where: { userId: session.user.id },
    update: {
      orgName: parsed.data.orgName,
      mandate: parsed.data.mandate ?? "",
      geoFocus: splitList(parsed.data.geoFocus),
      sectorFocus: splitList(parsed.data.sectorFocus),
      ticketMin: parsed.data.ticketMin ?? null,
      ticketMax: parsed.data.ticketMax ?? null,
    },
    create: {
      userId: session.user.id,
      orgName: parsed.data.orgName,
      mandate: parsed.data.mandate ?? "",
      geoFocus: splitList(parsed.data.geoFocus),
      sectorFocus: splitList(parsed.data.sectorFocus),
      ticketMin: parsed.data.ticketMin ?? null,
      ticketMax: parsed.data.ticketMax ?? null,
    },
  });

  await writeAudit({
    actorId: session.user.id,
    actorLabel: session.user.email ?? session.user.id,
    action: "Funder profile updated",
    entityType: "FunderProfile",
    entityId: session.user.id,
  });

  revalidatePath("/settings");
  revalidatePath("/portal/funder");
  revalidatePath("/portal/funder/pipeline");
  revalidatePath("/portal/funder/shortlists");
  revalidatePath("/portal/funder/impact");
  revalidatePath("/portal/funder/vault");
  return { ok: true, message: "Profile saved." };
}

export async function saveCorporateProfile(input: CorporateProfileInput): Promise<ProfileResult> {
  const session = await auth();
  if (!session?.user) return { ok: false, message: "Sign-in required." };

  const parsed = corporateProfileSchema.safeParse(input);
  if (!parsed.success) return { ok: false, message: parsed.error.issues[0]?.message ?? "Invalid input." };

  if (!DB_ENABLED || !prisma) {
    await saveDemoCorporateProfile(session.user.id, {
      orgName: parsed.data.orgName,
      industry: parsed.data.industry,
      procurementGeo: splitList(parsed.data.procurementGeo),
      esgFramework: parsed.data.esgFramework ?? "",
    });

    revalidatePath("/settings");
    revalidatePath("/portal/corporate");
    return { ok: true, message: "Profile saved." };
  }

  await prisma.corporateProfile.upsert({
    where: { userId: session.user.id },
    update: {
      orgName: parsed.data.orgName,
      industry: parsed.data.industry,
      procurementGeo: splitList(parsed.data.procurementGeo),
      esgFramework: parsed.data.esgFramework ?? null,
    },
    create: {
      userId: session.user.id,
      orgName: parsed.data.orgName,
      industry: parsed.data.industry,
      procurementGeo: splitList(parsed.data.procurementGeo),
      esgFramework: parsed.data.esgFramework ?? null,
    },
  });

  await writeAudit({
    actorId: session.user.id,
    actorLabel: session.user.email ?? session.user.id,
    action: "Corporate profile updated",
    entityType: "CorporateProfile",
    entityId: session.user.id,
  });

  revalidatePath("/settings");
  revalidatePath("/portal/corporate");
  return { ok: true, message: "Profile saved." };
}
