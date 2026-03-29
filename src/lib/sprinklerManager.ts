import { safeGetItem, safeSetItem } from "@/lib/safeStorage";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export type SprinklerType = "rotor" | "spray" | "drip" | "soaker";

export type DayOfWeek = "mon" | "tue" | "wed" | "thu" | "fri" | "sat" | "sun";

export interface SprinklerZone {
  id: string;
  name: string;
  type: SprinklerType;
  areaSqFt: number;
  precipitationRate: number; // inches per hour
  schedule: {
    days: DayOfWeek[];
    startTime: string; // "06:00"
    durationMinutes: number;
  };
  notes?: string;
}

// ---------------------------------------------------------------------------
// Constants
// ---------------------------------------------------------------------------

const STORAGE_KEY = "grasswise-sprinkler-zones";

/** Default precipitation rates (inches/hour) by sprinkler type. */
export const DEFAULT_PRECIP_RATES: Record<SprinklerType, number> = {
  rotor: 0.4,
  spray: 1.5,
  drip: 0.5,
  soaker: 1.0,
};

// ---------------------------------------------------------------------------
// Persistence
// ---------------------------------------------------------------------------

/** Load all sprinkler zones from localStorage. */
export function loadZones(): SprinklerZone[] {
  return safeGetItem<SprinklerZone[]>(STORAGE_KEY, []);
}

/** Persist the full zones array. */
export function saveZones(zones: SprinklerZone[]): void {
  safeSetItem(STORAGE_KEY, zones);
}

// ---------------------------------------------------------------------------
// CRUD
// ---------------------------------------------------------------------------

/** Add a new zone and persist. Returns the updated list. */
export function addZone(zone: Omit<SprinklerZone, "id">): SprinklerZone[] {
  const zones = loadZones();
  const newZone: SprinklerZone = { ...zone, id: crypto.randomUUID() };
  zones.push(newZone);
  saveZones(zones);
  return zones;
}

/** Update a zone by id and persist. Returns the updated list. */
export function updateZone(
  id: string,
  updates: Partial<Omit<SprinklerZone, "id">>,
): SprinklerZone[] {
  const zones = loadZones();
  const idx = zones.findIndex((z) => z.id === id);
  if (idx !== -1) {
    zones[idx] = { ...zones[idx], ...updates, id };
  }
  saveZones(zones);
  return zones;
}

/** Delete a zone by id and persist. Returns the updated list. */
export function deleteZone(id: string): SprinklerZone[] {
  const zones = loadZones().filter((z) => z.id !== id);
  saveZones(zones);
  return zones;
}

// ---------------------------------------------------------------------------
// Calculations
// ---------------------------------------------------------------------------

/**
 * Calculate weekly water usage in gallons for a single zone.
 *
 * Formula: areaSqFt × precipitationRate × (durationMinutes / 60) × 0.623 × daysPerWeek
 * (0.623 gallons = water volume of 1 inch depth over 1 sq ft)
 */
export function calcWeeklyGallons(zone: SprinklerZone): number {
  const { areaSqFt, precipitationRate, schedule } = zone;
  const daysPerWeek = schedule.days.length;
  return (
    areaSqFt *
    precipitationRate *
    (schedule.durationMinutes / 60) *
    0.623 *
    daysPerWeek
  );
}

/** Total weekly gallons across all zones. */
export function calcTotalWeeklyGallons(zones: SprinklerZone[]): number {
  return zones.reduce((sum, z) => sum + calcWeeklyGallons(z), 0);
}
