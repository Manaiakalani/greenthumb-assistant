import { suggestRegion, type ClimateRegion, type USDAZone } from "@/types/profile";

export interface GeoResult {
  latitude: number;
  longitude: number;
  city: string;
  state: string;
  zone: USDAZone;
  region: ClimateRegion;
}

// ---------------------------------------------------------------------------
// 1. Browser Geolocation
// ---------------------------------------------------------------------------

function getCurrentPosition(): Promise<GeolocationPosition> {
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      reject(new Error("Geolocation is not supported by this browser."));
      return;
    }
    navigator.geolocation.getCurrentPosition(resolve, reject, {
      enableHighAccuracy: false,
      timeout: 10_000,
      maximumAge: 300_000, // cache for 5 min
    });
  });
}

// ---------------------------------------------------------------------------
// 2. Reverse Geocoding (OpenStreetMap Nominatim — free, no key)
// ---------------------------------------------------------------------------

async function reverseGeocode(
  lat: number,
  lng: number,
): Promise<{ city: string; state: string }> {
  const url = `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lng}&format=json&addressdetails=1`;
  const res = await fetch(url, {
    headers: { "Accept-Language": "en", "User-Agent": "Grasswise/1.0" },
  });
  if (!res.ok) throw new Error("Reverse geocoding failed");

  const data = await res.json();
  const addr = data.address ?? {};
  const city =
    addr.city || addr.town || addr.village || addr.hamlet || "Unknown";
  const state = addr.state ?? "";

  return { city, state: abbreviateState(state) };
}

// ---------------------------------------------------------------------------
// 3. USDA Zone Lookup
// ---------------------------------------------------------------------------

/** Rough latitude → USDA zone mapping for the continental US. */
function estimateZoneFromLatitude(lat: number): USDAZone {
  if (lat >= 48) return "3";
  if (lat >= 45) return "4";
  if (lat >= 42) return "5";
  if (lat >= 39) return "6";
  if (lat >= 36) return "7";
  if (lat >= 33) return "8";
  if (lat >= 30) return "9";
  if (lat >= 26) return "10";
  if (lat >= 22) return "11";
  return "12";
}

/** Try the USDA PHZM API for an exact zone, fall back to lat estimation. */
async function lookupZone(lat: number, lng: number): Promise<USDAZone> {
  try {
    const res = await fetch(`https://phzmapi.org/${lat}/${lng}.json`, {
      signal: AbortSignal.timeout(5_000),
    });
    if (res.ok) {
      const data = await res.json();
      // API returns e.g. "7b" — strip the sub-zone letter
      const raw = String(data.zone ?? "").replace(/[a-z]/i, "");
      const num = parseInt(raw, 10);
      if (num >= 1 && num <= 13) return String(num) as USDAZone;
    }
  } catch {
    // CORS or network error — fall through to estimation
  }
  return estimateZoneFromLatitude(lat);
}

// ---------------------------------------------------------------------------
// 4. Public API
// ---------------------------------------------------------------------------

/**
 * Full location-detection pipeline:
 * browser geolocation → reverse geocode + zone lookup → suggested region
 */
export async function detectLocation(): Promise<GeoResult> {
  const pos = await getCurrentPosition();
  const { latitude, longitude } = pos.coords;

  const [geo, zone] = await Promise.all([
    reverseGeocode(latitude, longitude),
    lookupZone(latitude, longitude),
  ]);

  return {
    latitude,
    longitude,
    city: geo.city,
    state: geo.state,
    zone,
    region: suggestRegion(zone),
  };
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

const STATE_ABBR: Record<string, string> = {
  Alabama: "AL", Alaska: "AK", Arizona: "AZ", Arkansas: "AR",
  California: "CA", Colorado: "CO", Connecticut: "CT", Delaware: "DE",
  Florida: "FL", Georgia: "GA", Hawaii: "HI", Idaho: "ID",
  Illinois: "IL", Indiana: "IN", Iowa: "IA", Kansas: "KS",
  Kentucky: "KY", Louisiana: "LA", Maine: "ME", Maryland: "MD",
  Massachusetts: "MA", Michigan: "MI", Minnesota: "MN", Mississippi: "MS",
  Missouri: "MO", Montana: "MT", Nebraska: "NE", Nevada: "NV",
  "New Hampshire": "NH", "New Jersey": "NJ", "New Mexico": "NM",
  "New York": "NY", "North Carolina": "NC", "North Dakota": "ND",
  Ohio: "OH", Oklahoma: "OK", Oregon: "OR", Pennsylvania: "PA",
  "Rhode Island": "RI", "South Carolina": "SC", "South Dakota": "SD",
  Tennessee: "TN", Texas: "TX", Utah: "UT", Vermont: "VT",
  Virginia: "VA", Washington: "WA", "West Virginia": "WV",
  Wisconsin: "WI", Wyoming: "WY",
};

function abbreviateState(state: string): string {
  return STATE_ABBR[state] ?? state;
}
