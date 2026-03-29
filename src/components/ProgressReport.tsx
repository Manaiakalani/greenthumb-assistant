import React, { useMemo, useState } from "react";
import {
  BarChart3,
  Calendar,
  Camera,
  DollarSign,
  Printer,
  Trophy,
  Activity,
  Heart,
} from "lucide-react";
import { useGrassStore } from "@/stores/useGrassStore";
import { loadCosts, getTotalSpend } from "@/lib/costTracker";
import { useLawnHealth } from "@/hooks/useLawnHealth";
import { useProfile } from "@/context/ProfileContext";
import { ACHIEVEMENTS } from "@/lib/achievements";
import { ACTIVITY_META, type ActivityType } from "@/types/journal";

// ── Period filter ────────────────────────────────────────────────────────────

type Period = "month" | "year" | "all";

const PERIOD_LABELS: Record<Period, string> = {
  month: "This Month",
  year: "This Year",
  all: "All Time",
};

function periodStart(period: Period): Date {
  const now = new Date();
  if (period === "month") return new Date(now.getFullYear(), now.getMonth(), 1);
  if (period === "year") return new Date(now.getFullYear(), 0, 1);
  return new Date(0);
}

// ── Currency formatter ───────────────────────────────────────────────────────

const currencyFmt = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  minimumFractionDigits: 0,
  maximumFractionDigits: 0,
});

// ── Component ────────────────────────────────────────────────────────────────

export const ProgressReport = React.memo(function ProgressReport() {
  const [period, setPeriod] = useState<Period>("month");

  const { profile } = useProfile();
  const journal = useGrassStore((s) => s.journal);
  const photos = useGrassStore((s) => s.photos);
  const achievements = useGrassStore((s) => s.achievements);
  const health = useLawnHealth(profile, journal, photos, achievements);

  const cutoff = useMemo(() => periodStart(period), [period]);

  // ── Filtered data ──────────────────────────────────────────────────────────

  const filteredJournal = useMemo(
    () => journal.filter((e) => new Date(e.date) >= cutoff),
    [journal, cutoff],
  );

  const filteredPhotos = useMemo(
    () => photos.filter((p) => new Date(p.date) >= cutoff),
    [photos, cutoff],
  );

  const filteredAchievements = useMemo(
    () => achievements.filter((a) => a.earnedAt >= cutoff.getTime()),
    [achievements, cutoff],
  );

  const filteredCosts = useMemo(() => {
    const all = loadCosts();
    return all.filter((c) => new Date(c.date) >= cutoff);
  }, [cutoff]);

  // ── Computed stats ─────────────────────────────────────────────────────────

  const totalActivities = filteredJournal.length;
  const totalPhotos = filteredPhotos.length;
  const totalAchievements = filteredAchievements.length;
  const totalSpent = getTotalSpend(filteredCosts);

  const avgPerWeek = useMemo(() => {
    const now = new Date();
    const msRange = now.getTime() - cutoff.getTime();
    const weeks = Math.max(msRange / (7 * 24 * 60 * 60 * 1000), 1);
    return totalActivities / weeks;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [totalActivities, cutoff]);

  // ── Activity breakdown ─────────────────────────────────────────────────────

  const activityCounts = useMemo(() => {
    const counts: Partial<Record<ActivityType, number>> = {};
    for (const e of filteredJournal) {
      counts[e.activity] = (counts[e.activity] ?? 0) + 1;
    }
    return Object.entries(counts)
      .map(([type, count]) => ({ type: type as ActivityType, count: count! }))
      .sort((a, b) => b.count - a.count);
  }, [filteredJournal]);

  const maxActivityCount = Math.max(1, ...activityCounts.map((a) => a.count));

  // ── Monthly trend (last 6 months) ──────────────────────────────────────────

  const monthlyTrend = useMemo(() => {
    const now = new Date();
    const months: { label: string; count: number }[] = [];
    for (let i = 5; i >= 0; i--) {
      const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
      const label = d.toLocaleDateString("en-US", { month: "short" });
      const count = journal.filter((e) => e.date.startsWith(key)).length;
      months.push({ label, count });
    }
    return months;
  }, [journal]);

  const maxMonthly = Math.max(1, ...monthlyTrend.map((m) => m.count));

  // ── Latest achievements ────────────────────────────────────────────────────

  const latestBadges = useMemo(() => {
    const sorted = [...achievements].sort((a, b) => b.earnedAt - a.earnedAt);
    return sorted.slice(0, 3).map((ea) => {
      const def = ACHIEVEMENTS.find((a) => a.id === ea.id);
      return { ...ea, title: def?.title ?? ea.id, emoji: def?.emoji ?? "🏅", description: def?.description ?? "" };
    });
  }, [achievements]);

  // ── Render ─────────────────────────────────────────────────────────────────

  return (
    <section
      className="rounded-xl border border-primary/15 bg-card p-6 shadow-card print-report"
      aria-label="Progress Report"
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-2">
          <BarChart3 aria-hidden="true" className="h-5 w-5 text-primary" />
          <h3 className="font-display text-base font-semibold text-foreground">
            Progress Report
          </h3>
        </div>
        <button
          onClick={() => window.print()}
          className="no-print rounded-lg px-3 py-1.5 text-xs font-medium text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors flex items-center gap-1.5"
          aria-label="Print report"
        >
          <Printer aria-hidden="true" className="h-3.5 w-3.5" />
          Print
        </button>
      </div>

      {/* Period toggle */}
      <div className="no-print flex rounded-lg bg-muted p-1 mb-6" role="radiogroup" aria-label="Time period">
        {(Object.keys(PERIOD_LABELS) as Period[]).map((p) => (
          <button
            key={p}
            role="radio"
            aria-checked={period === p}
            onClick={() => setPeriod(p)}
            className={`flex-1 rounded-md px-3 py-1.5 text-xs font-medium transition-colors ${
              period === p
                ? "bg-card text-foreground shadow-sm"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            {PERIOD_LABELS[p]}
          </button>
        ))}
      </div>

      {/* Summary stats 2×3 grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-6">
        <StatCard icon={Calendar} label="Activities" value={totalActivities} />
        <StatCard icon={Camera} label="Photos" value={totalPhotos} />
        <StatCard icon={Trophy} label="Achievements" value={totalAchievements} />
        <StatCard icon={DollarSign} label="Total Spent" value={currencyFmt.format(totalSpent)} />
        <StatCard icon={Activity} label="Avg / Week" value={avgPerWeek.toFixed(1)} />
        <StatCard icon={Heart} label="Health Score" value={health.score} valueColor={health.color} />
      </div>

      {/* Activity breakdown */}
      {activityCounts.length > 0 && (
        <div className="mb-6">
          <h4 className="font-display text-sm font-semibold text-foreground mb-3">
            Activity Breakdown
          </h4>
          <div className="space-y-2">
            {activityCounts.map(({ type, count }) => {
              const meta = ACTIVITY_META[type];
              return (
                <div key={type} className="flex items-center gap-2 text-xs">
                  <span className="w-20 shrink-0 truncate text-muted-foreground">
                    <span aria-hidden="true">{meta.emoji} </span>
                    {meta.label}
                  </span>
                  <div className="flex-1 h-2 rounded-full bg-muted overflow-hidden">
                    <div
                      className={`h-full rounded-full ${meta.color} transition-colors`}
                      style={{ width: `${(count / maxActivityCount) * 100}%` }}
                    />
                  </div>
                  <span className="w-6 text-right tabular-nums text-muted-foreground">
                    {count}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Monthly trend (last 6 months) */}
      <div className="mb-6">
        <h4 className="font-display text-sm font-semibold text-foreground mb-3">
          Monthly Trend
        </h4>
        <div className="flex items-end gap-1.5 h-16">
          {monthlyTrend.map((m) => (
            <div key={m.label} className="flex-1 flex flex-col items-center gap-1">
              <span className="text-[10px] tabular-nums text-muted-foreground">
                {m.count || ""}
              </span>
              <div className="w-full flex items-end justify-center" style={{ height: 40 }}>
                <div
                  className="w-full max-w-[28px] rounded-t bg-primary/70 transition-colors"
                  style={{ height: `${Math.max(m.count > 0 ? 12 : 0, (m.count / maxMonthly) * 100)}%` }}
                />
              </div>
              <span className="text-[10px] text-muted-foreground">{m.label}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Top achievements */}
      {latestBadges.length > 0 && (
        <div>
          <h4 className="font-display text-sm font-semibold text-foreground mb-3">
            Latest Achievements
          </h4>
          <div className="space-y-2">
            {latestBadges.map((badge) => (
              <div
                key={badge.id}
                className="flex items-center gap-3 rounded-lg bg-muted/50 px-3 py-2"
              >
                <span className="text-lg" aria-hidden="true">{badge.emoji}</span>
                <div className="min-w-0">
                  <p className="text-sm font-medium text-foreground truncate">
                    {badge.title}
                  </p>
                  <p className="text-xs text-muted-foreground truncate">
                    {badge.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Print-only styles */}
      <style>{`
        @media print {
          body * { visibility: hidden; }
          .print-report, .print-report * { visibility: visible; }
          .print-report {
            position: absolute;
            left: 0;
            top: 0;
            width: 100%;
            border: none;
            box-shadow: none;
          }
          .no-print { display: none !important; }
        }
      `}</style>
    </section>
  );
});

// ── Stat card sub-component ──────────────────────────────────────────────────

interface StatCardProps {
  icon: React.ElementType;
  label: string;
  value: number | string;
  valueColor?: string;
}

function StatCard({ icon: Icon, label, value, valueColor }: StatCardProps) {
  return (
    <div className="rounded-lg border border-border/50 bg-muted/30 px-3 py-2.5">
      <div className="flex items-center gap-1.5 mb-1">
        <Icon aria-hidden="true" className="h-3.5 w-3.5 text-muted-foreground" />
        <span className="text-[11px] text-muted-foreground">{label}</span>
      </div>
      <p className={`font-display text-lg font-bold tabular-nums ${valueColor ?? "text-foreground"}`}>
        {value}
      </p>
    </div>
  );
}
