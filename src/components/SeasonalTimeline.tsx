import React, { useState, useCallback } from "react";
import { motion, AnimatePresence } from "motion/react";
import { cn } from "@/lib/utils";
import { useProfile } from "@/context/ProfileContext";
import { phaseColors, phaseLabels, getTimelineForRegion } from "@/data/timeline";
import { ChevronLeft, ChevronRight } from "lucide-react";
import type { GrowthPhase } from "@/types/lawn";

const VISIBLE_COUNT = 5;

export const SeasonalTimeline = React.memo(function SeasonalTimeline() {
  const { profile } = useProfile();
  const currentMonth = new Date().getMonth();
  const timeline = getTimelineForRegion(profile.region);

  // Center the window on the current month
  const initialStart = Math.max(0, Math.min(currentMonth - 2, 12 - VISIBLE_COUNT));
  const [windowStart, setWindowStart] = useState(initialStart);

  const canGoBack = windowStart > 0;
  const canGoForward = windowStart + VISIBLE_COUNT < 12;

  const handlePrev = useCallback(() => {
    setWindowStart((s) => Math.max(0, s - 1));
  }, []);

  const handleNext = useCallback(() => {
    setWindowStart((s) => Math.min(12 - VISIBLE_COUNT, s + 1));
  }, []);

  const visibleMonths = timeline.slice(windowStart, windowStart + VISIBLE_COUNT);

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

      {/* Month position indicator */}
      <div className="flex justify-center gap-0 mb-3">
        {timeline.map((_, i) => (
          <button
            key={i}
            type="button"
            aria-label={timeline[i].month}
            onClick={() => setWindowStart(Math.max(0, Math.min(i - 2, 12 - VISIBLE_COUNT)))}
            className="p-2 group"
          >
            <span className={cn(
              "block h-1.5 rounded-full transition-[width,background-color] duration-300",
              i === currentMonth
                ? "w-4 bg-primary"
                : i >= windowStart && i < windowStart + VISIBLE_COUNT
                  ? "w-2 bg-primary/40"
                  : "w-2 bg-muted-foreground/20"
            )} />
          </button>
        ))}
      </div>

      {/* Timeline with arrow navigation */}
      <div className="flex items-stretch gap-2">
        <button
          type="button"
          onClick={handlePrev}
          disabled={!canGoBack}
          aria-label="Previous months"
          className={cn(
            "flex items-center justify-center w-8 shrink-0 rounded-lg transition-colors",
            canGoBack
              ? "text-foreground/70 hover:bg-primary/10 hover:text-primary"
              : "text-muted-foreground/30 cursor-not-allowed"
          )}
        >
          <ChevronLeft aria-hidden="true" className="h-5 w-5" />
        </button>

        <div className="flex-1 grid grid-cols-5 gap-1.5">
          <AnimatePresence mode="popLayout">
            {visibleMonths.map((month, i) => {
              const realIndex = windowStart + i;
              return (
                <motion.div
                  key={month.short}
                  initial={{ opacity: 0, scale: 0.85 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.85 }}
                  transition={{ duration: 0.2 }}
                  className={cn(
                    "rounded-lg p-2.5 relative transition-colors",
                    phaseColors[month.phase],
                    realIndex === currentMonth && "ring-2 ring-primary ring-offset-1 ring-offset-background"
                  )}
                >
                  {realIndex === currentMonth && (
                    <div className="absolute -top-1.5 left-1/2 -translate-x-1/2">
                      <span className="text-[10px]" aria-hidden="true">📍</span>
                    </div>
                  )}
                  <p className={cn(
                    "text-xs font-semibold text-center mb-1.5",
                    realIndex === currentMonth ? "text-primary" : "text-foreground/70"
                  )}>
                    {month.short}
                  </p>
                  <div className="space-y-1">
                    {month.tasks.slice(0, 2).map((task) => (
                      <p key={task} className="text-[10px] text-muted-foreground text-center leading-tight line-clamp-2">
                        {task}
                      </p>
                    ))}
                    {month.tasks.length === 0 && (
                      <p className="text-[10px] text-muted-foreground/50 text-center italic">—</p>
                    )}
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>

        <button
          type="button"
          onClick={handleNext}
          disabled={!canGoForward}
          aria-label="Next months"
          className={cn(
            "flex items-center justify-center w-8 shrink-0 rounded-lg transition-colors",
            canGoForward
              ? "text-foreground/70 hover:bg-primary/10 hover:text-primary"
              : "text-muted-foreground/30 cursor-not-allowed"
          )}
        >
          <ChevronRight aria-hidden="true" className="h-5 w-5" />
        </button>
      </div>
    </div>
  );
});
