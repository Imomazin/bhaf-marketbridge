"use client";

import { useState } from "react";
import { changePassword } from "@/app/actions/settings";
import { PasswordField } from "@/components/ui/PasswordField";

export function ChangePasswordForm() {
  const [currentPassword, setCurrent] = useState("");
  const [newPassword, setNew] = useState("");
  const [confirm, setConfirm] = useState("");
  const [status, setStatus] = useState<{ ok: boolean; message: string } | null>(null);
  const [submitting, setSubmitting] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    const res = await changePassword({ currentPassword, newPassword, confirm });
    setStatus(res);
    setSubmitting(false);
    if (res.ok) {
      setCurrent("");
      setNew("");
      setConfirm("");
    }
  }

  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <PasswordField
        label="Current password"
        required
        autoComplete="current-password"
        value={currentPassword}
        onChange={(e) => setCurrent(e.target.value)}
      />
      <PasswordField
        label="New password"
        required
        autoComplete="new-password"
        value={newPassword}
        onChange={(e) => setNew(e.target.value)}
      />
      <PasswordField
        label="Confirm new password"
        required
        autoComplete="new-password"
        value={confirm}
        onChange={(e) => setConfirm(e.target.value)}
      />

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
        {submitting ? "Updating…" : "Update password"}
      </button>
    </form>
  );
}
