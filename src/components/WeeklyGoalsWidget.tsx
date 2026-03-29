import { useCallback, useState, useMemo } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Target, Plus, Minus, Check, ChevronDown, ChevronUp } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  getWeekStart,
  getWeeklyProgress,
} from "@/lib/journal";
import { useGrassStore } from "@/stores/useGrassStore";
import { haptic } from "@/lib/haptics";
import {
  ACTIVITY_META,
  type ActivityType,
  type WeeklyGoal,
  type JournalEntry,
} from "@/types/journal";

/** Activities that make sense as weekly goals */
const GOAL_ACTIVITIES: ActivityType[] = ["mow", "water", "fertilize", "weed", "seed", "aerate"];

interface WeeklyGoalsWidgetProps {
  entries: JournalEntry[];
}

export function WeeklyGoalsWidget({ entries }: WeeklyGoalsWidgetProps) {
  const [weekStart] = useState(getWeekStart);

  const stored = useGrassStore((s) => s.weeklyGoals);
  const storeSetGoals = useGrassStore((s) => s.setWeeklyGoals);
  const [editing, setEditing] = useState(false);
  const [draftGoals, setDraftGoals] = useState<WeeklyGoal[]>([]);
  const [collapsed, setCollapsed] = useState(false);

  // If goals are from a previous week, treat as no goals set
  const goals = stored && stored.weekStart === weekStart ? stored.goals : null;

  const progress = useMemo(
    () => getWeeklyProgress(entries, weekStart),
    [entries, weekStart],
  );

  const startEditing = useCallback(() => {
    setDraftGoals(
      goals ?? [
        { activity: "mow" as ActivityType, target: 1 },
        { activity: "water" as ActivityType, target: 3 },
      ],
    );
    setEditing(true);
  }, [goals]);

  const updateDraftTarget = useCallback(
    (activity: ActivityType, delta: number) => {
      setDraftGoals((prev) =>
        prev.map((g) =>
          g.activity === activity
            ? { ...g, target: Math.max(0, g.target + delta) }
            : g,
        ),
      );
    },
    [],
  );

  const toggleDraftActivity = useCallback((activity: ActivityType) => {
    setDraftGoals((prev) => {
      const exists = prev.find((g) => g.activity === activity);
      if (exists) return prev.filter((g) => g.activity !== activity);
      return [...prev, { activity, target: 1 }];
    });
  }, []);

  const saveGoals = useCallback(() => {
    const filtered = draftGoals.filter((g) => g.target > 0);
    const data = { goals: filtered, weekStart };
    storeSetGoals(data);
    setEditing(false);
    haptic("success");
    toast.success("Weekly goals set! 🎯");
  }, [draftGoals, weekStart]);

  // If no goals are set and not editing, show a CTA
  if (!goals && !editing) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-6 rounded-xl border border-dashed border-primary/25 bg-primary/5 p-4 flex items-center gap-3"
      >
        <div className="rounded-lg bg-primary/10 p-2 shrink-0">
          <Target aria-hidden="true" className="h-5 w-5 text-primary" />
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium text-foreground">Weekly Goals</p>
          <p className="text-xs text-muted-foreground">
            Set targets like "Mow 1×, Water 3×" to stay on track.
          </p>
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={startEditing}
          className="shrink-0 gap-1 border-primary/20"
        >
          <Target aria-hidden="true" className="h-3.5 w-3.5" />
          Set Goals
        </Button>
      </motion.div>
    );
  }

  // Editing mode
  if (editing) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-6 rounded-xl border border-primary/20 bg-card p-5 shadow-card space-y-4"
      >
        <div className="flex items-center gap-2">
          <Target aria-hidden="true" className="h-5 w-5 text-primary" />
          <h3 className="text-sm font-semibold text-foreground">Set Weekly Goals</h3>
        </div>

        {/* Activity toggles */}
        <div className="flex flex-wrap gap-2">
          {GOAL_ACTIVITIES.map((act) => {
            const meta = ACTIVITY_META[act];
            const active = draftGoals.some((g) => g.activity === act);
            return (
              <button
                key={act}
                onClick={() => toggleDraftActivity(act)}
                aria-pressed={active}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium transition-colors border ${
                  active
                    ? "border-primary/30 bg-primary/10 text-primary"
                    : "border-border bg-card text-muted-foreground hover:bg-primary/5"
                }`}
              >
                <span>{meta.emoji}</span>
                <span>{meta.label.replace(/ed$/, "").replace(/d$/, "")}</span>
              </button>
            );
          })}
        </div>

        {/* Target adjusters */}
        <div className="space-y-2">
          {draftGoals.map((goal) => {
            const meta = ACTIVITY_META[goal.activity];
            return (
              <div
                key={goal.activity}
                className="flex items-center justify-between rounded-lg border border-border bg-background p-3"
              >
                <div className="flex items-center gap-2">
                  <span className="text-lg">{meta.emoji}</span>
                  <span className="text-sm font-medium text-foreground">
                    {meta.label.replace(/ed$/, "").replace(/d$/, "")}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => updateDraftTarget(goal.activity, -1)}
                    className="h-7 w-7 rounded-full border border-border flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-primary/5 transition-colors"
                    aria-label="Decrease target"
                  >
                    <Minus aria-hidden="true" className="h-3.5 w-3.5" />
                  </button>
                  <span className="text-sm font-bold text-foreground w-6 text-center tabular-nums">
                    {goal.target}×
                  </span>
                  <button
                    onClick={() => updateDraftTarget(goal.activity, 1)}
                    className="h-7 w-7 rounded-full border border-border flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-primary/5 transition-colors"
                    aria-label="Increase target"
                  >
                    <Plus aria-hidden="true" className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setEditing(false)}
            className="flex-1"
          >
            Cancel
          </Button>
          <Button size="sm" onClick={saveGoals} className="flex-1 bg-primary gap-1">
            <Check aria-hidden="true" className="h-3.5 w-3.5" />
            Save Goals
          </Button>
        </div>
      </motion.div>
    );
  }

  // Progress display
  const allComplete = goals!.length > 0 && goals!.every(
    (g) => (progress[g.activity] ?? 0) >= g.target,
  );

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      className="mb-6 rounded-xl border border-primary/15 bg-card p-4 shadow-card"
    >
      <button
        onClick={() => setCollapsed((prev) => !prev)}
        className="w-full flex items-center justify-between"
        aria-expanded={!collapsed}
      >
        <div className="flex items-center gap-2">
          <Target aria-hidden="true" className="h-4 w-4 text-primary" />
          <h3 className="text-sm font-semibold text-foreground">Weekly Goals</h3>
          {allComplete && (
            <span className="text-xs px-2 py-0.5 rounded-full bg-green-500/10 text-green-600 dark:text-green-400 font-medium">
              ✓ Complete!
            </span>
          )}
        </div>
        {collapsed ? (
          <ChevronDown aria-hidden="true" className="h-4 w-4 text-muted-foreground" />
        ) : (
          <ChevronUp aria-hidden="true" className="h-4 w-4 text-muted-foreground" />
        )}
      </button>

      <AnimatePresence>
        {!collapsed && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden"
          >
            <div className="mt-3 space-y-2.5">
              {goals!.map((goal) => {
                const meta = ACTIVITY_META[goal.activity];
                const count = progress[goal.activity] ?? 0;
                const pct = Math.min(100, (count / goal.target) * 100);
                const done = count >= goal.target;
                return (
                  <div key={goal.activity} className="flex items-center gap-3">
                    <span className="text-lg shrink-0">{meta.emoji}</span>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-xs font-medium text-foreground">
                          {meta.label.replace(/ed$/, "").replace(/d$/, "")}
                        </span>
                        <span
                          className={`text-xs font-bold tabular-nums ${
                            done ? "text-green-600 dark:text-green-400" : "text-muted-foreground"
                          }`}
                        >
                          {count}/{goal.target}
                        </span>
                      </div>
                      <div className="h-2 rounded-full bg-secondary overflow-hidden">
                        <motion.div
                          initial={{ scaleX: 0 }}
                          animate={{ scaleX: 1 }}
                          transition={{ duration: 0.6, ease: "easeOut" }}
                          className={`h-full rounded-full origin-left ${
                            done ? "bg-green-500" : "bg-primary"
                          }`}
                          style={{ width: `${pct}%` }}
                        />
                      </div>
                    </div>
                    {done && (
                      <Check aria-hidden="true" className="h-4 w-4 text-green-500 shrink-0" />
                    )}
                  </div>
                );
              })}
            </div>

            <div className="mt-3 pt-2 border-t border-primary/10 flex justify-end">
              <button
                onClick={startEditing}
                className="text-xs text-primary hover:underline font-medium"
              >
                Edit goals
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
