/**
 * Payments scaffolding — provider-agnostic wrapper.
 *
 * Two providers are wired with sandbox-safe stubs so the platform can
 * present subscription / payment UI immediately, and you can swap in
 * real keys once you've onboarded with each gateway.
 *
 *   Stripe — global card payments + subscriptions.
 *     STRIPE_SECRET_KEY, STRIPE_PUBLISHABLE_KEY
 *
 *   Paystack — strongest in Nigeria, Ghana, Kenya, ZA. Accepts cards
 *   AND mobile money AND bank transfer.
 *     PAYSTACK_SECRET_KEY, PAYSTACK_PUBLIC_KEY
 *
 *   Flutterwave — broadest African coverage incl. M-Pesa, MTN MoMo.
 *     FLUTTERWAVE_SECRET_KEY, FLUTTERWAVE_PUBLIC_KEY
 *
 * Until those keys are present, createCheckoutSession returns a synthetic
 * URL that lands on /billing/checkout/[ref] — a sandbox page that
 * simulates the user clicking "Pay" so we can prove the post-payment
 * webhook flow end-to-end.
 */

export type CheckoutProvider = "stripe" | "paystack" | "flutterwave" | "stub";

export interface CheckoutInput {
  userId: string;
  email: string;
  amountUsdCents: number; // canonical pricing in USD cents; converted by provider for African gateways
  currency?: string; // ISO 4217; defaults to USD for Stripe, local currency for Paystack/Flutterwave
  description: string;
  plan?: "corporate-licence" | "funder-subscription" | "marketplace-fee" | "certification" | "custom";
}

export interface CheckoutResult {
  ok: boolean;
  provider: CheckoutProvider;
  url?: string;
  ref?: string;
  message: string;
}

export function preferredProviderForCountry(country: string): CheckoutProvider {
  const c = country.toLowerCase();
  if (["nigeria", "ng", "ghana", "gh", "south africa", "za", "kenya", "ke"].some((x) => c.includes(x))) {
    return process.env.PAYSTACK_SECRET_KEY ? "paystack" : process.env.FLUTTERWAVE_SECRET_KEY ? "flutterwave" : "stub";
  }
  return process.env.STRIPE_SECRET_KEY ? "stripe" : "stub";
}

export async function createCheckoutSession(
  input: CheckoutInput,
  preferred?: CheckoutProvider,
): Promise<CheckoutResult> {
  const provider = preferred ?? preferredProviderForCountry("");
  const ref = `bm_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 8)}`;

  if (provider === "stripe" && process.env.STRIPE_SECRET_KEY) {
    // Real Stripe call goes here. Sketch:
    // const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);
    // const session = await stripe.checkout.sessions.create({...});
    return {
      ok: true,
      provider: "stripe",
      url: `https://checkout.stripe.example/${ref}`,
      ref,
      message: "Stripe checkout session created (sketch).",
    };
  }

  if (provider === "paystack" && process.env.PAYSTACK_SECRET_KEY) {
    // const res = await fetch("https://api.paystack.co/transaction/initialize", { ... })
    return {
      ok: true,
      provider: "paystack",
      url: `https://checkout.paystack.example/${ref}`,
      ref,
      message: "Paystack initialise (sketch).",
    };
  }

  if (provider === "flutterwave" && process.env.FLUTTERWAVE_SECRET_KEY) {
    return {
      ok: true,
      provider: "flutterwave",
      url: `https://checkout.flutterwave.example/${ref}`,
      ref,
      message: "Flutterwave hosted (sketch).",
    };
  }

  // Stub mode — bounce through our own sandbox checkout
  return {
    ok: true,
    provider: "stub",
    url: `/billing/checkout/${ref}?amount=${input.amountUsdCents}&desc=${encodeURIComponent(input.description)}`,
    ref,
    message:
      "No payment provider keys configured — using sandbox checkout. Add STRIPE_SECRET_KEY or PAYSTACK_SECRET_KEY or FLUTTERWAVE_SECRET_KEY to enable.",
  };
}

export const PRICING = {
  corporate: [
    { id: "corp-starter", name: "Corporate Starter", priceUsd: 25000, period: "/year", features: ["1 procurement seat", "Up to 25 shortlisted suppliers", "Quarterly ESG report"] },
    { id: "corp-pro", name: "Corporate Pro", priceUsd: 45000, period: "/year", features: ["5 procurement seats", "Unlimited shortlists", "Custom ESG framework alignment", "Dedicated BHAF analyst"] },
    { id: "corp-enterprise", name: "Corporate Enterprise", priceUsd: 90000, period: "/year", features: ["Unlimited seats", "Sponsored cohort", "SLA & audit pack", "Co-branded launches"] },
  ],
  funder: [
    { id: "fund-explorer", name: "Funder Explorer", priceUsd: 5000, period: "/year", features: ["Directory access", "10 shortlists / month", "Quarterly impact report"] },
    { id: "fund-active", name: "Funder Active", priceUsd: 12000, period: "/year", features: ["Unlimited shortlists", "Diligence data room", "Monthly cohort previews"] },
  ],
} as const;

export type PlanId = (typeof PRICING.corporate)[number]["id"] | (typeof PRICING.funder)[number]["id"];
