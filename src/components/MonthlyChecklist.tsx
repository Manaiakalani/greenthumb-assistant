import React, { useState, useCallback, useMemo } from "react";
import { motion, AnimatePresence } from "motion/react";
import { cn } from "@/lib/utils";
import { useProfile } from "@/context/ProfileContext";
import { safeGetItem, safeSetItem } from "@/lib/safeStorage";
import {
  getTasksForMonth,
  MONTH_NAMES,
  CATEGORY_LABELS,
  type MonthlyTask,
} from "@/data/monthlyTasks";
import ChevronLeft from "lucide-react/dist/esm/icons/chevron-left";
import ChevronRight from "lucide-react/dist/esm/icons/chevron-right";
import CheckCircle2 from "lucide-react/dist/esm/icons/check-circle-2";
import Circle from "lucide-react/dist/esm/icons/circle";
import ClipboardList from "lucide-react/dist/esm/icons/clipboard-list";

type Category = MonthlyTask["category"];

const PRIORITY_STYLES: Record<MonthlyTask["priority"], string> = {
  essential: "bg-lawn-healthy/15 text-lawn-healthy",
  recommended: "bg-primary/15 text-primary",
  optional: "bg-muted text-muted-foreground",
};

const CATEGORY_ICONS: Record<Category, string> = {
  mowing: "🌿",
  watering: "💧",
  fertilizing: "🧪",
  maintenance: "🔧",
  seeding: "🌱",
  "pest-control": "🛡️",
};

function storageKey(year: number, month: number) {
  return `grasswise-checklist-${year}-${month}`;
}

export const MonthlyChecklist = React.memo(function MonthlyChecklist() {
  const { profile } = useProfile();
  const now = new Date();

  const [viewMonth, setViewMonth] = useState(now.getMonth() + 1); // 1-12
  const [viewYear, setViewYear] = useState(now.getFullYear());
  const [activeCategory, setActiveCategory] = useState<Category | null>(null);

  // Checked task IDs for the displayed month
  const [checked, setChecked] = useState<Set<string>>(() => {
    const saved = safeGetItem<string[]>(storageKey(viewYear, viewMonth), []);
    return new Set(saved);
  });

  // Reload checked state when month/year changes
  const loadChecked = useCallback((y: number, m: number) => {
    const saved = safeGetItem<string[]>(storageKey(y, m), []);
    setChecked(new Set(saved));
  }, []);

  const navigateMonth = useCallback(
    (delta: number) => {
      let m = viewMonth + delta;
      let y = viewYear;
      if (m < 1) { m = 12; y -= 1; }
      if (m > 12) { m = 1; y += 1; }
      setViewMonth(m);
      setViewYear(y);
      loadChecked(y, m);
    },
    [viewMonth, viewYear, loadChecked],
  );

  const toggleTask = useCallback(
    (id: string) => {
      setChecked((prev) => {
        const next = new Set(prev);
        if (next.has(id)) next.delete(id);
        else next.add(id);
        safeSetItem(storageKey(viewYear, viewMonth), Array.from(next));
        return next;
      });
    },
    [viewYear, viewMonth],
  );

  const tasks = useMemo(
    () => getTasksForMonth(viewMonth, profile.region),
    [viewMonth, profile.region],
  );

  const filteredTasks = useMemo(
    () => (activeCategory ? tasks.filter((t) => t.category === activeCategory) : tasks),
    [tasks, activeCategory],
  );

  const completedCount = tasks.filter((t) => checked.has(t.id)).length;
  const progress = tasks.length > 0 ? (completedCount / tasks.length) * 100 : 0;

  // Unique categories present this month
  const categories = useMemo(() => {
    const set = new Set(tasks.map((t) => t.category));
    return Array.from(set) as Category[];
  }, [tasks]);

  const isCurrentMonth =
    viewMonth === now.getMonth() + 1 && viewYear === now.getFullYear();

  return (
    <section
      className="rounded-xl border border-primary/15 bg-card p-5 shadow-card"
      aria-label="Monthly lawn care checklist"
    >
      {/* Header */}
      <div className="flex items-center gap-3 mb-4">
        <div className="rounded-lg bg-primary/10 p-2.5">
          <ClipboardList aria-hidden="true" className="h-5 w-5 text-primary" />
        </div>
        <div className="flex-1 min-w-0">
          <h2 className="font-display text-lg font-semibold text-foreground [text-wrap:balance]">
            Monthly Checklist
          </h2>
          <p className="text-xs text-muted-foreground">
            {profile.region} &middot; Zone {profile.zone}
          </p>
        </div>
      </div>

      {/* Month navigation */}
      <div className="flex items-center justify-between mb-4">
        <button
          type="button"
          onClick={() => navigateMonth(-1)}
          aria-label="Previous month"
          className="flex items-center justify-center min-h-[44px] min-w-[44px] rounded-lg transition-colors text-foreground/70 hover:bg-primary/10 hover:text-primary"
        >
          <ChevronLeft aria-hidden="true" className="h-5 w-5" />
        </button>

        <span className={cn(
          "font-display text-base font-semibold",
          isCurrentMonth ? "text-primary" : "text-foreground",
        )}>
          {MONTH_NAMES[viewMonth - 1]} {viewYear}
        </span>

        <button
          type="button"
          onClick={() => navigateMonth(1)}
          aria-label="Next month"
          className="flex items-center justify-center min-h-[44px] min-w-[44px] rounded-lg transition-colors text-foreground/70 hover:bg-primary/10 hover:text-primary"
        >
          <ChevronRight aria-hidden="true" className="h-5 w-5" />
        </button>
      </div>

      {/* Progress bar */}
      <div className="mb-4">
        <div className="flex items-center justify-between text-xs text-muted-foreground mb-1.5">
          <span>{completedCount} of {tasks.length} completed</span>
          <span className="tabular-nums">{Math.round(progress)}%</span>
        </div>
        <div className="h-2 w-full rounded-full bg-muted overflow-hidden">
          <motion.div
            className="h-full rounded-full bg-primary"
            initial={false}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.35, ease: "easeOut" }}
          />
        </div>
      </div>

      {/* Category filter pills */}
      {categories.length > 1 && (
        <div className="flex flex-wrap gap-1.5 mb-4" role="group" aria-label="Filter by category">
          <button
            type="button"
            onClick={() => setActiveCategory(null)}
            className={cn(
              "rounded-full px-3 py-1.5 text-xs font-medium transition-colors min-h-[32px] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
              activeCategory === null
                ? "bg-primary text-primary-foreground"
                : "bg-muted text-muted-foreground hover:bg-muted/80",
            )}
          >
            All
          </button>
          {categories.map((cat) => (
            <button
              key={cat}
              type="button"
              onClick={() => setActiveCategory(activeCategory === cat ? null : cat)}
              className={cn(
                "rounded-full px-3 py-1.5 text-xs font-medium transition-colors min-h-[32px] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
                activeCategory === cat
                  ? "bg-primary text-primary-foreground"
                  : "bg-muted text-muted-foreground hover:bg-muted/80",
              )}
            >
              <span aria-hidden="true">{CATEGORY_ICONS[cat]} </span>
              {CATEGORY_LABELS[cat]}
            </button>
          ))}
        </div>
      )}

      {/* Task list */}
      <ul className="space-y-2" role="list">
        <AnimatePresence mode="popLayout">
          {filteredTasks.map((task) => {
            const done = checked.has(task.id);
            return (
              <motion.li
                key={task.id}
                layout
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.2 }}
              >
                <button
                  type="button"
                  onClick={() => toggleTask(task.id)}
                  aria-label={`${done ? "Uncheck" : "Check"}: ${task.title}`}
                  className={cn(
                    "flex w-full items-start gap-3 rounded-lg p-3 text-left transition-colors min-h-[44px]",
                    done
                      ? "bg-primary/5 opacity-70"
                      : "hover:bg-muted/50",
                  )}
                >
                  {done ? (
                    <CheckCircle2
                      aria-hidden="true"
                      className="mt-0.5 h-5 w-5 shrink-0 text-primary"
                    />
                  ) : (
                    <Circle
                      aria-hidden="true"
                      className="mt-0.5 h-5 w-5 shrink-0 text-muted-foreground"
                    />
                  )}

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span
                        className={cn(
                          "text-sm font-medium",
                          done ? "line-through text-muted-foreground" : "text-foreground",
                        )}
                      >
                        {task.title}
                      </span>
                      <span
                        className={cn(
                          "inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-semibold leading-none",
                          PRIORITY_STYLES[task.priority],
                        )}
                      >
                        {task.priority}
                      </span>
                    </div>
                    <p className="mt-1 text-xs text-muted-foreground leading-relaxed">
                      {task.description}
                    </p>
                  </div>
                </button>
              </motion.li>
            );
          })}
        </AnimatePresence>

        {filteredTasks.length === 0 && (
          <li className="py-8 text-center text-sm text-muted-foreground">
            No tasks for this month{activeCategory ? ` in ${CATEGORY_LABELS[activeCategory]}` : ""}.
          </li>
        )}
      </ul>
    </section>
  );
});
