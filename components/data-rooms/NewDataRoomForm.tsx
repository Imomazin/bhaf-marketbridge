"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createDataRoom } from "@/app/actions/dataRooms";

export function NewDataRoomForm() {
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [submitting, setSubmitting] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    const res = await createDataRoom({ title, description: description || undefined });
    setSubmitting(false);
    if (res.ok) {
      router.push(`/data-rooms/${res.id}`);
      router.refresh();
    }
  }

  return (
    <form onSubmit={onSubmit} className="space-y-3">
      <label className="block">
        <span className="text-[11px] font-semibold uppercase tracking-wide text-charcoal-500">Title</span>
        <input value={title} onChange={(e) => setTitle(e.target.value)} required className="mt-1.5 block w-full rounded-md border border-cream-300 bg-cream-50 px-3 py-2 text-sm focus:border-forest-700 focus:outline-none" />
      </label>
      <label className="block">
        <span className="text-[11px] font-semibold uppercase tracking-wide text-charcoal-500">Description (optional)</span>
        <textarea value={description} onChange={(e) => setDescription(e.target.value)} rows={3} className="mt-1.5 block w-full rounded-md border border-cream-300 bg-cream-50 px-3 py-2 text-sm focus:border-forest-700 focus:outline-none" />
      </label>
      <button type="submit" disabled={submitting} className="btn-primary !py-2 !px-3 text-xs disabled:opacity-60">
        {submitting ? "Creating…" : "Create data room"}
      </button>
    </form>
  );
}
