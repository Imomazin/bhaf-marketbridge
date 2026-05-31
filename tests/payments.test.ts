import { describe, it, expect, vi, afterEach } from "vitest";
import { preferredProviderForCountry, PRICING } from "../lib/integrations/payments";

afterEach(() => {
  vi.unstubAllEnvs();
});

describe("preferredProviderForCountry", () => {
  it("returns stub when no providers configured", () => {
    vi.stubEnv("STRIPE_SECRET_KEY", "");
    vi.stubEnv("PAYSTACK_SECRET_KEY", "");
    vi.stubEnv("FLUTTERWAVE_SECRET_KEY", "");
    expect(preferredProviderForCountry("Norway")).toBe("stub");
  });

  it("prefers Paystack for Nigeria when configured", () => {
    vi.stubEnv("PAYSTACK_SECRET_KEY", "sk_test_x");
    expect(preferredProviderForCountry("Nigeria")).toBe("paystack");
  });

  it("falls back to Flutterwave for Kenya when only Flutterwave is configured", () => {
    vi.stubEnv("PAYSTACK_SECRET_KEY", "");
    vi.stubEnv("FLUTTERWAVE_SECRET_KEY", "FLWSECK-x");
    expect(preferredProviderForCountry("Kenya")).toBe("flutterwave");
  });

  it("prefers Stripe outside Africa when configured", () => {
    vi.stubEnv("STRIPE_SECRET_KEY", "sk_test_x");
    expect(preferredProviderForCountry("United Kingdom")).toBe("stripe");
  });
});

describe("PRICING matrix", () => {
  it("has 3 corporate tiers and 2 funder tiers", () => {
    expect(PRICING.corporate).toHaveLength(3);
    expect(PRICING.funder).toHaveLength(2);
  });
  it("corporate tiers increase monotonically", () => {
    const prices = PRICING.corporate.map((p) => p.priceUsd);
    expect(prices[0]).toBeLessThan(prices[1]);
    expect(prices[1]).toBeLessThan(prices[2]);
  });
});
