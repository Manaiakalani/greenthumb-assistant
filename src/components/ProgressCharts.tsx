import { useMemo } from "react";
import { motion } from "motion/react";
import BarChart3 from "lucide-react/dist/esm/icons/bar-chart-3";
import { useGrassStore } from "@/stores/useGrassStore";
import { ACTIVITY_META, type ActivityType, type JournalEntry } from "@/types/journal";
import { formatShortMonth } from "@/lib/dateFormat";

interface ProgressChartsProps {
  entries?: JournalEntry[];
}

/**
 * Monthly activity breakdown bar chart.
 * Shows the last 6 months of activity counts by type.
 */
export function ProgressCharts({ entries }: ProgressChartsProps) {
  const storeEntries = useGrassStore((s) => s.journal);
  const { months, maxCount } = useMemo(() => {
    const journal = entries ?? storeEntries;
    const now = new Date();

    // Build 6-month window
    const monthData: { key: string; label: string; counts: Record<string, number>; total: number }[] = [];
    let max = 0;

    for (let i = 5; i >= 0; i--) {
      const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const key = d.toISOString().slice(0, 7);
      const label = formatShortMonth(d);

      const counts: Record<string, number> = {};
      let total = 0;
      for (const entry of journal) {
        if (entry.date.startsWith(key)) {
          counts[entry.activity] = (counts[entry.activity] ?? 0) + 1;
          total++;
        }
      }
      if (total > max) max = total;
      monthData.push({ key, label, counts, total });
    }

    return { months: monthData, maxCount: max };
  }, [entries, storeEntries]);

  // Get top activity types across all 6 months
  const topTypes = useMemo(() => {
    const totals = new Map<string, number>();
    for (const m of months) {
      for (const [type, count] of Object.entries(m.counts)) {
        totals.set(type, (totals.get(type) ?? 0) + count);
      }
    }
    return [...totals.entries()]
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
      .map(([type]) => type as ActivityType);
  }, [months]);

  const barColors: Record<string, string> = {
    mow: "bg-green-500",
    water: "bg-blue-500",
    fertilize: "bg-emerald-600",
    weed: "bg-orange-500",
    seed: "bg-lime-500",
    aerate: "bg-amber-600",
    dethatch: "bg-yellow-600",
    "soil-test": "bg-purple-500",
    other: "bg-gray-500",
  };

  const totalAllMonths = months.reduce((sum, m) => sum + m.total, 0);

  return (
    <div className="rounded-xl border border-primary/15 bg-card p-5 shadow-card">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <BarChart3 className="h-5 w-5 text-primary" />
          <h3 className="font-display text-base font-semibold text-foreground">
            Activity Trends
          </h3>
        </div>
        <span className="text-xs text-muted-foreground">Last 6 months</span>
      </div>

      {totalAllMonths === 0 ? (
        <div className="text-center py-8">
          <BarChart3 className="h-8 w-8 mx-auto text-muted-foreground/30 mb-2" />
          <p className="text-sm text-muted-foreground">No activity data yet</p>
          <p className="text-xs text-muted-foreground mt-1">
            Start logging activities to see trends here.
          </p>
        </div>
      ) : (
        <>
          {/* Stacked bar chart */}
          <div className="flex items-end gap-2 h-32 mb-3">
            {months.map((month) => {
              const heightPercent = maxCount > 0 ? (month.total / maxCount) * 100 : 0;
              return (
                <div key={month.key} className="flex-1 flex flex-col items-center gap-1">
                  <span className="text-[9px] text-muted-foreground font-medium tabular-nums">
                    {month.total > 0 ? month.total : ""}
                  </span>
                  <div
                    className="w-full relative rounded-t-md overflow-hidden"
                    style={{ height: `${Math.max(heightPercent, 2)}%` }}
                  >
                    {topTypes.map((type) => {
                      const typeCount = month.counts[type] ?? 0;
                      if (typeCount === 0 || month.total === 0) return null;
                      const pct = (typeCount / month.total) * 100;
                      return (
                        <motion.div
                          key={type}
                          initial={{ scaleY: 0 }}
                          animate={{ scaleY: 1 }}
                          transition={{ duration: 0.6, delay: 0.1 }}
                          className={`w-full origin-bottom ${barColors[type] ?? "bg-gray-500"}`}
                          style={{ height: `${pct}%` }}
                          title={`${ACTIVITY_META[type]?.label ?? type}: ${typeCount}`}
                        />
                      );
                    })}
                    {/* Remainder for types not in top 5 */}
                    {(() => {
                      const topTotal = topTypes.reduce((s, t) => s + (month.counts[t] ?? 0), 0);
                      const remainder = month.total - topTotal;
                      if (remainder <= 0 || month.total === 0) return null;
                      return (
                        <div
                          className="w-full bg-gray-400"
                          style={{ height: `${(remainder / month.total) * 100}%` }}
                        />
                      );
                    })()}
                  </div>
                  <span className="text-[10px] text-muted-foreground">{month.label}</span>
                </div>
              );
            })}
          </div>

          {/* Legend */}
          <div className="flex flex-wrap gap-x-3 gap-y-1 mt-2">
            {topTypes.map((type) => (
              <div key={type} className="flex items-center gap-1.5">
                <div className={`h-2 w-2 rounded-full ${barColors[type] ?? "bg-gray-500"}`} />
                <span className="text-[10px] text-muted-foreground">
                  {ACTIVITY_META[type]?.label ?? type}
                </span>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
