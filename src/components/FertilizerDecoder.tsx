import React, { useState, useMemo } from "react";
import { motion } from "motion/react";
import FlaskConical from "lucide-react/dist/esm/icons/flask-conical";
import Leaf from "lucide-react/dist/esm/icons/leaf";
import TreePine from "lucide-react/dist/esm/icons/tree-pine";
import Shield from "lucide-react/dist/esm/icons/shield";
import AlertTriangle from "lucide-react/dist/esm/icons/alert-triangle";
import ChevronDown from "lucide-react/dist/esm/icons/chevron-down";
import { cn } from "@/lib/utils";
import { useProfile } from "@/context/ProfileContext";
import { fertilizerPresets, type FertilizerPreset } from "@/data/fertilizerPresets";

/* ------------------------------------------------------------------ */
/*  Types                                                              */
/* ------------------------------------------------------------------ */

interface AnalysisResult {
  rating: string;
  ratingColor: string;
  bestUse: string;
  warnings: string[];
  nPerThousand: number;
  pPerThousand: number;
  kPerThousand: number;
}

/* ------------------------------------------------------------------ */
/*  Analysis logic                                                     */
/* ------------------------------------------------------------------ */

function analyze(
  n: number,
  p: number,
  k: number,
  bagLbs: number,
  lawnSqFt: number,
): AnalysisResult {
  const total = n + p + k || 1;
  const nRatio = n / total;
  const pRatio = p / total;
  const kRatio = k / total;

  // lbs of actual nutrient per 1,000 sq ft
  const factor = lawnSqFt > 0 ? (bagLbs / lawnSqFt) * 1000 : 0;
  const nPerThousand = (n / 100) * factor;
  const pPerThousand = (p / 100) * factor;
  const kPerThousand = (k / 100) * factor;

  // Classification
  let rating: string;
  let ratingColor: string;
  let bestUse: string;

  if (pRatio > 0.35) {
    rating = "Starter";
    ratingColor = "text-amber-600 dark:text-amber-400";
    bestUse = "New lawn establishment — seed or sod installation";
  } else if (kRatio > 0.35) {
    rating = "Winterizer";
    ratingColor = "text-blue-600 dark:text-blue-400";
    bestUse = "Late-fall application for winter hardiness and root storage";
  } else if (nRatio > 0.6) {
    rating = "High Nitrogen";
    ratingColor = "text-green-600 dark:text-green-400";
    bestUse = "Spring green-up or mid-season color boost";
  } else {
    rating = "Balanced";
    ratingColor = "text-primary";
    bestUse = "General-purpose maintenance feeding";
  }

  // Warnings
  const warnings: string[] = [];
  if (p > 0) {
    warnings.push(
      "High phosphorus — check local regulations, many areas restrict P in fertilizers.",
    );
  }
  if (nPerThousand > 1.5) {
    warnings.push(
      "Application rate exceeds 1.5 lb N/1,000 sq ft — risk of fertilizer burn. Consider splitting into two applications.",
    );
  }
  if (n === 0 && p === 0 && k === 0) {
    warnings.push("All values are zero — enter the N-P-K numbers from your fertilizer bag.");
  }

  return { rating, ratingColor, bestUse, warnings, nPerThousand, pPerThousand, kPerThousand };
}

/* ------------------------------------------------------------------ */
/*  Sub-components                                                     */
/* ------------------------------------------------------------------ */

function NpkBar({ label, value, max, color }: { label: string; value: number; max: number; color: string }) {
  const pct = max > 0 ? Math.min((value / max) * 100, 100) : 0;
  return (
    <div className="flex items-center gap-3">
      <span className="w-6 text-xs font-semibold text-muted-foreground">{label}</span>
      <div className="flex-1 h-4 rounded-full bg-muted overflow-hidden">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${pct}%` }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className={cn("h-full rounded-full", color)}
        />
      </div>
      <span className="w-10 text-right text-sm font-medium tabular-nums text-foreground">{value}</span>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Main component                                                     */
/* ------------------------------------------------------------------ */

export const FertilizerDecoder = React.memo(function FertilizerDecoder() {
  const { profile } = useProfile();

  const [n, setN] = useState(0);
  const [p, setP] = useState(0);
  const [k, setK] = useState(0);
  const [bagSize, setBagSize] = useState(25);
  const [lawnSize, setLawnSize] = useState(profile.lawnSizeSqFt ?? 5000);
  const [showResults, setShowResults] = useState(false);

  const result = useMemo(
    () => analyze(n, p, k, bagSize, lawnSize),
    [n, p, k, bagSize, lawnSize],
  );

  const maxNpk = Math.max(n, p, k, 1);

  function applyPreset(preset: FertilizerPreset) {
    setN(preset.n);
    setP(preset.p);
    setK(preset.k);
    setShowResults(true);
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setShowResults(true);
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="rounded-xl border bg-card p-6 shadow-card"
    >
      {/* Header */}
      <div className="flex items-center gap-3 mb-5">
        <div className="rounded-lg bg-primary/10 p-2.5">
          <FlaskConical aria-hidden="true" className="h-5 w-5 text-primary" />
        </div>
        <h2 className="font-display text-lg font-semibold text-foreground [text-wrap:balance]">
          Fertilizer Label Decoder
        </h2>
      </div>

      {/* Preset selector */}
      <div className="mb-5">
        <label htmlFor="preset-select" className="block text-sm font-medium text-muted-foreground mb-1.5">
          Common Presets
        </label>
        <div className="relative">
          <select
            id="preset-select"
            className="w-full appearance-none rounded-lg border border-input bg-background px-3 py-2.5 pr-10 text-sm text-foreground min-h-[44px] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            defaultValue=""
            name="fertilizer-preset"
            onChange={(e) => {
              const preset = fertilizerPresets.find((fp) => fp.name === e.target.value);
              if (preset) applyPreset(preset);
            }}
          >
            <option value="" disabled>
              Select a preset…
            </option>
            {fertilizerPresets.map((fp) => (
              <option key={fp.name} value={fp.name}>
                {fp.name}
              </option>
            ))}
          </select>
          <ChevronDown
            aria-hidden="true"
            className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground"
          />
        </div>
      </div>

      {/* N-P-K Inputs */}
      <form onSubmit={handleSubmit} className="space-y-5">
        <fieldset>
          <legend className="text-sm font-medium text-foreground mb-2">N-P-K Values</legend>
          <div className="grid grid-cols-3 gap-3">
            {([
              { label: "N", value: n, setter: setN, color: "border-green-500 focus-visible:ring-green-500/30" },
              { label: "P", value: p, setter: setP, color: "border-amber-500 focus-visible:ring-amber-500/30" },
              { label: "K", value: k, setter: setK, color: "border-blue-500 focus-visible:ring-blue-500/30" },
            ] as const).map(({ label, value, setter, color }) => (
              <div key={label}>
                <label htmlFor={`npk-${label}`} className="block text-xs font-medium text-muted-foreground mb-1">
                  {label}
                </label>
                <input
                  id={`npk-${label}`}
                  type="number"
                  name={`npk-${label.toLowerCase()}`}
                  autoComplete="off"
                  inputMode="numeric"
                  min={0}
                  max={100}
                  value={value}
                  onChange={(e) => setter(Math.max(0, Math.min(100, Number(e.target.value) || 0)))}
                  className={cn(
                    "w-full rounded-lg border-2 bg-background px-3 py-2 text-center text-lg font-semibold tabular-nums text-foreground min-h-[44px] transition-colors focus-visible:outline-none focus-visible:ring-2",
                    color,
                  )}
                />
              </div>
            ))}
          </div>
        </fieldset>

        {/* Bag size & lawn size */}
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label htmlFor="bag-size" className="block text-xs font-medium text-muted-foreground mb-1">
              Bag Size (lbs)
            </label>
            <input
              id="bag-size"
              type="number"
              name="bag-size"
              autoComplete="off"
              inputMode="numeric"
              min={1}
              max={100}
              value={bagSize}
              onChange={(e) => setBagSize(Math.max(1, Number(e.target.value) || 1))}
              className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm tabular-nums text-foreground min-h-[44px] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            />
          </div>
          <div>
            <label htmlFor="lawn-size-fert" className="block text-xs font-medium text-muted-foreground mb-1">
              Lawn Size (sq ft)
            </label>
            <input
              id="lawn-size-fert"
              type="number"
              name="lawn-size"
              autoComplete="off"
              inputMode="numeric"
              min={100}
              max={200000}
              value={lawnSize}
              onChange={(e) => setLawnSize(Math.max(100, Number(e.target.value) || 100))}
              className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm tabular-nums text-foreground min-h-[44px] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            />
          </div>
        </div>

        <button
          type="submit"
          className="w-full rounded-lg bg-primary px-4 py-2.5 text-sm font-medium text-primary-foreground min-h-[44px] transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
        >
          Decode Label
        </button>
      </form>

      {/* Ratio bar chart */}
      <div className="mt-5 space-y-2">
        <NpkBar label="N" value={n} max={maxNpk} color="bg-green-500" />
        <NpkBar label="P" value={p} max={maxNpk} color="bg-amber-500" />
        <NpkBar label="K" value={k} max={maxNpk} color="bg-blue-500" />
      </div>

      {/* Results */}
      {showResults && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          transition={{ duration: 0.35 }}
          className="mt-6 space-y-5"
        >
          {/* What each number means */}
          <div className="rounded-lg bg-muted/50 p-4 space-y-2">
            <h3 className="text-sm font-semibold text-foreground mb-2">What Each Number Means</h3>
            <div className="flex items-start gap-2 text-sm text-muted-foreground">
              <Leaf aria-hidden="true" className="mt-0.5 h-4 w-4 shrink-0 text-green-500" />
              <span><strong className="text-foreground">N ({n}%)</strong> — Nitrogen: drives leaf and blade growth, produces green color</span>
            </div>
            <div className="flex items-start gap-2 text-sm text-muted-foreground">
              <TreePine aria-hidden="true" className="mt-0.5 h-4 w-4 shrink-0 text-amber-500" />
              <span><strong className="text-foreground">P ({p}%)</strong> — Phosphorus: promotes root development and seedling establishment</span>
            </div>
            <div className="flex items-start gap-2 text-sm text-muted-foreground">
              <Shield aria-hidden="true" className="mt-0.5 h-4 w-4 shrink-0 text-blue-500" />
              <span><strong className="text-foreground">K ({k}%)</strong> — Potassium: supports overall health, disease resistance, and stress tolerance</span>
            </div>
          </div>

          {/* Rating & best use */}
          <div className="rounded-lg border border-border p-4 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-muted-foreground">Rating</span>
              <span className={cn("text-sm font-semibold", result.ratingColor)}>{result.rating}</span>
            </div>
            <div>
              <span className="text-sm font-medium text-muted-foreground">Best Use</span>
              <p className="text-sm text-foreground mt-0.5">{result.bestUse}</p>
            </div>
          </div>

          {/* Application rate */}
          <div className="rounded-lg border border-border p-4">
            <h3 className="text-sm font-semibold text-foreground mb-3">
              Application Rate <span className="font-normal text-muted-foreground">(per 1,000 sq ft)</span>
            </h3>
            <div className="grid grid-cols-3 gap-3 text-center">
              {([
                { label: "Nitrogen", value: result.nPerThousand, color: "text-green-600 dark:text-green-400" },
                { label: "Phosphorus", value: result.pPerThousand, color: "text-amber-600 dark:text-amber-400" },
                { label: "Potassium", value: result.kPerThousand, color: "text-blue-600 dark:text-blue-400" },
              ] as const).map(({ label, value, color }) => (
                <div key={label}>
                  <p className={cn("text-xl font-bold tabular-nums", color)}>
                    {value.toFixed(2)}
                  </p>
                  <p className="text-xs text-muted-foreground mt-0.5">{label} (lbs)</p>
                </div>
              ))}
            </div>
          </div>

          {/* Warnings */}
          {result.warnings.length > 0 && (
            <div className="space-y-2">
              {result.warnings.map((w) => (
                <div
                  key={w}
                  className="flex items-start gap-2 rounded-lg border border-lawn-caution/30 bg-lawn-caution/5 p-3 text-sm text-foreground"
                >
                  <AlertTriangle aria-hidden="true" className="mt-0.5 h-4 w-4 shrink-0 text-lawn-caution" />
                  {w}
                </div>
              ))}
            </div>
          )}
        </motion.div>
      )}
    </motion.div>
  );
});
