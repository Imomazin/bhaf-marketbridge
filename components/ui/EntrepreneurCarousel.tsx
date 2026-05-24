"use client";

import { useEffect, useState } from "react";
import { EntrepreneurCard } from "@/components/cards/EntrepreneurCard";
import type { Entrepreneur } from "@/data/entrepreneurs";
import { cn } from "@/lib/utils";

interface EntrepreneurCarouselProps {
  entrepreneurs: Entrepreneur[];
  autoAdvanceMs?: number;
}

export function EntrepreneurCarousel({
  entrepreneurs,
  autoAdvanceMs = 7000,
}: EntrepreneurCarouselProps) {
  const [page, setPage] = useState(0);
  const [paused, setPaused] = useState(false);
  // 3 per page on desktop, 1 on mobile. We use CSS to display 3 at a time
  // and advance one card per tick so it feels like a smooth rotation.
  const totalPages = entrepreneurs.length;

  useEffect(() => {
    if (paused) return;
    const prefersReduced =
      typeof window !== "undefined" && window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;
    if (prefersReduced) return;
    const id = window.setInterval(() => {
      setPage((p) => (p + 1) % totalPages);
    }, autoAdvanceMs);
    return () => window.clearInterval(id);
  }, [paused, totalPages, autoAdvanceMs]);

  // Build the visible window: 3 cards starting from `page`, wrapping around
  const visible = [0, 1, 2].map((offset) => entrepreneurs[(page + offset) % totalPages]);

  return (
    <div onMouseEnter={() => setPaused(true)} onMouseLeave={() => setPaused(false)}>
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {visible.map((e, idx) => (
          <div
            key={`${page}-${e.id}`}
            className="animate-fade-in"
            style={{ animationDelay: `${idx * 80}ms` }}
          >
            <EntrepreneurCard entrepreneur={e} />
          </div>
        ))}
      </div>

      <div className="mt-6 flex items-center justify-center gap-2">
        {entrepreneurs.map((_, idx) => (
          <button
            key={idx}
            onClick={() => setPage(idx)}
            aria-label={`Show entrepreneur ${idx + 1}`}
            className={cn(
              "h-1 rounded-full transition-all duration-300",
              idx === page ? "w-10 bg-gold-500" : "w-3 bg-cream-300 hover:bg-charcoal-400",
            )}
          />
        ))}
      </div>
    </div>
  );
}
