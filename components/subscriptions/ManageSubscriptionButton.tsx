"use client";

import { useState } from "react";
import { createCustomerPortalSession } from "@/app/actions/subscription";

export function ManageSubscriptionButton() {
  const [loading, setLoading] = useState(false);

  const handleManage = async () => {
    setLoading(true);
    const res = await createCustomerPortalSession();
    if (res.ok && res.url) {
      window.location.href = res.url;
    } else {
      alert(res.message || "Failed to load portal.");
      setLoading(false);
    }
  };

  return (
    <button
      onClick={handleManage}
      disabled={loading}
      className="px-4 py-2 bg-charcoal-100 text-charcoal-800 text-sm font-semibold rounded-lg hover:bg-charcoal-200 transition-colors disabled:opacity-50"
    >
      {loading ? "Loading..." : "Manage Subscription"}
    </button>
  );
}
