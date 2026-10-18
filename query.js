const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const profiles = await prisma.corporateProfile.findMany();
  console.log("Profiles:", profiles);
  const rfps = await prisma.rfp.findMany();
  console.log("RFPs:", rfps);
}

main().catch(console.error).finally(() => prisma.$disconnect());
