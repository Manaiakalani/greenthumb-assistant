import { calculateStreak } from "@/lib/journal";
import type { UserProfile } from "@/types/profile";
import type { JournalEntry, PhotoEntry, EarnedAchievement } from "@/types/journal";

/**
 * Compute a 0-100 "Lawn Health Score" based on recent activity,
 * consistency, variety, and profile completeness.
 */
export interface LawnHealthResult {
  score: number;           // 0-100
  grade: string;           // A+ / A / B / C / D / F
  label: string;           // "Thriving", "Good", etc.
  color: string;           // Tailwind text color class
  breakdown: {
    consistency: number;   // 0-30
    variety: number;       // 0-20
    recency: number;       // 0-25
    engagement: number;    // 0-25
  };
  tips: string[];
}

const GRADES: [number, string, string, string][] = [
  [90, "A+", "Thriving",       "text-green-600 dark:text-green-400"],
  [80, "A",  "Excellent",      "text-green-600 dark:text-green-400"],
  [70, "B",  "Good",           "text-emerald-600 dark:text-emerald-400"],
  [55, "C",  "Fair",           "text-amber-600 dark:text-amber-400"],
  [40, "D",  "Needs Work",     "text-orange-600 dark:text-orange-400"],
  [0,  "F",  "Getting Started", "text-red-600 dark:text-red-400"],
];

export function useLawnHealth(
  profile: UserProfile,
  journal: JournalEntry[],
  photos: PhotoEntry[],
  achievements: EarnedAchievement[],
): LawnHealthResult {
    const streak = calculateStreak(journal);

    const now = Date.now();
    const thirtyDaysAgo = now - 30 * 24 * 60 * 60 * 1000;
    const recentEntries = journal.filter((e) => new Date(e.date).getTime() > thirtyDaysAgo);

    // --- Consistency (0-30): streak + regularity in last 30 days ---
    const uniqueRecentDays = new Set(recentEntries.map((e) => e.date)).size;
    const regularityScore = Math.min(uniqueRecentDays / 12, 1) * 18; // 12+ active days = full marks
    const streakScore = Math.min(streak / 7, 1) * 12; // 7+ day streak = full marks
    const consistency = Math.round(regularityScore + streakScore);

    // --- Variety (0-20): different activity types in last 30 days ---
    const recentTypes = new Set(recentEntries.map((e) => e.activity));
    const variety = Math.round(Math.min(recentTypes.size / 5, 1) * 20);

    // --- Recency (0-25): how recently did they log anything ---
    let recency = 0;
    if (journal.length > 0) {
      const lastEntry = journal[0]; // sorted newest first
      const daysSince = Math.floor((now - new Date(lastEntry.date).getTime()) / (1000 * 60 * 60 * 24));
      if (daysSince <= 1) recency = 25;
      else if (daysSince <= 3) recency = 20;
      else if (daysSince <= 7) recency = 15;
      else if (daysSince <= 14) recency = 8;
      else recency = 2;
    }

    // --- Engagement (0-25): photos, achievements, profile completeness ---
    const photoPoints = Math.min(photos.length / 5, 1) * 8;
    const achievementPoints = Math.min(achievements.length / 6, 1) * 8;
    const profileComplete =
      (profile.name ? 1 : 0) + (profile.location ? 1 : 0) +
      (profile.zone ? 1 : 0) + (profile.grassType ? 1 : 0);
    const profilePoints = (profileComplete / 4) * 9;
    const engagement = Math.round(photoPoints + achievementPoints + profilePoints);

    const score = Math.min(100, consistency + variety + recency + engagement);

    // Determine grade
    const [, grade, label, color] = GRADES.find(([min]) => score >= min) ?? GRADES[GRADES.length - 1];

    // Generate tips
    const tips: string[] = [];
    if (consistency < 15) tips.push("Try to log activities more regularly — aim for 3+ days per week.");
    if (variety < 10) tips.push("Mix it up! Try watering, fertilizing, or aerating to boost variety.");
    if (recency < 15) tips.push("Log an activity today to keep your score up.");
    if (engagement < 12) tips.push("Take a lawn photo or complete your profile for bonus points.");
    if (streak < 3) tips.push("Build a streak! Log activities on consecutive days.");
    if (tips.length === 0) tips.push("You're doing great! Keep up the consistent care. 🌟");

    return {
      score,
      grade,
      label,
      color,
      breakdown: { consistency, variety, recency, engagement },
      tips,
    };
}
