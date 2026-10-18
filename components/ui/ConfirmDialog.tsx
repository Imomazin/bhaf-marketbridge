"use client";

import { useEffect } from "react";
import { cn } from "@/lib/utils";

interface ConfirmDialogProps {
  /** When true the dialog is shown */
  open: boolean;
  /** Called when the user clicks “Confirm” */
  onConfirm: () => void;
  /** Called when the user clicks “Cancel” or dismisses the dialog */
  onClose: () => void;
  /** Text shown in the dialog header */
  title: string;
  /** Optional description underneath the title */
  description?: string;
  /** Text for the confirm button (defaults to “Confirm”) */
  confirmLabel?: string;
  /** Optional custom styling (e.g. accent) */
  variant?: "gold" | "forest";
}

export function ConfirmDialog({
  open,
  onConfirm,
  onClose,
  title,
  description,
  confirmLabel = "Confirm",
  variant = "forest",
}: ConfirmDialogProps) {
  useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  if (!open) return null;

  const accentButton =
    variant === "gold"
      ? "bg-gold-500 text-forest-950 hover:bg-gold-400"
      : "bg-forest-800 text-cream-50 hover:bg-forest-700";

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={title}
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
    >
      {/* Backdrop */}
      <button
        type="button"
        aria-label="Close dialog"
        onClick={onClose}
        className="absolute inset-0 bg-charcoal-900/50 backdrop-blur-sm transition-opacity"
      />

      {/* Modal panel */}
      <div className="relative z-10 w-full max-w-md rounded-2xl border border-cream-200 bg-white p-6 shadow-xl">
        <h3 className="font-serif text-xl text-forest-900">{title}</h3>
        {description && <p className="mt-2 text-sm text-charcoal-600 leading-relaxed">{description}</p>}

        <div className="mt-6 flex items-center justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            className="rounded-md border border-cream-300 px-3.5 py-2 text-xs font-medium text-charcoal-700 hover:border-forest-700 hover:text-forest-900 transition"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={onConfirm}
            className={cn(
              "rounded-md px-4 py-2 text-xs font-semibold shadow-sm transition",
              accentButton
            )}
          >
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}

