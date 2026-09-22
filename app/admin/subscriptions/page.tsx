import Link from "next/link";
import { getAdminSubscriptionPlans, getAdminSubscribers } from "@/app/actions/admin-subscriptions";
import { SubscriptionPlansManager } from "@/components/admin/SubscriptionPlansManager";
import { SubscribersManager } from "@/components/admin/SubscribersManager";

export const metadata = { title: "Manage Subscription Plans" };

export default async function AdminSubscriptionsPage() {
  const [resPlans, resSubs] = await Promise.all([
    getAdminSubscriptionPlans(),
    getAdminSubscribers()
  ]);

  if (!resPlans.ok) {
    return <div className="p-8 text-red-600">Failed to load plans: {resPlans.message}</div>;
  }

  return (
    <div className="p-8">
      <div className="mb-6">
        <Link href="/admin" className="text-sm font-semibold text-gray-500 hover:text-gray-900 inline-flex items-center gap-1">
          ← Back to Admin Dashboard
        </Link>
      </div>
      <h1 className="text-2xl font-serif text-forest-900 mb-6">Subscription Plans & Users</h1>
      <p className="text-charcoal-600 mb-8">
        Configure the plans available to your users, their limits, and monitor your active subscribers.
      </p>
      
      <SubscriptionPlansManager initialPlans={resPlans.data as any} />
      
      <SubscribersManager subscribers={resSubs.data as any} />
    </div>
  );
}
