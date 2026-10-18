import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  const plan = await prisma.subscriptionPlan.upsert({
    where: { name: "BHAF Premium Demo" },
    update: {},
    create: {
      name: "BHAF Premium Demo",
      tier: "PREMIUM",
      role: "FUNDER",
      monthlyPriceCents: 0,
      yearlyPriceCents: 0,
      isActive: true,
      features: { "maxDeals": "50", "maxDataRooms": "50", "maxCohorts": "50" }
    }
  });

  const users = await prisma.user.findMany({
    where: {
      subscriptions: { none: {} }
    }
  });

  for (const user of users) {
    await prisma.subscription.create({
      data: {
        userId: user.id,
        planId: plan.id,
        plan: plan.name,
        amountUsdCents: 0,
        provider: "STRIPE",
        status: "ACTIVE",
        providerCustomerId: "demo_cust_" + user.id,
        providerSubscriptionId: "demo_sub_" + user.id,
        currentPeriodStart: new Date(),
        currentPeriodEnd: new Date(new Date().setFullYear(new Date().getFullYear() + 1))
      }
    });
    console.log(`Assigned demo subscription to ${user.email}`);
  }
}

main().finally(() => prisma.$disconnect());
