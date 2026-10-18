"use client";

import { useState } from "react";
import { SubscriptionPlan } from "@prisma/client";
import { createSubscriptionPlan, updateSubscriptionPlan, deleteSubscriptionPlan } from "@/app/actions/admin-subscriptions";

const FEATURE_DESCRIPTIONS: Record<string, string> = {
  maxDataRooms: "The number of Data Rooms (secure document vaults) the user can create and share.",
  maxCohorts: "The number of Cohorts (programs) a user can create or apply to.",
  maxRfPs: "The number of RFPs a corporate partner can publish.",
  maxDeals: "The number of active investment deals or opportunities a user can track.",
  maxGrants: "The number of Grants a user can issue or manage.",
  prioritySupport: "Set to 'true' or 'false' to grant priority customer support."
};

export function SubscriptionPlansManager({ initialPlans }: { initialPlans: SubscriptionPlan[] }) {
  const [plans, setPlans] = useState<SubscriptionPlan[]>(initialPlans);
  const [editingPlan, setEditingPlan] = useState<Partial<SubscriptionPlan> | null>(null);
  const [deletingPlanId, setDeletingPlanId] = useState<string | null>(null);
  
  // State for dynamic features list
  const [featureInputs, setFeatureInputs] = useState<{key: string, value: string}[]>([]);

  const startEditing = (plan: Partial<SubscriptionPlan> | null) => {
    setEditingPlan(plan);
    if (plan && plan.features && typeof plan.features === 'object') {
      const entries = Object.entries(plan.features).map(([k, v]) => ({ key: k, value: String(v) }));
      setFeatureInputs(entries);
    } else {
      setFeatureInputs([]);
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingPlan) return;

    // Build features JSON from dynamic inputs
    const featuresObj: Record<string, string> = {};
    for (const f of featureInputs) {
      if (f.key.trim()) featuresObj[f.key.trim()] = f.value.trim();
    }

    if (Object.keys(featuresObj).length === 0) {
      alert("You must define at least one feature/limit for this plan.");
      return;
    }

    const data = {
      name: editingPlan.name!,
      tier: editingPlan.tier!,
      role: editingPlan.role!,
      monthlyPriceCents: editingPlan.monthlyPriceCents!,
      yearlyPriceCents: editingPlan.yearlyPriceCents || undefined,
      stripePriceId: editingPlan.stripePriceId || undefined,
      features: JSON.stringify(featuresObj),
      isActive: editingPlan.isActive ?? true,
    };

    if (editingPlan.id) {
      const res = await updateSubscriptionPlan(editingPlan.id, data);
      if (res.ok) alert("Updated successfully");
      else alert(res.message);
    } else {
      const res = await createSubscriptionPlan(data);
      if (res.ok) alert("Created successfully");
      else alert(res.message);
    }
    
    window.location.reload();
  };

  const confirmDelete = async () => {
    if (!deletingPlanId) return;
    const res = await deleteSubscriptionPlan(deletingPlanId);
    if (res.ok) {
      alert("Plan deleted.");
      window.location.reload();
    } else {
      alert(res.message);
      setDeletingPlanId(null);
    }
  };

  const addFeature = () => setFeatureInputs([...featureInputs, { key: "", value: "" }]);
  const updateFeature = (index: number, field: "key" | "value", val: string) => {
    const updated = [...featureInputs];
    updated[index][field] = val;
    setFeatureInputs(updated);
  };
  const removeFeature = (index: number) => {
    const updated = [...featureInputs];
    updated.splice(index, 1);
    setFeatureInputs(updated);
  };

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-bold text-forest-900">Manage Plans</h2>
        <button 
          onClick={() => startEditing({ name: "", tier: "FREE", role: "ALL", monthlyPriceCents: 0, features: {} })}
          className="btn-primary"
        >
          Add New Plan
        </button>
      </div>

      <div className="grid grid-cols-1 gap-4">
        {plans.map(plan => (
          <div key={plan.id} className="p-6 border rounded-xl bg-white shadow-sm flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2">
                <h3 className="font-bold text-xl text-forest-900">{plan.name}</h3>
                <span className="text-xs font-semibold bg-forest-100 text-forest-800 px-3 py-1 rounded-full uppercase tracking-wider">
                  {plan.tier}
                </span>
                {!plan.isActive && (
                  <span className="text-xs font-semibold bg-red-100 text-red-800 px-3 py-1 rounded-full">Inactive</span>
                )}
              </div>
              
              <div className="flex flex-wrap gap-x-6 gap-y-2 text-sm text-gray-600 mb-4">
                <p><strong>Target Role:</strong> <span className="bg-gray-100 px-2 py-0.5 rounded">{plan.role}</span></p>
                <p><strong>Monthly Price:</strong> <span className="font-semibold text-gray-900">₦{(plan.monthlyPriceCents/100).toFixed(2)}/mo</span></p>
                {plan.yearlyPriceCents ? (
                  <p><strong>Yearly Price:</strong> <span className="font-semibold text-gray-900">₦{(plan.yearlyPriceCents/100).toFixed(2)}/yr</span></p>
                ) : null}
                <p><strong>Stripe ID:</strong> <span className="font-mono text-xs bg-gray-100 px-2 py-0.5 rounded">{plan.stripePriceId || "Not Required (Free)"}</span></p>
              </div>

              <div>
                <p className="text-sm font-semibold text-gray-700 mb-2">Plan Limits & Features:</p>
                <div className="flex flex-wrap gap-2">
                  {plan.features && typeof plan.features === 'object' ? (
                    Object.entries(plan.features).map(([key, value]) => {
                      const formattedKey = key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase());
                      const isBoolean = String(value).toLowerCase() === "true" || String(value).toLowerCase() === "false";
                      if (isBoolean) {
                         if (String(value).toLowerCase() === "false") return null;
                         return (
                            <span key={key} className="text-xs bg-blue-50 text-blue-700 border border-blue-200 px-3 py-1.5 rounded-lg flex items-center gap-1">
                              <span className="font-medium">{formattedKey} Included</span>
                            </span>
                         )
                      }
                      return (
                      <span key={key} className="text-xs bg-blue-50 text-blue-700 border border-blue-200 px-3 py-1.5 rounded-lg flex items-center gap-1">
                        <span className="font-medium">{formattedKey}:</span>
                        <span>{String(value)}</span>
                      </span>
                      );
                    })
                  ) : (
                    <span className="text-xs text-gray-400">No specific features configured</span>
                  )}
                </div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button 
                onClick={() => startEditing(plan)}
                className="btn-secondary text-sm"
              >
                Edit
              </button>
              <button 
                onClick={() => setDeletingPlanId(plan.id)}
                className="px-4 py-2 border border-red-200 text-red-600 rounded-lg text-sm hover:bg-red-50 transition-colors"
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>

      {deletingPlanId && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white p-6 rounded-lg shadow-xl w-full max-w-sm text-center space-y-6">
            <h3 className="text-xl font-bold text-gray-900">Are you sure?</h3>
            <p className="text-gray-600">Are you sure you want to delete this subscription plan? This action cannot be undone.</p>
            <div className="flex justify-center gap-3">
              <button 
                onClick={() => setDeletingPlanId(null)} 
                className="px-6 py-2 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50 font-medium"
              >
                No, cancel
              </button>
              <button 
                onClick={confirmDelete} 
                className="px-6 py-2 rounded-lg bg-red-600 text-white hover:bg-red-700 font-medium"
              >
                Yes, delete
              </button>
            </div>
          </div>
        </div>
      )}

      {editingPlan && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white p-6 rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto space-y-6">
            <h3 className="text-xl font-bold text-forest-900">{editingPlan.id ? 'Edit Plan' : 'New Plan'}</h3>
            
            <form onSubmit={handleSave} className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <label className="block space-y-1">
                  <span className="text-sm font-semibold text-gray-700">Name</span>
                  <input required type="text" value={editingPlan.name || ''} onChange={e => setEditingPlan({...editingPlan, name: e.target.value})} className="input-field w-full border rounded-lg px-3 py-2" />
                </label>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <label className="block space-y-1">
                  <span className="text-sm font-semibold text-gray-700">Tier</span>
                  <select value={editingPlan.tier || 'FREE'} onChange={e => setEditingPlan({...editingPlan, tier: e.target.value})} className="input-field w-full border rounded-lg px-3 py-2">
                    <option value="FREE">FREE</option>
                    <option value="STANDARD">STANDARD</option>
                    <option value="PREMIUM">PREMIUM</option>
                  </select>
                </label>
                <label className="block space-y-1">
                  <span className="text-sm font-semibold text-gray-700">Target Role</span>
                  <select value={editingPlan.role || 'ALL'} onChange={e => setEditingPlan({...editingPlan, role: e.target.value})} className="input-field w-full border rounded-lg px-3 py-2">
                    <option value="ALL">ALL</option>
                    <option value="ENTREPRENEUR">ENTREPRENEUR</option>
                    <option value="FUNDER">FUNDER</option>
                    <option value="CORPORATE">CORPORATE</option>
                  </select>
                </label>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <label className="block space-y-1">
                  <span className="text-sm font-semibold text-gray-700">Monthly Price (₦)</span>
                  <input 
                    required 
                    type="number" 
                    min="0"
                    step="1"
                    value={editingPlan.monthlyPriceCents !== undefined ? editingPlan.monthlyPriceCents / 100 : 0} 
                    onChange={e => setEditingPlan({...editingPlan, monthlyPriceCents: parseFloat(e.target.value) * 100})} 
                    className="input-field w-full border rounded-lg px-3 py-2" 
                  />
                  <p className="text-xs text-gray-500 mt-1">Enter whole Naira amount (e.g., 5000)</p>
                </label>
                <label className="block space-y-1">
                  <span className="text-sm font-semibold text-gray-700">Yearly Price (₦) (Optional)</span>
                  <input 
                    type="number" 
                    min="0"
                    step="1"
                    value={editingPlan.yearlyPriceCents ? editingPlan.yearlyPriceCents / 100 : ''} 
                    onChange={e => setEditingPlan({...editingPlan, yearlyPriceCents: parseFloat(e.target.value) * 100})} 
                    className="input-field w-full border rounded-lg px-3 py-2" 
                    placeholder="e.g. 50000"
                  />
                  <p className="text-xs text-gray-500 mt-1">Discounted yearly rate (leave blank if N/A)</p>
                </label>
              </div>

              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-semibold text-gray-700">Plan Features & Limits</span>
                  <button type="button" onClick={addFeature} className="text-xs font-semibold text-blue-600 hover:text-blue-800">
                    + Add Feature
                  </button>
                </div>
                
                {featureInputs.length === 0 ? (
                  <p className="text-sm text-gray-500 italic">No features added yet.</p>
                ) : (
                  <div className="space-y-4">
                    {featureInputs.map((feat, i) => {
                      const isCustom = !['maxDataRooms', 'maxCohorts', 'maxRfPs', 'maxDeals', 'maxGrants', 'prioritySupport'].includes(feat.key) && feat.key !== "";
                      const description = !isCustom && feat.key ? FEATURE_DESCRIPTIONS[feat.key] : null;
                      return (
                      <div key={i} className="flex flex-col gap-1 p-3 border border-gray-100 bg-gray-50 rounded-lg">
                        <div className="flex items-center gap-2">
                          <select 
                            value={isCustom ? 'custom' : feat.key} 
                            onChange={e => {
                              if (e.target.value === 'custom') {
                                updateFeature(i, 'key', 'customFeatureName');
                              } else {
                                updateFeature(i, 'key', e.target.value);
                              }
                            }}
                            className="w-1/3 border rounded-lg px-3 py-1.5 text-sm"
                          >
                            <option value="" disabled>Select a Feature...</option>
                            {(editingPlan.role === 'ALL' || editingPlan.role === 'ENTREPRENEUR') && (
                              <>
                                <option value="maxDataRooms">Max Data Rooms</option>
                                <option value="maxDeals">Max Deals</option>
                              </>
                            )}
                            {(editingPlan.role === 'ALL' || editingPlan.role === 'FUNDER') && (
                              <>
                                <option value="maxGrants">Max Grants</option>
                              </>
                            )}
                            {(editingPlan.role === 'ALL' || editingPlan.role === 'CORPORATE') && (
                              <>
                                <option value="maxCohorts">Max Cohorts</option>
                                <option value="maxRfPs">Max RFPs</option>
                              </>
                            )}
                            <option value="prioritySupport">Priority Support</option>
                            <option value="custom">Custom Feature...</option>
                          </select>
                          
                          {isCustom && (
                            <input 
                              type="text" 
                              placeholder="Feature Name (e.g. 24_7_Support)" 
                              value={feat.key} 
                              onChange={e => updateFeature(i, 'key', e.target.value)} 
                              className="w-1/3 border-2 border-blue-200 rounded-lg px-3 py-1.5 text-sm font-mono focus:border-blue-400 focus:outline-none"
                            />
                          )}

                          {feat.key === 'prioritySupport' || feat.key.includes("Enabled") || feat.key.includes("Support") ? (
                            <label className="flex-1 flex items-center gap-2 px-3 py-1.5 bg-white border rounded-lg text-sm cursor-pointer hover:bg-gray-50 border-gray-200">
                              <input 
                                type="checkbox"
                                checked={feat.value.toLowerCase() === 'true'}
                                onChange={e => updateFeature(i, 'value', e.target.checked ? 'true' : 'false')}
                                className="rounded text-forest-600 focus:ring-forest-500 w-4 h-4 cursor-pointer"
                              />
                              <span className="font-medium text-gray-700 select-none">Enabled</span>
                            </label>
                          ) : (
                            <input 
                              type="text" 
                              placeholder="Value (e.g. 10)" 
                              value={feat.value} 
                              onChange={e => updateFeature(i, 'value', e.target.value)} 
                              className="flex-1 border rounded-lg px-3 py-1.5 text-sm"
                            />
                          )}
                          <button 
                            type="button" 
                            onClick={() => removeFeature(i)}
                            className="p-2 text-gray-400 hover:text-red-500"
                            title="Remove feature"
                          >
                            ✕
                          </button>
                        </div>
                        {description && (
                          <p className="text-xs text-gray-500 pl-1">{description}</p>
                        )}
                      </div>
                    )})}
                  </div>
                )}
              </div>

              <label className="flex items-center space-x-2 pt-2">
                <input type="checkbox" checked={editingPlan.isActive ?? true} onChange={e => setEditingPlan({...editingPlan, isActive: e.target.checked})} className="rounded text-forest-600 focus:ring-forest-500 w-5 h-5" />
                <span className="text-sm font-medium text-gray-900">Plan is Active (Visible to users)</span>
              </label>

              <div className="flex justify-end gap-3 pt-6 border-t">
                <button type="button" onClick={() => setEditingPlan(null)} className="px-5 py-2.5 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50 font-medium">Cancel</button>
                <button type="submit" className="btn-primary px-6 py-2.5">Save Plan</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
