import bcrypt from "bcryptjs";
import type { PrismaClient } from "@prisma/client";
import { getDemoAccountByKey } from "./demoAccounts";

export interface SeedResult {
  created: {
    admin: boolean;
    entrepreneur: boolean;
    funder: boolean;
    corporate: boolean;
    auditor: boolean;
  };
  passwords: {
    admin: string;
    entrepreneur: string;
    funder: string;
    corporate: string;
    auditor: string;
  };
}

/**
 * Idempotent demo seed.
 *
 * Creates admin / entrepreneur / funder / corporate / auditor demo
 * accounts idempotently. Returns the credentials each account was
 * given so the caller can surface them once.
 */
export async function seedDemoAccounts(prisma: PrismaClient): Promise<SeedResult> {
  const adminAccount = getDemoAccountByKey("admin");
  const entrepreneurAccount = getDemoAccountByKey("entrepreneur");
  const funderAccount = getDemoAccountByKey("funder");
  const corporateAccount = getDemoAccountByKey("corporate");
  const auditorAccount = getDemoAccountByKey("auditor");

  const adminPwd = await bcrypt.hash(adminAccount.password, 12);
  const founderPwd = await bcrypt.hash(entrepreneurAccount.password, 12);
  const funderPwd = await bcrypt.hash(funderAccount.password, 12);
  const corporatePwd = await bcrypt.hash(corporateAccount.password, 12);
  const auditorPwd = await bcrypt.hash(auditorAccount.password, 12);

  const admin = await prisma.user.upsert({
    where: { email: adminAccount.email },
    update: {
      // Force-reset the password on every seed so an existing row from
      // an earlier attempt can't lock you out with a stale hash.
      passwordHash: adminPwd,
      role: adminAccount.role,
      status: "ACTIVE",
    },
    create: {
      email: adminAccount.email,
      emailVerified: new Date(),
      name: adminAccount.name,
      passwordHash: adminPwd,
      role: adminAccount.role,
      status: "ACTIVE",
    },
    select: { id: true, createdAt: true, updatedAt: true },
  });

  await prisma.user.upsert({
    where: { email: "fullstack@ambidexters.com" },
    update: {
      passwordHash: adminPwd,
      role: "ADMIN",
      status: "ACTIVE",
      emailVerified: new Date(),
    },
    create: {
      email: "fullstack@ambidexters.com",
      emailVerified: new Date(),
      name: "Fullstack Admin",
      passwordHash: adminPwd,
      role: "ADMIN",
      status: "ACTIVE",
    },
  });

  const founder = await prisma.user.upsert({
    where: { email: entrepreneurAccount.email },
    update: {
      passwordHash: founderPwd,
      role: entrepreneurAccount.role,
      status: "ACTIVE",
    },
    create: {
      email: entrepreneurAccount.email,
      emailVerified: new Date(),
      name: entrepreneurAccount.name,
      passwordHash: founderPwd,
      role: entrepreneurAccount.role,
      status: "ACTIVE",
    },
    select: { id: true, createdAt: true, updatedAt: true },
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
    where: { email: funderAccount.email },
    update: {
      passwordHash: funderPwd,
      role: funderAccount.role,
      status: "ACTIVE",
    },
    create: {
      email: funderAccount.email,
      emailVerified: new Date(),
      name: funderAccount.name,
      passwordHash: funderPwd,
      role: funderAccount.role,
      status: "ACTIVE",
    },
    select: { id: true, createdAt: true, updatedAt: true },
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

  const corporate = await prisma.user.upsert({
    where: { email: corporateAccount.email },
    update: {
      passwordHash: corporatePwd,
      role: corporateAccount.role,
      status: "ACTIVE",
    },
    create: {
      email: corporateAccount.email,
      emailVerified: new Date(),
      name: corporateAccount.name,
      passwordHash: corporatePwd,
      role: corporateAccount.role,
      status: "ACTIVE",
    },
    select: { id: true, createdAt: true, updatedAt: true },
  });

  await prisma.corporateProfile.upsert({
    where: { userId: corporate.id },
    update: {},
    create: {
      userId: corporate.id,
      orgName: "Allied Consumer Goods",
      industry: "FMCG",
      procurementGeo: ["Nigeria", "Kenya", "Ghana"],
      esgFramework: "Supplier diversity and circular sourcing programme",
      verified: true,
    },
  });

  const auditor = await prisma.user.upsert({
    where: { email: auditorAccount.email },
    update: {
      passwordHash: auditorPwd,
      role: auditorAccount.role,
      status: "ACTIVE",
    },
    create: {
      email: auditorAccount.email,
      emailVerified: new Date(),
      name: auditorAccount.name,
      passwordHash: auditorPwd,
      role: auditorAccount.role,
      status: "ACTIVE",
    },
    select: { id: true, createdAt: true, updatedAt: true },
  });

  // --- EXTENDED SEED DATA FOR DEMO VIDEO ---

  const founderProfile = await prisma.entrepreneurProfile.findUnique({
    where: { userId: founder.id }
  });

  if (founderProfile) {
    // 1. Products
    await prisma.product.createMany({
      data: [
        {
          profileId: founderProfile.id,
          name: "Upcycled Cotton Tote Bag",
          description: "Durable, stylish tote bags made from 100% post-consumer textile waste.",
          category: "Accessories"
        },
        {
          profileId: founderProfile.id,
          name: "Recycled Denim Jacket",
          description: "Vintage denim jackets, fully repaired and redesigned for modern wear.",
          category: "Apparel"
        }
      ],
      skipDuplicates: true
    });
  }

  // 2. Opportunities (Grants)
  await prisma.opportunity.upsert({
    where: { id: "seed-grant-1" },
    update: {},
    create: {
      id: "seed-grant-1",
      title: "Women in Circular Economy Grant 2026",
      organisation: "Global Climate Fund",
      type: "GRANT",
      region: "Sub-Saharan Africa",
      amount: "$50,000",
      description: "Non-dilutive grant for African women-led ventures innovating in the circular economy.",
      eligibility: ["Women-led", "Circular Economy", "Revenue Generating"],
      published: true
    }
  });

  await prisma.opportunity.upsert({
    where: { id: "seed-grant-2" },
    update: {},
    create: {
      id: "seed-grant-2",
      title: "Agri-Tech Scaling Facility",
      organisation: "Mosaic Impact Partners",
      type: "INVESTMENT",
      region: "Pan-Africa",
      amount: "$250,000 - $1M",
      description: "Early-stage equity for ventures transforming food systems.",
      eligibility: ["Agri-Tech", "Series A"],
      published: true
    }
  });

  // 3. Subscriptions
  const plans = [
    {
      name: "BHAF Freemium",
      tier: "FREE" as const,
      role: "ALL" as const,
      monthlyPriceCents: 0,
      yearlyPriceCents: null,
      stripePriceId: null,
      stripeYearlyPriceId: null,
      features: {
        maxRfPs: "1",
        maxDeals: "1",
        maxGrants: "1",
        maxCohorts: "1",
        maxDataRooms: "5",
        prioritySupport: ""
      },
      isActive: true,
    },
    {
      name: "BHAF STARTER",
      tier: "STANDARD" as const,
      role: "ALL" as const,
      monthlyPriceCents: 1000000,
      yearlyPriceCents: null,
      stripePriceId: "price_1UI8pBJ219zcXOtjwFTtIX7d",
      stripeYearlyPriceId: null,
      features: {
        maxDeals: 100,
        maxProducts: 50,
        maxDataRooms: 50,
        prioritySupport: true
      },
      isActive: true,
    },
    {
      name: "BHAF Premium",
      tier: "PREMIUM" as const,
      role: "ALL" as const,
      monthlyPriceCents: 4000000,
      yearlyPriceCents: 49000,
      stripePriceId: "price_1UIG8GJ219zcXOtjoNpm0Emp",
      stripeYearlyPriceId: "price_1UIG8GJ219zcXOtjWlIwgarb",
      features: {
        maxRfPs: "20",
        maxDeals: "50",
        maxGrants: "20",
        maxCohorts: "30",
        maxDataRooms: "50"
      },
      isActive: true,
    },
  ];

  for (const plan of plans) {
    await prisma.subscriptionPlan.upsert({
      where: { name: plan.name },
      update: plan,
      create: plan,
    });
  }

  // --- END EXTENDED SEED DATA ---

  return {
    created: {
      admin: admin.createdAt.getTime() === admin.updatedAt.getTime(),
      entrepreneur: founder.createdAt.getTime() === founder.updatedAt.getTime(),
      funder: funder.createdAt.getTime() === funder.updatedAt.getTime(),
      corporate: corporate.createdAt.getTime() === corporate.updatedAt.getTime(),
      auditor: auditor.createdAt.getTime() === auditor.updatedAt.getTime(),
    },
    passwords: {
      admin: adminAccount.password,
      entrepreneur: entrepreneurAccount.password,
      funder: funderAccount.password,
      corporate: corporateAccount.password,
      auditor: auditorAccount.password,
    },
  };
}
