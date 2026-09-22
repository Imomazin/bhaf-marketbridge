import { headers } from "next/headers";
import { NextResponse } from "next/server";
import { stripe } from "@/lib/stripe";
import { prisma } from "@/lib/db";
import Stripe from "stripe";
import { sendEmail } from "@/lib/email";

const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET!;

export async function POST(req: Request) {
  const body = await req.text();
  const signature = (await headers()).get("stripe-signature") as string;

  let event: Stripe.Event;

  try {
    if (!webhookSecret) {
      throw new Error("STRIPE_WEBHOOK_SECRET is not set.");
    }
    event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
  } catch (err: any) {
    console.error("Webhook signature verification failed.", err.message);
    return NextResponse.json({ error: err.message }, { status: 400 });
  }

  try {
    switch (event.type) {
      case "checkout.session.completed": {
        const session = event.data.object as Stripe.Checkout.Session;
        
        if (session.mode === "subscription") {
          const userId = session.metadata?.userId;
          const planId = session.metadata?.planId;
          const subscriptionId = session.subscription as string;
          const customerId = session.customer as string;

          if (userId && planId) {
            const plan = await prisma.subscriptionPlan.findUnique({ where: { id: planId } });
            if (plan) {
              const stripeSub = await stripe.subscriptions.retrieve(subscriptionId);
              
              await prisma.subscription.updateMany({
                where: { userId },
                data: { status: "CANCELED" } // Cancel old ones conceptually, though typically there's only one active
              });

              await prisma.subscription.create({
                data: {
                  userId,
                  planId: plan.id,
                  plan: plan.name,
                  amountUsdCents: plan.monthlyPriceCents,
                  status: "ACTIVE",
                  provider: "stripe",
                  providerCustomerId: customerId,
                  providerSubscriptionId: subscriptionId,
                  currentPeriodStart: new Date(stripeSub.current_period_start * 1000),
                  currentPeriodEnd: new Date(stripeSub.current_period_end * 1000),
                }
              });

              const user = await prisma.user.findUnique({ where: { id: userId }});
              
              // Send Emails
              if (user) {
                await sendEmail({
                  to: user.email,
                  subject: `Subscription Upgraded to ${plan.name}`,
                  body: `Hi ${user.name},\n\nYour subscription has been successfully upgraded to the ${plan.name} plan.\n\nThank you for your business!`,
                });
                
                // Notify Admin
                const admins = await prisma.user.findMany({ where: { role: "ADMIN" } });
                for (const admin of admins) {
                  await sendEmail({
                    to: admin.email,
                    subject: `User Upgraded: ${user.email}`,
                    body: `User ${user.email} has upgraded to the ${plan.name} plan.`,
                  });
                }
              }
            }
          }
        }
        break;
      }
      case "customer.subscription.deleted": {
        const subscription = event.data.object as Stripe.Subscription;
        await handleSubscriptionDeletion(subscription);
        break;
      }
      case "customer.subscription.updated": {
        const subscription = event.data.object as Stripe.Subscription;
        await handleSubscriptionUpdated(subscription);
        break;
      }
      case "invoice.upcoming": {
        const invoice = event.data.object as Stripe.Invoice;
        await handleUpcomingInvoice(invoice);
        break;
      }
      default:
        console.log(`Unhandled event type ${event.type}`);
    }
  } catch (err: any) {
    console.error("Error processing webhook:", err);
    return NextResponse.json({ error: "Webhook handler failed." }, { status: 500 });
  }

  return NextResponse.json({ received: true });
}

async function handleSubscriptionDeletion(subscription: Stripe.Subscription) {
  const dbSub = await prisma.subscription.findFirst({
    where: { providerSubscriptionId: subscription.id },
    include: { user: true, subscriptionPlan: true }
  });

  if (dbSub) {
    await prisma.subscription.update({
      where: { id: dbSub.id },
      data: { status: "CANCELED", canceledAt: new Date() },
    });

    // Revert user to freemium
    const freemium = await prisma.subscriptionPlan.findUnique({ where: { name: "Freemium" }});
    if (freemium) {
      await prisma.subscription.create({
        data: {
          userId: dbSub.userId,
          planId: freemium.id,
          plan: freemium.name,
          amountUsdCents: freemium.monthlyPriceCents,
          status: "ACTIVE",
          provider: "system",
        }
      });
    }

    if (dbSub.user) {
      await sendEmail({
        to: dbSub.user.email,
        subject: `Subscription Canceled`,
        body: `Hi ${dbSub.user.name},\n\nYour ${dbSub.plan} subscription has been canceled. You have been moved to the free plan.`,
      });
      
      const admins = await prisma.user.findMany({ where: { role: "ADMIN" } });
      for (const admin of admins) {
        await sendEmail({
          to: admin.email,
          subject: `User Downgraded: ${dbSub.user.email}`,
          body: `User ${dbSub.user.email} has canceled their ${dbSub.plan} plan.`,
        });
      }
    }
  }
}

async function handleSubscriptionUpdated(subscription: Stripe.Subscription) {
  const dbSub = await prisma.subscription.findFirst({
    where: { providerSubscriptionId: subscription.id },
  });

  if (dbSub) {
    const priceId = subscription.items.data[0].price.id;
    // Find the plan in our DB that matches this priceId
    const plan = await prisma.subscriptionPlan.findFirst({
      where: {
        OR: [
          { stripePriceId: priceId },
          { stripeYearlyPriceId: priceId }
        ]
      }
    });

    if (plan) {
      await prisma.subscription.update({
        where: { id: dbSub.id },
        data: {
          planId: plan.id,
          plan: plan.name,
          amountUsdCents: subscription.plan?.amount || 0,
          cancelAtPeriodEnd: subscription.cancel_at_period_end,
          status: subscription.status === "active" || subscription.status === "trialing" ? "ACTIVE" : "CANCELED"
        }
      });
    } else {
      // Just update cancellation status if plan is not found for some reason
      await prisma.subscription.update({
        where: { id: dbSub.id },
        data: {
          cancelAtPeriodEnd: subscription.cancel_at_period_end,
          status: subscription.status === "active" || subscription.status === "trialing" ? "ACTIVE" : "CANCELED"
        }
      });
    }
  }
}

async function handleUpcomingInvoice(invoice: Stripe.Invoice) {
  if (invoice.subscription) {
    const dbSub = await prisma.subscription.findFirst({
      where: { providerSubscriptionId: invoice.subscription as string },
      include: { user: true }
    });

    if (dbSub && dbSub.user) {
      await sendEmail({
        to: dbSub.user.email,
        subject: `Upcoming Subscription Renewal`,
        body: `Hi ${dbSub.user.name},\n\nYour ${dbSub.plan} subscription is scheduled to renew on ${new Date(invoice.next_payment_attempt! * 1000).toLocaleDateString()}.\n\nThank you!`,
      });
    }
  }
}
