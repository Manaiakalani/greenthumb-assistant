export interface SeasonalHeight {
  min: number;
  max: number;
  ideal: number;
}

export interface MowingHeight {
  grassType: string;
  spring: SeasonalHeight;
  summer: SeasonalHeight;
  fall: SeasonalHeight;
  winter: SeasonalHeight | null;
  notes: string;
  mowFrequency: string;
}

export const mowingHeights: MowingHeight[] = [
  {
    grassType: "Kentucky Bluegrass",
    spring: { min: 2.5, max: 3.5, ideal: 3.0 },
    summer: { min: 3.0, max: 4.0, ideal: 3.5 },
    fall: { min: 2.5, max: 3.5, ideal: 3.0 },
    winter: null,
    notes: "Never cut more than 1/3 of blade height. Raise height in summer heat to protect roots.",
    mowFrequency: "Every 5–7 days in active growth",
  },
  {
    grassType: "Tall Fescue",
    spring: { min: 3.0, max: 4.0, ideal: 3.5 },
    summer: { min: 3.5, max: 4.5, ideal: 4.0 },
    fall: { min: 3.0, max: 4.0, ideal: 3.5 },
    winter: null,
    notes: "Never cut more than 1/3 of blade height. Taller mowing in summer reduces drought stress.",
    mowFrequency: "Every 5–7 days in active growth",
  },
  {
    grassType: "Perennial Ryegrass",
    spring: { min: 2.0, max: 3.0, ideal: 2.5 },
    summer: { min: 2.5, max: 3.5, ideal: 3.0 },
    fall: { min: 2.0, max: 3.0, ideal: 2.5 },
    winter: null,
    notes: "Never cut more than 1/3 of blade height. Mow frequently for a clean, manicured look.",
    mowFrequency: "Every 4–7 days in active growth",
  },
  {
    grassType: "Fine Fescue",
    spring: { min: 2.5, max: 3.5, ideal: 3.0 },
    summer: { min: 3.0, max: 4.0, ideal: 3.5 },
    fall: { min: 2.5, max: 3.5, ideal: 3.0 },
    winter: null,
    notes: "Never cut more than 1/3 of blade height. Tolerates infrequent mowing in low-maintenance settings.",
    mowFrequency: "Every 7–10 days in active growth",
  },
  {
    grassType: "Bermudagrass",
    spring: { min: 0.5, max: 1.5, ideal: 1.0 },
    summer: { min: 0.5, max: 2.0, ideal: 1.5 },
    fall: { min: 1.0, max: 2.0, ideal: 1.5 },
    winter: null,
    notes: "Never cut more than 1/3 of blade height. Keep low for a dense, carpet-like lawn.",
    mowFrequency: "Every 3–5 days in peak summer growth",
  },
  {
    grassType: "Zoysiagrass",
    spring: { min: 1.0, max: 2.0, ideal: 1.5 },
    summer: { min: 1.0, max: 2.5, ideal: 2.0 },
    fall: { min: 1.0, max: 2.0, ideal: 1.5 },
    winter: null,
    notes: "Never cut more than 1/3 of blade height. Slow growth means less frequent mowing.",
    mowFrequency: "Every 7–10 days in active growth",
  },
  {
    grassType: "St. Augustinegrass",
    spring: { min: 2.5, max: 3.5, ideal: 3.0 },
    summer: { min: 3.0, max: 4.0, ideal: 3.5 },
    fall: { min: 2.5, max: 3.5, ideal: 3.0 },
    winter: null,
    notes: "Never cut more than 1/3 of blade height. Scalping encourages weeds and chinch bug damage.",
    mowFrequency: "Every 5–7 days in active growth",
  },
  {
    grassType: "Centipedegrass",
    spring: { min: 1.0, max: 2.0, ideal: 1.5 },
    summer: { min: 1.5, max: 2.5, ideal: 2.0 },
    fall: { min: 1.0, max: 2.0, ideal: 1.5 },
    winter: null,
    notes: "Never cut more than 1/3 of blade height. Prefers low maintenance — avoid over-fertilizing.",
    mowFrequency: "Every 7–14 days in active growth",
  },
  {
    grassType: "Buffalograss",
    spring: { min: 2.0, max: 3.0, ideal: 2.5 },
    summer: { min: 2.5, max: 4.0, ideal: 3.0 },
    fall: { min: 2.0, max: 3.0, ideal: 2.5 },
    winter: null,
    notes: "Never cut more than 1/3 of blade height. Very drought-tolerant — can go unmowed for a natural look.",
    mowFrequency: "Every 10–14 days or as needed",
  },
  {
    grassType: "Bahiagrass",
    spring: { min: 3.0, max: 4.0, ideal: 3.5 },
    summer: { min: 3.0, max: 4.0, ideal: 3.5 },
    fall: { min: 3.0, max: 4.0, ideal: 3.5 },
    winter: null,
    notes: "Never cut more than 1/3 of blade height. Seed heads grow tall quickly — mow often to control them.",
    mowFrequency: "Every 7–10 days in active growth",
  },
];

/** Look up mowing height data by grass type name. */
export function getMowingHeight(grassType: string): MowingHeight | undefined {
  return mowingHeights.find(
    (h) => h.grassType.toLowerCase() === grassType.toLowerCase(),
  );
}
