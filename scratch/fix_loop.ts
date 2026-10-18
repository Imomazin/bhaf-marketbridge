import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

async function main() {
  const user = await prisma.user.update({
    where: { email: "jx9z2dfzqa@gmeenramy.com" },
    data: { status: "ACTIVE" }
  });
  console.log("Fixed user status to ACTIVE");
}

main().finally(() => prisma.$disconnect());
