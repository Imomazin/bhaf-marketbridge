"use client";

import { useMemo, useState } from "react";
import {
  projectorBaselines,
  projectorCoefficients,
  projectorMaxes,
  type ProjectorCoefficient,
} from "@/data/use-cases";

/**
 * Interactive projection of MarketBridge outputs from three inputs:
 * entrepreneurs onboarded, cohorts run, RFPs facilitated. Every output
 * is labelled as a projection — coefficients are illustrative and will
 * be replaced with BHAF data once available.
 */
export function ImpactProjector() {
  const [entrepreneurs, setEntrepreneurs] = useState(projectorBaselines.entrepreneurs);
  const [cohorts, setCohorts] = useState(projectorBaselines.cohorts);
  const [rfps, setRfps] = useState(projectorBaselines.rfps);

  const outputs = useMemo(() => {
    return projectorCoefficients.map((c) => {
      const base =
        c.source === "entrepreneur"
          ? entrepreneurs
          : c.source === "cohort"
          ? cohorts
          : rfps;
      const value = Math.round(base * c.perUnit);
      return { ...c, base, value };
    });
  }, [entrepreneurs, cohorts, rfps]);

  const reset = () => {
    setEntrepreneurs(projectorBaselines.entrepreneurs);
    setCohorts(projectorBaselines.cohorts);
    setRfps(projectorBaselines.rfps);
  };

  return (
    <section
      id="impact-projector"
      className="scroll-mt-24 border-t border-cream-200 bg-gradient-to-b from-cream-50 to-white py-16 md:py-20"
    >
      <div className="container-edge max-w-6xl">
        <header className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-gold-700">
              Impact projector · MVP demonstration
            </p>
            <h2 className="mt-2 font-serif text-2xl text-forest-900 md:text-3xl">
              Set the dials. See the projection.
            </h2>
            <p className="mt-2 max-w-2xl text-sm text-charcoal-600">
              Move the three sliders to see how MarketBridge inputs could compound across the
              ecosystem. Every figure is an illustrative projection — coefficients are placeholders
              to be replaced with BHAF&apos;s own once available.
            </p>
          </div>
          <button
            type="button"
            onClick={reset}
            className="btn-secondary !py-2 !px-4 text-xs"
          >
            Reset to baseline
          </button>
        </header>

        <div className="mt-10 grid gap-6 lg:grid-cols-[1fr_1.6fr]">
          {/* Sliders */}
          <div className="space-y-5">
            <Slider
              label="Verified entrepreneurs onboarded"
              hint="Profile completed and at least one artefact validated"
              accent="forest"
              value={entrepreneurs}
              max={projectorMaxes.entrepreneurs}
              onChange={setEntrepreneurs}
            />
            <Slider
              label="Cohorts run"
              hint="BHAF programmes (Abuja, FEMEC, future cohorts)"
              accent="gold"
              value={cohorts}
              max={projectorMaxes.cohorts}
              onChange={setCohorts}
            />
            <Slider
              label="RFPs facilitated"
              hint="Corporate or public-sector RFPs posted on MarketBridge"
              accent="navy"
              value={rfps}
              max={projectorMaxes.rfps}
              onChange={setRfps}
            />

            <div className="rounded-xl border border-cream-200 bg-white p-4 text-[12px] leading-relaxed text-charcoal-600">
              <p className="font-semibold text-forest-900">How the projection works</p>
              <p className="mt-1">
                Each output = an input × a coefficient. For example, every additional cohort is
                assumed to produce a fixed number of graduations and funding-ready businesses. The
                coefficients live in <code className="font-mono text-[11px]">data/use-cases.ts</code>
                {" "}and are clearly marked as illustrative.
              </p>
            </div>
          </div>

          {/* Outputs */}
          <div>
            <div className="grid gap-3 sm:grid-cols-2">
              {outputs.map((o) => (
                <OutputTile key={o.key} c={o} />
              ))}
            </div>

            <div className="mt-4 inline-flex items-center gap-2 rounded-full border border-gold-200 bg-gold-50 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.14em] text-gold-800">
              <span aria-hidden className="h-1.5 w-1.5 rounded-full bg-gold-500" />
              Indicative projections only
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function Slider({
  label,
  hint,
  accent,
  value,
  max,
  onChange,
}: {
  label: string;
  hint: string;
  accent: "forest" | "gold" | "navy";
  value: number;
  max: number;
  onChange: (n: number) => void;
}) {
  const accentClass: Record<typeof accent, { eyebrow: string; track: string }> = {
    forest: { eyebrow: "text-forest-700", track: "accent-forest-800" },
    gold: { eyebrow: "text-gold-700", track: "accent-gold-500" },
    navy: { eyebrow: "text-blue-700", track: "accent-blue-700" },
  };
  const a = accentClass[accent];
  return (
    <div className="rounded-xl border border-cream-200 bg-white p-4 shadow-soft">
      <div className="flex items-end justify-between gap-3">
        <div>
          <p className={`text-[10px] font-semibold uppercase tracking-[0.18em] ${a.eyebrow}`}>
            {label}
          </p>
          <p className="text-[11px] text-charcoal-500">{hint}</p>
        </div>
        <span className="font-serif text-2xl text-forest-900 tabular-nums">{value}</span>
      </div>
      <input
        type="range"
        min={0}
        max={max}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className={`mt-3 w-full ${a.track}`}
        aria-label={`${label}: ${value} of ${max}`}
      />
      <div className="mt-1 flex justify-between text-[10px] uppercase tracking-[0.14em] text-charcoal-400">
        <span>0</span>
        <span>{max}</span>
      </div>
    </div>
  );
}

function OutputTile({ c }: { c: ProjectorCoefficient & { base: number; value: number } }) {
  return (
    <div className="rounded-xl border border-cream-200 bg-white p-4 shadow-soft">
      <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-charcoal-500">
        Projected
      </p>
      <p className="mt-1 font-serif text-3xl text-forest-900 tabular-nums">
        {c.value.toLocaleString()}
      </p>
      <p className="mt-0.5 text-sm font-medium text-forest-900">{c.label}</p>
      <p className="mt-1.5 text-[10px] text-charcoal-500">
        Assumes <span className="font-mono text-charcoal-700">{c.perUnit}</span> per{" "}
        {c.source === "entrepreneur"
          ? "verified entrepreneur"
          : c.source === "cohort"
          ? "cohort"
          : "RFP"}
        .
      </p>
    </div>
  );
}
