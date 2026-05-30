import Link from "next/link";
import { redirect } from "next/navigation";
import { prisma, DB_ENABLED } from "@/lib/db";
import { verifyTransaction } from "@/lib/integrations/paystack";

export const metadata = { title: "Payment status · BHAF MarketBridge" };
export const dynamic = "force-dynamic";

export default async function BillingReturnPage({ searchParams }: { searchParams: { ref?: string; reference?: string; trxref?: string } }) {
  const ref = searchParams.ref ?? searchParams.reference ?? searchParams.trxref;
  if (!ref) redirect("/billing/dashboard");

  let outcome: "success" | "pending" | "failed" | "unknown" = "unknown";
  let detail = "";

  if (process.env.PAYSTACK_SECRET_KEY) {
    const v = await verifyTransaction(ref);
    if (v.ok && v.status === "success") {
      outcome = "success";
      detail = `Payment of ${(v.amountSmallest ?? 0) / 100} ${v.currency ?? ""} confirmed by Paystack.`;
    } else if (v.ok && v.status === "pending") {
      outcome = "pending";
      detail = "Payment is pending. We'll email you once it settles.";
    } else {
      outcome = "failed";
      detail = v.message || `Status: ${v.status ?? "unknown"}`;
    }
  }

  // Mirror to local DB in case webhook hasn't arrived yet
  if (outcome === "success" && DB_ENABLED && prisma) {
    const inv = await prisma.invoice.findFirst({ where: { providerReference: ref } });
    if (inv && inv.status !== "PAID") {
      await prisma.invoice.update({
        where: { id: inv.id },
        data: { status: "PAID", paidAt: new Date(), providerInvoiceId: ref },
      });
    }
  }

  return (
    <section className="bg-cream-50 py-16">
      <div className="container-edge max-w-xl">
        <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-gold-700">Billing</p>
        <h1 className="mt-2 font-serif text-3xl text-forest-900">
          {outcome === "success" ? "Payment received" : outcome === "pending" ? "Payment pending" : "Payment status"}
        </h1>
        <p className="mt-3 text-sm text-charcoal-500">{detail || "We're confirming your payment status."}</p>

        <div className="card mt-8 p-6">
          <p className="text-xs text-charcoal-500">Reference</p>
          <p className="mt-1 font-mono text-sm text-forest-900">{ref}</p>
        </div>

        <div className="mt-6 flex gap-3">
          <Link href="/billing/dashboard" className="btn-primary !py-2 !px-4 text-xs">Go to billing →</Link>
          <Link href="/portal" className="btn-secondary !py-2 !px-4 text-xs">My workspace</Link>
        </div>
      </div>
    </section>
  );
}
