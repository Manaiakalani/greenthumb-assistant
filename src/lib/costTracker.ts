import { safeGetItem, safeSetItem } from "@/lib/safeStorage";

export interface CostEntry {
  id: string;
  date: string; // ISO date
  category:
    | "fertilizer"
    | "seed"
    | "pesticide"
    | "equipment"
    | "service"
    | "other";
  product: string;
  amount: number; // dollars
  notes?: string;
}

const STORAGE_KEY = "grasswise-costs";

/** Load all cost entries from localStorage. */
export function loadCosts(): CostEntry[] {
  return safeGetItem<CostEntry[]>(STORAGE_KEY, []);
}

/** Persist the full cost entries array. */
export function saveCosts(entries: CostEntry[]): void {
  safeSetItem(STORAGE_KEY, entries);
}

/** Add a new cost entry and persist. Returns the updated list. */
export function addCost(
  entry: Omit<CostEntry, "id">,
): CostEntry[] {
  const entries = loadCosts();
  const newEntry: CostEntry = { ...entry, id: crypto.randomUUID() };
  entries.unshift(newEntry);
  saveCosts(entries);
  return entries;
}

/** Delete a cost entry by id and persist. Returns the updated list. */
export function deleteCost(id: string): CostEntry[] {
  const entries = loadCosts().filter((e) => e.id !== id);
  saveCosts(entries);
  return entries;
}

/**
 * Group costs by month, returning a map of "YYYY-MM" → total spend.
 * Optionally filter to a specific year.
 */
export function getCostsByMonth(
  entries: CostEntry[],
  year?: number,
): Record<string, number> {
  const result: Record<string, number> = {};
  for (const e of entries) {
    const d = new Date(e.date);
    if (year !== undefined && d.getFullYear() !== year) continue;
    const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
    result[key] = (result[key] ?? 0) + e.amount;
  }
  return result;
}

/** Sum the total spend of the given entries. */
export function getTotalSpend(entries: CostEntry[]): number {
  return entries.reduce((sum, e) => sum + e.amount, 0);
}

/** Break down spend by category. */
export function getSpendByCategory(
  entries: CostEntry[],
): Record<CostEntry["category"], number> {
  const result: Record<string, number> = {
    fertilizer: 0,
    seed: 0,
    pesticide: 0,
    equipment: 0,
    service: 0,
    other: 0,
  };
  for (const e of entries) {
    result[e.category] = (result[e.category] ?? 0) + e.amount;
  }
  return result as Record<CostEntry["category"], number>;
}
