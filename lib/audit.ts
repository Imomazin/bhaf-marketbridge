import crypto from "crypto";
import { prisma } from "@/lib/db";

export interface AuditWrite {
  actorId?: string | null;
  actorLabel: string;
  action: string;
  entityType?: string;
  entityId?: string;
  metadata?: Record<string, unknown>;
}

/**
 * Append a tamper-evident entry to the audit log.
 *
 * Each entry is canonicalised, concatenated with the previous entry's
 * selfHash, and SHA-256 hashed. The chain lets an auditor verify the log
 * has not been retroactively edited.
 */
export async function writeAudit(entry: AuditWrite): Promise<void> {
  if (!prisma) return; // graceful no-op when DB is not configured

  const prev = await prisma.auditEntry.findFirst({
    orderBy: { occurredAt: "desc" },
    select: { selfHash: true },
  });
  const prevHash = prev?.selfHash ?? "GENESIS";

  const occurredAt = new Date();
  const canonical = JSON.stringify({
    ts: occurredAt.toISOString(),
    actorId: entry.actorId ?? null,
    actorLabel: entry.actorLabel,
    action: entry.action,
    entityType: entry.entityType ?? null,
    entityId: entry.entityId ?? null,
    metadata: entry.metadata ?? null,
    prevHash,
  });
  const selfHash = crypto.createHash("sha256").update(canonical).digest("hex");

  await prisma.auditEntry.create({
    data: {
      occurredAt,
      actorId: entry.actorId ?? null,
      actorLabel: entry.actorLabel,
      action: entry.action,
      entityType: entry.entityType ?? null,
      entityId: entry.entityId ?? null,
      metadata: (entry.metadata ?? null) as never,
      prevHash,
      selfHash,
    },
  });
}

export async function verifyAuditChain(): Promise<{ ok: boolean; brokenAt?: string }> {
  if (!prisma) return { ok: true };
  const entries = await prisma.auditEntry.findMany({
    orderBy: { occurredAt: "asc" },
  });
  let prevHash = "GENESIS";
  for (const e of entries) {
    const canonical = JSON.stringify({
      ts: e.occurredAt.toISOString(),
      actorId: e.actorId,
      actorLabel: e.actorLabel,
      action: e.action,
      entityType: e.entityType,
      entityId: e.entityId,
      metadata: e.metadata,
      prevHash,
    });
    const expected = require("crypto").createHash("sha256").update(canonical).digest("hex");
    if (expected !== e.selfHash) return { ok: false, brokenAt: e.id };
    prevHash = e.selfHash;
  }
  return { ok: true };
}
