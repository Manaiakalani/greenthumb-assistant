import Calendar from "lucide-react/dist/esm/icons/calendar";
import Scissors from "lucide-react/dist/esm/icons/scissors";
import Droplets from "lucide-react/dist/esm/icons/droplets";
import TrendingUp from "lucide-react/dist/esm/icons/trending-up";
import type { QuickStatItem } from "@/types/lawn";
import type { ClimateRegion } from "@/types/profile";

// ---------------------------------------------------------------------------
// Season helpers (exported for tests)
// ---------------------------------------------------------------------------

export type Season = "winter" | "spring" | "summer" | "fall";

export function getSeason(month: number): Season {
  if (month >= 2 && month <= 4) return "spring";
  if (month >= 5 && month <= 7) return "summer";
  if (month >= 8 && month <= 10) return "fall";
  return "winter";
}

// ---------------------------------------------------------------------------
// Lookup tables
// ---------------------------------------------------------------------------

type GrowthRate = "Dormant" | "Low" | "Medium" | "High";

const growthBySeasonAndRegion: Record<Season, Record<ClimateRegion, GrowthRate>> = {
  winter: { "Cool-Season": "Dormant", "Transition Zone": "Dormant", "Warm-Season": "Dormant" },
  spring: { "Cool-Season": "High", "Transition Zone": "High", "Warm-Season": "Medium" },
  summer: { "Cool-Season": "Low", "Transition Zone": "Medium", "Warm-Season": "High" },
  fall:   { "Cool-Season": "High", "Transition Zone": "High", "Warm-Season": "Low" },
};

const mowIntervalByGrowth: Record<GrowthRate, string> = {
  Dormant: "—",
  Low: "10-14",
  Medium: "7",
  High: "4-5",
};

const waterNeedByGrowth: Record<GrowthRate, string> = {
  Dormant: "None",
  Low: "Low",
  Medium: "Mod",
  High: "High",
};

const seasonLabels: Record<number, [string, string]> = {
  0:  ["Mid",   "Winter"],
  1:  ["Late",  "Winter"],
  2:  ["Early", "Spring"],
  3:  ["Mid",   "Spring"],
  4:  ["Late",  "Spring"],
  5:  ["Early", "Summer"],
  6:  ["Mid",   "Summer"],
  7:  ["Late",  "Summer"],
  8:  ["Early", "Fall"],
  9:  ["Mid",   "Fall"],
  10: ["Late",  "Fall"],
  11: ["Early", "Winter"],
};

// ---------------------------------------------------------------------------
// Public API
// ---------------------------------------------------------------------------

/**
 * Get seasonally-aware quick stats for the dashboard based on the user's
 * climate region and the current month.
 */
export function getSeasonalStats(region: ClimateRegion, month: number): QuickStatItem[] {
  const season = getSeason(month);
  const growth = growthBySeasonAndRegion[season][region];
  const mow = mowIntervalByGrowth[growth];
  const water = waterNeedByGrowth[growth];
  const [seasonVal, seasonSub] = seasonLabels[month] ?? ["Mid", "Season"];

  return [
    { icon: TrendingUp, label: "Growth", value: growth, sub: "rate" },
    { icon: Scissors, label: "Mow Every", value: mow, sub: mow === "—" ? "" : "days" },
    { icon: Droplets, label: "Water", value: water, sub: "need" },
    { icon: Calendar, label: "Season", value: seasonVal, sub: seasonSub },
  ];
}
