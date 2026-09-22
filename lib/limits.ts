import { prisma } from "@/lib/db";
import { sendEmail } from "@/lib/email";

export type FeatureLimitKey = "maxDataRooms" | "maxDeals" | "maxRfPs" | "maxCohorts";

export async function checkLimitAndWarn(userId: string, featureKey: FeatureLimitKey, currentCount: number) {
  const activeSub = await prisma.subscription.findFirst({
    where: { userId, status: "ACTIVE" },
    include: { subscriptionPlan: true, user: true },
    orderBy: { createdAt: "desc" }
  });

  if (!activeSub || !activeSub.subscriptionPlan || !activeSub.user) {
    // If they have no subscription at all, assume they have 0 limits.
    return { ok: false, upgradeRequired: true, message: "No active subscription plan found." };
  }

  const features = activeSub.subscriptionPlan.features as Record<string, string>;
  const limitStr = features[featureKey];

  if (!limitStr) {
    // If the feature isn't defined in the plan, assume unlimited (or limited to 0 based on business logic, but let's assume unlimited if not set, or 0? Usually if not in features, it's 0)
    // Actually, let's assume if it's not set, they have 0 limit.
    return { ok: false, upgradeRequired: true, message: `Your current plan does not include ${featureKey}. Please upgrade.` };
  }

  const limit = parseInt(limitStr, 10);
  if (isNaN(limit)) {
    // If it's something like "unlimited", let them pass
    return { ok: true };
  }

  // Check if they exceed
  if (currentCount >= limit) {
    return { ok: false, upgradeRequired: true, message: `You have reached your limit of ${limit} for this feature. Please upgrade your plan.` };
  }

  // Check if it's their last slot
  if (currentCount === limit - 1) {
    // They are about to consume their last slot, send a warning email.
    // We don't await the email so it doesn't block the request.
    sendEmail({
      to: activeSub.user.email,
      subject: "Action Required: Approaching Plan Limit",
      body: `Hi ${activeSub.user.name},\n\nYou are about to consume the last available slot for ${featureKey} on your ${activeSub.plan} plan.\n\nOnce this is used, you will not be able to create any more unless you upgrade your plan. Please visit the billing page to explore upgrade options.`
    }).catch(console.error);
  }

  return { ok: true };
}
