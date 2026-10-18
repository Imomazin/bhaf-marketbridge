import Stripe from "stripe";

if (!process.env.STRIPE_SECRET_KEY) {
  console.warn("Missing STRIPE_SECRET_KEY in environment variables. Stripe integration will fail.");
}

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY ?? "", {
  apiVersion: "2025-02-24.acacia" as any, // Adjust to the latest or project-specific version
  appInfo: {
    name: "BHAF MarketBridge",
    version: "0.1.0",
  },
});
