"use server";

import { revalidatePath } from "next/cache";

import { auth } from "@/auth";
import { prisma, DB_ENABLED } from "@/lib/db";
import { writeAudit } from "@/lib/audit";
import { sendEmail } from "@/lib/email";
import type { ProfileRole } from "@/lib/queries/profileReview";

export type ProfileReviewResult = { ok: true; message: string } | { ok: false; message: string };

const ROLE_LABEL: Record<ProfileRole, string> = {
  entrepreneur: "Entrepreneur",
  funder: "Funder",
  corporate: "Corporate",
};

async function requireAdmin() {
  const session = await auth();
  if (!session?.user) return { ok: false as const, message: "Sign-in required." };
  if (session.user.role !== "ADMIN" && session.user.role !== "AUDITOR") {
    return { ok: false as const, message: "Admin only." };
  }
  return { ok: true as const, session };
}

async function findProfileWithUser(role: ProfileRole, profileId: string) {
  if (!prisma) return null;
  const userSelect = { select: { id: true, email: true, name: true } } as const;
  if (role === "entrepreneur") {
    return prisma.entrepreneurProfile.findUnique({ where: { id: profileId }, include: { user: userSelect } });
  }
  if (role === "funder") {
    return prisma.funderProfile.findUnique({ where: { id: profileId }, include: { user: userSelect } });
  }
  return prisma.corporateProfile.findUnique({ where: { id: profileId }, include: { user: userSelect } });
}

interface ReviewUpdate {
  status: "APPROVED" | "REJECTED";
  verified: boolean;
  rejectionReason: string | null;
  reviewedById: string;
  reviewedAt: Date;
}

async function updateProfileStatus(role: ProfileRole, profileId: string, data: ReviewUpdate) {
  if (!prisma) return;
  if (role === "entrepreneur") {
    await prisma.entrepreneurProfile.update({ where: { id: profileId }, data });
  } else if (role === "funder") {
    await prisma.funderProfile.update({ where: { id: profileId }, data });
  } else {
    await prisma.corporateProfile.update({ where: { id: profileId }, data });
  }
}

function revalidateAll(role: ProfileRole) {
  revalidatePath("/admin");
  revalidatePath("/admin/profiles");
  revalidatePath(`/admin/profiles/${role}`, "layout");
  revalidatePath("/settings");
  revalidatePath("/directory");
  revalidatePath(`/portal/${role}`);
}

export async function approveProfile(role: ProfileRole, profileId: string): Promise<ProfileReviewResult> {
  const gate = await requireAdmin();
  if (!gate.ok) return gate;
  if (!DB_ENABLED || !prisma) return { ok: false, message: "Database not configured." };

  const existing = await findProfileWithUser(role, profileId);
  if (!existing) return { ok: false, message: "Profile not found." };

  await updateProfileStatus(role, profileId, {
    status: "APPROVED",
    verified: true,
    rejectionReason: null,
    reviewedById: gate.session.user.id,
    reviewedAt: new Date(),
  });

  await writeAudit({
    actorId: gate.session.user.id,
    actorLabel: gate.session.user.email ?? gate.session.user.id,
    action: `${ROLE_LABEL[role]} profile approved · ${existing.user.name ?? existing.user.email}`,
    entityType: `${ROLE_LABEL[role]}Profile`,
    entityId: profileId,
  });

  await prisma.notification.create({
    data: {
      userId: existing.user.id,
      kind: "PROFILE_APPROVED",
      title: "Your profile has been approved",
      body: "BHAF has reviewed and approved your profile. It's now visible across the MarketBridge network.",
      link: "/settings",
    },
  });

  if (existing.user.email) {
    await sendEmail({
      to: existing.user.email,
      subject: "Your BHAF MarketBridge profile has been approved",
      body: `Hi,\n\nYour ${ROLE_LABEL[role].toLowerCase()} profile has been reviewed and approved. It's now visible across the MarketBridge network.\n\n— BHAF MarketBridge`,
    });
  }

  revalidateAll(role);
  return { ok: true, message: "Profile approved." };
}

export async function rejectProfile(
  role: ProfileRole,
  profileId: string,
  reason: string,
): Promise<ProfileReviewResult> {
  const gate = await requireAdmin();
  if (!gate.ok) return gate;
  if (!DB_ENABLED || !prisma) return { ok: false, message: "Database not configured." };
  const trimmedReason = reason.trim();
  if (!trimmedReason) return { ok: false, message: "A rejection reason is required." };

  const existing = await findProfileWithUser(role, profileId);
  if (!existing) return { ok: false, message: "Profile not found." };

  await updateProfileStatus(role, profileId, {
    status: "REJECTED",
    verified: false,
    rejectionReason: trimmedReason,
    reviewedById: gate.session.user.id,
    reviewedAt: new Date(),
  });

  await writeAudit({
    actorId: gate.session.user.id,
    actorLabel: gate.session.user.email ?? gate.session.user.id,
    action: `${ROLE_LABEL[role]} profile rejected · ${existing.user.name ?? existing.user.email}`,
    entityType: `${ROLE_LABEL[role]}Profile`,
    entityId: profileId,
    metadata: { reason: trimmedReason.slice(0, 1000) },
  });

  await prisma.notification.create({
    data: {
      userId: existing.user.id,
      kind: "PROFILE_REJECTED",
      title: "Your profile needs changes",
      body: `BHAF reviewed your profile and it wasn't approved. Reason: ${trimmedReason}. Update and resubmit it from Settings.`,
      link: "/settings",
    },
  });

  if (existing.user.email) {
    await sendEmail({
      to: existing.user.email,
      subject: "Your BHAF MarketBridge profile needs changes",
      body: `Hi,\n\nYour ${ROLE_LABEL[role].toLowerCase()} profile was reviewed and wasn't approved.\n\nReason: ${trimmedReason}\n\nYou can update and resubmit it from your Settings page — resubmitting queues it for review again.\n\n— BHAF MarketBridge`,
    });
  }

  revalidateAll(role);
  return { ok: true, message: "Profile rejected." };
}
