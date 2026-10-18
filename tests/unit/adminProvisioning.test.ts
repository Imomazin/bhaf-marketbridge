import { describe, it, expect } from "vitest";
import {
  adminCreateFunderSchema,
  adminCreateCorporateSchema,
  generateSecurePassword,
} from "@/lib/schemas/adminProvisioning";

describe("Admin Provisioning Schemas & Utilities", () => {
  it("should generate a secure random password", () => {
    const pwd1 = generateSecurePassword();
    const pwd2 = generateSecurePassword();

    expect(pwd1.startsWith("MB#")).toBe(true);
    expect(pwd1.endsWith("!")).toBe(true);
    expect(pwd1.length).toBeGreaterThanOrEqual(10);
    expect(pwd1).not.toBe(pwd2);
  });

  describe("Funder Provisioning Schema", () => {
    it("validates a complete funder payload", () => {
      const valid = {
        orgName: "Mosaic Impact Partners",
        contactName: "Sarah Jenkins",
        email: "fund@mosaic.example",
        mandate: "Early-stage equity for African women-led ventures.",
        geoFocus: "Nigeria, Kenya, South Africa",
        sectorFocus: "Clean Energy, Circular Economy",
        ticketMin: 25000,
        ticketMax: 500000,
        password: "",
        sendWelcomeEmail: true,
      };

      const result = adminCreateFunderSchema.safeParse(valid);
      expect(result.success).toBe(true);
    });

    it("rejects when organization name or email is missing/invalid", () => {
      const invalid = {
        orgName: "",
        contactName: "Sarah",
        email: "not-an-email",
        mandate: "Valid mandate text",
        geoFocus: "Nigeria",
        sectorFocus: "Energy",
      };

      const result = adminCreateFunderSchema.safeParse(invalid);
      expect(result.success).toBe(false);
    });
  });

  describe("Corporate Partner Provisioning Schema", () => {
    it("validates a complete corporate partner payload", () => {
      const valid = {
        orgName: "Allied Consumer Goods",
        contactName: "Adebola Coker",
        email: "procurement@allied.example",
        industry: "FMCG",
        procurementGeo: "Nigeria, Kenya, Ghana",
        esgFramework: "Supplier diversity and circular sourcing",
        password: "CustomPassword123!",
        sendWelcomeEmail: true,
      };

      const result = adminCreateCorporateSchema.safeParse(valid);
      expect(result.success).toBe(true);
    });

    it("rejects when required fields are missing", () => {
      const invalid = {
        orgName: "Allied",
        contactName: "",
        email: "procurement@allied.example",
        industry: "",
        procurementGeo: "",
      };

      const result = adminCreateCorporateSchema.safeParse(invalid);
      expect(result.success).toBe(false);
    });
  });
});
