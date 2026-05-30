"use server";

import { revalidatePath } from "next/cache";

import { auth } from "@/auth";
import { prisma, DB_ENABLED } from "@/lib/db";
import { writeAudit } from "@/lib/audit";
import { sendEmail } from "@/lib/email";
import { rfpSchema, rfpResponseSchema, type RfpInput, type RfpResponseInput } from "@/lib/schemas/rfp";

export type RfpResult = { ok: true; id: string; message: string } | { ok: false; message: string };

export async function createRfp(input: RfpInput): Promise<RfpResult> {
  const session = await auth();
  if (!session?.user) return { ok: false, message: "Sign-in required." };
  if (!DB_ENABLED || !prisma) return { ok: false, message: "Database not configured." };
  if (session.user.role !== "CORPORATE" && session.user.role !== "ADMIN") {
    return { ok: false, message: "Only corporate partners can post RFPs." };
  }

  const parsed = rfpSchema.safeParse(input);
  if (!parsed.success) return { ok: false, message: parsed.error.issues[0]?.message ?? "Invalid input." };

  const rfp = await prisma.rfp.create({
    data: {
      ownerId: session.user.id,
      title: parsed.data.title,
      category: parsed.data.category,
      description: parsed.data.description,
      region: parsed.data.region ?? null,
      budgetUsd: parsed.data.budgetUsd ?? null,
      deadline: parsed.data.deadline ? new Date(parsed.data.deadline) : null,
      status: "OPEN",
    },
  });

  await writeAudit({
    actorId: session.user.id,
    actorLabel: session.user.email ?? session.user.id,
    action: `RFP published · ${rfp.title}`,
    entityType: "Rfp",
    entityId: rfp.id,
  });

  revalidatePath("/marketplace/rfps");
  revalidatePath("/portal/corporate");
  return { ok: true, id: rfp.id, message: "RFP published. Verified suppliers will see it on the marketplace." };
}

export async function respondToRfp(input: RfpResponseInput): Promise<RfpResult> {
  const session = await auth();
  if (!session?.user) return { ok: false, message: "Sign-in required." };
  if (!DB_ENABLED || !prisma) return { ok: false, message: "Database not configured." };
  if (session.user.role !== "ENTREPRENEUR" && session.user.role !== "ADMIN") {
    return { ok: false, message: "Only entrepreneurs can respond to RFPs." };
  }

  const parsed = rfpResponseSchema.safeParse(input);
  if (!parsed.success) return { ok: false, message: parsed.error.issues[0]?.message ?? "Invalid input." };

  const rfp = await prisma.rfp.findUnique({
    where: { id: parsed.data.rfpId },
    include: { owner: { select: { id: true, email: true, name: true } } },
  });
  if (!rfp || rfp.status !== "OPEN") return { ok: false, message: "RFP is not open." };

  const existing = await prisma.rfpResponse.findUnique({
    where: { rfpId_responderId: { rfpId: rfp.id, responderId: session.user.id } },
  });
  if (existing) return { ok: false, message: "You've already responded to this RFP." };

  await prisma.rfpResponse.create({
    data: {
      rfpId: rfp.id,
      responderId: session.user.id,
      body: parsed.data.body,
      pricingNote: parsed.data.pricingNote ?? null,
      status: "SUBMITTED",
    },
  });

  await writeAudit({
    actorId: session.user.id,
    actorLabel: session.user.email ?? session.user.id,
    action: `RFP response submitted · ${rfp.title}`,
    entityType: "Rfp",
    entityId: rfp.id,
  });

  await prisma.notification.create({
    data: {
      userId: rfp.owner.id,
      kind: "GENERIC",
      title: `New response on RFP: ${rfp.title}`,
      body: `A verified supplier responded to your RFP.`,
      link: `/portal/corporate/rfps/${rfp.id}`,
    },
  });
  if (rfp.owner.email) {
    await sendEmail({
      to: rfp.owner.email,
      subject: `New response on RFP: ${rfp.title}`,
      body: `A verified supplier responded to your RFP "${rfp.title}".\n\nReview at /portal/corporate/rfps/${rfp.id}.\n\n— BHAF MarketBridge`,
    });
  }

  revalidatePath(`/marketplace/rfps/${rfp.id}`);
  revalidatePath(`/portal/corporate/rfps/${rfp.id}`);
  return { ok: true, id: rfp.id, message: "Response submitted." };
}

export async function decideRfpResponse(
  responseId: string,
  decision: "SHORTLISTED" | "REJECTED" | "AWARDED",
): Promise<RfpResult> {
  const session = await auth();
  if (!session?.user) return { ok: false, message: "Sign-in required." };
  if (!DB_ENABLED || !prisma) return { ok: false, message: "Database not configured." };

  const response = await prisma.rfpResponse.findUnique({
    where: { id: responseId },
    include: { rfp: true, responder: true },
  });
  if (!response) return { ok: false, message: "Response not found." };
  if (response.rfp.ownerId !== session.user.id && session.user.role !== "ADMIN") {
    return { ok: false, message: "Only the RFP owner can decide." };
  }

  await prisma.rfpResponse.update({
    where: { id: responseId },
    data: { status: decision },
  });

  if (decision === "AWARDED") {
    await prisma.rfp.update({ where: { id: response.rfpId }, data: { status: "AWARDED" } });
  }

  await writeAudit({
    actorId: session.user.id,
    actorLabel: session.user.email ?? session.user.id,
    action: `RFP response ${decision} · ${response.rfp.title}`,
    entityType: "RfpResponse",
    entityId: responseId,
  });

  await prisma.notification.create({
    data: {
      userId: response.responderId,
      kind: "GENERIC",
      title: `RFP response ${decision.toLowerCase()} · ${response.rfp.title}`,
      body: `Your response to "${response.rfp.title}" was ${decision.toLowerCase()}.`,
      link: `/marketplace/rfps/${response.rfpId}`,
    },
  });
  if (response.responder.email) {
    await sendEmail({
      to: response.responder.email,
      subject: `RFP update: ${response.rfp.title}`,
      body: `Your response to "${response.rfp.title}" was marked ${decision}.\n\n— BHAF MarketBridge`,
    });
  }

  revalidatePath(`/portal/corporate/rfps/${response.rfpId}`);
  return { ok: true, id: responseId, message: `Response ${decision.toLowerCase()}.` };
}
