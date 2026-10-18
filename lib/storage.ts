import { PutObjectCommand, GetObjectCommand, S3Client } from "@aws-sdk/client-s3";
import { put } from "@vercel/blob";
import crypto from "crypto";
import { Readable } from "node:stream";

import { ARTEFACT_MAX_BYTES, ARTEFACT_MAX_MB } from "@/lib/artefactUpload";
import { env } from "@/lib/env";

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
  url: string | null;
  sha256: string;
  size: number;
  mimeType: string;
  fileName: string;
}

interface StoredArtefactDownload {
  body: ReadableStream<Uint8Array>;
  contentType?: string;
  contentLength?: number;
  etag?: string;
}

export type UploadResult =
  | { ok: true; artefact: StoredArtefact }
  | { ok: false; reason: string };

const s3Config =
  env.AWS_REGION && env.AWS_S3_BUCKET
    ? {
        region: env.AWS_REGION,
        bucket: env.AWS_S3_BUCKET,
        credentials:
          env.AWS_ACCESS_KEY_ID && env.AWS_SECRET_ACCESS_KEY
            ? {
                accessKeyId: env.AWS_ACCESS_KEY_ID,
                secretAccessKey: env.AWS_SECRET_ACCESS_KEY,
                sessionToken: env.AWS_SESSION_TOKEN,
              }
            : undefined,
      }
    : null;

const s3Client = s3Config
  ? new S3Client({
      region: s3Config.region,
      credentials: s3Config.credentials,
    })
  : null;

export async function uploadFileToStorage(
  file: File,
  ownerKey: string,
): Promise<UploadResult> {
  if (!file) return { ok: false, reason: "No file received." };
  if (file.size === 0) return { ok: false, reason: "File is empty." };
  if (file.size > ARTEFACT_MAX_BYTES) {
    return { ok: false, reason: `File exceeds the ${ARTEFACT_MAX_MB} MB limit.` };
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
  if (s3Config && s3Client) {
    try {
      await s3Client.send(
        new PutObjectCommand({
          Bucket: s3Config.bucket,
          Key: storageKey,
          Body: buf,
          ContentType: file.type,
        }),
      );
      console.info(`[storage] uploaded via s3 bucket=${s3Config.bucket} key=${storageKey}`);
    } catch (err) {
      console.error("[storage] S3 upload failed", err);
      return { ok: false, reason: "Storage upload failed. Try again shortly." };
    }
  } else if (process.env.BLOB_READ_WRITE_TOKEN) {
    try {
      const result = await put(storageKey, buf, {
        access: "public",
        contentType: file.type,
        addRandomSuffix: false,
        token: process.env.BLOB_READ_WRITE_TOKEN,
      });
      url = result.url;
      console.info(`[storage] uploaded via blob key=${storageKey}`);
    } catch (err) {
      console.error("[storage] Vercel Blob upload failed", err);
      return { ok: false, reason: "Storage upload failed. Try again shortly." };
    }
  } else {
    return {
      ok: false,
      reason: "Storage is not configured. Add AWS S3 credentials or a Vercel Blob token.",
    };
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

export async function downloadFileFromStorage(storageKey: string): Promise<StoredArtefactDownload> {
  if (!s3Config || !s3Client) {
    throw new Error("S3 storage is not configured.");
  }

  const object = await s3Client.send(
    new GetObjectCommand({
      Bucket: s3Config.bucket,
      Key: storageKey,
    }),
  );

  if (!object.Body) {
    throw new Error("Stored object body is empty.");
  }

  return {
    body: toWebStream(object.Body),
    contentType: object.ContentType ?? undefined,
    contentLength: object.ContentLength ?? undefined,
    etag: object.ETag?.replaceAll('"', "") ?? undefined,
  };
}

export function hasS3Storage(): boolean {
  return Boolean(s3Config && s3Client);
}

function sanitiseFileName(name: string): string {
  return name
    .normalize("NFKD")
    .replace(/[^a-zA-Z0-9._-]+/g, "_")
    .replace(/_+/g, "_")
    .slice(0, 120);
}

function toWebStream(body: unknown): ReadableStream<Uint8Array> {
  if (body && typeof body === "object" && "transformToWebStream" in body) {
    const streamable = body as { transformToWebStream: () => ReadableStream<Uint8Array> };
    return streamable.transformToWebStream();
  }

  if (body instanceof Readable) {
    return Readable.toWeb(body) as ReadableStream<Uint8Array>;
  }

  if (body instanceof Blob) {
    return body.stream();
  }

  if (body instanceof Uint8Array) {
    return new ReadableStream<Uint8Array>({
      start(controller) {
        controller.enqueue(body);
        controller.close();
      },
    });
  }

  throw new Error("Unsupported storage response body.");
}
