import type { UserProfile } from "@/types/profile";
import type {
  JournalEntry,
  PhotoEntry,
  EarnedAchievement,
  WeeklyGoals,
} from "@/types/journal";
import type { PlanProgress } from "@/data/soilPlans";
import { safeGetItem, safeGetRaw, safeSetItem } from "@/lib/safeStorage";
import { useGrassStore } from "@/stores/useGrassStore";
import { DEFAULT_PROFILE } from "@/types/profile";

// ---------------------------------------------------------------------------
// Backup schema
// ---------------------------------------------------------------------------

export interface GrasswiseBackup {
  version: 1;
  exportDate: string;
  profile: UserProfile;
  journal: JournalEntry[];
  photos: PhotoEntry[];
  achievements: EarnedAchievement[];
  weeklyGoals: WeeklyGoals | null;
  planProgress: PlanProgress;
  soilTest?: Record<string, unknown>;
  lawnSize?: number;
  geolocation?: { latitude: number; longitude: number };
}

// ---------------------------------------------------------------------------
// Storage keys (mirrors the keys used across the app)
// ---------------------------------------------------------------------------

const KEYS = {
  profile: "grasswise-profile",
  journal: "grasswise-journal",
  photos: "grasswise-photos",
  achievements: "grasswise-achievements",
  weeklyGoals: "grasswise-weekly-goals",
  planProgress: "grasswise-soil-plan-progress",
  notificationPrefs: "grasswise-notification-prefs",
  geolocation: "grasswise-geolocation",
} as const;

// ---------------------------------------------------------------------------
// Export
// ---------------------------------------------------------------------------

/** Gather all app data into a single backup object. */
export function exportAllData(): GrasswiseBackup {
  const store = useGrassStore.getState();

  // Profile from localStorage (canonical source)
  const profileRaw = safeGetRaw(KEYS.profile);
  const profile: UserProfile = profileRaw
    ? { ...DEFAULT_PROFILE, ...JSON.parse(profileRaw) }
    : DEFAULT_PROFILE;

  // Plan progress
  const planProgress = safeGetItem<PlanProgress>(KEYS.planProgress, {
    completed: {},
    year: new Date().getFullYear(),
  });

  // Geolocation cache
  const geoRaw = safeGetRaw(KEYS.geolocation);
  let geolocation: GrasswiseBackup["geolocation"] | undefined;
  if (geoRaw) {
    try {
      const parsed = JSON.parse(geoRaw);
      if (parsed?.latitude != null && parsed?.longitude != null) {
        geolocation = {
          latitude: parsed.latitude,
          longitude: parsed.longitude,
        };
      }
    } catch {
      // ignore
    }
  }

  return {
    version: 1,
    exportDate: new Date().toISOString(),
    profile,
    journal: store.journal,
    photos: store.photos,
    achievements: store.achievements,
    weeklyGoals: store.weeklyGoals,
    planProgress,
    lawnSize: profile.lawnSizeSqFt,
    geolocation,
  };
}

/** Trigger a JSON file download in the browser. */
export function downloadBackup(data: GrasswiseBackup): void {
  const json = JSON.stringify(data, null, 2);
  const blob = new Blob([json], { type: "application/json" });
  const url = URL.createObjectURL(blob);

  const date = new Date().toISOString().split("T")[0];
  const a = document.createElement("a");
  a.href = url;
  a.download = `grasswise-backup-${date}.json`;
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
}

/** Estimate the byte-size of a backup without downloading. */
export function estimateBackupSize(data: GrasswiseBackup): number {
  return new Blob([JSON.stringify(data)]).size;
}

/** Format bytes into a human-readable string. */
export function formatBytes(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

// ---------------------------------------------------------------------------
// Import
// ---------------------------------------------------------------------------

/** Read a File, parse JSON, and perform basic validation. */
export function importBackup(file: File): Promise<GrasswiseBackup> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = () => {
      try {
        const data = JSON.parse(reader.result as string);

        if (!data.version) {
          reject(new Error("Missing version — this doesn't look like a Grasswise backup."));
          return;
        }

        if (!data.exportDate && !data.exportedAt) {
          reject(new Error("Missing export date — invalid backup file."));
          return;
        }

        // Normalise legacy `exportedAt` → `exportDate`
        if (!data.exportDate && data.exportedAt) {
          data.exportDate = data.exportedAt;
        }

        if (data.profile && typeof data.profile !== "object") {
          reject(new Error("Profile data is malformed."));
          return;
        }
        if (data.journal !== undefined && !Array.isArray(data.journal)) {
          reject(new Error("Journal data is malformed."));
          return;
        }
        if (data.photos !== undefined && !Array.isArray(data.photos)) {
          reject(new Error("Photos data is malformed."));
          return;
        }
        if (data.achievements !== undefined && !Array.isArray(data.achievements)) {
          reject(new Error("Achievements data is malformed."));
          return;
        }

        resolve(data as GrasswiseBackup);
      } catch {
        reject(new Error("The file could not be parsed as JSON."));
      }
    };

    reader.onerror = () => reject(new Error("Could not read the file."));
    reader.readAsText(file);
  });
}

// ---------------------------------------------------------------------------
// Restore
// ---------------------------------------------------------------------------

/** Write backup data into localStorage and update the Zustand store. */
export function restoreBackup(
  data: GrasswiseBackup,
  updateProfile: (p: Partial<UserProfile>) => void,
): void {
  // Profile
  if (data.profile) {
    updateProfile(data.profile);
  }

  // Zustand store (journal, photos, achievements, weekly goals)
  useGrassStore.getState().restoreAll({
    journal: Array.isArray(data.journal) ? data.journal : undefined,
    photos: Array.isArray(data.photos) ? data.photos : undefined,
    achievements: Array.isArray(data.achievements) ? data.achievements : undefined,
    weeklyGoals: data.weeklyGoals ?? undefined,
  });

  // Plan progress
  if (data.planProgress) {
    safeSetItem(KEYS.planProgress, data.planProgress);
  }

  // Geolocation cache
  if (data.geolocation) {
    safeSetItem(KEYS.geolocation, data.geolocation);
  }
}
