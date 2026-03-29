import type { Lawn, LawnManager } from "@/types/multiLawn";
import { safeGetItem, safeSetItem } from "@/lib/safeStorage";

const STORAGE_KEY = "grasswise-lawns";

function generateId(): string {
  return `lawn-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
}

function defaultManager(): LawnManager {
  const mainLawn: Lawn = {
    id: generateId(),
    name: "Main Lawn",
    createdAt: new Date().toISOString(),
  };
  return { lawns: [mainLawn], activeLawnId: mainLawn.id };
}

export function loadLawns(): LawnManager {
  const stored = safeGetItem<LawnManager | null>(STORAGE_KEY, null);
  if (!stored || !Array.isArray(stored.lawns) || stored.lawns.length === 0) {
    const manager = defaultManager();
    saveLawns(manager);
    return manager;
  }
  // Ensure activeLawnId points to a valid lawn
  if (!stored.activeLawnId || !stored.lawns.some((l) => l.id === stored.activeLawnId)) {
    stored.activeLawnId = stored.lawns[0].id;
    saveLawns(stored);
  }
  return stored;
}

export function saveLawns(manager: LawnManager): void {
  safeSetItem(STORAGE_KEY, manager);
}

export function addLawn(lawn: Omit<Lawn, "id" | "createdAt">): Lawn {
  const manager = loadLawns();
  const newLawn: Lawn = {
    ...lawn,
    id: generateId(),
    createdAt: new Date().toISOString(),
  };
  manager.lawns.push(newLawn);
  if (!manager.activeLawnId) {
    manager.activeLawnId = newLawn.id;
  }
  saveLawns(manager);
  return newLawn;
}

export function updateLawn(id: string, updates: Partial<Lawn>): void {
  const manager = loadLawns();
  const idx = manager.lawns.findIndex((l) => l.id === id);
  if (idx === -1) return;
  manager.lawns[idx] = { ...manager.lawns[idx], ...updates, id };
  saveLawns(manager);
}

export function deleteLawn(id: string): void {
  const manager = loadLawns();
  manager.lawns = manager.lawns.filter((l) => l.id !== id);
  if (manager.lawns.length === 0) {
    const fallback = defaultManager();
    saveLawns(fallback);
    return;
  }
  if (manager.activeLawnId === id) {
    manager.activeLawnId = manager.lawns[0].id;
  }
  saveLawns(manager);
}

export function setActiveLawn(id: string): void {
  const manager = loadLawns();
  if (!manager.lawns.some((l) => l.id === id)) return;
  manager.activeLawnId = id;
  saveLawns(manager);
}

export function getActiveLawn(): Lawn | null {
  const manager = loadLawns();
  if (!manager.activeLawnId) return null;
  return manager.lawns.find((l) => l.id === manager.activeLawnId) ?? null;
}
