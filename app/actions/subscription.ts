"use server";

import { stripe } from "@/lib/stripe";
import { prisma } from "@/lib/db";
import { auth as getUserSession } from "@/auth";
import { headers } from "next/headers";
import { sendEmail } from "@/lib/email";

// Creates an embedded checkout session for a specific plan
export async function createCheckoutSession(planId: string, billingCycle: "month" | "year" = "month") {
  const session = await getUserSession();
  if (!session?.user) {
    return { ok: false, message: "Unauthorized" };
  }

  const plan = await prisma.subscriptionPlan.findUnique({
    where: { id: planId },
  });

  if (!plan) {
    return { ok: false, message: "Invalid plan." };
  }

  const priceId = billingCycle === "year" ? plan.stripeYearlyPriceId : plan.stripePriceId;

  if (!priceId) {
    return { ok: false, message: `Missing Stripe price ID for ${billingCycle}ly billing.` };
  }

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
  });

  if (!user) return { ok: false, message: "User not found" };

  try {
    let customerId = null;
    
    // Check if the user already has an active subscription with a customer ID
    const activeSub = await prisma.subscription.findFirst({
      where: { userId: user.id, status: "ACTIVE" }
    });
    if (activeSub?.providerCustomerId) {
      customerId = activeSub.providerCustomerId;
    }

    const reqHeaders = await headers();
    const origin = reqHeaders.get("origin") || process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";

    // If the plan is Free (0 Cents), fulfill instantly without checkout.
    const planPriceCents = billingCycle === "year" ? plan.yearlyPriceCents : plan.monthlyPriceCents;
    if (planPriceCents === 0) {
      if (activeSub) {
        if (activeSub.providerSubscriptionId && activeSub.planId === plan.id && activeSub.cancelAtPeriodEnd) {
           // They are just resuming the exact same cancelled Free plan (unlikely but possible)
           await stripe.subscriptions.update(activeSub.providerSubscriptionId, { cancel_at_period_end: false });
           await prisma.subscription.update({ where: { id: activeSub.id }, data: { cancelAtPeriodEnd: false } });
           return { ok: true, url: null, message: "Subscription resumed!" };
        }
        
        // Otherwise they are downgrading to FREE or switching Free plans
        await prisma.subscription.update({
          where: { id: activeSub.id },
          data: { status: "CANCELED", canceledAt: new Date(), cancelAtPeriodEnd: true }
        });
        
        if (activeSub.providerSubscriptionId) {
           await stripe.subscriptions.update(activeSub.providerSubscriptionId, { cancel_at_period_end: true });
        }
      }

      // Create new subscription in our DB (Stripe will just stay cancelled if Free)
      await prisma.subscription.create({
        data: {
          userId: user.id,
          planId: plan.id,
          plan: plan.name,
          amountUsdCents: planPriceCents || 0,
          provider: "STRIPE",
          status: "ACTIVE",
          providerCustomerId: customerId,
        }
      });
      return { ok: true, url: null, message: "Plan switched successfully!" };
    }

    // If the user already has an active Stripe subscription, update it directly to prorate the difference!
    if (activeSub?.providerSubscriptionId) {
      try {
        const stripeSub = await stripe.subscriptions.retrieve(activeSub.providerSubscriptionId);
        if (stripeSub.items.data.length > 0) {
          const itemId = stripeSub.items.data[0].id;
          
          await stripe.subscriptions.update(activeSub.providerSubscriptionId, {
            items: [{
              id: itemId,
              price: priceId,
            }],
            proration_behavior: 'create_prorations',
            cancel_at_period_end: false,
          });

          // Generate an invoice immediately for the prorated difference
          let invoice;
          try {
            invoice = await stripe.invoices.create({
              customer: customerId ?? undefined,
              subscription: activeSub.providerSubscriptionId,
              description: `Prorated upgrade to ${plan.name}`,
            });

            // Attempt to pay it immediately using the default payment method on the customer
            invoice = await stripe.invoices.pay(invoice.id);
          } catch (e) {
            console.error("Error generating or paying invoice:", e);
            // We will handle the failure below
          }

          if (invoice && invoice.status !== 'paid' && invoice.amount_due > 0) {
            // Payment failed! Rollback the subscription update
            console.warn("Payment failed, rolling back subscription update.");
            await stripe.subscriptions.update(activeSub.providerSubscriptionId, {
              items: [{
                id: itemId,
                price: stripeSub.items.data[0].price.id, // Revert to original price
              }],
              proration_behavior: 'none', // Don't create reverse prorations, just revert
            });
            // Void the invoice so it doesn't stay open
            await stripe.invoices.voidInvoice(invoice.id);
            return { ok: false, message: "Payment failed. Please update your payment method and try again." };
          }

          // Payment succeeded (or amount was 0)! Update our database
          await prisma.subscription.update({
            where: { id: activeSub.id },
            data: {
              planId: plan.id,
              plan: plan.name,
              amountUsdCents: planPriceCents || 0,
              cancelAtPeriodEnd: false,
            }
          });

          return { ok: true, url: null, message: "Subscription upgraded successfully!" };
        }
      } catch (err) {
        console.error("Error upgrading subscription via API:", err);
        // Fall back to checkout if API update fails for some reason
      }
    }

    // Otherwise, they are a new subscriber, send them to Checkout
    if (!customerId) {
      const customer = await stripe.customers.create({
        email: user.email,
        name: user.name ?? undefined,
        metadata: {
          userId: user.id,
        },
      });
      customerId = customer.id;
    } else {
      // Clear any pending customer balance (e.g. from previous prorations) so it doesn't show up on the checkout page
      await stripe.customers.update(customerId, { balance: 0 });
    }

    const checkoutSession = await stripe.checkout.sessions.create({
      ui_mode: "hosted",
      customer: customerId ?? undefined,
      customer_email: customerId ? undefined : user.email,
      mode: "subscription",
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      metadata: {
        userId: user.id,
        planId: plan.id,
      },
      success_url: `${origin}/account/billing?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${origin}/account/billing`,
    });

    return { ok: true, url: checkoutSession.url };
  } catch (error: any) {
    console.error("Error creating checkout session:", error);
    return { ok: false, message: error.message || "Failed to create checkout session." };
  }
}

export async function getSubscriptionPlans() {
  const session = await getUserSession();
  if (!session?.user) return [];

  const plans = await prisma.subscriptionPlan.findMany({
    where: {
      isActive: true,
      OR: [
        { role: "ALL" },
        { role: session.user.role },
      ],
    },
    orderBy: {
      monthlyPriceCents: "asc",
    },
  });

  return plans;
}

export async function getCheckoutSessionStatus(sessionId: string) {
  try {
    const session = await stripe.checkout.sessions.retrieve(sessionId);
    return {
      status: session.status,
      customer_email: session.customer_details?.email,
    };
  } catch (error) {
    console.error("Error retrieving checkout session:", error);
    return { status: null };
  }
}

export async function verifyAndFulfillSession(sessionId: string) {
  const userSession = await getUserSession();
  if (!userSession?.user) return { ok: false };

  try {
    const session = await stripe.checkout.sessions.retrieve(sessionId);
    
    // Check if payment was successful
    if (session.status !== "complete" && session.payment_status !== "paid") {
      return { ok: false, message: "Payment not complete." };
    }

    const userId = session.metadata?.userId;
    const planId = session.metadata?.planId;

    if (!userId || !planId) return { ok: false, message: "Missing metadata." };

    // Find the plan
    const plan = await prisma.subscriptionPlan.findUnique({ where: { id: planId } });
    if (!plan) return { ok: false, message: "Plan not found." };

    // Check if we already created a subscription for this session
    const existingSub = await prisma.subscription.findFirst({
      where: {
        userId,
        providerSubscriptionId: session.subscription as string,
      }
    });

    if (existingSub) {
      // Already fulfilled
      return { ok: true, message: "Already fulfilled" };
    }

    // Otherwise, fulfill it manually!
    const activeSub = await prisma.subscription.findFirst({
      where: { userId, status: "ACTIVE" }
    });

    if (activeSub) {
      await prisma.subscription.update({
        where: { id: activeSub.id },
        data: { status: "CANCELED", canceledAt: new Date() }
      });
      
      // Physically cancel the old subscription on Stripe so they don't get double billed!
      if (activeSub.providerSubscriptionId) {
        try {
          await stripe.subscriptions.cancel(activeSub.providerSubscriptionId);
        } catch (e) {
          console.error("Failed to cancel old stripe subscription:", e);
        }
      }
    }

    await prisma.subscription.create({
      data: {
        userId,
        planId: plan.id,
        plan: plan.name,
        amountUsdCents: session.amount_total || 0,
        provider: "STRIPE",
        providerSubscriptionId: session.subscription as string,
        providerCustomerId: session.customer as string,
        status: "ACTIVE",
      }
    });

    const dbUser = await prisma.user.findUnique({ where: { id: userId } });
    if (dbUser) {
      // Notify User
      await sendEmail({
        to: dbUser.email,
        subject: `Subscription Upgraded to ${plan.name}`,
        body: `Hi ${dbUser.name},\n\nYour subscription has been successfully upgraded to the ${plan.name} plan.\n\nThank you for your business!`,
      });
      
      // Notify Admin
      const admins = await prisma.user.findMany({ where: { role: "ADMIN" } });
      for (const admin of admins) {
        await sendEmail({
          to: admin.email,
          subject: `User Upgraded: ${dbUser.email}`,
          body: `User ${dbUser.email} has upgraded to the ${plan.name} plan.`,
        });
      }
    }

    return { ok: true, message: "Subscription fulfilled." };
  } catch (error) {
    console.error("Error fulfilling session:", error);
    return { ok: false };
  }
}

export async function createCustomerPortalSession() {
  const session = await getUserSession();
  if (!session?.user) return { ok: false, message: "Unauthorized" };

  try {
    const user = await prisma.user.findUnique({ where: { id: session.user.id } });
    if (!user) return { ok: false, message: "Unauthorized" };

    let customerId = null;

    const activeSub = await prisma.subscription.findFirst({
      where: { userId: user.id, status: "ACTIVE" }
    });
    
    if (activeSub?.providerCustomerId) {
      customerId = activeSub.providerCustomerId;
    }

    if (!customerId) {
      return { ok: false, message: "No billing profile found." };
    }

    const reqHeaders = await headers();
    const origin = reqHeaders.get("origin") || process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";

    const portalSession = await stripe.billingPortal.sessions.create({
      customer: customerId,
      return_url: `${origin}/account/billing`,
    });

    return { ok: true, url: portalSession.url };
  } catch (error: any) {
    console.error("Error creating portal session:", error);
    return { ok: false, message: error.message || "Failed to create customer portal session." };
  }
}
