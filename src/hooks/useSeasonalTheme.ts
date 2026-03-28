import { useEffect } from "react";
import { getSeason, type Season } from "@/data/stats";

const SEASON_CLASSES: Record<Season, string> = {
  spring: "season-spring",
  summer: "season-summer",
  fall: "season-fall",
  winter: "season-winter",
};

/**
 * Applies a seasonal CSS class to <html> so accent colors
 * shift subtly through the year:
 *   spring → fresh green
 *   summer → warm gold
 *   fall   → amber/orange
 *   winter → cool blue
 */
export function useSeasonalTheme() {
  useEffect(() => {
    const season = getSeason(new Date().getMonth());
    const cls = SEASON_CLASSES[season];
    document.documentElement.classList.add(cls);
    return () => document.documentElement.classList.remove(cls);
  }, []);
}
