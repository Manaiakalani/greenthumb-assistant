import {
  useCallback,
  useEffect,
  useMemo,
  useState,
  type FormEvent,
} from "react";
import { AnimatePresence, motion } from "motion/react";
import { Flame, Plus, Trophy, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { useGrassStore } from "@/stores/useGrassStore";
import { getWeekStart, getWeeklyProgress } from "@/lib/journal";
import {
  ACTIVITY_META,
  ACTIVITY_TYPES,
  type ActivityType,
} from "@/types/journal";
import type { WeeklyGoal, WeeklyGoals } from "@/types/journal";

// ---------------------------------------------------------------------------
// Streak calculation helpers
// ---------------------------------------------------------------------------

/** ISO week key for a date (Monday-based) */
function weekKey(date: Date): string {
  const d = new Date(date);
  const day = d.getDay();
  const diff = day === 0 ? -6 : 1 - day;
  d.setDate(d.getDate() + diff);
  return d.toISOString().split("T")[0];
}

interface StreakInfo {
  current: number;
  longest: number;
}

/** Calculate weekly streaks — consecutive ISO weeks with ≥ 1 activity */
function calculateWeeklyStreaks(
  dates: string[],
): StreakInfo {
  if (!dates.length) return { current: 0, longest: 0 };

  const weeks = new Set(dates.map((d) => weekKey(new Date(d + "T12:00:00"))));
  const sorted = [...weeks].sort();
  if (!sorted.length) return { current: 0, longest: 0 };

  // Build runs of consecutive weeks
  const runs: number[] = [];
  let run = 1;
  for (let i = 1; i < sorted.length; i++) {
    const prev = new Date(sorted[i - 1] + "T12:00:00");
    const curr = new Date(sorted[i] + "T12:00:00");
    const diffDays = Math.round(
      (curr.getTime() - prev.getTime()) / (1000 * 60 * 60 * 24),
    );
    if (diffDays === 7) {
      run++;
    } else {
      runs.push(run);
      run = 1;
    }
  }
  runs.push(run);

  const longest = Math.max(...runs);

  // Current streak: last run must include this week or last week
  const thisWeek = weekKey(new Date());
  const lastWeekDate = new Date();
  lastWeekDate.setDate(lastWeekDate.getDate() - 7);
  const lastWeek = weekKey(lastWeekDate);
  const lastSorted = sorted[sorted.length - 1];
  const current =
    lastSorted === thisWeek || lastSorted === lastWeek
      ? runs[runs.length - 1]
      : 0;

  return { current, longest };
}

/** Per-activity weekly streaks */
function activityStreaks(
  entries: { date: string; activity: string }[],
): Record<string, StreakInfo> {
  const byActivity: Record<string, string[]> = {};
  for (const e of entries) {
    (byActivity[e.activity] ??= []).push(e.date);
  }
  const result: Record<string, StreakInfo> = {};
  for (const [activity, dates] of Object.entries(byActivity)) {
    result[activity] = calculateWeeklyStreaks(dates);
  }
  return result;
}

// ---------------------------------------------------------------------------
// Progress Ring SVG
// ---------------------------------------------------------------------------

interface ProgressRingProps {
  progress: number; // 0–1
  size?: number;
  strokeWidth?: number;
  className?: string;
  children?: React.ReactNode;
}

function ProgressRing({
  progress,
  size = 72,
  strokeWidth = 5,
  className,
  children,
}: ProgressRingProps) {
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference * (1 - Math.min(progress, 1));

  return (
    <div className={cn("relative inline-flex items-center justify-center", className)}>
      <svg
        width={size}
        height={size}
        className="-rotate-90"
        aria-hidden="true"
      >
        {/* Background track */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="currentColor"
          strokeWidth={strokeWidth}
          className="text-muted/30"
        />
        {/* Progress arc */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="currentColor"
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          className={cn(
            "transition-[stroke-dashoffset] duration-700 ease-out",
            progress >= 1 ? "text-lawn-healthy" : "text-primary",
          )}
        />
      </svg>
      <div className="absolute inset-0 flex items-center justify-center">
        {children}
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Goal Editor (inline form)
// ---------------------------------------------------------------------------

interface GoalEditorProps {
  initial: WeeklyGoal[];
  onSave: (goals: WeeklyGoal[]) => void;
  onCancel: () => void;
}

function GoalEditor({ initial, onSave, onCancel }: GoalEditorProps) {
  const [goals, setGoals] = useState<WeeklyGoal[]>(
    initial.length
      ? initial
      : [{ activity: "mow" as ActivityType, target: 1 }],
  );

  const addGoal = () => {
    const used = new Set(goals.map((g) => g.activity));
    const next = ACTIVITY_TYPES.find((a) => !used.has(a));
    if (next) setGoals((prev) => [...prev, { activity: next, target: 1 }]);
  };

  const removeGoal = (idx: number) =>
    setGoals((prev) => prev.filter((_, i) => i !== idx));

  const updateGoal = (idx: number, patch: Partial<WeeklyGoal>) =>
    setGoals((prev) =>
      prev.map((g, i) => (i === idx ? { ...g, ...patch } : g)),
    );

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    onSave(goals.filter((g) => g.target > 0));
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      {goals.map((g, idx) => (
        <div key={idx} className="flex items-center gap-2">
          <label htmlFor={`goal-activity-${idx}`} className="sr-only">
            Activity
          </label>
          <select
            id={`goal-activity-${idx}`}
            name={`goal-activity-${idx}`}
            value={g.activity}
            onChange={(e) =>
              updateGoal(idx, { activity: e.target.value as ActivityType })
            }
            className="flex-1 rounded-lg border bg-background px-2 py-1.5 text-sm text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            {ACTIVITY_TYPES.map((a) => (
              <option key={a} value={a}>
                {ACTIVITY_META[a].emoji} {ACTIVITY_META[a].label}
              </option>
            ))}
          </select>

          <span className="text-xs text-muted-foreground" aria-hidden="true">×</span>

          <label htmlFor={`goal-target-${idx}`} className="sr-only">
            Target count
          </label>
          <input
            id={`goal-target-${idx}`}
            name={`goal-target-${idx}`}
            type="number"
            min={1}
            max={30}
            value={g.target}
            onChange={(e) =>
              updateGoal(idx, {
                target: Math.max(1, parseInt(e.target.value, 10) || 1),
              })
            }
            className="w-14 rounded-lg border bg-background px-2 py-1.5 text-center text-sm tabular-nums text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          />

          <button
            type="button"
            onClick={() => removeGoal(idx)}
            className="rounded p-1 text-muted-foreground transition-colors hover:text-destructive focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            aria-label="Remove goal"
          >
            <X aria-hidden="true" className="h-3.5 w-3.5" />
          </button>
        </div>
      ))}

      {goals.length < ACTIVITY_TYPES.length && (
        <button
          type="button"
          onClick={addGoal}
          className="inline-flex items-center gap-1 text-xs text-primary transition-colors hover:text-primary/80 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        >
          <Plus aria-hidden="true" className="h-3.5 w-3.5" />
          Add goal
        </button>
      )}

      <div className="flex gap-2 pt-1">
        <button
          type="submit"
          className="rounded-lg bg-primary px-3 py-1.5 text-xs font-medium text-primary-foreground transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        >
          Save Goals
        </button>
        <button
          type="button"
          onClick={onCancel}
          className="rounded-lg bg-muted px-3 py-1.5 text-xs font-medium text-muted-foreground transition-colors hover:bg-muted/80 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        >
          Cancel
        </button>
      </div>
    </form>
  );
}

// ---------------------------------------------------------------------------
// Main component
// ---------------------------------------------------------------------------

interface ActivityStreaksProps {
  className?: string;
}

export function ActivityStreaks({ className }: ActivityStreaksProps) {
  const journal = useGrassStore((s) => s.journal);
  const weeklyGoals = useGrassStore((s) => s.weeklyGoals);
  const setWeeklyGoals = useGrassStore((s) => s.setWeeklyGoals);

  const [editing, setEditing] = useState(false);
  const [celebratingIdx, setCelebratingIdx] = useState<number | null>(null);

  // ── Auto-reset goals each Monday ────────────────────
  const currentWeekStart = useMemo(() => getWeekStart(), []);

  useEffect(() => {
    if (weeklyGoals && weeklyGoals.weekStart !== currentWeekStart) {
      setWeeklyGoals({ ...weeklyGoals, weekStart: currentWeekStart });
    }
  }, [weeklyGoals, currentWeekStart, setWeeklyGoals]);

  // ── Streak data ─────────────────────────────────────
  const allDates = useMemo(
    () => journal.map((e) => e.date),
    [journal],
  );

  const overallStreak = useMemo(
    () => calculateWeeklyStreaks(allDates),
    [allDates],
  );

  const perActivity = useMemo(() => activityStreaks(journal), [journal]);

  // Top 3 activity streaks (by current streak, descending)
  const topActivityStreaks = useMemo(() => {
    return Object.entries(perActivity)
      .filter(([, s]) => s.current > 0)
      .sort((a, b) => b[1].current - a[1].current)
      .slice(0, 3);
  }, [perActivity]);

  // ── Weekly progress ─────────────────────────────────
  const progress = useMemo(
    () => getWeeklyProgress(journal, currentWeekStart),
    [journal, currentWeekStart],
  );

  // ── Flame scale based on streak ─────────────────────
  const flameScale = Math.min(1 + overallStreak.current * 0.12, 2.2);

  // ── Celebration trigger ─────────────────────────────
  useEffect(() => {
    if (!weeklyGoals?.goals.length) return;
    const idx = weeklyGoals.goals.findIndex((g) => {
      const done = progress[g.activity] ?? 0;
      return done >= g.target;
    });
    if (idx !== -1 && celebratingIdx !== idx) {
      const timer = setTimeout(() => {
        setCelebratingIdx(idx);
        setTimeout(() => setCelebratingIdx(null), 2000);
      }, 0);
      return () => clearTimeout(timer);
    }
  }, [weeklyGoals, progress, celebratingIdx]);

  // ── Save goals handler ─────────────────────────────
  const handleSaveGoals = useCallback(
    (goals: WeeklyGoal[]) => {
      setWeeklyGoals({ goals, weekStart: currentWeekStart });
      setEditing(false);
    },
    [setWeeklyGoals, currentWeekStart],
  );

  return (
    <div
      className={cn(
        "rounded-xl border bg-card p-5 shadow-card space-y-5",
        className,
      )}
    >
      {/* ── Streak Section ─────────────────────────── */}
      <div className="flex items-start gap-4">
        {/* Animated flame */}
        <motion.div
          animate={{ scale: [flameScale * 0.92, flameScale, flameScale * 0.92] }}
          transition={{ repeat: Infinity, duration: 1.6, ease: "easeInOut" }}
          className="flex-shrink-0"
        >
          <span
            aria-hidden="true"
            className="text-3xl"
            style={{ display: "inline-block" }}
          >
            🔥
          </span>
        </motion.div>

        <div className="flex-1 min-w-0">
          <div className="flex items-baseline gap-2">
            <span className="font-display text-3xl font-bold tabular-nums text-foreground">
              {overallStreak.current}
            </span>
            <span className="text-sm text-muted-foreground">
              week{overallStreak.current !== 1 ? "s" : ""} streak
            </span>
          </div>

          {overallStreak.longest > 0 && (
            <motion.span
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              className="mt-1 inline-flex items-center gap-1 rounded-full bg-amber-500/10 px-2 py-0.5 text-xs font-medium text-amber-600 dark:text-amber-400"
            >
              <Trophy aria-hidden="true" className="h-3 w-3" />
              Personal Best: {overallStreak.longest} week
              {overallStreak.longest !== 1 ? "s" : ""}
            </motion.span>
          )}
        </div>
      </div>

      {/* Per-activity streaks */}
      {topActivityStreaks.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {topActivityStreaks.map(([activity, info]) => {
            const meta = ACTIVITY_META[activity as ActivityType];
            return (
              <span
                key={activity}
                className="inline-flex items-center gap-1.5 rounded-full border bg-background px-2.5 py-1 text-xs"
              >
                <span aria-hidden="true">{meta?.emoji}</span>
                <span className="font-medium tabular-nums">
                  {info.current}w
                </span>
                <span className="text-muted-foreground">
                  {meta?.label ?? activity}
                </span>
              </span>
            );
          })}
        </div>
      )}

      {/* ── Divider ────────────────────────────────── */}
      <hr className="border-border" />

      {/* ── Weekly Goals Section ────────────────────── */}
      <div>
        <div className="mb-3 flex items-center justify-between">
          <h3 className="font-display text-sm font-semibold text-foreground">
            Weekly Goals
          </h3>
          {!editing && (
            <button
              type="button"
              onClick={() => setEditing(true)}
              className="text-xs text-primary transition-colors hover:text-primary/80 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded"
            >
              {weeklyGoals?.goals.length ? "Edit" : "Set Goals"}
            </button>
          )}
        </div>

        <AnimatePresence mode="wait">
          {editing ? (
            <motion.div
              key="editor"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.25 }}
            >
              <GoalEditor
                initial={weeklyGoals?.goals ?? []}
                onSave={handleSaveGoals}
                onCancel={() => setEditing(false)}
              />
            </motion.div>
          ) : weeklyGoals?.goals.length ? (
            <motion.div
              key="rings"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex flex-wrap gap-4"
            >
              {weeklyGoals.goals.map((goal, idx) => {
                const done = progress[goal.activity] ?? 0;
                const pct = goal.target > 0 ? done / goal.target : 0;
                const meta = ACTIVITY_META[goal.activity];
                const complete = done >= goal.target;
                const celebrating = celebratingIdx === idx && complete;

                return (
                  <motion.div
                    key={goal.activity}
                    className="flex flex-col items-center gap-1"
                    animate={
                      celebrating
                        ? { scale: [1, 1.15, 1], rotate: [0, -5, 5, 0] }
                        : {}
                    }
                    transition={{ duration: 0.5 }}
                  >
                    <ProgressRing progress={pct}>
                      <div className="text-center">
                        <span
                          aria-hidden="true"
                          className="text-lg leading-none"
                        >
                          {meta.emoji}
                        </span>
                        <span className="block text-[10px] font-medium tabular-nums text-muted-foreground">
                          {done}/{goal.target}
                        </span>
                      </div>
                    </ProgressRing>

                    <span className="text-[11px] font-medium text-muted-foreground">
                      {meta.label}
                    </span>

                    {complete && (
                      <motion.span
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.2, ease: [0.23, 1, 0.32, 1] }}
                        className="text-xs text-lawn-healthy"
                      >
                        ✓ Done!
                      </motion.span>
                    )}
                  </motion.div>
                );
              })}
            </motion.div>
          ) : (
            <motion.p
              key="empty"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-sm text-muted-foreground"
            >
              No goals set yet — tap &quot;Set Goals&quot; to get started.
            </motion.p>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
