import crypto from "crypto";
import { cookies } from "next/headers";
import type { Artefact, ArtefactCheck } from "@/data/artefacts";

const COOKIE_OPTIONS = {
  httpOnly: true,
  sameSite: "lax" as const,
  secure: process.env.NODE_ENV === "production",
  path: "/",
  maxAge: 60 * 60 * 24 * 30,
};

const DEMO_PROFILE_COOKIE = "bhaf-demo-profiles";
const DEMO_FUNDER_PROFILE_COOKIE = "bhaf-demo-funder-profiles";
const DEMO_ARTEFACT_COOKIE = "bhaf-demo-artefacts";
const DEMO_LISTING_COOKIE = "bhaf-demo-listings";
const DEMO_APPLICATION_COOKIE = "bhaf-demo-applications";
const DEMO_ENQUIRY_COOKIE = "bhaf-demo-enquiries";

type JsonRecord = Record<string, unknown>;

export interface DemoEntrepreneurProfile {
  userId: string;
  businessName: string;
  country: string;
  sector: string;
  description: string;
  fundingNeed: string;
  esgActivity: string;
  yearFounded: number | null;
  womenSupported: number;
  jobsCreated: number;
  updatedAt: string;
}

export interface DemoFunderProfile {
  userId: string;
  orgName: string;
  mandate: string;
  geoFocus: string[];
  sectorFocus: string[];
  ticketMin: number | null;
  ticketMax: number | null;
  updatedAt: string;
}

export interface DemoArtefactRecord {
  id: string;
  userId: string;
  name: string;
  category: string;
  required: boolean;
  status: "PENDING_REVIEW";
  fileName: string;
  fileSize: string;
  uploadedAt: string;
  sha256: string;
  checks: Array<{
    name: string;
    status: "PASS" | "FAIL" | "WARN" | "PENDING";
    detail?: string;
  }>;
}

export interface DemoListingRecord {
  id: string;
  ownerId: string;
  title: string;
  category: string;
  description: string;
  priceRange: string;
  minOrder: string;
  esgHighlight: string;
  tags: string[];
  status: "PUBLISHED";
  createdAt: string;
  publishedAt: string;
}

export interface DemoApplicationRecord {
  id: string;
  userId: string;
  opportunityId: string;
  coverNote: string | null;
  status: "SUBMITTED" | "UNDER_REVIEW" | "SHORTLISTED" | "REJECTED" | "AWARDED";
  adminNote: string | null;
  createdAt: string;
  decidedAt: string | null;
}

export interface DemoEnquiryRecord {
  id: string;
  userId: string;
  listingId: string;
  listingTitle: string;
  targetBusiness: string;
  note: string | null;
  status: "SENT";
  createdAt: string;
}

function nowIso() {
  return new Date().toISOString();
}

function encode(value: unknown): string {
  return Buffer.from(JSON.stringify(value), "utf8").toString("base64url");
}

function decodeArray<T>(raw: string | undefined, mapper: (entry: JsonRecord) => T | null): T[] {
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

function stringOrEmpty(value: unknown): string {
  return typeof value === "string" ? value : "";
}

function stringOrNull(value: unknown): string | null {
  return typeof value === "string" ? value : null;
}

function numberOrNull(value: unknown): number | null {
  return typeof value === "number" && Number.isFinite(value) ? value : null;
}

function numberOrZero(value: unknown): number {
  return typeof value === "number" && Number.isFinite(value) ? value : 0;
}

function booleanOrFalse(value: unknown): boolean {
  return value === true;
}

function stringArray(value: unknown): string[] {
  return Array.isArray(value) ? value.filter((entry): entry is string => typeof entry === "string") : [];
}

function parseCheck(entry: JsonRecord): DemoArtefactRecord["checks"][number] | null {
  const name = stringOrEmpty(entry.name);
  const status = stringOrEmpty(entry.status);
  if (!name) return null;
  if (status !== "PASS" && status !== "FAIL" && status !== "WARN" && status !== "PENDING") return null;
  return {
    name,
    status,
    detail: typeof entry.detail === "string" ? entry.detail : undefined,
  };
}

function parseProfile(entry: JsonRecord): DemoEntrepreneurProfile | null {
  const userId = stringOrEmpty(entry.userId);
  if (!userId) return null;
  return {
    userId,
    businessName: stringOrEmpty(entry.businessName),
    country: stringOrEmpty(entry.country),
    sector: stringOrEmpty(entry.sector),
    description: stringOrEmpty(entry.description),
    fundingNeed: stringOrEmpty(entry.fundingNeed),
    esgActivity: stringOrEmpty(entry.esgActivity),
    yearFounded: numberOrNull(entry.yearFounded),
    womenSupported: numberOrZero(entry.womenSupported),
    jobsCreated: numberOrZero(entry.jobsCreated),
    updatedAt: stringOrEmpty(entry.updatedAt) || nowIso(),
  };
}

function parseFunderProfile(entry: JsonRecord): DemoFunderProfile | null {
  const userId = stringOrEmpty(entry.userId);
  if (!userId) return null;
  return {
    userId,
    orgName: stringOrEmpty(entry.orgName),
    mandate: stringOrEmpty(entry.mandate),
    geoFocus: stringArray(entry.geoFocus),
    sectorFocus: stringArray(entry.sectorFocus),
    ticketMin: numberOrNull(entry.ticketMin),
    ticketMax: numberOrNull(entry.ticketMax),
    updatedAt: stringOrEmpty(entry.updatedAt) || nowIso(),
  };
}

function parseArtefact(entry: JsonRecord): DemoArtefactRecord | null {
  const id = stringOrEmpty(entry.id);
  const userId = stringOrEmpty(entry.userId);
  const name = stringOrEmpty(entry.name);
  const category = stringOrEmpty(entry.category);
  const status = stringOrEmpty(entry.status);
  const fileName = stringOrEmpty(entry.fileName);
  const fileSize = stringOrEmpty(entry.fileSize);
  const uploadedAt = stringOrEmpty(entry.uploadedAt);
  const sha256 = stringOrEmpty(entry.sha256);
  if (!id || !userId || !name || !category || !fileName || !fileSize || !uploadedAt || !sha256) return null;
  if (status !== "PENDING_REVIEW") return null;
  const checks = Array.isArray(entry.checks)
    ? entry.checks
        .map((check) => (check && typeof check === "object" ? parseCheck(check as JsonRecord) : null))
        .filter((check): check is DemoArtefactRecord["checks"][number] => check !== null)
    : [];
  return {
    id,
    userId,
    name,
    category,
    required: booleanOrFalse(entry.required),
    status,
    fileName,
    fileSize,
    uploadedAt,
    sha256,
    checks,
  };
}

function parseListing(entry: JsonRecord): DemoListingRecord | null {
  const id = stringOrEmpty(entry.id);
  const ownerId = stringOrEmpty(entry.ownerId);
  const title = stringOrEmpty(entry.title);
  const category = stringOrEmpty(entry.category);
  const description = stringOrEmpty(entry.description);
  const status = stringOrEmpty(entry.status);
  const createdAt = stringOrEmpty(entry.createdAt);
  const publishedAt = stringOrEmpty(entry.publishedAt);
  if (!id || !ownerId || !title || !category || !description || !createdAt || !publishedAt) return null;
  if (status !== "PUBLISHED") return null;
  return {
    id,
    ownerId,
    title,
    category,
    description,
    priceRange: stringOrEmpty(entry.priceRange),
    minOrder: stringOrEmpty(entry.minOrder),
    esgHighlight: stringOrEmpty(entry.esgHighlight),
    tags: stringArray(entry.tags),
    status,
    createdAt,
    publishedAt,
  };
}

function parseApplication(entry: JsonRecord): DemoApplicationRecord | null {
  const id = stringOrEmpty(entry.id);
  const userId = stringOrEmpty(entry.userId);
  const opportunityId = stringOrEmpty(entry.opportunityId);
  const status = stringOrEmpty(entry.status);
  const createdAt = stringOrEmpty(entry.createdAt);
  if (!id || !userId || !opportunityId || !createdAt) return null;
  if (
    status !== "SUBMITTED" &&
    status !== "UNDER_REVIEW" &&
    status !== "SHORTLISTED" &&
    status !== "REJECTED" &&
    status !== "AWARDED"
  ) {
    return null;
  }
  return {
    id,
    userId,
    opportunityId,
    coverNote: stringOrNull(entry.coverNote),
    status,
    adminNote: stringOrNull(entry.adminNote),
    createdAt,
    decidedAt: stringOrNull(entry.decidedAt),
  };
}

function parseEnquiry(entry: JsonRecord): DemoEnquiryRecord | null {
  const id = stringOrEmpty(entry.id);
  const userId = stringOrEmpty(entry.userId);
  const listingId = stringOrEmpty(entry.listingId);
  const listingTitle = stringOrEmpty(entry.listingTitle);
  const targetBusiness = stringOrEmpty(entry.targetBusiness);
  const status = stringOrEmpty(entry.status);
  const createdAt = stringOrEmpty(entry.createdAt);
  if (!id || !userId || !listingId || !listingTitle || !targetBusiness || !createdAt) return null;
  if (status !== "SENT") return null;
  return {
    id,
    userId,
    listingId,
    listingTitle,
    targetBusiness,
    note: stringOrNull(entry.note),
    status,
    createdAt,
  };
}

async function readCookieArray<T>(cookieName: string, mapper: (entry: JsonRecord) => T | null): Promise<T[]> {
  const store = await cookies();
  return decodeArray(store.get(cookieName)?.value, mapper);
}

async function writeCookieArray<T>(cookieName: string, items: T[]) {
  const store = await cookies();
  store.set(cookieName, encode(items), COOKIE_OPTIONS);
}

async function deleteCookie(cookieName: string) {
  const store = await cookies();
  store.delete(cookieName);
}

function formatFileSize(size: number): string {
  if (size >= 1024 * 1024) return `${(size / (1024 * 1024)).toFixed(1)} MB`;
  return `${Math.max(1, Math.round(size / 1024))} KB`;
}

export async function getAllDemoEntrepreneurProfiles(): Promise<DemoEntrepreneurProfile[]> {
  return readCookieArray(DEMO_PROFILE_COOKIE, parseProfile);
}

export async function getDemoEntrepreneurProfile(userId: string): Promise<DemoEntrepreneurProfile | null> {
  const profiles = await getAllDemoEntrepreneurProfiles();
  return profiles.find((profile) => profile.userId === userId) ?? null;
}

export async function saveDemoEntrepreneurProfile(
  userId: string,
  input: Omit<DemoEntrepreneurProfile, "userId" | "updatedAt">,
): Promise<DemoEntrepreneurProfile> {
  const profiles = await getAllDemoEntrepreneurProfiles();
  const nextProfile: DemoEntrepreneurProfile = {
    userId,
    ...input,
    updatedAt: nowIso(),
  };
  const next = [nextProfile, ...profiles.filter((profile) => profile.userId !== userId)].slice(0, 24);
  await writeCookieArray(DEMO_PROFILE_COOKIE, next);
  return nextProfile;
}

export async function getAllDemoFunderProfiles(): Promise<DemoFunderProfile[]> {
  return readCookieArray(DEMO_FUNDER_PROFILE_COOKIE, parseFunderProfile);
}

export async function getDemoFunderProfile(userId: string): Promise<DemoFunderProfile | null> {
  const profiles = await getAllDemoFunderProfiles();
  return profiles.find((profile) => profile.userId === userId) ?? null;
}

export async function saveDemoFunderProfile(
  userId: string,
  input: Omit<DemoFunderProfile, "userId" | "updatedAt">,
): Promise<DemoFunderProfile> {
  const profiles = await getAllDemoFunderProfiles();
  const nextProfile: DemoFunderProfile = {
    userId,
    ...input,
    updatedAt: nowIso(),
  };
  const next = [nextProfile, ...profiles.filter((profile) => profile.userId !== userId)].slice(0, 24);
  await writeCookieArray(DEMO_FUNDER_PROFILE_COOKIE, next);
  return nextProfile;
}

export async function getAllDemoArtefacts(): Promise<DemoArtefactRecord[]> {
  return readCookieArray(DEMO_ARTEFACT_COOKIE, parseArtefact);
}

export async function getDemoArtefacts(userId: string): Promise<DemoArtefactRecord[]> {
  const artefacts = await getAllDemoArtefacts();
  return artefacts
    .filter((artefact) => artefact.userId === userId)
    .sort((a, b) => b.uploadedAt.localeCompare(a.uploadedAt));
}

export async function saveDemoArtefact(input: {
  userId: string;
  name: string;
  category: string;
  required: boolean;
  fileName: string;
  fileSizeBytes: number;
}): Promise<DemoArtefactRecord> {
  const artefacts = await getAllDemoArtefacts();
  const salt = `${input.userId}:${input.fileName}:${Date.now()}:${Math.random()}`;
  const record: DemoArtefactRecord = {
    id: `demo-art-${crypto.randomUUID()}`,
    userId: input.userId,
    name: input.name.trim(),
    category: input.category.trim(),
    required: input.required,
    status: "PENDING_REVIEW",
    fileName: input.fileName,
    fileSize: formatFileSize(input.fileSizeBytes),
    uploadedAt: nowIso(),
    sha256: crypto.createHash("sha256").update(salt).digest("hex"),
    checks: [
      { name: "File integrity (SHA-256)", status: "PASS" },
      { name: "MIME & magic-byte match", status: "PASS" },
      { name: "Size & format limits", status: "PASS" },
      { name: "Cross-check against profile", status: "PENDING" },
    ],
  };
  await writeCookieArray(DEMO_ARTEFACT_COOKIE, [record, ...artefacts].slice(0, 60));
  return record;
}

export async function getAllDemoListings(): Promise<DemoListingRecord[]> {
  return readCookieArray(DEMO_LISTING_COOKIE, parseListing);
}

export async function getDemoListings(userId: string): Promise<DemoListingRecord[]> {
  const listings = await getAllDemoListings();
  return listings
    .filter((listing) => listing.ownerId === userId)
    .sort((a, b) => b.createdAt.localeCompare(a.createdAt));
}

export async function saveDemoListing(
  ownerId: string,
  input: {
    title: string;
    category: string;
    description: string;
    priceRange?: string;
    minOrder?: string;
    esgHighlight?: string;
    tags: string[];
  },
): Promise<DemoListingRecord> {
  const listings = await getAllDemoListings();
  const timestamp = nowIso();
  const record: DemoListingRecord = {
    id: `demo-listing-${crypto.randomUUID()}`,
    ownerId,
    title: input.title.trim(),
    category: input.category.trim(),
    description: input.description.trim(),
    priceRange: input.priceRange?.trim() ?? "",
    minOrder: input.minOrder?.trim() ?? "",
    esgHighlight: input.esgHighlight?.trim() ?? "",
    tags: input.tags,
    status: "PUBLISHED",
    createdAt: timestamp,
    publishedAt: timestamp,
  };
  await writeCookieArray(DEMO_LISTING_COOKIE, [record, ...listings].slice(0, 60));
  return record;
}

export async function getAllDemoApplications(): Promise<DemoApplicationRecord[]> {
  return readCookieArray(DEMO_APPLICATION_COOKIE, parseApplication);
}

export async function getDemoApplications(userId: string): Promise<DemoApplicationRecord[]> {
  const applications = await getAllDemoApplications();
  return applications
    .filter((application) => application.userId === userId)
    .sort((a, b) => b.createdAt.localeCompare(a.createdAt));
}

export async function findDemoApplication(userId: string, opportunityId: string): Promise<DemoApplicationRecord | null> {
  const applications = await getAllDemoApplications();
  return (
    applications.find(
      (application) => application.userId === userId && application.opportunityId === opportunityId,
    ) ?? null
  );
}

export async function saveDemoApplication(
  userId: string,
  opportunityId: string,
  coverNote?: string,
): Promise<DemoApplicationRecord> {
  const applications = await getAllDemoApplications();
  const existing = applications.find(
    (application) => application.userId === userId && application.opportunityId === opportunityId,
  );
  if (existing) return existing;

  const record: DemoApplicationRecord = {
    id: `demo-application-${crypto.randomUUID()}`,
    userId,
    opportunityId,
    coverNote: coverNote?.trim() || null,
    status: "SUBMITTED",
    adminNote: null,
    createdAt: nowIso(),
    decidedAt: null,
  };
  await writeCookieArray(DEMO_APPLICATION_COOKIE, [record, ...applications].slice(0, 80));
  return record;
}

export async function getAllDemoEnquiries(): Promise<DemoEnquiryRecord[]> {
  return readCookieArray(DEMO_ENQUIRY_COOKIE, parseEnquiry);
}

export async function getDemoEnquiries(userId: string): Promise<DemoEnquiryRecord[]> {
  const enquiries = await getAllDemoEnquiries();
  return enquiries
    .filter((enquiry) => enquiry.userId === userId)
    .sort((a, b) => b.createdAt.localeCompare(a.createdAt));
}

export async function saveDemoEnquiry(input: {
  userId: string;
  listingId: string;
  listingTitle: string;
  targetBusiness: string;
  note?: string;
}): Promise<DemoEnquiryRecord> {
  const enquiries = await getAllDemoEnquiries();
  const existing = enquiries.find(
    (enquiry) => enquiry.userId === input.userId && enquiry.listingId === input.listingId,
  );
  if (existing) return existing;

  const record: DemoEnquiryRecord = {
    id: `demo-enquiry-${crypto.randomUUID()}`,
    userId: input.userId,
    listingId: input.listingId,
    listingTitle: input.listingTitle,
    targetBusiness: input.targetBusiness,
    note: input.note?.trim() || null,
    status: "SENT",
    createdAt: nowIso(),
  };
  await writeCookieArray(DEMO_ENQUIRY_COOKIE, [record, ...enquiries].slice(0, 80));
  return record;
}

export async function deleteDemoUserState(userId: string): Promise<void> {
  const [profiles, funderProfiles, artefacts, listings, applications, enquiries] = await Promise.all([
    getAllDemoEntrepreneurProfiles(),
    getAllDemoFunderProfiles(),
    getAllDemoArtefacts(),
    getAllDemoListings(),
    getAllDemoApplications(),
    getAllDemoEnquiries(),
  ]);

  await writeCookieArray(
    DEMO_PROFILE_COOKIE,
    profiles.filter((profile) => profile.userId !== userId),
  );
  await writeCookieArray(
    DEMO_FUNDER_PROFILE_COOKIE,
    funderProfiles.filter((profile) => profile.userId !== userId),
  );
  await writeCookieArray(
    DEMO_ARTEFACT_COOKIE,
    artefacts.filter((artefact) => artefact.userId !== userId),
  );
  await writeCookieArray(
    DEMO_LISTING_COOKIE,
    listings.filter((listing) => listing.ownerId !== userId),
  );
  await writeCookieArray(
    DEMO_APPLICATION_COOKIE,
    applications.filter((application) => application.userId !== userId),
  );
  await writeCookieArray(
    DEMO_ENQUIRY_COOKIE,
    enquiries.filter((enquiry) => enquiry.userId !== userId),
  );
}

export async function exportDemoUserState(userId: string) {
  const [profile, funderProfile, artefacts, listings, applications, enquiries] = await Promise.all([
    getDemoEntrepreneurProfile(userId),
    getDemoFunderProfile(userId),
    getDemoArtefacts(userId),
    getDemoListings(userId),
    getDemoApplications(userId),
    getDemoEnquiries(userId),
  ]);

  return {
    userId,
    profile,
    funderProfile,
    artefacts,
    listings,
    applications,
    enquiries,
  };
}

export async function clearAllDemoState(): Promise<void> {
  await deleteCookie(DEMO_PROFILE_COOKIE);
  await deleteCookie(DEMO_FUNDER_PROFILE_COOKIE);
  await deleteCookie(DEMO_ARTEFACT_COOKIE);
  await deleteCookie(DEMO_LISTING_COOKIE);
  await deleteCookie(DEMO_APPLICATION_COOKIE);
  await deleteCookie(DEMO_ENQUIRY_COOKIE);
}

export function mapDemoArtefactToUi(record: DemoArtefactRecord): Artefact {
  const statusMap: Record<DemoArtefactRecord["status"], Artefact["status"]> = {
    PENDING_REVIEW: "pending_review",
  };
  const checkStatusMap: Record<DemoArtefactRecord["checks"][number]["status"], ArtefactCheck["status"]> = {
    PASS: "pass",
    FAIL: "fail",
    WARN: "warn",
    PENDING: "pending",
  };

  return {
    id: record.id,
    name: record.name,
    description: "",
    category: record.category,
    required: record.required,
    status: statusMap[record.status],
    fileName: record.fileName,
    fileSize: record.fileSize,
    uploadedAt: record.uploadedAt.slice(0, 10),
    hash: record.sha256,
    checks: record.checks.map((check) => ({
      name: check.name,
      status: checkStatusMap[check.status],
      detail: check.detail,
    })),
  };
}
