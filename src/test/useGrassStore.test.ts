import { describe, it, expect, beforeEach } from "vitest";
import { useGrassStore } from "@/stores/useGrassStore";
import type { WeeklyGoals } from "@/types/journal";

// ---------------------------------------------------------------------------
// Reset Zustand store + localStorage between tests
// ---------------------------------------------------------------------------

function resetStore() {
  useGrassStore.setState({
    journal: [],
    photos: [],
    achievements: [],
    weeklyGoals: null,
  });
}

beforeEach(() => {
  localStorage.clear();
  resetStore();
});

// ---------------------------------------------------------------------------
// Initial state
// ---------------------------------------------------------------------------

describe("initial state", () => {
  it("starts with empty collections", () => {
    const state = useGrassStore.getState();
    expect(state.journal).toEqual([]);
    expect(state.photos).toEqual([]);
    expect(state.achievements).toEqual([]);
    expect(state.weeklyGoals).toBeNull();
  });
});

// ---------------------------------------------------------------------------
// Journal
// ---------------------------------------------------------------------------

describe("journal actions", () => {
  it("addEntry creates an entry with id and createdAt", () => {
    const entry = useGrassStore.getState().addEntry({
      date: "2025-06-01",
      activity: "mow",
      notes: "Test mow",
    });

    expect(entry.id).toBeTruthy();
    expect(entry.createdAt).toBeGreaterThan(0);
    expect(entry.activity).toBe("mow");
    expect(useGrassStore.getState().journal).toHaveLength(1);
  });

  it("addEntry prepends (newest first)", () => {
    const { addEntry } = useGrassStore.getState();
    addEntry({ date: "2025-06-01", activity: "mow", notes: "" });
    addEntry({ date: "2025-06-02", activity: "water", notes: "" });

    const journal = useGrassStore.getState().journal;
    expect(journal[0].date).toBe("2025-06-02");
    expect(journal[1].date).toBe("2025-06-01");
  });

  it("deleteEntry removes the correct entry", () => {
    const entry = useGrassStore.getState().addEntry({
      date: "2025-06-01",
      activity: "mow",
      notes: "",
    });
    useGrassStore.getState().addEntry({
      date: "2025-06-02",
      activity: "water",
      notes: "",
    });

    useGrassStore.getState().deleteEntry(entry.id);
    const journal = useGrassStore.getState().journal;
    expect(journal).toHaveLength(1);
    expect(journal[0].activity).toBe("water");
  });

  it("setJournal replaces all entries", () => {
    useGrassStore.getState().addEntry({
      date: "2025-06-01",
      activity: "mow",
      notes: "",
    });
    useGrassStore.getState().setJournal([]);
    expect(useGrassStore.getState().journal).toEqual([]);
  });
});

// ---------------------------------------------------------------------------
// Photos
// ---------------------------------------------------------------------------

describe("photo actions", () => {
  it("addPhoto creates a photo with id and createdAt", () => {
    const photo = useGrassStore.getState().addPhoto({
      date: "2025-06-01",
      photo: "data:image/png;base64,abc",
      note: "Green lawn",
    });

    expect(photo.id).toBeTruthy();
    expect(photo.createdAt).toBeGreaterThan(0);
    expect(useGrassStore.getState().photos).toHaveLength(1);
  });

  it("addPhoto prepends (newest first)", () => {
    const { addPhoto } = useGrassStore.getState();
    addPhoto({ date: "2025-06-01", photo: "data:...", note: "" });
    addPhoto({ date: "2025-06-02", photo: "data:...", note: "" });

    const photos = useGrassStore.getState().photos;
    expect(photos[0].date).toBe("2025-06-02");
  });

  it("deletePhoto removes the correct photo", () => {
    const photo = useGrassStore.getState().addPhoto({
      date: "2025-06-01",
      photo: "data:...",
      note: "",
    });
    useGrassStore.getState().addPhoto({
      date: "2025-06-02",
      photo: "data:...",
      note: "",
    });

    useGrassStore.getState().deletePhoto(photo.id);
    const photos = useGrassStore.getState().photos;
    expect(photos).toHaveLength(1);
    expect(photos[0].date).toBe("2025-06-02");
  });

  it("setPhotos replaces all photos", () => {
    useGrassStore.getState().addPhoto({
      date: "2025-06-01",
      photo: "data:...",
      note: "",
    });
    useGrassStore.getState().setPhotos([]);
    expect(useGrassStore.getState().photos).toEqual([]);
  });
});

// ---------------------------------------------------------------------------
// Achievements
// ---------------------------------------------------------------------------

describe("achievement actions", () => {
  it("earnAchievement adds a new achievement and returns true", () => {
    const result = useGrassStore.getState().earnAchievement("first-log");
    expect(result).toBe(true);

    const achievements = useGrassStore.getState().achievements;
    expect(achievements).toHaveLength(1);
    expect(achievements[0].id).toBe("first-log");
    expect(achievements[0].earnedAt).toBeGreaterThan(0);
  });

  it("earnAchievement returns false for duplicate", () => {
    useGrassStore.getState().earnAchievement("first-log");
    const result = useGrassStore.getState().earnAchievement("first-log");
    expect(result).toBe(false);
    expect(useGrassStore.getState().achievements).toHaveLength(1);
  });

  it("can earn multiple different achievements", () => {
    useGrassStore.getState().earnAchievement("first-log");
    useGrassStore.getState().earnAchievement("first-photo");
    expect(useGrassStore.getState().achievements).toHaveLength(2);
  });

  it("setAchievements replaces all achievements", () => {
    useGrassStore.getState().earnAchievement("first-log");
    useGrassStore.getState().setAchievements([]);
    expect(useGrassStore.getState().achievements).toEqual([]);
  });
});

// ---------------------------------------------------------------------------
// Weekly goals
// ---------------------------------------------------------------------------

describe("weekly goals", () => {
  it("setWeeklyGoals updates goals", () => {
    const goals: WeeklyGoals = {
      goals: [{ activity: "mow", target: 2 }],
      weekStart: "2025-06-02",
    };
    useGrassStore.getState().setWeeklyGoals(goals);
    expect(useGrassStore.getState().weeklyGoals).toEqual(goals);
  });

  it("setWeeklyGoals overwrites previous goals", () => {
    useGrassStore.getState().setWeeklyGoals({
      goals: [{ activity: "mow", target: 1 }],
      weekStart: "2025-06-02",
    });
    const newGoals: WeeklyGoals = {
      goals: [{ activity: "water", target: 3 }],
      weekStart: "2025-06-09",
    };
    useGrassStore.getState().setWeeklyGoals(newGoals);
    expect(useGrassStore.getState().weeklyGoals).toEqual(newGoals);
  });
});

// ---------------------------------------------------------------------------
// Persistence (localStorage round-trip)
// ---------------------------------------------------------------------------

describe("persistence", () => {
  it("journal persists to localStorage", () => {
    useGrassStore.getState().addEntry({
      date: "2025-06-01",
      activity: "mow",
      notes: "persist test",
    });
    const raw = localStorage.getItem("grasswise-journal");
    expect(raw).toBeTruthy();
    const parsed = JSON.parse(raw!);
    expect(parsed).toHaveLength(1);
    expect(parsed[0].activity).toBe("mow");
  });

  it("photos persist to localStorage", () => {
    useGrassStore.getState().addPhoto({
      date: "2025-06-01",
      photo: "data:...",
      note: "persist test",
    });
    const raw = localStorage.getItem("grasswise-photos");
    expect(raw).toBeTruthy();
  });

  it("achievements persist to localStorage", () => {
    useGrassStore.getState().earnAchievement("first-log");
    const raw = localStorage.getItem("grasswise-achievements");
    expect(raw).toBeTruthy();
    const parsed = JSON.parse(raw!);
    expect(parsed[0].id).toBe("first-log");
  });

  it("weekly goals persist to localStorage", () => {
    useGrassStore.getState().setWeeklyGoals({
      goals: [{ activity: "mow", target: 2 }],
      weekStart: "2025-06-02",
    });
    const raw = localStorage.getItem("grasswise-weekly-goals");
    expect(raw).toBeTruthy();
  });
});

// ---------------------------------------------------------------------------
// restoreAll (bulk import)
// ---------------------------------------------------------------------------

describe("restoreAll", () => {
  it("restores journal and photos together", () => {
    const journal = [
      { id: "j1", date: "2025-06-01", activity: "mow" as const, notes: "", createdAt: 1 },
    ];
    const photos = [
      { id: "p1", date: "2025-06-01", photo: "data:...", note: "", createdAt: 1 },
    ];

    useGrassStore.getState().restoreAll({ journal, photos });
    expect(useGrassStore.getState().journal).toEqual(journal);
    expect(useGrassStore.getState().photos).toEqual(photos);
  });

  it("restoreAll with partial data only updates provided fields", () => {
    useGrassStore.getState().addEntry({
      date: "2025-06-01",
      activity: "mow",
      notes: "",
    });
    useGrassStore.getState().restoreAll({ photos: [] });
    // Journal should remain unchanged
    expect(useGrassStore.getState().journal).toHaveLength(1);
    expect(useGrassStore.getState().photos).toEqual([]);
  });
});
