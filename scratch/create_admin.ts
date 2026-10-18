import { PrismaClient } from "@prisma/client";
import { hash } from "bcryptjs";

const prisma = new PrismaClient();
async function main() {
  const passwordHash = await hash("password123", 10);
  const email = "fullstack@ambdixter.com";

  await prisma.user.upsert({
    where: { email },
    update: {
      role: "ADMIN",
      passwordHash,
      emailVerified: new Date(),
    },
    create: {
      email,
      name: "Admin User",
      role: "ADMIN",
      passwordHash,
      emailVerified: new Date(),
    }
  });
  console.log(`Created/Ensured admin ${email} with password "password123"`);
}
main().finally(() => prisma.$disconnect());
