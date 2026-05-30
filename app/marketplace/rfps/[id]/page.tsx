import Link from "next/link";
import { notFound } from "next/navigation";
import { auth } from "@/auth";
import { prisma, DB_ENABLED } from "@/lib/db";
import { RfpResponseForm } from "@/components/rfps/RfpResponseForm";

export const dynamic = "force-dynamic";

export default async function RfpDetailPage({ params }: { params: { id: string } }) {
  if (!DB_ENABLED || !prisma) notFound();

  const session = await auth();
  const rfp = await prisma.rfp.findUnique({
    where: { id: params.id },
    include: {
      owner: { select: { name: true, corporateProfile: { select: { orgName: true } } } },
      responses: { where: session?.user ? { responderId: session.user.id } : { id: "__none__" }, take: 1 },
    },
  });
  if (!rfp) notFound();

  const myResponse = rfp.responses[0];

  return (
    <section className="bg-cream-50 py-12 md:py-16">
      <div className="container-edge max-w-3xl">
        <Link href="/marketplace/rfps" className="text-xs font-medium text-forest-700 hover:text-gold-700">
          ← Open RFPs
        </Link>
        <p className="mt-4 text-[11px] font-semibold uppercase tracking-[0.18em] text-gold-700">RFP</p>
        <h1 className="mt-2 font-serif text-3xl text-forest-900 md:text-4xl">{rfp.title}</h1>
        <p className="mt-1 text-sm text-charcoal-500">
          {rfp.owner.corporateProfile?.orgName ?? rfp.owner.name ?? "Corporate buyer"} · {rfp.category}
          {rfp.region && <> · {rfp.region}</>}
          {rfp.budgetUsd && <> · {rfp.budgetUsd}</>}
          {rfp.deadline && <> · closes {rfp.deadline.toISOString().slice(0, 10)}</>}
        </p>

        <article className="card mt-8 whitespace-pre-wrap p-6 text-sm leading-relaxed text-charcoal-700">
          {rfp.description}
        </article>

        <div className="mt-8">
          {!session?.user && (
            <p className="rounded-md border border-cream-200 bg-white p-4 text-sm text-charcoal-600">
              <Link href={`/auth/sign-in?next=/marketplace/rfps/${rfp.id}`} className="font-medium text-forest-800 underline">
                Sign in
              </Link>{" "}
              as an entrepreneur to respond.
            </p>
          )}
          {session?.user && session.user.role !== "ENTREPRENEUR" && session.user.role !== "ADMIN" && (
            <p className="rounded-md border border-cream-200 bg-white p-4 text-sm text-charcoal-600">
              Only entrepreneur accounts can respond to RFPs.
            </p>
          )}
          {session?.user && (session.user.role === "ENTREPRENEUR" || session.user.role === "ADMIN") && (
            myResponse ? (
              <div className="rounded-md border border-forest-200 bg-forest-50 p-4 text-sm text-forest-800">
                You've already responded to this RFP. Status: <strong>{myResponse.status.toLowerCase()}</strong>.
              </div>
            ) : (
              <RfpResponseForm rfpId={rfp.id} />
            )
          )}
        </div>
      </div>
    </section>
  );
}
