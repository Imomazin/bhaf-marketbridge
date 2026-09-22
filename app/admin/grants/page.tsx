"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { getAllGrants, issueGrant, getEntrepreneurs } from "@/app/actions/grants";

export default function AdminGrantsPage() {
  const [grants, setGrants] = useState<any[]>([]);
  const [entrepreneurs, setEntrepreneurs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Form State
  const [title, setTitle] = useState("");
  const [amountUsd, setAmountUsd] = useState("");
  const [entrepreneurId, setEntrepreneurId] = useState("");

  const fetchData = async () => {
    setLoading(true);
    const [grantsRes, entRes] = await Promise.all([
      getAllGrants(),
      getEntrepreneurs()
    ]);
    if (grantsRes.ok) setGrants(grantsRes.data);
    if (entRes.ok) setEntrepreneurs(entRes.data);
    setLoading(false);
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleIssueGrant = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !amountUsd || !entrepreneurId) return;

    setIsSubmitting(true);
    const res = await issueGrant({
      title,
      amountUsd: parseInt(amountUsd),
      entrepreneurId,
    });

    if (res.ok) {
      alert("Grant issued successfully! The entrepreneur has been notified via email.");
      setIsModalOpen(false);
      setTitle("");
      setAmountUsd("");
      setEntrepreneurId("");
      fetchData();
    } else {
      alert(res.message || "Failed to issue grant.");
    }
    setIsSubmitting(false);
  };

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      <Link href="/admin" className="text-sm font-semibold text-gray-500 hover:text-gray-900 inline-flex items-center gap-1">
        ← Back to Admin Dashboard
      </Link>
      <div className="flex justify-between items-center mt-2">
        <div>
          <h1 className="text-2xl font-serif text-forest-900 font-bold">Grants Dashboard</h1>
          <p className="text-charcoal-500 mt-1">Manage and audit the grants you have issued.</p>
        </div>
        <button onClick={() => setIsModalOpen(true)} className="btn-primary text-sm px-6 py-2">
          + Issue New Grant
        </button>
      </div>

      {loading ? (
        <div className="p-8 text-center text-gray-500">Loading grants...</div>
      ) : grants.length === 0 ? (
        <div className="bg-white border rounded-xl p-12 text-center shadow-sm">
          <h2 className="text-lg font-semibold text-gray-900">No Grants Issued</h2>
          <p className="text-gray-500 mt-2">You haven't issued any grants yet.</p>
        </div>
      ) : (
        <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
          <table className="w-full text-left text-sm">
            <thead className="bg-gray-50 text-gray-600 border-b">
              <tr>
                <th className="p-4 font-semibold">Grant Title</th>
                <th className="p-4 font-semibold">Funder</th>
                <th className="p-4 font-semibold">Entrepreneur</th>
                <th className="p-4 font-semibold">Amount</th>
                <th className="p-4 font-semibold">Status</th>
                <th className="p-4 font-semibold">Issued Date</th>
                <th className="p-4 text-right font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y text-gray-700">
              {grants.map((grant) => (
                <tr key={grant.id} className="hover:bg-gray-50/50 transition">
                  <td className="p-4 font-medium text-forest-900">{grant.title}</td>
                  <td className="p-4">
                    <div className="font-medium">{grant.funder?.name || "System"}</div>
                    <div className="text-xs text-gray-500">{grant.funder?.email}</div>
                  </td>
                  <td className="p-4">
                    <div className="font-medium">{grant.entrepreneur?.name || "Unknown"}</div>
                    <div className="text-xs text-gray-500">{grant.entrepreneur?.email}</div>
                  </td>
                  <td className="p-4 font-bold">₦{grant.amountUsd.toLocaleString()}</td>
                  <td className="p-4">
                    <span className={`px-2 py-1 rounded-full text-xs font-semibold ${grant.status === "ACTIVE" ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-800"}`}>
                      {grant.status}
                    </span>
                  </td>
                  <td className="p-4 text-gray-500">{new Date(grant.createdAt).toLocaleDateString()}</td>
                  <td className="p-4 text-right">
                    <Link href={`/admin/grants/${grant.id}`} className="text-forest-600 hover:text-forest-800 font-semibold">
                      Review →
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Issue Grant Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden">
            <div className="p-6 border-b">
              <h2 className="text-xl font-bold text-gray-900">Issue New Grant</h2>
              <p className="text-sm text-gray-500 mt-1">Award funding to an entrepreneur on the platform.</p>
            </div>
            
            <form onSubmit={handleIssueGrant} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Select Entrepreneur</label>
                <select
                  required
                  value={entrepreneurId}
                  onChange={(e) => setEntrepreneurId(e.target.value)}
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-forest-500 outline-none"
                >
                  <option value="">-- Select an Entrepreneur --</option>
                  {entrepreneurs.map(ent => (
                    <option key={ent.id} value={ent.id}>{ent.name} ({ent.email})</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Grant Title / Purpose</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Clean Water Initiative 2026"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-forest-500 outline-none"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Amount (NGN)</label>
                <input
                  type="number"
                  required
                  min="1"
                  placeholder="50000"
                  value={amountUsd}
                  onChange={(e) => setAmountUsd(e.target.value)}
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-forest-500 outline-none"
                />
              </div>

              <div className="pt-4 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 text-sm font-semibold text-gray-600 hover:bg-gray-100 rounded-lg transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="btn-primary text-sm px-6 py-2 disabled:opacity-50"
                >
                  {isSubmitting ? "Issuing..." : "Issue Grant"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
