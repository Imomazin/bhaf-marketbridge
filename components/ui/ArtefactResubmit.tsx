"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ARTEFACT_MAX_BYTES, ARTEFACT_MAX_MB, formatArtefactBytes } from "@/lib/artefactUpload";

export function ArtefactResubmit({
  artefactId,
  variant = "resubmit",
  buttonLabel,
}: {
  artefactId: string;
  variant?: "resubmit" | "replace";
  buttonLabel?: string;
}) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [result, setResult] = useState<{ ok: boolean; message?: string } | null>(null);

  function pickFile(f?: File | null) {
    if (!f) return;
    if (f.size > ARTEFACT_MAX_BYTES) {
      setResult({ ok: false, message: `Files larger than ${ARTEFACT_MAX_MB} MB are not allowed. Selected file: ${formatArtefactBytes(f.size)}.` });
      return;
    }
    setFile(f);
    setResult(null);
  }

  async function submit() {
    if (!file || submitting) return;
    setSubmitting(true);
    setResult(null);
    const fd = new FormData();
    fd.set("file", file);
    const response = await fetch(`/api/artefacts/${artefactId}/resubmit`, { method: "POST", body: fd });
    const res = (await response.json()) as { ok: boolean; message?: string };
    setSubmitting(false);
    if (res.ok) {
      setOpen(false);
      setFile(null);
      router.refresh();
    } else {
      setResult({ ok: false, message: res.message });
    }
  }

  if (!open) {
    if (variant === "replace") {
      return (
        <button type="button" onClick={() => setOpen(true)} className="rounded-md px-3 py-2 text-xs font-medium text-charcoal-500 hover:text-forest-900">
          Replace
        </button>
      );
    }
    return (
      <button type="button" onClick={() => setOpen(true)} className="btn-gold !py-2 !px-3 text-xs">
        {buttonLabel ?? "Re-upload corrected version"}
      </button>
    );
  }

  return (
    <div className="w-full rounded-lg border border-gold-200 bg-gold-50/40 p-3">
      <label className="block cursor-pointer rounded-md border-2 border-dashed border-cream-300 bg-white px-3 py-4 text-center text-xs text-charcoal-500 hover:border-forest-600">
        <input
          type="file"
          className="hidden"
          accept=".pdf,.jpg,.jpeg,.png,.webp,.zip,.docx,.xlsx"
          onChange={(e) => pickFile(e.target.files?.[0])}
        />
        {file ? file.name : (variant === "replace" ? "Click to choose the replacement file" : "Click to choose the corrected file")}
      </label>
      <div className="mt-2 flex gap-2">
        <button
          type="button"
          onClick={() => {
            setOpen(false);
            setFile(null);
            setResult(null);
          }}
          disabled={submitting}
          className="rounded-md border border-cream-300 px-3 py-1.5 text-xs font-medium text-charcoal-600 hover:border-forest-700 disabled:opacity-60"
        >
          Cancel
        </button>
        <button
          type="button"
          onClick={submit}
          disabled={!file || submitting}
          className="btn-primary !py-1.5 !px-3 text-xs disabled:cursor-not-allowed disabled:opacity-60"
        >
          {submitting ? "Submitting…" : (variant === "replace" ? "Replace document" : "Submit for re-review")}
        </button>
      </div>
      {result && !result.ok && <p className="mt-2 text-[11px] text-red-700">{result.message}</p>}
    </div>
  );
}
