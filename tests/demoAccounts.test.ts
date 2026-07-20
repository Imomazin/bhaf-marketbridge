import { describe, it, expect } from "vitest";
import { DEMO_ACCOUNTS, findDemoAccountByEmail, validateDemoCredentials } from "../lib/demoAccounts";

describe("demo accounts", () => {
  it("defines one demo account for each supported walkthrough role", () => {
    expect(DEMO_ACCOUNTS.map((account) => account.key)).toEqual([
      "admin",
      "entrepreneur",
      "funder",
      "corporate",
      "auditor",
    ]);
  });

  it("finds demo accounts case-insensitively by email", () => {
    const account = findDemoAccountByEmail("AMARA@GREENWEAVE.EXAMPLE");
    expect(account?.role).toBe("ENTREPRENEUR");
  });

  it("validates only exact published demo credentials", () => {
    expect(validateDemoCredentials("amara@greenweave.example", "Founder!123")?.key).toBe("entrepreneur");
    expect(validateDemoCredentials("amara@greenweave.example", "wrong-password")).toBeNull();
    expect(validateDemoCredentials("unknown@example.com", "Founder!123")).toBeNull();
  });
});
