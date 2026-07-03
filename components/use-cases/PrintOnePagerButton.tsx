"use client";

/**
 * Triggers the browser's print dialog so the audience can save a PDF
 * one-pager of a use case detail page. The detail page hides sticky
 * elements and decorative backgrounds via Tailwind's `print:` variants.
 */
export function PrintOnePagerButton() {
  return (
    <button
      type="button"
      onClick={() => window.print()}
      className="btn-secondary !py-2 !px-4 text-xs"
    >
      <svg
        width="14"
        height="14"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden
        className="mr-1.5"
      >
        <path d="M6 9V2h12v7M6 18H4a2 2 0 01-2-2v-5a2 2 0 012-2h16a2 2 0 012 2v5a2 2 0 01-2 2h-2M6 14h12v8H6z" />
      </svg>
      Save one-pager (PDF)
    </button>
  );
}
