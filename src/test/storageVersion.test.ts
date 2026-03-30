import { describe, it, expect, beforeEach, vi } from "vitest";
import {
  getCurrentVersion,
  setVersion,
  runMigrations,
  registerMigrations,
  SCHEMA_VERSION_KEY,
  type StorageMigration,
} from "../lib/storageVersion";

beforeEach(() => {
  localStorage.clear();
});

// ---------------------------------------------------------------------------
// getCurrentVersion
// ---------------------------------------------------------------------------
describe("getCurrentVersion", () => {
  it("returns 0 when no version is set", () => {
    expect(getCurrentVersion()).toBe(0);
  });

  it("returns the stored version", () => {
    localStorage.setItem(SCHEMA_VERSION_KEY, "3");
    expect(getCurrentVersion()).toBe(3);
  });
});

// ---------------------------------------------------------------------------
// setVersion
// ---------------------------------------------------------------------------
describe("setVersion", () => {
  it("saves a version that getCurrentVersion reads back", () => {
    setVersion(5);
    expect(getCurrentVersion()).toBe(5);
  });
});

// ---------------------------------------------------------------------------
// runMigrations
// ---------------------------------------------------------------------------
describe("runMigrations", () => {
  it("runs migrations in ascending version order", () => {
    const order: number[] = [];

    const migrations: StorageMigration[] = [
      { version: 3, description: "third", migrate: () => order.push(3) },
      { version: 1, description: "first", migrate: () => order.push(1) },
      { version: 2, description: "second", migrate: () => order.push(2) },
    ];

    runMigrations(migrations);

    expect(order).toEqual([1, 2, 3]);
    expect(getCurrentVersion()).toBe(3);
  });

  it("skips already-applied migrations", () => {
    setVersion(2);

    const spy1 = vi.fn();
    const spy2 = vi.fn();
    const spy3 = vi.fn();

    const migrations: StorageMigration[] = [
      { version: 1, description: "v1", migrate: spy1 },
      { version: 2, description: "v2", migrate: spy2 },
      { version: 3, description: "v3", migrate: spy3 },
    ];

    runMigrations(migrations);

    expect(spy1).not.toHaveBeenCalled();
    expect(spy2).not.toHaveBeenCalled();
    expect(spy3).toHaveBeenCalledOnce();
    expect(getCurrentVersion()).toBe(3);
  });

  it("handles an empty migration list gracefully", () => {
    runMigrations([]);
    expect(getCurrentVersion()).toBe(0);
  });
});

// ---------------------------------------------------------------------------
// v0 → v1 migration (registerMigrations)
// ---------------------------------------------------------------------------
describe("v0 → v1 migration", () => {
  it("fixes corrupted object keys by resetting to {}", () => {
    localStorage.setItem("grasswise-profile", "NOT-JSON!!!");
    localStorage.setItem("grasswise-lawns", "[1,2]"); // array, not object

    runMigrations(registerMigrations());

    expect(JSON.parse(localStorage.getItem("grasswise-profile")!)).toEqual({});
    expect(JSON.parse(localStorage.getItem("grasswise-lawns")!)).toEqual({});
    expect(getCurrentVersion()).toBe(1);
  });

  it("fixes corrupted array keys by resetting to []", () => {
    localStorage.setItem("grasswise-journal", '{"bad":"data"}'); // object, not array
    localStorage.setItem("grasswise-costs", "BROKEN");

    runMigrations(registerMigrations());

    expect(JSON.parse(localStorage.getItem("grasswise-journal")!)).toEqual([]);
    expect(JSON.parse(localStorage.getItem("grasswise-costs")!)).toEqual([]);
  });

  it("leaves valid data untouched", () => {
    const profile = { name: "Bermuda lawn" };
    const journal = [{ id: 1, entry: "Mowed" }];
    localStorage.setItem("grasswise-profile", JSON.stringify(profile));
    localStorage.setItem("grasswise-journal", JSON.stringify(journal));

    runMigrations(registerMigrations());

    expect(JSON.parse(localStorage.getItem("grasswise-profile")!)).toEqual(
      profile,
    );
    expect(JSON.parse(localStorage.getItem("grasswise-journal")!)).toEqual(
      journal,
    );
  });

  it("validates checklist-* pattern keys", () => {
    localStorage.setItem("grasswise-checklist-week1", "INVALID");
    localStorage.setItem(
      "grasswise-checklist-week2",
      JSON.stringify({ done: true }),
    );

    runMigrations(registerMigrations());

    expect(
      JSON.parse(localStorage.getItem("grasswise-checklist-week1")!),
    ).toEqual({});
    expect(
      JSON.parse(localStorage.getItem("grasswise-checklist-week2")!),
    ).toEqual({ done: true });
  });

  it("skips keys that are absent from localStorage", () => {
    // No keys set — migration should run without errors
    runMigrations(registerMigrations());
    expect(getCurrentVersion()).toBe(1);
    // Absent keys remain absent
    expect(localStorage.getItem("grasswise-profile")).toBeNull();
  });
});
