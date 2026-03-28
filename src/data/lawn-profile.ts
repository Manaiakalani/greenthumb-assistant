import type { ClimateRegion } from "@/types/profile";

/**
 * Returns a contextual growth message based on the user's region and grass type.
 */
export function getGrowthMessage(region: ClimateRegion, grassType: string): string {
  const month = new Date().getMonth(); // 0-indexed

  // Winter (Dec–Feb)
  if (month === 11 || month <= 1) {
    if (region === "Warm-Season") {
      return `Your ${grassType} is likely dormant — avoid heavy traffic and skip fertilizing.`;
    }
    return `Your ${grassType} is dormant — a great time to plan for the spring ahead!`;
  }

  // Spring (Mar–May)
  if (month >= 2 && month <= 4) {
    if (region === "Warm-Season") {
      return `Your ${grassType} is waking up — time to start mowing and feeding.`;
    }
    return `Your ${grassType} is in active spring growth — the best time of year for cool-season grass!`;
  }

  // Summer (Jun–Aug)
  if (month >= 5 && month <= 7) {
    if (region === "Cool-Season") {
      return `Your ${grassType} may be heat-stressed — raise your mowing height and water deeply.`;
    }
    return `Your ${grassType} is in peak summer growth — keep mowing and stay on top of watering.`;
  }

  // Fall (Sep–Nov)
  if (region === "Cool-Season" || region === "Transition Zone") {
    return `Fall is prime time for your ${grassType} — overseed, fertilize, and enjoy the growth!`;
  }
  return `Your ${grassType} is slowing down — apply a winterizer and prepare for dormancy.`;
}
