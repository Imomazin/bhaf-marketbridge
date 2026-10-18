const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  await prisma.corporateProfile.updateMany({
    data: { status: 'APPROVED' }
  });
  console.log("Profiles approved!");
}

main().catch(e => console.error(e)).finally(() => prisma.$disconnect());
