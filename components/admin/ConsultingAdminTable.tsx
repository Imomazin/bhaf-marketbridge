"use client";

import { useState } from "react";
import { ConsultingRequestDetailModal } from "@/components/admin/ConsultingRequestDetailModal";
import { cn } from "@/lib/utils";
import type { ConsultingRequest } from "@prisma/client";

const statusTone: Record<string, string> = {
  SUBMITTED: "bg-blue-50 text-blue-800 border-blue-200",
  REPLIED: "bg-green-50 text-green-800 border-green-200",
  ARCHIVED: "bg-gray-50 text-gray-700 border-gray-200",
};

export function ConsultingAdminTable({
  requests,
}: {
  requests: ConsultingRequest[];
}) {
  const [activeRequest, setActiveRequest] = useState<ConsultingRequest | null>(null);

  return (
    <>
      <div className="card mt-6 overflow-x-auto p-0">
        <table className="w-full min-w-[700px] text-left text-sm">
          <thead>
            <tr className="border-b border-cream-200 text-[11px] uppercase tracking-wide text-charcoal-400">
              <th className="px-4 py-3">Organization & Contact</th>
              <th className="px-4 py-3">Service Type</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3">Date</th>
              <th className="px-4 py-3 text-right">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-cream-200">
            {requests.map((r) => (
              <tr key={r.id} className="hover:bg-cream-50/50 transition">
                <td className="px-4 py-3">
                  <span className="font-medium text-forest-900">{r.orgName}</span>
                  <span className="block text-xs text-charcoal-500">
                    {r.name} · {r.email}
                  </span>
                </td>
                <td className="px-4 py-3 text-charcoal-800">
                  {r.serviceType}
                </td>
                <td className="px-4 py-3">
                  <span
                    className={cn(
                      "rounded-full border px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wider",
                      statusTone[r.status] ?? "bg-cream-100 text-charcoal-700",
                    )}
                  >
                    {r.status}
                  </span>
                </td>
                <td className="px-4 py-3 text-xs text-charcoal-400">
                  {new Date(r.createdAt).toLocaleDateString()}
                </td>
                <td className="px-4 py-3 text-right">
                  <button
                    type="button"
                    onClick={() => setActiveRequest(r)}
                    className="rounded-md border border-cream-300 bg-white px-3 py-1.5 text-xs font-medium text-forest-800 hover:border-forest-700 hover:bg-forest-50 transition"
                  >
                    View & Reply
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {activeRequest && (
        <ConsultingRequestDetailModal
          request={activeRequest}
          isOpen={Boolean(activeRequest)}
          onClose={() => setActiveRequest(null)}
        />
      )}
    </>
  );
}
