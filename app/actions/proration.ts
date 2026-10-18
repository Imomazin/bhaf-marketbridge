"use server";

import { auth } from "@/auth";
import { prisma } from "@/lib/db";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2024-06-20" as any,
});

export async function getProrationQuote(planId: string, billingCycle: "month" | "year") {
  try {
    const session = await auth();
    if (!session?.user) return { ok: false, message: "Unauthorized" };

    const user = await prisma.user.findUnique({ where: { id: session.user.id } });
    if (!user) return { ok: false, message: "Unauthorized" };

    const plan = await prisma.subscriptionPlan.findUnique({ where: { id: planId } });
    if (!plan) return { ok: false, message: "Plan not found." };

    const activeSub = await prisma.subscription.findFirst({
      where: { userId: user.id, status: "ACTIVE" },
      orderBy: { createdAt: "desc" }
    });

    if (!activeSub || !activeSub.providerSubscriptionId || !activeSub.providerCustomerId) {
      return { ok: false, message: "No active stripe subscription to prorate against." };
    }

    const priceId = billingCycle === "year" ? plan.stripeYearlyPriceId : plan.stripePriceId;
    if (!priceId) {
      // If no price ID, it might be a free plan or misconfigured.
      return { ok: false, message: "Plan is not configured for payments." };
    }

    const stripeSub = await stripe.subscriptions.retrieve(activeSub.providerSubscriptionId);
    if (!stripeSub.items.data.length) {
      return { ok: false, message: "Invalid subscription state." };
    }
    const currentItemId = stripeSub.items.data[0].id;

    const upcomingInvoice = await stripe.invoices.createPreview({
      customer: activeSub.providerCustomerId,
      subscription: activeSub.providerSubscriptionId,
      subscription_details: {
        items: [
          {
            id: currentItemId,
            price: priceId,
          },
        ],
      }
    });

    const prorationLineItems = upcomingInvoice.lines.data.filter((item: any) => item.proration);
    const amountDueCents = prorationLineItems.reduce((total: number, item: any) => total + item.amount, 0);

    // If the difference is negative (downgrade), or zero, we return 0.
    return { ok: true, amountDueCents: Math.max(0, amountDueCents) };
  } catch (error: any) {
    console.error("Error fetching proration quote:", error);
    return { ok: false, message: error.message || "Failed to calculate upgrade cost." };
  }
}
