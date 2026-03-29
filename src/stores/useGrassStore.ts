import { create } from "zustand";
import type { JournalEntry, PhotoEntry, EarnedAchievement } from "@/types/journal";
import type { WeeklyGoals } from "@/types/journal";
import {
  loadJournal,
  saveJournal,
  loadPhotos,
  savePhotos,
  loadWeeklyGoals,
  saveWeeklyGoals,
} from "@/lib/journal";
import { loadEarned, saveEarned } from "@/lib/achievements";

// ---------------------------------------------------------------------------
// Store types
// ---------------------------------------------------------------------------

interface GrassState {
  /** Journal entries (newest first) */
  journal: JournalEntry[];
  /** Photo timeline entries (newest first) */
  photos: PhotoEntry[];
  /** Earned achievement records */
  achievements: EarnedAchievement[];
  /** Weekly goals config */
  weeklyGoals: WeeklyGoals | null;

  // --- Journal actions ---
  addEntry: (entry: Omit<JournalEntry, "id" | "createdAt">) => JournalEntry;
  deleteEntry: (id: string) => void;
  setJournal: (entries: JournalEntry[]) => void;

  // --- Photo actions ---
  addPhoto: (entry: Omit<PhotoEntry, "id" | "createdAt">) => PhotoEntry;
  deletePhoto: (id: string) => void;
  setPhotos: (photos: PhotoEntry[]) => void;

  // --- Achievement actions ---
  earnAchievement: (id: string) => boolean;
  setAchievements: (achievements: EarnedAchievement[]) => void;

  // --- Weekly goals ---
  setWeeklyGoals: (goals: WeeklyGoals) => void;

  // --- Bulk restore (for backup import) ---
  restoreAll: (data: {
    journal?: JournalEntry[];
    photos?: PhotoEntry[];
    achievements?: EarnedAchievement[];
    weeklyGoals?: WeeklyGoals;
  }) => void;
}

// ---------------------------------------------------------------------------
// Store implementation
// ---------------------------------------------------------------------------

export const useGrassStore = create<GrassState>((set, get) => ({
  // Hydrate from localStorage on creation
  journal: loadJournal(),
  photos: loadPhotos(),
  achievements: loadEarned(),
  weeklyGoals: loadWeeklyGoals(),

  // --- Journal ---
  addEntry: (data) => {
    const newEntry: JournalEntry = {
      ...data,
      id: crypto.randomUUID(),
      createdAt: Date.now(),
    };
    set((s) => {
      const next = [newEntry, ...s.journal];
      saveJournal(next);
      return { journal: next };
    });
    return newEntry;
  },

  deleteEntry: (id) => {
    set((s) => {
      const next = s.journal.filter((e) => e.id !== id);
      saveJournal(next);
      return { journal: next };
    });
  },

  setJournal: (entries) => {
    saveJournal(entries);
    set({ journal: entries });
  },

  // --- Photos ---
  addPhoto: (data) => {
    const newPhoto: PhotoEntry = {
      ...data,
      id: crypto.randomUUID(),
      createdAt: Date.now(),
    };
    set((s) => {
      const next = [newPhoto, ...s.photos];
      savePhotos(next);
      return { photos: next };
    });
    return newPhoto;
  },

  deletePhoto: (id) => {
    set((s) => {
      const next = s.photos.filter((p) => p.id !== id);
      savePhotos(next);
      return { photos: next };
    });
  },

  setPhotos: (photos) => {
    savePhotos(photos);
    set({ photos });
  },

  // --- Achievements ---
  earnAchievement: (id) => {
    const { achievements } = get();
    if (achievements.some((e) => e.id === id)) return false;
    const updated = [...achievements, { id, earnedAt: Date.now() }];
    saveEarned(updated);
    set({ achievements: updated });
    return true;
  },

  setAchievements: (achievements) => {
    saveEarned(achievements);
    set({ achievements });
  },

  // --- Weekly goals ---
  setWeeklyGoals: (goals) => {
    saveWeeklyGoals(goals);
    set({ weeklyGoals: goals });
  },

  // --- Bulk restore ---
  restoreAll: (data) => {
    if (data.journal) {
      saveJournal(data.journal);
    }
    if (data.photos) {
      savePhotos(data.photos);
    }
    if (data.achievements) {
      saveEarned(data.achievements);
    }
    if (data.weeklyGoals) {
      saveWeeklyGoals(data.weeklyGoals);
    }
    set({
      ...(data.journal !== undefined && { journal: data.journal }),
      ...(data.photos !== undefined && { photos: data.photos }),
      ...(data.achievements !== undefined && { achievements: data.achievements }),
      ...(data.weeklyGoals !== undefined && { weeklyGoals: data.weeklyGoals }),
    });
  },
}));
