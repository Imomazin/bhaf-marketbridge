import { prisma, DB_ENABLED } from "@/lib/db";
import { sendEmail } from "@/lib/email";
import { writeAudit } from "@/lib/audit";
import { isAuthorizedCron } from "@/lib/cron";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/**
 * Daily artefact expiry sweep.
 *
 * - Flips status to EXPIRES_SOON for artefacts expiring within 14 days
 * - Flips status to EXPIRED past the expiry date
 * - Notifies the owner once per transition
 *
 * Scheduled by vercel.json at 07:00 UTC daily.
 */
export async function GET(req: Request) {
  if (!isAuthorizedCron(req)) return new Response("forbidden", { status: 403 });
  if (!DB_ENABLED || !prisma) return Response.json({ ok: false, reason: "db_not_configured" });

  const now = new Date();
  const in14 = new Date(now.getTime() + 14 * 24 * 60 * 60 * 1000);

  // EXPIRES_SOON sweep
  const expiringSoon = await prisma.artefact.findMany({
    where: {
      status: "VALIDATED",
      expiresAt: { not: null, lte: in14, gt: now },
    },
    include: { user: { select: { id: true, email: true, name: true } } },
    take: 200,
  });
  for (const a of expiringSoon) {
    await prisma.artefact.update({
      where: { id: a.id },
      data: { status: "EXPIRES_SOON" },
    });
    await prisma.notification.create({
      data: {
        userId: a.userId,
        kind: "ARTEFACT_EXPIRES_SOON",
        title: `${a.name} expires on ${a.expiresAt?.toISOString().slice(0, 10)}`,
        body: "Renew it now to keep your verified status.",
        link: "/portal/entrepreneur",
      },
    });
    if (a.user.email) {
      await sendEmail({
        to: a.user.email,
        subject: `Action needed: ${a.name} expires soon`,
        body: `Hi ${a.user.name ?? "there"},\n\nYour artefact "${a.name}" expires on ${a.expiresAt?.toISOString().slice(0, 10)}. Renew it from your workspace to keep your verified status.\n\n— BHAF MarketBridge`,
      });
    }
  }

  // EXPIRED sweep
  const expired = await prisma.artefact.findMany({
    where: {
      status: { in: ["VALIDATED", "EXPIRES_SOON"] },
      expiresAt: { not: null, lte: now },
    },
    include: { user: { select: { id: true, email: true, name: true } } },
    take: 200,
  });
  for (const a of expired) {
    await prisma.artefact.update({ where: { id: a.id }, data: { status: "EXPIRED" } });
    await prisma.notification.create({
      data: {
        userId: a.userId,
        kind: "ARTEFACT_EXPIRES_SOON",
        title: `${a.name} has expired`,
        body: "Re-upload to restore your verified status.",
        link: "/portal/entrepreneur",
      },
    });
  }

  await writeAudit({
    actorLabel: "cron · artefact-expiry",
    action: `Swept ${expiringSoon.length} expiring soon · ${expired.length} expired`,
  });

  return Response.json({
    ok: true,
    expiringSoon: expiringSoon.length,
    expired: expired.length,
  });
}
