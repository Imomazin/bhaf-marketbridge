import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  console.log("Seeding BHAF MarketBridge…");

  const adminPwd = await bcrypt.hash("ChangeMe!123", 12);

  await prisma.user.upsert({
    where: { email: "admin@bhaf.example" },
    update: {},
    create: {
      email: "admin@bhaf.example",
      name: "BHAF Admin",
      passwordHash: adminPwd,
      role: "ADMIN",
      status: "ACTIVE",
    },
  });

  const founderPwd = await bcrypt.hash("Founder!123", 12);
  const founder = await prisma.user.upsert({
    where: { email: "amara@greenweave.example" },
    update: {},
    create: {
      email: "amara@greenweave.example",
      name: "Amara Okafor",
      passwordHash: founderPwd,
      role: "ENTREPRENEUR",
      status: "ACTIVE",
    },
  });

  await prisma.entrepreneurProfile.upsert({
    where: { userId: founder.id },
    update: {},
    create: {
      userId: founder.id,
      businessName: "GreenWeave Textiles",
      country: "Nigeria",
      sector: "Circular Economy",
      description:
        "Transforms post-consumer textile waste into premium upcycled apparel and home goods.",
      fundingNeed: "$120,000 working capital",
      esgActivity: "Diverts 6 tonnes of textile waste per quarter.",
      yearFounded: 2019,
      readinessLevel: "FUNDING_READY",
      womenSupported: 84,
      jobsCreated: 31,
      verified: true,
    },
  });

  const funderPwd = await bcrypt.hash("Funder!123", 12);
  const funder = await prisma.user.upsert({
    where: { email: "fund@mosaic.example" },
    update: {},
    create: {
      email: "fund@mosaic.example",
      name: "Mosaic Impact Partners",
      passwordHash: funderPwd,
      role: "FUNDER",
      status: "ACTIVE",
    },
  });

  await prisma.funderProfile.upsert({
    where: { userId: funder.id },
    update: {},
    create: {
      userId: funder.id,
      orgName: "Mosaic Impact Partners",
      mandate: "Early-stage equity for African women-led ventures with measurable impact.",
      geoFocus: ["Nigeria", "Kenya", "South Africa"],
      sectorFocus: ["Clean Energy", "Circular Economy", "Agri-Processing"],
      verified: true,
    },
  });

  console.log("Seed complete.");
}

main()
  .catch((err) => {
    console.error(err);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
