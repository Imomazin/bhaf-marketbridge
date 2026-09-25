import { PrismaClient } from "@prisma/client";
import { hash } from "bcryptjs";

const prisma = new PrismaClient();
async function main() {
  const passwordHash = await hash("Test1234@@", 10);
  const email = "fullstack@ambdixter.com";

  await prisma.user.update({
    where: { email },
    data: { passwordHash }
  });
  console.log(`Updated admin ${email} password to "Test1234@@"`);
}
main().finally(() => prisma.$disconnect());
