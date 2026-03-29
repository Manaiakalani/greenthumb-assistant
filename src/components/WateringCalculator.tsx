import { useCallback, useMemo, useState } from "react";
import { motion } from "motion/react";
import { Calculator, CloudRain, Droplets, Sun } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useProfile } from "@/context/ProfileContext";
import { useWeather } from "@/hooks/useWeather";

const SPRINKLER_TYPES = {
  "rotary":     { label: "Rotary / Rotor",       rate: 0.5  },   // inches per hour
  "fixed":      { label: "Fixed / Spray Head",    rate: 1.5  },
  "oscillating":{ label: "Oscillating",           rate: 0.8  },
  "drip":       { label: "Drip / Soaker",         rate: 0.5  },
  "impact":     { label: "Impact Sprinkler",      rate: 0.7  },
} as const;

type SprinklerType = keyof typeof SPRINKLER_TYPES;

const LAWN_SIZE_SQFT: Record<string, number> = {
  Small: 2500,
  Medium: 5000,
  Large: 10000,
};

const TARGET_INCHES = 1.0; // inches per week recommended

export function WateringCalculator() {
  const { profile } = useProfile();
  const { data: weather } = useWeather();
  const [sprinklerType, setSprinklerType] = useState<SprinklerType>("rotary");
  const [calculated, setCalculated] = useState(false);

  const sqft = LAWN_SIZE_SQFT[profile.lawnSize] ?? 5000;
  const sprinkler = SPRINKLER_TYPES[sprinklerType];

  const result = useMemo(() => {
    const minutesPerSession = Math.round((TARGET_INCHES / sprinkler.rate) * 60);
    const sessionsPerWeek = minutesPerSession > 40 ? 3 : 2;
    const perSession = Math.round(minutesPerSession / sessionsPerWeek);
    const gallonsPerWeek = Math.round(sqft * TARGET_INCHES * 0.623); // 0.623 gal per sqft-inch

    return { minutesPerSession: perSession, sessionsPerWeek, gallonsPerWeek, totalMinutes: minutesPerSession };
  }, [sprinkler.rate, sqft]);

  const weatherInsight = useMemo(() => {
    if (!weather?.daily?.length) return null;

    const daily = weather.daily;

    // Recent rainfall: sum of first 3 days in the forecast
    const recentDays = daily.slice(0, Math.min(3, daily.length));
    const recentRainfall = recentDays.reduce((sum, d) => sum + d.precipitationSum, 0);

    // Expected weekly rainfall (all forecast days)
    const weeklyRainfall = daily.reduce((sum, d) => sum + d.precipitationSum, 0);

    // Supplemental watering needed
    const supplementalNeeded = Math.max(0, TARGET_INCHES - weeklyRainfall);

    // Upcoming rain check (tomorrow and day after)
    const rainTomorrow = daily.length > 1 && daily[1].precipitationSum > 0.1;
    const rainDayAfter = daily.length > 2 && daily[2].precipitationSum > 0.1;

    // Best watering days: future days without significant rain
    const bestDays = daily.slice(1).filter((d) => d.precipitationSum < 0.1);

    return {
      recentRainfall: Math.round(recentRainfall * 100) / 100,
      weeklyRainfall: Math.round(weeklyRainfall * 100) / 100,
      supplementalNeeded: Math.round(supplementalNeeded * 100) / 100,
      rainTomorrow,
      rainDayAfter,
      bestDays,
    };
  }, [weather]);

  const handleCalculate = useCallback(() => setCalculated(true), []);

  return (
    <div className="space-y-5">
      <div className="flex items-center gap-2">
        <Calculator aria-hidden="true" className="h-5 w-5 text-primary" />
        <h3 className="font-display text-lg font-semibold text-foreground">
          Watering Calculator
        </h3>
      </div>

      <p className="text-sm text-muted-foreground">
        Find out exactly how long to run your sprinklers each session for a healthy lawn.
      </p>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="sprinkler-type">Sprinkler Type</Label>
          <Select value={sprinklerType} onValueChange={(v) => { setSprinklerType(v as SprinklerType); setCalculated(false); }}>
            <SelectTrigger id="sprinkler-type"><SelectValue /></SelectTrigger>
            <SelectContent>
              {Object.entries(SPRINKLER_TYPES).map(([key, { label }]) => (
                <SelectItem key={key} value={key}>{label}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label>Lawn Size</Label>
          <div className="flex items-center h-9 px-3 rounded-md border border-input bg-background text-sm">
            {profile.lawnSize} (~{sqft.toLocaleString()}&nbsp;sq&nbsp;ft)
          </div>
        </div>
      </div>

      <div className="flex items-center gap-2 text-xs text-muted-foreground">
        <Droplets aria-hidden="true" className="h-3.5 w-3.5" />
        <span>Target: {TARGET_INCHES}" per week (recommended for most lawns)</span>
      </div>

      {!calculated ? (
        <Button onClick={handleCalculate} className="w-full gap-2 bg-primary">
          <Calculator aria-hidden="true" className="h-4 w-4" />
          Calculate
        </Button>
      ) : (
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          className="rounded-xl border border-primary/20 bg-primary/5 p-5"
        >
          <h4 className="font-display font-semibold text-foreground mb-3">
            Your Watering Plan
          </h4>
          <div className="grid grid-cols-3 gap-4 text-center">
            <div>
              <p className="text-2xl font-display font-bold text-primary tabular-nums">{result.minutesPerSession}</p>
              <p className="text-xs text-muted-foreground">min per session</p>
            </div>
            <div>
              <p className="text-2xl font-display font-bold text-primary tabular-nums">{result.sessionsPerWeek}x</p>
              <p className="text-xs text-muted-foreground">per week</p>
            </div>
            <div>
              <p className="text-2xl font-display font-bold text-primary tabular-nums">{result.gallonsPerWeek}</p>
              <p className="text-xs text-muted-foreground">gal / week</p>
            </div>
          </div>
          <p className="mt-3 text-xs text-muted-foreground text-center">
            💡 Water early morning (6-10 AM) to minimize evaporation
          </p>
        </motion.div>
      )}

      {weatherInsight && (
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-3"
        >
          {/* Recent rainfall */}
          <div className="rounded-xl border border-blue-200 bg-blue-50/50 dark:border-blue-900 dark:bg-blue-950/30 p-4">
            <div className="flex items-center gap-2 mb-2">
              <CloudRain aria-hidden="true" className="h-4 w-4 text-blue-500" />
              <h4 className="text-sm font-semibold text-foreground">Rainfall & Watering Adjustment</h4>
            </div>
            <p className="text-sm text-muted-foreground">
              Recent rainfall: <span className="font-medium text-foreground">{weatherInsight.recentRainfall}"</span> in the past 3 days
            </p>
            <p className="text-sm text-muted-foreground mt-1">
              Your lawn needs ~{TARGET_INCHES}" per week. With{" "}
              <span className="font-medium text-foreground">{weatherInsight.weeklyRainfall}"</span> of rain
              this week,{" "}
              {weatherInsight.supplementalNeeded > 0 ? (
                <>
                  you need{" "}
                  <span className="font-medium text-primary">{weatherInsight.supplementalNeeded}" more</span>{" "}
                  of supplemental watering
                </>
              ) : (
                <span className="font-medium text-green-600 dark:text-green-400">
                  no extra watering is needed
                </span>
              )}
            </p>
          </div>

          {/* Upcoming rain indicator */}
          {(weatherInsight.rainTomorrow || weatherInsight.rainDayAfter) && (
            <div className="rounded-xl border border-amber-200 bg-amber-50/50 dark:border-amber-900 dark:bg-amber-950/30 p-4">
              <div className="flex items-center gap-2">
                <CloudRain aria-hidden="true" className="h-4 w-4 text-amber-500" />
                <p className="text-sm font-medium text-foreground">
                  {weatherInsight.rainTomorrow
                    ? "Rain expected tomorrow — consider skipping watering today"
                    : "Rain expected in 2 days — you may be able to skip a session"}
                </p>
              </div>
            </div>
          )}

          {/* Best watering days */}
          {weatherInsight.bestDays.length > 0 && (
            <div className="rounded-xl border border-green-200 bg-green-50/50 dark:border-green-900 dark:bg-green-950/30 p-4">
              <div className="flex items-center gap-2 mb-2">
                <Sun aria-hidden="true" className="h-4 w-4 text-green-500" />
                <h4 className="text-sm font-semibold text-foreground">Best Days to Water</h4>
              </div>
              <div className="flex flex-wrap gap-2">
                {weatherInsight.bestDays.map((day) => (
                  <span
                    key={day.date}
                    className="inline-flex items-center gap-1 rounded-full bg-green-100 dark:bg-green-900/40 px-2.5 py-0.5 text-xs font-medium text-green-700 dark:text-green-300"
                  >
                    {day.dayName}
                  </span>
                ))}
              </div>
              <p className="text-xs text-muted-foreground mt-2">
                💧 Water early morning (6–10 AM) on dry days for best results
              </p>
            </div>
          )}
        </motion.div>
      )}
    </div>
  );
}
