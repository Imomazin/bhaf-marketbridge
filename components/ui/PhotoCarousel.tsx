"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import type { BhafPhoto } from "@/data/photos";
import { cn } from "@/lib/utils";

export interface PhotoSlide {
  photo: BhafPhoto;
  location: string;
  event: string;
  caption: string;
}

interface PhotoCarouselProps {
  slides: PhotoSlide[];
  autoAdvanceMs?: number;
}

export function PhotoCarousel({ slides, autoAdvanceMs = 5500 }: PhotoCarouselProps) {
  const [active, setActive] = useState(0);
  const [paused, setPaused] = useState(false);
  const trackRef = useRef<HTMLDivElement>(null);

  // Auto-advance
  useEffect(() => {
    if (paused) return;
    const prefersReduced =
      typeof window !== "undefined" && window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;
    if (prefersReduced) return;
    const id = window.setInterval(() => {
      setActive((i) => (i + 1) % slides.length);
    }, autoAdvanceMs);
    return () => window.clearInterval(id);
  }, [paused, slides.length, autoAdvanceMs]);

  // Scroll active slide into view
  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;
    const card = track.children[active] as HTMLElement | undefined;
    if (card) {
      track.scrollTo({ left: card.offsetLeft - track.offsetLeft, behavior: "smooth" });
    }
  }, [active]);

  const go = (dir: -1 | 1) => {
    setActive((i) => (i + dir + slides.length) % slides.length);
  };

  return (
    <div
      className="relative"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      {/* Scrolling track */}
      <div
        ref={trackRef}
        className="flex snap-x snap-mandatory gap-5 overflow-x-auto scroll-smooth pb-2 [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden"
      >
        {slides.map((s, idx) => (
          <figure
            key={s.photo.src}
            className="group relative w-[85%] flex-shrink-0 snap-center sm:w-[60%] lg:w-[42%] xl:w-[36%]"
          >
            <div className="relative aspect-[4/5] overflow-hidden rounded-3xl bg-forest-900 ring-1 ring-cream-200">
              <Image
                src={s.photo.src}
                alt={s.photo.alt}
                fill
                sizes="(max-width: 640px) 85vw, (max-width: 1024px) 60vw, 500px"
                className={cn(
                  "object-cover transition duration-700",
                  idx === active ? "scale-[1.02]" : "scale-100",
                  "group-hover:scale-[1.04]",
                )}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-forest-950/90 via-forest-950/15 to-transparent" />
              <figcaption className="absolute inset-x-0 bottom-0 p-6 text-cream-50">
                <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-gold-300">
                  {s.location} · {s.event}
                </p>
                <p className="mt-1.5 font-serif text-lg leading-snug">{s.caption}</p>
              </figcaption>
            </div>
          </figure>
        ))}
      </div>

      {/* Controls row */}
      <div className="mt-6 flex items-center justify-between">
        <div className="flex gap-1.5">
          {slides.map((_, idx) => (
            <button
              key={idx}
              onClick={() => setActive(idx)}
              aria-label={`Go to slide ${idx + 1}`}
              className={cn(
                "h-1 rounded-full transition-all duration-300",
                idx === active ? "w-10 bg-gold-500" : "w-3 bg-cream-300 hover:bg-charcoal-400",
              )}
            />
          ))}
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => go(-1)}
            aria-label="Previous"
            className="flex h-10 w-10 items-center justify-center rounded-full border border-cream-300 text-forest-900 transition hover:border-forest-700 hover:bg-forest-50"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
              <path d="M15 6l-6 6 6 6" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
          <button
            onClick={() => go(1)}
            aria-label="Next"
            className="flex h-10 w-10 items-center justify-center rounded-full bg-forest-800 text-cream-50 transition hover:bg-forest-700"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
              <path d="M9 6l6 6-6 6" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}
