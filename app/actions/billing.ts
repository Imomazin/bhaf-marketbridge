"use server";

import { auth } from "@/auth";
import { prisma, DB_ENABLED } from "@/lib/db";
import { writeAudit } from "@/lib/audit";
import { createCheckoutSession, type CheckoutProvider } from "@/lib/integrations/payments";
import { revalidatePath } from "next/cache";

export interface CheckoutActionResult {
  ok: boolean;
  url?: string;
  provider?: CheckoutProvider;
  ref?: string;
  message: string;
}

export async function startCheckout(input: {
  planId: string;
  planName: string;
  amountUsdCents: number;
  preferred?: CheckoutProvider;
}): Promise<CheckoutActionResult> {
  const session = await auth();
  if (!session?.user) return { ok: false, message: "Sign-in required." };

  const email = session.user.email ?? `${session.user.id}@unknown.example`;
  const result = await createCheckoutSession(
    {
      userId: session.user.id,
      email,
      amountUsdCents: input.amountUsdCents,
      description: input.planName,
      plan: "corporate-licence",
    },
    input.preferred,
  );

  if (DB_ENABLED && prisma && result.ok && result.ref) {
    try {
      await prisma.invoice.create({
        data: {
          userId: session.user.id,
          amountUsdCents: input.amountUsdCents,
          currency: "USD",
          provider: result.provider ?? "stub",
          providerReference: result.ref,
          status: "PENDING",
          description: input.planName,
        },
      });
    } catch (err) {
      console.error("[billing] couldn't write pending invoice", err);
    }
  }

  await writeAudit({
    actorId: session.user.id,
    actorLabel: session.user.email ?? session.user.id,
    action: `Checkout started · ${input.planName} · ${result.provider}`,
    entityType: "Plan",
    entityId: input.planId,
    metadata: { ref: result.ref, amountUsdCents: input.amountUsdCents },
  });

  return {
    ok: result.ok,
    url: result.url,
    provider: result.provider,
    ref: result.ref,
    message: result.message,
  };
}

export async function cancelMySubscription(subscriptionId: string): Promise<CheckoutActionResult> {
  const session = await auth();
  if (!session?.user) return { ok: false, message: "Sign-in required." };
  if (!DB_ENABLED || !prisma) return { ok: false, message: "Database not configured." };

  const sub = await prisma.subscription.findUnique({ where: { id: subscriptionId } });
  if (!sub) return { ok: false, message: "Subscription not found." };
  if (sub.userId !== session.user.id) return { ok: false, message: "You can only cancel your own subscriptions." };

  await prisma.subscription.update({
    where: { id: subscriptionId },
    data: { cancelAtPeriodEnd: true, canceledAt: new Date() },
  });

  await writeAudit({
    actorId: session.user.id,
    actorLabel: session.user.email ?? session.user.id,
    action: `Subscription cancelled (period-end) · ${sub.plan}`,
    entityType: "Subscription",
    entityId: sub.id,
  });

  revalidatePath("/billing/dashboard");
  return { ok: true, ref: sub.id, message: "Subscription will cancel at the end of the current period." };
}
