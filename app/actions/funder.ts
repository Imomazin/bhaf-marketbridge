"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";
import { auth } from "@/auth";
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
  if (session.user.role !== "FUNDER") redirect(parsed.data.returnTo);

  const entrepreneur = await loadDirectoryEntrepreneurById(parsed.data.entrepreneurId);
  if (!entrepreneur) redirect("/directory");

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

  revalidatePath("/directory");
  revalidatePath(parsed.data.returnTo);
  revalidatePath("/portal/funder");
  revalidatePath("/portal/funder/shortlists");
  revalidatePath("/portal/funder/pipeline");

  redirect(`${parsed.data.returnTo}?shortlisted=1`);
}
