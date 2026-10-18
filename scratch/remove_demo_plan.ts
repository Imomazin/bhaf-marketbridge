import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

async function main() {
  await prisma.subscription.deleteMany({
    where: { plan: "BHAF Premium Demo" }
  });
  
  await prisma.subscriptionPlan.deleteMany({
    where: { name: "BHAF Premium Demo" }
  });
  
  console.log("Deleted BHAF Premium Demo plan and its subscriptions.");
}

main().finally(() => prisma.$disconnect());
