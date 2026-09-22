import { auth } from "@/auth";
import { downloadFileFromStorage, hasS3Storage } from "@/lib/storage";

export const runtime = "nodejs";

export async function GET(request: Request) {
  const session = await auth();
  if (!session?.user) {
    return new Response("Unauthorized", { status: 401 });
  }

  if (!hasS3Storage()) {
    return new Response("Document storage is not configured.", { status: 503 });
  }

  const { searchParams } = new URL(request.url);
  const key = searchParams.get("key");

  if (!key) {
    return new Response("Storage key is required.", { status: 400 });
  }

  // To prevent arbitrary downloads, only allow downloads from the 'artefacts/' prefix.
  if (!key.startsWith("artefacts/")) {
    return new Response("Forbidden", { status: 403 });
  }

  try {
    const file = await downloadFileFromStorage(key);
    
    // Extract a reasonable filename from the key
    const fileName = key.split("/").pop() || "document.bin";

    return new Response(file.body, {
      headers: {
        "Content-Type": file.contentType ?? "application/octet-stream",
        "Content-Disposition": `inline; filename="${fileName}"`,
        ...(file.contentLength ? { "Content-Length": String(file.contentLength) } : {}),
        ...(file.etag ? { ETag: file.etag } : {}),
        "Cache-Control": "private, max-age=60",
      },
    });
  } catch (error) {
    console.error("[grants] download failed", error);
    return new Response("Unable to open document.", { status: 500 });
  }
}
