"use server";

import { revalidatePath } from "next/cache";

import { auth } from "@/auth";
import { prisma, DB_ENABLED } from "@/lib/db";
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

  return { ok: false, message: "Marketplace enquiries need database wiring in live mode." };
}
