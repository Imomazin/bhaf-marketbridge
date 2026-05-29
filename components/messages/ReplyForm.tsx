"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { replyToConversation } from "@/app/actions/messages";

export function ReplyForm({ conversationId }: { conversationId: string }) {
  const router = useRouter();
  const [body, setBody] = useState("");
  const [submitting, setSubmitting] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    const res = await replyToConversation({ conversationId, body });
    setSubmitting(false);
    if (res.ok) {
      setBody("");
      router.refresh();
    }
  }

  return (
    <form onSubmit={onSubmit} className="card p-4">
      <label className="block">
        <span className="text-[11px] font-semibold uppercase tracking-wide text-charcoal-500">Reply</span>
        <textarea required value={body} onChange={(e) => setBody(e.target.value)} rows={3} className="mt-1.5 block w-full rounded-md border border-cream-300 bg-cream-50 px-3 py-2 text-sm focus:border-forest-700 focus:outline-none" />
      </label>
      <div className="mt-3 flex justify-end">
        <button type="submit" disabled={submitting || !body.trim()} className="btn-primary !py-2 !px-3 text-xs disabled:opacity-60">
          {submitting ? "Sending…" : "Send"}
        </button>
      </div>
    </form>
  );
}
