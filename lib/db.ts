import { PrismaClient } from "@prisma/client";

declare global {
  // eslint-disable-next-line no-var
  var __prisma: PrismaClient | undefined;
}

// True only when a real DATABASE_URL is configured. When false, the app
// gracefully falls back to mock data and degrades server actions to
// inert no-ops with a clear message.
export const DB_ENABLED = Boolean(
  process.env.DATABASE_URL && !process.env.DATABASE_URL.includes("placeholder"),
);

function makeClient(): PrismaClient | null {
  if (!DB_ENABLED) return null;
  try {
    return new PrismaClient({
      log: process.env.NODE_ENV === "production" ? ["error"] : ["error", "warn"],
    });
  } catch {
    return null;
  }
}

export const prisma: PrismaClient | null =
  globalThis.__prisma ?? makeClient();

if (process.env.NODE_ENV !== "production" && prisma) {
  globalThis.__prisma = prisma;
}

export function requireDb(): PrismaClient {
  if (!prisma) {
    throw new Error(
      "DATABASE_URL is not configured. Set it in your environment to enable persistence.",
    );
  }
  return prisma;
}
