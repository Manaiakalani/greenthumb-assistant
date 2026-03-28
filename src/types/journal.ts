/** Activity types a user can log */
export const ACTIVITY_TYPES = [
  "mow",
  "water",
  "fertilize",
  "weed",
  "seed",
  "aerate",
  "dethatch",
  "soil-test",
  "other",
] as const;

export type ActivityType = (typeof ACTIVITY_TYPES)[number];

export const ACTIVITY_META: Record<
  ActivityType,
  { label: string; emoji: string; color: string }
> = {
  mow:         { label: "Mowed",       emoji: "✂️",  color: "bg-green-500" },
  water:       { label: "Watered",     emoji: "💧",  color: "bg-blue-500" },
  fertilize:   { label: "Fertilized",  emoji: "🌿",  color: "bg-emerald-600" },
  weed:        { label: "Weeded",      emoji: "🪴",  color: "bg-orange-500" },
  seed:        { label: "Seeded",      emoji: "🌱",  color: "bg-lime-500" },
  aerate:      { label: "Aerated",     emoji: "🕳️",  color: "bg-amber-600" },
  dethatch:    { label: "Dethatched",  emoji: "🧹",  color: "bg-yellow-600" },
  "soil-test": { label: "Soil Test",   emoji: "🧪",  color: "bg-purple-500" },
  other:       { label: "Other",       emoji: "📝",  color: "bg-gray-500" },
};

/** A single journal entry */
export interface JournalEntry {
  id: string;
  date: string;          // ISO date string YYYY-MM-DD
  activity: ActivityType;
  notes: string;
  createdAt: number;     // timestamp
}

/** A photo entry for the photo timeline */
export interface PhotoEntry {
  id: string;
  date: string;          // ISO date string YYYY-MM-DD
  photo: string;         // base64 data URL (compressed)
  note: string;
  createdAt: number;
}

/** Achievement definition */
export interface Achievement {
  id: string;
  title: string;
  description: string;
  emoji: string;
  category: "milestone" | "streak" | "seasonal" | "explorer";
}

/** Earned achievement record */
export interface EarnedAchievement {
  id: string;
  earnedAt: number;      // timestamp
}

/** Notification preference */
export interface NotificationPrefs {
  enabled: boolean;
  mowReminder: boolean;
  waterReminder: boolean;
  seasonalTips: boolean;
}

/** Weekly goal: target count per activity type */
export interface WeeklyGoal {
  activity: ActivityType;
  target: number;
}

/** Persisted weekly goals config */
export interface WeeklyGoals {
  goals: WeeklyGoal[];
  /** ISO week start date (Monday) when goals were last set */
  weekStart: string;
}
