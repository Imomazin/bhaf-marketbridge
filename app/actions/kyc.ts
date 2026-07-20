"use server";

import { auth } from "@/auth";
import { prisma, DB_ENABLED } from "@/lib/db";
import { writeAudit } from "@/lib/audit";
import { verifyIdentity } from "@/lib/integrations/smileId";
import { revalidatePath } from "next/cache";

export interface KycActionResult {
  ok: boolean;
  message: string;
  status?: string;
  ref?: string;
}

export async function runKycCheck(input: {
  fullName: string;
  country: string;
  idType?: string;
  idNumber?: string;
}): Promise<KycActionResult> {
  const session = await auth();
  if (!session?.user) return { ok: false, message: "Sign-in required." };

  if (!DB_ENABLED || !prisma) {
    if (!input.fullName.trim() || !input.idNumber?.trim()) {
      return { ok: false, message: "Enter the legal name and ID number first." };
    }

    const cleanId = input.idNumber.replace(/\s+/g, "");
    const status = cleanId.length >= 6 ? "PASS" : "WARN";
    revalidatePath("/settings");
    return {
      ok: true,
      status,
      ref: `demo-kyc-${cleanId.slice(-4).padStart(4, "0")}`,
      message:
        status === "PASS"
          ? "Identity details matched the demo verification checks."
          : "The demo check completed, but this record would normally need manual review.",
    };
  }

  const result = await verifyIdentity({
    userId: session.user.id,
    fullName: input.fullName,
    country: input.country,
    idType: input.idType,
    idNumber: input.idNumber,
  });

  await writeAudit({
    actorId: session.user.id,
    actorLabel: session.user.email ?? session.user.id,
    action: `KYC check · ${result.status} · ${result.rawProvider}`,
    entityType: "User",
    entityId: session.user.id,
    metadata: { ref: result.ref ?? null, message: result.message },
  });

  // Write a notification so the result lands in the user's inbox
  await prisma.notification.create({
    data: {
      userId: session.user.id,
      kind: result.status === "PASS" ? "PROFILE_VERIFIED" : "GENERIC",
      title: `KYC check · ${result.status}`,
      body: result.message + (result.ref ? ` (ref ${result.ref})` : ""),
      link: "/settings",
    },
  });

  revalidatePath("/settings");
  return {
    ok: true,
    message: result.message,
    status: result.status,
    ref: result.ref,
  };
}
