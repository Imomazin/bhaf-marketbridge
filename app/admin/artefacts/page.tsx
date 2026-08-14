import Link from "next/link";
import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { DB_ENABLED } from "@/lib/db";
import { listPendingArtefacts } from "@/lib/queries/artefactReview";

export const metadata = { title: "Artefacts awaiting review · BHAF Admin" };
export const dynamic = "force-dynamic";

export default async function AdminArtefactsPage() {
  const session = await auth();
  if (!session?.user) redirect("/auth/sign-in?next=/admin/artefacts");
  if (session.user.role !== "ADMIN" && session.user.role !== "AUDITOR") redirect("/");

  const rows = DB_ENABLED ? await listPendingArtefacts() : [];

  return (
    <section className="bg-cream-50 py-12 md:py-16">
      <div className="container-edge max-w-4xl">
        <Link href="/admin" className="text-xs font-medium text-forest-700 hover:text-gold-700">
          ← Admin dashboard
        </Link>
        <p className="mt-4 text-[11px] font-semibold uppercase tracking-[0.18em] text-gold-700">Admin</p>
        <h1 className="mt-2 font-serif text-3xl text-forest-900 md:text-4xl">Artefacts awaiting review</h1>
        <p className="mt-2 text-sm text-charcoal-500">
          Documents uploaded by entrepreneurs, funders and corporates, pending validation.
        </p>

        {!DB_ENABLED && (
          <div className="card mt-8 p-6 text-sm text-charcoal-500">
            Database not configured — artefact review runs against live data only.
          </div>
        )}

        {DB_ENABLED && rows.length === 0 && (
          <div className="card mt-8 p-10 text-center text-sm text-charcoal-500">Nothing waiting on review right now.</div>
        )}

        {rows.length > 0 && (
          <ul className="mt-6 space-y-3">
            {rows.map((row) => (
              <li key={row.id} className="card flex flex-wrap items-center gap-4 p-5">
                <div className="min-w-0 flex-1">
                  <p className="font-medium text-forest-900">{row.name}</p>
                  <p className="text-xs text-charcoal-500">
                    {row.category} · {row.userName} · {row.userEmail}
                  </p>
                  <p className="mt-1 text-[11px] text-charcoal-400">
                    Uploaded {row.uploadedAt.toISOString().slice(0, 10)} · {row.checksPassed}/{row.checksTotal} auto-checks passed
                  </p>
                </div>
                <Link
                  href={`/admin/artefacts/${row.id}`}
                  className="rounded-md border border-cream-300 px-3 py-1.5 text-xs font-medium text-charcoal-600 hover:border-forest-700 hover:text-forest-900"
                >
                  Review
                </Link>
              </li>
            ))}
          </ul>
        )}
      </div>
    </section>
  );
}
