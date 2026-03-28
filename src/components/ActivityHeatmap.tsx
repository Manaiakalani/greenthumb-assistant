import { useMemo } from "react";
import { motion } from "framer-motion";
import { CalendarDays } from "lucide-react";
import type { JournalEntry } from "@/types/journal";

interface ActivityHeatmapProps {
  entries: JournalEntry[];
}

/**
 * GitHub-style activity heatmap showing the last 16 weeks (112 days).
 * Each cell is a day, colored by activity count.
 */
export function ActivityHeatmap({ entries }: ActivityHeatmapProps) {
  const { weeks, maxCount, totalActivities, activeDays } = useMemo(() => {
    // Count activities per date
    const counts = new Map<string, number>();
    for (const entry of entries) {
      counts.set(entry.date, (counts.get(entry.date) ?? 0) + 1);
    }

    // Build 16 weeks ending today
    const today = new Date();
    const dayOfWeek = today.getDay(); // 0=Sun
    const startOffset = dayOfWeek + 7 * 15; // go back to start of 16 weeks ago (Sunday)

    const wks: { date: string; count: number; dayOfWeek: number }[][] = [];
    let maxC = 0;
    let total = 0;
    let active = 0;

    for (let w = 0; w < 16; w++) {
      const week: typeof wks[0] = [];
      for (let d = 0; d < 7; d++) {
        const cellDate = new Date(today);
        cellDate.setDate(today.getDate() - (startOffset - w * 7 - d));
        const iso = cellDate.toISOString().split("T")[0];

        // Don't show future dates
        if (cellDate > today) {
          week.push({ date: iso, count: -1, dayOfWeek: d });
          continue;
        }

        const c = counts.get(iso) ?? 0;
        if (c > maxC) maxC = c;
        total += c;
        if (c > 0) active++;
        week.push({ date: iso, count: c, dayOfWeek: d });
      }
      wks.push(week);
    }

    return { weeks: wks, maxCount: maxC, totalActivities: total, activeDays: active };
  }, [entries]);

  const getColor = (count: number): string => {
    if (count < 0) return "bg-transparent"; // future
    if (count === 0) return "bg-muted";
    if (maxCount <= 1) return "bg-primary/70";
    const ratio = count / maxCount;
    if (ratio <= 0.25) return "bg-primary/30";
    if (ratio <= 0.5) return "bg-primary/50";
    if (ratio <= 0.75) return "bg-primary/70";
    return "bg-primary";
  };

  const dayLabels = ["S", "M", "T", "W", "T", "F", "S"];

  return (
    <div className="rounded-xl border border-primary/15 bg-card p-5 shadow-card" aria-label={`Activity heatmap: ${totalActivities} activities over ${activeDays} active days in the last 16 weeks`}>
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <CalendarDays className="h-5 w-5 text-primary" />
          <h3 className="font-display text-base font-semibold text-foreground">
            Activity Heatmap
          </h3>
        </div>
        <div className="flex items-center gap-3 text-xs text-muted-foreground">
          <span><strong className="text-foreground">{totalActivities}</strong> activities</span>
          <span><strong className="text-foreground">{activeDays}</strong> active days</span>
        </div>
      </div>

      {/* Heatmap grid */}
      <div className="flex gap-0.5 overflow-x-auto pb-1" role="grid" aria-label="Activity heatmap grid">
        {/* Day labels */}
        <div className="flex flex-col gap-0.5 mr-1 shrink-0" role="presentation">
          {dayLabels.map((label, i) => (
            <div key={i} className="h-3 w-3 flex items-center justify-center text-[8px] text-muted-foreground" aria-hidden="true">
              {i % 2 === 1 ? label : ""}
            </div>
          ))}
        </div>

        {/* Weeks */}
        {weeks.map((week, wi) => (
          <div key={wi} className="flex flex-col gap-0.5" role="row">
            {week.map((day, di) => (
              <motion.div
                key={day.date}
                role="gridcell"
                tabIndex={0}
                aria-label={day.count >= 0 ? `${day.date}: ${day.count} ${day.count === 1 ? "activity" : "activities"}` : day.date}
                initial={{ opacity: 0, scale: 0.5 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: wi * 0.02 + di * 0.005 }}
                className={`h-3 w-3 rounded-[2px] ${getColor(day.count)} transition-colors focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-1`}
                title={day.count >= 0 ? `${day.date}: ${day.count} ${day.count === 1 ? "activity" : "activities"}` : ""}
              />
            ))}
          </div>
        ))}
      </div>

      {/* Legend */}
      <div className="flex items-center justify-end gap-1.5 mt-2">
        <span className="text-[9px] text-muted-foreground">Less</span>
        <div className="h-2.5 w-2.5 rounded-[2px] bg-muted" />
        <div className="h-2.5 w-2.5 rounded-[2px] bg-primary/30" />
        <div className="h-2.5 w-2.5 rounded-[2px] bg-primary/50" />
        <div className="h-2.5 w-2.5 rounded-[2px] bg-primary/70" />
        <div className="h-2.5 w-2.5 rounded-[2px] bg-primary" />
        <span className="text-[9px] text-muted-foreground">More</span>
      </div>
    </div>
  );
}
