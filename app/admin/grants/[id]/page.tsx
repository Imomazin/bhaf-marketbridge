"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { getGrantByIdForManagement } from "@/app/actions/grants";

export default function AdminGrantDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const grantId = params.id as string;

  const [grant, setGrant] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchGrant() {
      const res = await getGrantByIdForManagement(grantId);
      if (res.ok && res.data) {
        setGrant(res.data);
      } else {
        alert("Grant not found or unauthorized");
        router.push("/admin/grants");
      }
      setLoading(false);
    }
    fetchGrant();
  }, [grantId, router]);

  if (loading) {
    return <div className="p-8 text-center text-gray-500">Loading grant details...</div>;
  }
  if (!grant) return null;

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      {/* Header */}
      <div className="bg-white p-8 rounded-2xl border shadow-sm flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <button onClick={() => router.push("/admin/grants")} className="text-sm font-semibold text-gray-500 hover:text-gray-900 mb-4 inline-flex items-center gap-1">
            ← Back to Grants
          </button>
          <div className="flex items-center gap-3 mb-2">
            <h1 className="text-3xl font-serif text-forest-900 font-bold">{grant.title}</h1>
            <span className={`px-3 py-1 rounded-full text-xs font-semibold ${grant.status === "ACTIVE" ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-800"}`}>
              {grant.status}
            </span>
          </div>
          <p className="text-charcoal-500">
            Issued to <span className="font-semibold text-gray-900">{grant.entrepreneur?.name}</span> ({grant.entrepreneur?.email})
          </p>
        </div>
        <div className="text-left md:text-right">
          <p className="text-sm text-gray-500 uppercase font-semibold tracking-wider">Total Funding</p>
          <p className="text-4xl font-extrabold text-forest-900">₦{grant.amountUsd.toLocaleString()}</p>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        
        {/* Left Column: Progress Reports */}
        <div className="lg:col-span-2 space-y-8">
          <section className="bg-white border rounded-2xl p-6 shadow-sm">
            <h2 className="text-xl font-bold text-gray-900 mb-6">Progress Reports</h2>
            
            <div className="space-y-6">
              {grant.progressReports?.length === 0 ? (
                <p className="text-gray-500 text-sm">No progress reports submitted yet.</p>
              ) : (
                grant.progressReports.map((report: any) => (
                  <div key={report.id} className="p-4 border rounded-xl bg-white shadow-sm flex flex-col gap-2">
                    <div className="flex justify-between text-xs text-gray-500 font-medium">
                      <span>{new Date(report.reportDate).toLocaleDateString()}</span>
                      <span className="text-forest-700">{report.status}</span>
                    </div>
                    {report.attachmentUrl && (
                      <a href={report.attachmentUrl} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1 text-sm font-semibold text-forest-700 hover:text-forest-900 border bg-forest-50 w-fit px-3 py-1.5 rounded-lg">
                        📄 View Attached Document ({report.attachmentName})
                      </a>
                    )}
                    {report.narrative && <p className="text-sm text-gray-800 leading-relaxed">{report.narrative}</p>}
                  </div>
                ))
              )}
            </div>
          </section>

          {/* Beneficiaries Table */}
          <section className="bg-white border rounded-2xl p-6 shadow-sm">
            <h2 className="text-xl font-bold text-gray-900 mb-6">Impact & Beneficiaries</h2>
            
            {grant.beneficiaries?.length === 0 ? (
              <p className="text-gray-500 text-sm">No beneficiaries logged yet.</p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm">
                  <thead className="bg-gray-50 text-gray-600 border-b">
                    <tr>
                      <th className="p-3 font-semibold">Name / Group</th>
                      <th className="p-3 font-semibold text-center">Headcount</th>
                      <th className="p-3 font-semibold">Impact Description</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y text-gray-700">
                    {grant.beneficiaries.map((b: any) => (
                      <tr key={b.id}>
                        <td className="p-3 font-medium text-gray-900">{b.name}</td>
                        <td className="p-3 text-center">{b.headcount}</td>
                        <td className="p-3 text-gray-600">{b.impactDescription}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </section>
        </div>

        {/* Right Column: Financials */}
        <div className="space-y-8">
          <section className="bg-white border rounded-2xl p-6 shadow-sm">
            <h2 className="text-xl font-bold text-gray-900 mb-6">Financial Log</h2>
            
            {grant.financialMetrics?.length === 0 ? (
              <p className="text-gray-500 text-sm">No financial metrics logged yet.</p>
            ) : (
              <div className="space-y-4">
                {grant.financialMetrics.map((fm: any) => (
                  <div key={fm.id} className="flex justify-between items-center p-4 border rounded-xl hover:bg-gray-50 transition">
                    <div>
                      <h4 className="font-semibold text-gray-900 text-sm">{fm.metricName}</h4>
                      <p className="text-xs text-gray-500">{new Date(fm.dateRecorded).toLocaleDateString()}</p>
                    </div>
                    <div className="font-bold text-forest-700">
                      ₦{fm.amountUsd.toLocaleString()}
                    </div>
                  </div>
                ))}
                
                <div className="pt-4 mt-4 border-t flex justify-between items-center text-sm">
                  <span className="font-bold text-gray-600">Total Tracked Spent</span>
                  <span className="font-extrabold text-gray-900 text-lg">
                    ₦{grant.financialMetrics.reduce((sum: number, fm: any) => sum + fm.amountUsd, 0).toLocaleString()}
                  </span>
                </div>
              </div>
            )}
          </section>
        </div>
      </div>
    </div>
  );
}
