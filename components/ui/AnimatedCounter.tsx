"use client";

import { useEffect, useRef, useState } from "react";
import { usePrefersReducedMotion } from "@/components/hooks/usePrefersReducedMotion";

interface AnimatedCounterProps {
  to: number;
  prefix?: string;
  suffix?: string;
  decimals?: number;
  durationMs?: number;
  format?: "number" | "compact";
}

export function AnimatedCounter({
  to,
  prefix = "",
  suffix = "",
  decimals = 0,
  durationMs = 1600,
  format = "number",
}: AnimatedCounterProps) {
  const prefersReduced = usePrefersReducedMotion();
  const [value, setValue] = useState(0);
  const [started, setStarted] = useState(false);
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    if (prefersReduced || started || !ref.current) return;
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
  }, [started, prefersReduced]);

  useEffect(() => {
    if (prefersReduced || !started) return;
    const start = performance.now();
    let raf = 0;
    const tick = (now: number) => {
      const elapsed = now - start;
      const t = Math.min(elapsed / durationMs, 1);
      const eased = 1 - Math.pow(1 - t, 3);
      setValue(to * eased);
      if (t < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [started, to, durationMs, prefersReduced]);

  const effectiveValue = prefersReduced ? to : value;
  const formatted =
    format === "compact" && effectiveValue >= 1_000_000
      ? `${(effectiveValue / 1_000_000).toFixed(decimals || 1)}M`
      : format === "compact" && effectiveValue >= 1_000
      ? `${(effectiveValue / 1_000).toFixed(decimals || 1)}k`
      : decimals > 0
      ? effectiveValue.toFixed(decimals)
      : Math.round(effectiveValue).toLocaleString();

  return (
    <span ref={ref}>
      {prefix}
      {formatted}
      {suffix}
    </span>
  );
}
