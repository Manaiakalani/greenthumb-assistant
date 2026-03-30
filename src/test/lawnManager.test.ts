import { describe, it, expect } from "vitest";
import {
  loadLawns,
  addLawn,
  deleteLawn,
  setActiveLawn,
  getActiveLawn,
} from "@/lib/lawnManager";

describe("lawnManager", () => {
  describe("loadLawns", () => {
    it('creates default "Main Lawn" when empty', () => {
      const manager = loadLawns();
      expect(manager.lawns).toHaveLength(1);
      expect(manager.lawns[0].name).toBe("Main Lawn");
      expect(manager.activeLawnId).toBe(manager.lawns[0].id);
    });

    it("persists the default to localStorage", () => {
      const first = loadLawns();
      const second = loadLawns();
      expect(second.lawns[0].id).toBe(first.lawns[0].id);
    });
  });

  describe("addLawn", () => {
    it("adds a new lawn with generated id and createdAt", () => {
      loadLawns(); // ensure default exists
      const newLawn = addLawn({ name: "Back Yard", grassType: "Bermuda" });
      expect(newLawn.id).toBeDefined();
      expect(newLawn.name).toBe("Back Yard");
      expect(newLawn.createdAt).toBeDefined();

      const manager = loadLawns();
      expect(manager.lawns).toHaveLength(2);
    });

    it("does not change active lawn when one already exists", () => {
      const manager = loadLawns();
      const originalActive = manager.activeLawnId;
      addLawn({ name: "Side Yard" });
      const updated = loadLawns();
      expect(updated.activeLawnId).toBe(originalActive);
    });
  });

  describe("deleteLawn", () => {
    it("removes lawn by id", () => {
      const manager = loadLawns();
      const newLawn = addLawn({ name: "Temp Lawn" });
      deleteLawn(newLawn.id);
      const updated = loadLawns();
      expect(updated.lawns.find((l) => l.id === newLawn.id)).toBeUndefined();
    });

    it("creates fallback default when last lawn is deleted", () => {
      const manager = loadLawns();
      deleteLawn(manager.lawns[0].id);
      const updated = loadLawns();
      expect(updated.lawns).toHaveLength(1);
      expect(updated.lawns[0].name).toBe("Main Lawn");
    });

    it("reassigns active lawn when active is deleted", () => {
      loadLawns();
      const lawn2 = addLawn({ name: "Lawn 2" });
      setActiveLawn(lawn2.id);
      deleteLawn(lawn2.id);
      const updated = loadLawns();
      expect(updated.activeLawnId).toBe(updated.lawns[0].id);
    });
  });

  describe("setActiveLawn", () => {
    it("updates active lawn id", () => {
      loadLawns();
      const lawn2 = addLawn({ name: "Lawn 2" });
      setActiveLawn(lawn2.id);
      const manager = loadLawns();
      expect(manager.activeLawnId).toBe(lawn2.id);
    });

    it("does nothing for nonexistent id", () => {
      const manager = loadLawns();
      const originalActive = manager.activeLawnId;
      setActiveLawn("nonexistent-id");
      const updated = loadLawns();
      expect(updated.activeLawnId).toBe(originalActive);
    });
  });

  describe("getActiveLawn", () => {
    it("returns the correct active lawn", () => {
      loadLawns();
      const lawn2 = addLawn({ name: "Lawn 2", grassType: "Fescue" });
      setActiveLawn(lawn2.id);
      const active = getActiveLawn();
      expect(active).not.toBeNull();
      expect(active!.name).toBe("Lawn 2");
      expect(active!.grassType).toBe("Fescue");
    });

    it("returns the default lawn initially", () => {
      const active = getActiveLawn();
      expect(active).not.toBeNull();
      expect(active!.name).toBe("Main Lawn");
    });
  });
});
