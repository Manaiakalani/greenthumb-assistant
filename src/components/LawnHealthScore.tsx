import React from "react";
import { motion } from "motion/react";
import { Heart, TrendingUp, Info } from "lucide-react";
import { useLawnHealth } from "@/hooks/useLawnHealth";
import { useProfile } from "@/context/ProfileContext";
import { useGrassStore } from "@/stores/useGrassStore";

export const LawnHealthScore = React.memo(function LawnHealthScore() {
  const { profile } = useProfile();
  const journal = useGrassStore((s) => s.journal);
  const photos = useGrassStore((s) => s.photos);
  const achievements = useGrassStore((s) => s.achievements);
  const health = useLawnHealth(profile, journal, photos, achievements);

  const circumference = 2 * Math.PI * 44; // radius = 44
  const offset = circumference - (health.score / 100) * circumference;

  return (
    <div className="rounded-xl border border-primary/15 bg-card p-5 shadow-card">
      <div className="flex items-center gap-2 mb-4">
        <Heart aria-hidden="true" className="h-5 w-5 text-primary" />
        <h3 className="font-display text-base font-semibold text-foreground">
          Lawn Health Score
        </h3>
      </div>

      <div className="flex items-center gap-6">
        {/* Circular gauge */}
        <div className="relative shrink-0">
          <svg width="100" height="100" viewBox="0 0 100 100" className="-rotate-90">
            <circle
              cx="50" cy="50" r="44"
              fill="none"
              stroke="hsl(var(--muted))"
              strokeWidth="8"
            />
            <motion.circle
              cx="50" cy="50" r="44"
              fill="none"
              stroke="hsl(var(--primary))"
              strokeWidth="8"
              strokeLinecap="round"
              strokeDasharray={circumference}
              initial={{ strokeDashoffset: circumference }}
              animate={{ strokeDashoffset: offset }}
              transition={{ duration: 1.2, ease: "easeOut" }}
            />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-2xl font-display font-bold text-foreground">
              {health.score}
            </span>
            <span className={`text-[10px] font-semibold ${health.color}`}>
              {health.grade}
            </span>
          </div>
        </div>

        {/* Breakdown */}
        <div className="flex-1 min-w-0 space-y-2">
          <p className={`text-sm font-semibold ${health.color}`}>
            {health.label}
          </p>
          <div className="space-y-1.5">
            {([
              ["Consistency", health.breakdown.consistency, 30],
              ["Variety", health.breakdown.variety, 20],
              ["Recency", health.breakdown.recency, 25],
              ["Engagement", health.breakdown.engagement, 25],
            ] as const).map(([label, value, max]) => (
              <div key={label} className="flex items-center gap-2 text-xs">
                <span className="text-muted-foreground w-20 shrink-0">{label}</span>
                <div className="flex-1 h-1.5 rounded-full bg-muted overflow-hidden">
                  <motion.div
                    className="h-full rounded-full bg-primary/70"
                    initial={{ width: 0 }}
                    animate={{ width: `${(value / max) * 100}%` }}
                    transition={{ duration: 0.8, delay: 0.3 }}
                  />
                </div>
                <span className="text-muted-foreground w-8 text-right">{value}/{max}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Tips */}
      {health.tips.length > 0 && (
        <div className="mt-4 pt-3 border-t border-border">
          <div className="flex items-start gap-2">
            {health.score >= 80 ? (
              <TrendingUp aria-hidden="true" className="h-3.5 w-3.5 text-green-500 mt-0.5 shrink-0" />
            ) : (
              <Info aria-hidden="true" className="h-3.5 w-3.5 text-amber-500 mt-0.5 shrink-0" />
            )}
            <p className="text-xs text-muted-foreground leading-relaxed">
              {health.tips[0]}
            </p>
          </div>
        </div>
      )}
    </div>
  );
});
