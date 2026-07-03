"use client";

import { useEffect, useState } from "react";
import { quoteSlots } from "@/data/quotes";
import { usePrefersReducedMotion } from "@/components/hooks/usePrefersReducedMotion";
import { cn } from "@/lib/utils";

const AUTO_ADVANCE_MS = 6500;

const stakeholderTone: Record<string, string> = {
  Entrepreneur: "border-forest-200 bg-forest-50 text-forest-800",
  Buyer: "border-gold-200 bg-gold-50 text-gold-800",
  Funder: "border-blue-200 bg-blue-50 text-blue-800",
  Partner: "border-cream-300 bg-cream-100 text-charcoal-700",
};

export function QuoteCarousel() {
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const prefersReduced = usePrefersReducedMotion();

  useEffect(() => {
    if (prefersReduced || paused) return;
    const t = setInterval(() => {
      setIndex((i) => (i + 1) % quoteSlots.length);
    }, AUTO_ADVANCE_MS);
    return () => clearInterval(t);
  }, [prefersReduced, paused]);

  const q = quoteSlots[index];

  return (
    <section
      aria-label="Placeholder testimonial carousel"
      className="border-y border-cream-200 bg-cream-50 py-14 md:py-16"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      <div className="container-edge max-w-4xl">
        <div className="flex items-center justify-between">
          <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-gold-700">
            Voices we expect to hear
          </p>
          <span className="inline-flex items-center gap-1.5 rounded-full border border-gold-300 bg-white px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.14em] text-gold-800">
            <span aria-hidden className="h-1.5 w-1.5 rounded-full bg-gold-500" />
            Placeholder attributions
          </span>
        </div>

        <div className="relative mt-6 rounded-2xl border border-cream-200 bg-white p-6 shadow-card md:p-10">
          {/* Big decorative quote glyph */}
          <span
            aria-hidden
            className="pointer-events-none absolute left-4 top-2 font-serif text-6xl leading-none text-gold-200 md:left-6 md:text-8xl"
          >
            &ldquo;
          </span>

          <blockquote className="relative pl-8 md:pl-14">
            <p className="font-serif text-lg leading-snug text-forest-900 md:text-2xl">
              {q.body}
            </p>
            <footer className="mt-5 flex flex-wrap items-center gap-3">
              <span
                className={cn(
                  "inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.14em]",
                  stakeholderTone[q.stakeholder],
                )}
              >
                <span aria-hidden className="h-1.5 w-1.5 rounded-full bg-current opacity-70" />
                {q.stakeholder}
              </span>
              <span className="text-[12px] text-charcoal-600">
                {q.role} <span className="text-charcoal-400">·</span> {q.region}
              </span>
            </footer>
          </blockquote>
        </div>

        {/* Dot controls */}
        <div className="mt-5 flex items-center justify-center gap-2" role="tablist" aria-label="Testimonial pager">
          {quoteSlots.map((_, i) => (
            <button
              key={i}
              type="button"
              role="tab"
              aria-selected={i === index}
              aria-label={`Show testimonial ${i + 1} of ${quoteSlots.length}`}
              onClick={() => setIndex(i)}
              className={cn(
                "h-2 rounded-full transition-all",
                i === index
                  ? "w-8 bg-forest-800"
                  : "w-2 bg-cream-300 hover:bg-forest-300",
              )}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
