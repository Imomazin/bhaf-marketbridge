export type DemoAccountKey =
  | "admin"
  | "entrepreneur"
  | "funder"
  | "corporate"
  | "auditor";

export type DemoAccountRole =
  | "ADMIN"
  | "ENTREPRENEUR"
  | "FUNDER"
  | "CORPORATE"
  | "AUDITOR";

export interface DemoAccount {
  key: DemoAccountKey;
  id: string;
  email: string;
  password: string;
  role: DemoAccountRole;
  name: string;
}

export const DEMO_ACCOUNTS = [
  {
    key: "admin",
    id: "demo-admin",
    email: "admin@bhaf.example",
    password: "Test1234@@",
    role: "ADMIN",
    name: "BHAF Admin",
  },
  {
    key: "entrepreneur",
    id: "demo-entrepreneur",
    email: "amara@greenweave.example",
    password: "Test1234@@",
    role: "ENTREPRENEUR",
    name: "Amara Okafor",
  },
  {
    key: "funder",
    id: "demo-funder",
    email: "fund@mosaic.example",
    password: "Test1234@@",
    role: "FUNDER",
    name: "Mosaic Impact Partners",
  },
  {
    key: "corporate",
    id: "demo-corporate",
    email: "procurement@allied.example",
    password: "Test1234@@",
    role: "CORPORATE",
    name: "Allied Procurement Desk",
  },
  {
    key: "auditor",
    id: "demo-auditor",
    email: "auditor@bhaf.example",
    password: "Test1234@@",
    role: "AUDITOR",
    name: "BHAF Audit Review",
  },
] as const satisfies readonly DemoAccount[];

export const DEMO_PASSWORDS_BY_EMAIL: Record<string, string> = Object.fromEntries(
  DEMO_ACCOUNTS.map((account) => [account.email, account.password]),
);

export function getDemoAccountByKey(key: DemoAccountKey): DemoAccount {
  const account = DEMO_ACCOUNTS.find((entry) => entry.key === key);
  if (!account) {
    throw new Error(`Unknown demo account key: ${key}`);
  }
  return account;
}

export function findDemoAccountByEmail(email: string): DemoAccount | undefined {
  const normalized = email.trim().toLowerCase();
  return DEMO_ACCOUNTS.find((account) => account.email === normalized);
}

export function validateDemoCredentials(email: string, password: string): DemoAccount | null {
  const account = findDemoAccountByEmail(email);
  if (!account || account.password !== password) return null;
  return account;
}
