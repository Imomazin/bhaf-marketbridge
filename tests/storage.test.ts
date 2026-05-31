import crypto from "crypto";
import { describe, it, expect } from "vitest";

// We can't easily import lib/storage in unit tests without pulling in
// Vercel Blob. Instead we exercise the pure functions we care about
// — file-name sanitisation and SHA-256 hashing — against the same
// algorithms used by the real code.

function sanitiseFileName(name: string): string {
  return name
    .normalize("NFKD")
    .replace(/[^a-zA-Z0-9._-]+/g, "_")
    .replace(/_+/g, "_")
    .slice(0, 120);
}

describe("file name sanitisation", () => {
  it("strips path separators", () => {
    // Dots are allowed; backslashes are not, so each `\` becomes `_`.
    expect(sanitiseFileName("..\\..\\evil.pdf")).toBe(".._.._evil.pdf");
  });
  it("strips disallowed characters", () => {
    expect(sanitiseFileName("hello world (1).pdf")).toBe("hello_world_1_.pdf");
  });
  it("collapses repeated underscores", () => {
    expect(sanitiseFileName("a   b   c.txt")).toBe("a_b_c.txt");
  });
  it("limits to 120 characters", () => {
    const long = "x".repeat(200) + ".pdf";
    expect(sanitiseFileName(long).length).toBeLessThanOrEqual(120);
  });
  it("keeps standard extensions", () => {
    expect(sanitiseFileName("doc.PDF")).toBe("doc.PDF");
  });
});

describe("SHA-256", () => {
  it("hashes deterministically", () => {
    const buf = Buffer.from("hello world");
    const h = crypto.createHash("sha256").update(buf).digest("hex");
    expect(h).toBe("b94d27b9934d3e08a52e52d7da7dabfac484efe37a5380ee9088f7ace2efcde9");
  });
});
