"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { getGrantById, addProgressReport, addBeneficiary, addFinancialMetric, uploadGrantDocument } from "@/app/actions/grants";

export default function GrantDetailsPage() {
  const { id } = useParams() as { id: string };
  const [grant, setGrant] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  
  // Tab State
  const [activeTab, setActiveTab] = useState<"progress" | "beneficiaries" | "financials" | "messages">("progress");

  // Form States
  const [narrative, setNarrative] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [isSubmittingReport, setIsSubmittingReport] = useState(false);
  const [benName, setBenName] = useState("");
  const [benImpact, setBenImpact] = useState("");
  const [benHeadcount, setBenHeadcount] = useState(1);
  const [finMetric, setFinMetric] = useState("");
  const [finAmount, setFinAmount] = useState("");
  const [finDate, setFinDate] = useState("");

  const fetchGrant = async () => {
    const res = await getGrantById(id);
    if (res.ok) setGrant(res.data);
    setLoading(false);
  };

  useEffect(() => {
    fetchGrant();
  }, [id]);

  const handleAddReport = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmittingReport(true);
    let attachmentUrl = undefined;
    let attachmentName = undefined;

    if (file) {
      const formData = new FormData();
      formData.append("file", file);
      const uploadRes = await uploadGrantDocument(formData);
      if (!uploadRes.ok) {
        alert(uploadRes.message);
        setIsSubmittingReport(false);
        return;
      }
      attachmentUrl = uploadRes.url;
      attachmentName = uploadRes.name;
    }

    const res = await addProgressReport(id, narrative, attachmentUrl, attachmentName);
    if (res.ok) {
      setNarrative("");
      setFile(null);
      fetchGrant();
    } else {
      alert(res.message);
    }
    setIsSubmittingReport(false);
  };

  const handleAddBeneficiary = async (e: React.FormEvent) => {
    e.preventDefault();
    const res = await addBeneficiary(id, { name: benName, impactDescription: benImpact, headcount: benHeadcount });
    if (res.ok) {
      setBenName(""); setBenImpact(""); setBenHeadcount(1);
      fetchGrant();
    } else alert(res.message);
  };

  const handleAddFinancial = async (e: React.FormEvent) => {
    e.preventDefault();
    const res = await addFinancialMetric(id, { metricName: finMetric, amountUsd: Number(finAmount), dateRecorded: finDate });
    if (res.ok) {
      setFinMetric(""); setFinAmount(""); setFinDate("");
      fetchGrant();
    } else alert(res.message);
  };

  if (loading) return <div className="p-8 text-gray-500">Loading grant details...</div>;
  if (!grant) return <div className="p-8 text-red-500">Grant not found.</div>;

  return (
    <div className="max-w-5xl mx-auto space-y-8">
      <Link href="/portal/entrepreneur/grants" className="text-sm font-semibold text-gray-500 hover:text-gray-900 mb-2 inline-flex items-center gap-1">
        ← Back to Grants
      </Link>
      <div className="bg-white border rounded-xl p-8 shadow-sm mt-2">
        <div className="flex justify-between items-start mb-4">
          <span className={`px-3 py-1 rounded-full text-xs font-semibold ${grant.status === "ACTIVE" ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-800"}`}>
            {grant.status}
          </span>
          <span className="text-sm font-medium text-charcoal-500">Awarded: ₦{grant.amountUsd.toLocaleString()}</span>
        </div>
        <h1 className="text-3xl font-serif text-forest-900 font-bold">{grant.title}</h1>
      </div>

      <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-8">
          {["progress", "beneficiaries", "financials", "messages"].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab as any)}
              className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm capitalize ${
                activeTab === tab
                  ? "border-forest-600 text-forest-600"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              }`}
            >
              {tab.replace("progress", "Progress Reports")}
            </button>
          ))}
        </nav>
      </div>

      <div className="bg-white border rounded-xl p-8 shadow-sm">
        {activeTab === "progress" && (
          <div className="space-y-8">
            <form onSubmit={handleAddReport} className="space-y-4">
              <h3 className="font-semibold text-lg">Submit New Report</h3>
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">Attach Document (PDF, Image, Excel)</label>
                <input 
                  type="file" 
                  className="w-full border rounded-lg p-2 text-sm bg-white"
                  onChange={e => setFile(e.target.files?.[0] || null)}
                />
              </div>
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">Optional Brief Description</label>
                <textarea 
                  className="w-full border rounded-lg p-3 text-sm" 
                  rows={3} 
                  placeholder="Describe the attached document or recent progress..."
                  value={narrative}
                  onChange={e => setNarrative(e.target.value)}
                />
              </div>
              <button type="submit" disabled={isSubmittingReport || (!file && !narrative)} className="btn-primary disabled:opacity-50">
                {isSubmittingReport ? "Submitting..." : "Submit Report"}
              </button>
            </form>
            <div className="mt-8 border-t pt-8">
              <h3 className="font-semibold text-lg mb-4">Past Reports</h3>
              <div className="space-y-4">
                {grant.progressReports.map((report: any) => (
                  <div key={report.id} className="p-4 border rounded-lg bg-gray-50">
                    <div className="flex justify-between text-xs text-gray-500 mb-2">
                      <span>{new Date(report.reportDate).toLocaleDateString()}</span>
                      <span className="font-semibold">{report.status}</span>
                    </div>
                    {report.attachmentUrl && (
                      <a href={report.attachmentUrl} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1 text-sm font-semibold text-forest-700 hover:text-forest-900 mb-2">
                        📄 View Attached Document ({report.attachmentName})
                      </a>
                    )}
                    {report.narrative && <p className="text-sm text-gray-800">{report.narrative}</p>}
                  </div>
                ))}
                {grant.progressReports.length === 0 && <p className="text-sm text-gray-500">No reports submitted yet.</p>}
              </div>
            </div>
          </div>
        )}

        {activeTab === "beneficiaries" && (
          <div className="space-y-8">
            <form onSubmit={handleAddBeneficiary} className="space-y-4">
              <h3 className="font-semibold text-lg">Log New Beneficiary Group</h3>
              <div className="grid grid-cols-2 gap-4">
                <input type="text" placeholder="Group Name (e.g. Rural Farmers)" className="border rounded-lg p-3 text-sm" value={benName} onChange={e => setBenName(e.target.value)} required />
                <input type="number" placeholder="Headcount" min="1" className="border rounded-lg p-3 text-sm" value={benHeadcount} onChange={e => setBenHeadcount(Number(e.target.value))} required />
              </div>
              <textarea placeholder="Describe the impact on this group..." className="w-full border rounded-lg p-3 text-sm" rows={2} value={benImpact} onChange={e => setBenImpact(e.target.value)} required />
              <button type="submit" className="btn-primary">Add Beneficiary</button>
            </form>
            <div className="mt-8 border-t pt-8">
              <h3 className="font-semibold text-lg mb-4">Documented Beneficiaries</h3>
              <div className="space-y-4">
                {grant.beneficiaries.map((b: any) => (
                  <div key={b.id} className="p-4 border rounded-lg bg-gray-50">
                    <div className="flex justify-between mb-2">
                      <span className="font-semibold text-forest-900">{b.name}</span>
                      <span className="text-xs bg-forest-100 text-forest-800 px-2 py-1 rounded-full">{b.headcount} Individuals</span>
                    </div>
                    <p className="text-sm text-gray-600">{b.impactDescription}</p>
                  </div>
                ))}
                {grant.beneficiaries.length === 0 && <p className="text-sm text-gray-500">No beneficiaries logged yet.</p>}
              </div>
            </div>
          </div>
        )}

        {activeTab === "financials" && (
          <div className="space-y-8">
            <form onSubmit={handleAddFinancial} className="space-y-4">
              <h3 className="font-semibold text-lg">Log Financial Metric</h3>
              <div className="grid grid-cols-3 gap-4">
                <input type="text" placeholder="Metric (e.g. Funds Disbursed)" className="border rounded-lg p-3 text-sm" value={finMetric} onChange={e => setFinMetric(e.target.value)} required />
                <input type="number" placeholder="Amount (NGN)" className="border rounded-lg p-3 text-sm" value={finAmount} onChange={e => setFinAmount(e.target.value)} required />
                <input type="date" className="border rounded-lg p-3 text-sm" value={finDate} onChange={e => setFinDate(e.target.value)} required />
              </div>
              <button type="submit" className="btn-primary">Add Metric</button>
            </form>
            <div className="mt-8 border-t pt-8">
              <h3 className="font-semibold text-lg mb-4">Financial Performance</h3>
              <table className="w-full text-left text-sm">
                <thead>
                  <tr className="border-b">
                    <th className="pb-2 font-semibold">Date</th>
                    <th className="pb-2 font-semibold">Metric</th>
                    <th className="pb-2 font-semibold text-right">Amount (NGN)</th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {grant.financialMetrics.map((f: any) => (
                    <tr key={f.id}>
                      <td className="py-3 text-gray-500">{new Date(f.dateRecorded).toLocaleDateString()}</td>
                      <td className="py-3 font-medium">{f.metricName}</td>
                      <td className="py-3 text-right font-semibold">₦{f.amountUsd.toLocaleString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {grant.financialMetrics.length === 0 && <p className="text-sm text-gray-500 mt-4">No financial metrics logged yet.</p>}
            </div>
          </div>
        )}

        {activeTab === "messages" && (
          <div className="space-y-8">
            <div className="space-y-4 max-h-96 overflow-y-auto pr-2">
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

            <div className="border-t pt-8">
              <h3 className="font-semibold text-lg mb-4">Send a Message</h3>
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
                  const res = await sendGrantMessage(grant.id, grant.funderId, subject, message, attachmentUrl);
                  
                  if (res.ok) {
                    form.reset();
                    // trigger re-fetch to show new message
                    const { getGrantById } = await import("@/app/actions/grants");
                    const refreshRes = await getGrantById(grant.id);
                    if (refreshRes.ok) setGrant(refreshRes.data);
                  } else {
                    alert(res.message);
                  }
                  
                  btn.disabled = false;
                  btn.textContent = "Send Message";
                }}
                className="space-y-4"
              >
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Subject</label>
                  <input
                    type="text"
                    name="subject"
                    required
                    placeholder="e.g. Checking in on progress"
                    className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-forest-500 outline-none text-sm"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Message</label>
                  <textarea
                    name="message"
                    required
                    rows={4}
                    placeholder="Write your message here..."
                    className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-forest-500 outline-none text-sm resize-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Attachment (Optional screenshot or doc)</label>
                  <input
                    type="file"
                    name="attachment"
                    accept="image/*,.pdf,.doc,.docx"
                    className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-forest-500 outline-none text-sm bg-gray-50"
                  />
                </div>
                <button
                  type="submit"
                  className="w-full md:w-auto btn-primary text-sm px-6 py-2"
                >
                  Send Message
                </button>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
