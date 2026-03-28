import { useMemo } from "react";
import { useGrassStore } from "@/stores/useGrassStore";
import type { WeatherData } from "@/lib/weather";

export interface SmartReminder {
  id: string;
  emoji: string;
  message: string;
  priority: "high" | "medium" | "low";
}

/**
 * Generate context-aware reminders based on journal data,
 * weather conditions, and seasonal timing.
 */
export function useSmartReminders(
  weather?: WeatherData | null,
): SmartReminder[] {
  return useMemo(() => {
    const journal = useGrassStore.getState().journal;
    const photos = useGrassStore.getState().photos;
    const reminders: SmartReminder[] = [];
    const now = new Date();

    // Helper: days since last activity of a given type
    const daysSince = (activity: string): number | null => {
      const last = journal.find((e) => e.activity === activity);
      if (!last) return null;
      return Math.floor(
        (now.getTime() - new Date(last.date + "T12:00:00").getTime()) / (1000 * 60 * 60 * 24),
      );
    };

    const daysSinceAny = journal.length > 0
      ? Math.floor((now.getTime() - new Date(journal[0].date + "T12:00:00").getTime()) / (1000 * 60 * 60 * 24))
      : null;

    const month = now.getMonth(); // 0-based

    // --- Watering reminders ---
    const daysSinceWater = daysSince("water");
    if (daysSinceWater !== null && daysSinceWater >= 5) {
      reminders.push({
        id: "water-overdue",
        emoji: "💧",
        message: `You haven't watered in ${daysSinceWater} days. Most lawns need 1-1.5 inches per week.`,
        priority: daysSinceWater >= 10 ? "high" : "medium",
      });
    } else if (daysSinceWater === null && journal.length > 0) {
      reminders.push({
        id: "water-never",
        emoji: "💧",
        message: "Start tracking your watering — consistent moisture is key to a healthy lawn.",
        priority: "low",
      });
    }

    // --- Mowing reminders ---
    const daysSinceMow = daysSince("mow");
    if (daysSinceMow !== null && daysSinceMow >= 10 && month >= 3 && month <= 9) {
      reminders.push({
        id: "mow-overdue",
        emoji: "✂️",
        message: `It's been ${daysSinceMow} days since your last mow. During growing season, aim for every 5-7 days.`,
        priority: daysSinceMow >= 14 ? "high" : "medium",
      });
    }

    // --- Weather-aware reminders ---
    if (weather) {
      const { current, daily } = weather;

      // Rain coming — skip watering (> 0.25 inches expected)
      const rainSoon = daily.slice(0, 3).some((d) => d.precipitationSum > 0.25);
      if (rainSoon) {
        reminders.push({
          id: "rain-coming",
          emoji: "🌧️",
          message: "Rain expected in the next 3 days — you can skip watering!",
          priority: "medium",
        });
      }

      // Heat stress warning (°F)
      if (current.temperature >= 95) {
        reminders.push({
          id: "heat-stress",
          emoji: "🔥",
          message: "High heat alert! Water early morning and avoid mowing during peak heat.",
          priority: "high",
        });
      }

      // Frost warning (°F — below 36°F)
      const frostRisk = daily.slice(0, 3).some((d) => d.tempLow < 36);
      if (frostRisk) {
        reminders.push({
          id: "frost-warning",
          emoji: "❄️",
          message: "Frost possible this week. Hold off on seeding or fertilizing.",
          priority: "high",
        });
      }
    }

    // --- Seasonal reminders ---
    if (month === 2 || month === 3) {
      // Spring
      const daysSinceAerate = daysSince("aerate");
      if (daysSinceAerate === null || daysSinceAerate > 180) {
        reminders.push({
          id: "spring-aerate",
          emoji: "🕳️",
          message: "Spring is a great time to aerate your lawn for better root growth.",
          priority: "low",
        });
      }
    }

    if (month >= 8 && month <= 9) {
      // Fall
      const daysSinceSeed = daysSince("seed");
      if (daysSinceSeed === null || daysSinceSeed > 300) {
        reminders.push({
          id: "fall-seed",
          emoji: "🌱",
          message: "Fall is the best time to overseed. Cool soil temps promote germination.",
          priority: "medium",
        });
      }
    }

    if (month >= 4 && month <= 8) {
      // Fertilizer reminder (growing season)
      const daysSinceFert = daysSince("fertilize");
      if (daysSinceFert !== null && daysSinceFert >= 45) {
        reminders.push({
          id: "fertilize-due",
          emoji: "🌿",
          message: `Last fertilizer application was ${daysSinceFert} days ago. Consider a follow-up treatment.`,
          priority: "low",
        });
      }
    }

    // --- General engagement ---
    if (daysSinceAny !== null && daysSinceAny >= 14) {
      reminders.push({
        id: "inactive",
        emoji: "📝",
        message: `You haven't logged anything in ${daysSinceAny} days. Even small tasks count!`,
        priority: "medium",
      });
    }

    if (photos.length === 0 && journal.length >= 3) {
      reminders.push({
        id: "take-photo",
        emoji: "📸",
        message: "Take a lawn photo to start tracking visual progress!",
        priority: "low",
      });
    }

    // Sort by priority
    const order = { high: 0, medium: 1, low: 2 };
    reminders.sort((a, b) => order[a.priority] - order[b.priority]);

    return reminders.slice(0, 4); // Max 4 reminders
  }, [weather]);
}
