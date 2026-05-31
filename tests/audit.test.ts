import crypto from "crypto";
import { describe, it, expect } from "vitest";

// Test the audit-chain hashing logic in isolation. We don't need a DB
// here; we replicate the canonicalisation and verify the SHA-256 chain.

function hashEntry(entry: {
  occurredAt: string;
  actorId: string | null;
  actorLabel: string;
  action: string;
  entityType: string | null;
  entityId: string | null;
  metadata: unknown;
  prevHash: string;
}): string {
  const canonical = JSON.stringify({
    ts: entry.occurredAt,
    actorId: entry.actorId,
    actorLabel: entry.actorLabel,
    action: entry.action,
    entityType: entry.entityType,
    entityId: entry.entityId,
    metadata: entry.metadata,
    prevHash: entry.prevHash,
  });
  return crypto.createHash("sha256").update(canonical).digest("hex");
}

describe("audit chain", () => {
  it("produces stable hashes for identical inputs", () => {
    const e = {
      occurredAt: "2026-01-01T00:00:00.000Z",
      actorId: "u1",
      actorLabel: "alice@example.com",
      action: "Validated · Tax certificate",
      entityType: "Artefact" as const,
      entityId: "a1",
      metadata: { hash: "abc" },
      prevHash: "GENESIS",
    };
    expect(hashEntry(e)).toBe(hashEntry(e));
  });

  it("chains: changing any field changes the hash", () => {
    const base = {
      occurredAt: "2026-01-01T00:00:00.000Z",
      actorId: "u1",
      actorLabel: "alice@example.com",
      action: "Validated · Tax certificate",
      entityType: "Artefact",
      entityId: "a1",
      metadata: null,
      prevHash: "GENESIS",
    };
    const h1 = hashEntry(base);
    const h2 = hashEntry({ ...base, action: "REJECTED · Tax certificate" });
    expect(h1).not.toBe(h2);
  });

  it("uses the previous hash so retroactive edits break the chain", () => {
    const a = hashEntry({
      occurredAt: "2026-01-01T00:00:00.000Z",
      actorId: "u1",
      actorLabel: "alice",
      action: "A",
      entityType: null,
      entityId: null,
      metadata: null,
      prevHash: "GENESIS",
    });
    const b = hashEntry({
      occurredAt: "2026-01-01T00:00:01.000Z",
      actorId: "u1",
      actorLabel: "alice",
      action: "B",
      entityType: null,
      entityId: null,
      metadata: null,
      prevHash: a,
    });
    const bIfAChanged = hashEntry({
      occurredAt: "2026-01-01T00:00:01.000Z",
      actorId: "u1",
      actorLabel: "alice",
      action: "B",
      entityType: null,
      entityId: null,
      metadata: null,
      prevHash: "DIFFERENT_PREV",
    });
    expect(b).not.toBe(bIfAChanged);
  });
});
