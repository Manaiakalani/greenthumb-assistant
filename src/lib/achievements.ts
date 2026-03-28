import type { Achievement, EarnedAchievement } from "@/types/journal";
import type { JournalEntry, PhotoEntry } from "@/types/journal";
import type { UserProfile } from "@/types/profile";
import { calculateStreak } from "@/lib/journal";

export const EARNED_KEY = "grasswise-achievements";

// ---------------------------------------------------------------------------
// Achievement definitions
// ---------------------------------------------------------------------------

export const ACHIEVEMENTS: Achievement[] = [
  // Milestones
  { id: "first-log",      title: "First Entry",        description: "Log your first lawn care activity",             emoji: "📝", category: "milestone" },
  { id: "ten-logs",       title: "Dedicated Gardener",  description: "Log 10 lawn care activities",                   emoji: "🌿", category: "milestone" },
  { id: "fifty-logs",     title: "Turf Master",         description: "Log 50 lawn care activities",                   emoji: "🏆", category: "milestone" },
  { id: "first-photo",    title: "Shutterbug",          description: "Take your first lawn photo",                    emoji: "📸", category: "milestone" },
  { id: "ten-photos",     title: "Lawn Paparazzi",      description: "Capture 10 lawn photos",                        emoji: "🎞️", category: "milestone" },
  { id: "profile-complete", title: "Identity Revealed",  description: "Complete your full lawn profile",               emoji: "🪪", category: "milestone" },
  { id: "card-generated", title: "Card Collector",       description: "Generate your first collector card",            emoji: "🃏", category: "milestone" },

  // Streaks
  { id: "streak-3",       title: "On a Roll",           description: "Maintain a 3-day activity streak",              emoji: "🔥", category: "streak" },
  { id: "streak-7",       title: "Week Warrior",        description: "Maintain a 7-day activity streak",              emoji: "⚡", category: "streak" },
  { id: "streak-30",      title: "Monthly Maven",       description: "Maintain a 30-day activity streak",             emoji: "💎", category: "streak" },

  // Seasonal
  { id: "first-mow",      title: "First Mow of Spring", description: "Log your first mow in spring",                 emoji: "✂️", category: "seasonal" },
  { id: "winter-survivor", title: "Winter Survivor",     description: "Log activity during winter months",            emoji: "🥶", category: "seasonal" },
  { id: "summer-warrior",  title: "Summer Warrior",      description: "Log watering during summer heat",              emoji: "☀️", category: "seasonal" },
  { id: "fall-prep",       title: "Fall Preparer",       description: "Log seeding or aerating in fall",              emoji: "🍂", category: "seasonal" },

  // Explorer
  { id: "all-activities",  title: "Jack of All Trades",  description: "Try every activity type at least once",        emoji: "🎯", category: "explorer" },
  { id: "dark-mode",       title: "Night Owl",           description: "Switch to dark mode",                           emoji: "🦉", category: "explorer" },
  { id: "location-detect", title: "GPS Guru",            description: "Auto-detect your location",                    emoji: "📍", category: "explorer" },
];

// ---------------------------------------------------------------------------
// Persistence
// ---------------------------------------------------------------------------

export function loadEarned(): EarnedAchievement[] {
  try {
    const raw = localStorage.getItem(EARNED_KEY);
    return raw ? (JSON.parse(raw) as EarnedAchievement[]) : [];
  } catch {
    return [];
  }
}

export function saveEarned(earned: EarnedAchievement[]) {
  localStorage.setItem(EARNED_KEY, JSON.stringify(earned));
}

export function earnAchievement(id: string): boolean {
  const earned = loadEarned();
  if (earned.some((e) => e.id === id)) return false;
  earned.push({ id, earnedAt: Date.now() });
  saveEarned(earned);
  return true;
}

export function isEarned(id: string): boolean {
  return loadEarned().some((e) => e.id === id);
}

// ---------------------------------------------------------------------------
// Achievement checking — call this after any state change
// ---------------------------------------------------------------------------

export function checkAchievements(context: {
  journal: JournalEntry[];
  photos: PhotoEntry[];
  profile: UserProfile;
  cardGenerated?: boolean;
  darkMode?: boolean;
  locationDetected?: boolean;
}): string[] {
  const newlyEarned: string[] = [];
  const { journal, photos, profile } = context;

  // Read earned list once at the start (batch optimization)
  const earned = loadEarned();
  const earnedIds = new Set(earned.map((e) => e.id));

  function tryEarn(id: string): void {
    if (earnedIds.has(id)) return;
    earnedIds.add(id);
    earned.push({ id, earnedAt: Date.now() });
    newlyEarned.push(id);
  }

  // Milestones
  if (journal.length >= 1) tryEarn("first-log");
  if (journal.length >= 10) tryEarn("ten-logs");
  if (journal.length >= 50) tryEarn("fifty-logs");
  if (photos.length >= 1) tryEarn("first-photo");
  if (photos.length >= 10) tryEarn("ten-photos");
  if (context.cardGenerated) tryEarn("card-generated");

  // Profile complete
  if (profile.name && profile.location && profile.zone && profile.region && profile.grassType && profile.lawnSize) {
    tryEarn("profile-complete");
  }

  // Streaks
  const streak = calculateStreak(journal);
  if (streak >= 3) tryEarn("streak-3");
  if (streak >= 7) tryEarn("streak-7");
  if (streak >= 30) tryEarn("streak-30");

  // Seasonal — check entry dates, not current month
  const entryInSeason = (entry: JournalEntry, startMonth: number, endMonth: number): boolean => {
    const m = new Date(entry.date).getMonth();
    return endMonth >= startMonth
      ? m >= startMonth && m <= endMonth
      : m >= startMonth || m <= endMonth; // wrap (e.g. Nov-Jan)
  };

  if (journal.some((e) => e.activity === "mow" && entryInSeason(e, 2, 4))) tryEarn("first-mow");
  if (journal.some((e) => entryInSeason(e, 11, 1))) tryEarn("winter-survivor");
  if (journal.some((e) => e.activity === "water" && entryInSeason(e, 5, 7))) tryEarn("summer-warrior");
  if (journal.some((e) => (e.activity === "seed" || e.activity === "aerate") && entryInSeason(e, 8, 10))) tryEarn("fall-prep");

  // Explorer
  const activityTypes = new Set(journal.map((e) => e.activity));
  if (activityTypes.size >= 9) tryEarn("all-activities");
  if (context.darkMode) tryEarn("dark-mode");
  if (context.locationDetected) tryEarn("location-detect");

  // Write once at the end if anything changed
  if (newlyEarned.length > 0) saveEarned(earned);

  return newlyEarned;
}
