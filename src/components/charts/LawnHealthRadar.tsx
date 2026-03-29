import React from "react";
import {
  RadarChart,
  Radar,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  ResponsiveContainer,
} from "recharts";
import { motion } from "motion/react";
import { useGrassStore } from "@/stores/useGrassStore";
import { useProfile } from "@/context/ProfileContext";
import { useLawnHealth } from "@/hooks/useLawnHealth";

const FONT = "Inter, system-ui, sans-serif";

// Max values for each dimension — used to normalize to 0-100
const MAX_VALUES = {
  consistency: 30,
  variety: 20,
  recency: 25,
  engagement: 25,
} as const;

const DIMENSION_LABELS: Record<string, string> = {
  consistency: "Consistency",
  variety: "Variety",
  recency: "Recency",
  engagement: "Engagement",
};

const LawnHealthRadarInner: React.FC = () => {
  const { profile } = useProfile();
  const journal = useGrassStore((s) => s.journal);
  const photos = useGrassStore((s) => s.photos);
  const achievements = useGrassStore((s) => s.achievements);

  const health = useLawnHealth(profile, journal, photos, achievements);

  const data = (Object.keys(MAX_VALUES) as Array<keyof typeof MAX_VALUES>).map(
    (key) => ({
      dimension: DIMENSION_LABELS[key],
      value: Math.round((health.breakdown[key] / MAX_VALUES[key]) * 100),
      fullMark: 100,
    }),
  );

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="rounded-xl border bg-card p-5 shadow-card"
    >
      <h3 className="font-display text-base font-semibold text-foreground mb-4">
        Lawn Health Radar
      </h3>
      <div className="relative">
        <ResponsiveContainer width="100%" height={280}>
          <RadarChart cx="50%" cy="50%" outerRadius="70%" data={data}>
            <PolarGrid stroke="hsl(var(--border))" />
            <PolarAngleAxis
              dataKey="dimension"
              tick={{
                fontSize: 11,
                fontFamily: FONT,
                fill: "hsl(var(--muted-foreground))",
              }}
            />
            <PolarRadiusAxis
              angle={90}
              domain={[0, 100]}
              tick={{
                fontSize: 9,
                fontFamily: FONT,
                fill: "hsl(var(--muted-foreground))",
              }}
              tickCount={5}
            />
            <Radar
              name="Health"
              dataKey="value"
              stroke="hsl(var(--primary))"
              fill="hsl(var(--primary))"
              fillOpacity={0.25}
              strokeWidth={2}
            />
          </RadarChart>
        </ResponsiveContainer>
        {/* Center score overlay */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="text-center">
            <span
              className="text-2xl font-bold"
              style={{ fontFamily: FONT, color: "hsl(var(--primary))" }}
            >
              {health.score}
            </span>
            <p
              className="text-xs text-muted-foreground"
              style={{ fontFamily: FONT }}
            >
              {health.label}
            </p>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export const LawnHealthRadar = React.memo(LawnHealthRadarInner);
