import { prisma, DB_ENABLED } from "@/lib/db";
import { sendEmail } from "@/lib/email";
import { writeAudit } from "@/lib/audit";
import { isAuthorizedCron } from "@/lib/cron";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/**
 * Daily subscription sweep.
 * - Subscriptions whose currentPeriodEnd is within 7 days get a
 *   reminder email.
 * - Subscriptions whose currentPeriodEnd has passed AND cancelAtPeriodEnd
 *   is true get flipped to CANCELED.
 * - Subscriptions whose currentPeriodEnd has passed AND
 *   cancelAtPeriodEnd is false get flipped to PAST_DUE (await webhook
 *   resolution from the payment provider).
 */
export async function GET(req: Request) {
  if (!isAuthorizedCron(req)) return new Response("forbidden", { status: 403 });
  if (!DB_ENABLED || !prisma) return Response.json({ ok: false, reason: "db_not_configured" });

  const now = new Date();
  const in7 = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);

  // Reminders
  const expiringSoon = await prisma.subscription.findMany({
    where: { status: "ACTIVE", currentPeriodEnd: { not: null, lte: in7, gt: now } },
    include: { user: { select: { name: true, email: true } } },
  });
  let reminders = 0;
  for (const s of expiringSoon) {
    if (s.user.email) {
      await sendEmail({
        to: s.user.email,
        subject: `Heads up: ${s.plan} renews on ${s.currentPeriodEnd?.toISOString().slice(0, 10)}`,
        body: `Hi ${s.user.name ?? "there"},\n\nYour ${s.plan} subscription renews on ${s.currentPeriodEnd?.toISOString().slice(0, 10)}.\n\nManage at /billing/dashboard.\n\n— BHAF MarketBridge`,
      });
      reminders++;
    }
  }

  // Past-due / cancellations
  const overdue = await prisma.subscription.findMany({
    where: { status: "ACTIVE", currentPeriodEnd: { not: null, lte: now } },
  });
  let canceled = 0;
  let pastDue = 0;
  for (const s of overdue) {
    if (s.cancelAtPeriodEnd) {
      await prisma.subscription.update({ where: { id: s.id }, data: { status: "CANCELED" } });
      canceled++;
    } else {
      await prisma.subscription.update({ where: { id: s.id }, data: { status: "PAST_DUE" } });
      pastDue++;
    }
  }

  await writeAudit({
    actorLabel: "cron · subscription-renewal",
    action: `Reminders ${reminders} · canceled ${canceled} · past-due ${pastDue}`,
  });

  return Response.json({ ok: true, reminders, canceled, pastDue });
}
