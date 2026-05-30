import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { auth } from "@/auth";
import { prisma, DB_ENABLED } from "@/lib/db";
import { RfpResponseActions } from "@/components/rfps/RfpResponseActions";
import { cn } from "@/lib/utils";

export const dynamic = "force-dynamic";

const statusTone: Record<string, string> = {
  SUBMITTED: "bg-cream-100 text-charcoal-600 border-cream-300",
  SHORTLISTED: "bg-gold-50 text-gold-800 border-gold-200",
  REJECTED: "bg-red-50 text-red-700 border-red-200",
  AWARDED: "bg-forest-50 text-forest-800 border-forest-200",
  WITHDRAWN: "bg-cream-100 text-charcoal-500 border-cream-300",
};

export default async function CorporateRfpDetailPage({ params }: { params: { id: string } }) {
  const session = await auth();
  if (!session?.user) redirect(`/auth/sign-in?next=/portal/corporate/rfps/${params.id}`);
  if (!DB_ENABLED || !prisma) notFound();

  const rfp = await prisma.rfp.findUnique({
    where: { id: params.id },
    include: {
      responses: {
        include: {
          responder: { select: { name: true, email: true, entrepreneurProfile: { select: { businessName: true, country: true } } } },
        },
        orderBy: { createdAt: "desc" },
      },
    },
  });
  if (!rfp) notFound();
  if (rfp.ownerId !== session.user.id && session.user.role !== "ADMIN") notFound();

  return (
    <section className="bg-cream-50 py-12 md:py-16">
      <div className="container-edge max-w-4xl">
        <Link href="/portal/corporate" className="text-xs font-medium text-forest-700 hover:text-gold-700">
          ← Workspace
        </Link>
        <p className="mt-4 text-[11px] font-semibold uppercase tracking-[0.18em] text-gold-700">RFP</p>
        <h1 className="mt-2 font-serif text-3xl text-forest-900 md:text-4xl">{rfp.title}</h1>
        <p className="mt-1 text-sm text-charcoal-500">
          {rfp.category}
          {rfp.region && <> · {rfp.region}</>}
          {rfp.budgetUsd && <> · {rfp.budgetUsd}</>}
          {rfp.deadline && <> · closes {rfp.deadline.toISOString().slice(0, 10)}</>}
        </p>

        <h2 className="mt-10 font-serif text-lg text-forest-900">
          Responses {rfp.responses.length > 0 && <span className="text-gold-700">({rfp.responses.length})</span>}
        </h2>

        {rfp.responses.length === 0 && (
          <div className="card mt-4 p-10 text-center text-sm text-charcoal-500">No responses yet.</div>
        )}

        <ul className="mt-4 space-y-3">
          {rfp.responses.map((r) => (
            <li key={r.id} className="card p-5">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <p className="font-serif text-base text-forest-900">
                    {r.responder.entrepreneurProfile?.businessName ?? r.responder.name ?? r.responder.email}
                  </p>
                  <p className="text-xs text-charcoal-500">
                    {r.responder.name ?? "—"}
                    {r.responder.entrepreneurProfile?.country && <> · {r.responder.entrepreneurProfile.country}</>}
                  </p>
                  <p className="mt-1 text-[11px] text-charcoal-400">
                    {r.createdAt.toISOString().slice(0, 10)}
                  </p>
                </div>
                <span className={cn("rounded-full border px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wider", statusTone[r.status])}>
                  {r.status.toLowerCase()}
                </span>
              </div>
              <p className="mt-3 whitespace-pre-wrap rounded-md bg-cream-50 px-3 py-2 text-xs text-charcoal-700">
                {r.body}
              </p>
              {r.pricingNote && (
                <p className="mt-2 rounded-md bg-gold-50 px-3 py-2 text-xs text-gold-900">
                  <span className="font-semibold">Pricing:</span> {r.pricingNote}
                </p>
              )}
              <div className="mt-3">
                <RfpResponseActions responseId={r.id} currentStatus={r.status} />
              </div>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
