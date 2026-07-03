"use client";

import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

interface Section {
  id: string;
  label: string;
  tone: "forest" | "gold" | "navy" | "charcoal";
}

const sections: Section[] = [
  { id: "use-cases-overview", label: "Overview", tone: "charcoal" },
  { id: "use-case-1", label: "01 · Entrepreneur", tone: "forest" },
  { id: "use-case-2", label: "02 · Buyer", tone: "gold" },
  { id: "use-case-3", label: "03 · Funder", tone: "navy" },
  { id: "impact-projector", label: "Projector", tone: "charcoal" },
  { id: "feature-value-map", label: "Feature map", tone: "charcoal" },
  { id: "faq", label: "FAQ", tone: "charcoal" },
];

const toneClass: Record<Section["tone"], string> = {
  forest: "data-[active=true]:bg-forest-800 data-[active=true]:text-cream-50",
  gold: "data-[active=true]:bg-gold-500 data-[active=true]:text-forest-900",
  navy: "data-[active=true]:bg-blue-700 data-[active=true]:text-cream-50",
  charcoal: "data-[active=true]:bg-charcoal-800 data-[active=true]:text-cream-50",
};

export function StickyJourneyNav() {
  const [active, setActive] = useState<string>("use-cases-overview");
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      // Show only after the hero has scrolled past (~520px)
      setVisible(window.scrollY > 480);
    };
    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    if (typeof IntersectionObserver === "undefined") return;
    const observer = new IntersectionObserver(
      (entries) => {
        const visibleEntries = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio);
        if (visibleEntries[0]) setActive(visibleEntries[0].target.id);
      },
      { rootMargin: "-30% 0px -55% 0px", threshold: [0, 0.25, 0.5, 0.75, 1] },
    );
    sections.forEach((s) => {
      const el = document.getElementById(s.id);
      if (el) observer.observe(el);
    });
    return () => observer.disconnect();
  }, []);

  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>, id: string) => {
    e.preventDefault();
    const el = document.getElementById(id);
    if (!el) return;
    el.scrollIntoView({ behavior: "smooth", block: "start" });
    history.replaceState(null, "", `#${id}`);
  };

  return (
    <div
      aria-label="Use case navigation"
      role="navigation"
      className={cn(
        "sticky top-16 z-30 border-b border-cream-200 bg-cream-50/95 backdrop-blur transition-all duration-300",
        visible ? "translate-y-0 opacity-100" : "pointer-events-none -translate-y-2 opacity-0",
      )}
    >
      <div className="container-edge max-w-6xl">
        <ul className="flex items-center gap-1 overflow-x-auto py-2 text-[11px] font-semibold uppercase tracking-[0.12em]">
          {sections.map((s) => (
            <li key={s.id} className="flex-shrink-0">
              <a
                href={`#${s.id}`}
                onClick={(e) => handleClick(e, s.id)}
                data-active={active === s.id}
                className={cn(
                  "inline-flex items-center gap-1.5 rounded-full border border-cream-200 bg-white px-3 py-1.5 text-charcoal-600 transition hover:border-forest-300 hover:text-forest-900",
                  toneClass[s.tone],
                )}
              >
                <span
                  aria-hidden
                  className="h-1.5 w-1.5 rounded-full bg-current opacity-60"
                />
                {s.label}
              </a>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
