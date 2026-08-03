import crypto from "crypto";
import { cookies } from "next/headers";

const COOKIE_OPTIONS = {
  httpOnly: true,
  sameSite: "lax" as const,
  secure: process.env.NODE_ENV === "production",
  path: "/",
  maxAge: 60 * 60 * 24 * 30,
};

const DEMO_CORPORATE_PROFILE_COOKIE = "bhaf-demo-corporate-profiles";
const DEMO_RFP_COOKIE = "bhaf-demo-rfps";

type JsonRecord = Record<string, unknown>;

export interface DemoCorporateProfile {
  userId: string;
  orgName: string;
  industry: string;
  procurementGeo: string[];
  esgFramework: string;
  updatedAt: string;
}

export interface DemoRfpRecord {
  id: string;
  ownerId: string;
  ownerName: string;
  ownerOrgName: string;
  title: string;
  category: string;
  region: string;
  budgetUsd: string;
  deadline: string | null;
  description: string;
  status: "OPEN";
  createdAt: string;
}

function nowIso() {
  return new Date().toISOString();
}

function encode(value: unknown): string {
  return Buffer.from(JSON.stringify(value), "utf8").toString("base64url");
}

function stringOrEmpty(value: unknown): string {
  return typeof value === "string" ? value : "";
}

function stringOrNull(value: unknown): string | null {
  return typeof value === "string" ? value : null;
}

function stringArray(value: unknown): string[] {
  return Array.isArray(value) ? value.filter((entry): entry is string => typeof entry === "string") : [];
}

function parseCorporateProfile(entry: JsonRecord): DemoCorporateProfile | null {
  const userId = stringOrEmpty(entry.userId);
  if (!userId) return null;

  return {
    userId,
    orgName: stringOrEmpty(entry.orgName),
    industry: stringOrEmpty(entry.industry),
    procurementGeo: stringArray(entry.procurementGeo),
    esgFramework: stringOrEmpty(entry.esgFramework),
    updatedAt: stringOrEmpty(entry.updatedAt) || nowIso(),
  };
}

function parseDemoRfp(entry: JsonRecord): DemoRfpRecord | null {
  const id = stringOrEmpty(entry.id);
  const ownerId = stringOrEmpty(entry.ownerId);
  const ownerName = stringOrEmpty(entry.ownerName);
  const ownerOrgName = stringOrEmpty(entry.ownerOrgName);
  const title = stringOrEmpty(entry.title);
  const category = stringOrEmpty(entry.category);
  const region = stringOrEmpty(entry.region);
  const budgetUsd = stringOrEmpty(entry.budgetUsd);
  const description = stringOrEmpty(entry.description);
  const status = stringOrEmpty(entry.status);
  const createdAt = stringOrEmpty(entry.createdAt);

  if (!id || !ownerId || !ownerName || !ownerOrgName || !title || !category || !description || !createdAt) {
    return null;
  }
  if (status !== "OPEN") return null;

  return {
    id,
    ownerId,
    ownerName,
    ownerOrgName,
    title,
    category,
    region,
    budgetUsd,
    deadline: stringOrNull(entry.deadline),
    description,
    status,
    createdAt,
  };
}

async function readCookieArray<T>(cookieName: string, mapper: (entry: JsonRecord) => T | null): Promise<T[]> {
  const store = await cookies();
  const raw = store.get(cookieName)?.value;
  if (!raw) return [];

  try {
    const parsed = JSON.parse(Buffer.from(raw, "base64url").toString("utf8"));
    if (!Array.isArray(parsed)) return [];
    return parsed
      .map((entry) => (entry && typeof entry === "object" ? mapper(entry as JsonRecord) : null))
      .filter((entry): entry is T => entry !== null);
  } catch {
    return [];
  }
}

async function writeCookieArray<T>(cookieName: string, items: T[]) {
  const store = await cookies();
  store.set(cookieName, encode(items), COOKIE_OPTIONS);
}

async function deleteCookie(cookieName: string) {
  const store = await cookies();
  store.delete(cookieName);
}

export function getDemoSeedCorporateProfile(userId: string): DemoCorporateProfile | null {
  if (userId !== "demo-corporate") return null;

  return {
    userId,
    orgName: "Consumer Goods Alliance",
    industry: "FMCG",
    procurementGeo: ["West Africa", "Southern Africa"],
    esgFramework: "GRI-aligned supplier diversity programme",
    updatedAt: "2026-06-20T10:15:00.000Z",
  };
}

export async function getAllDemoCorporateProfiles(): Promise<DemoCorporateProfile[]> {
  return readCookieArray(DEMO_CORPORATE_PROFILE_COOKIE, parseCorporateProfile);
}

export async function getDemoCorporateProfile(userId: string): Promise<DemoCorporateProfile | null> {
  const profiles = await getAllDemoCorporateProfiles();
  return profiles.find((profile) => profile.userId === userId) ?? null;
}

export async function saveDemoCorporateProfile(
  userId: string,
  input: Omit<DemoCorporateProfile, "userId" | "updatedAt">,
): Promise<DemoCorporateProfile> {
  const profiles = await getAllDemoCorporateProfiles();
  const nextProfile: DemoCorporateProfile = {
    userId,
    ...input,
    updatedAt: nowIso(),
  };
  const next = [nextProfile, ...profiles.filter((profile) => profile.userId !== userId)].slice(0, 24);
  await writeCookieArray(DEMO_CORPORATE_PROFILE_COOKIE, next);
  return nextProfile;
}

export async function getAllDemoRfps(): Promise<DemoRfpRecord[]> {
  return readCookieArray(DEMO_RFP_COOKIE, parseDemoRfp);
}

export async function getDemoRfpsByOwner(ownerId: string): Promise<DemoRfpRecord[]> {
  const rfps = await getAllDemoRfps();
  return rfps
    .filter((rfp) => rfp.ownerId === ownerId)
    .sort((a, b) => b.createdAt.localeCompare(a.createdAt));
}

export async function getDemoRfpById(id: string): Promise<DemoRfpRecord | null> {
  const rfps = await getAllDemoRfps();
  return rfps.find((rfp) => rfp.id === id) ?? null;
}

export async function saveDemoRfp(
  input: Omit<DemoRfpRecord, "id" | "status" | "createdAt">,
): Promise<DemoRfpRecord> {
  const rfps = await getAllDemoRfps();
  const record: DemoRfpRecord = {
    id: `demo-rfp-${crypto.randomUUID()}`,
    ...input,
    status: "OPEN",
    createdAt: nowIso(),
  };
  await writeCookieArray(DEMO_RFP_COOKIE, [record, ...rfps].slice(0, 80));
  return record;
}

export async function clearCorporateDemoState(): Promise<void> {
  await deleteCookie(DEMO_CORPORATE_PROFILE_COOKIE);
  await deleteCookie(DEMO_RFP_COOKIE);
}
