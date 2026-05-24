"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import type { BhafPhoto } from "@/data/photos";
import { cn } from "@/lib/utils";

export interface HeroSlide {
  photo: BhafPhoto;
  location: string;
  event: string;
}

interface HeroPhotoCarouselProps {
  slides: HeroSlide[];
  intervalMs?: number;
}

export function HeroPhotoCarousel({ slides, intervalMs = 6500 }: HeroPhotoCarouselProps) {
  const [active, setActive] = useState(0);
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    if (paused) return;
    const prefersReduced =
      typeof window !== "undefined" && window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;
    if (prefersReduced) return;
    const id = window.setInterval(() => {
      setActive((i) => (i + 1) % slides.length);
    }, intervalMs);
    return () => window.clearInterval(id);
  }, [paused, slides.length, intervalMs]);

  return (
    <div
      className="absolute inset-0"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      {slides.map((s, idx) => (
        <Image
          key={s.photo.src}
          src={s.photo.src}
          alt={s.photo.alt}
          fill
          priority={idx === 0}
          sizes="100vw"
          className={cn(
            "object-cover object-center transition-opacity duration-[1800ms] ease-in-out",
            idx === active ? "opacity-100" : "opacity-0",
            idx === active ? "animate-slow-zoom" : "",
          )}
        />
      ))}

      {/* Active slide caption — top-right */}
      <div className="pointer-events-none absolute right-6 top-6 z-10 hidden text-right md:block">
        <p
          key={`caption-${active}`}
          className="animate-fade-in text-[10px] font-semibold uppercase tracking-[0.18em] text-gold-300"
        >
          {slides[active].location}
        </p>
        <p key={`event-${active}`} className="animate-fade-in mt-0.5 text-xs text-cream-100/85">
          {slides[active].event}
        </p>
      </div>

      {/* Dot navigation */}
      <div className="absolute bottom-32 right-6 z-10 flex gap-1.5 md:bottom-36">
        {slides.map((_, idx) => (
          <button
            key={idx}
            onClick={() => setActive(idx)}
            aria-label={`Show photo ${idx + 1} of ${slides.length}`}
            className={cn(
              "h-1 rounded-full transition-all duration-300",
              idx === active ? "w-8 bg-gold-400" : "w-3 bg-cream-50/40 hover:bg-cream-50/70",
            )}
          />
        ))}
      </div>
    </div>
  );
}
