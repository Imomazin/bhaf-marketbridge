import { prisma, DB_ENABLED } from "@/lib/db";
import type { AppRole } from "@/lib/routeAccess";

type SessionUserLike = {
  id: string;
  role?: AppRole | null;
  status?: "ACTIVE" | "SUSPENDED" | "PENDING_VERIFICATION" | "DELETED";
};

export async function resolveUserAccess(user: SessionUserLike) {
  if (!DB_ENABLED || !prisma) {
    return {
      role: user.role ?? null,
      status: user.status ?? "ACTIVE",
      needsVerification: user.status === "PENDING_VERIFICATION",
    };
  }

  const current = await prisma.user.findUnique({
    where: { id: user.id },
    select: { role: true, status: true, emailVerified: true },
  });

  if (!current) {
    return {
      role: user.role ?? null,
      status: "DELETED" as const,
      needsVerification: false,
    };
  }

  return {
    role: current.role,
    status: current.status,
    needsVerification: !current.emailVerified || current.status === "PENDING_VERIFICATION",
  };
}
