"use server";

import { auth, signOut } from "@/auth";
import { prisma, DB_ENABLED } from "@/lib/db";
import { writeAudit } from "@/lib/audit";
import { getDemoUserById } from "@/lib/demoUsers";
import { deleteDemoUserState, exportDemoUserState } from "@/lib/demoState";
import { removeDemoRegisteredUser } from "@/lib/demoRegistrations";

export interface AccountActionResult {
  ok: boolean;
  message: string;
  data?: unknown;
}

/**
 * GDPR Article 20 — right to data portability.
 * Returns the user's full record set as a JSON-serialisable object.
 */
export async function exportMyData(): Promise<AccountActionResult> {
  const session = await auth();
  if (!session?.user) return { ok: false, message: "Sign-in required." };

  if (!DB_ENABLED || !prisma) {
    const user = await getDemoUserById(session.user.id);
    return {
      ok: true,
      message: "Data export prepared.",
      data: {
        user,
        ...(await exportDemoUserState(session.user.id)),
      },
    };
  }

  const userId = session.user.id;
  const user = await prisma.user.findUnique({
    where: { id: userId },
    include: {
      entrepreneurProfile: { include: { products: true, certifications: true } },
      funderProfile: true,
      corporateProfile: true,
      artefacts: { include: { checks: true, reviews: true } },
      listings: true,
      notifications: true,
    },
  });
  if (!user) return { ok: false, message: "Account not found." };

  await writeAudit({
    actorId: userId,
    actorLabel: user.email,
    action: "Exported personal data (GDPR Art. 20)",
    entityType: "User",
    entityId: userId,
  });

  // Strip sensitive fields from the export
  const { passwordHash: _hash, ...safeUser } = user;
  void _hash;
  return { ok: true, message: "Data export prepared.", data: safeUser };
}

/**
 * GDPR Article 17 — right to erasure.
 * Soft-deletes the account immediately; the cron job then hard-deletes
 * after the cooling-off period (handled outside this function).
 */
export async function requestAccountDeletion(): Promise<AccountActionResult> {
  const session = await auth();
  if (!session?.user) return { ok: false, message: "Sign-in required." };

  if (!DB_ENABLED || !prisma) {
    const user = await getDemoUserById(session.user.id);
    if (!user || user.source !== "registered") {
      return { ok: false, message: "Seeded demo accounts cannot be deleted." };
    }

    await deleteDemoUserState(session.user.id);
    await removeDemoRegisteredUser(session.user.id);
    await signOut({ redirect: false });
    return { ok: true, message: "Account deleted from this demo browser session. You've been signed out." };
  }

  await prisma.user.update({
    where: { id: session.user.id },
    data: {
      status: "DELETED",
      deletedAt: new Date(),
      email: `deleted+${session.user.id}@bhaf.invalid`,
      name: "Deleted account",
      passwordHash: null,
    },
  });

  await writeAudit({
    actorId: session.user.id,
    actorLabel: session.user.email ?? session.user.id,
    action: "Requested account deletion (GDPR Art. 17)",
    entityType: "User",
    entityId: session.user.id,
  });

  await signOut({ redirect: false });
  return { ok: true, message: "Account marked for deletion. You've been signed out." };
}
