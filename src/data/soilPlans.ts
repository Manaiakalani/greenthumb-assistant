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
    "Your cool-season lawn thrives with early spring feeding and a strong fall recovery push. Focus on building roots before summer stress hits.",
  applications: [
    {
      id: "cs-1",
      title: "Early Spring Starter",
      instruction: "Apply granular fertilizer",
      description:
        "20-0-5 slow-release formula to jumpstart spring green-up after dormancy. Focus on even coverage.",
      monthStart: 3,
      monthEnd: 3,
      dateRange: "April 1 – April 15",
      category: "fertilizer",
      tips: "Apply when soil temps reach 55°F",
    },
    {
      id: "cs-2",
      title: "Pre-Emergent & Feed",
      instruction: "Apply pre-emergent + fertilizer",
      description:
        "Combined crabgrass preventer and 19-0-6 fertilizer. Creates a barrier while feeding grass for vigorous spring growth.",
      monthStart: 3,
      monthEnd: 4,
      dateRange: "April 15 – May 1",
      category: "weed-control",
      tips: "Water in within 24 hours of application",
    },
    {
      id: "cs-3",
      title: "Grass Powerhouse",
      instruction: "Apply 1 application",
      description:
        "24-0-3 liquid formula with nitrogen, iron, and seaweed for fast greening and strong, resilient growth.",
      monthStart: 4,
      monthEnd: 4,
      dateRange: "May 17 – May 24",
      category: "fertilizer",
    },
    {
      id: "cs-4",
      title: "Iron Boost",
      instruction: "Apply 1 application",
      description:
        "20-0-1 liquid formula with extra-strength iron chelate for the deepest green and steady growth.",
      monthStart: 5,
      monthEnd: 5,
      dateRange: "June 18 – June 25",
      category: "fertilizer",
    },
    {
      id: "cs-5",
      title: "Summer Stress Guard",
      instruction: "Apply heat-stress formula",
      description:
        "Potassium-heavy 6-0-18 formula with humic acid. Strengthens cell walls and improves drought tolerance during peak heat.",
      monthStart: 6,
      monthEnd: 6,
      dateRange: "July 10 – July 20",
      category: "fertilizer",
      tips: "Water deeply the day before application",
    },
    {
      id: "cs-6",
      title: "Mighty Green",
      instruction: "Apply 1 application",
      description:
        "20-0-2 liquid formula with high nitrogen for steady growth and rich, lasting color.",
      monthStart: 7,
      monthEnd: 7,
      dateRange: "August 23 – August 30",
      category: "fertilizer",
    },
    {
      id: "cs-7",
      title: "Fall Recovery Feed",
      instruction: "Apply fall fertilizer",
      description:
        "24-0-3 liquid formula with soy protein and seaweed to fuel growth and heal summer wear.",
      monthStart: 8,
      monthEnd: 9,
      dateRange: "September 15 – October 3",
      category: "fertilizer",
    },
    {
      id: "cs-8",
      title: "Fall Overseeding",
      instruction: "Overseed thin areas",
      description:
        "Fill in bare areas to prepare and fortify the lawn for next spring. Cool moist fall weather supports rapid germination.",
      monthStart: 8,
      monthEnd: 9,
      dateRange: "September 20 – October 20",
      category: "seeding",
      tips: "Keep newly seeded areas moist for 2-3 weeks",
    },
    {
      id: "cs-9",
      title: "Winterizer",
      instruction: "Pre-winter application",
      description:
        "Potassium-rich formula to harden grass for winter. Seed any remaining bare patches before freeze — they'll dormant-seed until spring.",
      monthStart: 11,
      monthEnd: 11,
      dateRange: "December 7 – December 20",
      category: "fertilizer",
    },
  ],
  winterTips: [
    "Minimize foot traffic on frozen or dormant grass",
    "Winterize irrigation systems and store lawn care equipment",
    "Timing is right for decreased watering; cool-season lawns still need occasional moisture",
  ],
};

/* ─── Transition Zone Plan (Zones 5–7) ──────────────── */

const transitionPlan: Omit<SoilPlan, "year"> = {
  region: "Transition Zone",
  summary:
    "Transition zone lawns face heat and cold. A balanced spring/fall feeding schedule with summer protection keeps your mix thriving year-round.",
  applications: [
    {
      id: "tz-1",
      title: "Pre-Emergent Shield",
      instruction: "Apply pre-emergent herbicide",
      description:
        "Crabgrass and annual weed preventer. Apply when forsythia blooms or soil temps hit 55°F for 3+ consecutive days.",
      monthStart: 2,
      monthEnd: 2,
      dateRange: "March 1 – March 20",
      category: "weed-control",
      tips: "Do not aerate or dethatch after applying",
    },
    {
      id: "tz-2",
      title: "Spring Green-Up",
      instruction: "Apply 1 application",
      description:
        "22-0-4 balanced formula with slow-release nitrogen and iron. Promotes thick, green growth without excessive top growth.",
      monthStart: 3,
      monthEnd: 3,
      dateRange: "April 5 – April 20",
      category: "fertilizer",
    },
    {
      id: "tz-3",
      title: "Grass Powerhouse",
      instruction: "Apply 1 application",
      description:
        "24-0-3 liquid formula with nitrogen, iron, and seaweed for fast greening and strong resilient growth.",
      monthStart: 4,
      monthEnd: 4,
      dateRange: "May 10 – May 24",
      category: "fertilizer",
    },
    {
      id: "tz-4",
      title: "Iron Boost",
      instruction: "Apply 1 application",
      description:
        "20-0-1 liquid formula with extra-strength iron chelate for the deepest green and steady growth.",
      monthStart: 5,
      monthEnd: 5,
      dateRange: "June 18 – June 25",
      category: "fertilizer",
    },
    {
      id: "tz-5",
      title: "Active Lawn",
      instruction: "Apply 1 application",
      description:
        "28-0-3 liquid formula with nitrogen and potassium for even growth and deep green color.",
      monthStart: 6,
      monthEnd: 6,
      dateRange: "July 21 – July 28",
      category: "fertilizer",
    },
    {
      id: "tz-6",
      title: "Mighty Green",
      instruction: "Apply 1 application",
      description:
        "20-0-2 liquid formula with high nitrogen for steady growth and rich, lasting color.",
      monthStart: 7,
      monthEnd: 7,
      dateRange: "August 23 – August 30",
      category: "fertilizer",
    },
    {
      id: "tz-7",
      title: "Lawn Strong",
      instruction: "Apply 1 application",
      description:
        "24-0-3 liquid formula with soy protein and seaweed to fuel growth and heal summer wear.",
      monthStart: 8,
      monthEnd: 9,
      dateRange: "September 15 – October 3",
      category: "fertilizer",
    },
    {
      id: "tz-8",
      title: "Fall Fortify Plus",
      instruction: "Micronutrients + fertilizer",
      description:
        "18-0-6 liquid formula with micronutrients to strengthen roots and prep grass for winter.",
      monthStart: 8,
      monthEnd: 9,
      dateRange: "September 25 – October 3",
      category: "fertilizer",
    },
    {
      id: "tz-9",
      title: "Fall Overseeding",
      instruction: "Overseed thin areas",
      description:
        "Fill in bare areas to prepare and fortify the lawn for next spring. Cool moist fall weather supports rapid germination.",
      monthStart: 8,
      monthEnd: 9,
      dateRange: "September 20 – October 20",
      category: "seeding",
      tips: "Keep newly seeded areas moist for 2-3 weeks",
    },
    {
      id: "tz-10",
      title: "Frost Seeding",
      instruction: "Pre-winter dormant seed",
      description:
        "You can seed once temps reach below 45°F. Seed journeys will remain dormant until spring, but it's best to get seed down early.",
      monthStart: 11,
      monthEnd: 11,
      dateRange: "December 7 – December 20",
      category: "seeding",
    },
  ],
  winterTips: [
    "Minimize foot traffic on frozen or dormant grass",
    "Winterize irrigation systems and store lawn care equipment",
    "Timing is right for decreased watering; cool-season lawns still need occasional moisture",
  ],
};

/* ─── Warm-Season Plan (Zones 8–13) ─────────────────── */

const warmSeasonPlan: Omit<SoilPlan, "year"> = {
  region: "Warm-Season",
  summary:
    "Warm-season grasses peak in summer. Feed aggressively from late spring through early fall, then let your lawn ease into winter dormancy.",
  applications: [
    {
      id: "ws-1",
      title: "Iron Boost",
      instruction: "Apply 1 application",
      description:
        "20-0-1 liquid formula with extra-strength iron chelate for the deepest green and steady growth.",
      monthStart: 3,
      monthEnd: 3,
      dateRange: "April 12 – April 19",
      category: "fertilizer",
    },
    {
      id: "ws-2",
      title: "Spring Seeding",
      instruction: "Need to crowd out weeds",
      description:
        "Overseed and patch bare areas to thicken the lawn and crowd out weeds. Keep soil moist to help seed germination.",
      monthStart: 4,
      monthEnd: 5,
      dateRange: "May 10 – June 11",
      category: "seeding",
      tips: "Water lightly twice daily until established",
    },
    {
      id: "ws-3",
      title: "Soil Helper",
      instruction: "Apply 1 pouch",
      description:
        "22-0-3 liquid formula with surfactants to improve water flow and nutrient uptake in soil.",
      monthStart: 6,
      monthEnd: 6,
      dateRange: "July 4 – July 11",
      category: "soil-amendment",
    },
    {
      id: "ws-4",
      title: "Mighty Green",
      instruction: "Apply 1 application",
      description:
        "20-0-2 liquid formula with high nitrogen for steady growth and rich, lasting color.",
      monthStart: 7,
      monthEnd: 7,
      dateRange: "August 14 – August 21",
      category: "fertilizer",
    },
    {
      id: "ws-5",
      title: "Fall Fortify Plus",
      instruction: "Micronutrients + fertilizer",
      description:
        "18-0-6 liquid formula with micronutrients to strengthen roots and prep grass for winter.",
      monthStart: 8,
      monthEnd: 9,
      dateRange: "September 25 – October 3",
      category: "fertilizer",
    },
    {
      id: "ws-6",
      title: "Fall Overseeding",
      instruction: "Overseed thin areas",
      description:
        "Fill in bare areas to prepare and fortify the lawn for next spring. Cool moist fall weather supports rapid germination.",
      monthStart: 8,
      monthEnd: 9,
      dateRange: "September 20 – October 20",
      category: "seeding",
      tips: "Keep newly seeded areas moist for 2-3 weeks",
    },
    {
      id: "ws-7",
      title: "Frost Seeding",
      instruction: "Pre-winter dormant seed",
      description:
        "You can seed once temps reach below 45°F. Seed journeys will remain dormant until spring. Get it down early before frost.",
      monthStart: 11,
      monthEnd: 11,
      dateRange: "December 7 – December 20",
      category: "seeding",
    },
  ],
  winterTips: [
    "Avoid mowing dormant warm-season grass — it won't recover until spring",
    "Winterize irrigation systems and store lawn care equipment",
    "Apply a light layer of compost for slow nutrient release",
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

export function loadPlanProgress(): PlanProgress {
  try {
    const raw = localStorage.getItem(PLAN_PROGRESS_KEY);
    if (raw) {
      const parsed = JSON.parse(raw) as PlanProgress;
      // Reset if year changed
      if (parsed.year === year()) return parsed;
    }
  } catch {
    // corrupted
  }
  return { completed: {}, year: year() };
}

export function savePlanProgress(progress: PlanProgress): void {
  localStorage.setItem(PLAN_PROGRESS_KEY, JSON.stringify(progress));
}
