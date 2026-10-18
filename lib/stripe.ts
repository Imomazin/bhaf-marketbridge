import Stripe from "stripe";

const apiKey = process.env.STRIPE_SECRET_KEY || "sk_test_placeholder_for_build";

if (!process.env.STRIPE_SECRET_KEY) {
  console.warn("Missing STRIPE_SECRET_KEY in environment variables. Stripe integration will fail at runtime.");
}

export const stripe = new Stripe(apiKey, {
  apiVersion: "2025-02-24.acacia" as any, // Adjust to the latest or project-specific version
  appInfo: {
    name: "BHAF MarketBridge",
    version: "0.1.0",
  },
});
