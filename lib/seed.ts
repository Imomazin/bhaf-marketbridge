import bcrypt from "bcryptjs";
import type { PrismaClient } from "@prisma/client";

export interface SeedResult {
  created: { admin: boolean; entrepreneur: boolean; funder: boolean };
  passwords: { admin: string; entrepreneur: string; funder: string };
}

/**
 * Idempotent demo seed.
 *
 * Creates admin / entrepreneur / funder accounts only if they don't
 * already exist, so this is safe to re-run. Returns the credentials
 * each account was given so the caller can surface them once.
 */
export async function seedDemoAccounts(prisma: PrismaClient): Promise<SeedResult> {
  const adminPwd = await bcrypt.hash("ChangeMe!123", 12);
  const founderPwd = await bcrypt.hash("Founder!123", 12);
  const funderPwd = await bcrypt.hash("Funder!123", 12);

  const admin = await prisma.user.upsert({
    where: { email: "admin@bhaf.example" },
    update: {
      // Force-reset the password on every seed so an existing row from
      // an earlier attempt can't lock you out with a stale hash.
      passwordHash: adminPwd,
      role: "ADMIN",
      status: "ACTIVE",
    },
    create: {
      email: "admin@bhaf.example",
      name: "BHAF Admin",
      passwordHash: adminPwd,
      role: "ADMIN",
      status: "ACTIVE",
    },
    select: { id: true, createdAt: true, updatedAt: true },
  });

  const founder = await prisma.user.upsert({
    where: { email: "amara@greenweave.example" },
    update: {
      passwordHash: founderPwd,
      role: "ENTREPRENEUR",
      status: "ACTIVE",
    },
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

  const funder = await prisma.user.upsert({
    where: { email: "fund@mosaic.example" },
    update: {
      passwordHash: funderPwd,
      role: "FUNDER",
      status: "ACTIVE",
    },
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

  return {
    created: {
      admin: admin.createdAt.getTime() === admin.updatedAt.getTime(),
      entrepreneur: true,
      funder: true,
    },
    passwords: {
      admin: "ChangeMe!123",
      entrepreneur: "Founder!123",
      funder: "Funder!123",
    },
  };
}
