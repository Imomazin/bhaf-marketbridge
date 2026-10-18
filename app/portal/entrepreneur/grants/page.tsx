"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { getEntrepreneurGrants, createDemoGrant } from "@/app/actions/grants";

export default function GrantsPage() {
  const [grants, setGrants] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchGrants = async () => {
    setLoading(true);
    const res = await getEntrepreneurGrants();
    if (res.ok) setGrants(res.data);
    setLoading(false);
  };

  useEffect(() => {
    fetchGrants();
  }, []);

  return (
    <div className="max-w-5xl mx-auto space-y-8">
      <Link href="/portal/entrepreneur" className="text-sm font-semibold text-gray-500 hover:text-gray-900 inline-flex items-center gap-1">
        ← Back to Dashboard
      </Link>
      <div className="flex justify-between items-center mt-2">
        <div>
          <h1 className="text-2xl font-serif text-forest-900 font-bold">Grants & Progress Tracking</h1>
          <p className="text-charcoal-500 mt-1">Manage your active grants, submit progress reports, and track financials.</p>
        </div>
      </div>

      {loading ? (
        <div className="p-8 text-center text-gray-500">Loading your grants...</div>
      ) : grants.length === 0 ? (
        <div className="bg-white border rounded-xl p-12 text-center shadow-sm">
          <h2 className="text-lg font-semibold text-gray-900">No Grants Found</h2>
          <p className="text-gray-500 mt-2">You don't have any active grants assigned to your profile yet.</p>
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2">
          {grants.map((grant) => (
            <div key={grant.id} className="bg-white border rounded-xl p-6 shadow-sm flex flex-col justify-between hover:shadow-md transition">
              <div>
                <div className="flex justify-between items-start mb-4">
                  <span className={`px-3 py-1 rounded-full text-xs font-semibold ${grant.status === "ACTIVE" ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-800"}`}>
                    {grant.status}
                  </span>
                  <span className="text-sm text-gray-500">
                    {new Date(grant.createdAt).toLocaleDateString()}
                  </span>
                </div>
                <h3 className="font-bold text-lg text-forest-900 mb-2">{grant.title}</h3>
                <p className="text-2xl font-extrabold text-forest-900">
                  ${grant.amountUsd.toLocaleString()}
                </p>
              </div>
              <div className="mt-6 pt-4 border-t border-gray-100 flex items-center justify-between">
                <div className="text-xs text-gray-500 space-x-3">
                  <span className="flex items-center gap-1">
                    <svg className="w-4 h-4 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                    {grant.progressReports?.length || 0} Reports
                  </span>
                  <span className="flex items-center gap-1">
                    <svg className="w-4 h-4 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                    </svg>
                    {grant.beneficiaries?.length || 0} Beneficiaries
                  </span>
                </div>
                <Link href={`/portal/entrepreneur/grants/${grant.id}`} className="text-sm font-semibold text-forest-600 hover:text-forest-800">
                  Manage Grant →
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
