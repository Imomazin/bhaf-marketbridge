"use server";

import { auth } from "@/auth";
import { prisma, DB_ENABLED } from "@/lib/db";
import { revalidatePath } from "next/cache";
import { checkLimitAndWarn } from "@/lib/limits";

export async function updatePipelineStage(entrepreneurId: string, newStage: "SOURCING" | "DILIGENCE" | "TERM_SHEET" | "CLOSED") {
  if (!DB_ENABLED || !prisma) {
    throw new Error("Database is not enabled.");
  }

  const session = await auth();
  if (!session?.user || session.user.role !== "FUNDER") {
    throw new Error("Unauthorized");
  }

  const funderId = session.user.id;

  const existingEntry = await prisma.pipelineEntry.findUnique({
    where: {
      funderId_entrepreneurId: {
        funderId,
        entrepreneurId,
      },
    },
  });

  if (!existingEntry) {
    const currentCount = await prisma.pipelineEntry.count({
      where: { funderId }
    });

    const limitCheck = await checkLimitAndWarn(funderId, "maxDeals", currentCount);
    if (!limitCheck.ok) {
      throw new Error(limitCheck.message || "Upgrade required to add more deals.");
    }
  }

  await prisma.pipelineEntry.upsert({
    where: {
      funderId_entrepreneurId: {
        funderId,
        entrepreneurId,
      },
    },
    update: {
      stage: newStage,
    },
    create: {
      funderId,
      entrepreneurId,
      stage: newStage,
      capital: "Funding need to be confirmed",
      nextStep: "Review fit and move to next stage when ready.",
    },
  });

  revalidatePath("/portal/funder/pipeline");
  revalidatePath("/portal/funder");
  return { success: true };
}
