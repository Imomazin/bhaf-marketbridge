"use client";

import { useState } from "react";
import { submitConsultingRequest } from "@/app/actions/consulting";
import { SERVICE_TRACKS } from "@/lib/consultingPricing";

export function ConsultingRequestForm({ initialUser }: { initialUser: any }) {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  
  const [formData, setFormData] = useState({
    name: initialUser?.name || "",
    email: initialUser?.email || "",
    orgName: initialUser?.businessName || "",
    serviceType: SERVICE_TRACKS[0]?.title || "General Advisory",
    description: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.orgName || !formData.serviceType || !formData.description) {
      alert("Please fill in all fields before submitting.");
      return;
    }
    setLoading(true);
    const res = await submitConsultingRequest(formData);
    setLoading(false);
    if (res.ok) {
      setSuccess(true);
    } else {
      alert(res.message);
    }
  };

  if (success) {
    return (
      <div className="mt-12 max-w-xl bg-white border border-cream-200 rounded-xl p-8 text-center shadow-soft">
        <div className="w-16 h-16 bg-forest-100 text-forest-800 rounded-full flex items-center justify-center mx-auto mb-4 text-2xl">
          ✓
        </div>
        <h3 className="font-serif text-2xl text-forest-900 font-bold">Request Received</h3>
        <p className="mt-3 text-charcoal-500 text-sm">
          Thank you for reaching out! We have sent a confirmation email to <strong>{formData.email}</strong>. Our consulting firm will review your request and reach out to you shortly to discuss next steps.
        </p>
        <button 
          onClick={() => setSuccess(false)}
          className="mt-6 text-sm text-forest-700 hover:text-forest-900 font-semibold"
        >
          Submit another request
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="mt-12 max-w-2xl bg-white border border-cream-200 rounded-xl p-8 shadow-soft">
      <div className="space-y-6">
        <div className="grid grid-cols-2 gap-6">
          <div>
            <label className="block text-xs font-semibold text-charcoal-800 mb-1">Full Name</label>
            <input 
              name="name"
              required
              value={formData.name}
              onChange={handleChange}
              className="w-full border rounded-lg p-3 text-sm focus:ring-1 focus:ring-forest-600 focus:outline-none"
              placeholder="Jane Doe"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-charcoal-800 mb-1">Email Address</label>
            <input 
              name="email"
              type="email"
              required
              value={formData.email}
              onChange={handleChange}
              className="w-full border rounded-lg p-3 text-sm focus:ring-1 focus:ring-forest-600 focus:outline-none"
              placeholder="jane@company.com"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold text-charcoal-800 mb-1">Organization Name</label>
          <input 
            name="orgName"
            required
            value={formData.orgName}
            onChange={handleChange}
            className="w-full border rounded-lg p-3 text-sm focus:ring-1 focus:ring-forest-600 focus:outline-none"
            placeholder="Acme Corp"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-charcoal-800 mb-1">Service Requested</label>
          <select 
            name="serviceType"
            required
            value={formData.serviceType}
            onChange={handleChange}
            className="w-full border rounded-lg p-3 text-sm focus:ring-1 focus:ring-forest-600 focus:outline-none bg-white"
          >
            {SERVICE_TRACKS.map(track => (
              <option key={track.id} value={track.title}>{track.title}</option>
            ))}
            <option value="Other / Custom">Other / Custom</option>
          </select>
        </div>

        <div>
          <label className="block text-xs font-semibold text-charcoal-800 mb-1">Project Details</label>
          <textarea 
            name="description"
            required
            rows={4}
            value={formData.description}
            onChange={handleChange}
            className="w-full border rounded-lg p-3 text-sm focus:ring-1 focus:ring-forest-600 focus:outline-none"
            placeholder="Briefly describe what you are looking to achieve..."
          />
        </div>

        <button 
          type="submit" 
          disabled={loading}
          className="w-full btn-primary py-3 flex justify-center items-center"
        >
          {loading ? "Submitting..." : "Submit Consulting Request"}
        </button>
      </div>
    </form>
  );
}
