import { useMemo } from "react";
import { motion } from "motion/react";
/* useMemo kept for activeRange only */
import Thermometer from "lucide-react/dist/esm/icons/thermometer";

interface SoilTempChartProps {
  /** Current soil temperature in °F (from Open-Meteo soil_temperature_6cm) */
  currentTemp: number | null;
}

/**
 * Soil temp ranges and their lawn-care meaning.
 * We render a gradient bar with the current temp indicator.
 */
const RANGES = [
  { min: 0,  max: 32,  label: "Frozen",     color: "#93c5fd", tip: "Lawn dormant — stay off frozen turf" },
  { min: 32, max: 50,  label: "Cold",       color: "#a5b4fc", tip: "Too cold for growth — avoid heavy traffic" },
  { min: 50, max: 55,  label: "Pre-emerg.",  color: "#fbbf24", tip: "Pre-emergent window opening!" },
  { min: 55, max: 65,  label: "Active",     color: "#4ade80", tip: "Grass actively growing — prime time" },
  { min: 65, max: 80,  label: "Peak",       color: "#22c55e", tip: "Peak growth — mow regularly" },
  { min: 80, max: 95,  label: "Hot",        color: "#f97316", tip: "Heat stress possible — water deeply" },
  { min: 95, max: 120, label: "Extreme",    color: "#ef4444", tip: "Extreme heat — limit foot traffic" },
] as const;

export function SoilTempChart({ currentTemp }: SoilTempChartProps) {
  const activeRange = useMemo(() => {
    if (currentTemp === null) return null;
    return RANGES.find((r) => currentTemp >= r.min && currentTemp < r.max) ?? RANGES[RANGES.length - 1];
  }, [currentTemp]);

  // Position of the marker on the bar (0–100%) — simple arithmetic, no memo needed
  const markerPct = currentTemp === null
    ? 50
    : Math.min(100, Math.max(0, (currentTemp / 120) * 100));

  if (currentTemp === null) {
    return (
      <div className="text-center py-4">
        <Thermometer className="h-5 w-5 text-muted-foreground mx-auto mb-2" />
        <p className="text-xs text-muted-foreground">Soil temperature data unavailable</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <Thermometer className="h-5 w-5 text-primary" />
        <h3 className="font-display text-lg font-semibold text-foreground">
          Soil Temperature
        </h3>
      </div>

      {/* Current reading */}
      <div className="flex items-baseline gap-2">
        <span className="text-3xl font-display font-bold text-foreground">
          {currentTemp}°F
        </span>
        <span className="text-sm text-muted-foreground">at 6 cm depth</span>
      </div>

      {/* Gradient bar */}
      <div className="relative h-6 rounded-full overflow-hidden flex">
        {RANGES.map((r) => {
          const widthPct = ((r.max - r.min) / 120) * 100;
          return (
            <div
              key={r.label}
              className="h-full"
              style={{ width: `${widthPct}%`, backgroundColor: r.color }}
            />
          );
        })}
        {/* Marker */}
        <motion.div
          initial={{ left: "50%" }}
          animate={{ left: `${markerPct}%` }}
          transition={{ type: "spring", stiffness: 200, damping: 20 }}
          className="absolute top-0 bottom-0 flex items-center"
          style={{ transform: "translateX(-50%)" }}
        >
          <div className="w-1 h-full bg-foreground rounded-full shadow-md" />
          <div className="absolute -top-6 left-1/2 -translate-x-1/2 text-[10px] font-bold text-foreground whitespace-nowrap">
            {currentTemp}°
          </div>
        </motion.div>
      </div>

      {/* Range labels */}
      <div className="flex text-[10px] sm:text-[11px] text-muted-foreground">
        {RANGES.map((r, i) => {
          const widthPct = ((r.max - r.min) / 120) * 100;
          return (
            <div key={r.label} style={{ width: `${widthPct}%` }} className="text-center truncate px-0.5">
              <span className="hidden sm:inline">{r.label}</span>
              <span className="sm:hidden">{i % 2 === 0 ? r.label.split(' ')[0] : ''}</span>
            </div>
          );
        })}
      </div>

      {/* Active range insight */}
      {activeRange && (
        <motion.div
          initial={{ opacity: 0, y: 4 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center gap-2 rounded-lg border border-primary/15 bg-primary/5 p-3"
        >
          <div className="h-3 w-3 rounded-full shrink-0" style={{ backgroundColor: activeRange.color }} />
          <p className="text-xs text-muted-foreground">{activeRange.tip}</p>
        </motion.div>
      )}
    </div>
  );
}
