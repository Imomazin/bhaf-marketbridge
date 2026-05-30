"use server";

import { auth } from "@/auth";
import { writeAudit } from "@/lib/audit";
import { createCheckoutSession, type CheckoutProvider } from "@/lib/integrations/payments";

export interface CheckoutActionResult {
  ok: boolean;
  url?: string;
  provider?: CheckoutProvider;
  ref?: string;
  message: string;
}

export async function startCheckout(input: {
  planId: string;
  planName: string;
  amountUsdCents: number;
  preferred?: CheckoutProvider;
}): Promise<CheckoutActionResult> {
  const session = await auth();
  if (!session?.user) return { ok: false, message: "Sign-in required." };

  const result = await createCheckoutSession(
    {
      userId: session.user.id,
      email: session.user.email ?? `${session.user.id}@unknown.example`,
      amountUsdCents: input.amountUsdCents,
      description: input.planName,
      plan: "corporate-licence",
    },
    input.preferred,
  );

  await writeAudit({
    actorId: session.user.id,
    actorLabel: session.user.email ?? session.user.id,
    action: `Checkout started · ${input.planName} · ${result.provider}`,
    entityType: "Plan",
    entityId: input.planId,
    metadata: { ref: result.ref, amountUsdCents: input.amountUsdCents },
  });

  return {
    ok: result.ok,
    url: result.url,
    provider: result.provider,
    ref: result.ref,
    message: result.message,
  };
}
