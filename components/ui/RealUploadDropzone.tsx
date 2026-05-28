"use client";

import { useState } from "react";
import { uploadArtefact } from "@/app/actions/artefacts";
import { cn } from "@/lib/utils";

const STAGES = [
  { key: "uploading", label: "Uploading & hashing (SHA-256)" },
  { key: "scan", label: "Magic-byte & integrity scan" },
  { key: "format", label: "Format & metadata validation" },
  { key: "match", label: "Cross-check against profile" },
  { key: "queue", label: "Queued for BHAF review" },
];

const CATEGORIES = [
  "Business identity",
  "ESG & impact",
  "Financials",
  "Products",
  "Operations",
  "Compliance",
  "Other",
];

interface RealUploadDropzoneProps {
  defaultCategory?: string;
}

export function RealUploadDropzone({ defaultCategory = "Business identity" }: RealUploadDropzoneProps) {
  const [hover, setHover] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [name, setName] = useState("");
  const [category, setCategory] = useState(defaultCategory);
  const [required, setRequired] = useState(false);
  const [stage, setStage] = useState(-1);
  const [result, setResult] = useState<{ ok: boolean; message?: string; sha256?: string } | null>(null);
  const [submitting, setSubmitting] = useState(false);

  function pickFile(f?: File | null) {
    if (!f) return;
    setFile(f);
    if (!name) setName(f.name.replace(/\.[^.]+$/, ""));
    setResult(null);
  }

  async function submit() {
    if (!file || !name || !category || submitting) return;
    setSubmitting(true);
    setResult(null);

    // Run the visual pipeline in parallel with the real upload so the user
    // sees the stages even on a fast connection.
    let s = 0;
    setStage(0);
    const visualTimer = window.setInterval(() => {
      s += 1;
      if (s < STAGES.length) setStage(s);
      else window.clearInterval(visualTimer);
    }, 500);

    const fd = new FormData();
    fd.set("file", file);
    fd.set("name", name);
    fd.set("category", category);
    fd.set("required", required ? "true" : "false");

    const res = await uploadArtefact(fd);
    window.clearInterval(visualTimer);
    setStage(STAGES.length);
    setSubmitting(false);

    if (res.ok) {
      setResult({ ok: true, sha256: res.sha256 });
    } else {
      setResult({ ok: false, message: res.message });
    }
  }

  const done = result?.ok === true;

  return (
    <div className="rounded-2xl border border-cream-200 bg-white p-5">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-gold-700">
            Upload new artefact
          </p>
          <p className="mt-1 text-xs text-charcoal-500">
            Every upload is hashed, scanned and routed to BHAF for verification.
          </p>
        </div>
        <span className="rounded-full bg-cream-100 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wider text-charcoal-500">
          ISO 27001-aligned
        </span>
      </div>

      <div className="mt-4 grid gap-3 sm:grid-cols-2">
        <label className="block">
          <span className="text-[10px] font-semibold uppercase tracking-wide text-charcoal-500">
            Document name
          </span>
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="e.g. Tax compliance certificate Q2"
            className="mt-1 block w-full rounded-md border border-cream-300 bg-cream-50 px-3 py-2 text-sm text-forest-900 placeholder:text-charcoal-300 focus:border-forest-700 focus:outline-none"
          />
        </label>
        <label className="block">
          <span className="text-[10px] font-semibold uppercase tracking-wide text-charcoal-500">
            Category
          </span>
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="mt-1 block w-full rounded-md border border-cream-300 bg-cream-50 px-3 py-2 text-sm text-forest-900 focus:border-forest-700 focus:outline-none"
          >
            {CATEGORIES.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </label>
      </div>

      <label className="mt-3 flex items-center gap-2 text-xs text-charcoal-600">
        <input
          type="checkbox"
          checked={required}
          onChange={(e) => setRequired(e.target.checked)}
          className="accent-forest-700"
        />
        Mark as a required artefact
      </label>

      <label
        onDragOver={(e) => {
          e.preventDefault();
          setHover(true);
        }}
        onDragLeave={() => setHover(false)}
        onDrop={(e) => {
          e.preventDefault();
          setHover(false);
          pickFile(e.dataTransfer.files?.[0]);
        }}
        className={cn(
          "mt-4 block cursor-pointer rounded-xl border-2 border-dashed px-6 py-8 text-center transition",
          hover ? "border-gold-400 bg-gold-50" : "border-cream-300 bg-cream-50 hover:border-forest-600",
        )}
      >
        <input
          type="file"
          className="hidden"
          accept=".pdf,.jpg,.jpeg,.png,.webp,.zip,.docx,.xlsx"
          onChange={(e) => pickFile(e.target.files?.[0])}
        />
        <div className="mx-auto flex h-11 w-11 items-center justify-center rounded-full bg-forest-800 text-cream-50">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M12 16V4M12 4l-5 5M12 4l5 5" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M4 20h16" strokeLinecap="round" />
          </svg>
        </div>
        <p className="mt-3 text-sm font-medium text-forest-900">
          {file ? file.name : "Drag a document here or click to browse"}
        </p>
        <p className="mt-1 text-[10px] text-charcoal-400">
          PDF · JPG · PNG · WebP · DOCX · XLSX · ZIP · up to 25 MB
        </p>
      </label>

      <button
        type="button"
        onClick={submit}
        disabled={!file || !name || submitting}
        className="btn-primary mt-4 w-full disabled:cursor-not-allowed disabled:opacity-60"
      >
        {submitting ? "Validating…" : "Submit for verification"}
      </button>

      {stage >= 0 && (
        <ul className="mt-4 space-y-2">
          {STAGES.map((s, idx) => {
            const isDone = stage > idx;
            const isActive = stage === idx;
            return (
              <li key={s.key} className="flex items-center gap-3 text-xs">
                <span
                  className={cn(
                    "flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full text-[10px] font-bold",
                    isDone
                      ? "bg-forest-700 text-cream-50"
                      : isActive
                      ? "bg-gold-400 text-forest-900"
                      : "border border-cream-300 bg-white text-charcoal-300",
                  )}
                >
                  {isDone ? "✓" : idx + 1}
                </span>
                <span
                  className={cn(
                    "flex-1",
                    isDone ? "text-forest-700" : isActive ? "text-forest-900" : "text-charcoal-500",
                  )}
                >
                  {s.label}
                </span>
                {isActive && (
                  <span className="flex gap-1">
                    <span className="h-1 w-1 animate-bounce rounded-full bg-gold-500 [animation-delay:-0.2s]" />
                    <span className="h-1 w-1 animate-bounce rounded-full bg-gold-500 [animation-delay:-0.1s]" />
                    <span className="h-1 w-1 animate-bounce rounded-full bg-gold-500" />
                  </span>
                )}
              </li>
            );
          })}
        </ul>
      )}

      {result && (
        <div
          className={cn(
            "mt-4 rounded-md px-3 py-3 text-[11px]",
            result.ok
              ? "border border-forest-200 bg-forest-50 text-forest-800"
              : "border border-red-200 bg-red-50 text-red-700",
          )}
        >
          {result.ok ? (
            <>
              <p className="font-semibold">Queued for BHAF review.</p>
              <p className="mt-1 font-mono text-[10px] text-charcoal-600">
                SHA-256 {result.sha256?.slice(0, 12)}…{result.sha256?.slice(-8)}
              </p>
            </>
          ) : (
            result.message
          )}
        </div>
      )}
    </div>
  );
}
