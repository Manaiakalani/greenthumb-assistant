/** USDA Hardiness Zones commonly used for lawn care */
export const USDA_ZONES = [
  "1", "2", "3", "4", "5", "6", "7", "8", "9", "10", "11", "12", "13",
] as const;

export type USDAZone = (typeof USDA_ZONES)[number];

/** Climate region categories */
export const CLIMATE_REGIONS = [
  "Cool-Season",
  "Transition Zone",
  "Warm-Season",
] as const;

export type ClimateRegion = (typeof CLIMATE_REGIONS)[number];

/** Common grass types organized by climate */
export const GRASS_TYPES = {
  "Cool-Season": [
    "Kentucky Bluegrass",
    "Tall Fescue",
    "Fine Fescue",
    "Perennial Ryegrass",
  ],
  "Transition Zone": [
    "Tall Fescue",
    "Kentucky Bluegrass",
    "Zoysiagrass",
    "Bermudagrass",
  ],
  "Warm-Season": [
    "Bermudagrass",
    "Zoysiagrass",
    "St. Augustinegrass",
    "Centipedegrass",
    "Bahiagrass",
  ],
} as const;

export type GrassType = (typeof GRASS_TYPES)[ClimateRegion][number];

/** Lawn size categories */
export const LAWN_SIZES = ["Small", "Medium", "Large"] as const;

export type LawnSize = (typeof LAWN_SIZES)[number];

/** Complete user profile */
export interface UserProfile {
  name: string;
  zone: USDAZone;
  region: ClimateRegion;
  grassType: string;
  lawnSize: LawnSize;
  location: string;
  /** Saved from geolocation — used for weather lookups */
  latitude?: number;
  longitude?: number;
}

/** Default profile for new users */
export const DEFAULT_PROFILE: UserProfile = {
  name: "",
  zone: "7",
  region: "Transition Zone",
  grassType: "Tall Fescue",
  lawnSize: "Medium",
  location: "",
};

/**
 * Suggest a climate region based on USDA zone.
 * Zones 1–4 → Cool-Season, 5–7 → Transition Zone, 8–13 → Warm-Season.
 */
export function suggestRegion(zone: USDAZone): ClimateRegion {
  const num = parseInt(zone, 10);
  if (num <= 4) return "Cool-Season";
  if (num <= 7) return "Transition Zone";
  return "Warm-Season";
}
