"use client";

import { useState } from "react";
import { format } from "date-fns";

export function SubscribersManager({ subscribers }: { subscribers: any[] }) {
  const [searchTerm, setSearchTerm] = useState("");

  const filteredSubscribers = subscribers.filter(sub => {
    const term = searchTerm.toLowerCase();
    return (
      sub.user?.name?.toLowerCase().includes(term) ||
      sub.user?.email?.toLowerCase().includes(term) ||
      sub.plan.toLowerCase().includes(term)
    );
  });

  return (
    <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 mt-12">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6">
        <div>
          <h2 className="text-xl font-bold text-forest-900">Active Subscribers</h2>
          <p className="text-sm text-gray-500 mt-1">
            Total: {subscribers.length} subscriber(s)
          </p>
        </div>
        <div className="mt-4 sm:mt-0 w-full sm:w-auto">
          <input
            type="text"
            placeholder="Search by name, email, or plan..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full sm:w-64 px-4 py-2 border rounded-md focus:ring-2 focus:ring-forest-500 outline-none"
          />
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead className="bg-gray-50 text-gray-700">
            <tr>
              <th className="px-4 py-3 font-medium">User Details</th>
              <th className="px-4 py-3 font-medium">Plan</th>
              <th className="px-4 py-3 font-medium">Status</th>
              <th className="px-4 py-3 font-medium">Amount</th>
              <th className="px-4 py-3 font-medium">Subscribed Date</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {filteredSubscribers.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-4 py-8 text-center text-gray-500">
                  No subscribers found.
                </td>
              </tr>
            ) : (
              filteredSubscribers.map((sub) => (
                <tr key={sub.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3">
                    <div className="font-medium text-gray-900">{sub.user?.name || "Unknown"}</div>
                    <div className="text-gray-500 text-xs">{sub.user?.email}</div>
                  </td>
                  <td className="px-4 py-3">
                    <span className="inline-block px-2 py-1 bg-forest-50 text-forest-700 text-xs rounded-full font-medium">
                      {sub.plan}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <span className={`inline-block px-2 py-1 text-xs rounded-full font-medium ${
                      sub.status === 'ACTIVE' ? 'bg-green-100 text-green-700' : 
                      sub.status === 'CANCELED' ? 'bg-red-100 text-red-700' : 
                      'bg-yellow-100 text-yellow-700'
                    }`}>
                      {sub.status}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-gray-700">
                    ₦{(sub.amountUsdCents / 100).toFixed(2)}
                  </td>
                  <td className="px-4 py-3 text-gray-500 text-xs">
                    {format(new Date(sub.createdAt), "MMM d, yyyy")}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
