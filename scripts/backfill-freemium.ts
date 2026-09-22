import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function backfill() {
  console.log("Starting backfill for missing subscriptions...");

  // 1. Ensure a default Freemium plan exists
  const freemiumPlan = await prisma.subscriptionPlan.upsert({
    where: { name: "Freemium" },
    update: {},
    create: {
      name: "Freemium",
      tier: "FREE",
      role: "ALL",
      monthlyPriceCents: 0,
      features: { maxCohorts: 1, maxDataRooms: 1, maxRfPs: 1 },
      isActive: true,
    },
  });

  console.log(`Ensured Freemium plan exists with ID: ${freemiumPlan.id}`);

  // 2. Find all users who do not have an active subscription
  const users = await prisma.user.findMany({
    where: {
      subscriptions: {
        none: {},
      },
    },
  });

  console.log(`Found ${users.length} users without a subscription.`);

  for (const user of users) {
    await prisma.subscription.create({
      data: {
        userId: user.id,
        planId: freemiumPlan.id,
        plan: "Freemium",
        amountUsdCents: 0,
        status: "ACTIVE",
        provider: "system",
      },
    });
  }

  console.log("Backfill completed.");
}

backfill()
  .catch((e) => console.error(e))
  .finally(() => prisma.$disconnect());
