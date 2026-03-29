/* ─── Seasonal lawn care tips database ─────────────── */

export interface SeasonalTip {
  id: string;
  tip: string;
  details: string;
  season: "spring" | "summer" | "fall" | "winter";
  regions: ("Cool-Season" | "Transition Zone" | "Warm-Season")[];
  category:
    | "mowing"
    | "watering"
    | "fertilizing"
    | "maintenance"
    | "pest-control"
    | "general";
  weatherTrigger?: {
    condition: "hot" | "cold" | "rainy" | "dry" | "windy";
    threshold?: number;
  };
}

export const SEASONAL_TIPS: SeasonalTip[] = [
  // ── Spring / Cool-Season ──────────────────────────────
  {
    id: "sp-cool-1",
    tip: "Apply pre-emergent when soil temps hit 55 °F — before crabgrass germinates.",
    details:
      "Use a soil thermometer at 2-inch depth for accuracy. Time your application when forsythia blooms in your area. A split application 6–8 weeks apart gives the best coverage.",
    season: "spring",
    regions: ["Cool-Season"],
    category: "pest-control",
    weatherTrigger: { condition: "hot", threshold: 55 },
  },
  {
    id: "sp-cool-2",
    tip: "Set your mower to 3–3.5 inches for the first spring cut.",
    details:
      "Never remove more than ⅓ of the blade height at once. The first mow removes winter-damaged tips and encourages new tiller growth.",
    season: "spring",
    regions: ["Cool-Season"],
    category: "mowing",
  },
  {
    id: "sp-cool-3",
    tip: "Spring is a great time for a soil test — plan your fertilizer accordingly.",
    details:
      "Send a sample to your local extension office. Results guide lime, phosphorus, and potassium needs so you only apply what's missing.",
    season: "spring",
    regions: ["Cool-Season"],
    category: "fertilizing",
  },
  {
    id: "sp-cool-4",
    tip: "Dethatch if your thatch layer exceeds ½ inch.",
    details:
      "Use a power rake or dethatching mower attachment. Spring dethatching gives cool-season grasses the full growing season to recover.",
    season: "spring",
    regions: ["Cool-Season"],
    category: "maintenance",
  },
  {
    id: "sp-cool-5",
    tip: "Wait until you've mowed twice before applying spring fertilizer.",
    details:
      "Feeding too early pushes top growth before roots are ready. A slow-release nitrogen fertilizer at ½ lb N / 1,000 sq ft is ideal.",
    season: "spring",
    regions: ["Cool-Season"],
    category: "fertilizing",
  },

  // ── Spring / Transition Zone ──────────────────────────
  {
    id: "sp-trans-1",
    tip: "Pre-emergent window is closing — apply within the next week.",
    details:
      "Soil temperatures are approaching the 55 °F threshold. A split application now and again in 6–8 weeks maximises the barrier.",
    season: "spring",
    regions: ["Transition Zone"],
    category: "pest-control",
    weatherTrigger: { condition: "hot", threshold: 55 },
  },
  {
    id: "sp-trans-2",
    tip: "Alternate your mowing direction each time you mow.",
    details:
      "This prevents ruts, soil compaction, and grass grain. Cut at 3 inches for most transition-zone grasses.",
    season: "spring",
    regions: ["Transition Zone"],
    category: "mowing",
  },
  {
    id: "sp-trans-3",
    tip: "Water deeply but infrequently — about 1 inch per week including rainfall.",
    details:
      "Place a tuna can on the lawn to measure sprinkler output. Deep watering encourages roots to grow down rather than staying shallow.",
    season: "spring",
    regions: ["Transition Zone"],
    category: "watering",
  },

  // ── Spring / Warm-Season ──────────────────────────────
  {
    id: "sp-warm-1",
    tip: "Scalp your warm-season lawn to remove winter-dead material.",
    details:
      "Set your mower as low as possible and bag the clippings. This lets sunlight warm the soil faster and promotes earlier green-up.",
    season: "spring",
    regions: ["Warm-Season"],
    category: "mowing",
  },
  {
    id: "sp-warm-2",
    tip: "Don't fertilize until your lawn is 50 %+ green.",
    details:
      "Feeding dormant grass wastes nutrients and can encourage weeds. Once you see vigorous green growth, apply a slow-release nitrogen fertilizer.",
    season: "spring",
    regions: ["Warm-Season"],
    category: "fertilizing",
  },
  {
    id: "sp-warm-3",
    tip: "Spot-treat any winter weeds that broke through with a post-emergent.",
    details:
      "Avoid broadcast spraying in heat. Target annual bluegrass, chickweed, and clover individually for best results.",
    season: "spring",
    regions: ["Warm-Season"],
    category: "pest-control",
  },

  // ── Summer / Cool-Season ──────────────────────────────
  {
    id: "su-cool-1",
    tip: "Raise your mower to 3.5–4 inches during summer heat.",
    details:
      "Taller grass shades the soil, reduces evaporation, and keeps roots cooler. This is the single best thing you can do for cool-season turf in summer.",
    season: "summer",
    regions: ["Cool-Season"],
    category: "mowing",
  },
  {
    id: "su-cool-2",
    tip: "Water before 10 AM to reduce evaporation and fungal risk.",
    details:
      "Morning watering lets blades dry during the day. Aim for 1–1.5 inches per week, split into 2–3 sessions.",
    season: "summer",
    regions: ["Cool-Season", "Transition Zone", "Warm-Season"],
    category: "watering",
    weatherTrigger: { condition: "hot", threshold: 85 },
  },
  {
    id: "su-cool-3",
    tip: "Avoid heavy fertilisation in summer — it stresses cool-season grass.",
    details:
      "If you must feed, use a very light application of slow-release nitrogen (¼ lb N / 1,000 sq ft). Better to wait for fall.",
    season: "summer",
    regions: ["Cool-Season"],
    category: "fertilizing",
  },
  {
    id: "su-cool-4",
    tip: "If footprints linger on your lawn, it's heat-stressed — water immediately.",
    details:
      "Blue-gray colour and persistent footprints are early signs. Leave clippings as mulch for extra moisture retention.",
    season: "summer",
    regions: ["Cool-Season"],
    category: "watering",
    weatherTrigger: { condition: "hot", threshold: 90 },
  },
  {
    id: "su-cool-5",
    tip: "Sharpen your mower blades mid-season for cleaner cuts.",
    details:
      "Dull blades tear grass, leaving brown ragged tips that invite disease. Sharpen or replace blades every 25–30 hours of mowing.",
    season: "summer",
    regions: ["Cool-Season", "Transition Zone"],
    category: "mowing",
  },

  // ── Summer / Transition Zone ──────────────────────────
  {
    id: "su-trans-1",
    tip: "Check for grub damage — pull back turf to look for white larvae.",
    details:
      "Japanese beetle grubs feed on roots mid-summer. If you find more than 5 per square foot, treat with milky spore or beneficial nematodes.",
    season: "summer",
    regions: ["Transition Zone"],
    category: "pest-control",
  },
  {
    id: "su-trans-2",
    tip: "Use a rain gauge to track actual moisture reaching your lawn.",
    details:
      "Sprinkler output varies widely. Measure weekly to ensure you're hitting 1–1.5 inches. Adjust run times based on data, not guesswork.",
    season: "summer",
    regions: ["Transition Zone"],
    category: "watering",
  },
  {
    id: "su-trans-3",
    tip: "Mow regularly at 3–3.5 inches — never remove more than ⅓ of the blade.",
    details:
      "Skipping mows leads to scalping, which stresses grass in hot weather. Keep a consistent schedule even if growth slows.",
    season: "summer",
    regions: ["Transition Zone"],
    category: "mowing",
  },

  // ── Summer / Warm-Season ──────────────────────────────
  {
    id: "su-warm-1",
    tip: "Your warm-season lawn is in peak growth — mow every 3–5 days.",
    details:
      "Sharp blades are critical during rapid growth. Bermudagrass and Zoysiagrass especially need frequent cutting to stay dense.",
    season: "summer",
    regions: ["Warm-Season"],
    category: "mowing",
  },
  {
    id: "su-warm-2",
    tip: "Apply slow-release nitrogen during peak summer growth.",
    details:
      "This is the prime feeding window for warm-season grasses. Use slow-release to avoid burning and apply at ½–1 lb N / 1,000 sq ft.",
    season: "summer",
    regions: ["Warm-Season"],
    category: "fertilizing",
  },
  {
    id: "su-warm-3",
    tip: "Watch for chinch bugs — they love hot, dry St. Augustine lawns.",
    details:
      "Brown patches that don't respond to watering may be chinch bug damage. Do a soap flush test: mix 2 tbsp dish soap in 1 gallon water, pour over the edge of a damaged area, and watch for insects.",
    season: "summer",
    regions: ["Warm-Season"],
    category: "pest-control",
    weatherTrigger: { condition: "hot", threshold: 90 },
  },
  {
    id: "su-warm-4",
    tip: "Deep, infrequent watering encourages deeper root growth.",
    details:
      "Water 1–1.5 inches per week in 2–3 sessions. Bermudagrass roots can reach 6+ feet deep when trained with proper irrigation.",
    season: "summer",
    regions: ["Warm-Season"],
    category: "watering",
  },

  // ── Fall / Cool-Season ────────────────────────────────
  {
    id: "fa-cool-1",
    tip: "This is the #1 time to overseed cool-season lawns — soil is warm, air is cool.",
    details:
      "Core aerate first for best seed-to-soil contact. Keep seed moist for 2–3 weeks until germination. September is ideal.",
    season: "fall",
    regions: ["Cool-Season"],
    category: "maintenance",
  },
  {
    id: "fa-cool-2",
    tip: "Apply your most important fertilizer of the year now.",
    details:
      "A high-nitrogen fall feeding builds root carbohydrate reserves for winter survival and early spring green-up. Apply 1 lb N / 1,000 sq ft.",
    season: "fall",
    regions: ["Cool-Season"],
    category: "fertilizing",
  },
  {
    id: "fa-cool-3",
    tip: "Mulch fallen leaves instead of raking — free nutrients for your lawn.",
    details:
      "Run your mower over leaves until pieces are dime-sized. A thick unbroken leaf layer smothers grass, but mulched leaves decompose quickly.",
    season: "fall",
    regions: ["Cool-Season"],
    category: "maintenance",
  },
  {
    id: "fa-cool-4",
    tip: "Gradually lower your mowing height for the last 2–3 cuts of the season.",
    details:
      "End at about 2.5 inches to reduce snow mould risk. Don't drop more than ½ inch at a time to avoid scalping.",
    season: "fall",
    regions: ["Cool-Season"],
    category: "mowing",
  },
  {
    id: "fa-cool-5",
    tip: "Core aerate compacted areas to improve drainage before winter.",
    details:
      "Aerate when soil is moist, not soggy. Leave the cores on the surface — they'll break down and work nutrients back into the soil.",
    season: "fall",
    regions: ["Cool-Season"],
    category: "maintenance",
  },

  // ── Fall / Transition Zone ────────────────────────────
  {
    id: "fa-trans-1",
    tip: "Overseed thin spots with your grass type or a compatible blend.",
    details:
      "September is the prime window. Keep new seed consistently moist — light watering 2–3 times daily for the first two weeks.",
    season: "fall",
    regions: ["Transition Zone"],
    category: "maintenance",
  },
  {
    id: "fa-trans-2",
    tip: "Apply fall pre-emergent to prevent Poa annua and winter annuals.",
    details:
      "Apply when nighttime temps consistently drop below 70 °F. This prevents winter weeds without interfering with desirable grass growth.",
    season: "fall",
    regions: ["Transition Zone"],
    category: "pest-control",
    weatherTrigger: { condition: "cold", threshold: 70 },
  },
  {
    id: "fa-trans-3",
    tip: "Your lawn has a second growth spurt in fall — keep mowing at 3 inches.",
    details:
      "Don't stop mowing just because summer is over. Cool fall temperatures trigger rapid growth in transition-zone grasses.",
    season: "fall",
    regions: ["Transition Zone"],
    category: "mowing",
  },

  // ── Fall / Warm-Season ────────────────────────────────
  {
    id: "fa-warm-1",
    tip: "Reduce mowing frequency as your warm-season grass slows down.",
    details:
      "Growth rate drops significantly as temperatures cool. Mow only as needed and avoid scalping going into dormancy.",
    season: "fall",
    regions: ["Warm-Season"],
    category: "mowing",
  },
  {
    id: "fa-warm-2",
    tip: "Apply a potassium-rich fertilizer to prepare for winter dormancy.",
    details:
      "Avoid high nitrogen — it delays hardening off. Potassium strengthens cell walls and improves cold tolerance.",
    season: "fall",
    regions: ["Warm-Season"],
    category: "fertilizing",
  },
  {
    id: "fa-warm-3",
    tip: "Consider overseeding with annual ryegrass for a green winter lawn.",
    details:
      "Wait until your warm-season grass is fully dormant (tan/brown). Annual ryegrass dies off naturally in spring as warm-season turf greens up.",
    season: "fall",
    regions: ["Warm-Season"],
    category: "maintenance",
  },
  {
    id: "fa-warm-4",
    tip: "Remove heavy leaf cover to prevent smothering dormant grass.",
    details:
      "Dormant grass still needs some light and air circulation. A thick leaf layer can trap moisture and invite fungal diseases.",
    season: "fall",
    regions: ["Warm-Season"],
    category: "maintenance",
  },

  // ── Winter / Cool-Season ──────────────────────────────
  {
    id: "wi-cool-1",
    tip: "Keep foot traffic off frozen grass to prevent crown damage.",
    details:
      "Frozen grass blades are brittle. Walking on frosted turf crushes cell walls, leading to brown footprint-shaped patches in spring.",
    season: "winter",
    regions: ["Cool-Season"],
    category: "general",
    weatherTrigger: { condition: "cold", threshold: 32 },
  },
  {
    id: "wi-cool-2",
    tip: "Use the off-season to sharpen or replace your mower blades.",
    details:
      "A sharp blade makes a clean cut that heals quickly. Dull blades tear grass, creating entry points for disease. Service your mower now.",
    season: "winter",
    regions: ["Cool-Season"],
    category: "maintenance",
  },
  {
    id: "wi-cool-3",
    tip: "Watch for gray or pink snow mould patches as snow melts.",
    details:
      "Gently rake matted areas to improve air flow. Snow mould is mostly cosmetic — grass usually recovers on its own in spring.",
    season: "winter",
    regions: ["Cool-Season"],
    category: "pest-control",
    weatherTrigger: { condition: "cold", threshold: 32 },
  },
  {
    id: "wi-cool-4",
    tip: "Plan your spring strategy — order seed, schedule soil tests.",
    details:
      "Winter is the perfect time to plan. Research new grass varieties, review last year's journal notes, and stock up on supplies.",
    season: "winter",
    regions: ["Cool-Season"],
    category: "general",
  },

  // ── Winter / Transition Zone ──────────────────────────
  {
    id: "wi-trans-1",
    tip: "Have your pre-emergent herbicide ready — soil temps will hit 55 °F soon.",
    details:
      "Monitor soil temperature weekly starting in February. When forsythia starts blooming, it's time to apply.",
    season: "winter",
    regions: ["Transition Zone"],
    category: "pest-control",
  },
  {
    id: "wi-trans-2",
    tip: "Spot-spray active winter weeds on warm days (above 50 °F).",
    details:
      "Chickweed and henbit are actively growing in winter. A broadleaf herbicide works best when air temps exceed 50 °F.",
    season: "winter",
    regions: ["Transition Zone"],
    category: "pest-control",
    weatherTrigger: { condition: "hot", threshold: 50 },
  },
  {
    id: "wi-trans-3",
    tip: "Only water if there's been no rain for 3+ weeks.",
    details:
      "Dormant or semi-dormant grass needs very little moisture. Over-watering in winter promotes root rot and disease.",
    season: "winter",
    regions: ["Transition Zone"],
    category: "watering",
    weatherTrigger: { condition: "dry" },
  },

  // ── Winter / Warm-Season ──────────────────────────────
  {
    id: "wi-warm-1",
    tip: "Your warm-season grass is dormant — let it rest.",
    details:
      "No fertilizer, minimal water, and no mowing needed. The lawn will naturally green up when soil temps rise in spring.",
    season: "winter",
    regions: ["Warm-Season"],
    category: "general",
  },
  {
    id: "wi-warm-2",
    tip: "Plan to scalp your lawn in late winter to encourage spring green-up.",
    details:
      "Set your mower as low as possible to remove dead material. This lets sunlight reach the soil and warm it faster. Bag the clippings.",
    season: "winter",
    regions: ["Warm-Season"],
    category: "mowing",
  },
  {
    id: "wi-warm-3",
    tip: "Apply pre-emergent before soil temps consistently hit 55 °F.",
    details:
      "Split applications 6–8 weeks apart give the best crabgrass prevention. Timing varies by latitude — monitor soil temperature.",
    season: "winter",
    regions: ["Warm-Season"],
    category: "pest-control",
    weatherTrigger: { condition: "hot", threshold: 55 },
  },
  {
    id: "wi-warm-4",
    tip: "Control winter annual weeds that are actively growing in your dormant lawn.",
    details:
      "Annual bluegrass, chickweed, and clover thrive in dormant warm-season lawns. Apply post-emergent control while the lawn is brown.",
    season: "winter",
    regions: ["Warm-Season"],
    category: "pest-control",
  },

  // ── Cross-season / All regions ────────────────────────
  {
    id: "gen-1",
    tip: "Never mow wet grass — it clumps, clogs, and spreads disease.",
    details:
      "Wait until dew has dried or until an hour after rain. Wet clippings also compact on the surface, smothering the turf beneath.",
    season: "spring",
    regions: ["Cool-Season", "Transition Zone", "Warm-Season"],
    category: "mowing",
    weatherTrigger: { condition: "rainy" },
  },
  {
    id: "gen-2",
    tip: "Leave grass clippings on the lawn — they return up to 25 % of nitrogen.",
    details:
      "Grasscycling reduces fertilizer needs and doesn't contribute to thatch. Only bag clippings if they're excessively long or diseased.",
    season: "summer",
    regions: ["Cool-Season", "Transition Zone", "Warm-Season"],
    category: "general",
  },
  {
    id: "gen-3",
    tip: "Calibrate your spreader before applying any product.",
    details:
      "An uncalibrated spreader can apply 2–3× the intended rate, burning your lawn. Follow the product label's recommended spreader settings.",
    season: "spring",
    regions: ["Cool-Season", "Transition Zone", "Warm-Season"],
    category: "fertilizing",
  },
  {
    id: "gen-4",
    tip: "Avoid mowing during the hottest part of the day in summer.",
    details:
      "Mowing stresses grass — adding heat stress on top can be damaging. Early morning or late afternoon is best for both you and your lawn.",
    season: "summer",
    regions: ["Cool-Season", "Transition Zone", "Warm-Season"],
    category: "mowing",
    weatherTrigger: { condition: "hot", threshold: 90 },
  },
  {
    id: "gen-5",
    tip: "Wind over 15 mph? Skip the fertilizer and spray applications.",
    details:
      "Wind causes uneven distribution of granular products and spray drift of herbicides. Wait for a calm day for best results.",
    season: "spring",
    regions: ["Cool-Season", "Transition Zone", "Warm-Season"],
    category: "general",
    weatherTrigger: { condition: "windy" },
  },
];

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

/** Category display metadata */
export const CATEGORY_META: Record<
  SeasonalTip["category"],
  { label: string; emoji: string }
> = {
  mowing: { label: "Mowing", emoji: "✂️" },
  watering: { label: "Watering", emoji: "💧" },
  fertilizing: { label: "Fertilizing", emoji: "🌿" },
  maintenance: { label: "Maintenance", emoji: "🔧" },
  "pest-control": { label: "Pest Control", emoji: "🐛" },
  general: { label: "General", emoji: "📋" },
};

/** Season gradient backgrounds for tip cards */
export const SEASON_GRADIENTS: Record<SeasonalTip["season"], string> = {
  spring:
    "from-green-500/10 via-emerald-500/5 to-lime-500/10",
  summer:
    "from-amber-500/10 via-yellow-500/5 to-orange-500/10",
  fall:
    "from-orange-500/10 via-amber-500/5 to-red-500/10",
  winter:
    "from-blue-500/10 via-sky-500/5 to-indigo-500/10",
};
