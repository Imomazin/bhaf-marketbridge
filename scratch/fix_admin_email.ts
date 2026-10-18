import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();
async function main() {
  await prisma.user.updateMany({
    where: { email: "fullstack@ambdixter.com" },
    data: { email: "fullstack@ambidexters.com" }
  });
  console.log('Fixed email to fullstack@ambidexters.com');
}
main().finally(() => prisma.$disconnect());
