import Link from "next/link";

export const metadata = { title: "Sandbox checkout · BHAF MarketBridge" };

export default function StubCheckoutPage({
  params,
  searchParams,
}: {
  params: { ref: string };
  searchParams: { amount?: string; desc?: string };
}) {
  const amount = searchParams.amount ? Number(searchParams.amount) / 100 : 0;
  return (
    <section className="bg-cream-50 py-16">
      <div className="container-edge max-w-xl">
        <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-gold-700">Sandbox checkout</p>
        <h1 className="mt-2 font-serif text-3xl text-forest-900">No payment provider connected</h1>
        <p className="mt-3 text-sm text-charcoal-500">
          This is a sandbox checkout. Connect a real payment provider (Stripe, Paystack or Flutterwave) by setting
          their env vars on Vercel, and this page will be replaced with the provider's hosted checkout.
        </p>

        <div className="card mt-8 p-6">
          <p className="text-xs text-charcoal-500">Reference</p>
          <p className="mt-1 font-mono text-sm text-forest-900">{params.ref}</p>
          <p className="mt-4 text-xs text-charcoal-500">Description</p>
          <p className="mt-1 text-sm text-forest-900">{searchParams.desc ?? "—"}</p>
          <p className="mt-4 text-xs text-charcoal-500">Amount</p>
          <p className="mt-1 font-serif text-2xl text-forest-900">${amount.toLocaleString()}</p>

          <Link href="/portal" className="btn-primary mt-6 inline-block !py-2 !px-4 text-xs">
            ← Back to my workspace
          </Link>
        </div>

        <div className="mt-8 rounded-xl border border-gold-200 bg-gold-50 p-4 text-xs text-gold-900">
          <p className="font-semibold uppercase tracking-wide">Required to enable real checkout</p>
          <ul className="mt-2 list-disc space-y-1 pl-5">
            <li><code>STRIPE_SECRET_KEY</code> + <code>STRIPE_PUBLISHABLE_KEY</code> — global card</li>
            <li><code>PAYSTACK_SECRET_KEY</code> + <code>PAYSTACK_PUBLIC_KEY</code> — best for NG / GH / KE / ZA</li>
            <li><code>FLUTTERWAVE_SECRET_KEY</code> + <code>FLUTTERWAVE_PUBLIC_KEY</code> — broadest African coverage incl. M-Pesa</li>
          </ul>
        </div>
      </div>
    </section>
  );
}
