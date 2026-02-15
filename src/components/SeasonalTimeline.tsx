import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface MonthData {
  month: string;
  short: string;
  phase: "dormant" | "recovery" | "active" | "peak" | "slowing" | "stress";
  tasks: string[];
}

const phaseColors: Record<string, string> = {
  dormant: "bg-lawn-dormant/30",
  recovery: "bg-lawn-caution/20",
  active: "bg-lawn-healthy/30",
  peak: "bg-lawn-healthy/50",
  slowing: "bg-lawn-caution/30",
  stress: "bg-lawn-danger/20",
};

const phaseLabels: Record<string, string> = {
  dormant: "Dormant",
  recovery: "Recovery",
  active: "Active Growth",
  peak: "Peak Growth",
  slowing: "Slowing",
  stress: "Heat Stress",
};

const sampleTimeline: MonthData[] = [
  { month: "January", short: "Jan", phase: "dormant", tasks: [] },
  { month: "February", short: "Feb", phase: "dormant", tasks: ["Plan ahead"] },
  { month: "March", short: "Mar", phase: "recovery", tasks: ["First inspection"] },
  { month: "April", short: "Apr", phase: "active", tasks: ["First mow", "Light feed"] },
  { month: "May", short: "May", phase: "peak", tasks: ["Mow weekly", "Fertilize"] },
  { month: "June", short: "Jun", phase: "peak", tasks: ["Mow weekly", "Water"] },
  { month: "July", short: "Jul", phase: "stress", tasks: ["Raise mow height", "Water deeply"] },
  { month: "August", short: "Aug", phase: "stress", tasks: ["Minimal mowing", "Water deeply"] },
  { month: "September", short: "Sep", phase: "active", tasks: ["Overseed", "Fertilize"] },
  { month: "October", short: "Oct", phase: "active", tasks: ["Mow", "Winterizer"] },
  { month: "November", short: "Nov", phase: "slowing", tasks: ["Last mow", "Clean up"] },
  { month: "December", short: "Dec", phase: "dormant", tasks: [] },
];

export function SeasonalTimeline() {
  const currentMonth = new Date().getMonth();

  return (
    <div className="w-full">
      <div className="flex items-center gap-2 mb-4">
        <h3 className="font-display text-lg font-semibold text-foreground">Seasonal Timeline</h3>
        <span className="text-xs text-muted-foreground">• Cool-Season Zone 5</span>
      </div>

      {/* Legend */}
      <div className="flex flex-wrap gap-3 mb-4">
        {Object.entries(phaseLabels).map(([key, label]) => (
          <span key={key} className="flex items-center gap-1.5 text-xs text-muted-foreground">
            <span className={cn("h-2.5 w-2.5 rounded-sm", phaseColors[key])} />
            {label}
          </span>
        ))}
      </div>

      {/* Timeline */}
      <div className="overflow-x-auto pb-2 -mx-1">
        <div className="flex gap-1.5 min-w-[640px] px-1">
          {sampleTimeline.map((month, index) => (
            <motion.div
              key={month.short}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.04, duration: 0.3 }}
              className={cn(
                "flex-1 rounded-lg p-2.5 relative transition-all min-w-[52px]",
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
                  <p key={task} className="text-[10px] text-muted-foreground text-center leading-tight truncate">
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
