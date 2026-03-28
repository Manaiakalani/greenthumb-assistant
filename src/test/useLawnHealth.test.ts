import { describe, it, expect } from "vitest";
import { useLawnHealth } from "@/hooks/useLawnHealth";
import type { JournalEntry, PhotoEntry, EarnedAchievement } from "@/types/journal";
import { DEFAULT_PROFILE } from "@/types/profile";

function makeEntry(date: string, activity: JournalEntry["activity"] = "mow"): JournalEntry {
  return { id: crypto.randomUUID(), date, activity, notes: "", createdAt: Date.now() };
}

function makePhoto(date: string): PhotoEntry {
  return { id: crypto.randomUUID(), date, photo: "", note: "", createdAt: Date.now() };
}

function makeAchievement(id: string): EarnedAchievement {
  return { id, earnedAt: Date.now() };
}

const today = new Date().toISOString().split("T")[0];
const yesterday = new Date(Date.now() - 86_400_000).toISOString().split("T")[0];

describe("useLawnHealth", () => {
  it("returns F grade with no data", () => {
    const result = useLawnHealth(DEFAULT_PROFILE, [], [], []);
    expect(result.score).toBeLessThanOrEqual(25); // only profile points from defaults
    expect(result.grade).toBe("F");
    expect(result.label).toBe("Getting Started");
    expect(result.tips.length).toBeGreaterThan(0);
  });

  it("score increases with recent entries", () => {
    const base = useLawnHealth(DEFAULT_PROFILE, [], [], []);
    const entries = [makeEntry(today), makeEntry(yesterday)];
    const withEntries = useLawnHealth(DEFAULT_PROFILE, entries, [], []);
    expect(withEntries.score).toBeGreaterThan(base.score);
  });

  it("variety score increases with different activity types", () => {
    const sameType = Array.from({ length: 5 }, (_, i) => {
      const d = new Date(Date.now() - i * 86_400_000).toISOString().split("T")[0];
      return makeEntry(d, "mow");
    });
    const varied = [
      makeEntry(today, "mow"),
      makeEntry(yesterday, "water"),
      makeEntry(new Date(Date.now() - 2 * 86_400_000).toISOString().split("T")[0], "fertilize"),
      makeEntry(new Date(Date.now() - 3 * 86_400_000).toISOString().split("T")[0], "weed"),
      makeEntry(new Date(Date.now() - 4 * 86_400_000).toISOString().split("T")[0], "seed"),
    ];

    const sameResult = useLawnHealth(DEFAULT_PROFILE, sameType, [], []);
    const variedResult = useLawnHealth(DEFAULT_PROFILE, varied, [], []);
    expect(variedResult.breakdown.variety).toBeGreaterThan(sameResult.breakdown.variety);
  });

  it("engagement increases with photos and achievements", () => {
    const base = useLawnHealth(DEFAULT_PROFILE, [], [], []);
    const photos = Array.from({ length: 5 }, (_, i) => makePhoto(`2025-06-${i + 1}`));
    const achievements = Array.from({ length: 3 }, (_, i) => makeAchievement(`ach-${i}`));
    const enriched = useLawnHealth(DEFAULT_PROFILE, [], photos, achievements);
    expect(enriched.breakdown.engagement).toBeGreaterThan(base.breakdown.engagement);
  });

  it("profile completeness earns engagement points", () => {
    const incomplete = useLawnHealth({ ...DEFAULT_PROFILE, name: "" }, [], [], []);
    const complete = useLawnHealth(
      { ...DEFAULT_PROFILE, name: "Test", location: "Here", zone: "7", grassType: "Bermuda" },
      [], [], [],
    );
    expect(complete.breakdown.engagement).toBeGreaterThan(incomplete.breakdown.engagement);
  });

  it("score is capped at 100", () => {
    // Build tons of data to try to exceed 100
    const entries: JournalEntry[] = [];
    for (let i = 0; i < 60; i++) {
      const d = new Date(Date.now() - i * 86_400_000).toISOString().split("T")[0];
      entries.push(makeEntry(d, "mow"));
      entries.push(makeEntry(d, "water"));
      entries.push(makeEntry(d, "fertilize"));
    }
    const photos = Array.from({ length: 20 }, (_, i) => makePhoto(`2025-01-${i + 1}`));
    const achievements = Array.from({ length: 10 }, (_, i) => makeAchievement(`a-${i}`));
    const profile = { ...DEFAULT_PROFILE, name: "X", location: "Y", zone: "7" as const, grassType: "Z" };

    const result = useLawnHealth(profile, entries, photos, achievements);
    expect(result.score).toBeLessThanOrEqual(100);
  });

  it("returns correct breakdown structure", () => {
    const result = useLawnHealth(DEFAULT_PROFILE, [], [], []);
    expect(result.breakdown).toHaveProperty("consistency");
    expect(result.breakdown).toHaveProperty("variety");
    expect(result.breakdown).toHaveProperty("recency");
    expect(result.breakdown).toHaveProperty("engagement");
    expect(result.breakdown.consistency).toBeGreaterThanOrEqual(0);
    expect(result.breakdown.consistency).toBeLessThanOrEqual(30);
    expect(result.breakdown.variety).toBeGreaterThanOrEqual(0);
    expect(result.breakdown.variety).toBeLessThanOrEqual(20);
    expect(result.breakdown.recency).toBeGreaterThanOrEqual(0);
    expect(result.breakdown.recency).toBeLessThanOrEqual(25);
    expect(result.breakdown.engagement).toBeGreaterThanOrEqual(0);
    expect(result.breakdown.engagement).toBeLessThanOrEqual(25);
  });

  it("grades map to correct ranges", () => {
    // A+ >= 90
    const r = useLawnHealth(DEFAULT_PROFILE, [], [], []);
    const gradeMap: Record<string, [number, number]> = {
      "A+": [90, 100],
      A: [80, 89],
      B: [70, 79],
      C: [55, 69],
      D: [40, 54],
      F: [0, 39],
    };
    const [min, max] = gradeMap[r.grade] ?? [0, 100];
    expect(r.score).toBeGreaterThanOrEqual(min);
    expect(r.score).toBeLessThanOrEqual(max);
  });
});
