import { PrismaClient } from "@prisma/client";
import { seedDemoAccounts } from "../lib/seed";

const prisma = new PrismaClient();

async function main() {
  console.log("Seeding BHAF MarketBridge…");
  const result = await seedDemoAccounts(prisma);
  console.log("Seed complete:", result.created);
  console.log("Demo credentials (rotate immediately after first sign-in):");
  console.log("  admin@bhaf.example          / ChangeMe!123");
  console.log("  amara@greenweave.example    / Founder!123");
  console.log("  fund@mosaic.example         / Funder!123");
}

main()
  .catch((err) => {
    console.error(err);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
