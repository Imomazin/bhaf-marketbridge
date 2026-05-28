import { put } from "@vercel/blob";
import crypto from "crypto";

// Allow-list of acceptable upload types. Files outside this set are rejected
// before they ever reach storage.
const ALLOWED_MIME = new Set([
  "application/pdf",
  "image/jpeg",
  "image/png",
  "image/webp",
  "application/zip",
  "application/x-zip-compressed",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
]);

const MAX_BYTES = 25 * 1024 * 1024; // 25 MB

// Magic-byte signature checks for the formats we actually accept. This is
// our lightweight, dependency-free first line of defense; real production
// must also run a proper AV scanner (ClamAV, VirusTotal, etc.).
const MAGIC: { mime: string; bytes: number[] }[] = [
  { mime: "application/pdf", bytes: [0x25, 0x50, 0x44, 0x46] }, // %PDF
  { mime: "image/jpeg", bytes: [0xff, 0xd8, 0xff] },
  { mime: "image/png", bytes: [0x89, 0x50, 0x4e, 0x47] },
  { mime: "application/zip", bytes: [0x50, 0x4b, 0x03, 0x04] },
];

export interface StoredArtefact {
  storageKey: string;
  url: string | null; // null when stored locally only
  sha256: string;
  size: number;
  mimeType: string;
  fileName: string;
}

export type UploadResult =
  | { ok: true; artefact: StoredArtefact }
  | { ok: false; reason: string };

export async function uploadFileToStorage(
  file: File,
  ownerKey: string,
): Promise<UploadResult> {
  if (!file) return { ok: false, reason: "No file received." };
  if (file.size === 0) return { ok: false, reason: "File is empty." };
  if (file.size > MAX_BYTES) {
    return { ok: false, reason: `File exceeds the ${MAX_BYTES / 1024 / 1024} MB limit.` };
  }
  if (!ALLOWED_MIME.has(file.type)) {
    return { ok: false, reason: `Unsupported file type: ${file.type || "unknown"}` };
  }

  const buf = Buffer.from(await file.arrayBuffer());

  // Magic-byte content sniff. If the declared MIME doesn't match the bytes,
  // reject — protects against rename-attack uploads.
  const head = Array.from(buf.slice(0, 8));
  const sig = MAGIC.find((m) => m.bytes.every((b, i) => head[i] === b));
  if (sig && sig.mime !== file.type && !(sig.mime === "application/zip" && file.type.includes("zip"))) {
    return { ok: false, reason: "File contents do not match the declared type." };
  }

  const sha256 = crypto.createHash("sha256").update(buf).digest("hex");
  const safeName = sanitiseFileName(file.name);
  const storageKey = `artefacts/${ownerKey}/${sha256.slice(0, 16)}-${safeName}`;

  let url: string | null = null;
  if (process.env.BLOB_READ_WRITE_TOKEN) {
    try {
      const result = await put(storageKey, buf, {
        access: "public",
        contentType: file.type,
        addRandomSuffix: false,
        token: process.env.BLOB_READ_WRITE_TOKEN,
      });
      url = result.url;
    } catch (err) {
      console.error("[storage] Vercel Blob upload failed", err);
      return { ok: false, reason: "Storage upload failed. Try again shortly." };
    }
  }

  return {
    ok: true,
    artefact: {
      storageKey,
      url,
      sha256,
      size: file.size,
      mimeType: file.type,
      fileName: safeName,
    },
  };
}

function sanitiseFileName(name: string): string {
  return name
    .normalize("NFKD")
    .replace(/[^a-zA-Z0-9._-]+/g, "_")
    .replace(/_+/g, "_")
    .slice(0, 120);
}
