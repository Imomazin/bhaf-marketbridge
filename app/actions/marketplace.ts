"use server";

import { revalidatePath } from "next/cache";

import { auth } from "@/auth";
import { prisma, DB_ENABLED } from "@/lib/db";
import { writeAudit } from "@/lib/audit";
import { sendEmail } from "@/lib/email";
import { marketplaceListings } from "@/data/marketplace";
import { getAllDemoEntrepreneurProfiles, getAllDemoListings, saveDemoEnquiry } from "@/lib/demoState";
import { getAllDemoUsers } from "@/lib/demoUsers";

export type MarketplaceActionResult =
  | { ok: true; id: string; message: string }
  | { ok: false; message: string };

export async function requestMarketplaceEnquiry(
  listingId: string,
  note?: string,
): Promise<MarketplaceActionResult> {
  const session = await auth();
  if (!session?.user) return { ok: false, message: "Sign-in required." };

  if (!DB_ENABLED || !prisma) {
    const [demoListings, demoProfiles, demoUsers] = await Promise.all([
      getAllDemoListings(),
      getAllDemoEntrepreneurProfiles(),
      getAllDemoUsers(),
    ]);
    const demoListing = demoListings.find((listing) => listing.id === listingId);
    const seededListing = marketplaceListings.find((listing) => listing.id === listingId);
    const listing = demoListing
      ? (() => {
          const owner = demoUsers.find((user) => user.id === demoListing.ownerId);
          const profile = demoProfiles.find((entry) => entry.userId === demoListing.ownerId);
          return {
            id: demoListing.id,
            title: demoListing.title,
            business: profile?.businessName || owner?.name || "Marketplace seller",
          };
        })()
      : seededListing
      ? {
          id: seededListing.id,
          title: seededListing.title,
          business: seededListing.business,
        }
      : null;

    if (!listing) return { ok: false, message: "Listing not found." };

    await saveDemoEnquiry({
      userId: session.user.id,
      listingId: listing.id,
      listingTitle: listing.title,
      targetBusiness: listing.business,
      note,
    });

    revalidatePath("/marketplace");
    revalidatePath("/portal/entrepreneur");
    revalidatePath("/portal/entrepreneur/enquiries");
    revalidatePath("/admin");
    return { ok: true, id: listing.id, message: "Enquiry sent." };
  }

  const dbListing = await prisma.listing.findUnique({
    where: { id: listingId },
    include: { owner: true },
  });

  if (!dbListing) return { ok: false, message: "Listing not found." };

  const enquiry = await prisma.enquiry.create({
    data: {
      senderId: session.user.id,
      listingId: listingId,
      targetUserId: dbListing.ownerId,
      note: note || null,
      status: "SENT",
    },
  });

  await writeAudit({
    actorId: session.user.id,
    actorLabel: session.user.email ?? session.user.id,
    action: `Requested marketplace enquiry · ${dbListing.title}`,
    entityType: "Enquiry",
    entityId: enquiry.id,
  });

  await prisma.notification.create({
    data: {
      userId: dbListing.ownerId,
      kind: "ENQUIRY_RECEIVED",
      title: `New enquiry for ${dbListing.title}`,
      body: `You received an enquiry on your listing. Check your dashboard for details.`,
      link: "/portal/entrepreneur/enquiries",
    },
  });

  if (dbListing.owner.email) {
    await sendEmail({
      to: dbListing.owner.email,
      subject: `New enquiry on your listing: ${dbListing.title}`,
      body: `Hi,\n\nYou just received a new enquiry on your listing "${dbListing.title}".\n\n${
        note ? `Message:\n"${note}"\n\n` : ""
      }Please log in to your dashboard to reply: /portal/entrepreneur/enquiries\n\n— BHAF MarketBridge`,
    });
  }

  revalidatePath("/marketplace");
  revalidatePath("/portal/entrepreneur");
  revalidatePath("/portal/entrepreneur/enquiries");
  revalidatePath("/admin");
  return { ok: true, id: listingId, message: "Enquiry sent successfully." };
}

export async function replyToEnquiry(
  enquiryId: string,
  message: string,
): Promise<MarketplaceActionResult> {
  const session = await auth();
  if (!session?.user) return { ok: false, message: "Sign-in required." };
  if (!DB_ENABLED || !prisma) return { ok: false, message: "Database not configured." };

  const enquiry = await prisma.enquiry.findUnique({
    where: { id: enquiryId },
    include: {
      listing: true,
      sender: true,
    },
  });

  if (!enquiry) return { ok: false, message: "Enquiry not found." };
  if (enquiry.targetUserId !== session.user.id) {
    return { ok: false, message: "You don't have permission to reply to this enquiry." };
  }

  if (enquiry.status === "ARCHIVED") {
    return { ok: false, message: "Cannot reply to an archived enquiry." };
  }

  // Update enquiry status to RESPONDED
  await prisma.enquiry.update({
    where: { id: enquiryId },
    data: { status: "RESPONDED" },
  });

  await writeAudit({
    actorId: session.user.id,
    actorLabel: session.user.email ?? session.user.id,
    action: `Responded to enquiry on ${enquiry.listing.title}`,
    entityType: "Enquiry",
    entityId: enquiry.id,
  });

  if (enquiry.sender.email) {
    await sendEmail({
      to: enquiry.sender.email,
      subject: `Response to your enquiry: ${enquiry.listing.title}`,
      body: `Hi,\n\nThe owner of "${enquiry.listing.title}" has replied to your enquiry.\n\nTheir message:\n"${message}"\n\n— BHAF MarketBridge`,
    });
  }

  revalidatePath("/portal/entrepreneur/enquiries");
  return { ok: true, id: enquiryId, message: "Reply sent successfully." };
}
