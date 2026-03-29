import { safeGetItem, safeSetItem, safeRemoveItem } from "@/lib/safeStorage";

const CACHE_KEY = "grasswise-weather-cache";

export interface CachedWeather {
  data: unknown;
  timestamp: number;
  coords: { lat: number; lng: number };
}

/**
 * Save weather API response to localStorage with current timestamp.
 */
export function cacheWeatherData(
  data: unknown,
  coords: { lat: number; lng: number },
): void {
  const entry: CachedWeather = {
    data,
    timestamp: Date.now(),
    coords,
  };
  safeSetItem(CACHE_KEY, entry);
}

/**
 * Return cached weather data if it exists and is within maxAge.
 * Default maxAge is 1 hour (3 600 000 ms).
 */
export function getCachedWeather(
  coords: { lat: number; lng: number },
  maxAgeMs = 3_600_000,
): CachedWeather | null {
  const cached = safeGetItem<CachedWeather | null>(CACHE_KEY, null);
  if (!cached) return null;

  const age = Date.now() - cached.timestamp;
  if (age > maxAgeMs) return null;

  // Only return if coords are close enough (≈1 km tolerance)
  const latDiff = Math.abs(cached.coords.lat - coords.lat);
  const lngDiff = Math.abs(cached.coords.lng - coords.lng);
  if (latDiff > 0.01 || lngDiff > 0.01) return null;

  return cached;
}

/**
 * Remove cached weather data from localStorage.
 */
export function clearWeatherCache(): void {
  safeRemoveItem(CACHE_KEY);
}
