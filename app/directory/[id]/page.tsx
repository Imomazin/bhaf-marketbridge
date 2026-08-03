import Link from "next/link";
import { notFound } from "next/navigation";
import { auth } from "@/auth";
import { addEntrepreneurToShortlist } from "@/app/actions/funder";
import { ReadinessBadge } from "@/components/ui/ReadinessBadge";
import { hasSavedFunderShortlistEntry } from "@/lib/funderShortlists";
import { loadDirectoryEntrepreneurById } from "@/lib/queries/directory";
import { normalizeSearchParam } from "@/lib/searchParams";

export const dynamic = "force-dynamic";

export default async function DirectoryProfilePage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ shortlisted?: string | string[] }>;
}) {
  const [{ id }, resolvedSearchParams, session] = await Promise.all([params, searchParams, auth()]);
  const entrepreneur = await loadDirectoryEntrepreneurById(id);
  if (!entrepreneur) notFound();

  const shortlisted = normalizeSearchParam(resolvedSearchParams.shortlisted) === "1";
  const isFunder = session?.user?.role === "FUNDER";
  const alreadyShortlisted = isFunder
    ? await hasSavedFunderShortlistEntry(session.user.id, entrepreneur.id)
    : false;
  const returnTo = `/directory/${encodeURIComponent(entrepreneur.id)}`;

  return (
    <section className="bg-cream-50 py-12 md:py-16">
      <div className="container-edge max-w-5xl">
        <Link href="/directory" className="text-xs font-medium text-forest-700 hover:text-gold-700">
          ← Back to directory
        </Link>

        {shortlisted && (
          <div className="mt-6 rounded-xl border border-forest-200 bg-forest-50 px-4 py-3 text-sm text-forest-800">
            Added to <strong>My shortlist</strong>. You can view it in{" "}
            <Link href="/portal/funder/shortlists" className="font-medium underline">
              funder shortlists
            </Link>
            .
          </div>
        )}

        <div className="card mt-6 p-8">
          <div className="flex flex-wrap items-start justify-between gap-6">
            <div className="flex items-start gap-4">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-forest-800 font-serif text-xl text-cream-50">
                {entrepreneur.initials}
              </div>
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-gold-700">
                  Entrepreneur profile
                </p>
                <h1 className="mt-2 font-serif text-3xl text-forest-900 md:text-4xl">
                  {entrepreneur.businessName}
                </h1>
                <p className="mt-2 text-sm text-charcoal-500">
                  {entrepreneur.name} · {entrepreneur.country} · {entrepreneur.sector}
                </p>
              </div>
            </div>

            <div className="flex flex-col items-start gap-3 sm:items-end">
              <ReadinessBadge level={entrepreneur.readinessLevel} />
              {isFunder ? (
                alreadyShortlisted ? (
                  <div className="rounded-full border border-forest-200 bg-forest-50 px-3 py-2 text-xs font-semibold uppercase tracking-wide text-forest-800">
                    Already in My shortlist
                  </div>
                ) : (
                  <form action={addEntrepreneurToShortlist}>
                    <input type="hidden" name="entrepreneurId" value={entrepreneur.id} />
                    <input type="hidden" name="shortlistName" value="My shortlist" />
                    <input type="hidden" name="returnTo" value={returnTo} />
                    <button type="submit" className="btn-primary !px-4 !py-2 text-xs">
                      Add to shortlist
                    </button>
                  </form>
                )
              ) : session?.user ? (
                <p className="max-w-xs text-right text-xs text-charcoal-500">
                  Sign in as a funder to add entrepreneurs to a shortlist.
                </p>
              ) : (
                <Link href={`/auth/sign-in?next=${encodeURIComponent(returnTo)}`} className="btn-secondary !px-4 !py-2 text-xs">
                  Sign in as funder
                </Link>
              )}
            </div>
          </div>

          <div className="mt-8 grid gap-4 md:grid-cols-4">
            <article className="rounded-xl border border-cream-200 bg-cream-50 p-4">
              <p className="text-[10px] uppercase tracking-wide text-charcoal-400">Funding need</p>
              <p className="mt-2 text-sm font-medium text-forest-900">{entrepreneur.fundingNeed}</p>
            </article>
            <article className="rounded-xl border border-cream-200 bg-cream-50 p-4">
              <p className="text-[10px] uppercase tracking-wide text-charcoal-400">Women supported</p>
              <p className="mt-2 text-sm font-medium text-forest-900">{entrepreneur.womenSupported}</p>
            </article>
            <article className="rounded-xl border border-cream-200 bg-cream-50 p-4">
              <p className="text-[10px] uppercase tracking-wide text-charcoal-400">Jobs created</p>
              <p className="mt-2 text-sm font-medium text-forest-900">{entrepreneur.jobsCreated}</p>
            </article>
            <article className="rounded-xl border border-cream-200 bg-cream-50 p-4">
              <p className="text-[10px] uppercase tracking-wide text-charcoal-400">Year founded</p>
              <p className="mt-2 text-sm font-medium text-forest-900">{entrepreneur.yearFounded}</p>
            </article>
          </div>

          <div className="mt-8 grid gap-6 lg:grid-cols-[1.6fr_1fr]">
            <div className="space-y-6">
              <article>
                <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-gold-700">Business overview</p>
                <p className="mt-3 text-sm leading-relaxed text-charcoal-600">{entrepreneur.description}</p>
              </article>

              <article>
                <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-gold-700">ESG activity</p>
                <p className="mt-3 text-sm leading-relaxed text-charcoal-600">{entrepreneur.esgActivity}</p>
              </article>
            </div>

            <div className="space-y-6">
              <article>
                <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-gold-700">Products & services</p>
                <ul className="mt-3 space-y-2">
                  {entrepreneur.products.length > 0 ? (
                    entrepreneur.products.map((product) => (
                      <li key={product} className="rounded-lg border border-cream-200 bg-white px-3 py-2 text-sm text-forest-900">
                        {product}
                      </li>
                    ))
                  ) : (
                    <li className="rounded-lg border border-cream-200 bg-white px-3 py-2 text-sm text-charcoal-500">
                      No products listed yet.
                    </li>
                  )}
                </ul>
              </article>

              <article>
                <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-gold-700">Certifications</p>
                <ul className="mt-3 space-y-2">
                  {entrepreneur.certifications.length > 0 ? (
                    entrepreneur.certifications.map((certification) => (
                      <li
                        key={certification}
                        className="rounded-lg border border-cream-200 bg-white px-3 py-2 text-sm text-forest-900"
                      >
                        {certification}
                      </li>
                    ))
                  ) : (
                    <li className="rounded-lg border border-cream-200 bg-white px-3 py-2 text-sm text-charcoal-500">
                      No certifications listed yet.
                    </li>
                  )}
                </ul>
              </article>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
