"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";

const STAGES = [
  { key: "uploading", label: "Uploading & hashing" },
  { key: "scan", label: "Antivirus & integrity scan" },
  { key: "format", label: "Format & metadata validation" },
  { key: "match", label: "Cross-check against profile" },
  { key: "queue", label: "Queued for BHAF review" },
];

interface UploadDropzoneProps {
  helperText?: string;
  acceptHint?: string;
}

export function UploadDropzone({
  helperText = "Drag a document here or click to browse — PDF, JPG, PNG up to 25 MB.",
  acceptHint = "PDF · JPG · PNG · DOCX",
}: UploadDropzoneProps) {
  const [hover, setHover] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [stage, setStage] = useState<number>(-1);

  function runMockPipeline(f: File) {
    setFile(f);
    setStage(0);
    STAGES.forEach((_, idx) => {
      window.setTimeout(() => setStage(idx + 1), 700 * (idx + 1));
    });
  }

  function handleSelect(f?: File | null) {
    if (!f) return;
    runMockPipeline(f);
  }

  const done = stage >= STAGES.length;

  return (
    <div className="rounded-2xl border border-cream-200 bg-white p-5">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-gold-700">
            Upload new artefact
          </p>
          <p className="mt-1 text-xs text-charcoal-500">
            All uploads are hashed, scanned and routed to the BHAF verification queue.
          </p>
        </div>
        <span className="rounded-full bg-cream-100 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wider text-charcoal-500">
          ISO 27001-aligned
        </span>
      </div>

      <label
        onDragOver={(e) => {
          e.preventDefault();
          setHover(true);
        }}
        onDragLeave={() => setHover(false)}
        onDrop={(e) => {
          e.preventDefault();
          setHover(false);
          handleSelect(e.dataTransfer.files?.[0]);
        }}
        className={cn(
          "mt-4 block cursor-pointer rounded-xl border-2 border-dashed px-6 py-10 text-center transition",
          hover ? "border-gold-400 bg-gold-50" : "border-cream-300 bg-cream-50 hover:border-forest-600",
        )}
      >
        <input
          type="file"
          className="hidden"
          accept=".pdf,.jpg,.jpeg,.png,.docx"
          onChange={(e) => handleSelect(e.target.files?.[0])}
        />
        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-forest-800 text-cream-50">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M12 16V4M12 4l-5 5M12 4l5 5" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M4 20h16" strokeLinecap="round" />
          </svg>
        </div>
        <p className="mt-3 text-sm font-medium text-forest-900">{helperText}</p>
        <p className="mt-1 text-[11px] text-charcoal-400">{acceptHint}</p>
      </label>

      {file && (
        <div className="mt-4 rounded-xl border border-cream-200 bg-cream-50 p-4">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="min-w-0">
              <p className="truncate font-mono text-xs text-forest-900">{file.name}</p>
              <p className="text-[10px] text-charcoal-400">{(file.size / 1024).toFixed(1)} KB</p>
            </div>
            <span
              className={cn(
                "rounded-full px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wider",
                done
                  ? "bg-forest-50 text-forest-800"
                  : "bg-blue-50 text-[#0d2840]",
              )}
            >
              {done ? "Queued for review" : "Validating"}
            </span>
          </div>

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
                      isDone ? "text-forest-700 line-through decoration-forest-300" : isActive ? "text-forest-900" : "text-charcoal-500",
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

          {done && (
            <p className="mt-4 rounded-md bg-forest-50 px-3 py-2 text-[11px] text-forest-800">
              Submitted to BHAF verification queue. You'll receive an update within 24 hours. Tamper-evident
              hash recorded in the audit log.
            </p>
          )}
        </div>
      )}
    </div>
  );
}
