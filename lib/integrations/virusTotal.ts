/**
 * VirusTotal AV scan integration.
 *
 * Required env vars:
 *   VIRUSTOTAL_API_KEY
 *
 * If absent we just return NOT_CONFIGURED so the artefact pipeline keeps
 * working with the magic-byte check we already do server-side.
 */

export type AvResult = {
  status: "CLEAN" | "INFECTED" | "PENDING" | "NOT_CONFIGURED" | "ERROR";
  message: string;
  positives?: number;
  total?: number;
  permalink?: string;
};

/**
 * Submit a SHA-256 hash to VirusTotal for a quick lookup against their
 * existing database. If we already know the file is in their corpus
 * we don't need to upload it again, which is fast and free.
 */
export async function checkBySha256(sha256: string): Promise<AvResult> {
  const key = process.env.VIRUSTOTAL_API_KEY;
  if (!key) {
    return { status: "NOT_CONFIGURED", message: "VirusTotal not configured." };
  }
  try {
    const res = await fetch(`https://www.virustotal.com/api/v3/files/${sha256}`, {
      headers: { "x-apikey": key },
      cache: "no-store",
    });
    if (res.status === 404) {
      // Hash not seen — caller should upload the file or accept the unknown
      return { status: "PENDING", message: "Unknown to VirusTotal. Run an upload-scan to be sure." };
    }
    if (!res.ok) {
      return { status: "ERROR", message: `VirusTotal returned ${res.status}` };
    }
    const data = (await res.json()) as {
      data?: {
        attributes?: {
          last_analysis_stats?: { malicious?: number; suspicious?: number; harmless?: number };
        };
      };
    };
    const stats = data.data?.attributes?.last_analysis_stats ?? {};
    const positives = (stats.malicious ?? 0) + (stats.suspicious ?? 0);
    const total = positives + (stats.harmless ?? 0);
    return {
      status: positives > 0 ? "INFECTED" : "CLEAN",
      message:
        positives > 0
          ? `${positives} engines flagged this file.`
          : "No engines flagged this file.",
      positives,
      total,
      permalink: `https://www.virustotal.com/gui/file/${sha256}`,
    };
  } catch (err) {
    return { status: "ERROR", message: err instanceof Error ? err.message : "Unknown error" };
  }
}
