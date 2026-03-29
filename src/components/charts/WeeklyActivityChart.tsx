import React, { useMemo } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";
import { motion } from "motion/react";
import { useGrassStore } from "@/stores/useGrassStore";
import { ACTIVITY_META, type ActivityType } from "@/types/journal";

// Chart colors mapped to each activity — uses lawn-themed greens/browns
const ACTIVITY_COLORS: Record<ActivityType, string> = {
  mow: "hsl(142, 55%, 42%)",
  water: "hsl(200, 65%, 50%)",
  fertilize: "hsl(152, 45%, 32%)",
  weed: "hsl(28, 70%, 50%)",
  seed: "hsl(85, 55%, 45%)",
  aerate: "hsl(42, 75%, 50%)",
  dethatch: "hsl(48, 65%, 45%)",
  "soil-test": "hsl(270, 40%, 50%)",
  other: "hsl(150, 10%, 55%)",
};

const FONT = "Inter, system-ui, sans-serif";

function getWeekLabel(date: Date): string {
  const month = date.toLocaleString("en-US", { month: "short" });
  const day = date.getDate();
  return `${month} ${day}`;
}

function getMonday(date: Date): Date {
  const d = new Date(date);
  const day = d.getDay();
  const diff = day === 0 ? -6 : 1 - day;
  d.setDate(d.getDate() + diff);
  d.setHours(0, 0, 0, 0);
  return d;
}

const WeeklyActivityChartInner: React.FC = () => {
  const journal = useGrassStore((s) => s.journal);

  const { data, activeTypes } = useMemo(() => {
    if (journal.length === 0) return { data: [], activeTypes: [] as ActivityType[] };

    const now = new Date();
    const eightWeeksAgo = new Date(now);
    eightWeeksAgo.setDate(eightWeeksAgo.getDate() - 8 * 7);

    // Build week buckets keyed by Monday date string
    const weeks = new Map<string, Record<string, number>>();
    const weekDates = new Map<string, Date>();

    for (let i = 7; i >= 0; i--) {
      const d = new Date(now);
      d.setDate(d.getDate() - i * 7);
      const monday = getMonday(d);
      const key = monday.toISOString().split("T")[0];
      weeks.set(key, {});
      weekDates.set(key, monday);
    }

    const typesUsed = new Set<ActivityType>();

    for (const entry of journal) {
      const entryDate = new Date(entry.date + "T12:00:00");
      if (entryDate < eightWeeksAgo) continue;

      const monday = getMonday(entryDate);
      const key = monday.toISOString().split("T")[0];
      const bucket = weeks.get(key);
      if (bucket) {
        bucket[entry.activity] = (bucket[entry.activity] ?? 0) + 1;
        typesUsed.add(entry.activity);
      }
    }

    const chartData = Array.from(weeks.entries()).map(([key, counts]) => ({
      week: getWeekLabel(weekDates.get(key)!),
      ...counts,
    }));

    return {
      data: chartData,
      activeTypes: Array.from(typesUsed) as ActivityType[],
    };
  }, [journal]);

  if (journal.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="rounded-xl border bg-card p-5 shadow-card"
      >
        <h3 className="font-display text-base font-semibold text-foreground mb-4">
          Weekly Activity
        </h3>
        <div className="flex flex-col items-center justify-center py-10 text-muted-foreground">
          <span className="text-3xl mb-2">📊</span>
          <p className="text-sm">No journal entries yet.</p>
          <p className="text-xs mt-1">Start logging activities to see your weekly trends!</p>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="rounded-xl border bg-card p-5 shadow-card"
    >
      <h3 className="font-display text-base font-semibold text-foreground mb-4">
        Weekly Activity
      </h3>
      <ResponsiveContainer width="100%" height={280}>
        <BarChart data={data} margin={{ top: 4, right: 4, left: -12, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
          <XAxis
            dataKey="week"
            tick={{ fontSize: 11, fontFamily: FONT, fill: "hsl(var(--muted-foreground))" }}
            tickLine={false}
            axisLine={{ stroke: "hsl(var(--border))" }}
          />
          <YAxis
            allowDecimals={false}
            tick={{ fontSize: 11, fontFamily: FONT, fill: "hsl(var(--muted-foreground))" }}
            tickLine={false}
            axisLine={false}
          />
          <Tooltip
            contentStyle={{
              fontFamily: FONT,
              fontSize: 12,
              backgroundColor: "hsl(var(--card))",
              color: "hsl(var(--foreground))",
              borderColor: "hsl(var(--border))",
              borderRadius: 8,
            }}
            labelStyle={{ fontFamily: FONT, fontWeight: 600, color: "hsl(var(--foreground))" }}
          />
          <Legend
            wrapperStyle={{ fontFamily: FONT, fontSize: 11, color: "hsl(var(--muted-foreground))" }}
            iconType="circle"
            iconSize={8}
          />
          {activeTypes.map((type) => (
            <Bar
              key={type}
              dataKey={type}
              stackId="activities"
              fill={ACTIVITY_COLORS[type]}
              name={ACTIVITY_META[type].label}
              radius={[2, 2, 0, 0]}
            />
          ))}
        </BarChart>
      </ResponsiveContainer>
    </motion.div>
  );
};

export const WeeklyActivityChart = React.memo(WeeklyActivityChartInner);
