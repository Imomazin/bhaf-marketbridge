import type { MetadataRoute } from "next";
import { prisma, DB_ENABLED } from "@/lib/db";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = process.env.NEXT_PUBLIC_APP_URL ?? "https://bhaf-marketbridge.vercel.app";
  const now = new Date();

  const staticPaths = [
    "/",
    "/directory",
    "/marketplace",
    "/marketplace/rfps",
    "/opportunities",
    "/impact",
    "/portal",
    "/billing",
    "/legal/terms",
    "/legal/privacy",
    "/legal/cookies",
  ].map((p) => ({
    url: `${base}${p}`,
    lastModified: now,
    changeFrequency: "weekly" as const,
    priority: p === "/" ? 1 : 0.7,
  }));

  if (!DB_ENABLED || !prisma) return staticPaths;

  try {
    const [opps, listings, rfps] = await Promise.all([
      prisma.opportunity.findMany({
        where: { published: true },
        select: { id: true, updatedAt: true },
        take: 200,
      }),
      prisma.listing.findMany({
        where: { status: "PUBLISHED" },
        select: { id: true, updatedAt: true },
        take: 500,
      }),
      prisma.rfp.findMany({
        where: { status: "OPEN" },
        select: { id: true, updatedAt: true },
        take: 200,
      }),
    ]);
    const dynamicPaths = [
      ...listings.map((l) => ({
        url: `${base}/marketplace`,
        lastModified: l.updatedAt,
        changeFrequency: "weekly" as const,
        priority: 0.5,
      })),
      ...opps.map((o) => ({
        url: `${base}/opportunities`,
        lastModified: o.updatedAt,
        changeFrequency: "weekly" as const,
        priority: 0.5,
      })),
      ...rfps.map((r) => ({
        url: `${base}/marketplace/rfps/${r.id}`,
        lastModified: r.updatedAt,
        changeFrequency: "weekly" as const,
        priority: 0.6,
      })),
    ];
    return [...staticPaths, ...dynamicPaths];
  } catch {
    return staticPaths;
  }
}
