import React, { useState, useMemo } from "react";
import { motion } from "motion/react";
import Pipette from "lucide-react/dist/esm/icons/pipette";
import ChevronDown from "lucide-react/dist/esm/icons/chevron-down";
import ArrowUp from "lucide-react/dist/esm/icons/arrow-up";
import ArrowDown from "lucide-react/dist/esm/icons/arrow-down";
import Clock from "lucide-react/dist/esm/icons/clock";
import Package from "lucide-react/dist/esm/icons/package";
import { cn } from "@/lib/utils";
import { useProfile } from "@/context/ProfileContext";

/* ------------------------------------------------------------------ */
/*  Types & constants                                                  */
/* ------------------------------------------------------------------ */

type SoilType = "Sandy" | "Loamy" | "Clay";

const SOIL_TYPES: SoilType[] = ["Sandy", "Loamy", "Clay"];

/** Lbs per 1,000 sq ft to change pH by 1.0 point */
const LIME_RATES: Record<SoilType, number> = { Sandy: 25, Loamy: 50, Clay: 75 };
const SULFUR_RATES: Record<SoilType, number> = { Sandy: 10, Loamy: 15, Clay: 20 };

const LIME_BAG_LBS = 40;
const SULFUR_BAG_LBS = 5;

/* ------------------------------------------------------------------ */
/*  Calculation                                                        */
/* ------------------------------------------------------------------ */

interface AmendmentResult {
  direction: "raise" | "lower" | "none";
  amendment: string;
  lbsPerThousand: number;
  totalLbs: number;
  totalBags: number;
  bagSizeLbs: number;
  splitApplication: boolean;
  timing: string;
}

function calculate(
  currentPh: number,
  targetPh: number,
  soilType: SoilType,
  lawnSqFt: number,
): AmendmentResult {
  const delta = targetPh - currentPh;

  if (Math.abs(delta) < 0.05) {
    return {
      direction: "none",
      amendment: "None needed",
      lbsPerThousand: 0,
      totalLbs: 0,
      totalBags: 0,
      bagSizeLbs: 0,
      splitApplication: false,
      timing: "Your soil pH is already at the target — no amendment needed.",
    };
  }

  const raising = delta > 0;
  const absDelta = Math.abs(delta);
  const ratePerPoint = raising ? LIME_RATES[soilType] : SULFUR_RATES[soilType];
  const lbsPerThousand = ratePerPoint * absDelta;
  const totalLbs = (lbsPerThousand * lawnSqFt) / 1000;
  const bagSize = raising ? LIME_BAG_LBS : SULFUR_BAG_LBS;
  const totalBags = Math.ceil(totalLbs / bagSize);
  const splitApplication = lbsPerThousand > 50;

  let timing: string;
  if (splitApplication) {
    timing =
      "Split into 2 applications 6 weeks apart. Apply first round in fall for best results.";
  } else if (raising) {
    timing = "Apply in fall for best results — lime reacts slowly over several months.";
  } else {
    timing =
      "Apply elemental sulfur in early spring or fall when soil microbes are active.";
  }

  return {
    direction: raising ? "raise" : "lower",
    amendment: raising ? "Lime (calcium carbonate)" : "Elemental sulfur",
    lbsPerThousand,
    totalLbs,
    totalBags,
    bagSizeLbs: bagSize,
    splitApplication,
    timing,
  };
}

/* ------------------------------------------------------------------ */
/*  pH scale bar                                                       */
/* ------------------------------------------------------------------ */

function PhScale({ current, target }: { current: number; target: number }) {
  const min = 3;
  const max = 9;
  const range = max - min;

  const pctCurrent = ((current - min) / range) * 100;
  const pctTarget = ((target - min) / range) * 100;
  // Ideal zone 6.0-7.0
  const pctIdealStart = ((6.0 - min) / range) * 100;
  const pctIdealEnd = ((7.0 - min) / range) * 100;

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between text-xs text-muted-foreground">
        <span>Acidic (3.0)</span>
        <span>Neutral (7.0)</span>
        <span>Alkaline (9.0)</span>
      </div>
      <div className="relative h-5 rounded-full overflow-hidden" aria-hidden="true">
        {/* Gradient background */}
        <div
          className="absolute inset-0 rounded-full"
          style={{
            background:
              "linear-gradient(to right, #ef4444 0%, #f97316 20%, #eab308 35%, #22c55e 50%, #22c55e 60%, #3b82f6 80%, #6366f1 100%)",
          }}
        />
        {/* Ideal zone overlay */}
        <div
          className="absolute top-0 bottom-0 border-2 border-white/50 rounded"
          style={{ left: `${pctIdealStart}%`, width: `${pctIdealEnd - pctIdealStart}%` }}
        />
      </div>

      {/* Markers */}
      <div className="relative h-8">
        {/* Current pH marker */}
        <div
          className="absolute flex flex-col items-center -translate-x-1/2"
          style={{ left: `${Math.max(2, Math.min(98, pctCurrent))}%` }}
        >
          <div className="w-0 h-0 border-l-[5px] border-r-[5px] border-b-[6px] border-transparent border-b-foreground" />
          <span className="text-[10px] font-semibold tabular-nums text-foreground whitespace-nowrap">
            Current {current.toFixed(1)}
          </span>
        </div>

        {/* Target pH marker */}
        <div
          className="absolute flex flex-col items-center -translate-x-1/2"
          style={{ left: `${Math.max(2, Math.min(98, pctTarget))}%` }}
        >
          <div className="w-0 h-0 border-l-[5px] border-r-[5px] border-b-[6px] border-transparent border-b-primary" />
          <span className="text-[10px] font-semibold tabular-nums text-primary whitespace-nowrap">
            Target {target.toFixed(1)}
          </span>
        </div>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Main component                                                     */
/* ------------------------------------------------------------------ */

export const SoilAmendmentCalc = React.memo(function SoilAmendmentCalc() {
  const { profile } = useProfile();

  const [currentPh, setCurrentPh] = useState(profile.soilTest?.ph ?? 5.8);
  const [targetPh, setTargetPh] = useState(6.5);
  const [soilType, setSoilType] = useState<SoilType>("Loamy");
  const [lawnSize, setLawnSize] = useState(profile.lawnSizeSqFt ?? 5000);

  const result = useMemo(
    () => calculate(currentPh, targetPh, soilType, lawnSize),
    [currentPh, targetPh, soilType, lawnSize],
  );

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
          <Pipette aria-hidden="true" className="h-5 w-5 text-primary" />
        </div>
        <h2 className="font-display text-lg font-semibold text-foreground [text-wrap:balance]">
          Soil Amendment Calculator
        </h2>
      </div>

      <div className="space-y-5">
        {/* Current pH */}
        <div>
          <label htmlFor="current-ph" className="flex items-center justify-between text-sm font-medium text-muted-foreground mb-1.5">
            <span>Current pH</span>
            <span className="tabular-nums font-semibold text-foreground">{currentPh.toFixed(1)}</span>
          </label>
          <input
            id="current-ph"
            type="range"
            min={3.0}
            max={9.0}
            step={0.1}
            value={currentPh}
            onChange={(e) => setCurrentPh(parseFloat(e.target.value))}
            className="w-full h-2 rounded-full appearance-none bg-muted cursor-pointer accent-primary min-h-[44px]"
          />
          <div className="flex justify-between text-[10px] text-muted-foreground mt-0.5">
            <span>3.0</span>
            <span>6.0</span>
            <span>9.0</span>
          </div>
        </div>

        {/* Target pH */}
        <div>
          <label htmlFor="target-ph" className="block text-sm font-medium text-muted-foreground mb-1.5">
            Target pH
          </label>
          <input
            id="target-ph"
            type="number"
            name="target-ph"
            autoComplete="off"
            inputMode="decimal"
            min={3.0}
            max={9.0}
            step={0.1}
            value={targetPh}
            onChange={(e) => {
              const v = parseFloat(e.target.value);
              if (!isNaN(v)) setTargetPh(Math.max(3.0, Math.min(9.0, v)));
            }}
            className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm tabular-nums text-foreground min-h-[44px] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          />
        </div>

        {/* Soil type */}
        <div>
          <label htmlFor="soil-type" className="block text-sm font-medium text-muted-foreground mb-1.5">
            Soil Type
          </label>
          <div className="relative">
            <select
              id="soil-type"
              name="soil-type"
              value={soilType}
              onChange={(e) => setSoilType(e.target.value as SoilType)}
              className="w-full appearance-none rounded-lg border border-input bg-background px-3 py-2.5 pr-10 text-sm text-foreground min-h-[44px] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >
              {SOIL_TYPES.map((st) => (
                <option key={st} value={st}>
                  {st}
                </option>
              ))}
            </select>
            <ChevronDown
              aria-hidden="true"
              className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground"
            />
          </div>
        </div>

        {/* Lawn size */}
        <div>
          <label htmlFor="lawn-size-amend" className="block text-sm font-medium text-muted-foreground mb-1.5">
            Lawn Size (sq ft)
          </label>
          <input
            id="lawn-size-amend"
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

        {/* pH scale */}
        <PhScale current={currentPh} target={targetPh} />

        {/* Results */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
          className="space-y-4"
        >
          {/* Direction */}
          <div className="rounded-lg border border-border p-4">
            <div className="flex items-center gap-2 mb-3">
              {result.direction === "raise" ? (
                <ArrowUp aria-hidden="true" className="h-5 w-5 text-green-500" />
              ) : result.direction === "lower" ? (
                <ArrowDown aria-hidden="true" className="h-5 w-5 text-amber-500" />
              ) : null}
              <h3 className="text-sm font-semibold text-foreground">
                {result.direction === "raise"
                  ? "Add lime to raise pH"
                  : result.direction === "lower"
                    ? "Add sulfur to lower pH"
                    : "pH is on target"}
              </h3>
            </div>

            {result.direction !== "none" && (
              <div className="grid grid-cols-2 gap-4 text-center">
                <div>
                  <p className="text-2xl font-bold tabular-nums text-foreground">
                    {result.lbsPerThousand.toFixed(1)}
                  </p>
                  <p className="text-xs text-muted-foreground mt-0.5">lbs / 1,000 sq ft</p>
                </div>
                <div>
                  <p className="text-2xl font-bold tabular-nums text-foreground">
                    {result.totalLbs.toFixed(1)}
                  </p>
                  <p className="text-xs text-muted-foreground mt-0.5">total lbs needed</p>
                </div>
              </div>
            )}
          </div>

          {/* Bags & amendment detail */}
          {result.direction !== "none" && (
            <>
              <div className="flex items-start gap-3 rounded-lg bg-muted/50 p-4 text-sm text-foreground">
                <Package aria-hidden="true" className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                <div>
                  <p className="font-medium">{result.amendment}</p>
                  <p className="text-muted-foreground mt-0.5">
                    <span className="font-semibold tabular-nums text-foreground">{result.totalBags}</span>{" "}
                    {result.totalBags === 1 ? "bag" : "bags"} ({result.bagSizeLbs} lb bags)
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3 rounded-lg bg-muted/50 p-4 text-sm text-foreground">
                <Clock aria-hidden="true" className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                <div>
                  <p className="font-medium">Application Timing</p>
                  <p className="text-muted-foreground mt-0.5">{result.timing}</p>
                </div>
              </div>
            </>
          )}
        </motion.div>
      </div>
    </motion.div>
  );
});
