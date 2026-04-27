import { useMemo, useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import Scissors from "lucide-react/dist/esm/icons/scissors";
import ChevronDown from "lucide-react/dist/esm/icons/chevron-down";
import Info from "lucide-react/dist/esm/icons/info";
import AlertTriangle from "lucide-react/dist/esm/icons/alert-triangle";
import { useProfile } from "@/context/ProfileContext";
import { getMowingHeight, mowingHeights } from "@/data/mowingHeights";
import type { SeasonalHeight } from "@/data/mowingHeights";
import { getSeason, type Season } from "@/data/stats";

const SEASON_LABELS: Record<Season, string> = {
  spring: "Spring",
  summer: "Summer",
  fall: "Fall",
  winter: "Winter",
};

const SEASON_ORDER: Season[] = ["spring", "summer", "fall", "winter"];

function seasonColor(season: Season): string {
  switch (season) {
    case "spring":
      return "text-green-600 dark:text-green-400";
    case "summer":
      return "text-amber-600 dark:text-amber-400";
    case "fall":
      return "text-orange-600 dark:text-orange-400";
    case "winter":
      return "text-blue-600 dark:text-blue-400";
  }
}

/** Visual bar showing min / ideal / max on a 0–5 inch scale. */
function HeightBar({ height, label }: { height: SeasonalHeight; label: string }) {
  const scale = 5; // max inches on the scale
  const minPct = (height.min / scale) * 100;
  const maxPct = (height.max / scale) * 100;
  const idealPct = (height.ideal / scale) * 100;

  return (
    <div className="space-y-1">
      <div className="flex items-center justify-between text-xs">
        <span className="font-medium text-foreground">{label}</span>
        <span className="tabular-nums text-muted-foreground">
          {height.min}″–{height.max}″
        </span>
      </div>
      <div className="relative h-3 rounded-full bg-muted/50 overflow-hidden">
        {/* Range bar */}
        <div
          className="absolute inset-y-0 rounded-full bg-green-500/30"
          style={{ left: `${minPct}%`, width: `${maxPct - minPct}%` }}
        />
        {/* Ideal marker */}
        <div
          className="absolute top-0 h-full w-1 rounded-full bg-green-600 dark:bg-green-400"
          style={{ left: `${idealPct}%` }}
          aria-label={`Ideal height: ${height.ideal} inches`}
        />
      </div>
      <div className="flex items-center justify-between text-[10px] text-muted-foreground">
        <span>0″</span>
        <span className="tabular-nums font-medium text-green-600 dark:text-green-400">
          Ideal: {height.ideal}″
        </span>
        <span>5″</span>
      </div>
    </div>
  );
}

export function MowingHeightGuide() {
  const { profile } = useProfile();
  const [expanded, setExpanded] = useState(false);

  const currentMonth = new Date().getMonth();
  const currentSeason = getSeason(currentMonth);

  const data = useMemo(
    () => getMowingHeight(profile.grassType),
    [profile.grassType],
  );

  if (!data) {
    return (
      <div className="space-y-3">
        <div className="flex items-center gap-2">
          <Scissors aria-hidden="true" className="h-5 w-5 text-primary" />
          <h3 className="font-display text-lg font-semibold text-foreground">
            Mowing Height Guide
          </h3>
        </div>
        <p className="text-sm text-muted-foreground">
          No mowing data available for "{profile.grassType}". Choose a supported
          grass type in your profile:{" "}
          {mowingHeights.map((h) => h.grassType).join(", ")}.
        </p>
      </div>
    );
  }

  const seasonHeight = currentSeason === "winter" && data.winter === null
    ? null
    : (data[currentSeason] as SeasonalHeight | null);

  const isDormant = seasonHeight === null;

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center gap-2">
        <Scissors aria-hidden="true" className="h-5 w-5 text-primary" />
        <h3 className="font-display text-lg font-semibold text-foreground">
          Mowing Height Guide
        </h3>
      </div>

      <p className="text-sm text-muted-foreground">
        Recommended heights for{" "}
        <span className="font-medium text-foreground">{data.grassType}</span>
      </p>

      {/* Current season */}
      <div className="rounded-xl border border-primary/20 bg-primary/5 p-4 space-y-3">
        <div className="flex items-center justify-between">
          <span className={`text-xs font-semibold uppercase tracking-wider ${seasonColor(currentSeason)}`}>
            {SEASON_LABELS[currentSeason]} — Now
          </span>
          {isDormant && (
            <span className="inline-flex items-center gap-1 rounded-full bg-blue-100 dark:bg-blue-900/40 px-2 py-0.5 text-[10px] font-medium text-blue-700 dark:text-blue-300">
              Dormant
            </span>
          )}
        </div>

        {isDormant ? (
          <p className="text-sm text-muted-foreground">
            Your {data.grassType} is dormant this season — no mowing needed. Resume
            mowing in spring.
          </p>
        ) : (
          <HeightBar height={seasonHeight} label="Current recommendation" />
        )}
      </div>

      {/* Mowing frequency */}
      <div className="flex items-center gap-2 text-sm text-muted-foreground">
        <Scissors aria-hidden="true" className="h-3.5 w-3.5" />
        <span>
          Frequency: <span className="font-medium text-foreground">{data.mowFrequency}</span>
        </span>
      </div>

      {/* One-Third Rule */}
      <div className="flex items-start gap-2 rounded-lg border border-amber-200 bg-amber-50/50 dark:border-amber-900 dark:bg-amber-950/30 p-3">
        <AlertTriangle aria-hidden="true" className="h-4 w-4 text-amber-500 mt-0.5 shrink-0" />
        <div>
          <p className="text-xs font-semibold text-foreground">The One-Third Rule</p>
          <p className="text-xs text-muted-foreground mt-0.5">
            Never remove more than ⅓ of the grass blade in a single mowing. Cutting
            too short stresses the plant and invites weeds and disease.
          </p>
        </div>
      </div>

      {/* Expand all seasons */}
      <button
        type="button"
        onClick={() => setExpanded((v) => !v)}
        aria-expanded={expanded}
        aria-label={expanded ? "Collapse all seasons" : "Show all seasons"}
        className="flex w-full items-center justify-between rounded-lg border border-border bg-muted/30 px-3 py-2 text-xs font-medium text-foreground transition-colors hover:bg-muted/50"
      >
        <span>All Seasons</span>
        <ChevronDown
          aria-hidden="true"
          className={`h-4 w-4 text-muted-foreground transition-transform duration-200 ${
            expanded ? "rotate-180" : ""
          }`}
        />
      </button>

      <AnimatePresence>
        {expanded && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="space-y-3 overflow-hidden"
          >
            {SEASON_ORDER.map((season) => {
              const h = season === "winter" && data.winter === null ? null : (data[season] as SeasonalHeight | null);
              return (
                <div key={season} className="space-y-1">
                  <span className={`text-xs font-semibold ${seasonColor(season)}`}>
                    {SEASON_LABELS[season]}
                  </span>
                  {h ? (
                    <HeightBar height={h} label={SEASON_LABELS[season]} />
                  ) : (
                    <p className="text-xs text-muted-foreground italic">
                      Dormant — no mowing needed
                    </p>
                  )}
                </div>
              );
            })}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Notes */}
      <div className="flex items-start gap-2 rounded-lg border border-border bg-muted/30 p-3">
        <Info aria-hidden="true" className="h-3.5 w-3.5 text-muted-foreground mt-0.5 shrink-0" />
        <p className="text-[11px] text-muted-foreground">{data.notes}</p>
      </div>
    </div>
  );
}
