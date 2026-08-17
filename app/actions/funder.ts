"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";
import { auth } from "@/auth";
import { prisma, DB_ENABLED } from "@/lib/db";
import { loadDirectoryEntrepreneurById } from "@/lib/queries/directory";
import { saveFunderShortlistEntry } from "@/lib/funderShortlists";

const shortlistSchema = z.object({
  entrepreneurId: z.string().min(1),
  shortlistName: z.string().min(1).max(80).default("My shortlist"),
  returnTo: z.string().min(1),
});

export async function addEntrepreneurToShortlist(formData: FormData) {
  const parsed = shortlistSchema.safeParse({
    entrepreneurId: formData.get("entrepreneurId"),
    shortlistName: formData.get("shortlistName") || "My shortlist",
    returnTo: formData.get("returnTo"),
  });

  const fallbackReturnTo = typeof formData.get("returnTo") === "string" ? String(formData.get("returnTo")) : "/directory";

  if (!parsed.success) redirect(fallbackReturnTo);

  const session = await auth();
  if (!session?.user) redirect(`/auth/sign-in?next=${encodeURIComponent(parsed.data.returnTo)}`);
  if (session.user.role !== "FUNDER" && session.user.role !== "CORPORATE") redirect(parsed.data.returnTo);

  const entrepreneur = await loadDirectoryEntrepreneurById(parsed.data.entrepreneurId);
  if (!entrepreneur) redirect("/directory");

  if (DB_ENABLED && prisma) {
    let shortlist = await prisma.shortlist.findUnique({
      where: {
        ownerId_name: {
          ownerId: session.user.id,
          name: parsed.data.shortlistName,
        }
      }
    });

    if (!shortlist) {
      shortlist = await prisma.shortlist.create({
        data: {
          ownerId: session.user.id,
          name: parsed.data.shortlistName,
        }
      });
    }

    const existingEntry = await prisma.shortlistEntry.findUnique({
      where: {
        shortlistId_entrepreneurId: {
          shortlistId: shortlist.id,
          entrepreneurId: entrepreneur.id,
        }
      }
    });

    if (!existingEntry) {
      await prisma.shortlistEntry.create({
        data: {
          shortlistId: shortlist.id,
          entrepreneurId: entrepreneur.id,
        }
      });
    }
  } else {
    await saveFunderShortlistEntry({
      funderUserId: session.user.id,
      shortlistName: parsed.data.shortlistName,
      entrepreneurId: entrepreneur.id,
      entrepreneurName: entrepreneur.name,
      businessName: entrepreneur.businessName,
      country: entrepreneur.country,
      sector: entrepreneur.sector,
      readinessLevel: entrepreneur.readinessLevel,
      fundingNeed: entrepreneur.fundingNeed,
      description: entrepreneur.description,
    });
  }

  revalidatePath("/directory");
  revalidatePath(parsed.data.returnTo);
  revalidatePath("/portal/funder");
  revalidatePath("/portal/funder/shortlists");
  revalidatePath("/portal/funder/pipeline");
  revalidatePath("/portal/corporate");

  redirect(`${parsed.data.returnTo}?shortlisted=1`);
}

export async function removeEntrepreneurFromShortlist(formData: FormData) {
  const session = await auth();
  if (!session?.user?.id) throw new Error("Unauthorized");

  const schema = z.object({
    entrepreneurId: z.string(),
    shortlistName: z.string(),
    returnTo: z.string().default("/portal/funder/shortlists"),
  });

  const parsed = schema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) throw new Error("Invalid request");

  if (DB_ENABLED && prisma) {
    const shortlist = await prisma.shortlist.findUnique({
      where: {
        ownerId_name: {
          ownerId: session.user.id,
          name: parsed.data.shortlistName,
        }
      }
    });

    if (shortlist) {
      await prisma.shortlistEntry.delete({
        where: {
          shortlistId_entrepreneurId: {
            shortlistId: shortlist.id,
            entrepreneurId: parsed.data.entrepreneurId,
          }
        }
      }).catch(() => {
        // Ignore if it doesn't exist
      });
    }
  } else {
    const { removeFunderShortlistEntry } = await import("@/lib/funderShortlists");
    await removeFunderShortlistEntry(session.user.id, parsed.data.entrepreneurId, parsed.data.shortlistName);
  }

  revalidatePath("/directory");
  revalidatePath(parsed.data.returnTo);
  revalidatePath("/portal/funder");
  revalidatePath("/portal/funder/shortlists");
  
  redirect(parsed.data.returnTo);
}
