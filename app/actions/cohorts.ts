"use server";

import { revalidatePath } from "next/cache";
import { auth } from "@/auth";
import { prisma, DB_ENABLED } from "@/lib/db";
import { writeAudit } from "@/lib/audit";
import { sendEmail } from "@/lib/email";
import { cohortSchema, type CohortInput } from "@/lib/schemas/cohort";

export type CohortResult = { ok: true; id: string; message: string } | { ok: false; message: string };

export async function createCohort(input: CohortInput): Promise<CohortResult> {
  const session = await auth();
  if (!session?.user) return { ok: false, message: "Sign-in required." };
  if (!DB_ENABLED || !prisma) return { ok: false, message: "Database not configured." };
  if (session.user.role !== "ADMIN" && session.user.role !== "AUDITOR") return { ok: false, message: "Admin only." };

  const parsed = cohortSchema.safeParse(input);
  if (!parsed.success) return { ok: false, message: parsed.error.issues[0]?.message ?? "Invalid input." };

  const cohort = await prisma.cohort.create({
    data: {
      name: parsed.data.name,
      programme: parsed.data.programme || null,
      region: parsed.data.region || null,
      description: parsed.data.description || null,
      startDate: parsed.data.startDate ? new Date(parsed.data.startDate) : null,
      endDate: parsed.data.endDate ? new Date(parsed.data.endDate) : null,
      capacity: parsed.data.capacity ?? null,
      status: "OPEN",
      createdById: session.user.id,
    },
  });

  await writeAudit({
    actorId: session.user.id,
    actorLabel: session.user.email ?? "Admin",
    action: `Cohort created · ${cohort.name}`,
    entityType: "Cohort",
    entityId: cohort.id,
  });

  revalidatePath("/admin/cohorts");
  return { ok: true, id: cohort.id, message: "Cohort created." };
}

export async function inviteToCohort(cohortId: string, emails: string): Promise<CohortResult> {
  const session = await auth();
  if (!session?.user) return { ok: false, message: "Sign-in required." };
  if (!DB_ENABLED || !prisma) return { ok: false, message: "Database not configured." };
  if (session.user.role !== "ADMIN" && session.user.role !== "AUDITOR") return { ok: false, message: "Admin only." };

  const cohort = await prisma.cohort.findUnique({ where: { id: cohortId } });
  if (!cohort) return { ok: false, message: "Cohort not found." };

  const list = emails
    .split(/[,\n]/)
    .map((e) => e.trim().toLowerCase())
    .filter(Boolean)
    .slice(0, 200);

  let invited = 0;
  const skipped: string[] = [];

  for (const email of list) {
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      skipped.push(email);
      continue;
    }
    try {
      await prisma.cohortMembership.create({
        data: { cohortId, userId: user.id, status: "INVITED" },
      });
      invited++;
      await prisma.notification.create({
        data: {
          userId: user.id,
          kind: "GENERIC",
          title: `Cohort invitation: ${cohort.name}`,
          body: `BHAF invited you to join the ${cohort.name} cohort. Confirm your place from your workspace.`,
          link: "/portal",
        },
      });
      if (user.email) {
        await sendEmail({
          to: user.email,
          subject: `Cohort invitation: ${cohort.name}`,
          body: `Hi,\n\nBHAF invited you to join the "${cohort.name}" cohort. ${cohort.description ?? ""}\n\nLog in to confirm your place.\n\n— BHAF MarketBridge`,
        });
      }
    } catch {
      skipped.push(email + " (already a member?)");
    }
  }

  await writeAudit({
    actorId: session.user.id,
    actorLabel: session.user.email ?? "Admin",
    action: `Cohort invited ${invited} members · ${cohort.name}`,
    entityType: "Cohort",
    entityId: cohort.id,
    metadata: { skipped },
  });

  revalidatePath(`/admin/cohorts`);
  return {
    ok: true,
    id: cohort.id,
    message: `Invited ${invited} members.${skipped.length ? ` Skipped ${skipped.length}.` : ""}`,
  };
}

export async function confirmCohortMembership(cohortId: string): Promise<CohortResult> {
  const session = await auth();
  if (!session?.user) return { ok: false, message: "Sign-in required." };
  if (!DB_ENABLED || !prisma) return { ok: false, message: "Database not configured." };

  await prisma.cohortMembership.updateMany({
    where: { cohortId, userId: session.user.id, status: "INVITED" },
    data: { status: "CONFIRMED" },
  });

  await writeAudit({
    actorId: session.user.id,
    actorLabel: session.user.email ?? session.user.id,
    action: "Cohort membership confirmed",
    entityType: "Cohort",
    entityId: cohortId,
  });

  revalidatePath("/portal/entrepreneur");
  revalidatePath("/admin/cohorts");
  return { ok: true, id: cohortId, message: "Welcome to the cohort." };
}
