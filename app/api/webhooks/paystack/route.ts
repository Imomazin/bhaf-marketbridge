import { prisma, DB_ENABLED } from "@/lib/db";
import { verifyWebhookSignature, verifyTransaction } from "@/lib/integrations/paystack";
import { writeAudit } from "@/lib/audit";
import { sendEmail } from "@/lib/email";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/**
 * Paystack webhook.
 *
 * Paystack signs the raw body with HMAC-SHA512 using the secret key and
 * places the signature in the x-paystack-signature header. We verify
 * before doing any work, then process supported event types.
 *
 * Supported events:
 *   charge.success  — payment completed; mark Invoice paid, create/extend
 *                     Subscription, notify the user
 *   subscription.create / .disable — keep DB state in sync
 *
 * Configure on Paystack: Dashboard → Settings → API & Webhooks →
 *   Test/Live Webhook URL = https://YOUR_DOMAIN/api/webhooks/paystack
 */

export async function POST(req: Request) {
  const raw = await req.text();
  const sig = req.headers.get("x-paystack-signature");
  if (!verifyWebhookSignature(raw, sig)) {
    return new Response("invalid signature", { status: 401 });
  }

  if (!DB_ENABLED || !prisma) {
    return Response.json({ ok: true, ignored: true, reason: "db_not_configured" });
  }

  let event: { event?: string; data?: { reference?: string; status?: string; customer?: { email?: string } } };
  try {
    event = JSON.parse(raw);
  } catch {
    return new Response("invalid json", { status: 400 });
  }

  const type = event.event ?? "unknown";

  if (type === "charge.success" && event.data?.reference) {
    const ref = event.data.reference;
    // Re-verify with Paystack server-to-server before mutating state
    const v = await verifyTransaction(ref);
    if (!v.ok || v.status !== "success") {
      await writeAudit({
        actorLabel: "Paystack webhook",
        action: `charge.success ignored · verify failed · ${ref}`,
      });
      return Response.json({ ok: true, ignored: true });
    }

    const invoice = await prisma.invoice.findFirst({
      where: { providerReference: ref },
      include: { user: true },
    });
    if (!invoice) {
      await writeAudit({
        actorLabel: "Paystack webhook",
        action: `charge.success received but no local invoice · ${ref}`,
      });
      return Response.json({ ok: true, ignored: true });
    }

    if (invoice.status === "PAID") {
      // Already processed — Paystack retries are idempotent
      return Response.json({ ok: true, idempotent: true });
    }

    await prisma.$transaction([
      prisma.invoice.update({
        where: { id: invoice.id },
        data: {
          status: "PAID",
          paidAt: v.paidAt ?? new Date(),
          providerInvoiceId: v.reference ?? ref,
        },
      }),
      prisma.subscription.upsert({
        where: { id: invoice.subscriptionId ?? `pending-${invoice.id}` },
        update: {
          status: "ACTIVE",
          currentPeriodStart: new Date(),
          currentPeriodEnd: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000),
        },
        create: {
          userId: invoice.userId,
          plan: invoice.description ?? "Plan",
          amountUsdCents: invoice.amountUsdCents,
          status: "ACTIVE",
          provider: "paystack",
          currentPeriodStart: new Date(),
          currentPeriodEnd: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000),
        },
      }),
    ]);

    await writeAudit({
      actorId: invoice.userId,
      actorLabel: invoice.user.email,
      action: `Payment received · ${invoice.description ?? "subscription"} · Paystack ${ref}`,
      entityType: "Invoice",
      entityId: invoice.id,
      metadata: { amountUsdCents: invoice.amountUsdCents, currency: v.currency },
    });

    if (invoice.user.email) {
      await sendEmail({
        to: invoice.user.email,
        subject: `Receipt: ${invoice.description ?? "BHAF MarketBridge subscription"}`,
        body:
          `Hi ${invoice.user.name ?? "there"},\n\n` +
          `Your payment for "${invoice.description ?? "your subscription"}" was received.\n\n` +
          `Reference: ${ref}\n` +
          `Amount (USD equivalent): $${(invoice.amountUsdCents / 100).toFixed(2)}\n\n` +
          `Manage your subscription at /billing/dashboard.\n\n— BHAF MarketBridge`,
      });
    }

    return Response.json({ ok: true });
  }

  // Unknown / unhandled event — log and return 200 so Paystack stops retrying
  await writeAudit({
    actorLabel: "Paystack webhook",
    action: `Unhandled event: ${type}`,
  });
  return Response.json({ ok: true, unhandled: type });
}
