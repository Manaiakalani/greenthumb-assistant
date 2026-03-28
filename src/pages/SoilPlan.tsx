import { useCallback, useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "react-router-dom";
import {
  ArrowLeft,
  Check,
  ChevronDown,
  ChevronUp,
  ClipboardList,
  Leaf,
  MapPin,
  Snowflake,
  Sparkles,
  Info,
} from "lucide-react";
import { toast } from "sonner";
import { AppHeader } from "@/components/AppHeader";
import { BottomNav } from "@/components/BottomNav";
import { PageTransition } from "@/components/PageTransition";
import { useProfile } from "@/context/ProfileContext";
import { haptic } from "@/lib/haptics";
import {
  getPlanForRegion,
  loadPlanProgress,
  savePlanProgress,
  CATEGORY_META,
  type PlanApplication,
  type PlanProgress,
} from "@/data/soilPlans";

/* ─── Step Card ──────────────────────────────────────── */

function StepCard({
  step,
  index,
  isComplete,
  isActive,
  onToggle,
}: {
  step: PlanApplication;
  index: number;
  isComplete: boolean;
  isActive: boolean;
  onToggle: () => void;
}) {
  const [expanded, setExpanded] = useState(false);
  const meta = CATEGORY_META[step.category];

  return (
    <motion.div
      initial={{ opacity: 0, x: -16 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: index * 0.06 }}
      className="relative flex gap-3"
    >
      {/* Timeline line */}
      <div className="flex flex-col items-center pt-1">
        <button
          onClick={() => {
            onToggle();
            haptic("light");
          }}
          className={`relative z-10 flex h-8 w-8 shrink-0 items-center justify-center rounded-full border-2 transition-all duration-200 ${
            isComplete
              ? "border-primary bg-primary text-primary-foreground scale-100"
              : isActive
                ? "border-primary bg-primary/10 text-primary ring-2 ring-primary/20"
                : "border-border bg-card text-muted-foreground hover:border-primary/40"
          }`}
          aria-label={isComplete ? `Mark "${step.title}" incomplete` : `Mark "${step.title}" complete`}
        >
          {isComplete ? (
            <Check className="h-4 w-4" />
          ) : (
            <span className="text-xs font-semibold">{index + 1}</span>
          )}
        </button>
        {/* Connector line */}
        <div className="w-0.5 flex-1 bg-border/60 mt-1" />
      </div>

      {/* Card body */}
      <div
        className={`flex-1 mb-4 rounded-xl border p-4 transition-all duration-200 ${
          isComplete
            ? "border-primary/20 bg-primary/5"
            : isActive
              ? "border-primary/30 bg-card shadow-card ring-1 ring-primary/10"
              : "border-border/60 bg-card/60"
        }`}
      >
        {/* Date badge */}
        <div className="flex items-center justify-between mb-2">
          <span className="text-[11px] font-medium text-muted-foreground">
            {step.dateRange}
          </span>
          <span className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-medium ${meta.bg} ${meta.color}`}>
            {meta.emoji} {step.category.replace("-", " ")}
          </span>
        </div>

        {/* Title & instruction */}
        <div className="flex items-start justify-between gap-2">
          <div className="min-w-0">
            <h4
              className={`font-display text-sm font-semibold leading-tight ${
                isComplete ? "text-foreground/60 line-through" : "text-foreground"
              }`}
            >
              {step.title}
            </h4>
            <p className="text-xs text-muted-foreground mt-0.5">{step.instruction}</p>
          </div>
        </div>

        {/* Expandable description */}
        <button
          onClick={() => setExpanded((prev) => !prev)}
          className="mt-2 flex items-center gap-1 text-[11px] text-primary hover:underline"
        >
          {expanded ? <ChevronUp className="h-3 w-3" /> : <ChevronDown className="h-3 w-3" />}
          {expanded ? "Less" : "Instructions"}
        </button>

        <AnimatePresence>
          {expanded && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="overflow-hidden"
            >
              <p className="mt-2 text-xs text-muted-foreground leading-relaxed">
                {step.description}
              </p>
              {step.tips && (
                <p className="mt-1.5 flex items-center gap-1 text-[11px] text-primary/80">
                  <Info className="h-3 w-3 shrink-0" />
                  {step.tips}
                </p>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}

/* ─── Main Page ──────────────────────────────────────── */

const SoilPlan = () => {
  const { profile, hasCompletedSetup } = useProfile();
  const plan = useMemo(() => getPlanForRegion(profile.region), [profile.region]);

  const [progress, setProgress] = useState<PlanProgress>(loadPlanProgress);

  // Only count completed IDs that belong to the current plan
  const planStepIds = useMemo(() => new Set(plan.applications.map((a) => a.id)), [plan.applications]);
  const completedCount = useMemo(
    () => Object.keys(progress.completed).filter((id) => planStepIds.has(id)).length,
    [progress.completed, planStepIds],
  );
  const totalSteps = plan.applications.length;
  const pct = totalSteps > 0 ? Math.round((completedCount / totalSteps) * 100) : 0;

  // Determine which step is "active" (first uncompleted)
  const activeStepId = useMemo(() => {
    for (const app of plan.applications) {
      if (!progress.completed[app.id]) return app.id;
    }
    return null;
  }, [plan.applications, progress.completed]);

  const handleToggle = useCallback(
    (stepId: string, title: string) => {
      setProgress((prev) => {
        const next = { ...prev, completed: { ...prev.completed } };
        if (next.completed[stepId]) {
          delete next.completed[stepId];
        } else {
          next.completed[stepId] = new Date().toISOString();
          toast.success(`✓ ${title}`, { description: "Marked complete!" });
        }
        savePlanProgress(next);
        return next;
      });
      haptic("success");
    },
    [],
  );

  // Split applications into upcoming vs past
  const currentMonth = new Date().getMonth();

  const upcoming = plan.applications.filter(
    (a) => a.monthEnd >= currentMonth || progress.completed[a.id],
  );
  const past = plan.applications.filter(
    (a) => a.monthEnd < currentMonth && !progress.completed[a.id],
  );

  return (
    <div className="min-h-screen bg-background pb-20">
      <AppHeader />
      <PageTransition>
        <main id="main-content" className="max-w-2xl mx-auto px-4">
          {/* Back link */}
          <Link
            to="/tools"
            className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground mt-3 mb-4 transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Tools
          </Link>

          {/* Page header */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6"
          >
            <h1 className="font-display text-2xl font-bold text-foreground flex items-center gap-2">
              <ClipboardList className="h-6 w-6 text-primary" />
              My Lawn Plan
            </h1>
            <p className="text-sm text-muted-foreground mt-1">
              Your year-round soil & fertilizer schedule for{" "}
              <strong className="text-foreground">{profile.region}</strong> ·{" "}
              Zone {profile.zone} · {plan.year}
            </p>
          </motion.div>

          {/* Setup prompt */}
          {!hasCompletedSetup && (
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-6 rounded-xl border border-primary/30 bg-primary/5 p-4 flex items-center gap-3"
            >
              <div className="rounded-lg bg-primary/10 p-2">
                <MapPin className="h-5 w-5 text-primary" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-foreground">
                  Set your location first
                </p>
                <p className="text-xs text-muted-foreground">
                  Your plan is customized by zone. Detect your location for best results.
                </p>
              </div>
              <Link
                to="/profile"
                className="shrink-0 rounded-lg bg-primary px-3 py-1.5 text-xs font-medium text-primary-foreground hover:bg-primary/90 transition-colors"
              >
                Set Up
              </Link>
            </motion.div>
          )}

          {/* Daily summary card */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.05 }}
            className="mb-6 rounded-xl border border-primary/15 bg-gradient-to-br from-primary/5 via-card to-card p-5 shadow-card"
          >
            <div className="flex items-center gap-2 mb-2">
              <div className="rounded-lg bg-primary/15 p-1.5">
                <Sparkles className="h-4 w-4 text-primary" />
              </div>
              <h3 className="font-display text-sm font-semibold text-foreground">
                Plan Summary
              </h3>
            </div>
            <p className="text-xs text-muted-foreground leading-relaxed mb-4">
              {plan.summary}
            </p>

            {/* Progress bar */}
            <div className="flex items-center gap-3">
              <div className="flex-1 h-2 rounded-full bg-muted overflow-hidden">
                <motion.div
                  className="h-full rounded-full bg-primary"
                  initial={{ width: 0 }}
                  animate={{ width: `${pct}%` }}
                  transition={{ duration: 0.6, ease: "easeOut" }}
                />
              </div>
              <span className="text-xs font-medium text-foreground whitespace-nowrap">
                {completedCount}/{totalSteps} done
              </span>
            </div>
          </motion.div>

          {/* Plan year selector (informational) */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="mb-6 rounded-xl border border-primary/15 bg-card p-5 shadow-card"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Leaf className="h-5 w-5 text-primary" />
                <h3 className="font-display text-base font-semibold text-foreground">
                  {plan.year} Application Schedule
                </h3>
              </div>
              <span className="text-[10px] text-muted-foreground px-2 py-0.5 rounded-full bg-primary/10">
                {profile.region} · Zone {profile.zone}
              </span>
            </div>

            {/* Missed past steps warning */}
            {past.length > 0 && (
              <div className="mb-4 rounded-lg border border-amber-500/20 bg-amber-500/5 p-3 text-xs text-amber-700 dark:text-amber-400">
                <strong>{past.length} earlier step{past.length > 1 ? "s" : ""}</strong> may have been
                missed. Don't worry — you can still apply late. Just be sure to wait a week between
                applications.
              </div>
            )}

            {/* Application steps */}
            <div className="relative">
              {upcoming.map((step, i) => (
                <StepCard
                  key={step.id}
                  step={step}
                  index={i}
                  isComplete={!!progress.completed[step.id]}
                  isActive={step.id === activeStepId}
                  onToggle={() => handleToggle(step.id, step.title)}
                />
              ))}

              {/* End of season marker */}
              <div className="flex gap-3">
                <div className="flex flex-col items-center">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full border-2 border-primary bg-primary/10">
                    <Snowflake className="h-4 w-4 text-primary" />
                  </div>
                </div>
                <div className="flex-1 pt-1">
                  <p className="text-sm font-display font-semibold text-foreground">
                    End of Season! 🎉
                  </p>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    You can still apply pouches after the set date. Just be sure to wait a week between applications.
                  </p>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Winter tips */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 }}
            className="mb-6 rounded-xl border border-primary/15 bg-card p-5 shadow-card"
          >
            <div className="flex items-center gap-2 mb-3">
              <Snowflake className="h-5 w-5 text-blue-500" />
              <h3 className="font-display text-base font-semibold text-foreground">
                Winter Lawn Care Tips
              </h3>
            </div>
            <ul className="space-y-2">
              {plan.winterTips.map((tip, i) => (
                <motion.li
                  key={i}
                  initial={{ opacity: 0, x: -8 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.2 + i * 0.05 }}
                  className="flex items-start gap-2.5 text-xs text-muted-foreground leading-relaxed"
                >
                  <span className="mt-0.5 h-1.5 w-1.5 rounded-full bg-primary shrink-0" />
                  {tip}
                </motion.li>
              ))}
            </ul>
          </motion.div>

          {/* Grass type note */}
          {profile.grassType && (
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="mb-6 rounded-lg border border-primary/10 bg-primary/5 p-4"
            >
              <p className="text-xs text-muted-foreground leading-relaxed">
                <strong className="text-foreground">🌿 {profile.grassType}</strong> — This plan is
                optimized for your grass type in {profile.region} (Zone {profile.zone}).
                {profile.location ? ` Based on your location in ${profile.location}.` : ""}
              </p>
            </motion.div>
          )}
        </main>
      </PageTransition>
      <BottomNav />
    </div>
  );
};

export default SoilPlan;
