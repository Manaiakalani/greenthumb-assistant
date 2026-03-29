import React, { useMemo } from "react";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";
import { motion } from "motion/react";
import { useGrassStore } from "@/stores/useGrassStore";
import { ACHIEVEMENTS } from "@/lib/achievements";
import type { Achievement } from "@/types/journal";

const FONT = "Inter, system-ui, sans-serif";

// Category colors aligned with the app's palette
const CATEGORY_COLORS: Record<Achievement["category"], string> = {
  milestone: "hsl(152, 45%, 32%)",
  streak: "hsl(42, 85%, 55%)",
  seasonal: "hsl(28, 70%, 50%)",
  explorer: "hsl(200, 65%, 50%)",
};

const LOCKED_COLOR = "hsl(var(--muted))";

const AchievementDonutInner: React.FC = () => {
  const earned = useGrassStore((s) => s.achievements);

  const { data, earnedCount, totalCount } = useMemo(() => {
    const earnedIds = new Set(earned.map((e) => e.id));
    const total = ACHIEVEMENTS.length;
    const earnedTotal = earned.length;

    // Group earned by category
    const categoryBuckets: Record<string, number> = {};
    for (const achievement of ACHIEVEMENTS) {
      if (earnedIds.has(achievement.id)) {
        categoryBuckets[achievement.category] =
          (categoryBuckets[achievement.category] ?? 0) + 1;
      }
    }

    const segments: Array<{ name: string; value: number; color: string }> = [];

    for (const [cat, count] of Object.entries(categoryBuckets)) {
      segments.push({
        name: cat.charAt(0).toUpperCase() + cat.slice(1),
        value: count,
        color: CATEGORY_COLORS[cat as Achievement["category"]],
      });
    }

    const lockedCount = total - earnedTotal;
    if (lockedCount > 0) {
      segments.push({
        name: "Locked",
        value: lockedCount,
        color: LOCKED_COLOR,
      });
    }

    // Edge case: no data at all
    if (segments.length === 0) {
      segments.push({
        name: "Locked",
        value: total,
        color: LOCKED_COLOR,
      });
    }

    return { data: segments, earnedCount: earnedTotal, totalCount: total };
  }, [earned]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="rounded-xl border bg-card p-5 shadow-card"
    >
      <h3 className="font-display text-base font-semibold text-foreground mb-4">
        Achievements
      </h3>
      <div className="relative">
        <ResponsiveContainer width="100%" height={260}>
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              innerRadius={65}
              outerRadius={95}
              paddingAngle={2}
              dataKey="value"
              stroke="none"
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip
              contentStyle={{
                fontFamily: FONT,
                fontSize: 12,
                backgroundColor: "hsl(var(--card))",
                color: "hsl(var(--foreground))",
                borderColor: "hsl(var(--border))",
                borderRadius: 8,
              }}
              formatter={(value: number, name: string) => [value, name]}
            />
          </PieChart>
        </ResponsiveContainer>
        {/* Center label */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="text-center">
            <span
              className="text-2xl font-bold"
              style={{ fontFamily: FONT, color: "hsl(var(--primary))" }}
            >
              {earnedCount}
            </span>
            <p
              className="text-xs text-muted-foreground"
              style={{ fontFamily: FONT }}
            >
              of {totalCount}
            </p>
          </div>
        </div>
      </div>
      {/* Legend */}
      <div className="flex flex-wrap justify-center gap-3 mt-2">
        {data.map((entry) => (
          <div key={entry.name} className="flex items-center gap-1.5">
            <span
              className="inline-block h-2.5 w-2.5 rounded-full"
              style={{ backgroundColor: entry.color }}
            />
            <span
              className="text-xs text-muted-foreground"
              style={{ fontFamily: FONT }}
            >
              {entry.name} ({entry.value})
            </span>
          </div>
        ))}
      </div>
    </motion.div>
  );
};

export const AchievementDonut = React.memo(AchievementDonutInner);
