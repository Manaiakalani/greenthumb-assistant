import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import {
  Cloud, CloudDrizzle, CloudFog, CloudLightning, CloudRain, CloudSun,
  Droplets, Moon, Snowflake, Sun, Thermometer, Wind,
  type LucideIcon,
} from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { useProfile } from "@/context/ProfileContext";
import { Skeleton } from "@/components/ui/skeleton";
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
      <Cloud className="h-8 w-8 mx-auto mb-2 opacity-40" />
      <p>Could not load weather data.</p>
      <p className="text-xs mt-1">Check your connection or update your location in profile settings.</p>
    </div>
  );
}

export function WeatherCard() {
  const { profile } = useProfile();

  const hasLocation = !!(profile.latitude != null || profile.location);

  const { data: weather, isLoading, isError } = useQuery<WeatherData>({
    queryKey: ["weather", profile.latitude, profile.longitude, profile.location],
    queryFn: () =>
      fetchWeather({
        latitude: profile.latitude,
        longitude: profile.longitude,
        location: profile.location,
      }),
    enabled: hasLocation,
    staleTime: 15 * 60 * 1000,       // 15 min
    refetchInterval: 30 * 60 * 1000,  // 30 min
    retry: 2,
  });

  if (!hasLocation) {
    return (
      <div className="rounded-xl border border-primary/15 bg-card p-6 shadow-card text-center text-sm text-muted-foreground">
        <Cloud className="h-8 w-8 mx-auto mb-2 opacity-40" />
        <p>Set your location in <Link to="/profile" className="text-primary hover:underline">profile settings</Link> to see live weather.</p>
      </div>
    );
  }

  if (isLoading) return <WeatherSkeleton />;
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
        <span className="text-xs text-muted-foreground">{profile.location || "Unknown"}</span>
      </div>

      <div className="flex items-center gap-4 mb-5">
        <div className="flex items-center gap-2">
          <CurrentIcon className="h-8 w-8 text-accent" />
          <span className="text-3xl font-display font-bold text-foreground">
            {current.temperature}°
          </span>
        </div>
        <div className="text-sm text-muted-foreground">
          <p>{current.condition.label}</p>
          {todayForecast && (
            <p className="text-xs">
              H: {todayForecast.tempHigh}° · L: {todayForecast.tempLow}°
            </p>
          )}
        </div>
      </div>

      <div className="grid grid-cols-3 gap-4">
        <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
          <Droplets className="h-3.5 w-3.5" />
          <span>{current.humidity}%</span>
        </div>
        <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
          <Wind className="h-3.5 w-3.5" />
          <span>{current.windSpeed} mph</span>
        </div>
        {current.soilTemp !== null ? (
          <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
            <Thermometer className="h-3.5 w-3.5" />
            <span>Soil {current.soilTemp}°</span>
          </div>
        ) : (
          <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
            <Cloud className="h-3.5 w-3.5" />
            <span>{current.precipitation > 0 ? `${current.precipitation}"` : "No rain"}</span>
          </div>
        )}
      </div>

      {/* Lawn insight */}
      <div className="mt-4 pt-4 border-t border-primary/10">
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
                <DayIcon className="h-3.5 w-3.5" />
                <span className="font-medium text-foreground">{day.tempHigh}°</span>
              </div>
            );
          })}
        </div>
      </div>
    </motion.div>
  );
}
