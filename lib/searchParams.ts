export type SearchParamValue = string | string[] | undefined;

export function normalizeSearchParam(value: SearchParamValue): string | undefined {
  if (Array.isArray(value)) return value[0];
  return typeof value === "string" ? value : undefined;
}

export function normalizeAppRedirectTarget(
  value: SearchParamValue,
  fallback = "/portal",
): string {
  const raw = normalizeSearchParam(value)?.trim();
  if (!raw) return fallback;

  const protocolMatchIndex = Math.max(raw.lastIndexOf("https://"), raw.lastIndexOf("http://"));
  if (protocolMatchIndex > 0) {
    return normalizeAppRedirectTarget(raw.slice(protocolMatchIndex), fallback);
  }

  if (raw.startsWith("http://") || raw.startsWith("https://")) {
    try {
      const parsed = new URL(raw);
      const normalized = `${parsed.pathname}${parsed.search}${parsed.hash}`;
      return normalized.startsWith("/") ? normalized : fallback;
    } catch {
      return fallback;
    }
  }

  if (!raw.startsWith("/")) return fallback;
  if (raw.startsWith("//")) return fallback;

  return raw;
}
