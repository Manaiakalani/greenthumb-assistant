import { useState, useMemo, useCallback } from "react";
import { AnimatePresence, motion } from "motion/react";
import {
  Snowflake,
  Thermometer,
  CloudRain,
  Droplets,
  Wind,
  CheckCircle2,
  X,
} from "lucide-react";
import type { WeatherData } from "@/lib/weather";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface WeatherAlert {
  type: "frost" | "heat" | "heavy-rain" | "drought" | "wind";
  severity: "info" | "warning" | "critical";
  title: string;
  message: string;
  icon: string;
}

interface WeatherAlertsProps {
  weather: WeatherData;
}

// ---------------------------------------------------------------------------
// Icon map
// ---------------------------------------------------------------------------

const ICON_MAP: Record<string, React.ElementType> = {
  snowflake: Snowflake,
  thermometer: Thermometer,
  "cloud-rain": CloudRain,
  droplets: Droplets,
  wind: Wind,
};

// ---------------------------------------------------------------------------
// Style helpers
// ---------------------------------------------------------------------------

const SEVERITY_STYLES: Record<string, string> = {
  critical: "border-l-red-500 bg-red-500/5",
  warning: "border-l-amber-500 bg-amber-500/5",
  info: "border-l-blue-500 bg-blue-500/5",
};

const SEVERITY_ORDER: Record<string, number> = {
  critical: 0,
  warning: 1,
  info: 2,
};

// ---------------------------------------------------------------------------
// Alert generation logic
// ---------------------------------------------------------------------------

function generateAlerts(weather: WeatherData): WeatherAlert[] {
  const alerts: WeatherAlert[] = [];
  const { current, daily } = weather;

  // Frost Warning — min temp < 36 °F in the next 3 days
  const next3Days = daily.slice(0, 3);
  const hasFrost = next3Days.some((d) => d.tempLow < 36);
  if (hasFrost) {
    alerts.push({
      type: "frost",
      severity: "critical",
      title: "Frost Warning",
      message:
        "Temperatures below 36°F expected in the next 3 days. Cover warm-season grasses and avoid mowing until the frost passes.",
      icon: "snowflake",
    });
  }

  // Heat Stress — max temp > 95 °F in forecast
  const hasHeat = daily.some((d) => d.tempHigh > 95);
  if (hasHeat) {
    alerts.push({
      type: "heat",
      severity: "warning",
      title: "Heat Stress Alert",
      message:
        "Highs above 95°F expected. Water early morning before 10 AM and raise your mower height by ½ inch to reduce turf stress.",
      icon: "thermometer",
    });
  }

  // Heavy Rain — daily precipitation > 1 inch
  const hasHeavyRain = daily.some((d) => d.precipitationSum > 1);
  if (hasHeavyRain) {
    alerts.push({
      type: "heavy-rain",
      severity: "info",
      title: "Heavy Rain Expected",
      message:
        "Over 1 inch of rain forecasted. Skip watering and check for drainage issues or standing water on your lawn.",
      icon: "cloud-rain",
    });
  }

  // Drought — no rain for 7+ days AND current temp > 85 °F
  const noRainStreak = daily.every((d) => d.precipitationSum === 0);
  const isHot = current.temperature > 85;
  if (daily.length >= 7 && noRainStreak && isHot) {
    alerts.push({
      type: "drought",
      severity: "warning",
      title: "Drought Conditions",
      message:
        "No rain in the forecast and temperatures above 85°F. Deep water your lawn every 3 days, applying about 1 inch per session.",
      icon: "droplets",
    });
  }

  // High Wind — wind > 20 mph currently
  if (current.windSpeed > 20) {
    alerts.push({
      type: "wind",
      severity: "info",
      title: "High Wind Advisory",
      message:
        "Winds exceeding 20 mph detected. Skip fertilizer and herbicide application to prevent drift and uneven coverage.",
      icon: "wind",
    });
  }

  // Sort by severity — critical first
  alerts.sort(
    (a, b) => SEVERITY_ORDER[a.severity] - SEVERITY_ORDER[b.severity],
  );

  return alerts;
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export function WeatherAlerts({ weather }: WeatherAlertsProps) {
  const allAlerts = useMemo(() => generateAlerts(weather), [weather]);
  const [dismissed, setDismissed] = useState<Set<string>>(new Set());

  const dismiss = useCallback((type: string) => {
    setDismissed((prev) => new Set(prev).add(type));
  }, []);

  const visibleAlerts = allAlerts.filter((a) => !dismissed.has(a.type));

  return (
    <section
      aria-live="polite"
      aria-label="Weather alerts"
      className="flex flex-col gap-3"
    >
      <AnimatePresence mode="popLayout">
        {visibleAlerts.length === 0 ? (
          <motion.div
            key="empty"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            className="flex items-center gap-2 rounded-xl bg-card p-4 text-sm text-muted-foreground shadow-card"
          >
            <CheckCircle2
              className="h-5 w-5 shrink-0 text-lawn-healthy"
              aria-hidden="true"
            />
            <span className="font-display">No weather alerts</span>
          </motion.div>
        ) : (
          visibleAlerts.map((alert) => {
            const Icon = ICON_MAP[alert.icon] ?? Thermometer;
            return (
              <motion.div
                key={alert.type}
                layout
                initial={{ opacity: 0, x: -12 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 12, transition: { duration: 0.2 } }}
                className={`relative flex items-start gap-3 rounded-xl border-l-4 bg-card p-4 shadow-card ${SEVERITY_STYLES[alert.severity]}`}
              >
                <Icon
                  className="mt-0.5 h-5 w-5 shrink-0 text-foreground"
                  aria-hidden="true"
                />

                <div className="flex-1 space-y-1">
                  <h3 className="font-display text-sm font-semibold text-foreground">
                    {alert.title}
                  </h3>
                  <p className="text-sm leading-relaxed text-muted-foreground">
                    {alert.message}
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => dismiss(alert.type)}
                  aria-label={`Dismiss ${alert.title}`}
                  className="flex min-h-[44px] min-w-[44px] items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
                >
                  <X className="h-4 w-4" />
                </button>
              </motion.div>
            );
          })
        )}
      </AnimatePresence>
    </section>
  );
}
