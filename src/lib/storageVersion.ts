// Storage Schema Versioning & Migration System
//
// Call runMigrations(registerMigrations()) in main.tsx before React renders.
// This ensures data is migrated before any component reads localStorage.

import { safeGetItem, safeSetItem } from "./safeStorage";

export interface StorageMigration {
  version: number;
  description: string;
  migrate: () => void;
}

const SCHEMA_VERSION_KEY = "grasswise-schema-version";
const CURRENT_VERSION = 1;

/** Reads the current schema version from localStorage (defaults to 0). */
export function getCurrentVersion(): number {
  return safeGetItem<number>(SCHEMA_VERSION_KEY, 0);
}

/** Saves the schema version to localStorage. */
export function setVersion(v: number): void {
  safeSetItem(SCHEMA_VERSION_KEY, v);
}

/**
 * Runs all migrations whose version is above the current stored version,
 * in ascending order. Updates the stored version after each successful migration.
 */
export function runMigrations(migrations: StorageMigration[]): void {
  const current = getCurrentVersion();
  const pending = migrations
    .filter((m) => m.version > current)
    .sort((a, b) => a.version - b.version);

  for (const migration of pending) {
    migration.migrate();
    setVersion(migration.version);
  }
}

// ---------------------------------------------------------------------------
// Key validation helpers
// ---------------------------------------------------------------------------

const KNOWN_OBJECT_KEYS = [
  "grasswise-profile",
  "grasswise-lawns",
  "grasswise-weekly-goals",
  "grasswise-geolocation",
] as const;

const KNOWN_ARRAY_KEYS = [
  "grasswise-journal",
  "grasswise-costs",
  "grasswise-sprinkler-zones",
  "grasswise-favorites-tips",
] as const;

/** Validates that a stored value is parseable JSON of the expected shape. */
function validateAndReset(
  key: string,
  expectedType: "object" | "array",
): void {
  const raw = localStorage.getItem(key);
  if (raw === null) return; // key absent — nothing to fix

  try {
    const parsed: unknown = JSON.parse(raw);

    if (expectedType === "array" && !Array.isArray(parsed)) {
      throw new Error("expected array");
    }
    if (
      expectedType === "object" &&
      (typeof parsed !== "object" || parsed === null || Array.isArray(parsed))
    ) {
      throw new Error("expected object");
    }
  } catch {
    // Corrupted or wrong shape — reset to safe default
    const fallback = expectedType === "array" ? "[]" : "{}";
    localStorage.setItem(key, fallback);
  }
}

/** Validates checklist keys that follow a dynamic pattern. */
function validateChecklistKeys(): void {
  const len = localStorage.length;
  for (let i = 0; i < len; i++) {
    const key = localStorage.key(i);
    if (key && key.startsWith("grasswise-checklist-")) {
      validateAndReset(key, "object");
    }
  }
}

// ---------------------------------------------------------------------------
// Migration registry
// ---------------------------------------------------------------------------

/**
 * Returns all registered migrations in ascending version order.
 * Add new migrations to this array as the schema evolves.
 */
export function registerMigrations(): StorageMigration[] {
  return [
    {
      version: 1,
      description:
        "Initial schema — validate existing keys and fix corrupted data",
      migrate: () => {
        for (const key of KNOWN_OBJECT_KEYS) {
          validateAndReset(key, "object");
        }
        for (const key of KNOWN_ARRAY_KEYS) {
          validateAndReset(key, "array");
        }
        validateChecklistKeys();
      },
    },

    // Future migration template (v1 → v2):
    // {
    //   version: 2,
    //   description: "Rename grassType field to grassVariety",
    //   migrate: () => {
    //     const profile = safeGetItem("grasswise-profile", null);
    //     if (profile?.grassType) {
    //       profile.grassVariety = profile.grassType;
    //       delete profile.grassType;
    //       safeSetItem("grasswise-profile", profile);
    //     }
    //   }
    // }
  ];
}

export { SCHEMA_VERSION_KEY, CURRENT_VERSION };
