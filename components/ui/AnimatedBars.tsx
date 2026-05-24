"use client";

import { useEffect, useRef, useState } from "react";

export interface BarRow {
  label: string;
  value: number;
  display: string;
  caption?: string;
}

interface AnimatedBarsProps {
  rows: BarRow[];
  max?: number;
  durationMs?: number;
}

export function AnimatedBars({ rows, max, durationMs = 1400 }: AnimatedBarsProps) {
  const [progress, setProgress] = useState(0);
  const [started, setStarted] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  const peak = max ?? Math.max(...rows.map((r) => r.value));

  useEffect(() => {
    if (started || !ref.current) return;
    const prefersReduced =
      typeof window !== "undefined" && window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;
    if (prefersReduced) {
      setProgress(1);
      setStarted(true);
      return;
    }
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setStarted(true);
          obs.disconnect();
        }
      },
      { threshold: 0.3 },
    );
    obs.observe(ref.current);
    return () => obs.disconnect();
  }, [started]);

  useEffect(() => {
    if (!started) return;
    const start = performance.now();
    let raf = 0;
    const tick = (now: number) => {
      const t = Math.min((now - start) / durationMs, 1);
      const eased = 1 - Math.pow(1 - t, 3);
      setProgress(eased);
      if (t < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [started, durationMs]);

  return (
    <div ref={ref} className="space-y-5">
      {rows.map((row, idx) => {
        const target = (row.value / peak) * 100;
        const width = target * progress;
        return (
          <div key={row.label}>
            <div className="flex items-baseline justify-between gap-4">
              <p className="text-sm font-medium text-forest-900">{row.label}</p>
              <p className="font-serif text-base font-bold text-forest-900">{row.display}</p>
            </div>
            <div className="mt-1.5 h-2.5 overflow-hidden rounded-full bg-cream-200">
              <div
                className="h-full rounded-full bg-gradient-to-r from-forest-700 via-forest-600 to-gold-400 transition-[width] duration-700 ease-out"
                style={{ width: `${width}%`, transitionDelay: `${idx * 80}ms` }}
              />
            </div>
            {row.caption && (
              <p className="mt-1 text-[11px] text-charcoal-500">{row.caption}</p>
            )}
          </div>
        );
      })}
    </div>
  );
}
