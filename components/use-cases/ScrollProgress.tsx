"use client";

import { useEffect, useState } from "react";

/**
 * Thin gold progress bar under the navbar showing how far through the
 * Use Cases page the reader has scrolled. Small polish signal for
 * institutional audiences.
 */
export function ScrollProgress() {
  const [pct, setPct] = useState(0);

  useEffect(() => {
    const compute = () => {
      const doc = document.documentElement;
      const scrolled = window.scrollY;
      const total = doc.scrollHeight - doc.clientHeight;
      const next = total > 0 ? Math.min(100, (scrolled / total) * 100) : 0;
      setPct(next);
    };
    compute();
    window.addEventListener("scroll", compute, { passive: true });
    window.addEventListener("resize", compute);
    return () => {
      window.removeEventListener("scroll", compute);
      window.removeEventListener("resize", compute);
    };
  }, []);

  return (
    <div
      aria-hidden
      className="fixed inset-x-0 top-16 z-40 h-0.5 bg-transparent print:hidden"
    >
      <div
        className="h-full bg-gradient-to-r from-gold-400 via-gold-500 to-gold-300 transition-[width] duration-150"
        style={{ width: `${pct}%` }}
      />
    </div>
  );
}
