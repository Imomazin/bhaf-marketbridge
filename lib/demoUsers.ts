import { DEMO_ACCOUNTS, type DemoAccountRole } from "@/lib/demoAccounts";
import { getDemoRegisteredUsers } from "@/lib/demoRegistrations";

export interface DemoUser {
  id: string;
  email: string;
  name: string;
  role: DemoAccountRole;
  createdAt?: string;
  source: "seeded" | "registered";
}

export async function getAllDemoUsers(): Promise<DemoUser[]> {
  const registered = await getDemoRegisteredUsers();
  return [
    ...registered.map((user) => ({
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
      createdAt: user.createdAt,
      source: "registered" as const,
    })),
    ...DEMO_ACCOUNTS.map((account) => ({
      id: account.id,
      email: account.email,
      name: account.name,
      role: account.role,
      source: "seeded" as const,
    })),
  ];
}

export async function getDemoUserById(id: string): Promise<DemoUser | null> {
  const users = await getAllDemoUsers();
  return users.find((user) => user.id === id) ?? null;
}

export async function getDemoUsersByRole(role: DemoAccountRole): Promise<DemoUser[]> {
  const users = await getAllDemoUsers();
  return users.filter((user) => user.role === role);
}
