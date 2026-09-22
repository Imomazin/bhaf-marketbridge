import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

async function main() {
  const plan = await prisma.subscriptionPlan.findFirst();
  if (!plan) throw new Error("No plan found");

  await prisma.subscriptionPlan.update({
    where: { id: plan.id },
    data: {
      features: { maxProducts: 50, maxDeals: 100, maxDataRooms: 50, prioritySupport: true }
    }
  });

  const users = await prisma.user.findMany({
    where: {
      role: { in: ["FUNDER", "CORPORATE", "ENTREPRENEUR"] }
    }
  });

  for (const user of users) {
    const activeSub = await prisma.subscription.findFirst({
      where: { userId: user.id, status: "ACTIVE" }
    });

    if (!activeSub) {
      console.log(`Adding sub for ${user.email}`);
      await prisma.subscription.create({
        data: {
          userId: user.id,
          planId: plan.id,
          plan: plan.name,
          amountUsdCents: 0,
          status: "ACTIVE",
          provider: "stub",
          currentPeriodStart: new Date(),
          currentPeriodEnd: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
        }
      });
    }
  }
}

main().catch(console.error).finally(() => prisma.$disconnect());
