import { describe, it, expect, vi, beforeEach } from "vitest";
import {
  loadCosts,
  addCost,
  deleteCost,
  getTotalSpend,
  getSpendByCategory,
  getCostsByMonth,
  type CostEntry,
} from "@/lib/costTracker";

// crypto.randomUUID is used internally
beforeEach(() => {
  vi.stubGlobal("crypto", {
    randomUUID: () => "test-uuid-" + Math.random().toString(36).slice(2, 9),
  });
});

function makeCostEntry(overrides: Partial<Omit<CostEntry, "id">> = {}): Omit<CostEntry, "id"> {
  return {
    date: "2025-03-15",
    category: "fertilizer",
    product: "Test Product",
    amount: 29.99,
    ...overrides,
  };
}

describe("costTracker", () => {
  describe("loadCosts", () => {
    it("returns empty array when no data exists", () => {
      expect(loadCosts()).toEqual([]);
    });
  });

  describe("addCost", () => {
    it("adds an entry and returns updated list with generated id", () => {
      const result = addCost(makeCostEntry());
      expect(result).toHaveLength(1);
      expect(result[0]).toMatchObject({
        date: "2025-03-15",
        category: "fertilizer",
        product: "Test Product",
        amount: 29.99,
      });
      expect(result[0].id).toBeDefined();
      expect(typeof result[0].id).toBe("string");
    });

    it("prepends new entries (most recent first)", () => {
      addCost(makeCostEntry({ product: "First" }));
      const result = addCost(makeCostEntry({ product: "Second" }));
      expect(result).toHaveLength(2);
      expect(result[0].product).toBe("Second");
      expect(result[1].product).toBe("First");
    });

    it("handles amount of 0", () => {
      const result = addCost(makeCostEntry({ amount: 0 }));
      expect(result[0].amount).toBe(0);
    });

    it("handles negative amount", () => {
      const result = addCost(makeCostEntry({ amount: -10 }));
      expect(result[0].amount).toBe(-10);
    });
  });

  describe("deleteCost", () => {
    it("removes entry by id", () => {
      const added = addCost(makeCostEntry());
      const id = added[0].id;
      const result = deleteCost(id);
      expect(result).toHaveLength(0);
    });

    it("returns unchanged list when id not found", () => {
      addCost(makeCostEntry());
      const result = deleteCost("nonexistent-id");
      expect(result).toHaveLength(1);
    });
  });

  describe("getTotalSpend", () => {
    it("sums amounts correctly", () => {
      const entries: CostEntry[] = [
        { id: "1", date: "2025-01-01", category: "fertilizer", product: "A", amount: 10 },
        { id: "2", date: "2025-01-02", category: "seed", product: "B", amount: 25.5 },
        { id: "3", date: "2025-01-03", category: "equipment", product: "C", amount: 100 },
      ];
      expect(getTotalSpend(entries)).toBe(135.5);
    });

    it("returns 0 for empty array", () => {
      expect(getTotalSpend([])).toBe(0);
    });
  });

  describe("getSpendByCategory", () => {
    it("groups spend by category correctly", () => {
      const entries: CostEntry[] = [
        { id: "1", date: "2025-01-01", category: "fertilizer", product: "A", amount: 10 },
        { id: "2", date: "2025-01-02", category: "fertilizer", product: "B", amount: 20 },
        { id: "3", date: "2025-01-03", category: "seed", product: "C", amount: 15 },
        { id: "4", date: "2025-01-04", category: "equipment", product: "D", amount: 50 },
      ];
      const result = getSpendByCategory(entries);
      expect(result.fertilizer).toBe(30);
      expect(result.seed).toBe(15);
      expect(result.equipment).toBe(50);
      expect(result.pesticide).toBe(0);
      expect(result.service).toBe(0);
      expect(result.other).toBe(0);
    });

    it("returns all zeros for empty array", () => {
      const result = getSpendByCategory([]);
      expect(Object.values(result).every((v) => v === 0)).toBe(true);
    });
  });

  describe("getCostsByMonth", () => {
    it("groups costs by month correctly", () => {
      const entries: CostEntry[] = [
        { id: "1", date: "2025-01-15", category: "fertilizer", product: "A", amount: 10 },
        { id: "2", date: "2025-01-20", category: "seed", product: "B", amount: 20 },
        { id: "3", date: "2025-03-10", category: "equipment", product: "C", amount: 50 },
      ];
      const result = getCostsByMonth(entries);
      expect(result["2025-01"]).toBe(30);
      expect(result["2025-03"]).toBe(50);
    });

    it("filters by year when provided", () => {
      const entries: CostEntry[] = [
        { id: "1", date: "2024-06-15", category: "fertilizer", product: "A", amount: 10 },
        { id: "2", date: "2025-06-15", category: "fertilizer", product: "B", amount: 20 },
      ];
      const result = getCostsByMonth(entries, 2025);
      expect(result["2025-06"]).toBe(20);
      expect(result["2024-06"]).toBeUndefined();
    });

    it("returns empty object for empty array", () => {
      expect(getCostsByMonth([])).toEqual({});
    });
  });
});
