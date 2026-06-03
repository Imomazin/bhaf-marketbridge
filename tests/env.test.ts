import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";

// Re-import the module fresh in each test by clearing the cache. The module
// reads process.env eagerly at import time.
async function loadEnv() {
  vi.resetModules();
  return import("../lib/env");
}

describe("env module", () => {
  const originalEnv = { ...process.env };

  beforeEach(() => {
    vi.stubEnv("NODE_ENV", "development");
  });

  afterEach(() => {
    process.env = { ...originalEnv };
    vi.unstubAllEnvs();
  });

  it("parses an empty environment without throwing in dev", async () => {
    const { env, publicEnv } = await loadEnv();
    expect(env).toBeDefined();
    expect(publicEnv).toBeDefined();
  });

  it("strips invalid URLs in dev and falls back to defaults", async () => {
    vi.stubEnv("DATABASE_URL", "not-a-url");
    const { env } = await loadEnv();
    expect(env.DATABASE_URL).toBeUndefined();
  });

  it("hasIntegration is false when keys are missing", async () => {
    vi.stubEnv("ANTHROPIC_API_KEY", "");
    vi.stubEnv("RESEND_API_KEY", "");
    const { hasIntegration } = await loadEnv();
    expect(hasIntegration("ai")).toBe(false);
    expect(hasIntegration("email")).toBe(false);
  });

  it("hasIntegration is true when keys are present", async () => {
    vi.stubEnv("ANTHROPIC_API_KEY", "sk-ant-test");
    vi.stubEnv("PAYSTACK_SECRET_KEY", "sk_test_123");
    const { hasIntegration } = await loadEnv();
    expect(hasIntegration("ai")).toBe(true);
    expect(hasIntegration("payments")).toBe(true);
  });

  it("throws in production when env is invalid", async () => {
    vi.stubEnv("NODE_ENV", "production");
    vi.stubEnv("DATABASE_URL", "not-a-url");
    await expect(loadEnv()).rejects.toThrow(/Invalid server environment/);
  });
});
