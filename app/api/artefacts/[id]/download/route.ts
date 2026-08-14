import { auth } from "@/auth";
import { prisma, DB_ENABLED } from "@/lib/db";
import { downloadFileFromStorage, hasS3Storage } from "@/lib/storage";
import { writeAudit } from "@/lib/audit";

export const runtime = "nodejs";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const session = await auth();
  if (!session?.user) {
    return new Response("Unauthorized", { status: 401 });
  }

  if (!DB_ENABLED || !prisma) {
    return new Response("Document storage is unavailable in demo mode.", { status: 404 });
  }

  if (!hasS3Storage()) {
    return new Response("Document storage is not configured.", { status: 503 });
  }

  const { id } = await params;
  const artefact = await prisma.artefact.findUnique({
    where: { id },
    select: {
      id: true,
      userId: true,
      name: true,
      status: true,
      fileName: true,
      mimeType: true,
      storageKey: true,
    },
  });

  if (!artefact?.storageKey) {
    return new Response("Document not found.", { status: 404 });
  }

  const isOwner = artefact.userId === session.user.id;
  const isReviewer = session.user.role === "ADMIN" || session.user.role === "AUDITOR";

  let hasSharedRoomAccess = false;
  if (!isOwner && !isReviewer && artefact.status === "VALIDATED") {
    const access = await prisma.dataRoomAccess.findFirst({
      where: {
        userId: session.user.id,
        OR: [{ expiresAt: null }, { expiresAt: { gt: new Date() } }],
        dataRoom: {
          ownerId: artefact.userId,
          status: { in: ["OPEN", "RESTRICTED"] },
        },
      },
      select: { id: true },
    });
    hasSharedRoomAccess = Boolean(access);
  }

  if (!isOwner && !isReviewer && !hasSharedRoomAccess) {
    return new Response("Forbidden", { status: 403 });
  }

  try {
    const file = await downloadFileFromStorage(artefact.storageKey);
    await writeAudit({
      actorId: session.user.id,
      actorLabel: session.user.email ?? session.user.id,
      action: `Viewed document · ${artefact.name}`,
      entityType: "Artefact",
      entityId: artefact.id,
      metadata: { storageKey: artefact.storageKey },
    });

    const fileName = (artefact.fileName ?? `${artefact.id}.bin`).replace(/"/g, "");
    return new Response(file.body, {
      headers: {
        "Content-Type": artefact.mimeType ?? file.contentType ?? "application/octet-stream",
        "Content-Disposition": `inline; filename="${fileName}"`,
        ...(file.contentLength ? { "Content-Length": String(file.contentLength) } : {}),
        ...(file.etag ? { ETag: file.etag } : {}),
        "Cache-Control": "private, max-age=60",
      },
    });
  } catch (error) {
    console.error("[artefacts] download failed", error);
    return new Response("Unable to open document.", { status: 500 });
  }
}
