import { describe, it, expect } from "vitest";
import {
  calculateConsultingEstimate,
  SERVICE_TRACKS,
  ENGAGEMENT_TYPES,
  ORG_STAGES,
  DELIVERABLE_ADDONS,
} from "@/lib/consultingPricing";
import { consultingRequestSchema } from "@/lib/schemas/consulting";

describe("Consulting Variable Pricing Engine", () => {
  it("calculates baseline pricing for growth-stage project sprint", () => {
    const estimate = calculateConsultingEstimate({
      serviceTrackId: "ESG_SUSTAINABILITY",
      engagementTypeId: "PROJECT_SPRINT",
      orgStageId: "GROWTH_STAGE",
      selectedAddonIds: [],
      urgency: "STANDARD",
    });

    // Base price for ESG project sprint is 6500, multiplier 1.0
    expect(estimate.basePrice).toBe(6500);
    expect(estimate.stageAdjustedBase).toBe(6500);
    expect(estimate.addonsCost).toBe(0);
    expect(estimate.urgencySurcharge).toBe(0);
    expect(estimate.totalMinUsd).toBeLessThan(6500);
    expect(estimate.totalMaxUsd).toBeGreaterThan(6500);
  });

  it("applies 25% concessionary discount for early-stage ventures", () => {
    const estimate = calculateConsultingEstimate({
      serviceTrackId: "INVESTMENT_READINESS",
      engagementTypeId: "EXPRESS_AUDIT",
      orgStageId: "EARLY_STAGE",
      selectedAddonIds: [],
      urgency: "STANDARD",
    });

    // Investment readiness express audit base = 2500 * 0.75 = 1875
    expect(estimate.basePrice).toBe(2500);
    expect(estimate.stageAdjustedBase).toBe(1875);
    expect(estimate.discountAmount).toBe(625);
  });

  it("adds deliverable add-on costs correctly", () => {
    const estimate = calculateConsultingEstimate({
      serviceTrackId: "CIRCULAR_ECONOMY",
      engagementTypeId: "PROJECT_SPRINT",
      orgStageId: "GROWTH_STAGE",
      selectedAddonIds: ["DATA_ROOM_AUDIT", "CARBON_METRIC_REPORT"],
      urgency: "STANDARD",
    });

    // 1200 + 2800 = 4000
    expect(estimate.addonsCost).toBe(4000);
    expect(estimate.breakdown.some((b) => b.label.includes("Data Room"))).toBe(true);
    expect(estimate.breakdown.some((b) => b.label.includes("Carbon Accounting"))).toBe(true);
  });

  it("applies 25% rush surge for expedited urgency", () => {
    const standard = calculateConsultingEstimate({
      serviceTrackId: "INCLUSIVE_PROCUREMENT",
      engagementTypeId: "EXPRESS_AUDIT",
      orgStageId: "GROWTH_STAGE",
      selectedAddonIds: [],
      urgency: "STANDARD",
    });

    const expedited = calculateConsultingEstimate({
      serviceTrackId: "INCLUSIVE_PROCUREMENT",
      engagementTypeId: "EXPRESS_AUDIT",
      orgStageId: "GROWTH_STAGE",
      selectedAddonIds: [],
      urgency: "EXPEDITED",
    });

    expect(standard.urgencySurcharge).toBe(0);
    expect(expedited.urgencySurcharge).toBe(Math.round(3000 * 0.25));
    expect(expedited.totalMaxUsd).toBeGreaterThan(standard.totalMaxUsd);
  });

  describe("Consulting Request Schema", () => {
    it("validates a complete consulting request payload", () => {
      const valid = {
        name: "Amina Bello",
        email: "amina@ecofab.example",
        orgName: "EcoFab Africa",
        country: "Nigeria",
        serviceTrackId: "ESG_SUSTAINABILITY",
        orgStageId: "GROWTH_STAGE",
        engagementTypeId: "PROJECT_SPRINT",
        selectedAddonIds: ["DATA_ROOM_AUDIT"],
        urgency: "STANDARD",
        clientBudget: "$5,000 - $15,000",
        description: "We need an audit of our carbon footprint and supply chain compliance for an EU buyer.",
      };

      const parsed = consultingRequestSchema.safeParse(valid);
      expect(parsed.success).toBe(true);
    });

    it("rejects when description or email is invalid", () => {
      const invalid = {
        name: "Amina",
        email: "invalid-email",
        orgName: "EcoFab",
        country: "Nigeria",
        serviceTrackId: "ESG_SUSTAINABILITY",
        orgStageId: "GROWTH_STAGE",
        engagementTypeId: "PROJECT_SPRINT",
        description: "Too short",
      };

      const parsed = consultingRequestSchema.safeParse(invalid);
      expect(parsed.success).toBe(false);
    });
  });
});
