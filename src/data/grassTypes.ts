export interface GrassTypeInfo {
  name: string;
  season: "cool" | "warm";
  zones: string[];
  traits: {
    heatTolerance: 1 | 2 | 3 | 4 | 5;
    coldTolerance: 1 | 2 | 3 | 4 | 5;
    shadeTolerance: 1 | 2 | 3 | 4 | 5;
    droughtTolerance: 1 | 2 | 3 | 4 | 5;
    trafficTolerance: 1 | 2 | 3 | 4 | 5;
    maintenance: 1 | 2 | 3 | 4 | 5;
  };
  appearance: string;
  bestFor: string;
  establishment: "seed" | "sod" | "both";
  mowHeight: string;
  waterNeeds: string;
}

export const grassTypes: GrassTypeInfo[] = [
  {
    name: "Kentucky Bluegrass",
    season: "cool",
    zones: ["3", "4", "5", "6", "7"],
    traits: {
      heatTolerance: 2,
      coldTolerance: 5,
      shadeTolerance: 2,
      droughtTolerance: 2,
      trafficTolerance: 4,
      maintenance: 4,
    },
    appearance:
      "Dense, fine-textured with a rich dark-green color and soft feel underfoot.",
    bestFor:
      "Premium front lawns in cool climates where a classic, manicured look is desired.",
    establishment: "both",
    mowHeight: "2.5–3.5 inches",
    waterNeeds: "1–1.5 inches per week; moderate to high.",
  },
  {
    name: "Tall Fescue",
    season: "cool",
    zones: ["4", "5", "6", "7", "8"],
    traits: {
      heatTolerance: 4,
      coldTolerance: 4,
      shadeTolerance: 3,
      droughtTolerance: 4,
      trafficTolerance: 4,
      maintenance: 2,
    },
    appearance:
      "Medium-coarse texture with a deep green color; bunch-type growth habit.",
    bestFor:
      "Transition-zone lawns needing heat and drought resilience with lower maintenance.",
    establishment: "seed",
    mowHeight: "3.0–4.0 inches",
    waterNeeds: "1 inch per week; moderate.",
  },
  {
    name: "Perennial Ryegrass",
    season: "cool",
    zones: ["3", "4", "5", "6", "7"],
    traits: {
      heatTolerance: 2,
      coldTolerance: 4,
      shadeTolerance: 2,
      droughtTolerance: 2,
      trafficTolerance: 5,
      maintenance: 3,
    },
    appearance:
      "Fine-textured, glossy dark-green blades with a bright, manicured finish.",
    bestFor:
      "Sports fields, high-traffic areas, and quick overseeding of warm-season lawns.",
    establishment: "seed",
    mowHeight: "2.0–3.0 inches",
    waterNeeds: "1–1.25 inches per week; moderate to high.",
  },
  {
    name: "Fine Fescue",
    season: "cool",
    zones: ["2", "3", "4", "5", "6", "7"],
    traits: {
      heatTolerance: 1,
      coldTolerance: 5,
      shadeTolerance: 5,
      droughtTolerance: 3,
      trafficTolerance: 2,
      maintenance: 1,
    },
    appearance:
      "Very fine, needle-like blades creating a soft, wispy texture in lighter green shades.",
    bestFor:
      "Shady areas, low-maintenance naturalized lawns, and eco-friendly landscapes.",
    establishment: "seed",
    mowHeight: "2.5–3.5 inches",
    waterNeeds: "0.75–1 inch per week; low to moderate.",
  },
  {
    name: "Bermudagrass",
    season: "warm",
    zones: ["7", "8", "9", "10", "11"],
    traits: {
      heatTolerance: 5,
      coldTolerance: 1,
      shadeTolerance: 1,
      droughtTolerance: 4,
      trafficTolerance: 5,
      maintenance: 5,
    },
    appearance:
      "Dense, fine-textured with a vibrant medium-green color; aggressive spreading.",
    bestFor:
      "Full-sun lawns in warm climates, sports fields, and high-traffic areas.",
    establishment: "both",
    mowHeight: "0.5–2.0 inches",
    waterNeeds: "1–1.25 inches per week; moderate.",
  },
  {
    name: "Zoysiagrass",
    season: "warm",
    zones: ["6", "7", "8", "9", "10"],
    traits: {
      heatTolerance: 5,
      coldTolerance: 3,
      shadeTolerance: 3,
      droughtTolerance: 4,
      trafficTolerance: 4,
      maintenance: 3,
    },
    appearance:
      "Dense, carpet-like turf with medium texture and a dark emerald-green color.",
    bestFor:
      "Transition-zone and warm-season lawns wanting a thick, weed-resistant turf.",
    establishment: "sod",
    mowHeight: "1.0–2.5 inches",
    waterNeeds: "0.75–1 inch per week; low to moderate.",
  },
  {
    name: "St. Augustinegrass",
    season: "warm",
    zones: ["8", "9", "10", "11"],
    traits: {
      heatTolerance: 5,
      coldTolerance: 1,
      shadeTolerance: 4,
      droughtTolerance: 2,
      trafficTolerance: 2,
      maintenance: 4,
    },
    appearance:
      "Coarse, broad-bladed grass with a lush blue-green color and thick canopy.",
    bestFor:
      "Coastal and southern lawns with partial shade; thrives in humid climates.",
    establishment: "sod",
    mowHeight: "2.5–4.0 inches",
    waterNeeds: "1.25–1.5 inches per week; high.",
  },
  {
    name: "Centipedegrass",
    season: "warm",
    zones: ["7", "8", "9", "10"],
    traits: {
      heatTolerance: 4,
      coldTolerance: 2,
      shadeTolerance: 3,
      droughtTolerance: 3,
      trafficTolerance: 1,
      maintenance: 1,
    },
    appearance:
      "Medium-textured, apple-green blades with a naturally slow, low-growing habit.",
    bestFor:
      "Low-maintenance warm-season lawns in acidic soils; ideal for homeowners wanting minimal care.",
    establishment: "seed",
    mowHeight: "1.0–2.5 inches",
    waterNeeds: "0.75–1 inch per week; low.",
  },
  {
    name: "Buffalograss",
    season: "warm",
    zones: ["5", "6", "7", "8", "9"],
    traits: {
      heatTolerance: 5,
      coldTolerance: 4,
      shadeTolerance: 1,
      droughtTolerance: 5,
      trafficTolerance: 2,
      maintenance: 1,
    },
    appearance:
      "Fine-textured, curling blue-green to gray-green blades with a natural prairie look.",
    bestFor:
      "Drought-prone areas and native-style lawns requiring minimal irrigation or input.",
    establishment: "both",
    mowHeight: "2.0–4.0 inches",
    waterNeeds: "0.25–0.5 inches per week; very low.",
  },
  {
    name: "Bahiagrass",
    season: "warm",
    zones: ["8", "9", "10", "11"],
    traits: {
      heatTolerance: 5,
      coldTolerance: 1,
      shadeTolerance: 2,
      droughtTolerance: 4,
      trafficTolerance: 3,
      maintenance: 2,
    },
    appearance:
      "Coarse-textured with light green blades; open growth habit with visible stolons.",
    bestFor:
      "Sandy soils in the deep South; utility lawns, roadsides, and large rural properties.",
    establishment: "seed",
    mowHeight: "3.0–4.0 inches",
    waterNeeds: "0.75–1 inch per week; low to moderate.",
  },
];

/** Look up a grass type by name (case-insensitive). */
export function getGrassType(name: string): GrassTypeInfo | undefined {
  return grassTypes.find(
    (g) => g.name.toLowerCase() === name.toLowerCase(),
  );
}

/** Return grass types suitable for a given USDA zone. */
export function getGrassTypesForZone(zone: string): GrassTypeInfo[] {
  return grassTypes.filter((g) => g.zones.includes(zone));
}

export const TRAIT_LABELS: Record<keyof GrassTypeInfo["traits"], string> = {
  heatTolerance: "Heat Tolerance",
  coldTolerance: "Cold Tolerance",
  shadeTolerance: "Shade Tolerance",
  droughtTolerance: "Drought Tolerance",
  trafficTolerance: "Traffic Tolerance",
  maintenance: "Maintenance",
};
