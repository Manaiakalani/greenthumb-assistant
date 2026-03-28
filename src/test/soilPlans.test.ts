import { describe, it, expect } from "vitest";
import {
  getPlanForRegion,
  loadPlanProgress,
  savePlanProgress,
  CATEGORY_META,
  type PlanProgress,
} from "@/data/soilPlans";

describe("getPlanForRegion", () => {
  it("returns a plan for Cool-Season", () => {
    const plan = getPlanForRegion("Cool-Season");
    expect(plan.region).toBe("Cool-Season");
    expect(plan.year).toBe(new Date().getFullYear());
    expect(plan.applications.length).toBeGreaterThan(0);
    expect(plan.winterTips.length).toBeGreaterThan(0);
    expect(plan.summary).toBeTruthy();
  });

  it("returns a plan for Transition Zone", () => {
    const plan = getPlanForRegion("Transition Zone");
    expect(plan.region).toBe("Transition Zone");
    expect(plan.applications.length).toBeGreaterThan(0);
  });

  it("returns a plan for Warm-Season", () => {
    const plan = getPlanForRegion("Warm-Season");
    expect(plan.region).toBe("Warm-Season");
    expect(plan.applications.length).toBeGreaterThan(0);
  });

  it("all application IDs are unique within a plan", () => {
    for (const region of ["Cool-Season", "Transition Zone", "Warm-Season"] as const) {
      const plan = getPlanForRegion(region);
      const ids = plan.applications.map((a) => a.id);
      expect(new Set(ids).size).toBe(ids.length);
    }
  });

  it("all applications have valid month ranges", () => {
    for (const region of ["Cool-Season", "Transition Zone", "Warm-Season"] as const) {
      const plan = getPlanForRegion(region);
      for (const app of plan.applications) {
        expect(app.monthStart).toBeGreaterThanOrEqual(0);
        expect(app.monthStart).toBeLessThanOrEqual(11);
        expect(app.monthEnd).toBeGreaterThanOrEqual(0);
        expect(app.monthEnd).toBeLessThanOrEqual(11);
      }
    }
  });

  it("all applications have a valid category", () => {
    const validCategories = Object.keys(CATEGORY_META);
    for (const region of ["Cool-Season", "Transition Zone", "Warm-Season"] as const) {
      const plan = getPlanForRegion(region);
      for (const app of plan.applications) {
        expect(validCategories).toContain(app.category);
      }
    }
  });

  it("year is always current year", () => {
    const plan = getPlanForRegion("Cool-Season");
    expect(plan.year).toBe(new Date().getFullYear());
  });
});

describe("CATEGORY_META", () => {
  it("has metadata for all categories", () => {
    const categories = ["fertilizer", "weed-control", "seeding", "soil-amendment", "maintenance"];
    for (const cat of categories) {
      const meta = CATEGORY_META[cat as keyof typeof CATEGORY_META];
      expect(meta.emoji).toBeTruthy();
      expect(meta.color).toBeTruthy();
      expect(meta.bg).toBeTruthy();
    }
  });
});

describe("plan progress persistence", () => {
  it("loadPlanProgress returns empty when nothing saved", () => {
    const progress = loadPlanProgress();
    expect(progress.completed).toEqual({});
    expect(progress.year).toBe(new Date().getFullYear());
  });

  it("savePlanProgress + loadPlanProgress round-trips", () => {
    const progress: PlanProgress = {
      completed: { "cs-1": "2025-06-01T12:00:00Z", "cs-2": "2025-07-01T12:00:00Z" },
      year: new Date().getFullYear(),
    };
    savePlanProgress(progress);
    expect(loadPlanProgress()).toEqual(progress);
  });

  it("resets progress when year changes", () => {
    const progress: PlanProgress = {
      completed: { "cs-1": "2024-06-01T12:00:00Z" },
      year: 2024,
    };
    savePlanProgress(progress);
    const loaded = loadPlanProgress();
    // Should reset because saved year != current year
    expect(loaded.completed).toEqual({});
    expect(loaded.year).toBe(new Date().getFullYear());
  });
});
