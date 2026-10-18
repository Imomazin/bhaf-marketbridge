"use client";

import { useState } from "react";
import { replyToConsultingRequest } from "@/app/actions/consulting";
import type { ConsultingRequest } from "@prisma/client";

interface Props {
  request: ConsultingRequest;
  isOpen: boolean;
  onClose: () => void;
}

export function ConsultingRequestDetailModal({ request, isOpen, onClose }: Props) {
  const [replyMessage, setReplyMessage] = useState<string>("");
  const [sending, setSending] = useState(false);
  const [msg, setMsg] = useState<{ ok: boolean; text: string } | null>(null);

  if (!isOpen) return null;

  async function handleSendReply(e: React.FormEvent) {
    e.preventDefault();
    setSending(true);
    setMsg(null);

    const res = await replyToConsultingRequest(request.id, replyMessage);

    setSending(false);
    if (res.ok) {
      setMsg({ ok: true, text: "Reply sent successfully!" });
      setTimeout(() => {
        onClose();
      }, 1500);
    } else {
      setMsg({ ok: false, text: res.message || "Failed to send reply" });
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm">
      <div className="card max-h-[90vh] w-full max-w-2xl overflow-y-auto bg-white p-6 md:p-8 shadow-2xl">
        <div className="flex items-start justify-between border-b border-cream-200 pb-4">
          <div>
            <span className="text-[11px] font-semibold uppercase tracking-[0.18em] text-gold-700">
              Consulting Inquiry #{request.id.slice(0, 10)}
            </span>
            <h2 className="mt-1 font-serif text-2xl text-forest-900">
              {request.orgName}
            </h2>
            <p className="text-xs text-charcoal-500 mt-1">
              From: <span className="font-semibold">{request.name}</span> ({request.email})
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-1.5 text-charcoal-400 hover:bg-cream-100 hover:text-charcoal-700"
          >
            ✕
          </button>
        </div>

        {/* Details */}
        <div className="mt-6 grid gap-4 rounded-xl border border-cream-300 bg-cream-50 p-4 text-xs">
          <div>
            <span className="text-[10px] font-semibold uppercase tracking-wider text-charcoal-400">
              Service Requested
            </span>
            <p className="mt-0.5 font-medium text-forest-900">{request.serviceType}</p>
          </div>
          <div>
            <span className="text-[10px] font-semibold uppercase tracking-wider text-charcoal-400">
              Project Description
            </span>
            <p className="mt-1 font-medium text-charcoal-700 whitespace-pre-wrap">{request.description}</p>
          </div>
        </div>

        {/* Reply Action */}
        {request.status === "REPLIED" ? (
          <div className="mt-6 border-t pt-6">
            <h3 className="font-semibold text-sm text-forest-900 mb-2">Previous Reply Sent</h3>
            <p className="text-xs text-charcoal-600 bg-gray-50 p-3 rounded-lg border">
              {request.adminNotes}
            </p>
            <div className="mt-4 flex justify-end">
               <button onClick={onClose} className="btn-secondary text-sm">Close</button>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSendReply} className="mt-6 border-t border-cream-200 pt-5 space-y-4">
            <h3 className="font-serif text-base text-forest-900">Reply to Inquiry</h3>
            <p className="text-xs text-charcoal-500 mb-2">
              Type your message below. It will be emailed directly to {request.email} and this request will be marked as Replied.
            </p>

            <div>
              <textarea
                required
                rows={5}
                value={replyMessage}
                onChange={(e) => setReplyMessage(e.target.value)}
                placeholder={`Hi ${request.name},\n\nThank you for reaching out to BHAF regarding ${request.serviceType}...`}
                className="block w-full rounded-md border border-cream-300 bg-cream-50 px-3 py-2 text-sm focus:border-forest-700 focus:outline-none"
              />
            </div>

            {msg && (
              <p
                className={
                  msg.ok
                    ? "rounded-md bg-forest-50 p-2.5 text-xs text-forest-800"
                    : "rounded-md bg-red-50 p-2.5 text-xs text-red-700"
                }
              >
                {msg.text}
              </p>
            )}

            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={onClose}
                className="rounded-md border border-cream-300 px-4 py-2 text-xs font-medium text-charcoal-700 hover:bg-cream-100 transition"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={sending}
                className="rounded-md bg-forest-800 px-5 py-2 text-xs font-semibold text-cream-50 hover:bg-forest-700 transition disabled:opacity-60"
              >
                {sending ? "Sending..." : "Send Reply via Email"}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
