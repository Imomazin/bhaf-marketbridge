"use server";

import { prisma } from "@/lib/db";
import { auth as getUserSession } from "@/auth";
import { revalidatePath } from "next/cache";
import { uploadFileToStorage } from "@/lib/storage";

export async function getEntrepreneurGrants() {
  const session = await getUserSession();
  if (!session?.user) return { ok: false, data: [] };

  try {
    const grants = await prisma.grant.findMany({
      where: { entrepreneurId: session.user.id },
      include: {
        progressReports: { orderBy: { createdAt: 'desc' } },
        beneficiaries: { orderBy: { createdAt: 'desc' } },
        financialMetrics: { orderBy: { dateRecorded: 'desc' } },
      },
      orderBy: { createdAt: "desc" },
    });
    return { ok: true, data: grants };
  } catch (error) {
    console.error("Error fetching grants:", error);
    return { ok: false, data: [] };
  }
}

export async function getGrantById(grantId: string) {
  const session = await getUserSession();
  if (!session?.user) return { ok: false, data: null };

  try {
    const grant = await prisma.grant.findUnique({
      where: { id: grantId, entrepreneurId: session.user.id },
      include: {
        progressReports: { orderBy: { createdAt: 'desc' } },
        beneficiaries: { orderBy: { createdAt: 'desc' } },
        financialMetrics: { orderBy: { dateRecorded: 'desc' } },
        messages: { orderBy: { createdAt: 'asc' }, include: { sender: { select: { name: true, role: true } } } },
      },
    });
    return { ok: true, data: grant };
  } catch (error) {
    console.error("Error fetching grant:", error);
    return { ok: false, data: null };
  }
}

export async function getGrantByIdForManagement(grantId: string) {
  const session = await getUserSession();
  if (!session?.user || !["FUNDER", "ADMIN"].includes(session.user.role)) return { ok: false, data: null };

  try {
    const grant = await prisma.grant.findUnique({
      where: { id: grantId },
      include: {
        entrepreneur: true,
        progressReports: { orderBy: { createdAt: 'desc' } },
        beneficiaries: { orderBy: { createdAt: 'desc' } },
        financialMetrics: { orderBy: { dateRecorded: 'desc' } },
        messages: { orderBy: { createdAt: 'asc' }, include: { sender: { select: { name: true, role: true } } } },
      },
    });

    if (session.user.role === "FUNDER" && grant?.funderId !== session.user.id) {
       return { ok: false, data: null };
    }

    return { ok: true, data: grant };
  } catch (error) {
    console.error("Error fetching grant for management:", error);
    return { ok: false, data: null };
  }
}

export async function addProgressReport(grantId: string, narrative: string, attachmentUrl?: string, attachmentName?: string) {
  const session = await getUserSession();
  if (!session?.user) return { ok: false, message: "Unauthorized" };

  try {
    const grant = await prisma.grant.findUnique({
      where: { id: grantId },
      include: { entrepreneur: true },
    });
    if (!grant) return { ok: false, message: "Grant not found" };

    if (session.user.role === "ENTREPRENEUR" && grant.entrepreneurId !== session.user.id) {
      return { ok: false, message: "Unauthorized" };
    }

    const report = await prisma.grantProgressReport.create({
      data: {
        grantId,
        reportDate: new Date(),
        narrative: narrative || null,
        attachmentUrl: attachmentUrl || null,
        attachmentName: attachmentName || null,
        status: "SUBMITTED",
      },
    });

    revalidatePath(`/portal/entrepreneur/grants/${grantId}`);
    return { ok: true, data: report };
  } catch (error) {
    console.error("Error adding progress report:", error);
    return { ok: false, message: "Internal server error" };
  }
}

export async function uploadGrantDocument(formData: FormData) {
  const session = await getUserSession();
  if (!session?.user) return { ok: false, message: "Unauthorized" };

  const file = formData.get("file") as File | null;
  if (!file) return { ok: false, message: "No file provided" };

  try {
    const result = await uploadFileToStorage(file, session.user.id);
    if (!result.ok) {
      return { ok: false, message: result.reason };
    }
    return { ok: true, url: result.artefact.url || `/api/grants/download?key=${encodeURIComponent(result.artefact.storageKey)}`, name: result.artefact.fileName };
  } catch (error) {
    console.error("Error uploading grant document:", error);
    return { ok: false, message: "Upload failed" };
  }
}

export async function addBeneficiary(grantId: string, data: { name: string, impactDescription: string, headcount: number }) {
  const session = await getUserSession();
  if (!session?.user) return { ok: false, message: "Unauthorized" };

  try {
    const grant = await prisma.grant.findUnique({ where: { id: grantId, entrepreneurId: session.user.id }});
    if (!grant) return { ok: false, message: "Grant not found" };

    await prisma.beneficiary.create({
      data: {
        grantId,
        ...data,
      }
    });

    revalidatePath(`/portal/entrepreneur/grants/${grantId}`);
    return { ok: true, message: "Beneficiary added." };
  } catch (error) {
    console.error("Error adding beneficiary:", error);
    return { ok: false, message: "Failed to add beneficiary." };
  }
}

export async function addFinancialMetric(grantId: string, data: { metricName: string, amountUsd: number, dateRecorded: string }) {
  const session = await getUserSession();
  if (!session?.user) return { ok: false, message: "Unauthorized" };

  try {
    const grant = await prisma.grant.findUnique({ where: { id: grantId, entrepreneurId: session.user.id }});
    if (!grant) return { ok: false, message: "Grant not found" };

    await prisma.financialMetric.create({
      data: {
        grantId,
        metricName: data.metricName,
        amountUsd: data.amountUsd,
        dateRecorded: new Date(data.dateRecorded),
      }
    });

    revalidatePath(`/portal/entrepreneur/grants/${grantId}`);
    return { ok: true, message: "Financial metric added." };
  } catch (error) {
    console.error("Error adding financial metric:", error);
    return { ok: false, message: "Failed to add financial metric." };
  }
}

// For Demo/Testing: Create a dummy grant
export async function createDemoGrant(title: string, amountUsd: number) {
  const session = await getUserSession();
  if (!session?.user) return { ok: false, message: "Unauthorized" };

  try {
    const grant = await prisma.grant.create({
      data: {
        title,
        amountUsd,
        entrepreneurId: session.user.id,
      }
    });

    revalidatePath(`/portal/entrepreneur/grants`);
    return { ok: true, grant };
  } catch (error) {
    console.error("Error creating demo grant:", error);
    return { ok: false, message: "Failed to create demo grant." };
  }
}

export async function getFunderGrants() {
  const session = await getUserSession();
  if (!session?.user || session.user.role !== "FUNDER") return { ok: false, data: [] };

  try {
    const grants = await prisma.grant.findMany({
      where: { funderId: session.user.id },
      include: {
        entrepreneur: true,
        progressReports: { orderBy: { createdAt: 'desc' } },
        beneficiaries: { orderBy: { createdAt: 'desc' } },
        financialMetrics: { orderBy: { dateRecorded: 'desc' } },
      },
      orderBy: { createdAt: "desc" },
    });
    return { ok: true, data: grants };
  } catch (error) {
    console.error("Error fetching funder grants:", error);
    return { ok: false, data: [] };
  }
}

export async function getAllGrants() {
  const session = await getUserSession();
  if (!session?.user || session.user.role !== "ADMIN") return { ok: false, data: [] };

  try {
    const grants = await prisma.grant.findMany({
      include: {
        entrepreneur: true,
        funder: true,
        progressReports: { orderBy: { createdAt: 'desc' } },
        beneficiaries: { orderBy: { createdAt: 'desc' } },
        financialMetrics: { orderBy: { dateRecorded: 'desc' } },
      },
      orderBy: { createdAt: "desc" },
    });
    return { ok: true, data: grants };
  } catch (error) {
    console.error("Error fetching all grants:", error);
    return { ok: false, data: [] };
  }
}

import { sendEmail } from "@/lib/email";

export async function issueGrant(data: { title: string, amountUsd: number, entrepreneurId: string }) {
  const session = await getUserSession();
  if (!session?.user || !["FUNDER", "ADMIN"].includes(session.user.role)) return { ok: false, message: "Unauthorized" };

  try {
    const grant = await prisma.grant.create({
      data: {
        title: data.title,
        amountUsd: data.amountUsd,
        entrepreneurId: data.entrepreneurId,
        funderId: session.user.role === "FUNDER" ? session.user.id : null,
      },
      include: {
        entrepreneur: true,
      }
    });

    if (grant.entrepreneur) {
       await sendEmail({
         to: grant.entrepreneur.email,
         subject: "You have been awarded a new Grant!",
         body: `Hi ${grant.entrepreneur.name},\n\nYou have been awarded a new grant titled "${grant.title}" for ₦${grant.amountUsd.toLocaleString()}.\nLog in to your portal to view and manage it.`,
       });
    }

    if (session.user.role === "FUNDER") {
      revalidatePath(`/portal/funder/grants`);
    } else {
      revalidatePath(`/admin/grants`);
    }
    
    return { ok: true, grant };
  } catch (error) {
    console.error("Error issuing grant:", error);
    return { ok: false, message: "Failed to issue grant." };
  }
}

export async function getEntrepreneurs() {
  const session = await getUserSession();
  if (!session?.user || !["FUNDER", "ADMIN"].includes(session.user.role)) return { ok: false, data: [] };

  try {
    const users = await prisma.user.findMany({
      where: { role: "ENTREPRENEUR" },
      select: { id: true, name: true, email: true },
    });
    return { ok: true, data: users };
  } catch (error) {
    console.error("Error fetching entrepreneurs:", error);
    return { ok: false, data: [] };
  }
}

export async function sendGrantMessage(grantId: string, receiverId: string, subject: string, message: string, attachmentUrl?: string) {
  const session = await getUserSession();
  if (!session?.user) return { ok: false, message: "Unauthorized" };

  try {
    const receiver = await prisma.user.findUnique({
      where: { id: receiverId },
      select: { email: true, name: true }
    });

    if (!receiver) {
      return { ok: false, message: "Receiver not found" };
    }

    const grantMessage = await prisma.grantMessage.create({
      data: {
        grantId,
        senderId: session.user.id,
        receiverId,
        subject,
        message,
        attachmentUrl
      }
    });

    // Also send an email notification
    const appUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
    const absoluteAttachmentUrl = attachmentUrl ? (attachmentUrl.startsWith('http') ? attachmentUrl : `${appUrl}${attachmentUrl}`) : "";

    await sendEmail({
      to: receiver.email,
      subject: `Direct Message via BHAF MarketBridge: ${subject}`,
      body: `Hi ${receiver.name},\n\nYou have received a new message regarding your grant on BHAF MarketBridge from ${session.user.name || "a user"}.\n\n---\n${message}\n---\n\n${absoluteAttachmentUrl ? `Attachment: ${absoluteAttachmentUrl}\n\n` : ''}Log in to your portal to view this message and reply.`
    });

    // Revalidate paths so the UI updates
    revalidatePath(`/portal/funder/grants/${grantId}`);
    revalidatePath(`/portal/entrepreneur/grants/${grantId}`);
    revalidatePath(`/admin/grants/${grantId}`);

    return { ok: true, message: "Message sent successfully!" };
  } catch (error) {
    console.error("Error sending grant message:", error);
    return { ok: false, message: "Failed to send message." };
  }
}
