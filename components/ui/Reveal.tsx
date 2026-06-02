"use client";

import { useEffect, useRef, useState } from "react";
import { usePrefersReducedMotion } from "@/components/hooks/usePrefersReducedMotion";
import { cn } from "@/lib/utils";

interface RevealProps {
  children: React.ReactNode;
  className?: string;
  delayMs?: number;
  from?: "up" | "left" | "right" | "fade";
}

export function Reveal({ children, className, delayMs = 0, from = "up" }: RevealProps) {
  const prefersReduced = usePrefersReducedMotion();
  const [visible, setVisible] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  // When the user prefers reduced motion we render in the final
  // "visible" state immediately by short-circuiting the className below.
  const effectivelyVisible = visible || prefersReduced;

  useEffect(() => {
    if (prefersReduced || !ref.current) return;
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          obs.disconnect();
        }
      },
      { threshold: 0.12, rootMargin: "0px 0px -60px 0px" },
    );
    obs.observe(ref.current);
    return () => obs.disconnect();
  }, [prefersReduced]);

  const offClass =
    from === "left"
      ? "-translate-x-6 opacity-0"
      : from === "right"
      ? "translate-x-6 opacity-0"
      : from === "fade"
      ? "opacity-0"
      : "translate-y-6 opacity-0";

  return (
    <div
      ref={ref}
      style={{ transitionDelay: `${delayMs}ms` }}
      className={cn(
        "transition-all duration-700 ease-out will-change-transform",
        effectivelyVisible ? "translate-x-0 translate-y-0 opacity-100" : offClass,
        className,
      )}
    >
      {children}
    </div>
  );
}
