import { PrismaClient } from "@prisma/client";
import { seedDemoAccounts } from "../lib/seed";

const prisma = new PrismaClient();

async function main() {
  console.log("Seeding BHAF MarketBridge…");
  const result = await seedDemoAccounts(prisma);
  console.log("Seed complete:", result.created);
  console.log("Demo credentials (rotate immediately after first sign-in):");
  console.log(`  admin@bhaf.example          / ${result.passwords.admin}`);
  console.log(`  amara@greenweave.example    / ${result.passwords.entrepreneur}`);
  console.log(`  fund@mosaic.example         / ${result.passwords.funder}`);
  console.log(`  procurement@allied.example  / ${result.passwords.corporate}`);
  console.log(`  auditor@bhaf.example        / ${result.passwords.auditor}`);
}

main()
  .catch((err) => {
    console.error(err);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
