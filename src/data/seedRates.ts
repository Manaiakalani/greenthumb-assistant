export interface SeedRate {
  grassType: string;
  newLawn: number;
  overseeding: number;
  germinationDays: { min: number; max: number };
  bestSeason: string;
  notes: string;
}

export const seedRates: SeedRate[] = [
  {
    grassType: "Kentucky Bluegrass",
    newLawn: 2,
    overseeding: 1,
    germinationDays: { min: 14, max: 30 },
    bestSeason: "Late summer to early fall (Aug–Sep)",
    notes: "Slow to establish — keep seed moist for 3–4 weeks. Blends well with perennial ryegrass for faster fill-in.",
  },
  {
    grassType: "Tall Fescue",
    newLawn: 8,
    overseeding: 4,
    germinationDays: { min: 7, max: 14 },
    bestSeason: "Early fall (Sep–Oct)",
    notes: "Bunch-type grass — overseed regularly to maintain density. Heat- and drought-tolerant once established.",
  },
  {
    grassType: "Perennial Ryegrass",
    newLawn: 8,
    overseeding: 4,
    germinationDays: { min: 5, max: 10 },
    bestSeason: "Early fall (Sep–Oct) or early spring (Mar–Apr)",
    notes: "Fastest germination of cool-season grasses. Excellent for quick repairs and winter overseeding of warm-season lawns.",
  },
  {
    grassType: "Fine Fescue",
    newLawn: 5,
    overseeding: 3,
    germinationDays: { min: 7, max: 14 },
    bestSeason: "Early fall (Sep–Oct)",
    notes: "Thrives in shade and low-fertility soils. Includes creeping red fescue, chewings fescue, and hard fescue varieties.",
  },
  {
    grassType: "Bermudagrass",
    newLawn: 2,
    overseeding: 1,
    germinationDays: { min: 7, max: 21 },
    bestSeason: "Late spring to early summer (May–Jun)",
    notes: "Requires warm soil (65°F+) for germination. Hulled seed germinates faster than unhulled. Often established from sod or sprigs.",
  },
  {
    grassType: "Zoysiagrass",
    newLawn: 2,
    overseeding: 1,
    germinationDays: { min: 14, max: 21 },
    bestSeason: "Late spring to early summer (May–Jun)",
    notes: "Very slow to establish from seed — most homeowners use sod or plugs. Patience is key.",
  },
  {
    grassType: "St. Augustinegrass",
    newLawn: 0,
    overseeding: 0,
    germinationDays: { min: 0, max: 0 },
    bestSeason: "Late spring to summer (May–Jul)",
    notes: "Not available from seed commercially — must be established from sod, plugs, or stolons.",
  },
  {
    grassType: "Centipedegrass",
    newLawn: 1,
    overseeding: 0.5,
    germinationDays: { min: 14, max: 28 },
    bestSeason: "Late spring to early summer (May–Jun)",
    notes: "Slow to germinate and fill in. Prefers acidic soil (pH 5.0–6.0). Low maintenance once established.",
  },
  {
    grassType: "Buffalograss",
    newLawn: 3,
    overseeding: 1.5,
    germinationDays: { min: 14, max: 30 },
    bestSeason: "Late spring (May–Jun)",
    notes: "Treated (de-burred) seed germinates faster. Extremely drought-tolerant once established. Native grass.",
  },
  {
    grassType: "Bahiagrass",
    newLawn: 8,
    overseeding: 4,
    germinationDays: { min: 14, max: 28 },
    bestSeason: "Late spring to early summer (May–Jul)",
    notes: "Slow to establish but very durable once mature. Tolerates sandy, acidic soils well. Produces tall seed heads.",
  },
];

/** Look up seed rate data by grass type name. */
export function getSeedRate(grassType: string): SeedRate | undefined {
  return seedRates.find(
    (r) => r.grassType.toLowerCase() === grassType.toLowerCase(),
  );
}
