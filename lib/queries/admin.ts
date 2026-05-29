import { prisma, DB_ENABLED } from "@/lib/db";
import { auditTrail as mockAudit, verificationQueue as mockQueue, type QueueItem, type AuditEntry } from "@/data/artefacts";

export async function loadAdminData(): Promise<{
  queue: QueueItem[];
  audit: AuditEntry[];
  isReal: boolean;
  pendingCount: number;
  totalUsers: number;
}> {
  if (!DB_ENABLED || !prisma) {
    return {
      queue: mockQueue,
      audit: mockAudit,
      isReal: false,
      pendingCount: mockQueue.length,
      totalUsers: 0,
    };
  }

  try {
    const [pendingArtefacts, recentAudit, totalUsers] = await Promise.all([
      prisma.artefact.findMany({
        where: { status: { in: ["PENDING_REVIEW", "UNDER_REVIEW"] } },
        include: {
          user: { select: { name: true, email: true } },
          checks: true,
          reviews: { select: { reviewerId: true, decision: true, reviewedAt: true } },
        },
        orderBy: { uploadedAt: "desc" },
        take: 20,
      }),
      prisma.auditEntry.findMany({
        orderBy: { occurredAt: "desc" },
        take: 20,
      }),
      prisma.user.count(),
    ]);

    if (pendingArtefacts.length === 0 && recentAudit.length === 0) {
      return {
        queue: mockQueue,
        audit: mockAudit,
        isReal: false,
        pendingCount: 0,
        totalUsers,
      };
    }

    const queue: QueueItem[] = pendingArtefacts.map((a) => {
      const passed = a.checks.filter((c) => c.status === "PASS").length;
      const warnings = a.checks.filter((c) => c.status === "WARN").length;
      const total = a.checks.length;
      const sinceUpload = humanise(a.uploadedAt);
      return {
        id: a.id,
        entrepreneur: a.user.name ?? a.user.email,
        business: a.user.email,
        artefact: a.name,
        uploadedAt: sinceUpload,
        priority: a.required ? "high" : "medium",
        autoChecks: { passed, total, warnings },
        requiresDualSignOff: a.requiresDualSignOff,
        signOffs: a.reviews.map((r) => ({
          admin: r.reviewerId,
          at: humanise(r.reviewedAt),
        })),
      };
    });

    const audit: AuditEntry[] = recentAudit.map((e) => ({
      ts: e.occurredAt.toISOString().replace("T", " ").slice(0, 19),
      actor: e.actorLabel,
      action: e.action,
      artefact: e.entityId ?? undefined,
      hash: e.selfHash,
      resultHash: undefined,
    }));

    return {
      queue: queue.length > 0 ? queue : mockQueue,
      audit: audit.length > 0 ? audit : mockAudit,
      isReal: true,
      pendingCount: queue.length,
      totalUsers,
    };
  } catch (err) {
    console.error("[admin] DB load failed", err);
    return {
      queue: mockQueue,
      audit: mockAudit,
      isReal: false,
      pendingCount: mockQueue.length,
      totalUsers: 0,
    };
  }
}

function humanise(d: Date): string {
  const diff = Date.now() - d.getTime();
  const hours = diff / (1000 * 60 * 60);
  if (hours < 1) return `${Math.max(1, Math.round(diff / 60000))} min ago`;
  if (hours < 24) return `${Math.round(hours)} h ago`;
  const days = Math.round(hours / 24);
  return days === 1 ? "Yesterday" : `${days} days ago`;
}
