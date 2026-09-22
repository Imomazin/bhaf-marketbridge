import { getSubscriptionPlans, verifyAndFulfillSession } from "@/app/actions/subscription";
import { PricingPlans } from "@/components/subscriptions/PricingPlans";
import { ManageSubscriptionButton } from "@/components/subscriptions/ManageSubscriptionButton";
import { auth as getUserSession } from "@/auth";
import { prisma } from "@/lib/db";

export const metadata = { title: "Billing & Plans" };
export const dynamic = "force-dynamic";

export default async function BillingPage({
  searchParams,
}: {
  searchParams: Promise<{ session_id?: string }>;
}) {
  const session = await getUserSession();
  const params = await searchParams;
  
  if (params.session_id) {
    await verifyAndFulfillSession(params.session_id);
  }

  const plans = await getSubscriptionPlans();
  
  let currentPlanId = null;
  let currentPlanName = "None";
  let isCancelled = false;

  if (session?.user) {
    const activeSub = await prisma.subscription.findFirst({
      where: { 
        userId: session.user.id, 
        status: { in: ["ACTIVE", "CANCELED"] } 
      },
      orderBy: { createdAt: "desc" }
    });
    
    if (activeSub) {
      currentPlanId = activeSub.planId;
      currentPlanName = activeSub.plan;
      isCancelled = activeSub.status === "CANCELED" || activeSub.cancelAtPeriodEnd;
    } else {
      const freePlan = plans.find(p => p.tier === "FREE");
      if (freePlan) {
        currentPlanId = freePlan.id;
        currentPlanName = freePlan.name;
      }
    }
  }

  return (
    <div className="p-8 max-w-7xl mx-auto">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-serif text-forest-900 mb-2">Billing & Plans</h1>
          <p className="text-charcoal-600 flex items-center gap-2">
            Your current active plan is: <span className="font-bold text-forest-700">{currentPlanName}</span>
            {isCancelled && (
              <span className="inline-block px-2 py-0.5 text-[10px] font-bold tracking-wider text-red-700 bg-red-100 border border-red-200 rounded-full uppercase">
                Cancelled
              </span>
            )}
          </p>
        </div>
        
        {currentPlanId && currentPlanName !== "None" && (
          <ManageSubscriptionButton />
        )}
      </div>

      <div className="mt-12">
        <h2 className="text-xl font-bold text-forest-900 mb-6">Available Plans</h2>
        {plans.length === 0 ? (
          <p className="text-charcoal-500">No plans are currently available for your account type.</p>
        ) : (
          <PricingPlans plans={plans as any} currentPlanId={currentPlanId} isCancelled={isCancelled} />
        )}
      </div>
    </div>
  );
}
