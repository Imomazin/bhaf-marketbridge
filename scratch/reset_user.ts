import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

async function main() {
  const user = await prisma.user.findUnique({
    where: { email: "jx9z2dfzqa@gmeenramy.com" },
    include: { entrepreneurProfile: true }
  });

  if (!user) {
    console.log("No user found");
    return;
  }

  const deleted = await prisma.artefact.deleteMany({
    where: { userId: user.id }
  });
  console.log("Deleted artefacts:", deleted.count);

  if (user.entrepreneurProfile) {
    await prisma.entrepreneurProfile.update({
      where: { id: user.entrepreneurProfile.id },
      data: { verified: false, status: "PENDING" }
    });
  }

  await prisma.user.update({
    where: { id: user.id },
    data: { status: "PENDING_VERIFICATION" }
  });
  console.log("Reset user verification status successfully!");
}

main().finally(() => prisma.$disconnect());
