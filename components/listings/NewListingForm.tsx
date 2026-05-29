"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createListing } from "@/app/actions/listings";

const CATEGORIES = [
  "Fashion & Textiles",
  "Agri-Processing",
  "Clean Energy",
  "Beauty & Wellness",
  "Technology Services",
  "Training",
  "Crafts & Lifestyle",
  "Health",
  "Other",
];

export function NewListingForm({ onDone }: { onDone?: () => void }) {
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("Fashion & Textiles");
  const [description, setDescription] = useState("");
  const [priceRange, setPriceRange] = useState("");
  const [minOrder, setMinOrder] = useState("");
  const [esgHighlight, setEsgHighlight] = useState("");
  const [tags, setTags] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [status, setStatus] = useState<{ ok: boolean; message: string } | null>(null);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    setStatus(null);
    const res = await createListing({
      title,
      category,
      description,
      priceRange: priceRange || undefined,
      minOrder: minOrder || undefined,
      esgHighlight: esgHighlight || undefined,
      tags: tags || undefined,
    });
    setSubmitting(false);
    setStatus(res);
    if (res.ok) {
      setTitle("");
      setDescription("");
      setPriceRange("");
      setMinOrder("");
      setEsgHighlight("");
      setTags("");
      router.refresh();
      onDone?.();
    }
  }

  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <div className="grid gap-4 md:grid-cols-2">
        <Field label="Listing title" value={title} onChange={setTitle} placeholder="e.g. Upcycled Heritage Apparel Collection" />
        <label className="block">
          <span className="text-[11px] font-semibold uppercase tracking-wide text-charcoal-500">Category</span>
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="mt-1.5 block w-full rounded-md border border-cream-300 bg-cream-50 px-3 py-2 text-sm text-forest-900 focus:border-forest-700 focus:outline-none"
          >
            {CATEGORIES.map((c) => (
              <option key={c}>{c}</option>
            ))}
          </select>
        </label>
      </div>

      <label className="block">
        <span className="text-[11px] font-semibold uppercase tracking-wide text-charcoal-500">Description</span>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          rows={4}
          placeholder="What are you selling? Who is it for? What makes it different?"
          className="mt-1.5 block w-full rounded-md border border-cream-300 bg-cream-50 px-3 py-2 text-sm text-forest-900 placeholder:text-charcoal-300 focus:border-forest-700 focus:outline-none"
        />
      </label>

      <div className="grid gap-4 md:grid-cols-2">
        <Field label="Price range" value={priceRange} onChange={setPriceRange} placeholder="$18 – $64 per unit" />
        <Field label="Minimum order" value={minOrder} onChange={setMinOrder} placeholder="200 units" />
      </div>

      <Field label="ESG / impact highlight" value={esgHighlight} onChange={setEsgHighlight} placeholder="Diverts 1.2 tonnes of textile waste per order" />

      <Field label="Tags (comma separated)" value={tags} onChange={setTags} placeholder="Wholesale, Export-ready, Circular" />

      {status && (
        <p
          className={
            status.ok
              ? "rounded-md bg-forest-50 px-3 py-2 text-xs text-forest-800"
              : "rounded-md bg-red-50 px-3 py-2 text-xs text-red-700"
          }
        >
          {status.message}
        </p>
      )}

      <button type="submit" disabled={submitting} className="btn-primary disabled:opacity-60">
        {submitting ? "Submitting…" : "Submit for review"}
      </button>
    </form>
  );
}

function Field({
  label,
  value,
  onChange,
  placeholder,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
}) {
  return (
    <label className="block">
      <span className="text-[11px] font-semibold uppercase tracking-wide text-charcoal-500">{label}</span>
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="mt-1.5 block w-full rounded-md border border-cream-300 bg-cream-50 px-3 py-2 text-sm text-forest-900 placeholder:text-charcoal-300 focus:border-forest-700 focus:outline-none"
      />
    </label>
  );
}
