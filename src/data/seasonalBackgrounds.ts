/* ─── Seasonal CSS gradient backgrounds ─────────────── */

export interface SeasonalBackground {
  season: string;
  gradient: string;
  overlayOpacity: number;
  description: string;
}

const SEASONAL_BACKGROUNDS: SeasonalBackground[] = [
  {
    season: "Spring",
    gradient:
      "linear-gradient(135deg, hsl(100, 45%, 42%) 0%, hsl(80, 50%, 55%) 40%, hsl(55, 60%, 65%) 100%)",
    overlayOpacity: 0.25,
    description: "Fresh greens and soft yellows evoking new growth",
  },
  {
    season: "Summer",
    gradient:
      "linear-gradient(135deg, hsl(85, 50%, 38%) 0%, hsl(70, 55%, 48%) 40%, hsl(45, 65%, 55%) 100%)",
    overlayOpacity: 0.2,
    description: "Warm golden greens of peak growing season",
  },
  {
    season: "Fall",
    gradient:
      "linear-gradient(135deg, hsl(30, 55%, 40%) 0%, hsl(38, 60%, 50%) 40%, hsl(25, 50%, 35%) 100%)",
    overlayOpacity: 0.3,
    description: "Amber and warm browns of the transition season",
  },
  {
    season: "Winter",
    gradient:
      "linear-gradient(135deg, hsl(210, 30%, 40%) 0%, hsl(200, 25%, 55%) 40%, hsl(220, 20%, 60%) 100%)",
    overlayOpacity: 0.35,
    description: "Cool blues and grays of dormant season",
  },
];

/**
 * Return the seasonal background for a given month (0-based, 0 = January).
 *
 * Spring: Mar-May (2-4), Summer: Jun-Aug (5-7),
 * Fall: Sep-Nov (8-10), Winter: Dec-Feb (11, 0, 1).
 */
export function getSeasonalBackground(month: number): SeasonalBackground {
  if (month >= 2 && month <= 4) return SEASONAL_BACKGROUNDS[0]; // Spring
  if (month >= 5 && month <= 7) return SEASONAL_BACKGROUNDS[1]; // Summer
  if (month >= 8 && month <= 10) return SEASONAL_BACKGROUNDS[2]; // Fall
  return SEASONAL_BACKGROUNDS[3]; // Winter
}
