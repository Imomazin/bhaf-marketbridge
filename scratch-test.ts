import { PrismaClient } from "@prisma/client";
import { getProrationQuote } from "./app/actions/proration";
import { createCheckoutSession } from "./app/actions/subscription";

const prisma = new PrismaClient();

async function main() {
  const user = await prisma.user.findUnique({
    where: { email: "k748rzsyo0@lnovic.com" }
  });
  
  if (!user) {
    console.log("User not found for E2E test");
    return;
  }
  
  const activeSub = await prisma.subscription.findFirst({
    where: { userId: user.id, status: "ACTIVE" }
  });
  
  if (!activeSub) {
    console.log("Please subscribe to the 300/mo plan first so I can test the upgrade to 500!");
    return;
  }
  
  console.log(`Current active sub: ${activeSub.plan} (Price: ${activeSub.amountUsdCents})`);
  
  // Find a higher plan (500)
  const plans = await prisma.subscriptionPlan.findMany();
  const higherPlan = plans.find(p => p.monthlyPriceCents > activeSub.amountUsdCents);
  
  if (!higherPlan) {
    console.log("No higher plan found to upgrade to.");
    return;
  }
  
  console.log(`Testing upgrade to ${higherPlan.name} (Price: ${higherPlan.monthlyPriceCents})`);
  
  // Mock auth() for server actions
  vi.mock("@/auth", () => ({
    auth: async () => ({ user: { id: user.id } })
  }));
}
main().catch(console.error).finally(() => prisma.$disconnect());
