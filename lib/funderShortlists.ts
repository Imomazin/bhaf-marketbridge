import crypto from "crypto";
import { cookies } from "next/headers";
import type { ReadinessLevel } from "@/data/entrepreneurs";
import type { FunderShortlist } from "@/lib/funderPortal";

const FUNDER_SHORTLIST_COOKIE = "bhaf-funder-shortlists";

const COOKIE_OPTIONS = {
  httpOnly: true,
  sameSite: "lax" as const,
  secure: process.env.NODE_ENV === "production",
  path: "/",
  maxAge: 60 * 60 * 24 * 30,
};

export interface SavedFunderShortlistEntry {
  id: string;
  funderUserId: string;
  shortlistName: string;
  entrepreneurId: string;
  entrepreneurName: string;
  businessName: string;
  country: string;
  sector: string;
  readinessLevel: ReadinessLevel;
  fundingNeed: string;
  description: string;
  createdAt: string;
}

type JsonRecord = Record<string, unknown>;

function encode(value: unknown): string {
  return Buffer.from(JSON.stringify(value), "utf8").toString("base64url");
}

function stringOrEmpty(value: unknown): string {
  return typeof value === "string" ? value : "";
}

function isReadinessLevel(value: string): value is ReadinessLevel {
  return value === "Emerging" || value === "Developing" || value === "Market-Ready" || value === "Funding-Ready";
}

function parseEntry(entry: JsonRecord): SavedFunderShortlistEntry | null {
  const readiness = stringOrEmpty(entry.readinessLevel);
  if (!isReadinessLevel(readiness)) return null;

  const id = stringOrEmpty(entry.id);
  const funderUserId = stringOrEmpty(entry.funderUserId);
  const shortlistName = stringOrEmpty(entry.shortlistName);
  const entrepreneurId = stringOrEmpty(entry.entrepreneurId);
  const entrepreneurName = stringOrEmpty(entry.entrepreneurName);
  const businessName = stringOrEmpty(entry.businessName);
  const country = stringOrEmpty(entry.country);
  const sector = stringOrEmpty(entry.sector);
  const fundingNeed = stringOrEmpty(entry.fundingNeed);
  const description = stringOrEmpty(entry.description);
  const createdAt = stringOrEmpty(entry.createdAt);

  if (
    !id ||
    !funderUserId ||
    !shortlistName ||
    !entrepreneurId ||
    !entrepreneurName ||
    !businessName ||
    !country ||
    !sector ||
    !createdAt
  ) {
    return null;
  }

  return {
    id,
    funderUserId,
    shortlistName,
    entrepreneurId,
    entrepreneurName,
    businessName,
    country,
    sector,
    readinessLevel: readiness,
    fundingNeed,
    description,
    createdAt,
  };
}

async function readEntries(): Promise<SavedFunderShortlistEntry[]> {
  const store = await cookies();
  const raw = store.get(FUNDER_SHORTLIST_COOKIE)?.value;
  if (!raw) return [];

  try {
    const parsed = JSON.parse(Buffer.from(raw, "base64url").toString("utf8"));
    if (!Array.isArray(parsed)) return [];
    return parsed
      .map((entry) => (entry && typeof entry === "object" ? parseEntry(entry as JsonRecord) : null))
      .filter((entry): entry is SavedFunderShortlistEntry => entry !== null);
  } catch {
    return [];
  }
}

async function writeEntries(entries: SavedFunderShortlistEntry[]) {
  const store = await cookies();
  store.set(FUNDER_SHORTLIST_COOKIE, encode(entries), COOKIE_OPTIONS);
}

function formatIsoDate(value: string): string {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return date.toISOString().slice(0, 10);
}

function summarizeFocus(entries: SavedFunderShortlistEntry[]): string {
  const sectors = Array.from(new Set(entries.map((entry) => entry.sector))).slice(0, 2);
  if (sectors.length === 0) return "Saved from the public directory.";
  return `Saved from the public directory · ${sectors.join(", ")}`;
}

export async function getSavedFunderShortlistEntries(funderUserId: string): Promise<SavedFunderShortlistEntry[]> {
  const entries = await readEntries();
  return entries
    .filter((entry) => entry.funderUserId === funderUserId)
    .sort((a, b) => b.createdAt.localeCompare(a.createdAt));
}

export async function hasSavedFunderShortlistEntry(
  funderUserId: string,
  entrepreneurId: string,
  shortlistName = "My shortlist",
): Promise<boolean> {
  const entries = await getSavedFunderShortlistEntries(funderUserId);
  return entries.some(
    (entry) => entry.entrepreneurId === entrepreneurId && entry.shortlistName === shortlistName,
  );
}

export async function saveFunderShortlistEntry(
  input: Omit<SavedFunderShortlistEntry, "id" | "createdAt">,
): Promise<SavedFunderShortlistEntry> {
  const entries = await readEntries();
  const existing = entries.find(
    (entry) =>
      entry.funderUserId === input.funderUserId &&
      entry.entrepreneurId === input.entrepreneurId &&
      entry.shortlistName === input.shortlistName,
  );

  if (existing) return existing;

  const record: SavedFunderShortlistEntry = {
    ...input,
    id: `funder-shortlist-entry-${crypto.randomUUID()}`,
    createdAt: new Date().toISOString(),
  };

  await writeEntries([record, ...entries].slice(0, 160));
  return record;
}

export function buildFunderShortlistsFromEntries(entries: SavedFunderShortlistEntry[]): FunderShortlist[] {
  const grouped = new Map<string, SavedFunderShortlistEntry[]>();

  for (const entry of entries) {
    const bucket = grouped.get(entry.shortlistName) ?? [];
    bucket.push(entry);
    grouped.set(entry.shortlistName, bucket);
  }

  return Array.from(grouped.entries())
    .map(([shortlistName, rows]) => {
      const uniqueMembers = Array.from(new Set(rows.map((row) => row.entrepreneurName)));
      const updatedAt = rows.reduce(
        (latest, row) => (row.createdAt > latest ? row.createdAt : latest),
        rows[0]?.createdAt ?? new Date().toISOString(),
      );

      return {
        id: `saved-${shortlistName.toLowerCase().replace(/[^a-z0-9]+/g, "-")}`,
        name: shortlistName,
        count: uniqueMembers.length,
        owner: "Saved from directory",
        focus: summarizeFocus(rows),
        updatedAt: formatIsoDate(updatedAt),
        members: uniqueMembers,
      };
    })
    .sort((a, b) => b.updatedAt.localeCompare(a.updatedAt));
}
