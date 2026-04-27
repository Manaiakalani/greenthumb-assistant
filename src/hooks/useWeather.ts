import { useCallback, useSyncExternalStore } from "react";
import { useQuery } from "@tanstack/react-query";
import { useProfile } from "@/context/ProfileContext";
import { fetchWeather, type WeatherData } from "@/lib/weather";
import { safeGetRaw, safeSetItem } from "@/lib/safeStorage";

// ---------------------------------------------------------------------------
// Geolocation — module-level subscribable store so every consumer of
// `useWeather` (Index, WeatherCard, etc.) shares the same coords and the
// React Query key stays consistent across the app.
// ---------------------------------------------------------------------------

type Coords = { latitude: number; longitude: number } | null;

interface GeoState {
  coords: Coords;
  loading: boolean;
  error: string | null;
}

function loadInitialCoords(): Coords {
  const saved = safeGetRaw("grasswise-geolocation");
  if (!saved) return null;
  try {
    const parsed = JSON.parse(saved);
    if (parsed?.latitude != null && parsed?.longitude != null) {
      return { latitude: parsed.latitude, longitude: parsed.longitude };
    }
  } catch {
    // ignore
  }
  return null;
}

let geoState: GeoState = {
  coords: loadInitialCoords(),
  loading: false,
  error: null,
};
const geoListeners = new Set<() => void>();

function setGeoState(updater: Partial<GeoState>) {
  geoState = { ...geoState, ...updater };
  geoListeners.forEach((l) => l());
}

function subscribeGeo(listener: () => void) {
  geoListeners.add(listener);
  return () => {
    geoListeners.delete(listener);
  };
}

function getGeoSnapshot() {
  return geoState;
}

function requestGeolocation() {
  if (!navigator.geolocation) {
    setGeoState({
      error:
        "Geolocation is not supported by this browser. Set your location in Profile settings.",
    });
    return;
  }
  setGeoState({ loading: true, error: null });
  navigator.geolocation.getCurrentPosition(
    (pos) => {
      const loc = {
        latitude: pos.coords.latitude,
        longitude: pos.coords.longitude,
      };
      safeSetItem("grasswise-geolocation", JSON.stringify(loc));
      setGeoState({ coords: loc, loading: false, error: null });
    },
    (err) => {
      setGeoState({ loading: false, error: err.message });
    },
    { enableHighAccuracy: false, timeout: 10000, maximumAge: 300000 },
  );
}

// ---------------------------------------------------------------------------
// Hook
// ---------------------------------------------------------------------------

export function useWeather() {
  const { profile } = useProfile();
  const geo = useSyncExternalStore(subscribeGeo, getGeoSnapshot, getGeoSnapshot);

  const lat = geo.coords?.latitude ?? profile.latitude;
  const lng = geo.coords?.longitude ?? profile.longitude;
  const hasLocation = !!(lat != null || profile.location);

  const requestLocation = useCallback(() => {
    requestGeolocation();
  }, []);

  const query = useQuery<WeatherData>({
    queryKey: ["weather", lat, lng, profile.location],
    queryFn: () =>
      fetchWeather({
        latitude: lat,
        longitude: lng,
        location: profile.location,
      }),
    enabled: hasLocation,
    staleTime: 15 * 60 * 1000,
    refetchInterval: 30 * 60 * 1000,
    retry: 2,
  });

  return {
    ...query,
    hasLocation,
    coords: geo.coords,
    geoLoading: geo.loading,
    geoError: geo.error,
    requestLocation,
    lat,
    lng,
    profileLocation: profile.location,
  };
}
