import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { useProfile } from "@/context/ProfileContext";
import { phaseColors, phaseLabels, getTimelineForRegion } from "@/data/timeline";
import type { GrowthPhase } from "@/types/lawn";

export function SeasonalTimeline() {
  const { profile } = useProfile();
  const currentMonth = new Date().getMonth();
  const timeline = getTimelineForRegion(profile.region);

  return (
    <div className="w-full">
      <div className="flex items-center gap-2 mb-4">
        <h3 className="font-display text-lg font-semibold text-foreground">Seasonal Timeline</h3>
        <span className="text-xs text-muted-foreground">• {profile.region} Zone {profile.zone}</span>
      </div>

      {/* Legend */}
      <div className="flex flex-wrap gap-3 mb-5">
        {(Object.entries(phaseLabels) as [GrowthPhase, string][]).map(([key, label]) => (
          <span key={key} className="flex items-center gap-1.5 text-xs text-muted-foreground">
            <span className={cn("h-2.5 w-2.5 rounded-sm", phaseColors[key])} />
            {label}
          </span>
        ))}
      </div>

      {/* Timeline */}
      <div className="overflow-x-auto pt-3 pb-3 -mx-2">
        <div className="flex gap-1.5 min-w-[780px] px-2">
          {timeline.map((month, index) => (
            <motion.div
              key={month.short}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.04, duration: 0.3 }}
              className={cn(
                "flex-1 rounded-lg p-2 relative transition-all min-w-[62px]",
                phaseColors[month.phase],
                index === currentMonth && "ring-2 ring-primary ring-offset-1 ring-offset-background"
              )}
            >
              <p className={cn(
                "text-xs font-semibold text-center mb-1",
                index === currentMonth ? "text-primary" : "text-foreground/70"
              )}>
                {month.short}
              </p>
              {index === currentMonth && (
                <div className="absolute -top-1.5 left-1/2 -translate-x-1/2">
                  <span className="text-[10px]">📍</span>
                </div>
              )}
              <div className="space-y-0.5">
                {month.tasks.slice(0, 2).map((task) => (
                  <p key={task} className="text-[10px] text-muted-foreground text-center leading-tight line-clamp-2">
                    {task}
                  </p>
                ))}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
