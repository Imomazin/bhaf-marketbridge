"use server";

import { revalidatePath } from "next/cache";

import { auth } from "@/auth";
import { prisma, DB_ENABLED } from "@/lib/db";
import { writeAudit } from "@/lib/audit";
import { listingSchema, type ListingInput } from "@/lib/schemas/listing";
import { saveDemoListing } from "@/lib/demoState";
import { syncEntrepreneurReadiness } from "@/lib/readinessSync";

export type ListingResult =
  | { ok: true; id: string; message: string }
  | { ok: false; message: string };

export async function createListing(
  input: ListingInput,
): Promise<ListingResult> {
  const session = await auth();
  if (!session?.user) return { ok: false, message: "Sign-in required." };
  if (session.user.role !== "ENTREPRENEUR" && session.user.role !== "ADMIN") {
    return { ok: false, message: "Only entrepreneurs can publish listings." };
  }

  const parsed = listingSchema.safeParse(input);
  if (!parsed.success) {
    return {
      ok: false,
      message: parsed.error.issues[0]?.message ?? "Invalid input.",
    };
  }

  const tags = parsed.data.tags
    ? parsed.data.tags
        .split(",")
        .map((t) => t.trim())
        .filter(Boolean)
        .slice(0, 10)
    : [];

  if (!DB_ENABLED || !prisma) {
    const listing = await saveDemoListing(session.user.id, {
      title: parsed.data.title,
      category: parsed.data.category,
      description: parsed.data.description,
      priceRange: parsed.data.priceRange,
      minOrder: parsed.data.minOrder,
      esgHighlight: parsed.data.esgHighlight,
      tags,
    });

    revalidatePath("/marketplace");
    revalidatePath("/portal/entrepreneur");
    revalidatePath("/portal/entrepreneur/listings");
    return { ok: true, id: listing.id, message: "Listing published!" };
  }

  const profile = await prisma.entrepreneurProfile.findUnique({
    where: { userId: session.user.id },
    select: { verified: true },
  });

  const isVerified = profile?.verified ?? false;
  const status = isVerified ? "PUBLISHED" : "PENDING_REVIEW";

  const listing = await prisma.listing.create({
    data: {
      ownerId: session.user.id,
      title: parsed.data.title,
      category: parsed.data.category,
      description: parsed.data.description,
      priceRange: parsed.data.priceRange || null,
      minOrder: parsed.data.minOrder || null,
      esgHighlight: parsed.data.esgHighlight || null,
      tags,
      status,
      publishedAt: isVerified ? new Date() : null,
    },
  });

  await writeAudit({
    actorId: session.user.id,
    actorLabel: session.user.email ?? session.user.id,
    action: `Listing created · ${listing.title}`,
    entityType: "Listing",
    entityId: listing.id,
  });

  await syncEntrepreneurReadiness(session.user.id);

  revalidatePath("/marketplace");
  revalidatePath("/portal/entrepreneur");
  return {
    ok: true,
    id: listing.id,
    message: isVerified
      ? "Listing published directly to the marketplace!"
      : "Listing submitted. It'll appear in the marketplace once BHAF approves it.",
  };
}

export async function deleteListing(id: string): Promise<ListingResult> {
  const session = await auth();
  if (!session?.user) return { ok: false, message: "Sign-in required." };
  if (!DB_ENABLED || !prisma)
    return { ok: false, message: "Database not configured." };

  const listing = await prisma.listing.findUnique({ where: { id } });
  if (!listing) return { ok: false, message: "Listing not found." };
  if (listing.ownerId !== session.user.id && session.user.role !== "ADMIN") {
    return { ok: false, message: "You can only delete your own listings." };
  }

  await prisma.listing.update({
    where: { id },
    data: { status: "ARCHIVED" },
  });

  await writeAudit({
    actorId: session.user.id,
    actorLabel: session.user.email ?? session.user.id,
    action: `Listing archived · ${listing.title}`,
    entityType: "Listing",
    entityId: listing.id,
  });

  await syncEntrepreneurReadiness(session.user.id);

  revalidatePath("/marketplace");
  revalidatePath("/portal/entrepreneur");
  return { ok: true, id, message: "Listing archived." };
}

export async function reviewListing(
  id: string,
  decision: "APPROVE" | "REJECT",
  reason?: string,
): Promise<ListingResult> {
  const session = await auth();
  if (!session?.user) return { ok: false, message: "Sign-in required." };
  if (!DB_ENABLED || !prisma)
    return { ok: false, message: "Database not configured." };
  if (session.user.role !== "ADMIN" && session.user.role !== "AUDITOR") {
    return { ok: false, message: "Only admins can review listings." };
  }

  const listing = await prisma.listing.findUnique({ where: { id } });
  if (!listing) return { ok: false, message: "Listing not found." };

  const status = decision === "APPROVE" ? "PUBLISHED" : "REJECTED";
  await prisma.listing.update({
    where: { id },
    data: {
      status,
      publishedAt: decision === "APPROVE" ? new Date() : null,
    },
  });

  await writeAudit({
    actorId: session.user.id,
    actorLabel: session.user.email ?? "Admin",
    action: `Listing ${decision} · ${listing.title}`,
    entityType: "Listing",
    entityId: listing.id,
    metadata: reason ? { reason } : undefined,
  });

  revalidatePath("/marketplace");
  revalidatePath("/admin");
  revalidatePath("/admin/listings");
  revalidatePath("/portal/entrepreneur");
  revalidatePath("/portal/entrepreneur/listings");
  return {
    ok: true,
    id,
    message: `Listing ${decision === "APPROVE" ? "published" : "rejected"}.`,
  };
}

export async function unarchiveListing(id: string): Promise<ListingResult> {
  const session = await auth();
  if (!session?.user) return { ok: false, message: "Sign-in required." };
  if (!DB_ENABLED || !prisma)
    return { ok: false, message: "Database not configured." };
  if (session.user.role !== "ADMIN" && session.user.role !== "AUDITOR") {
    return { ok: false, message: "Only admins can unarchive listings." };
  }

  const listing = await prisma.listing.findUnique({ where: { id } });
  if (!listing) return { ok: false, message: "Listing not found." };
  if (listing.status !== "ARCHIVED") {
    return { ok: false, message: "Listing is not archived." };
  }

  await prisma.listing.update({
    where: { id },
    data: { status: "PUBLISHED" },
  });

  await writeAudit({
    actorId: session.user.id,
    actorLabel: session.user.email ?? "Admin",
    action: `Listing unarchived · ${listing.title}`,
    entityType: "Listing",
    entityId: listing.id,
  });

  revalidatePath("/marketplace");
  revalidatePath("/admin");
  revalidatePath("/admin/listings");
  revalidatePath("/portal/entrepreneur");
  revalidatePath("/portal/entrepreneur/listings");
  return { ok: true, id, message: "Listing unarchived and published." };
}

export async function updateListing(
  id: string,
  input: ListingInput,
): Promise<ListingResult> {
  const session = await auth();
  if (!session?.user) return { ok: false, message: "Sign-in required." };
  if (session.user.role !== "ENTREPRENEUR" && session.user.role !== "ADMIN") {
    return { ok: false, message: "Only entrepreneurs can update listings." };
  }
  if (!DB_ENABLED || !prisma)
    return { ok: false, message: "Database not configured." };

  const parsed = listingSchema.safeParse(input);
  if (!parsed.success) {
    return {
      ok: false,
      message: parsed.error.issues[0]?.message ?? "Invalid input.",
    };
  }

  const listing = await prisma.listing.findUnique({ where: { id } });
  if (!listing) return { ok: false, message: "Listing not found." };
  if (listing.ownerId !== session.user.id && session.user.role !== "ADMIN") {
    return { ok: false, message: "You can only update your own listings." };
  }

  const tags = parsed.data.tags
    ? parsed.data.tags
        .split(",")
        .map((t) => t.trim())
        .filter(Boolean)
        .slice(0, 10)
    : [];

  const profile = await prisma.entrepreneurProfile.findUnique({
    where: { userId: listing.ownerId },
    select: { verified: true },
  });

  const isVerified = profile?.verified ?? false;
  // If the listing was published, let it stay published if they are verified. 
  // Otherwise, it might need to go back to pending review if they aren't verified, 
  // but let's assume it reverts to pending if they are not verified, or stays published if verified.
  let newStatus = listing.status;
  if (newStatus === "REJECTED" || newStatus === "ARCHIVED") {
    newStatus = isVerified ? "PUBLISHED" : "PENDING_REVIEW";
  } else if (!isVerified) {
    newStatus = "PENDING_REVIEW";
  }

  await prisma.listing.update({
    where: { id },
    data: {
      title: parsed.data.title,
      category: parsed.data.category,
      description: parsed.data.description,
      priceRange: parsed.data.priceRange || null,
      minOrder: parsed.data.minOrder || null,
      esgHighlight: parsed.data.esgHighlight || null,
      tags,
      status: newStatus,
    },
  });

  await writeAudit({
    actorId: session.user.id,
    actorLabel: session.user.email ?? session.user.id,
    action: `Listing updated · ${parsed.data.title}`,
    entityType: "Listing",
    entityId: listing.id,
  });

  await syncEntrepreneurReadiness(session.user.id);

  revalidatePath("/marketplace");
  revalidatePath("/portal/entrepreneur");
  revalidatePath("/portal/entrepreneur/listings");
  return { ok: true, id: listing.id, message: "Listing updated." };
}
