"use client";

import { cn } from "@/lib/utils";

/**
 * "I'm a ___" pill selector. Addresses "who is this for me?" in the
 * first three seconds. Clicking a role smooth-scrolls the audience to
 * the relevant use case section.
 */

interface Choice {
  id: string;
  label: string;
  anchor: string;
  tone: "forest" | "gold" | "navy" | "charcoal";
}

const choices: Choice[] = [
  { id: "entrepreneur", label: "an Entrepreneur", anchor: "use-case-1", tone: "forest" },
  { id: "buyer", label: "a Buyer", anchor: "use-case-2", tone: "gold" },
  { id: "funder", label: "a Funder", anchor: "use-case-3", tone: "navy" },
  { id: "partner", label: "a Partner", anchor: "closing-cta", tone: "charcoal" },
];

const toneClass: Record<Choice["tone"], string> = {
  forest: "hover:border-forest-300 hover:bg-forest-800/40",
  gold: "hover:border-gold-300 hover:bg-gold-500/20",
  navy: "hover:border-blue-300 hover:bg-blue-700/30",
  charcoal: "hover:border-cream-200 hover:bg-white/10",
};

export function StakeholderSwitcher() {
  const handleClick = (e: React.MouseEvent<HTMLButtonElement>, anchor: string) => {
    e.preventDefault();
    const el = document.getElementById(anchor);
    if (!el) return;
    el.scrollIntoView({ behavior: "smooth", block: "start" });
    history.replaceState(null, "", `#${anchor}`);
  };

  return (
    <div className="mt-6" role="group" aria-label="Who are you? Jump to your use case.">
      <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-gold-300">
        Jump to your journey
      </p>
      <div className="mt-2 flex flex-wrap items-center gap-2">
        <span className="text-sm text-cream-200">I&apos;m</span>
        {choices.map((c) => (
          <button
            key={c.id}
            type="button"
            onClick={(e) => handleClick(e, c.anchor)}
            className={cn(
              "inline-flex items-center gap-1.5 rounded-full border border-cream-50/25 bg-white/[0.04] px-3 py-1.5 text-[12px] font-semibold text-cream-50 transition backdrop-blur",
              toneClass[c.tone],
            )}
          >
            <span aria-hidden className="h-1.5 w-1.5 rounded-full bg-gold-400" />
            {c.label}
            <span aria-hidden className="text-gold-300">→</span>
          </button>
        ))}
      </div>
    </div>
  );
}
