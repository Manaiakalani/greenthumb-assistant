import React, { useMemo } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  Cell,
} from "recharts";
import { motion } from "motion/react";
import { useGrassStore } from "@/stores/useGrassStore";
import { getSeason, type Season } from "@/data/stats";

const FONT = "Inter, system-ui, sans-serif";

/** Ideal mows-per-month by season (approximate for a typical lawn) */
const IDEAL_RANGE: Record<Season, { min: number; max: number }> = {
  spring: { min: 3, max: 6 },
  summer: { min: 2, max: 5 },
  fall:   { min: 3, max: 6 },
  winter: { min: 0, max: 1 },
};

const COLOR_GOOD = "hsl(142, 55%, 42%)";
const COLOR_LOW  = "hsl(45, 85%, 50%)";
const COLOR_HIGH = "hsl(0, 70%, 55%)";

function getBarColor(count: number, month: number): string {
  const season = getSeason(month);
  const { min, max } = IDEAL_RANGE[season];
  if (count < min) return COLOR_LOW;
  if (count > max) return COLOR_HIGH;
  return COLOR_GOOD;
}

interface MonthBucket {
  label: string;
  count: number;
  month: number;
}

const MowingFrequencyChartInner: React.FC = () => {
  const journal = useGrassStore((s) => s.journal);

  const data = useMemo<MonthBucket[]>(() => {
    const now = new Date();
    const buckets: MonthBucket[] = [];

    for (let i = 11; i >= 0; i--) {
      const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const label = d.toLocaleString("en-US", { month: "short" });
      buckets.push({ label, count: 0, month: d.getMonth() });
    }

    // Count mow entries per month
    for (const entry of journal) {
      if (entry.activity !== "mow") continue;
      const entryDate = new Date(entry.date + "T12:00:00");
      for (const bucket of buckets) {
        const bucketDate = new Date(
          now.getFullYear(),
          now.getMonth() - (11 - buckets.indexOf(bucket)),
          1,
        );
        if (
          entryDate.getMonth() === bucketDate.getMonth() &&
          entryDate.getFullYear() === bucketDate.getFullYear()
        ) {
          bucket.count++;
          break;
        }
      }
    }

    return buckets;
  }, [journal]);

  const hasMowEntries = journal.some((e) => e.activity === "mow");

  if (!hasMowEntries) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="rounded-xl border bg-card p-5 shadow-card"
      >
        <h3 className="font-display text-base font-semibold text-foreground mb-4">
          Mowing Frequency
        </h3>
        <div className="flex flex-col items-center justify-center py-10 text-muted-foreground">
          <span className="text-3xl mb-2">✂️</span>
          <p className="text-sm">No mowing entries yet.</p>
          <p className="text-xs mt-1">
            Log your first mow to track your mowing frequency!
          </p>
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
      <h3 className="font-display text-base font-semibold text-foreground mb-1">
        Mowing Frequency
      </h3>
      <p className="text-xs text-muted-foreground mb-4">
        Mows per month — last 12 months
      </p>

      <ResponsiveContainer width="100%" height={260}>
        <BarChart data={data} margin={{ top: 4, right: 4, left: -12, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
          <XAxis
            dataKey="label"
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
            labelStyle={{
              fontFamily: FONT,
              fontWeight: 600,
              color: "hsl(var(--foreground))",
            }}
            formatter={(value: number) => [`${value} mow${value !== 1 ? "s" : ""}`, "Mows"]}
          />
          <Bar dataKey="count" name="Mows" radius={[4, 4, 0, 0]}>
            {data.map((entry) => (
              <Cell key={entry.label} fill={getBarColor(entry.count, entry.month)} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>

      {/* Legend */}
      <div className="flex items-center justify-center gap-4 mt-3 text-[11px] text-muted-foreground">
        <span className="flex items-center gap-1.5">
          <span
            className="inline-block h-2.5 w-2.5 rounded-sm"
            style={{ backgroundColor: COLOR_GOOD }}
            aria-hidden="true"
          />
          Good
        </span>
        <span className="flex items-center gap-1.5">
          <span
            className="inline-block h-2.5 w-2.5 rounded-sm"
            style={{ backgroundColor: COLOR_LOW }}
            aria-hidden="true"
          />
          Too few
        </span>
        <span className="flex items-center gap-1.5">
          <span
            className="inline-block h-2.5 w-2.5 rounded-sm"
            style={{ backgroundColor: COLOR_HIGH }}
            aria-hidden="true"
          />
          Too many
        </span>
      </div>
    </motion.div>
  );
};

export const MowingFrequencyChart = React.memo(MowingFrequencyChartInner);
