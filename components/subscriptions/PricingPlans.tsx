"use client";

import { useState } from "react";
import { createCheckoutSession } from "@/app/actions/subscription";
import { getProrationQuote } from "@/app/actions/proration";
import { SubscriptionPlan } from "@prisma/client";

export function PricingPlans({ plans, currentPlanId, isCancelled = false }: { plans: SubscriptionPlan[], currentPlanId: string | null, isCancelled?: boolean }) {
  const [loadingPlan, setLoadingPlan] = useState<string | null>(null);
  const [billingCycle, setBillingCycle] = useState<"month" | "year">("month");
  const [confirmPlan, setConfirmPlan] = useState<SubscriptionPlan | null>(null);
  const [quoteAmountCents, setQuoteAmountCents] = useState<number | null>(null);

  const handleUpgrade = async (plan: SubscriptionPlan) => {
    setLoadingPlan(plan.id);
    const quoteRes = await getProrationQuote(plan.id, billingCycle);
    if (quoteRes.ok && quoteRes.amountDueCents !== undefined) {
      setQuoteAmountCents(quoteRes.amountDueCents);
    } else {
      setQuoteAmountCents(null); // Fallback if no quote (e.g. going to checkout)
    }
    setLoadingPlan(null);
    setConfirmPlan(plan);
  };

  const confirmUpgrade = async () => {
    if (!confirmPlan) return;
    setLoadingPlan(confirmPlan.id);
    const res = await createCheckoutSession(confirmPlan.id, billingCycle);
    if (res.ok) {
      if (res.url) {
        window.location.href = res.url;
      } else {
        alert(res.message || "Plan switched successfully!");
        window.location.reload();
      }
    } else {
      alert(res.message || "Something went wrong.");
      setLoadingPlan(null);
      setConfirmPlan(null);
    }
  };

  const hasYearlyPlans = plans.some(p => p.yearlyPriceCents && p.yearlyPriceCents > 0);

  return (
    <div className="space-y-8">
      {hasYearlyPlans && (
        <div className="flex justify-center">
          <div className="bg-gray-100 p-1 rounded-xl inline-flex items-center space-x-1">
            <button
              onClick={() => setBillingCycle("month")}
              className={`px-6 py-2 rounded-lg text-sm font-semibold transition-colors ${billingCycle === "month" ? "bg-white shadow-sm text-forest-900" : "text-gray-500 hover:text-gray-900"}`}
            >
              Monthly
            </button>
            <button
              onClick={() => setBillingCycle("year")}
              className={`px-6 py-2 rounded-lg text-sm font-semibold transition-colors ${billingCycle === "year" ? "bg-white shadow-sm text-forest-900" : "text-gray-500 hover:text-gray-900"}`}
            >
              Yearly (Save 20%)
            </button>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {plans.map((plan) => {
          const priceCents = billingCycle === "year" && plan.yearlyPriceCents ? plan.yearlyPriceCents : plan.monthlyPriceCents;
          const currentPlan = plans.find(p => p.id === currentPlanId);
          const currentPlanPrice = currentPlan ? (billingCycle === "year" && currentPlan.yearlyPriceCents ? currentPlan.yearlyPriceCents : currentPlan.monthlyPriceCents) : 0;
          const isDowngrade = priceCents < currentPlanPrice;
          
          return (
          <div key={plan.id} className={`border rounded-lg p-6 shadow-sm flex flex-col relative overflow-hidden ${plan.id === currentPlanId ? 'border-forest-600 bg-forest-50' : 'bg-white'}`}>
            {plan.id === currentPlanId && isCancelled && (
              <div className="absolute top-0 right-0 bg-red-100 text-red-700 text-[10px] font-bold px-3 py-1 uppercase tracking-wider rounded-bl-lg border-b border-l border-red-200">
                Cancelled
              </div>
            )}
            <h3 className="text-xl font-bold text-forest-900">{plan.name}</h3>
            <p className="mt-4 text-3xl font-extrabold text-forest-900">
              ₦{(priceCents / 100).toFixed(2)}
              <span className="text-sm font-medium text-charcoal-500">/{billingCycle === "year" ? "yr" : "mo"}</span>
            </p>
          <ul className="mt-6 space-y-4 flex-1">
            {Object.entries(plan.features as any).map(([feature, limit]) => {
              const formattedFeature = feature.replace(/([A-Z])/g, ' $1').trim().replace(/^./, (str) => str.toUpperCase());
              const isBoolean = String(limit).toLowerCase() === 'true' || String(limit).toLowerCase() === 'false';
              
              if (isBoolean && String(limit).toLowerCase() === 'false') return null;
              
              return (
              <li key={feature} className="flex items-center text-sm text-charcoal-700">
                <svg className="h-5 w-5 text-forest-600 mr-2 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
                {isBoolean ? (
                  <span className="font-medium">{formattedFeature} Included</span>
                ) : (
                  <span><span className="font-medium">{formattedFeature}:</span> {String(limit)}</span>
                )}
              </li>
              );
            })}
          </ul>
          <div className="mt-8">
            {plan.id === currentPlanId ? (
              isCancelled ? (
                <button
                  onClick={() => handleUpgrade(plan)}
                  disabled={loadingPlan === plan.id}
                  className="w-full btn-primary bg-forest-700 hover:bg-forest-800"
                >
                  {loadingPlan === plan.id ? "Loading..." : "Resubscribe"}
                </button>
              ) : (
                <button disabled className="w-full btn-secondary opacity-50 cursor-not-allowed">
                  Current Plan
                </button>
              )
            ) : isDowngrade ? (
              <button
                onClick={() => {
                  alert("To downgrade your plan, please click 'Manage Subscription' above. Downgrades take effect at the end of your current billing cycle.");
                }}
                className="w-full btn-secondary border-forest-600 text-forest-700 hover:bg-forest-50"
              >
                Downgrade
              </button>
            ) : (
              <button
                onClick={() => handleUpgrade(plan)}
                disabled={loadingPlan === plan.id}
                className="w-full btn-primary"
              >
                {loadingPlan === plan.id ? "Loading..." : "Switch to this plan"}
              </button>
            )}
          </div>
        </div>
        );
      })}
      </div>

      {confirmPlan && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
          <div className="bg-white p-6 md:p-8 rounded-xl shadow-xl w-full max-w-sm space-y-6 text-center">
            <h3 className="text-xl font-serif font-bold text-forest-900">
              {confirmPlan.id === currentPlanId ? "Confirm Resubscription" : "Confirm Switch"}
            </h3>
            <p className="text-gray-600 text-sm">
              Are you sure you want to {confirmPlan.id === currentPlanId ? "resubscribe to" : "switch your subscription to"} the <strong>{confirmPlan.name}</strong> plan?
            </p>
            {quoteAmountCents !== null && quoteAmountCents > 0 && (
              <div className="bg-forest-50 p-4 rounded-lg mt-4 text-forest-900">
                <p className="font-semibold mb-1">Due today:</p>
                <p className="text-2xl font-bold">₦{(quoteAmountCents / 100).toFixed(2)}</p>
                <p className="text-xs text-forest-700 mt-2">
                  This is the prorated difference for the remainder of your billing cycle. Your card on file will be charged immediately.
                </p>
              </div>
            )}
            <div className="flex justify-center gap-3">
              <button 
                onClick={() => setConfirmPlan(null)} 
                className="px-6 py-2 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50 font-medium"
              >
                No, cancel
              </button>
              <button 
                onClick={confirmUpgrade} 
                disabled={loadingPlan === confirmPlan.id}
                className="px-6 py-2 rounded-lg bg-forest-800 text-white hover:bg-forest-900 font-medium disabled:opacity-50"
              >
                {loadingPlan === confirmPlan.id 
                  ? "Processing..." 
                  : (confirmPlan.id === currentPlanId ? "Yes, resubscribe" : "Yes, switch plan")}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
