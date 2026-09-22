"use server";

import { prisma } from "@/lib/db";
import { revalidatePath } from "next/cache";
import { sendEmail } from "@/lib/email";

export async function submitConsultingRequest(data: {
  name: string;
  email: string;
  orgName: string;
  serviceType: string;
  description: string;
}) {
  try {
    await prisma.consultingRequest.create({
      data: {
        name: data.name,
        email: data.email,
        orgName: data.orgName,
        serviceType: data.serviceType,
        description: data.description,
        status: "SUBMITTED",
      },
    });

    // Get admin emails
    const admins = await prisma.user.findMany({
      where: { role: "ADMIN" },
      select: { email: true }
    });

    const adminEmails = admins.map(a => a.email);

    // Send email to admins
    if (adminEmails.length > 0) {
      await sendEmail({
        to: adminEmails.join(","),
        subject: `New Consulting Request from ${data.name}`,
        body: `You have received a new consulting request from ${data.name} (${data.orgName}).\n\nService Type: ${data.serviceType}\nEmail: ${data.email}\n\nDescription:\n${data.description}\n\nPlease check the admin dashboard to reply.`
      });
    }

    return { ok: true };
  } catch (error) {
    console.error("Error submitting consulting request:", error);
    return { ok: false, message: "Failed to submit request" };
  }
}

export async function listConsultingRequests(filterStatus: string = "ALL") {
  try {
    const whereClause = filterStatus !== "ALL" ? { status: filterStatus } : {};
    const requests = await prisma.consultingRequest.findMany({
      where: whereClause,
      orderBy: { createdAt: "desc" },
    });
    return requests;
  } catch (error) {
    console.error("Error fetching consulting requests:", error);
    return [];
  }
}

export async function replyToConsultingRequest(id: string, message: string) {
  try {
    const req = await prisma.consultingRequest.findUnique({ where: { id } });
    if (!req) return { ok: false, message: "Not found" };

    // In a real app, send the email here.
    // await sendEmail({ to: req.email, subject: "Reply to your consulting inquiry", body: message });

    await prisma.consultingRequest.update({
      where: { id },
      data: {
        status: "REPLIED",
        adminNotes: message,
      },
    });

    revalidatePath("/admin/consulting");
    return { ok: true };
  } catch (error) {
    console.error("Error replying to request:", error);
    return { ok: false, message: "Failed to reply" };
  }
}
