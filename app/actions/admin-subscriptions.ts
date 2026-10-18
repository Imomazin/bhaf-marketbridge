"use server";

import { prisma } from "@/lib/db";
import { auth as getUserSession } from "@/auth";
import { revalidatePath } from "next/cache";

import { stripe } from "@/lib/stripe";

export async function getAdminSubscriptionPlans() {
  const session = await getUserSession();
  if (!session?.user || session.user.role !== "ADMIN") {
    return { ok: false, message: "Unauthorized", data: [] };
  }
  const plans = await prisma.subscriptionPlan.findMany({
    orderBy: { createdAt: "asc" }
  });
  return { ok: true, data: plans };
}

export async function createSubscriptionPlan(data: {
  name: string;
  tier: string;
  role: string;
  monthlyPriceCents: number;
  yearlyPriceCents?: number;
  stripePriceId?: string;
  stripeYearlyPriceId?: string;
  features: string; // JSON string
  isActive?: boolean;
}) {
  const session = await getUserSession();
  if (!session?.user || session.user.role !== "ADMIN") {
    return { ok: false, message: "Unauthorized" };
  }

  let featuresObj = {};
  try {
    featuresObj = JSON.parse(data.features);
  } catch (e) {
    return { ok: false, message: "Features must be valid JSON." };
  }

  try {
    let finalStripePriceId = data.stripePriceId || null;
    let finalStripeYearlyPriceId = data.stripeYearlyPriceId || null;

    // Automatically create a Stripe Product and Price if it's a paid plan
    if ((data.monthlyPriceCents > 0 || (data.yearlyPriceCents && data.yearlyPriceCents > 0)) && (!finalStripePriceId || (!finalStripeYearlyPriceId && data.yearlyPriceCents))) {
      const product = await stripe.products.create({
        name: `${data.name} (${data.role})`,
        description: `Tier: ${data.tier}`,
      });

      if (data.monthlyPriceCents > 0 && !finalStripePriceId) {
        const price = await stripe.prices.create({
          product: product.id,
          unit_amount: data.monthlyPriceCents,
          currency: 'ngn',
          recurring: { interval: 'month' },
        });
        finalStripePriceId = price.id;
      }

      if (data.yearlyPriceCents && data.yearlyPriceCents > 0 && !finalStripeYearlyPriceId) {
        const yearlyPrice = await stripe.prices.create({
          product: product.id,
          unit_amount: data.yearlyPriceCents,
          currency: 'ngn',
          recurring: { interval: 'year' },
        });
        finalStripeYearlyPriceId = yearlyPrice.id;
      }
    }

    await prisma.subscriptionPlan.create({
      data: {
        name: data.name,
        tier: data.tier,
        role: data.role,
        monthlyPriceCents: data.monthlyPriceCents,
        yearlyPriceCents: data.yearlyPriceCents || null,
        stripePriceId: finalStripePriceId,
        stripeYearlyPriceId: finalStripeYearlyPriceId,
        features: featuresObj,
        isActive: data.isActive ?? true,
      }
    });
    revalidatePath("/admin/subscriptions");
    return { ok: true, message: "Plan created." };
  } catch (error: any) {
    return { ok: false, message: error.message };
  }
}

export async function updateSubscriptionPlan(id: string, data: {
  name: string;
  tier: string;
  role: string;
  monthlyPriceCents: number;
  yearlyPriceCents?: number;
  stripePriceId?: string;
  stripeYearlyPriceId?: string;
  features: string; // JSON string
  isActive: boolean;
}) {
  const session = await getUserSession();
  if (!session?.user || session.user.role !== "ADMIN") {
    return { ok: false, message: "Unauthorized" };
  }

  let featuresObj = {};
  try {
    featuresObj = JSON.parse(data.features);
  } catch (e) {
    return { ok: false, message: "Features must be valid JSON." };
  }

  try {
    const existingPlan = await prisma.subscriptionPlan.findUnique({ where: { id } });
    let finalStripePriceId = data.stripePriceId || null;
    let finalStripeYearlyPriceId = data.stripeYearlyPriceId || null;

    // We create a new product if prices changed or were missing
    const needsNewMonthly = data.monthlyPriceCents > 0 && (!finalStripePriceId || (existingPlan && existingPlan.monthlyPriceCents !== data.monthlyPriceCents));
    const needsNewYearly = data.yearlyPriceCents && data.yearlyPriceCents > 0 && (!finalStripeYearlyPriceId || (existingPlan && existingPlan.yearlyPriceCents !== data.yearlyPriceCents));

    if (needsNewMonthly || needsNewYearly) {
       const product = await stripe.products.create({
        name: `${data.name} (${data.role})`,
        description: `Tier: ${data.tier}`,
      });

      if (needsNewMonthly) {
        const price = await stripe.prices.create({
          product: product.id,
          unit_amount: data.monthlyPriceCents,
          currency: 'ngn',
          recurring: { interval: 'month' },
        });
        finalStripePriceId = price.id;
      }
      if (needsNewYearly && data.yearlyPriceCents) {
        const yearlyPrice = await stripe.prices.create({
          product: product.id,
          unit_amount: data.yearlyPriceCents,
          currency: 'ngn',
          recurring: { interval: 'year' },
        });
        finalStripeYearlyPriceId = yearlyPrice.id;
      }
    }
    
    if (data.monthlyPriceCents === 0) finalStripePriceId = null;
    if (!data.yearlyPriceCents || data.yearlyPriceCents === 0) finalStripeYearlyPriceId = null;

    await prisma.subscriptionPlan.update({
      where: { id },
      data: {
        name: data.name,
        tier: data.tier,
        role: data.role,
        monthlyPriceCents: data.monthlyPriceCents,
        yearlyPriceCents: data.yearlyPriceCents || null,
        stripePriceId: finalStripePriceId,
        stripeYearlyPriceId: finalStripeYearlyPriceId,
        features: featuresObj,
        isActive: data.isActive,
      }
    });
    revalidatePath("/admin/subscriptions");
    return { ok: true, message: "Plan updated." };
  } catch (error: any) {
    return { ok: false, message: error.message };
  }
}

export async function deleteSubscriptionPlan(id: string) {
  const session = await getUserSession();
  if (!session?.user || session.user.role !== "ADMIN") {
    return { ok: false, message: "Unauthorized" };
  }

  try {
    // Check if anyone is using this plan
    const activeUsers = await prisma.subscription.count({
      where: { planId: id }
    });

    if (activeUsers > 0) {
      return { ok: false, message: "Cannot delete plan: There are active users on this plan." };
    }

    await prisma.subscriptionPlan.delete({
      where: { id }
    });
    
    revalidatePath("/admin/subscriptions");
    return { ok: true, message: "Plan deleted." };
  } catch (error: any) {
    return { ok: false, message: error.message };
  }
}

export async function getAdminSubscribers() {
  const session = await getUserSession();
  if (!session?.user || session.user.role !== "ADMIN") {
    return { ok: false, message: "Unauthorized", data: [] };
  }

  try {
    const subscribers = await prisma.subscription.findMany({
      include: {
        user: {
          select: {
            name: true,
            email: true,
            role: true,
          }
        },
        subscriptionPlan: {
          select: {
            name: true,
            monthlyPriceCents: true,
            yearlyPriceCents: true,
          }
        }
      },
      orderBy: {
        createdAt: "desc"
      }
    });

    return { ok: true, data: subscribers };
  } catch (error: any) {
    return { ok: false, message: error.message, data: [] };
  }
}
