import type { ClimateRegion } from "@/types/profile";

/* ─── Types ──────────────────────────────────────────── */

export interface PlanApplication {
  /** Unique step id */
  id: string;
  /** Display title, e.g. "Grass Powerhouse" */
  title: string;
  /** Short instruction line, e.g. "Apply 1 pouch" */
  instruction: string;
  /** Description of what this step does */
  description: string;
  /** Window start month (0-based, 0 = Jan) */
  monthStart: number;
  /** Window end month (0-based) */
  monthEnd: number;
  /** Human-readable date window, e.g. "May 17 – May 24" */
  dateRange: string;
  /** Category for icon color coding */
  category: "fertilizer" | "weed-control" | "seeding" | "soil-amendment" | "maintenance";
  /** Optional tips link label */
  tips?: string;
}

export interface SoilPlan {
  /** e.g. "Cool-Season" */
  region: ClimateRegion;
  /** Plan year (current year) */
  year: number;
  /** Season summary / daily-tip text */
  summary: string;
  /** Ordered application steps */
  applications: PlanApplication[];
  /** Winter care tips shown after end-of-season marker */
  winterTips: string[];
}

/* ─── Helpers ────────────────────────────────────────── */

function year() {
  return new Date().getFullYear();
}

/** Category metadata for UI */
export const CATEGORY_META: Record<
  PlanApplication["category"],
  { emoji: string; color: string; bg: string }
> = {
  "fertilizer":      { emoji: "🧪", color: "text-emerald-600 dark:text-emerald-400", bg: "bg-emerald-500/15" },
  "weed-control":    { emoji: "🛡️", color: "text-amber-600 dark:text-amber-400",   bg: "bg-amber-500/15" },
  "seeding":         { emoji: "🌱", color: "text-lime-600 dark:text-lime-400",      bg: "bg-lime-500/15" },
  "soil-amendment":  { emoji: "🧱", color: "text-orange-600 dark:text-orange-400",  bg: "bg-orange-500/15" },
  "maintenance":     { emoji: "🔧", color: "text-blue-600 dark:text-blue-400",      bg: "bg-blue-500/15" },
};

/* ─── Cool-Season Plan (Zones 1–4) ──────────────────── */

const coolSeasonPlan: Omit<SoilPlan, "year"> = {
  region: "Cool-Season",
  summary:
    "Your cool-season lawn thrives with light spring feeding and a strong fall recovery push. Fall is the #1 feeding window — shift most of your nitrogen here for the healthiest lawn.",
  applications: [
    {
      id: "cs-1",
      title: "Pre-Emergent Shield",
      instruction: "Apply pre-emergent herbicide",
      description:
        "Prodiamine or dithiopyr pre-emergent to prevent crabgrass and annual weeds. Creates a chemical barrier in the soil before weed seeds germinate.",
      monthStart: 2,
      monthEnd: 3,
      dateRange: "March 15 – April 15",
      category: "weed-control",
      tips: "Apply when soil temperature at 2-4 inches reaches 55°F for 3 consecutive days",
    },
    {
      id: "cs-2",
      title: "Spring Green-Up",
      instruction: "Apply light fertilizer",
      description:
        "24-0-6 slow-release formula at 0.5 lb N/1,000 sq ft. A light feeding to support spring green-up without promoting excessive top growth.",
      monthStart: 3,
      monthEnd: 4,
      dateRange: "April 15 – May 1",
      category: "fertilizer",
      tips: "Keep this application light — save the heavy feeding for fall",
    },
    {
      id: "cs-3",
      title: "Iron Boost",
      instruction: "Apply iron chelate",
      description:
        "0-0-1 with iron chelate for deep green color without nitrogen. Provides rich summer color without the disease risk that comes with nitrogen during warm months.",
      monthStart: 5,
      monthEnd: 5,
      dateRange: "June 1 – June 15",
      category: "fertilizer",
      tips: "Iron gives deep green color without the disease risk of nitrogen in summer",
    },
    {
      id: "cs-4",
      title: "Fall Recovery Feed",
      instruction: "Apply heavy fall fertilizer",
      description:
        "24-0-10 high-nitrogen formula at 1.0 lb N/1,000 sq ft with potassium. This is the single most important feeding of the year — drives deep root growth, thickens turf, and fuels fall recovery.",
      monthStart: 8,
      monthEnd: 8,
      dateRange: "September 1 – September 20",
      category: "fertilizer",
      tips: "This is your lawn's most important meal — drives root growth and fall recovery",
    },
    {
      id: "cs-5",
      title: "Fall Overseeding",
      instruction: "Overseed thin areas",
      description:
        "Fill in bare and thin areas while cool, moist fall weather supports rapid germination. Core aerate first for best seed-to-soil contact.",
      monthStart: 8,
      monthEnd: 8,
      dateRange: "September 1 – September 30",
      category: "seeding",
      tips: "Soil temp 50-65°F is ideal. Keep newly seeded areas moist for 2-3 weeks",
    },
    {
      id: "cs-6",
      title: "Winterizer",
      instruction: "Apply winterizer fertilizer",
      description:
        "24-0-14 high-potassium formula at 1.0 lb N/1,000 sq ft. Builds energy reserves for winter survival and promotes early spring green-up. Quick-release nitrogen is OK for this application.",
      monthStart: 9,
      monthEnd: 10,
      dateRange: "October 15 – November 15",
      category: "fertilizer",
      tips: "Apply after grass stops growing but before ground freezes",
    },
  ],
  winterTips: [
    "Minimize foot traffic on frozen or dormant grass",
    "Winterize irrigation systems and store lawn care equipment",
    "Timing is right for decreased watering; cool-season lawns still need occasional moisture",
    "Plan a soil test every 2-3 years to check pH and nutrient levels",
  ],
};

/* ─── Transition Zone Plan (Zones 5–7) ──────────────── */

const transitionPlan: Omit<SoilPlan, "year"> = {
  region: "Transition Zone",
  summary:
    "Transition zone lawns face both summer heat and winter cold. University research is clear: feed lightly in spring, skip summer nitrogen (use iron instead), and concentrate feeding in fall for the strongest, healthiest turf.",
  applications: [
    {
      id: "tz-1",
      title: "Pre-Emergent Shield",
      instruction: "Apply pre-emergent herbicide",
      description:
        "Prodiamine pre-emergent to prevent crabgrass and annual weeds. Apply when forsythia blooms or soil temps hit 55°F for 3+ consecutive days.",
      monthStart: 1,
      monthEnd: 2,
      dateRange: "February 15 – March 20",
      category: "weed-control",
      tips: "Apply when forsythia blooms or soil temps hit 55°F. Do not aerate or seed after applying",
    },
    {
      id: "tz-2",
      title: "Spring Green-Up",
      instruction: "Apply light fertilizer",
      description:
        "22-0-4 slow-release formula at 0.5 lb N/1,000 sq ft with iron. A light spring feeding to support green-up without promoting weak summer growth.",
      monthStart: 3,
      monthEnd: 3,
      dateRange: "April 1 – April 20",
      category: "fertilizer",
      tips: "Keep this light — heavy spring N promotes weak summer growth",
    },
    {
      id: "tz-3",
      title: "Iron Boost",
      instruction: "Apply iron chelate",
      description:
        "Iron chelate for deep green color during summer heat. Provides color without the brown patch risk of nitrogen.",
      monthStart: 5,
      monthEnd: 5,
      dateRange: "June 1 – June 15",
      category: "fertilizer",
      tips: "Safe to apply in summer — iron doesn't cause disease like nitrogen does",
    },
    {
      id: "tz-4",
      title: "Summer Stress Guard",
      instruction: "Apply biostimulant blend",
      description:
        "Seaweed and humic acid blend to support roots through summer heat. Contains no nitrogen to avoid brown patch disease.",
      monthStart: 6,
      monthEnd: 6,
      dateRange: "July 1 – July 15",
      category: "maintenance",
      tips: "Mow at 3.5-4 inches and water deeply 1-1.5 inches per week in summer",
    },
    {
      id: "tz-5",
      title: "Fall Power Feed",
      instruction: "Apply heavy fall fertilizer",
      description:
        "Your lawn's most important feeding. High nitrogen drives root growth, thickens turf, and repairs summer damage.",
      monthStart: 8,
      monthEnd: 9,
      dateRange: "September 15 – October 1",
      category: "fertilizer",
      tips: "This is the #1 most important application of the year per every university extension",
    },
    {
      id: "tz-6",
      title: "Fall Overseeding",
      instruction: "Overseed thin areas",
      description:
        "Fill in bare and thin areas while cool, moist fall weather supports rapid germination. Core aerate first for best seed-to-soil contact.",
      monthStart: 8,
      monthEnd: 9,
      dateRange: "September 20 – October 20",
      category: "seeding",
      tips: "Soil temp 60-70°F is ideal. Keep newly seeded areas moist for 2-3 weeks",
    },
    {
      id: "tz-7",
      title: "Winterizer",
      instruction: "Apply winterizer fertilizer",
      description:
        "High-potassium winterizer builds root reserves and cold tolerance. Promotes early spring green-up.",
      monthStart: 10,
      monthEnd: 10,
      dateRange: "November 1 – November 20",
      category: "fertilizer",
      tips: "Apply after growth slows but before ground freezes. Quick-release N is OK here",
    },
    {
      id: "tz-8",
      title: "Frost Seeding",
      instruction: "Dormant seed bare areas",
      description:
        "Dormant seeding when soil temps drop below 40°F. Seed remains dormant through winter and germinates in early spring.",
      monthStart: 11,
      monthEnd: 11,
      dateRange: "December 7 – December 30",
      category: "seeding",
      tips: "Seed remains dormant until spring. Set it and forget it!",
    },
  ],
  winterTips: [
    "Minimize foot traffic on frozen or dormant grass",
    "Winterize irrigation systems and store lawn care equipment",
    "Timing is right for decreased watering; cool-season lawns still need occasional moisture",
    "Core aerate in fall (Sep-Oct) before overseeding for best results",
    "Plan a soil test every 2-3 years — many transition zone soils need lime (target pH 6.0-6.5)",
  ],
};

/* ─── Warm-Season Plan (Zones 8–13) ─────────────────── */

const warmSeasonPlan: Omit<SoilPlan, "year"> = {
  region: "Warm-Season",
  summary:
    "Warm-season grasses peak in summer — feed during active growth from spring green-up through early fall. Nitrogen needs vary dramatically by grass type: Bermuda is a nitrogen-hungry performer while Centipede needs very little.",
  applications: [
    {
      id: "ws-1",
      title: "Pre-Emergent Shield",
      instruction: "Apply pre-emergent herbicide",
      description:
        "Prodiamine pre-emergent to prevent crabgrass and annual weeds. Split application recommended — apply again 8-12 weeks later for season-long control.",
      monthStart: 1,
      monthEnd: 2,
      dateRange: "February 1 – March 15",
      category: "weed-control",
      tips: "Apply when soil temp at 2-4 inches hits 55°F. Split app: apply again 8-12 weeks later for season-long control",
    },
    {
      id: "ws-2",
      title: "Spring Green-Up",
      instruction: "Apply balanced fertilizer",
      description:
        "Balanced formula for spring recovery. Wait until your lawn is 50%+ green before applying.",
      monthStart: 3,
      monthEnd: 3,
      dateRange: "April 1 – April 20",
      category: "fertilizer",
      tips: "Apply when soil temp reaches 65°F consistently. For Centipede, use half rate",
    },
    {
      id: "ws-3",
      title: "Iron Boost",
      instruction: "Apply iron chelate",
      description:
        "Extra-strength iron for deep green color. Especially important for Centipede and Zoysia — provides color without excess nitrogen.",
      monthStart: 4,
      monthEnd: 4,
      dateRange: "May 10 – May 20",
      category: "fertilizer",
      tips: "For Centipede, use iron instead of nitrogen for color — max 1 lb N total per year",
    },
    {
      id: "ws-4",
      title: "Summer Powerhouse",
      instruction: "Apply summer fertilizer",
      description:
        "High nitrogen for peak summer growth. Bermuda and St. Augustine thrive with summer feeding. Reduce rate by half for Zoysia; skip entirely for Centipede.",
      monthStart: 5,
      monthEnd: 6,
      dateRange: "June 15 – July 1",
      category: "fertilizer",
      tips: "Water in within 24 hours. For Centipede lawns: SKIP this application — use iron only",
    },
    {
      id: "ws-5",
      title: "Mighty Green",
      instruction: "Apply late summer fertilizer",
      description:
        "Sustains growth and rich color through late summer. For Bermuda and St. Augustine. Zoysia: reduce to half rate.",
      monthStart: 7,
      monthEnd: 7,
      dateRange: "August 1 – August 15",
      category: "fertilizer",
      tips: "Last heavy nitrogen application before fall. Centipede lawns should skip this",
    },
    {
      id: "ws-6",
      title: "Fall Fortify",
      instruction: "Apply potassium-rich fertilizer",
      description:
        "Potassium-rich formula to strengthen roots and improve cold tolerance before dormancy. Critical for winter survival.",
      monthStart: 8,
      monthEnd: 9,
      dateRange: "September 15 – October 1",
      category: "fertilizer",
      tips: "Stop all nitrogen 6-8 weeks before your first expected frost",
    },
    {
      id: "ws-7",
      title: "Fall Overseeding",
      instruction: "Overseed for winter color (optional)",
      description:
        "Optional: Overseed bermuda with ryegrass for winter color, or fill thin areas in St. Augustine/Zoysia.",
      monthStart: 8,
      monthEnd: 9,
      dateRange: "September 20 – October 20",
      category: "seeding",
      tips: "For winter ryegrass on bermuda: scalp to 1 inch first, seed at 5-15 lbs/1,000 sq ft",
    },
  ],
  winterTips: [
    "Avoid mowing dormant warm-season grass — it won't recover until spring",
    "Winterize irrigation systems and store lawn care equipment",
    "Apply a light layer of compost for slow nutrient release",
    "For Centipede: total annual nitrogen should not exceed 1 lb per 1,000 sq ft",
    "Consider turf colorant spray as an alternative to winter overseeding",
  ],
};

/* ─── Public API ─────────────────────────────────────── */

/** Build a full-year soil & fertilizer plan for the user's region */
export function getPlanForRegion(region: ClimateRegion): SoilPlan {
  const base =
    region === "Cool-Season"
      ? coolSeasonPlan
      : region === "Warm-Season"
        ? warmSeasonPlan
        : transitionPlan;

  return { ...base, year: year() };
}

/** Persistence key for completed steps */
export const PLAN_PROGRESS_KEY = "grasswise-soil-plan-progress";

export interface PlanProgress {
  /** Map of step id → ISO timestamp completed */
  completed: Record<string, string>;
  /** Year the progress belongs to */
  year: number;
}

import { safeGetItem, safeSetItem } from "@/lib/safeStorage";

export function loadPlanProgress(): PlanProgress {
  const parsed = safeGetItem<PlanProgress | null>(PLAN_PROGRESS_KEY, null);
  if (parsed && parsed.year === year()) return parsed;
  return { completed: {}, year: year() };
}

export function savePlanProgress(progress: PlanProgress): void {
  safeSetItem(PLAN_PROGRESS_KEY, progress);
}
