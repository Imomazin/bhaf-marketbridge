import Link from "next/link";
import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { prisma, DB_ENABLED } from "@/lib/db";
import { CancelSubscriptionButton } from "@/components/billing/CancelSubscriptionButton";
import { cn } from "@/lib/utils";

export const metadata = { title: "Billing · BHAF MarketBridge" };
export const dynamic = "force-dynamic";

const statusTone: Record<string, string> = {
  ACTIVE: "bg-forest-50 text-forest-800 border-forest-200",
  TRIALING: "bg-gold-50 text-gold-800 border-gold-200",
  PAST_DUE: "bg-red-50 text-red-700 border-red-200",
  CANCELED: "bg-cream-100 text-charcoal-600 border-cream-300",
  UNPAID: "bg-red-50 text-red-700 border-red-200",
  INCOMPLETE: "bg-cream-100 text-charcoal-600 border-cream-300",
};

const invoiceTone: Record<string, string> = {
  PAID: "bg-forest-50 text-forest-800",
  PENDING: "bg-gold-50 text-gold-800",
  FAILED: "bg-red-50 text-red-700",
  REFUNDED: "bg-cream-100 text-charcoal-600",
};

export default async function BillingDashboardPage() {
  const session = await auth();
  if (!session?.user) redirect("/auth/sign-in?next=/billing/dashboard");

  let subscriptions: Array<{
    id: string;
    plan: string;
    amountUsdCents: number;
    status: string;
    provider: string;
    currentPeriodEnd: Date | null;
    cancelAtPeriodEnd: boolean;
  }> = [];
  let invoices: Array<{
    id: string;
    description: string | null;
    amountUsdCents: number;
    currency: string;
    provider: string;
    status: string;
    paidAt: Date | null;
    createdAt: Date;
  }> = [];

  if (DB_ENABLED && prisma) {
    [subscriptions, invoices] = await Promise.all([
      prisma.subscription.findMany({
        where: { userId: session.user.id },
        orderBy: { createdAt: "desc" },
      }),
      prisma.invoice.findMany({
        where: { userId: session.user.id },
        orderBy: { createdAt: "desc" },
        take: 20,
      }),
    ]);
  }

  return (
    <section className="bg-cream-50 py-12 md:py-16">
      <div className="container-edge max-w-4xl">
        <Link href="/billing" className="text-xs font-medium text-forest-700 hover:text-gold-700">
          ← All plans
        </Link>
        <p className="mt-4 text-[11px] font-semibold uppercase tracking-[0.18em] text-gold-700">Billing</p>
        <h1 className="mt-2 font-serif text-3xl text-forest-900 md:text-4xl">Your subscriptions</h1>
        <p className="mt-2 text-sm text-charcoal-500">
          Manage active plans, see payment history and cancel anytime — cancellations take effect at the end of
          the current billing period.
        </p>

        <div className="mt-10">
          <h2 className="font-serif text-lg text-forest-900">Active plans</h2>
          {subscriptions.length === 0 && (
            <div className="card mt-4 p-8 text-center text-sm text-charcoal-500">
              No active subscriptions yet.{" "}
              <Link href="/billing" className="font-medium text-forest-800 underline">Pick a plan</Link>.
            </div>
          )}
          <div className="mt-4 grid gap-3">
            {subscriptions.map((s) => (
              <div key={s.id} className="card flex flex-wrap items-center justify-between gap-4 p-5">
                <div>
                  <p className="font-serif text-base text-forest-900">{s.plan}</p>
                  <p className="text-xs text-charcoal-500">
                    ${(s.amountUsdCents / 100).toLocaleString()}/year · {s.provider}
                    {s.currentPeriodEnd && <> · renews {s.currentPeriodEnd.toISOString().slice(0, 10)}</>}
                  </p>
                  {s.cancelAtPeriodEnd && (
                    <p className="mt-1 text-[11px] text-gold-800">
                      Will cancel at period end.
                    </p>
                  )}
                </div>
                <div className="flex items-center gap-3">
                  <span className={cn("rounded-full border px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wider", statusTone[s.status])}>
                    {s.status.toLowerCase()}
                  </span>
                  {!s.cancelAtPeriodEnd && s.status === "ACTIVE" && (
                    <CancelSubscriptionButton subscriptionId={s.id} />
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-12">
          <h2 className="font-serif text-lg text-forest-900">Payment history</h2>
          {invoices.length === 0 && (
            <p className="mt-4 text-sm text-charcoal-500">No invoices yet.</p>
          )}
          <div className="mt-4 overflow-hidden rounded-2xl border border-cream-200 bg-white">
            <table className="w-full text-left text-sm">
              <thead className="bg-cream-100 text-[10px] uppercase tracking-wider text-charcoal-500">
                <tr>
                  <th className="px-4 py-3 font-semibold">Date</th>
                  <th className="px-4 py-3 font-semibold">Description</th>
                  <th className="px-4 py-3 font-semibold">Provider</th>
                  <th className="px-4 py-3 font-semibold">Amount</th>
                  <th className="px-4 py-3 font-semibold">Status</th>
                </tr>
              </thead>
              <tbody>
                {invoices.map((i) => (
                  <tr key={i.id} className="border-t border-cream-200">
                    <td className="px-4 py-3 text-xs text-charcoal-500">
                      {(i.paidAt ?? i.createdAt).toISOString().slice(0, 10)}
                    </td>
                    <td className="px-4 py-3 text-sm text-forest-900">{i.description ?? "—"}</td>
                    <td className="px-4 py-3 text-xs text-charcoal-500">{i.provider}</td>
                    <td className="px-4 py-3 text-xs text-forest-900">
                      ${(i.amountUsdCents / 100).toLocaleString()}
                    </td>
                    <td className="px-4 py-3">
                      <span className={cn("rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider", invoiceTone[i.status])}>
                        {i.status.toLowerCase()}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </section>
  );
}
