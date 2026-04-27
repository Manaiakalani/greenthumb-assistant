import { useState, useCallback, useMemo } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  BookOpen,
  Clock,
  ChevronRight,
  ChevronLeft,
  CheckCircle2,
  Lightbulb,
  ArrowLeft,
  Ruler,
  Route,
  CalendarDays,
  Recycle,
  Scissors,
  Sunrise,
  Timer,
  ArrowDownToLine,
  CloudRain,
  FlaskConical,
  Shovel,
  FileSearch,
  Beaker,
  RefreshCw,
  Wind,
  Sprout,
  Leaf,
  ArrowDown,
  Trash2,
  Shield,
  Flower2,
  Search,
  SearchCheck,
  Droplets,
  Mountain,
  Bug,
  TreePine,
  Snowflake,
  Warehouse,
  NotebookPen,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { tutorials, type Tutorial } from "@/data/tutorials";

/* ── Icon map ─────────────────────────────────────────────── */
const iconMap: Record<string, LucideIcon> = {
  Ruler,
  Route,
  CalendarDays,
  Recycle,
  Scissors,
  Sunrise,
  Timer,
  ArrowDownToLine,
  CloudRain,
  FlaskConical,
  Shovel,
  FileSearch,
  Beaker,
  RefreshCw,
  Wind,
  Sprout,
  Leaf,
  ArrowDown,
  Trash2,
  Shield,
  Flower2,
  Search,
  SearchCheck,
  Droplets,
  Mountain,
  Bug,
  TreePine,
  Snowflake,
  Warehouse,
  NotebookPen,
};

function StepIcon({ name }: { name: string }) {
  const Icon = iconMap[name] ?? BookOpen;
  return <Icon aria-hidden="true" className="h-5 w-5" />;
}

/* ── localStorage helpers ─────────────────────────────────── */
const STORAGE_KEY = "grasswise-completed-tutorials";

function getCompletedIds(): string[] {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) ?? "[]");
  } catch {
    return [];
  }
}

function setCompletedIds(ids: string[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(ids));
}

/* ── Category helpers ─────────────────────────────────────── */
type Category = Tutorial["category"];

const CATEGORIES: { value: Category | "all"; label: string }[] = [
  { value: "all", label: "All" },
  { value: "basics", label: "Basics" },
  { value: "seasonal", label: "Seasonal" },
  { value: "advanced", label: "Advanced" },
];

const categoryBadge: Record<Category, string> = {
  basics: "bg-green-100 text-green-700 border-green-200 dark:bg-green-900/30 dark:text-green-400 dark:border-green-800",
  seasonal: "bg-amber-100 text-amber-700 border-amber-200 dark:bg-amber-900/30 dark:text-amber-400 dark:border-amber-800",
  advanced: "bg-purple-100 text-purple-700 border-purple-200 dark:bg-purple-900/30 dark:text-purple-400 dark:border-purple-800",
};

const categoryLabel: Record<Category, string> = {
  basics: "Basics",
  seasonal: "Seasonal",
  advanced: "Advanced",
};

/* ── Sub-components ───────────────────────────────────────── */

function CategoryBadge({ category }: { category: Category }) {
  return (
    <span
      className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-medium ${categoryBadge[category]}`}
    >
      {categoryLabel[category]}
    </span>
  );
}

/* ── Tutorial Card ────────────────────────────────────────── */

interface TutorialCardProps {
  tutorial: Tutorial;
  completed: boolean;
  onSelect: (t: Tutorial) => void;
  index: number;
}

function TutorialCard({ tutorial, completed, onSelect, index }: TutorialCardProps) {
  return (
    <motion.button
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.04 }}
      onClick={() => onSelect(tutorial)}
      className="w-full text-left rounded-xl border border-primary/15 bg-card p-5 shadow-card hover:shadow-card-hover transition-shadow focus-visible:ring-2 focus-visible:ring-primary focus-visible:outline-none"
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap mb-1.5">
            <CategoryBadge category={tutorial.category} />
            {completed && (
              <span className="inline-flex items-center gap-1 text-xs font-medium text-green-600 dark:text-green-400">
                <CheckCircle2 aria-hidden="true" className="h-3.5 w-3.5" />
                Done
              </span>
            )}
          </div>
          <h3 className="font-display font-semibold text-foreground leading-snug">
            {tutorial.title}
          </h3>
          <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
            {tutorial.description}
          </p>
          <div className="flex items-center gap-3 mt-2 text-xs text-muted-foreground">
            <span className="inline-flex items-center gap-1">
              <Clock aria-hidden="true" className="h-3.5 w-3.5" />
              {tutorial.estimatedMinutes} min
            </span>
            <span>{tutorial.steps.length} steps</span>
          </div>
        </div>
        <ChevronRight
          aria-hidden="true"
          className="h-5 w-5 text-muted-foreground shrink-0 mt-1"
        />
      </div>
    </motion.button>
  );
}

/* ── Step View ────────────────────────────────────────────── */

interface StepViewProps {
  tutorial: Tutorial;
  completed: boolean;
  onBack: () => void;
  onComplete: (id: string) => void;
}

function StepView({ tutorial, completed, onBack, onComplete }: StepViewProps) {
  const [step, setStep] = useState(0);
  const current = tutorial.steps[step];
  const isLast = step === tutorial.steps.length - 1;

  return (
    <div>
      {/* Header */}
      <button
        onClick={onBack}
        className="inline-flex items-center gap-1.5 text-sm font-medium text-primary hover:text-primary/80 transition-colors mb-4 focus-visible:ring-2 focus-visible:ring-primary focus-visible:outline-none rounded"
      >
        <ArrowLeft aria-hidden="true" className="h-4 w-4" />
        All Tutorials
      </button>

      <h2 className="font-display text-xl font-bold text-foreground mb-1">
        {tutorial.title}
      </h2>
      <p className="text-sm text-muted-foreground mb-5">
        {tutorial.description}
      </p>

      {/* Progress dots */}
      <div className="flex items-center gap-1.5 mb-6" role="tablist" aria-label="Tutorial steps">
        {tutorial.steps.map((s, i) => (
          <button
            key={i}
            role="tab"
            aria-selected={i === step}
            aria-label={`Step ${i + 1}: ${s.title}`}
            onClick={() => setStep(i)}
            className={`h-2 rounded-full transition-[width,background-color] duration-200 ease-out focus-visible:ring-2 focus-visible:ring-primary focus-visible:outline-none ${
              i === step
                ? "w-6 bg-primary"
                : i < step
                  ? "w-2 bg-primary/40"
                  : "w-2 bg-muted-foreground/20"
            }`}
          />
        ))}
      </div>

      {/* Step content */}
      <AnimatePresence mode="wait">
        <motion.div
          key={step}
          initial={{ opacity: 0, x: 30 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -30 }}
          transition={{ duration: 0.25 }}
          className="rounded-xl border border-primary/15 bg-card p-6 shadow-card"
        >
          {/* Step number + icon */}
          <div className="flex items-center gap-3 mb-4">
            <div className="flex items-center justify-center h-10 w-10 rounded-full bg-primary/15 text-primary font-display font-bold text-lg shrink-0">
              {step + 1}
            </div>
            <div className="flex items-center gap-2">
              <div className="rounded-lg bg-primary/10 p-1.5 text-primary">
                <StepIcon name={current.icon} />
              </div>
              <h3 className="font-display font-semibold text-foreground text-lg">
                {current.title}
              </h3>
            </div>
          </div>

          <p className="text-sm text-muted-foreground leading-relaxed">
            {current.description}
          </p>

          {/* Pro tip */}
          {current.tip ? (
            <div className="mt-4 rounded-lg border border-amber-200 bg-amber-50 p-3 dark:border-amber-800 dark:bg-amber-900/20">
              <div className="flex items-start gap-2">
                <Lightbulb
                  aria-hidden="true"
                  className="h-4 w-4 text-amber-600 dark:text-amber-400 mt-0.5 shrink-0"
                />
                <p className="text-xs text-amber-800 dark:text-amber-300 leading-relaxed">
                  <span className="font-semibold">Pro tip:</span> {current.tip}
                </p>
              </div>
            </div>
          ) : null}
        </motion.div>
      </AnimatePresence>

      {/* Navigation */}
      <div className="flex items-center justify-between mt-5">
        <button
          onClick={() => setStep((s) => s - 1)}
          disabled={step === 0}
          className="inline-flex items-center gap-1.5 rounded-lg px-4 py-2 text-sm font-medium text-foreground bg-muted/50 hover:bg-muted transition-colors disabled:opacity-30 disabled:cursor-not-allowed focus-visible:ring-2 focus-visible:ring-primary focus-visible:outline-none"
        >
          <ChevronLeft aria-hidden="true" className="h-4 w-4" />
          Previous
        </button>

        {isLast ? (
          <button
            onClick={() => onComplete(tutorial.id)}
            disabled={completed}
            className="inline-flex items-center gap-1.5 rounded-lg px-4 py-2 text-sm font-semibold bg-primary text-primary-foreground hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed focus-visible:ring-2 focus-visible:ring-primary focus-visible:outline-none"
          >
            <CheckCircle2 aria-hidden="true" className="h-4 w-4" />
            {completed ? "Completed ✓" : "Mark as Complete"}
          </button>
        ) : (
          <button
            onClick={() => setStep((s) => s + 1)}
            className="inline-flex items-center gap-1.5 rounded-lg px-4 py-2 text-sm font-medium text-primary-foreground bg-primary hover:bg-primary/90 transition-colors focus-visible:ring-2 focus-visible:ring-primary focus-visible:outline-none"
          >
            Next
            <ChevronRight aria-hidden="true" className="h-4 w-4" />
          </button>
        )}
      </div>
    </div>
  );
}

/* ── Main Component ───────────────────────────────────────── */

export function GuidedTutorial() {
  const [completedIds, setCompleted] = useState<string[]>(getCompletedIds);
  const [activeFilter, setActiveFilter] = useState<Category | "all">("all");
  const [selected, setSelected] = useState<Tutorial | null>(null);

  // O(1) lookup Set derived from completedIds array
  const completedSet = useMemo(() => new Set(completedIds), [completedIds]);

  const filtered = useMemo(
    () =>
      activeFilter === "all"
        ? tutorials
        : tutorials.filter((t) => t.category === activeFilter),
    [activeFilter],
  );

  const handleComplete = useCallback((id: string) => {
    setCompleted((prev) => {
      if (prev.includes(id)) return prev;
      const next = [...prev, id];
      setCompletedIds(next);
      return next;
    });
  }, []);

  /* ── Step-by-step view ── */
  if (selected) {
    return (
      <StepView
        tutorial={selected}
        completed={completedSet.has(selected.id)}
        onBack={() => setSelected(null)}
        onComplete={handleComplete}
      />
    );
  }

  /* ── List view ── */
  return (
    <div>
      {/* Progress summary */}
      <p className="text-sm text-muted-foreground mb-4">
        {completedIds.length} of {tutorials.length} tutorials completed
      </p>

      {/* Category tabs */}
      <div className="flex gap-2 mb-5 flex-wrap" role="tablist" aria-label="Filter by category">
        {CATEGORIES.map((cat) => (
          <button
            key={cat.value}
            role="tab"
            aria-selected={activeFilter === cat.value}
            onClick={() => setActiveFilter(cat.value)}
            className={`rounded-full px-3.5 py-1.5 text-sm font-medium transition-colors focus-visible:ring-2 focus-visible:ring-primary focus-visible:outline-none ${
              activeFilter === cat.value
                ? "bg-primary text-primary-foreground"
                : "bg-muted/50 text-muted-foreground hover:bg-muted"
            }`}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {/* Tutorial cards */}
      <div className="flex flex-col gap-3">
        {filtered.map((t, i) => (
          <TutorialCard
            key={t.id}
            tutorial={t}
            completed={completedSet.has(t.id)}
            onSelect={setSelected}
            index={i}
          />
        ))}

        {filtered.length === 0 ? (
          <p className="text-center text-sm text-muted-foreground py-8">
            No tutorials in this category yet.
          </p>
        ) : null}
      </div>
    </div>
  );
}
