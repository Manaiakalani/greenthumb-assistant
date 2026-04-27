import Scissors from "lucide-react/dist/esm/icons/scissors";
import Flower2 from "lucide-react/dist/esm/icons/flower-2";
import Droplets from "lucide-react/dist/esm/icons/droplets";
import AlertTriangle from "lucide-react/dist/esm/icons/alert-triangle";
import Shovel from "lucide-react/dist/esm/icons/shovel";
import Leaf from "lucide-react/dist/esm/icons/leaf";
import Bug from "lucide-react/dist/esm/icons/bug";
import Snowflake from "lucide-react/dist/esm/icons/snowflake";
import Thermometer from "lucide-react/dist/esm/icons/thermometer";
import Wind from "lucide-react/dist/esm/icons/wind";
import type { ActionItem } from "@/types/lawn";
import type { ClimateRegion } from "@/types/profile";
import { getSeason, type Season } from "@/data/stats";

// ---------------------------------------------------------------------------
// Season × Region action templates
// ---------------------------------------------------------------------------

type ActionTemplate = Omit<ActionItem, "description"> & { description: (grass: string) => string };

const winterActions: Record<ClimateRegion, ActionTemplate[]> = {
  "Cool-Season": [
    { icon: Scissors, title: "Sharpen Mower Blades", status: "safe", statusLabel: "Prep Time", description: () => "Use the off-season to sharpen or replace your mower blades for cleaner cuts this spring." },
    { icon: Thermometer, title: "Soil Test", status: "safe", statusLabel: "Good Time", description: () => "Send a soil sample to your local extension office. Results help plan spring fertilization.", detail: "Aim for pH 6.0–7.0 for most cool-season grasses" },
    { icon: Snowflake, title: "Snow Mold Watch", status: "caution", statusLabel: "Monitor", description: (g) => `Watch for gray or pink patches on your ${g} as snow melts — that's snow mold.`, detail: "Gently rake matted areas to improve air flow" },
    { icon: Leaf, title: "Avoid Traffic", status: "caution", statusLabel: "Stay Off", description: () => "Frozen or frost-covered grass is fragile. Minimize foot traffic to prevent blade damage." },
  ],
  "Transition Zone": [
    { icon: Scissors, title: "Mower Maintenance", status: "safe", statusLabel: "Prep Time", description: () => "Service your mower now — oil change, blade sharpening, spark plug." },
    { icon: AlertTriangle, title: "Pre-Emergent Planning", status: "caution", statusLabel: "Plan Ahead", description: () => "Soil temps are approaching 55°F threshold. Have your pre-emergent ready.", detail: "Apply when forsythia starts blooming in your area" },
    { icon: Droplets, title: "Watering", status: "safe", statusLabel: "Minimal", description: (g) => `Your ${g} is mostly dormant. Only water if there's been no rain for 3+ weeks.` },
    { icon: Bug, title: "Winter Weeds", status: "danger", statusLabel: "Spot Treat", description: () => "Chickweed and henbit may be active. Spot-spray with a broadleaf herbicide on warm days.", detail: "Apply when temps are above 50°F for effectiveness" },
  ],
  "Warm-Season": [
    { icon: Shovel, title: "Scalping Prep", status: "caution", statusLabel: "Plan Ahead", description: (g) => `Plan to scalp your ${g} in late winter/early spring to remove dead material and encourage green-up.` },
    { icon: AlertTriangle, title: "Pre-Emergent", status: "safe", statusLabel: "Apply Soon", description: () => "Apply pre-emergent herbicide before soil temps consistently hit 55°F.", detail: "Split applications 6-8 weeks apart for best coverage" },
    { icon: Droplets, title: "Watering", status: "safe", statusLabel: "Not Needed", description: (g) => `Your ${g} is dormant and doesn't need water. Let it rest.` },
    { icon: Bug, title: "Winter Weed Control", status: "danger", statusLabel: "Action Needed", description: () => "Winter annual weeds are active in warm-season lawns. Apply post-emergent control.", detail: "Target annual bluegrass, chickweed, and clover" },
  ],
};

const springActions: Record<ClimateRegion, ActionTemplate[]> = {
  "Cool-Season": [
    { icon: Scissors, title: "First Mow", status: "safe", statusLabel: "Safe to Mow", description: (g) => `Your ${g} is waking up! Set mower to 3–3.5 inches for the first cut of the season.`, detail: "Never remove more than ⅓ of the blade height at once" },
    { icon: Flower2, title: "Spring Fertilizer", status: "safe", statusLabel: "Apply Now", description: (g) => `Apply a balanced slow-release fertilizer for your ${g}. A light feeding now fuels spring growth.`, detail: "Use a starter fertilizer if you overseeded in fall" },
    { icon: AlertTriangle, title: "Pre-Emergent", status: "danger", statusLabel: "Critical Window", description: () => "Apply pre-emergent before soil hits 55°F to prevent crabgrass. This window is closing!", detail: "Check soil temp at 2-inch depth for accuracy" },
    { icon: Droplets, title: "Watering", status: "safe", statusLabel: "Monitor", description: () => "Spring rain usually provides enough moisture. Supplement with 1 inch/week if dry." },
  ],
  "Transition Zone": [
    { icon: Scissors, title: "Mow Your Lawn", status: "safe", statusLabel: "Safe to Mow", description: (g) => `Conditions are ideal for mowing your ${g}. Cut to 3 inches for optimal health.`, detail: "Alternate your mowing direction each time" },
    { icon: Flower2, title: "Fertilization", status: "caution", statusLabel: "Timing Matters", description: (g) => `Your ${g} spring fertilization window is open. Use a slow-release nitrogen fertilizer.`, detail: "Wait until you've mowed at least twice before feeding" },
    { icon: AlertTriangle, title: "Weed Alert", status: "danger", statusLabel: "Action Needed", description: () => "Pre-emergent herbicide window is closing. Apply within the next week to prevent crabgrass.", detail: "Soil temperature approaching the 55°F threshold" },
    { icon: Droplets, title: "Watering", status: "safe", statusLabel: "As Needed", description: () => "Water deeply but infrequently — about 1 inch per week including rainfall." },
  ],
  "Warm-Season": [
    { icon: Shovel, title: "Scalp Your Lawn", status: "safe", statusLabel: "Go For It", description: (g) => `Scalp your ${g} down low to remove winter-dead material and let sunlight warm the soil.`, detail: "Bag the clippings after scalping" },
    { icon: Flower2, title: "First Feeding", status: "caution", statusLabel: "Wait for Green", description: (g) => `Don't fertilize until your ${g} is 50%+ green. Feeding dormant grass wastes nutrients.` },
    { icon: Scissors, title: "Start Mowing", status: "safe", statusLabel: "Regular Schedule", description: (g) => `Once your ${g} greens up, start mowing at the recommended height every 5-7 days.` },
    { icon: Bug, title: "Weed Control", status: "danger", statusLabel: "Monitor", description: () => "Post-emergent spot-treatment for any weeds that got through. Avoid broadcast spraying in heat." },
  ],
};

const summerActions: Record<ClimateRegion, ActionTemplate[]> = {
  "Cool-Season": [
    { icon: Scissors, title: "Raise Mower Height", status: "caution", statusLabel: "Adjust Now", description: (g) => `Raise your mower to 3.5–4 inches for your ${g}. Taller grass shades roots and retains moisture.` },
    { icon: Droplets, title: "Deep Watering", status: "danger", statusLabel: "Critical", description: () => "Water deeply early morning — 1 to 1.5 inches per week. Avoid evening watering to prevent disease.", detail: "Water 2-3 times per week rather than daily" },
    { icon: Flower2, title: "Fertilization", status: "caution", statusLabel: "Hold Off", description: (g) => `Avoid fertilizing ${g} in summer heat. Heavy feeding now stresses the grass further.` },
    { icon: Wind, title: "Heat Stress Watch", status: "danger", statusLabel: "Monitor", description: () => "If grass turns blue-gray and footprints linger, it's heat-stressed. Water immediately.", detail: "Consider leaving grass clippings as mulch for moisture retention" },
  ],
  "Transition Zone": [
    { icon: Scissors, title: "Mowing", status: "safe", statusLabel: "Keep Up", description: (g) => `Mow your ${g} regularly at 3-3.5 inches. Never remove more than ⅓ of the blade.` },
    { icon: Droplets, title: "Watering", status: "caution", statusLabel: "Watch Closely", description: () => "Heat is building. Ensure 1-1.5 inches of water per week. Water early morning only.", detail: "Use a rain gauge to track actual moisture" },
    { icon: Bug, title: "Grub Watch", status: "danger", statusLabel: "Check Now", description: () => "Japanese beetle grubs feed on roots mid-summer. Pull back turf to check — treat if >5 per sq ft.", detail: "Beneficial nematodes are an organic option" },
    { icon: Flower2, title: "Light Feeding", status: "caution", statusLabel: "Optional", description: (g) => `A light application of slow-release fertilizer can help your ${g} through summer — skip if stressed.` },
  ],
  "Warm-Season": [
    { icon: Scissors, title: "Peak Mowing", status: "safe", statusLabel: "Mow 2x/Week", description: (g) => `Your ${g} is in peak growth! Mow every 3-5 days to keep it at optimal height.`, detail: "Sharp blades are critical during rapid growth" },
    { icon: Flower2, title: "Summer Fertilizer", status: "safe", statusLabel: "Feed Now", description: (g) => `Apply nitrogen fertilizer to your ${g} during its peak growing season for maximum benefit.`, detail: "Use slow-release to avoid burning" },
    { icon: Droplets, title: "Watering", status: "safe", statusLabel: "Regular", description: () => "Water 1-1.5 inches per week. Deep, infrequent watering encourages deeper root growth." },
    { icon: Bug, title: "Pest Patrol", status: "caution", statusLabel: "Monitor", description: () => "Watch for chinch bugs, armyworms, and sod webworms. Brown patches may indicate an infestation.", detail: "Do a soap flush test on suspicious areas" },
  ],
};

const fallActions: Record<ClimateRegion, ActionTemplate[]> = {
  "Cool-Season": [
    { icon: Shovel, title: "Aerate & Overseed", status: "safe", statusLabel: "Best Time", description: (g) => `Fall is THE best time to aerate and overseed your ${g}. Thicken your lawn for next year!`, detail: "Core aerate when soil is moist, not soggy" },
    { icon: Flower2, title: "Fall Fertilizer", status: "safe", statusLabel: "Apply Now", description: (g) => `The most important feeding of the year for ${g}. Apply a high-nitrogen fertilizer now.`, detail: "This builds root reserves for winter survival" },
    { icon: Scissors, title: "Keep Mowing", status: "safe", statusLabel: "Continue", description: () => "Continue mowing until growth stops. Gradually lower the height for the final cut.", detail: "Final mow height: 2.5 inches to prevent snow mold" },
    { icon: Leaf, title: "Leaf Management", status: "caution", statusLabel: "Stay On Top", description: () => "Mulch or remove fallen leaves promptly. A thick leaf layer smothers grass and promotes disease." },
  ],
  "Transition Zone": [
    { icon: Shovel, title: "Overseed", status: "safe", statusLabel: "Prime Window", description: (g) => `Overseed thin areas with ${g} or a compatible blend. September is ideal for establishment.`, detail: "Keep seed moist for 2-3 weeks until germination" },
    { icon: Flower2, title: "Fertilize", status: "safe", statusLabel: "Apply Now", description: () => "Apply a balanced fertilizer to support fall growth and root development." },
    { icon: Scissors, title: "Regular Mowing", status: "safe", statusLabel: "Continue", description: (g) => `Your ${g} has a second growth spurt in fall. Keep mowing at 3 inches.` },
    { icon: AlertTriangle, title: "Weed Prevention", status: "caution", statusLabel: "Last Chance", description: () => "Apply fall pre-emergent to prevent winter annual weeds like Poa annua.", detail: "Apply when nighttime temps consistently drop below 70°F" },
  ],
  "Warm-Season": [
    { icon: Scissors, title: "Reduce Mowing", status: "safe", statusLabel: "Winding Down", description: (g) => `Your ${g} is slowing down. Reduce mowing frequency as growth declines.` },
    { icon: Flower2, title: "Last Fertilizer", status: "caution", statusLabel: "Final Feed", description: (g) => `Apply a potassium-rich fertilizer to help your ${g} prepare for winter dormancy.`, detail: "Avoid high nitrogen — it delays hardening off" },
    { icon: Shovel, title: "Overseed (Optional)", status: "caution", statusLabel: "If Desired", description: () => "Overseed with annual ryegrass for a green lawn through winter, if desired.", detail: "Wait until warm-season grass goes dormant" },
    { icon: Leaf, title: "Leaf Clean-Up", status: "caution", statusLabel: "Important", description: () => "Remove heavy leaf cover to prevent smothering dormant grass and inviting fungal issues." },
  ],
};

const actionMap: Record<Season, Record<ClimateRegion, ActionTemplate[]>> = {
  winter: winterActions,
  spring: springActions,
  summer: summerActions,
  fall: fallActions,
};

// ---------------------------------------------------------------------------
// Public API
// ---------------------------------------------------------------------------

/**
 * Get seasonally-appropriate lawn care actions for the user's region and grass type.
 */
export function getSeasonalActions(
  region: ClimateRegion,
  grassType: string,
  month: number,
): ActionItem[] {
  const season = getSeason(month);
  const templates = actionMap[season][region];
  return templates.map((t) => ({
    ...t,
    description: t.description(grassType),
  }));
}
