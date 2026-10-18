import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();
async function main() {
  const users = await prisma.user.findMany({
    select: { email: true, name: true, role: true }
  });
  console.log(users.filter(u => u.name?.toLowerCase().includes("person") || u.email.includes("bb7l")));
}
main().finally(() => prisma.$disconnect());
