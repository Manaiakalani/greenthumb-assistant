import { describe, it, expect } from "vitest";
import {
  checkAchievements,
  loadEarned,
  saveEarned,
  earnAchievement,
  isEarned,
  ACHIEVEMENTS,
} from "@/lib/achievements";
import type { JournalEntry, PhotoEntry } from "@/types/journal";
import type { UserProfile } from "@/types/profile";
import { DEFAULT_PROFILE } from "@/types/profile";

function makeEntry(
  overrides: Partial<JournalEntry> & { date: string; activity: JournalEntry["activity"] },
): JournalEntry {
  return {
    id: crypto.randomUUID(),
    notes: "",
    createdAt: Date.now(),
    ...overrides,
  };
}

function makePhoto(date: string): PhotoEntry {
  return { id: crypto.randomUUID(), date, photo: "", note: "", createdAt: Date.now() };
}

const fullProfile: UserProfile = {
  name: "Jane",
  zone: "7",
  region: "Transition Zone",
  grassType: "Tall Fescue",
  lawnSize: "Medium",
  location: "Raleigh, NC",
  latitude: 35.78,
  longitude: -78.64,
};

describe("achievements persistence", () => {
  it("loadEarned returns empty array when nothing saved", () => {
    expect(loadEarned()).toEqual([]);
  });

  it("saveEarned + loadEarned round-trips", () => {
    const data = [{ id: "test", earnedAt: 123 }];
    saveEarned(data);
    expect(loadEarned()).toEqual(data);
  });

  it("earnAchievement adds new achievement and returns true", () => {
    expect(earnAchievement("streak-3")).toBe(true);
    expect(isEarned("streak-3")).toBe(true);
  });

  it("earnAchievement returns false for duplicate", () => {
    earnAchievement("streak-3");
    expect(earnAchievement("streak-3")).toBe(false);
  });
});

describe("checkAchievements", () => {
  const baseContext = {
    journal: [] as JournalEntry[],
    photos: [] as PhotoEntry[],
    profile: { ...DEFAULT_PROFILE },
  };

  it("returns empty when no activity", () => {
    const earned = checkAchievements(baseContext);
    expect(earned).toEqual([]);
  });

  it("earns first-log with 1 journal entry", () => {
    const earned = checkAchievements({
      ...baseContext,
      journal: [makeEntry({ date: "2025-06-01", activity: "mow" })],
    });
    expect(earned).toContain("first-log");
  });

  it("earns ten-logs with 10 entries", () => {
    const journal = Array.from({ length: 10 }, (_, i) =>
      makeEntry({ date: `2025-06-${String(i + 1).padStart(2, "0")}`, activity: "water" }),
    );
    const earned = checkAchievements({ ...baseContext, journal });
    expect(earned).toContain("ten-logs");
    expect(earned).toContain("first-log");
  });

  it("earns first-photo with 1 photo", () => {
    const earned = checkAchievements({
      ...baseContext,
      photos: [makePhoto("2025-06-01")],
    });
    expect(earned).toContain("first-photo");
  });

  it("earns profile-complete when all fields set", () => {
    const earned = checkAchievements({ ...baseContext, profile: fullProfile });
    expect(earned).toContain("profile-complete");
  });

  it("does NOT earn profile-complete with missing fields", () => {
    const earned = checkAchievements({
      ...baseContext,
      profile: { ...fullProfile, name: "" },
    });
    expect(earned).not.toContain("profile-complete");
  });

  it("earns card-generated", () => {
    const earned = checkAchievements({ ...baseContext, cardGenerated: true });
    expect(earned).toContain("card-generated");
  });

  it("earns dark-mode", () => {
    const earned = checkAchievements({ ...baseContext, darkMode: true });
    expect(earned).toContain("dark-mode");
  });

  it("earns location-detect", () => {
    const earned = checkAchievements({ ...baseContext, locationDetected: true });
    expect(earned).toContain("location-detect");
  });

  it("does not duplicate achievements across calls", () => {
    const ctx = {
      ...baseContext,
      journal: [makeEntry({ date: "2025-06-01", activity: "mow" })],
    };
    const first = checkAchievements(ctx);
    const second = checkAchievements(ctx);
    expect(first).toContain("first-log");
    expect(second).not.toContain("first-log"); // already earned
  });

  // Seasonal — entry date-based
  it("earns first-mow for spring entry (March)", () => {
    const earned = checkAchievements({
      ...baseContext,
      journal: [makeEntry({ date: "2025-03-15", activity: "mow" })],
    });
    expect(earned).toContain("first-mow");
  });

  it("does NOT earn first-mow for summer mow (July)", () => {
    const earned = checkAchievements({
      ...baseContext,
      journal: [makeEntry({ date: "2025-07-15", activity: "mow" })],
    });
    expect(earned).not.toContain("first-mow");
  });

  it("earns winter-survivor for December entry", () => {
    const earned = checkAchievements({
      ...baseContext,
      journal: [makeEntry({ date: "2025-12-15", activity: "water" })],
    });
    expect(earned).toContain("winter-survivor");
  });

  it("earns winter-survivor for January entry", () => {
    const earned = checkAchievements({
      ...baseContext,
      journal: [makeEntry({ date: "2025-01-10", activity: "other" })],
    });
    expect(earned).toContain("winter-survivor");
  });

  it("earns summer-warrior for watering in June", () => {
    const earned = checkAchievements({
      ...baseContext,
      journal: [makeEntry({ date: "2025-06-20", activity: "water" })],
    });
    expect(earned).toContain("summer-warrior");
  });

  it("earns fall-prep for seeding in September", () => {
    const earned = checkAchievements({
      ...baseContext,
      journal: [makeEntry({ date: "2025-09-10", activity: "seed" })],
    });
    expect(earned).toContain("fall-prep");
  });

  it("earns fall-prep for aerating in October", () => {
    const earned = checkAchievements({
      ...baseContext,
      journal: [makeEntry({ date: "2025-10-05", activity: "aerate" })],
    });
    expect(earned).toContain("fall-prep");
  });
});

describe("ACHIEVEMENTS constant", () => {
  it("has 17 achievements", () => {
    expect(ACHIEVEMENTS).toHaveLength(17);
  });

  it("all IDs are unique", () => {
    const ids = ACHIEVEMENTS.map((a) => a.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it("every achievement has required fields", () => {
    for (const a of ACHIEVEMENTS) {
      expect(a.id).toBeTruthy();
      expect(a.title).toBeTruthy();
      expect(a.emoji).toBeTruthy();
      expect(["milestone", "streak", "seasonal", "explorer"]).toContain(a.category);
    }
  });
});
