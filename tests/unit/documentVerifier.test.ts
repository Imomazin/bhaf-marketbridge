import { describe, it, expect } from "vitest";
import { verifyDocumentWithAI } from "@/lib/ai/documentVerifier";

describe("AI Document Verifier Service", () => {
  it("should approve valid business document structure in heuristic fallback mode", async () => {
    // 10KB mock document buffer
    const mockBuffer = Buffer.alloc(10 * 1024, "mock document data with official registration text");
    const result = await verifyDocumentWithAI({
      buffer: mockBuffer,
      mimeType: "application/pdf",
      fileName: "CAC_Certificate.pdf",
      category: "Identity & registration",
      profileContext: {
        businessName: "Spaghetti business",
        founderName: "Test 2",
        country: "Nigeria",
      },
    });

    expect(["APPROVE", "FLAG"]).toContain(result.decision);
    expect(result.isLegible).toBe(true);
    expect(result.checks.length).toBeGreaterThan(0);
    expect(result.checks.some((c) => c.status === "PASS" || c.status === "WARN")).toBe(true);
  });

  it("should reject unsupported / non-document file types", async () => {
    const mockBuffer = Buffer.from("console.log('not a doc');");
    const result = await verifyDocumentWithAI({
      buffer: mockBuffer,
      mimeType: "text/javascript",
      fileName: "script.js",
      category: "Identity & registration",
    });

    expect(result.decision).toBe("REJECT");
    expect(result.isLegible).toBe(false);
    expect(result.reason).toContain("Unsupported file format");
  });

  it("should flag suspicious small draft screenshots", async () => {
    const mockBuffer = Buffer.alloc(2000, "tiny screenshot");
    const result = await verifyDocumentWithAI({
      buffer: mockBuffer,
      mimeType: "image/jpeg",
      fileName: "screenshot_draft.jpg",
      category: "Products",
    });

    expect(result.decision).toBe("FLAG");
    expect(result.checks.some((c) => c.status === "WARN")).toBe(true);
  });
});
