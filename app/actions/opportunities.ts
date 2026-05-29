"use server";

import { revalidatePath } from "next/cache";

import { auth } from "@/auth";
import { prisma, DB_ENABLED } from "@/lib/db";
import { writeAudit } from "@/lib/audit";
import { sendEmail } from "@/lib/email";
import { opportunitySchema, type OpportunityInput } from "@/lib/schemas/opportunity";

export type OpportunityResult = { ok: true; id: string; message: string } | { ok: false; message: string };

export async function createOpportunity(input: OpportunityInput): Promise<OpportunityResult> {
  const session = await auth();
  if (!session?.user) return { ok: false, message: "Sign-in required." };
  if (!DB_ENABLED || !prisma) return { ok: false, message: "Database not configured." };
  if (session.user.role !== "ADMIN" && session.user.role !== "AUDITOR") {
    return { ok: false, message: "Only BHAF admins can publish opportunities." };
  }

  const parsed = opportunitySchema.safeParse(input);
  if (!parsed.success) {
    return { ok: false, message: parsed.error.issues[0]?.message ?? "Invalid input." };
  }

  const eligibility = parsed.data.eligibility
    ? parsed.data.eligibility.split("\n").map((l) => l.trim()).filter(Boolean).slice(0, 12)
    : [];

  const deadline = parsed.data.deadline ? new Date(parsed.data.deadline) : null;

  const opp = await prisma.opportunity.create({
    data: {
      title: parsed.data.title,
      organisation: parsed.data.organisation,
      type: parsed.data.type,
      region: parsed.data.region || null,
      amount: parsed.data.amount || null,
      deadline,
      description: parsed.data.description,
      eligibility,
      published: true,
    },
  });

  await writeAudit({
    actorId: session.user.id,
    actorLabel: session.user.email ?? "Admin",
    action: `Opportunity published · ${opp.title}`,
    entityType: "Opportunity",
    entityId: opp.id,
  });

  revalidatePath("/opportunities");
  revalidatePath("/admin");
  return { ok: true, id: opp.id, message: "Opportunity published." };
}

export async function applyToOpportunity(opportunityId: string, note?: string): Promise<OpportunityResult> {
  const session = await auth();
  if (!session?.user) return { ok: false, message: "Sign-in required." };
  if (!DB_ENABLED || !prisma) return { ok: false, message: "Database not configured." };

  const opp = await prisma.opportunity.findUnique({ where: { id: opportunityId } });
  if (!opp || !opp.published) return { ok: false, message: "Opportunity not found." };

  // We track applications via audit + notifications. A formal Application
  // model can be added later; for now this records intent reliably.
  await writeAudit({
    actorId: session.user.id,
    actorLabel: session.user.email ?? session.user.id,
    action: `Applied to opportunity · ${opp.title}`,
    entityType: "Opportunity",
    entityId: opp.id,
    metadata: note ? { note: note.slice(0, 500) } : undefined,
  });

  await prisma.notification.create({
    data: {
      userId: session.user.id,
      kind: "GENERIC",
      title: `Application submitted: ${opp.title}`,
      body:
        "Your application has been recorded. BHAF will route eligible applications to the listing organisation and update you here.",
      link: "/opportunities",
    },
  });

  if (session.user.email) {
    await sendEmail({
      to: session.user.email,
      subject: `Application submitted: ${opp.title}`,
      body: `Hi,\n\nWe've recorded your application for "${opp.title}" by ${opp.organisation}.\n\nNext steps: BHAF reviews applications against eligibility and routes shortlisted candidates onward. We'll notify you of any update.\n\n— BHAF MarketBridge`,
    });
  }

  return { ok: true, id: opp.id, message: "Application submitted." };
}
