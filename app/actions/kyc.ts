"use server";

import { auth } from "@/auth";
import { prisma, DB_ENABLED } from "@/lib/db";
import { writeAudit } from "@/lib/audit";
import { revalidatePath } from "next/cache";

export interface KycActionResult {
  ok: boolean;
  message: string;
}

export async function saveKycDetails(input: {
  fullName: string;
  country: string;
  idType?: string;
  idNumber?: string;
}): Promise<KycActionResult> {
  const session = await auth();
  if (!session?.user) return { ok: false, message: "Sign-in required." };

  const fullName = input.fullName.trim();
  const country = input.country.trim();
  const idType = input.idType?.trim() ?? "";
  const idNumber = input.idNumber?.trim() ?? "";

  if (!fullName || !country || !idType || !idNumber) {
    return { ok: false, message: "Complete all KYC fields before saving." };
  }

  if (!DB_ENABLED || !prisma) {
    revalidatePath("/settings");
    return { ok: true, message: "KYC details saved." };
  }

  await prisma.user.update({
    where: { id: session.user.id },
    data: {
      kycFullName: fullName,
      kycCountry: country,
      kycIdType: idType,
      kycIdNumber: idNumber,
      kycSavedAt: new Date(),
    },
  });

  await writeAudit({
    actorId: session.user.id,
    actorLabel: session.user.email ?? session.user.id,
    action: "KYC details saved",
    entityType: "User",
    entityId: session.user.id,
    metadata: { country, idType },
  });

  revalidatePath("/settings");
  return { ok: true, message: "KYC details saved." };
}
