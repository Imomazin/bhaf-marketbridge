"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { getGrantByIdForManagement } from "@/app/actions/grants";

export default function FunderGrantDetailsPage() {
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
        router.push("/portal/funder/grants");
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
          <button onClick={() => router.push("/portal/funder/grants")} className="text-sm font-semibold text-gray-500 hover:text-gray-900 mb-4 inline-flex items-center gap-1">
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
          {/* Direct Message Log & Form */}
          <section className="bg-white border rounded-2xl p-6 shadow-sm">
            <h2 className="text-xl font-bold text-gray-900 mb-6">Direct Messages</h2>
            
            <div className="space-y-4 mb-6 max-h-96 overflow-y-auto pr-2">
              {(!grant.messages || grant.messages.length === 0) ? (
                <p className="text-gray-500 text-sm">No messages yet. Start a conversation!</p>
              ) : (
                grant.messages.map((msg: any) => (
                  <div key={msg.id} className="p-4 border rounded-xl bg-gray-50 shadow-sm">
                    <div className="flex justify-between text-xs text-gray-500 font-medium mb-1">
                      <span className="font-semibold text-gray-900">{msg.sender.name} ({msg.sender.role})</span>
                      <span>{new Date(msg.createdAt).toLocaleString()}</span>
                    </div>
                    <p className="text-sm font-semibold text-forest-800 mb-2">{msg.subject}</p>
                    <p className="text-sm text-gray-800 whitespace-pre-wrap">{msg.message}</p>
                    {msg.attachmentUrl && (
                      <div className="mt-3">
                        <a href={msg.attachmentUrl} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1 text-xs font-semibold text-forest-700 hover:text-forest-900 border bg-white px-2 py-1 rounded">
                          🔗 View Attachment
                        </a>
                      </div>
                    )}
                  </div>
                ))
              )}
            </div>

            <div className="border-t pt-6">
              <h3 className="text-sm font-bold text-gray-900 mb-3">Send a New Message</h3>
              <form
                onSubmit={async (e) => {
                  e.preventDefault();
                  const form = e.currentTarget;
                  const subject = (form.elements.namedItem("subject") as HTMLInputElement).value;
                  const message = (form.elements.namedItem("message") as HTMLTextAreaElement).value;
                  const fileInput = form.elements.namedItem("attachment") as HTMLInputElement;
                  const btn = form.querySelector('button[type="submit"]') as HTMLButtonElement;
                  
                  btn.disabled = true;
                  btn.textContent = "Sending...";
                  
                  const { sendGrantMessage, uploadGrantDocument } = await import("@/app/actions/grants");
                  
                  let attachmentUrl = "";
                  if (fileInput.files && fileInput.files.length > 0) {
                    const fd = new FormData();
                    fd.append("file", fileInput.files[0]);
                    btn.textContent = "Uploading attachment...";
                    const uploadRes = await uploadGrantDocument(fd);
                    if (!uploadRes.ok) {
                      alert("Attachment upload failed: " + uploadRes.message);
                      btn.disabled = false;
                      btn.textContent = "Send Message";
                      return;
                    }
                    attachmentUrl = uploadRes.url || "";
                  }

                  btn.textContent = "Sending message...";
                  const res = await sendGrantMessage(grant.id, grant.entrepreneurId, subject, message, attachmentUrl);
                  
                  if (res.ok) {
                    form.reset();
                  } else {
                    alert(res.message);
                  }
                  
                  btn.disabled = false;
                  btn.textContent = "Send Message";
                }}
                className="space-y-4"
              >
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">Subject</label>
                  <input
                    type="text"
                    name="subject"
                    required
                    placeholder="e.g. Question about your recent report"
                    className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-forest-500 outline-none text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">Message</label>
                  <textarea
                    name="message"
                    required
                    rows={4}
                    placeholder="Write your message here..."
                    className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-forest-500 outline-none text-sm resize-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">Attachment (Optional screenshot or doc)</label>
                  <input
                    type="file"
                    name="attachment"
                    accept="image/*,.pdf,.doc,.docx"
                    className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-forest-500 outline-none text-sm bg-gray-50"
                  />
                </div>
                <button
                  type="submit"
                  className="w-full btn-primary text-sm px-6 py-2"
                >
                  Send Message
                </button>
              </form>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
