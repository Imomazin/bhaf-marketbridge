import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function clear() {
  console.log("Deleting users...");
  await prisma.user.deleteMany({
    where: { role: { not: 'ADMIN' } }
  });

  console.log("Deleting standalone models...");
  await prisma.consultingRequest.deleteMany();
  await prisma.opportunity.deleteMany();
  
  // Clear any grants that might have been left over if they weren't cascaded properly
  // Though Grant requires entrepreneurId which is a User, so it should cascade.
  await prisma.grant.deleteMany();

  console.log("Database cleared! Only Admin users and Subscription Plans remain.");
}

clear().then(() => process.exit(0)).catch(e => { console.error(e); process.exit(1); });
