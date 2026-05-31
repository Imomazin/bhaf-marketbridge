import { describe, it, expect } from "vitest";
import { registerSchema } from "../lib/schemas/auth";
import { requestResetSchema, resetPasswordSchema } from "../lib/schemas/password";
import { listingSchema } from "../lib/schemas/listing";
import { opportunitySchema } from "../lib/schemas/opportunity";
import { rfpSchema, rfpResponseSchema } from "../lib/schemas/rfp";
import { cohortSchema } from "../lib/schemas/cohort";

describe("registerSchema", () => {
  it("requires a strong password", () => {
    const bad = registerSchema.safeParse({
      email: "a@b.com",
      password: "weak",
      name: "Alice",
      role: "ENTREPRENEUR",
      acceptedTerms: true,
    });
    expect(bad.success).toBe(false);
  });
  it("accepts a valid entrepreneur registration", () => {
    const good = registerSchema.safeParse({
      email: "a@b.com",
      password: "Strong123!",
      name: "Alice",
      role: "ENTREPRENEUR",
      acceptedTerms: true,
      businessName: "Acme",
      country: "Nigeria",
      sector: "Technology",
    });
    expect(good.success).toBe(true);
  });
  it("rejects unaccepted terms", () => {
    const r = registerSchema.safeParse({
      email: "a@b.com",
      password: "Strong123!",
      name: "Alice",
      role: "ENTREPRENEUR",
      acceptedTerms: false,
    });
    expect(r.success).toBe(false);
  });
});

describe("password reset schemas", () => {
  it("rejects invalid email", () => {
    expect(requestResetSchema.safeParse({ email: "notanemail" }).success).toBe(false);
  });
  it("requires strong new password on reset", () => {
    expect(resetPasswordSchema.safeParse({ token: "x".repeat(10), password: "weak" }).success).toBe(false);
  });
});

describe("listing + opportunity + rfp + cohort schemas", () => {
  it("listing requires title and category", () => {
    expect(listingSchema.safeParse({ title: "", category: "", description: "long enough description here" }).success).toBe(false);
  });
  it("opportunity validates", () => {
    const r = opportunitySchema.safeParse({
      title: "Green Trade Grant 2026",
      organisation: "BHAF",
      type: "GRANT",
      description: "A 20+ character description is required by the schema.",
    });
    expect(r.success).toBe(true);
  });
  it("rfp validates", () => {
    expect(
      rfpSchema.safeParse({
        title: "Q3 supply",
        category: "Fashion & Textiles",
        description: "20+ characters describing the RFP requirements",
      }).success,
    ).toBe(true);
  });
  it("rfp response requires substantive body", () => {
    expect(rfpResponseSchema.safeParse({ rfpId: "x", body: "no" }).success).toBe(false);
  });
  it("cohort name floor", () => {
    expect(cohortSchema.safeParse({ name: "ok" }).success).toBe(false);
    expect(cohortSchema.safeParse({ name: "Abuja Cohort 2" }).success).toBe(true);
  });
});
