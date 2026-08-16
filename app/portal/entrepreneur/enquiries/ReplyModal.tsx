"use client";

import { useState, useTransition } from "react";
import { replyToEnquiry } from "@/app/actions/marketplace";

export function ReplyModal({
  enquiryId,
  senderBusiness,
  senderName,
}: {
  enquiryId: string;
  senderBusiness: string;
  senderName: string | null;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [isPending, startTransition] = useTransition();

  const handleReply = () => {
    if (!message.trim()) return;

    startTransition(async () => {
      const res = await replyToEnquiry(enquiryId, message);
      if (res.ok) {
        setIsOpen(false);
        setMessage("");
      } else {
        alert(res.message);
      }
    });
  };

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="mt-4 rounded-md border border-gold-300 bg-white px-3 py-1.5 text-xs font-semibold text-gold-700 hover:bg-gold-50"
      >
        Reply to Enquiry
      </button>
    );
  }

  return (
    <div className="mt-4 rounded-md border border-forest-200 bg-white p-4">
      <h3 className="text-sm font-semibold text-forest-900">Reply to {senderName ? `${senderName} from ` : ""}{senderBusiness}</h3>
      <textarea
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        rows={4}
        placeholder="Type your response here. This will be sent directly to their email..."
        className="mt-2 w-full rounded-md border-gray-300 text-sm focus:border-gold-500 focus:ring-gold-500"
      />
      <div className="mt-3 flex justify-end gap-2">
        <button
          onClick={() => setIsOpen(false)}
          className="rounded-md px-3 py-1.5 text-xs font-semibold text-charcoal-500 hover:bg-gray-100"
          disabled={isPending}
        >
          Cancel
        </button>
        <button
          onClick={handleReply}
          disabled={isPending || !message.trim()}
          className="btn-primary !px-3 !py-1.5 text-xs"
        >
          {isPending ? "Sending..." : "Send Reply"}
        </button>
      </div>
    </div>
  );
}
