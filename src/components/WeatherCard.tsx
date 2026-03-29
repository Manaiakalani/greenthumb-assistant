import { useState, useCallback } from "react";
import { motion } from "motion/react";
import { Link } from "react-router-dom";
import {
  Cloud, CloudDrizzle, CloudFog, CloudLightning, CloudRain, CloudSun,
  Droplets, Moon, Snowflake, Sun, Thermometer, Wind, MapPin, LocateFixed,
  type LucideIcon,
} from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { useProfile } from "@/context/ProfileContext";
import { Skeleton } from "@/components/ui/skeleton";
import { safeGetRaw, safeSetItem } from "@/lib/safeStorage";
import {
  fetchWeather, getLawnInsight,
  type WeatherData, type WeatherIcon,
} from "@/lib/weather";

// Map weather icon keys → lucide components
const iconMap: Record<WeatherIcon, LucideIcon> = {
  sun: Sun,
  moon: Moon,
  "partly-cloudy": CloudSun,
  cloud: Cloud,
  fog: CloudFog,
  drizzle: CloudDrizzle,
  rain: CloudRain,
  snow: Snowflake,
  storm: CloudLightning,
};

/** Convert Fahrenheit to Celsius */
function fToC(f: number): number {
  return Math.round(((f - 32) * 5) / 9);
}

/** Display a temperature in both °F and °C */
function DualTemp({ f, className }: { f: number; className?: string }) {
  return (
    <span className={className}>
      {f}°F <span className="text-muted-foreground/70 font-normal">/ {fToC(f)}°C</span>
    </span>
  );
}

function WeatherSkeleton() {
  return (
    <div className="rounded-xl border border-primary/15 bg-card p-6 shadow-card space-y-5 animate-pulse">
      <div className="flex items-center justify-between">
        <Skeleton className="h-5 w-20" />
        <Skeleton className="h-4 w-28" />
      </div>
      <div className="flex items-center gap-4">
        <Skeleton className="h-10 w-10 rounded-full" />
        <div className="space-y-2">
          <Skeleton className="h-8 w-16" />
          <Skeleton className="h-3 w-24" />
        </div>
      </div>
      <div className="grid grid-cols-3 gap-3">
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-full" />
      </div>
      <div className="pt-3 border-t border-border flex justify-between">
        {Array.from({ length: 5 }).map((_, i) => (
          <Skeleton key={i} className="h-12 w-10" />
        ))}
      </div>
    </div>
  );
}

function WeatherError() {
  return (
    <div className="rounded-xl border border-primary/15 bg-card p-6 shadow-card text-center text-sm text-muted-foreground">
      <Cloud aria-hidden="true" className="h-8 w-8 mx-auto mb-2 opacity-40" />
      <p>Could not load weather data.</p>
      <p className="text-xs mt-1">Check your connection or update your location in profile settings.</p>
    </div>
  );
}

/** Hook to request browser geolocation */
function useGeolocation() {
  const [coords, setCoords] = useState<{ latitude: number; longitude: number } | null>(() => {
    const saved = safeGetRaw("grasswise-geolocation");
    if (saved) {
      try { return JSON.parse(saved); } catch { return null; }
    }
    return null;
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const requestLocation = useCallback(() => {
    if (!navigator.geolocation) {
      setError("Geolocation not supported");
      return;
    }
    setLoading(true);
    setError(null);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const loc = { latitude: pos.coords.latitude, longitude: pos.coords.longitude };
        setCoords(loc);
        safeSetItem("grasswise-geolocation", JSON.stringify(loc));
        setLoading(false);
      },
      (err) => {
        setError(err.message);
        setLoading(false);
      },
      { enableHighAccuracy: false, timeout: 10000, maximumAge: 300000 }
    );
  }, []);

  return { coords, loading, error, requestLocation };
}

export function WeatherCard() {
  const { profile } = useProfile();
  const geo = useGeolocation();

  // Prefer browser geolocation, fall back to profile location
  const lat = geo.coords?.latitude ?? profile.latitude;
  const lng = geo.coords?.longitude ?? profile.longitude;
  const hasLocation = !!(lat != null || profile.location);
  const locationLabel = geo.coords
    ? `📍 ${lat!.toFixed(2)}°, ${lng!.toFixed(2)}°`
    : profile.location || "Unknown";

  const { data: weather, isLoading, isError } = useQuery<WeatherData>({
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

  if (!hasLocation && !geo.loading) {
    return (
      <div className="rounded-xl border border-primary/15 bg-card p-6 shadow-card text-center text-sm text-muted-foreground">
        <Cloud aria-hidden="true" className="h-8 w-8 mx-auto mb-2 opacity-40" />
        <p className="mb-3">Enable location for live weather.</p>
        <button
          type="button"
          onClick={geo.requestLocation}
          className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-md bg-primary text-primary-foreground text-xs font-medium hover:bg-primary/90 transition-colors min-h-[44px]"
        >
          <LocateFixed aria-hidden="true" className="h-3.5 w-3.5" />
          Use my location
        </button>
        {geo.error && <p className="text-xs text-destructive mt-2">{geo.error}</p>}
        <p className="text-xs mt-2">
          Or set it in <Link to="/profile" className="text-primary hover:underline">profile settings</Link>.
        </p>
      </div>
    );
  }

  if (isLoading || geo.loading) return <WeatherSkeleton />;
  if (isError || !weather) return <WeatherError />;

  const { current, daily } = weather;
  const CurrentIcon = iconMap[current.condition.icon];
  const todayForecast = daily[0];

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.1 }}
      className="rounded-xl border border-primary/15 bg-card p-6 shadow-card"
    >
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-display text-base font-semibold text-foreground">Weather</h3>
        <div className="flex items-center gap-1.5">
          {!geo.coords && (
            <button
              type="button"
              onClick={geo.requestLocation}
              aria-label="Use my location"
              title="Use my location"
              className="p-1 rounded hover:bg-primary/10 transition-colors"
            >
              <LocateFixed aria-hidden="true" className="h-3.5 w-3.5 text-muted-foreground hover:text-primary" />
            </button>
          )}
          <span className="text-xs text-muted-foreground">{locationLabel}</span>
        </div>
      </div>

      <div className="flex items-center gap-4 mb-5">
        <div className="flex items-center gap-2">
          <CurrentIcon aria-hidden="true" className="h-8 w-8 text-accent" />
          <DualTemp f={current.temperature} className="text-3xl font-display font-bold text-foreground" />
        </div>
        <div className="text-sm text-muted-foreground">
          <p>{current.condition.label}</p>
          {todayForecast && (
            <p className="text-xs">
              H: {todayForecast.tempHigh}°F/{fToC(todayForecast.tempHigh)}°C · L: {todayForecast.tempLow}°F/{fToC(todayForecast.tempLow)}°C
            </p>
          )}
        </div>
      </div>

      <div className="grid grid-cols-3 gap-4">
        <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
          <Droplets aria-hidden="true" className="h-3.5 w-3.5" />
          <span>{current.humidity}%</span>
        </div>
        <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
          <Wind aria-hidden="true" className="h-3.5 w-3.5" />
          <span>{current.windSpeed} mph</span>
        </div>
        {current.soilTemp !== null ? (
          <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
            <Thermometer aria-hidden="true" className="h-3.5 w-3.5" />
            <span>Soil {current.soilTemp}°F/{fToC(current.soilTemp)}°C</span>
          </div>
        ) : (
          <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
            <Cloud aria-hidden="true" className="h-3.5 w-3.5" />
            <span>{current.precipitation > 0 ? `${current.precipitation}"` : "No rain"}</span>
          </div>
        )}
      </div>

      {/* Feels like */}
      <div className="mt-3 text-xs text-muted-foreground">
        Feels like {current.feelsLike}°F / {fToC(current.feelsLike)}°C
      </div>

      {/* Lawn insight */}
      <div className="mt-3 pt-4 border-t border-primary/10">
        <p className="text-xs text-muted-foreground leading-relaxed">
          🌱 {getLawnInsight(current)}
        </p>
      </div>

      {/* Mini forecast */}
      <div className="mt-4 pt-4 border-t border-primary/10">
        <div className="flex justify-between">
          {daily.map((day) => {
            const DayIcon = iconMap[day.condition.icon];
            return (
              <div
                key={day.date}
                className="flex flex-col items-center gap-1 text-xs text-muted-foreground"
              >
                <span>{day.dayName}</span>
                <DayIcon aria-hidden="true" className="h-3.5 w-3.5" />
                <span className="font-medium text-foreground">{day.tempHigh}°</span>
                <span className="text-[10px]">{fToC(day.tempHigh)}°C</span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Privacy notice */}
      <div className="mt-4 pt-3 border-t border-primary/10 text-center">
        <Link to="/privacy" className="text-[10px] text-muted-foreground/60 hover:text-primary transition-colors">
          Privacy Policy
        </Link>
      </div>
    </motion.div>
  );
}
