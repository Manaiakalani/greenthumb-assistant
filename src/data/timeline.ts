import type { MonthData, GrowthPhase } from "@/types/lawn";
import type { ClimateRegion } from "@/types/profile";

/** Background color classes for each growth phase */
export const phaseColors: Record<GrowthPhase, string> = {
  dormant: "bg-lawn-dormant/30",
  recovery: "bg-lawn-caution/20",
  active: "bg-lawn-healthy/30",
  peak: "bg-lawn-healthy/50",
  slowing: "bg-lawn-caution/30",
  stress: "bg-lawn-danger/20",
};

/** Human-readable labels for each growth phase */
export const phaseLabels: Record<GrowthPhase, string> = {
  dormant: "Dormant",
  recovery: "Recovery",
  active: "Active Growth",
  peak: "Peak Growth",
  slowing: "Slowing",
  stress: "Heat Stress",
};

/** Cool-season timeline (Zones 1–4) */
const coolSeasonTimeline: MonthData[] = [
  { month: "January", short: "Jan", phase: "dormant", tasks: [] },
  { month: "February", short: "Feb", phase: "dormant", tasks: ["Plan ahead"] },
  { month: "March", short: "Mar", phase: "recovery", tasks: ["First inspection"] },
  { month: "April", short: "Apr", phase: "active", tasks: ["First mow", "Light feed"] },
  { month: "May", short: "May", phase: "peak", tasks: ["Mow weekly", "Fertilize"] },
  { month: "June", short: "Jun", phase: "peak", tasks: ["Mow weekly", "Water"] },
  { month: "July", short: "Jul", phase: "stress", tasks: ["Raise mow height", "Water deeply"] },
  { month: "August", short: "Aug", phase: "stress", tasks: ["Minimal mowing", "Water deeply"] },
  { month: "September", short: "Sep", phase: "active", tasks: ["Overseed", "Fertilize"] },
  { month: "October", short: "Oct", phase: "active", tasks: ["Mow", "Winterizer"] },
  { month: "November", short: "Nov", phase: "slowing", tasks: ["Last mow", "Clean up"] },
  { month: "December", short: "Dec", phase: "dormant", tasks: [] },
];

/** Transition zone timeline (Zones 5–7) */
const transitionTimeline: MonthData[] = [
  { month: "January", short: "Jan", phase: "dormant", tasks: [] },
  { month: "February", short: "Feb", phase: "dormant", tasks: ["Plan ahead", "Soil test"] },
  { month: "March", short: "Mar", phase: "recovery", tasks: ["Pre-emergent", "First inspection"] },
  { month: "April", short: "Apr", phase: "active", tasks: ["First mow", "Fertilize"] },
  { month: "May", short: "May", phase: "peak", tasks: ["Mow weekly", "Weed control"] },
  { month: "June", short: "Jun", phase: "peak", tasks: ["Mow weekly", "Water deeply"] },
  { month: "July", short: "Jul", phase: "stress", tasks: ["Raise mow height", "Water deeply"] },
  { month: "August", short: "Aug", phase: "stress", tasks: ["Minimal mowing", "Water deeply"] },
  { month: "September", short: "Sep", phase: "active", tasks: ["Overseed", "Fall fertilize"] },
  { month: "October", short: "Oct", phase: "active", tasks: ["Mow", "Winterizer"] },
  { month: "November", short: "Nov", phase: "slowing", tasks: ["Last mow", "Leaf cleanup"] },
  { month: "December", short: "Dec", phase: "dormant", tasks: [] },
];

/** Warm-season timeline (Zones 8–13) */
const warmSeasonTimeline: MonthData[] = [
  { month: "January", short: "Jan", phase: "dormant", tasks: ["Plan ahead"] },
  { month: "February", short: "Feb", phase: "dormant", tasks: ["Soil test", "Pre-emergent"] },
  { month: "March", short: "Mar", phase: "recovery", tasks: ["First mow", "Scalp lawn"] },
  { month: "April", short: "Apr", phase: "active", tasks: ["Fertilize", "Mow regularly"] },
  { month: "May", short: "May", phase: "peak", tasks: ["Mow weekly", "Water"] },
  { month: "June", short: "Jun", phase: "peak", tasks: ["Mow biweekly", "Water deeply"] },
  { month: "July", short: "Jul", phase: "peak", tasks: ["Mow biweekly", "Water deeply"] },
  { month: "August", short: "Aug", phase: "peak", tasks: ["Mow biweekly", "Water deeply"] },
  { month: "September", short: "Sep", phase: "active", tasks: ["Fertilize", "Overseed"] },
  { month: "October", short: "Oct", phase: "slowing", tasks: ["Reduce mowing", "Winterizer"] },
  { month: "November", short: "Nov", phase: "slowing", tasks: ["Last mow", "Clean up"] },
  { month: "December", short: "Dec", phase: "dormant", tasks: [] },
];

/** Returns the appropriate seasonal timeline for a given climate region */
export function getTimelineForRegion(region: ClimateRegion): MonthData[] {
  switch (region) {
    case "Cool-Season":
      return coolSeasonTimeline;
    case "Warm-Season":
      return warmSeasonTimeline;
    case "Transition Zone":
    default:
      return transitionTimeline;
  }
}
