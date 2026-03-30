import { describe, it, expect, vi, beforeEach } from "vitest";
import {
  loadZones,
  addZone,
  deleteZone,
  updateZone,
  calcWeeklyGallons,
  type SprinklerZone,
  type DayOfWeek,
} from "@/lib/sprinklerManager";

beforeEach(() => {
  vi.stubGlobal("crypto", {
    randomUUID: () => "zone-uuid-" + Math.random().toString(36).slice(2, 9),
  });
});

function makeZone(
  overrides: Partial<Omit<SprinklerZone, "id">> = {},
): Omit<SprinklerZone, "id"> {
  return {
    name: "Test Zone",
    type: "rotor",
    areaSqFt: 2000,
    precipitationRate: 0.4,
    schedule: {
      days: ["mon", "wed", "fri"] as DayOfWeek[],
      startTime: "06:00",
      durationMinutes: 30,
    },
    ...overrides,
  };
}

describe("sprinklerManager", () => {
  describe("loadZones", () => {
    it("returns empty array when no data exists", () => {
      expect(loadZones()).toEqual([]);
    });
  });

  describe("addZone", () => {
    it("creates zone with generated id", () => {
      const result = addZone(makeZone());
      expect(result).toHaveLength(1);
      expect(result[0].id).toBeDefined();
      expect(result[0].name).toBe("Test Zone");
      expect(result[0].type).toBe("rotor");
    });

    it("appends new zones", () => {
      addZone(makeZone({ name: "Front Yard" }));
      const result = addZone(makeZone({ name: "Back Yard" }));
      expect(result).toHaveLength(2);
      expect(result[0].name).toBe("Front Yard");
      expect(result[1].name).toBe("Back Yard");
    });
  });

  describe("deleteZone", () => {
    it("removes zone by id", () => {
      const zones = addZone(makeZone());
      const id = zones[0].id;
      const result = deleteZone(id);
      expect(result).toHaveLength(0);
    });

    it("returns unchanged list when id not found", () => {
      addZone(makeZone());
      const result = deleteZone("nonexistent");
      expect(result).toHaveLength(1);
    });
  });

  describe("updateZone", () => {
    it("updates fields by id", () => {
      const zones = addZone(makeZone());
      const id = zones[0].id;
      const result = updateZone(id, { name: "Updated Zone", areaSqFt: 5000 });
      expect(result[0].name).toBe("Updated Zone");
      expect(result[0].areaSqFt).toBe(5000);
      expect(result[0].id).toBe(id);
    });

    it("does not change other zones", () => {
      addZone(makeZone({ name: "Zone A" }));
      const zones = addZone(makeZone({ name: "Zone B" }));
      const idB = zones[1].id;
      const result = updateZone(idB, { name: "Zone B Updated" });
      expect(result[0].name).toBe("Zone A");
      expect(result[1].name).toBe("Zone B Updated");
    });
  });

  describe("calcWeeklyGallons", () => {
    it("calculates correctly for a zone", () => {
      // 2000 sqft × 0.4 in/hr × (30/60 hr) × 0.623 gal × 3 days
      const zone: SprinklerZone = {
        id: "z1",
        ...makeZone(),
      };
      const expected = 2000 * 0.4 * (30 / 60) * 0.623 * 3;
      expect(calcWeeklyGallons(zone)).toBeCloseTo(expected, 2);
    });

    it("returns 0 for zone with 0 days selected", () => {
      const zone: SprinklerZone = {
        id: "z2",
        ...makeZone({
          schedule: { days: [], startTime: "06:00", durationMinutes: 30 },
        }),
      };
      expect(calcWeeklyGallons(zone)).toBe(0);
    });

    it("returns 0 for zone with 0 area", () => {
      const zone: SprinklerZone = {
        id: "z3",
        ...makeZone({ areaSqFt: 0 }),
      };
      expect(calcWeeklyGallons(zone)).toBe(0);
    });

    it("scales linearly with duration", () => {
      const zone30: SprinklerZone = { id: "z4", ...makeZone() };
      const zone60: SprinklerZone = {
        id: "z5",
        ...makeZone({
          schedule: {
            days: ["mon", "wed", "fri"],
            startTime: "06:00",
            durationMinutes: 60,
          },
        }),
      };
      expect(calcWeeklyGallons(zone60)).toBeCloseTo(
        calcWeeklyGallons(zone30) * 2,
        2,
      );
    });
  });
});
