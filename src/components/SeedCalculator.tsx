import { useCallback, useMemo, useState } from "react";
import { motion } from "motion/react";
import { Sprout, Calculator, Package, Clock, CalendarDays, Info } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useProfile } from "@/context/ProfileContext";
import { seedRates } from "@/data/seedRates";
import type { SeedRate } from "@/data/seedRates";

const BAG_SIZE_LBS = 5;

const LAWN_SIZE_ESTIMATES: Record<string, number> = {
  Small: 2500,
  Medium: 5000,
  Large: 10000,
};

type Mode = "new" | "overseeding";

export function SeedCalculator() {
  const { profile } = useProfile();

  const [grassType, setGrassType] = useState(profile.grassType);
  const [mode, setMode] = useState<Mode>("new");
  const [manualSize, setManualSize] = useState("");
  const [calculated, setCalculated] = useState(false);

  const profileSqFt = profile.lawnSizeSqFt ?? LAWN_SIZE_ESTIMATES[profile.lawnSize];
  const sqft = manualSize ? parseFloat(manualSize) : profileSqFt;
  const validSqFt = sqft && sqft > 0 ? sqft : 0;

  const seedRate = useMemo<SeedRate | undefined>(
    () => seedRates.find((r) => r.grassType.toLowerCase() === grassType.toLowerCase()),
    [grassType],
  );

  const result = useMemo(() => {
    if (!seedRate || !validSqFt) return null;

    const rate = mode === "new" ? seedRate.newLawn : seedRate.overseeding;

    if (rate === 0) return null;

    const lbsNeeded = (validSqFt / 1000) * rate;
    const bagsNeeded = Math.ceil(lbsNeeded / BAG_SIZE_LBS);

    return {
      lbsNeeded: Math.round(lbsNeeded * 10) / 10,
      bagsNeeded,
      germinationDays: seedRate.germinationDays,
      bestSeason: seedRate.bestSeason,
    };
  }, [seedRate, validSqFt, mode]);

  const handleCalculate = useCallback(() => setCalculated(true), []);

  const isSodOnly = seedRate && seedRate.newLawn === 0;

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex items-center gap-2">
        <Sprout aria-hidden="true" className="h-5 w-5 text-primary" />
        <h3 className="font-display text-lg font-semibold text-foreground">
          Seed Calculator
        </h3>
      </div>

      <p className="text-sm text-muted-foreground">
        Calculate how much seed you need for a new lawn or overseeding project.
      </p>

      {/* Grass type selector */}
      <div className="space-y-2">
        <Label htmlFor="seed-grass-type">Grass Type</Label>
        <Select
          value={grassType}
          onValueChange={(v) => {
            setGrassType(v);
            setCalculated(false);
          }}
        >
          <SelectTrigger id="seed-grass-type">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {seedRates.map((r) => (
              <SelectItem key={r.grassType} value={r.grassType}>
                {r.grassType}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Mode toggle */}
      <div className="space-y-2">
        <Label>Project Type</Label>
        <div className="flex rounded-lg border border-border overflow-hidden">
          {(["new", "overseeding"] as const).map((m) => (
            <button
              key={m}
              type="button"
              onClick={() => {
                setMode(m);
                setCalculated(false);
              }}
              aria-pressed={mode === m}
              className={`flex-1 px-3 py-2 text-sm font-medium capitalize transition-colors ${
                mode === m
                  ? "bg-primary/10 text-primary"
                  : "text-muted-foreground hover:bg-muted/50"
              }`}
            >
              {m === "new" ? "New Lawn" : "Overseeding"}
            </button>
          ))}
        </div>
      </div>

      {/* Lawn size */}
      <div className="space-y-2">
        <Label htmlFor="seed-lawn-size">
          Lawn Size (sq ft)
        </Label>
        <div className="flex items-center gap-3">
          <Input
            id="seed-lawn-size"
            type="number"
            min={1}
            step={100}
            placeholder={`${profileSqFt?.toLocaleString() ?? "5,000"} (from profile)`}
            value={manualSize}
            onChange={(e) => {
              setManualSize(e.target.value);
              setCalculated(false);
            }}
            name="seed-lawn-size"
            autoComplete="off"
            className="flex-1 text-sm"
          />
          {profile.lawnSizeSqFt && !manualSize && (
            <span className="shrink-0 text-xs text-muted-foreground">
              Using profile
            </span>
          )}
        </div>
        {!profile.lawnSizeSqFt && !manualSize && (
          <p className="text-[10px] text-muted-foreground">
            Estimated from your profile lawn size ({profile.lawnSize} ≈{" "}
            {LAWN_SIZE_ESTIMATES[profile.lawnSize]?.toLocaleString()} sq ft).
            Enter a value above for a precise calculation.
          </p>
        )}
      </div>

      {/* Sod-only warning */}
      {isSodOnly && (
        <div className="flex items-start gap-2 rounded-lg border border-amber-200 bg-amber-50/50 dark:border-amber-900 dark:bg-amber-950/30 p-3">
          <Info aria-hidden="true" className="h-4 w-4 text-amber-500 mt-0.5 shrink-0" />
          <p className="text-xs text-muted-foreground">
            <span className="font-semibold text-foreground">{grassType}</span> is
            not available from seed. It must be established from sod, plugs, or
            stolons.
          </p>
        </div>
      )}

      {/* Calculate button */}
      {!isSodOnly && !calculated && (
        <Button
          onClick={handleCalculate}
          disabled={!validSqFt || !seedRate}
          className="w-full gap-2 bg-primary"
          aria-label="Calculate seed needed"
        >
          <Calculator aria-hidden="true" className="h-4 w-4" />
          Calculate
        </Button>
      )}

      {/* Results */}
      {calculated && result && (
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          className="rounded-xl border border-primary/20 bg-primary/5 p-5 space-y-4"
        >
          <h4 className="font-display font-semibold text-foreground">
            {mode === "new" ? "New Lawn" : "Overseeding"} — {grassType}
          </h4>

          <div className="grid grid-cols-2 gap-4">
            {/* Lbs needed */}
            <div className="flex items-start gap-2">
              <Sprout aria-hidden="true" className="h-4 w-4 text-primary mt-0.5 shrink-0" />
              <div>
                <p className="text-xl font-display font-bold text-primary tabular-nums">
                  {result.lbsNeeded}
                </p>
                <p className="text-xs text-muted-foreground">lbs of seed</p>
              </div>
            </div>

            {/* Bags needed */}
            <div className="flex items-start gap-2">
              <Package aria-hidden="true" className="h-4 w-4 text-primary mt-0.5 shrink-0" />
              <div>
                <p className="text-xl font-display font-bold text-primary tabular-nums">
                  {result.bagsNeeded}
                </p>
                <p className="text-xs text-muted-foreground">
                  × {BAG_SIZE_LBS} lb bags
                </p>
              </div>
            </div>

            {/* Germination */}
            <div className="flex items-start gap-2">
              <Clock aria-hidden="true" className="h-4 w-4 text-primary mt-0.5 shrink-0" />
              <div>
                <p className="text-xl font-display font-bold text-primary tabular-nums">
                  {result.germinationDays.min}–{result.germinationDays.max}
                </p>
                <p className="text-xs text-muted-foreground">days to germinate</p>
              </div>
            </div>

            {/* Best season */}
            <div className="flex items-start gap-2">
              <CalendarDays aria-hidden="true" className="h-4 w-4 text-primary mt-0.5 shrink-0" />
              <div>
                <p className="text-sm font-semibold text-foreground leading-snug">
                  {result.bestSeason}
                </p>
                <p className="text-xs text-muted-foreground">best planting window</p>
              </div>
            </div>
          </div>

          <p className="text-xs text-muted-foreground text-center">
            Area: {validSqFt.toLocaleString()} sq ft •{" "}
            Rate: {mode === "new" ? seedRate!.newLawn : seedRate!.overseeding} lbs / 1,000 sq ft
          </p>
        </motion.div>
      )}

      {/* Notes */}
      {seedRate && (
        <div className="flex items-start gap-2 rounded-lg border border-border bg-muted/30 p-3">
          <Info aria-hidden="true" className="h-3.5 w-3.5 text-muted-foreground mt-0.5 shrink-0" />
          <p className="text-[11px] text-muted-foreground">{seedRate.notes}</p>
        </div>
      )}
    </div>
  );
}
