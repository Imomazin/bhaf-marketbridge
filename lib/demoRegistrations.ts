import crypto from "crypto";
import { cookies } from "next/headers";
import type { DemoAccountRole } from "@/lib/demoAccounts";

const DEMO_REGISTRATIONS_COOKIE = "bhaf-demo-registrations";
const DEMO_REGISTRATIONS_MAX = 12;

export type DemoRegistrationRole = Extract<
  DemoAccountRole,
  "ENTREPRENEUR" | "FUNDER" | "CORPORATE"
>;

export interface DemoRegisteredUser {
  id: string;
  email: string;
  name: string;
  role: DemoRegistrationRole;
  passwordHash: string;
  createdAt?: string;
}

interface DemoRegistrationsPayload {
  users: DemoRegisteredUser[];
}

function normalizeEmail(email: string): string {
  return email.trim().toLowerCase();
}

function isDemoRegistrationRole(value: string): value is DemoRegistrationRole {
  return value === "ENTREPRENEUR" || value === "FUNDER" || value === "CORPORATE";
}

function coerceUsers(value: unknown): DemoRegisteredUser[] {
  if (!Array.isArray(value)) return [];
  return value.filter((entry): entry is DemoRegisteredUser => {
    if (!entry || typeof entry !== "object") return false;
    const candidate = entry as Record<string, unknown>;
    return (
      typeof candidate.id === "string" &&
      typeof candidate.email === "string" &&
      typeof candidate.name === "string" &&
      typeof candidate.passwordHash === "string" &&
      typeof candidate.role === "string" &&
      isDemoRegistrationRole(candidate.role)
    );
  });
}

function decodeUsers(raw: string | undefined): DemoRegisteredUser[] {
  if (!raw) return [];
  try {
    const decoded = Buffer.from(raw, "base64url").toString("utf8");
    const parsed = JSON.parse(decoded) as Partial<DemoRegistrationsPayload>;
    return coerceUsers(parsed.users);
  } catch {
    return [];
  }
}

function encodeUsers(users: DemoRegisteredUser[]): string {
  return Buffer.from(JSON.stringify({ users }), "utf8").toString("base64url");
}

function cookieValueFromHeader(cookieHeader: string | null, key: string): string | undefined {
  if (!cookieHeader) return undefined;
  const cookiesMap = cookieHeader.split(/;\s*/);
  for (const entry of cookiesMap) {
    const eq = entry.indexOf("=");
    if (eq === -1) continue;
    const name = entry.slice(0, eq).trim();
    if (name !== key) continue;
    return entry.slice(eq + 1);
  }
  return undefined;
}

function createDemoRegistrationId(email: string): string {
  return `demo-reg-${crypto.createHash("sha256").update(email).digest("hex").slice(0, 12)}`;
}

export async function getDemoRegisteredUsers(): Promise<DemoRegisteredUser[]> {
  const cookieStore = await cookies();
  return decodeUsers(cookieStore.get(DEMO_REGISTRATIONS_COOKIE)?.value);
}

export function getDemoRegisteredUsersFromCookieHeader(cookieHeader: string | null): DemoRegisteredUser[] {
  return decodeUsers(cookieValueFromHeader(cookieHeader, DEMO_REGISTRATIONS_COOKIE));
}

export async function saveDemoRegisteredUser(input: {
  email: string;
  name: string;
  role: DemoRegistrationRole;
  passwordHash: string;
}): Promise<DemoRegisteredUser> {
  const cookieStore = await cookies();
  const existing = decodeUsers(cookieStore.get(DEMO_REGISTRATIONS_COOKIE)?.value);
  const email = normalizeEmail(input.email);

  const saved: DemoRegisteredUser = {
    id: createDemoRegistrationId(email),
    email,
    name: input.name.trim(),
    role: input.role,
    passwordHash: input.passwordHash,
    createdAt: existing.find((user) => user.email === email)?.createdAt ?? new Date().toISOString(),
  };

  const next = [saved, ...existing.filter((user) => user.email !== email)].slice(
    0,
    DEMO_REGISTRATIONS_MAX,
  );

  cookieStore.set(DEMO_REGISTRATIONS_COOKIE, encodeUsers(next), {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 24 * 30,
  });

  return saved;
}

export async function updateDemoRegisteredUser(input: {
  id: string;
  name?: string;
  passwordHash?: string;
}): Promise<DemoRegisteredUser | null> {
  const cookieStore = await cookies();
  const existing = decodeUsers(cookieStore.get(DEMO_REGISTRATIONS_COOKIE)?.value);
  const current = existing.find((user) => user.id === input.id);
  if (!current) return null;

  const updated: DemoRegisteredUser = {
    ...current,
    name: input.name?.trim() || current.name,
    passwordHash: input.passwordHash ?? current.passwordHash,
  };

  const next = existing.map((user) => (user.id === input.id ? updated : user));
  cookieStore.set(DEMO_REGISTRATIONS_COOKIE, encodeUsers(next), {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 24 * 30,
  });

  return updated;
}

export async function removeDemoRegisteredUser(id: string): Promise<void> {
  const cookieStore = await cookies();
  const existing = decodeUsers(cookieStore.get(DEMO_REGISTRATIONS_COOKIE)?.value);
  const next = existing.filter((user) => user.id !== id);
  cookieStore.set(DEMO_REGISTRATIONS_COOKIE, encodeUsers(next), {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 24 * 30,
  });
}

export async function clearDemoRegisteredUsers(): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.delete(DEMO_REGISTRATIONS_COOKIE);
}
