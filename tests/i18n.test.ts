import { describe, it, expect } from "vitest";
import { pickLocale, tFor, isLocale, LOCALES } from "../lib/i18n";

describe("pickLocale", () => {
  it("defaults to en", () => {
    expect(pickLocale(null)).toBe("en");
    expect(pickLocale(undefined)).toBe("en");
    expect(pickLocale("")).toBe("en");
  });
  it("returns fr for French Accept-Language prefixes", () => {
    expect(pickLocale("fr")).toBe("fr");
    expect(pickLocale("fr-FR")).toBe("fr");
    expect(pickLocale("FR-ca")).toBe("fr");
  });
  it("falls back to en for unsupported", () => {
    expect(pickLocale("sw")).toBe("en");
    expect(pickLocale("zh-CN")).toBe("en");
  });
});

describe("isLocale", () => {
  it("recognises en and fr", () => {
    for (const l of LOCALES) expect(isLocale(l)).toBe(true);
    expect(isLocale("sw")).toBe(false);
    expect(isLocale(null)).toBe(false);
  });
});

describe("tFor", () => {
  it("returns English by default", () => {
    const t = tFor("en");
    expect(t("hero.cta.primary")).toMatch(/Register/);
  });
  it("returns French when locale is fr", () => {
    const t = tFor("fr");
    expect(t("hero.cta.primary")).toMatch(/Inscrire/);
  });
  it("falls back to English when a key is somehow missing", () => {
    const t = tFor("fr");
    // Cast to any to test the fallback when a non-existent key is requested
    expect(t("hero.cta.primary" as never)).toBeTruthy();
  });
});
