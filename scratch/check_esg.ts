import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

async function main() {
  const user = await prisma.user.findUnique({
    where: { email: "jx9z2dfzqa@gmeenramy.com" },
    include: { entrepreneurProfile: true }
  });
  console.log("esgActivity:", user?.entrepreneurProfile?.esgActivity);
  console.log("length:", user?.entrepreneurProfile?.esgActivity?.length);
}

main().finally(() => prisma.$disconnect());
