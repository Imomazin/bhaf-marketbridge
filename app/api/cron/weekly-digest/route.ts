import { prisma, DB_ENABLED } from "@/lib/db";
import { sendEmail } from "@/lib/email";
import { writeAudit } from "@/lib/audit";
import { isAuthorizedCron } from "@/lib/cron";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/**
 * Weekly digest — Monday 08:00 UTC.
 * Each user gets a personalised snapshot of last week's platform
 * activity relevant to them.
 */
export async function GET(req: Request) {
  if (!isAuthorizedCron(req)) return new Response("forbidden", { status: 403 });
  if (!DB_ENABLED || !prisma) return Response.json({ ok: false, reason: "db_not_configured" });

  const since = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);

  const users = await prisma.user.findMany({
    where: { status: "ACTIVE", deletedAt: null },
    select: { id: true, name: true, email: true, role: true },
    take: 2000,
  });

  const [opportunityCount, listingCount, rfpCount] = await Promise.all([
    prisma.opportunity.count({ where: { published: true, createdAt: { gte: since } } }),
    prisma.listing.count({ where: { status: "PUBLISHED", publishedAt: { gte: since } } }),
    prisma.rfp.count({ where: { status: "OPEN", createdAt: { gte: since } } }),
  ]);

  let sent = 0;
  for (const u of users) {
    if (!u.email) continue;
    const unread = await prisma.notification.count({
      where: { userId: u.id, read: false, createdAt: { gte: since } },
    });
    const summary = [
      `${opportunityCount} new opportunities`,
      `${listingCount} new marketplace listings`,
      `${rfpCount} new RFPs`,
      `${unread} unread notifications for you`,
    ].join(" · ");

    await sendEmail({
      to: u.email,
      subject: "Your BHAF MarketBridge weekly digest",
      body: `Hi ${u.name ?? "there"},\n\nWeek in review:\n${summary}\n\nOpen your dashboard: /portal\n\n— BHAF MarketBridge`,
    });
    sent++;
  }

  await writeAudit({
    actorLabel: "cron · weekly-digest",
    action: `Digest sent to ${sent} users · opps:${opportunityCount} listings:${listingCount} rfps:${rfpCount}`,
  });

  return Response.json({ ok: true, sent, opportunityCount, listingCount, rfpCount });
}
