"use client";

export function PrintButton() {
  return (
    <button onClick={() => window.print()} className="btn-primary">
      Save as PDF (Browser → Print)
    </button>
  );
}
