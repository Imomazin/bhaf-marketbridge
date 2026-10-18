import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { auth } from "@/auth";
import { DB_ENABLED } from "@/lib/db";
import { getArtefactForReview } from "@/lib/queries/artefactReview";
import { ArtefactReviewActions } from "@/components/admin/ArtefactReviewActions";
import { cn } from "@/lib/utils";

export const dynamic = "force-dynamic";

const statusTone: Record<string, string> = {
  PENDING_REVIEW: "bg-gold-50 text-gold-800 border-gold-200",
  UNDER_REVIEW: "bg-gold-50 text-gold-800 border-gold-200",
  VALIDATED: "bg-forest-50 text-forest-800 border-forest-200",
  REJECTED: "bg-red-50 text-red-700 border-red-200",
};

const checkTone: Record<string, string> = {
  PASS: "text-forest-700",
  FAIL: "text-red-700",
  WARN: "text-gold-700",
  PENDING: "text-charcoal-400",
};

export default async function AdminArtefactReviewPage({ params }: { params: Promise<{ id: string }> }) {
  const session = await auth();
  if (!session?.user) redirect("/auth/sign-in?next=/admin/artefacts");
  if (session.user.role !== "ADMIN" && session.user.role !== "AUDITOR") redirect("/");

  const { id } = await params;

  if (!DB_ENABLED) {
    return (
      <section className="bg-cream-50 py-12 md:py-16">
        <div className="container-edge max-w-3xl">
          <div className="card p-10 text-center text-sm text-charcoal-500">Database not configured.</div>
        </div>
      </section>
    );
  }

  const artefact = await getArtefactForReview(id);
  if (!artefact) notFound();

  return (
    <section className="bg-cream-50 py-12 md:py-16">
      <div className="container-edge max-w-3xl">
        <Link href="/admin/artefacts" className="text-xs font-medium text-forest-700 hover:text-gold-700">
          ← Artefacts awaiting review
        </Link>

        <div className="mt-4 flex flex-wrap items-center gap-3">
          <span className={cn("rounded-full border px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wider", statusTone[artefact.status] ?? "bg-cream-100 text-charcoal-500 border-cream-300")}>
            {artefact.status.replace(/_/g, " ")}
          </span>
          <span className="text-[11px] font-semibold uppercase tracking-[0.18em] text-gold-700">{artefact.category}</span>
        </div>
        <h1 className="mt-2 font-serif text-3xl text-forest-900 md:text-4xl">{artefact.name}</h1>
        <p className="mt-1 text-sm text-charcoal-500">
          {artefact.user.name ?? "—"} · {artefact.user.email}
        </p>

        {artefact.status === "REJECTED" && artefact.rejectionReason && (
          <div className="mt-4 rounded-md border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800">
            <p className="text-[11px] font-semibold uppercase tracking-wide text-red-600">Rejection reason</p>
            <p className="mt-1">{artefact.rejectionReason}</p>
          </div>
        )}

        <div className="card mt-6 p-6">
          <h2 className="font-serif text-lg text-forest-900">Document</h2>
          <dl className="mt-4 grid gap-4 sm:grid-cols-2">
            <div>
              <dt className="text-[11px] font-semibold uppercase tracking-wide text-charcoal-400">File</dt>
              <dd className="mt-1 text-sm text-charcoal-700">{artefact.fileName ?? "—"}</dd>
            </div>
            <div>
              <dt className="text-[11px] font-semibold uppercase tracking-wide text-charcoal-400">Size</dt>
              <dd className="mt-1 text-sm text-charcoal-700">
                {artefact.fileSize ? `${(artefact.fileSize / 1024).toFixed(0)} KB` : "—"}
              </dd>
            </div>
            <div>
              <dt className="text-[11px] font-semibold uppercase tracking-wide text-charcoal-400">Uploaded</dt>
              <dd className="mt-1 text-sm text-charcoal-700">{artefact.uploadedAt.toISOString().slice(0, 10)}</dd>
            </div>
            <div>
              <dt className="text-[11px] font-semibold uppercase tracking-wide text-charcoal-400">Required</dt>
              <dd className="mt-1 text-sm text-charcoal-700">{artefact.required ? "Yes" : "No"}</dd>
            </div>
            {artefact.sha256 && (
              <div className="sm:col-span-2">
                <dt className="text-[11px] font-semibold uppercase tracking-wide text-charcoal-400">SHA-256</dt>
                <dd className="mt-1 break-all font-mono text-[11px] text-charcoal-700">{artefact.sha256}</dd>
              </div>
            )}
            {artefact.storageKey && (
              <div className="sm:col-span-2">
                <a
                  href={`/api/artefacts/${artefact.id}/download`}
                  target="_blank"
                  rel="noreferrer"
                  className="text-xs font-medium text-forest-700 hover:text-gold-700"
                >
                  Download / view document →
                </a>
              </div>
            )}
          </dl>
        </div>

        <div className="card mt-6 p-6">
          <h2 className="font-serif text-lg text-forest-900">Automated checks</h2>
          {artefact.checks.length === 0 ? (
            <p className="mt-2 text-sm text-charcoal-500">No checks recorded.</p>
          ) : (
            <ul className="mt-3 divide-y divide-cream-200">
              {artefact.checks.map((c) => (
                <li key={c.id} className="flex items-center justify-between py-2 text-sm">
                  <div>
                    <span className="text-forest-900">{c.name}</span>
                    {c.detail && <p className="text-[11px] text-charcoal-500">{c.detail}</p>}
                  </div>
                  <span className={cn("text-[11px] font-semibold uppercase tracking-wide", checkTone[c.status])}>{c.status}</span>
                </li>
              ))}
            </ul>
          )}
        </div>

        {artefact.reviews.length > 0 && (
          <div className="card mt-6 p-6">
            <h2 className="font-serif text-lg text-forest-900">Review history</h2>
            <ul className="mt-3 divide-y divide-cream-200">
              {artefact.reviews.map((r) => (
                <li key={r.id} className="py-2 text-sm">
                  <p className="text-forest-900">
                    {r.decision} · {r.reviewer.name ?? r.reviewer.email}
                  </p>
                  {r.comment && <p className="text-[11px] text-charcoal-500">{r.comment}</p>}
                  <p className="text-[11px] text-charcoal-400">{r.reviewedAt.toISOString().slice(0, 10)}</p>
                </li>
              ))}
            </ul>
          </div>
        )}

        {(artefact.status === "PENDING_REVIEW" || artefact.status === "UNDER_REVIEW") && (
          <div className="card mt-6 p-6">
            <h2 className="font-serif text-lg text-forest-900">Decision</h2>
            <p className="mt-1 text-xs text-charcoal-500">Reject requires a reason; approve validates the document.</p>
            <div className="mt-4">
              <ArtefactReviewActions artefactId={artefact.id} />
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
