import React, { useRef, useCallback, useMemo } from "react";
import html2canvas from "html2canvas";
import { Printer, Download, Share2 } from "lucide-react";
import { useProfile } from "@/context/ProfileContext";
import { useLawnHealth } from "@/hooks/useLawnHealth";
import { useGrassStore } from "@/stores/useGrassStore";
import { loadCosts, getTotalSpend } from "@/lib/costTracker";
import type { ActivityType } from "@/types/journal";
import { ACTIVITY_META } from "@/types/journal";

/* ------------------------------------------------------------------ */
/*  Helpers                                                           */
/* ------------------------------------------------------------------ */

const TODAY = new Date();
const CURRENT_YEAR = TODAY.getFullYear();

function fmtDate(d: Date = TODAY): string {
  return d.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

function gradeColor(grade: string): string {
  if (grade === "A+" || grade === "A") return "#16a34a";
  if (grade === "B+" || grade === "B") return "#ca8a04";
  if (grade === "C") return "#ea580c";
  return "#dc2626";
}

function gradeBg(grade: string): string {
  if (grade === "A+" || grade === "A") return "#dcfce7";
  if (grade === "B+" || grade === "B") return "#fef9c3";
  if (grade === "C") return "#ffedd5";
  return "#fee2e2";
}

function pctBar(value: number, max: number): number {
  return Math.round((value / max) * 100);
}

function barColor(pct: number): string {
  if (pct >= 75) return "bg-green-500";
  if (pct >= 50) return "bg-yellow-500";
  if (pct >= 25) return "bg-orange-500";
  return "bg-red-500";
}

function nutrientLabel(level: string): { text: string; color: string } {
  switch (level) {
    case "low":
      return { text: "Low", color: "text-red-600" };
    case "high":
      return { text: "High", color: "text-amber-600" };
    default:
      return { text: "Adequate", color: "text-green-600" };
  }
}

function phAssessment(ph: number): { label: string; color: string } {
  if (ph >= 6.0 && ph <= 7.0) return { label: "Ideal", color: "text-green-600" };
  if (ph >= 5.5 && ph <= 7.5) return { label: "Acceptable", color: "text-yellow-600" };
  return { label: "Out of range", color: "text-red-600" };
}

/* ------------------------------------------------------------------ */
/*  Recommendations engine                                            */
/* ------------------------------------------------------------------ */

function buildRecommendations(breakdown: {
  consistency: number;
  variety: number;
  recency: number;
  engagement: number;
}): string[] {
  const recs: string[] = [];

  if (breakdown.consistency < 15)
    recs.push("Log activities more regularly — aim for 3+ days per week to build consistency.");
  if (breakdown.variety < 10)
    recs.push("Try logging a wider variety of activities (watering, fertilizing, aerating) to boost your Variety score.");
  if (breakdown.recency < 15)
    recs.push("Your last activity was a while ago — log something today to improve your Recency score.");
  if (breakdown.engagement < 12)
    recs.push("Take lawn photos and complete your profile to increase your Engagement score.");

  if (recs.length === 0)
    recs.push("You're doing great! Keep up the consistent lawn care. 🌟");

  return recs.slice(0, 4);
}

/* ------------------------------------------------------------------ */
/*  Print styles injected via <style> tag                             */
/* ------------------------------------------------------------------ */

const PRINT_STYLES = `
@media print {
  /* Hide non-essential UI */
  nav, header, footer,
  [data-report-actions],
  .bottom-nav, .app-header,
  [class*="BottomNav"], [class*="AppHeader"],
  [data-no-print] {
    display: none !important;
  }

  /* Force white background, black text */
  html, body {
    background: #fff !important;
    color: #000 !important;
    -webkit-print-color-adjust: exact !important;
    print-color-adjust: exact !important;
  }

  /* A4-friendly sizing */
  [data-report-card] {
    width: 100% !important;
    max-width: none !important;
    margin: 0 !important;
    padding: 16px !important;
    box-shadow: none !important;
    border: none !important;
    background: #fff !important;
    color: #000 !important;
    font-size: 11pt !important;
    page-break-inside: avoid;
  }

  [data-report-card] * {
    color: #000 !important;
    border-color: #ccc !important;
  }

  /* Preserve colored grade circle in print */
  [data-grade-circle] {
    -webkit-print-color-adjust: exact !important;
    print-color-adjust: exact !important;
  }

  /* Preserve bar colors */
  [data-score-bar] {
    -webkit-print-color-adjust: exact !important;
    print-color-adjust: exact !important;
  }

  @page {
    margin: 0.75in;
    size: letter;
  }
}
`;

/* ------------------------------------------------------------------ */
/*  Component                                                         */
/* ------------------------------------------------------------------ */

const LawnReportCard = React.memo(function LawnReportCard() {
  const { profile } = useProfile();
  const journal = useGrassStore((s) => s.journal);
  const photos = useGrassStore((s) => s.photos);
  const achievements = useGrassStore((s) => s.achievements);
  const health = useLawnHealth(profile, journal, photos, achievements);
  const reportRef = useRef<HTMLDivElement>(null);

  // ----- Costs -----
  const costs = useMemo(() => loadCosts(), []);
  const totalSpend = useMemo(() => getTotalSpend(costs), [costs]);

  // ----- Activity stats (current year) -----
  const yearEntries = useMemo(
    () => journal.filter((e) => e.date.startsWith(String(CURRENT_YEAR))),
    [journal],
  );

  const mostFrequentActivity = useMemo(() => {
    if (yearEntries.length === 0) return null;
    const counts: Record<string, number> = {};
    for (const e of yearEntries) {
      counts[e.activity] = (counts[e.activity] ?? 0) + 1;
    }
    const sorted = Object.entries(counts).sort((a, b) => b[1] - a[1]);
    return sorted[0][0] as ActivityType;
  }, [yearEntries]);

  const yearPhotos = useMemo(
    () => photos.filter((p) => p.date.startsWith(String(CURRENT_YEAR))),
    [photos],
  );

  // ----- Actions -----
  const handlePrint = useCallback(() => window.print(), []);

  const handleDownload = useCallback(async () => {
    if (!reportRef.current) return;
    try {
      const canvas = await html2canvas(reportRef.current, {
        scale: 2,
        backgroundColor: "#ffffff",
        useCORS: true,
      });
      const link = document.createElement("a");
      link.download = `grasswise-report-${TODAY.toISOString().slice(0, 10)}.png`;
      link.href = canvas.toDataURL("image/png");
      link.click();
    } catch {
      // Fallback: just print
      window.print();
    }
  }, []);

  const handleShare = useCallback(async () => {
    const shareData: ShareData = {
      title: "Grasswise Lawn Report Card",
      text: `My lawn health score is ${health.score}/100 (${health.grade})! Check out my Grasswise report.`,
      url: "https://grasswise.app",
    };
    try {
      if (navigator.share && navigator.canShare(shareData)) {
        await navigator.share(shareData);
      } else {
        await navigator.clipboard.writeText(
          `${shareData.text}\n${shareData.url}`,
        );
        alert("Report summary copied to clipboard!");
      }
    } catch {
      // User cancelled share — ignore
    }
  }, [health.score, health.grade]);

  // ----- Derived values -----
  const gc = gradeColor(health.grade);
  const gb = gradeBg(health.grade);
  const recommendations = buildRecommendations(health.breakdown);
  const soilTest = profile.soilTest;

  const categories: [string, number, number][] = [
    ["Consistency", health.breakdown.consistency, 30],
    ["Variety", health.breakdown.variety, 20],
    ["Recency", health.breakdown.recency, 25],
    ["Engagement", health.breakdown.engagement, 25],
  ];

  return (
    <>
      {/* Inject print styles */}
      <style>{PRINT_STYLES}</style>

      {/* Action buttons — hidden in print */}
      <div
        data-report-actions=""
        className="flex flex-wrap items-center justify-center gap-3 mb-6 print:hidden"
      >
        <button
          onClick={handlePrint}
          type="button"
          className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2.5 text-sm font-medium text-primary-foreground shadow-sm hover:opacity-90 transition-opacity focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        >
          <Printer className="h-4 w-4" aria-hidden="true" />
          Print Report
        </button>
        <button
          onClick={handleDownload}
          type="button"
          className="inline-flex items-center gap-2 rounded-lg border border-border bg-card px-4 py-2.5 text-sm font-medium text-foreground shadow-sm hover:bg-accent transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        >
          <Download className="h-4 w-4" aria-hidden="true" />
          Download as Image
        </button>
        <button
          onClick={handleShare}
          type="button"
          className="inline-flex items-center gap-2 rounded-lg border border-border bg-card px-4 py-2.5 text-sm font-medium text-foreground shadow-sm hover:bg-accent transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        >
          <Share2 className="h-4 w-4" aria-hidden="true" />
          Share
        </button>
      </div>

      {/* ============================================================= */}
      {/*  Report Card                                                   */}
      {/* ============================================================= */}
      <div
        ref={reportRef}
        data-report-card=""
        className="mx-auto max-w-2xl rounded-xl border border-border bg-card p-6 shadow-card sm:p-8"
      >
        {/* ---------- Header ---------- */}
        <header className="mb-6 text-center">
          <h1 className="font-display text-2xl font-bold text-foreground sm:text-3xl">
            <span aria-hidden="true">🌱 </span>Grasswise Lawn Report Card
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Generated {fmtDate()}
            {profile.name ? ` · ${profile.name}` : ""}
          </p>
        </header>

        {/* ---------- Grade circle + score ---------- */}
        <div className="mb-8 flex flex-col items-center">
          <div
            data-grade-circle=""
            className="flex h-[120px] w-[120px] items-center justify-center rounded-full border-4"
            style={{
              borderColor: gc,
              backgroundColor: gb,
            }}
          >
            <div className="text-center">
              <span
                className="block font-display text-4xl font-bold leading-none tabular-nums"
                style={{ color: gc }}
              >
                {health.grade}
              </span>
              <span
                className="mt-1 block text-sm font-semibold tabular-nums"
                style={{ color: gc }}
              >
                {health.score}/100
              </span>
            </div>
          </div>
          <p
            className="mt-2 text-sm font-semibold"
            style={{ color: gc }}
          >
            {health.label}
          </p>
        </div>

        {/* ---------- Profile summary ---------- */}
        <section className="mb-6">
          <h2 className="mb-3 font-display text-base font-semibold text-foreground">
            Profile Summary
          </h2>
          <div className="grid grid-cols-2 gap-x-6 gap-y-2 rounded-lg border border-border bg-muted/40 p-4 text-sm sm:grid-cols-4">
            <div>
              <span className="block text-xs text-muted-foreground">Zone</span>
              <span className="font-medium tabular-nums">{profile.zone || "—"}</span>
            </div>
            <div>
              <span className="block text-xs text-muted-foreground">Region</span>
              <span className="font-medium">{profile.region || "—"}</span>
            </div>
            <div>
              <span className="block text-xs text-muted-foreground">Grass Type</span>
              <span className="font-medium">{profile.grassType || "—"}</span>
            </div>
            <div>
              <span className="block text-xs text-muted-foreground">Lawn Size</span>
              <span className="font-medium">
                {profile.lawnSizeSqFt
                  ? `${profile.lawnSizeSqFt.toLocaleString()} sq ft`
                  : profile.lawnSize || "—"}
              </span>
            </div>
          </div>
        </section>

        {/* ---------- Score Breakdown ---------- */}
        <section className="mb-6">
          <h2 className="mb-3 font-display text-base font-semibold text-foreground">
            Score Breakdown
          </h2>
          <div className="space-y-3">
            {categories.map(([label, value, max]) => {
              const pct = pctBar(value, max);
              return (
                <div key={label}>
                  <div className="mb-1 flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">{label}</span>
                    <span className="font-medium tabular-nums">
                      {value}/{max} ({pct}%)
                    </span>
                  </div>
                  <div className="h-2.5 w-full overflow-hidden rounded-full bg-muted">
                    <div
                      data-score-bar=""
                      className={`h-full rounded-full transition-[width] ${barColor(pct)}`}
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* ---------- Activity Summary ---------- */}
        <section className="mb-6">
          <h2 className="mb-3 font-display text-base font-semibold text-foreground">
            {CURRENT_YEAR} Activity Summary
          </h2>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
            <StatCard label="Activities" value={yearEntries.length} />
            <StatCard
              label="Most Frequent"
              value={
                mostFrequentActivity
                  ? ACTIVITY_META[mostFrequentActivity].label
                  : "—"
              }
            />
            <StatCard label="Photos Taken" value={yearPhotos.length} />
            <StatCard label="Achievements" value={achievements.length} />
            <StatCard
              label="Total Invested"
              value={`$${totalSpend.toLocaleString("en-US", {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              })}`}
            />
          </div>
        </section>

        {/* ---------- Soil Health (conditional) ---------- */}
        {soilTest && (
          <section className="mb-6">
            <h2 className="mb-3 font-display text-base font-semibold text-foreground">
              Soil Health
            </h2>
            <div className="rounded-lg border border-border bg-muted/40 p-4">
              {/* pH bar */}
              <div className="mb-4">
                <div className="mb-1 flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">pH Level</span>
                  <span className="font-medium tabular-nums">
                    {soilTest.ph.toFixed(1)}{" "}
                    <span className={`text-xs ${phAssessment(soilTest.ph).color}`}>
                      ({phAssessment(soilTest.ph).label})
                    </span>
                  </span>
                </div>
                {/* Visual pH scale 4–9 */}
                <div className="relative h-3 w-full overflow-hidden rounded-full bg-gradient-to-r from-red-400 via-green-400 to-blue-400">
                  {/* Ideal range indicator (6.0-7.0 on 4-9 scale) */}
                  <div
                    className="absolute top-0 h-full border-x-2 border-white/80"
                    style={{
                      left: `${((6.0 - 4) / 5) * 100}%`,
                      width: `${(1 / 5) * 100}%`,
                    }}
                  />
                  {/* Current pH marker */}
                  <div
                    className="absolute top-0 h-full w-1 bg-foreground"
                    style={{
                      left: `${Math.min(Math.max(((soilTest.ph - 4) / 5) * 100, 0), 100)}%`,
                    }}
                  />
                </div>
                <div className="mt-0.5 flex justify-between text-[10px] text-muted-foreground tabular-nums">
                  <span>4.0</span>
                  <span>Ideal 6.0–7.0</span>
                  <span>9.0</span>
                </div>
              </div>

              {/* N-P-K */}
              <div className="grid grid-cols-3 gap-4 text-sm">
                {(
                  [
                    ["Nitrogen (N)", soilTest.nitrogen],
                    ["Phosphorus (P)", soilTest.phosphorus],
                    ["Potassium (K)", soilTest.potassium],
                  ] as const
                ).map(([label, level]) => {
                  const n = nutrientLabel(level);
                  return (
                    <div key={label} className="text-center">
                      <span className="block text-xs text-muted-foreground">
                        {label}
                      </span>
                      <span className={`font-semibold ${n.color}`}>
                        {n.text}
                      </span>
                    </div>
                  );
                })}
              </div>

              {soilTest.testDate ? (
                <p className="mt-2 text-right text-xs text-muted-foreground">
                  Tested: {fmtDate(new Date(soilTest.testDate))}
                </p>
              ) : null}
            </div>
          </section>
        )}

        {/* ---------- Recommendations ---------- */}
        <section className="mb-6">
          <h2 className="mb-3 font-display text-base font-semibold text-foreground">
            Recommendations
          </h2>
          <ul className="space-y-2">
            {recommendations.map((rec, i) => (
              <li
                key={i}
                className="flex items-start gap-2 text-sm text-muted-foreground"
              >
                <span aria-hidden="true" className="mt-0.5 text-primary">
                  •
                </span>
                <span>{rec}</span>
              </li>
            ))}
          </ul>
        </section>

        {/* ---------- Footer ---------- */}
        <footer className="border-t border-border pt-4 text-center text-xs text-muted-foreground">
          Generated by Grasswise · grasswise.app · {fmtDate()}
        </footer>
      </div>
    </>
  );
});

/* ------------------------------------------------------------------ */
/*  StatCard helper                                                   */
/* ------------------------------------------------------------------ */

function StatCard({
  label,
  value,
}: {
  label: string;
  value: string | number;
}) {
  return (
    <div className="rounded-lg border border-border bg-muted/40 p-3 text-center">
      <span className="block text-xs text-muted-foreground">{label}</span>
      <span className="mt-1 block font-display text-lg font-bold tabular-nums text-foreground">
        {value}
      </span>
    </div>
  );
}

export default LawnReportCard;
