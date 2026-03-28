import { describe, it, expect } from "vitest";
import {
  loadJournal,
  saveJournal,
  addJournalEntry,
  deleteJournalEntry,
  loadPhotos,
  savePhotos,
  addPhoto,
  deletePhoto,
  calculateStreak,
  loadWeeklyGoals,
  saveWeeklyGoals,
  getWeeklyProgress,
  getWeekStart,
} from "@/lib/journal";
import type { JournalEntry } from "@/types/journal";

describe("journal CRUD", () => {
  it("loadJournal returns empty array when empty", () => {
    expect(loadJournal()).toEqual([]);
  });

  it("addJournalEntry creates an entry with id and createdAt", () => {
    const entry = addJournalEntry({
      date: "2025-06-01",
      activity: "mow",
      notes: "First mow!",
    });
    expect(entry.id).toBeTruthy();
    expect(entry.createdAt).toBeGreaterThan(0);
    expect(loadJournal()).toHaveLength(1);
  });

  it("entries are stored newest first", () => {
    addJournalEntry({ date: "2025-06-01", activity: "mow", notes: "" });
    addJournalEntry({ date: "2025-06-02", activity: "water", notes: "" });
    const entries = loadJournal();
    expect(entries[0].date).toBe("2025-06-02");
  });

  it("deleteJournalEntry removes an entry", () => {
    const e = addJournalEntry({ date: "2025-06-01", activity: "mow", notes: "" });
    deleteJournalEntry(e.id);
    expect(loadJournal()).toHaveLength(0);
  });

  it("saveJournal overwrites all entries", () => {
    addJournalEntry({ date: "2025-06-01", activity: "mow", notes: "" });
    saveJournal([]);
    expect(loadJournal()).toEqual([]);
  });
});

describe("photo CRUD", () => {
  it("loadPhotos returns empty array when empty", () => {
    expect(loadPhotos()).toEqual([]);
  });

  it("addPhoto creates a photo with id and createdAt", () => {
    const photo = addPhoto({ date: "2025-06-01", photo: "data:...", note: "Nice lawn" });
    expect(photo.id).toBeTruthy();
    expect(loadPhotos()).toHaveLength(1);
  });

  it("deletePhoto removes a photo", () => {
    const p = addPhoto({ date: "2025-06-01", photo: "data:...", note: "" });
    deletePhoto(p.id);
    expect(loadPhotos()).toHaveLength(0);
  });
});

describe("calculateStreak", () => {
  it("returns 0 for empty entries", () => {
    expect(calculateStreak([])).toBe(0);
  });

  it("returns 1 for a single today entry", () => {
    const today = new Date().toISOString().split("T")[0];
    const entries: JournalEntry[] = [
      { id: "1", date: today, activity: "mow", notes: "", createdAt: Date.now() },
    ];
    expect(calculateStreak(entries)).toBe(1);
  });

  it("counts consecutive days", () => {
    const dates = [];
    for (let i = 0; i < 5; i++) {
      dates.push(new Date(Date.now() - i * 86_400_000).toISOString().split("T")[0]);
    }
    const entries: JournalEntry[] = dates.map((d) => ({
      id: d,
      date: d,
      activity: "mow" as const,
      notes: "",
      createdAt: Date.now(),
    }));
    expect(calculateStreak(entries)).toBe(5);
  });

  it("breaks on gaps", () => {
    const today = new Date().toISOString().split("T")[0];
    const threeDaysAgo = new Date(Date.now() - 3 * 86_400_000).toISOString().split("T")[0];
    const entries: JournalEntry[] = [
      { id: "1", date: today, activity: "mow", notes: "", createdAt: Date.now() },
      { id: "2", date: threeDaysAgo, activity: "mow", notes: "", createdAt: Date.now() },
    ];
    expect(calculateStreak(entries)).toBe(1);
  });
});

describe("weekly goals", () => {
  it("loadWeeklyGoals returns null when empty", () => {
    expect(loadWeeklyGoals()).toBeNull();
  });

  it("round-trips goals", () => {
    const goals = {
      goals: [{ activity: "mow" as const, target: 2 }],
      weekStart: "2025-06-02",
    };
    saveWeeklyGoals(goals);
    expect(loadWeeklyGoals()).toEqual(goals);
  });

  it("getWeekStart returns a Monday", () => {
    // Use noon to avoid timezone edge cases
    const ws = getWeekStart(new Date("2025-06-05T12:00:00"));
    expect(ws).toBe("2025-06-02"); // Monday
  });

  it("getWeeklyProgress counts activities in date range", () => {
    const entries: JournalEntry[] = [
      { id: "1", date: "2025-06-02", activity: "mow", notes: "", createdAt: 0 },
      { id: "2", date: "2025-06-03", activity: "mow", notes: "", createdAt: 0 },
      { id: "3", date: "2025-06-03", activity: "water", notes: "", createdAt: 0 },
      { id: "4", date: "2025-05-30", activity: "mow", notes: "", createdAt: 0 }, // previous week
    ];
    const progress = getWeeklyProgress(entries, "2025-06-02");
    expect(progress.mow).toBe(2);
    expect(progress.water).toBe(1);
    expect(progress.fertilize).toBeUndefined(); // not logged
  });
});
