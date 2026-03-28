import { useMemo } from "react";
import { ACHIEVEMENTS } from "@/lib/achievements";
import { useGrassStore } from "@/stores/useGrassStore";
import type { Achievement, EarnedAchievement } from "@/types/journal";

/** Achievement with earnedAt timestamp attached */
export type EarnedBadge = Achievement & { earnedAt: number };

/** Stable default so the useMemo deps array keeps the same reference. */
const EMPTY: unknown[] = [];

/**
 * Memoized hook to load earned badges from localStorage.
 * Replaces the inline IIFE pattern duplicated in Profile, Gallery, etc.
 * The `deps` parameter can be used to bust the memo (e.g. after earning new badges).
 */
export function useEarnedBadges(_deps: unknown[] = EMPTY): {
  earned: EarnedBadge[];
  earnedIds: Set<string>;
  earnedMap: Map<string, EarnedAchievement>;
  total: number;
} {
  const raw = useGrassStore((s) => s.achievements);
  return useMemo(() => {
    const ids = new Set(raw.map((e) => e.id));
    const earnedMap = new Map(raw.map((e) => [e.id, e]));
    return {
      earned: ACHIEVEMENTS.filter((a) => ids.has(a.id)).map((a) => ({
        ...a,
        earnedAt: earnedMap.get(a.id)!.earnedAt,
      })),
      earnedIds: ids,
      earnedMap,
      total: ACHIEVEMENTS.length,
    };
  }, [raw]);
}
