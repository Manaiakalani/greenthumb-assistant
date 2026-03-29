import { safeGetItem, safeSetItem } from "@/lib/safeStorage";
import type { JournalEntry, PhotoEntry, WeeklyGoals } from "@/types/journal";

const JOURNAL_KEY = "grasswise-journal";
const PHOTOS_KEY = "grasswise-photos";

// ---------------------------------------------------------------------------
// Journal entries
// ---------------------------------------------------------------------------

export function loadJournal(): JournalEntry[] {
  return safeGetItem<JournalEntry[]>(JOURNAL_KEY, []);
}

export function saveJournal(entries: JournalEntry[]) {
  safeSetItem(JOURNAL_KEY, entries);
}

export function addJournalEntry(entry: Omit<JournalEntry, "id" | "createdAt">): JournalEntry {
  const entries = loadJournal();
  const newEntry: JournalEntry = {
    ...entry,
    id: crypto.randomUUID(),
    createdAt: Date.now(),
  };
  entries.unshift(newEntry);
  saveJournal(entries);
  return newEntry;
}

export function deleteJournalEntry(id: string) {
  const entries = loadJournal().filter((e) => e.id !== id);
  saveJournal(entries);
}

// ---------------------------------------------------------------------------
// Photo entries
// ---------------------------------------------------------------------------

export function loadPhotos(): PhotoEntry[] {
  return safeGetItem<PhotoEntry[]>(PHOTOS_KEY, []);
}

export function savePhotos(photos: PhotoEntry[]) {
  safeSetItem(PHOTOS_KEY, photos);
}

export function addPhoto(entry: Omit<PhotoEntry, "id" | "createdAt">): PhotoEntry {
  const photos = loadPhotos();
  const newPhoto: PhotoEntry = {
    ...entry,
    id: crypto.randomUUID(),
    createdAt: Date.now(),
  };
  photos.unshift(newPhoto);
  savePhotos(photos);
  return newPhoto;
}

export function deletePhoto(id: string) {
  const photos = loadPhotos().filter((p) => p.id !== id);
  savePhotos(photos);
}

// ---------------------------------------------------------------------------
// Image compression — resize large images to max 800px and compress to JPEG
// ---------------------------------------------------------------------------

export function compressImage(file: File, maxSize = 800): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement("canvas");
        let { width, height } = img;
        if (width > maxSize || height > maxSize) {
          const ratio = Math.min(maxSize / width, maxSize / height);
          width = Math.round(width * ratio);
          height = Math.round(height * ratio);
        }
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext("2d")!;
        ctx.drawImage(img, 0, 0, width, height);
        resolve(canvas.toDataURL("image/jpeg", 0.7));
      };
      img.onerror = reject;
      img.src = reader.result as string;
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

// ---------------------------------------------------------------------------
// Streak calculation
// ---------------------------------------------------------------------------

export function calculateStreak(entries: JournalEntry[]): number {
  if (!entries.length) return 0;
  const uniqueDays = [...new Set(entries.map((e) => e.date))].sort().reverse();
  const today = new Date().toISOString().split("T")[0];
  
  // If no activity today or yesterday, streak is 0
  const diff = daysDiff(uniqueDays[0], today);
  if (diff > 1) return 0;
  
  let streak = 1;
  for (let i = 1; i < uniqueDays.length; i++) {
    if (daysDiff(uniqueDays[i], uniqueDays[i - 1]) === 1) {
      streak++;
    } else {
      break;
    }
  }
  return streak;
}

function daysDiff(a: string, b: string): number {
  return Math.round(
    (new Date(b).getTime() - new Date(a).getTime()) / (1000 * 60 * 60 * 24),
  );
}

// ---------------------------------------------------------------------------
// Weekly goals
// ---------------------------------------------------------------------------

const GOALS_KEY = "grasswise-weekly-goals";

/** Get the Monday (ISO week start) for a given date */
export function getWeekStart(date: Date = new Date()): string {
  const d = new Date(date);
  const day = d.getDay();
  // Shift so Monday = 0
  const diff = (day === 0 ? -6 : 1) - day;
  d.setDate(d.getDate() + diff);
  return d.toISOString().split("T")[0];
}

/** Get the Sunday (ISO week end) for a given date */
export function getWeekEnd(date: Date = new Date()): string {
  const d = new Date(date);
  const day = d.getDay();
  const diff = day === 0 ? 0 : 7 - day;
  d.setDate(d.getDate() + diff);
  return d.toISOString().split("T")[0];
}

export function loadWeeklyGoals(): WeeklyGoals | null {
  return safeGetItem<WeeklyGoals | null>(GOALS_KEY, null);
}

export function saveWeeklyGoals(goals: WeeklyGoals) {
  safeSetItem(GOALS_KEY, goals);
}

/** Count activities by type for the current ISO week */
export function getWeeklyProgress(
  entries: JournalEntry[],
  weekStart?: string,
): Record<string, number> {
  const start = weekStart ?? getWeekStart();
  const end = getWeekEnd(new Date(start + "T12:00:00"));
  const counts: Record<string, number> = {};
  for (const entry of entries) {
    if (entry.date >= start && entry.date <= end) {
      counts[entry.activity] = (counts[entry.activity] ?? 0) + 1;
    }
  }
  return counts;
}
