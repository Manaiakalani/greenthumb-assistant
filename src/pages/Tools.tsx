import { lazy, Suspense } from "react";
import { motion } from "motion/react";
import Wrench from "lucide-react/dist/esm/icons/wrench";
import ClipboardList from "lucide-react/dist/esm/icons/clipboard-list";
import ChevronRight from "lucide-react/dist/esm/icons/chevron-right";
import ChevronDown from "lucide-react/dist/esm/icons/chevron-down";
import Bug from "lucide-react/dist/esm/icons/bug";
import BookOpen from "lucide-react/dist/esm/icons/book-open";
import Scissors from "lucide-react/dist/esm/icons/scissors";
import Calculator from "lucide-react/dist/esm/icons/calculator";
import CalendarDays from "lucide-react/dist/esm/icons/calendar-days";
import BookA from "lucide-react/dist/esm/icons/book-a";
import { Link } from "react-router-dom";
import { AppHeader } from "@/components/AppHeader";
import { BottomNav } from "@/components/BottomNav";
import { PageTransition } from "@/components/PageTransition";
import { WateringCalculator } from "@/components/WateringCalculator";
import { LawnSizeEstimator } from "@/components/LawnSizeEstimator";
import { SoilTempChart } from "@/components/SoilTempChart";
import { SoilTestCard } from "@/components/SoilTestCard";
import { ProgressCharts } from "@/components/ProgressCharts";
import { MowingHeightGuide } from "@/components/MowingHeightGuide";
import { SeedCalculator } from "@/components/SeedCalculator";
import { CostTracker } from "@/components/CostTracker";
import { MonthlyChecklist } from "@/components/MonthlyChecklist";
import { LawnCareTimer } from "@/components/LawnCareTimer";
import { FertilizerDecoder } from "@/components/FertilizerDecoder";
import { SoilAmendmentCalc } from "@/components/SoilAmendmentCalc";
import { GrassCompare } from "@/components/GrassCompare";
import { SprinklerZonePlanner } from "@/components/SprinklerZonePlanner";
import { ActivityStreaks } from "@/components/ActivityStreaks";
import { SeasonalTipCard } from "@/components/SeasonalTipCard";
import { ProgressReport } from "@/components/ProgressReport";
import LawnReportCard from "@/components/LawnReportCard";
import QRProfileShare from "@/components/QRProfileShare";
import { useWeather } from "@/hooks/useWeather";
import { useProfile } from "@/context/ProfileContext";
import { Skeleton } from "@/components/ui/skeleton";

const WeeklyActivityChart = lazy(() =>
  import("@/components/charts/WeeklyActivityChart").then((m) => ({ default: m.WeeklyActivityChart }))
);
const LawnHealthRadar = lazy(() =>
  import("@/components/charts/LawnHealthRadar").then((m) => ({ default: m.LawnHealthRadar }))
);
const AchievementDonut = lazy(() =>
  import("@/components/charts/AchievementDonut").then((m) => ({ default: m.AchievementDonut }))
);
const ForecastChart = lazy(() =>
  import("@/components/charts/ForecastChart").then((m) => ({ default: m.ForecastChart }))
);
const MowingFrequencyChart = lazy(() =>
  import("@/components/charts/MowingFrequencyChart").then((m) => ({ default: m.MowingFrequencyChart }))
);
const CostChart = lazy(() =>
  import("@/components/charts/CostChart").then((m) => ({ default: m.CostChart }))
);

function ChartSkeleton() {
  return <Skeleton className="h-72 rounded-xl" />;
}

const Tools = () => {
  const { profile } = useProfile();
  const { data: weather } = useWeather();

  return (
    <div className="min-h-screen bg-background pb-28">
      <AppHeader />
      <PageTransition>
        <main id="main-content" className="max-w-2xl mx-auto px-5 sm:px-8">
          {/* Header */}
          <div className="mt-6 mb-8">
            <h1 className="font-display text-2xl font-bold text-foreground flex items-center gap-2">
              <Wrench aria-hidden="true" className="h-6 w-6 text-primary" />
              Lawn Tools
            </h1>
            <p className="text-sm text-muted-foreground mt-1">
              Calculators and data for smarter lawn care.
            </p>
          </div>

          {/* Soil & Fertilizer Plan CTA */}
          <Link to="/plan" className="focus-visible:ring-2 focus-visible:ring-primary focus-visible:outline-none rounded-xl">
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-8 rounded-xl border border-primary/20 bg-gradient-to-r from-primary/5 via-card to-card p-5 shadow-card flex items-center gap-3 hover:border-primary/40 transition-colors group"
            >
              <div className="rounded-lg bg-primary/15 p-2.5">
                <ClipboardList aria-hidden="true" className="h-5 w-5 text-primary" />
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="text-sm font-display font-semibold text-foreground">
                  My Lawn Plan
                </h3>
                <p className="text-xs text-muted-foreground">
                  Zone-based soil & fertilizer schedule for {profile.region}.
                </p>
              </div>
              <ChevronRight aria-hidden="true" className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors shrink-0" />
            </motion.div>
          </Link>

          {/* Quick Links to Feature Pages */}
          <div className="grid grid-cols-2 gap-4 mb-8">
            <Link to="/pest-identifier" className="focus-visible:ring-2 focus-visible:ring-primary focus-visible:outline-none rounded-xl">
              <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}
                className="rounded-xl border border-primary/15 bg-card p-5 shadow-card hover:border-primary/40 transition-colors flex items-center gap-3">
                <div className="rounded-lg bg-red-500/15 p-2"><Bug aria-hidden="true" className="h-5 w-5 text-red-500" /></div>
                <div><h3 className="text-sm font-display font-semibold text-foreground">Pest ID</h3><p className="text-xs text-muted-foreground">Identify issues</p></div>
              </motion.div>
            </Link>
            <Link to="/tutorials" className="focus-visible:ring-2 focus-visible:ring-primary focus-visible:outline-none rounded-xl">
              <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}
                className="rounded-xl border border-primary/15 bg-card p-5 shadow-card hover:border-primary/40 transition-colors flex items-center gap-3">
                <div className="rounded-lg bg-purple-500/15 p-2"><BookOpen aria-hidden="true" className="h-5 w-5 text-purple-500" /></div>
                <div><h3 className="text-sm font-display font-semibold text-foreground">Tutorials</h3><p className="text-xs text-muted-foreground">Learn techniques</p></div>
              </motion.div>
            </Link>
            <Link to="/grass-quiz" className="focus-visible:ring-2 focus-visible:ring-primary focus-visible:outline-none rounded-xl">
              <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}
                className="rounded-xl border border-primary/15 bg-card p-5 shadow-card hover:border-primary/40 transition-colors flex items-center gap-3">
                <div className="rounded-lg bg-green-500/15 p-2"><Scissors aria-hidden="true" className="h-5 w-5 text-green-500" /></div>
                <div><h3 className="text-sm font-display font-semibold text-foreground">Grass Quiz</h3><p className="text-xs text-muted-foreground">ID your grass</p></div>
              </motion.div>
            </Link>
            <Link to="/calendar" className="focus-visible:ring-2 focus-visible:ring-primary focus-visible:outline-none rounded-xl">
              <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}
                className="rounded-xl border border-primary/15 bg-card p-5 shadow-card hover:border-primary/40 transition-colors flex items-center gap-3">
                <div className="rounded-lg bg-blue-500/15 p-2"><CalendarDays aria-hidden="true" className="h-5 w-5 text-blue-500" /></div>
                <div><h3 className="text-sm font-display font-semibold text-foreground">Calendar</h3><p className="text-xs text-muted-foreground">Monthly view</p></div>
              </motion.div>
            </Link>
            <Link to="/glossary" className="focus-visible:ring-2 focus-visible:ring-primary focus-visible:outline-none rounded-xl">
              <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}
                className="rounded-xl border border-primary/15 bg-card p-5 shadow-card hover:border-primary/40 transition-colors flex items-center gap-3">
                <div className="rounded-lg bg-teal-500/15 p-2"><BookA aria-hidden="true" className="h-5 w-5 text-teal-500" /></div>
                <div><h3 className="text-sm font-display font-semibold text-foreground">Glossary</h3><p className="text-xs text-muted-foreground">80+ terms</p></div>
              </motion.div>
            </Link>
          </div>

          {/* Seasonal Tip */}
          <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="mb-6">
            <SeasonalTipCard />
          </motion.div>

          {/* Calculators & Tools */}
          <details className="group mb-6" open>
            <summary className="cursor-pointer list-none [&::-webkit-details-marker]:hidden font-display text-lg font-semibold flex items-center justify-between p-4 rounded-xl bg-card border border-primary/15 shadow-card hover:border-primary/30 transition-colors">
              <span className="flex items-center gap-2">
                <span aria-hidden="true">📊</span> Calculators & Tools
                <span className="text-xs font-normal text-muted-foreground bg-primary/10 rounded-full px-2 py-0.5">7</span>
              </span>
              <ChevronDown aria-hidden="true" className="h-4 w-4 text-muted-foreground transition-transform duration-200 group-open:rotate-180" />
            </summary>
            <div className="mt-3 space-y-6">
              <div className="rounded-xl border border-primary/15 bg-card p-6 shadow-card">
                <LawnSizeEstimator />
              </div>
              <div className="rounded-xl border border-primary/15 bg-card p-6 shadow-card">
                <WateringCalculator />
              </div>
              <div className="rounded-xl border border-primary/15 bg-card p-6 shadow-card" style={{ contentVisibility: "auto", containIntrinsicSize: "auto 350px" }}>
                <SeedCalculator />
              </div>
              <div className="rounded-xl border border-primary/15 bg-card p-6 shadow-card" style={{ contentVisibility: "auto", containIntrinsicSize: "auto 400px" }}>
                <FertilizerDecoder />
              </div>
              <div className="rounded-xl border border-primary/15 bg-card p-6 shadow-card" style={{ contentVisibility: "auto", containIntrinsicSize: "auto 350px" }}>
                <SoilAmendmentCalc />
              </div>
              <div className="rounded-xl border border-primary/15 bg-card p-6 shadow-card" style={{ contentVisibility: "auto", containIntrinsicSize: "auto 300px" }}>
                <MowingHeightGuide />
              </div>
              <div className="rounded-xl border border-primary/15 bg-card p-6 shadow-card" style={{ contentVisibility: "auto", containIntrinsicSize: "auto 400px" }}>
                <GrassCompare />
              </div>
            </div>
          </details>

          {/* Charts & Analytics */}
          <details className="group mb-6">
            <summary className="cursor-pointer list-none [&::-webkit-details-marker]:hidden font-display text-lg font-semibold flex items-center justify-between p-4 rounded-xl bg-card border border-primary/15 shadow-card hover:border-primary/30 transition-colors">
              <span className="flex items-center gap-2">
                <span aria-hidden="true">📈</span> Charts & Analytics
                <span className="text-xs font-normal text-muted-foreground bg-primary/10 rounded-full px-2 py-0.5">9</span>
              </span>
              <ChevronDown aria-hidden="true" className="h-4 w-4 text-muted-foreground transition-transform duration-200 group-open:rotate-180" />
            </summary>
            <div className="mt-3 space-y-6">
              <div className="rounded-xl border border-primary/15 bg-card p-6 shadow-card" style={{ contentVisibility: "auto", containIntrinsicSize: "auto 300px" }}>
                <SoilTempChart currentTemp={weather?.current.soilTemp ?? null} />
              </div>
              <div className="rounded-xl border border-primary/15 bg-card p-5 shadow-card" style={{ contentVisibility: "auto", containIntrinsicSize: "auto 300px" }}>
                <SoilTestCard />
              </div>
              <div style={{ contentVisibility: "auto", containIntrinsicSize: "auto 400px" }}>
                <ProgressCharts />
              </div>
              {weather?.daily && (
                <Suspense fallback={<ChartSkeleton />}>
                  <ForecastChart forecast={weather.daily} />
                </Suspense>
              )}
              <Suspense fallback={<ChartSkeleton />}>
                <WeeklyActivityChart />
              </Suspense>
              <Suspense fallback={<ChartSkeleton />}>
                <LawnHealthRadar />
              </Suspense>
              <Suspense fallback={<ChartSkeleton />}>
                <AchievementDonut />
              </Suspense>
              <Suspense fallback={<ChartSkeleton />}>
                <CostChart />
              </Suspense>
              <Suspense fallback={<ChartSkeleton />}>
                <MowingFrequencyChart />
              </Suspense>
            </div>
          </details>

          {/* Planning & Tracking */}
          <details className="group mb-6">
            <summary className="cursor-pointer list-none [&::-webkit-details-marker]:hidden font-display text-lg font-semibold flex items-center justify-between p-4 rounded-xl bg-card border border-primary/15 shadow-card hover:border-primary/30 transition-colors">
              <span className="flex items-center gap-2">
                <span aria-hidden="true">📋</span> Planning & Tracking
                <span className="text-xs font-normal text-muted-foreground bg-primary/10 rounded-full px-2 py-0.5">5</span>
              </span>
              <ChevronDown aria-hidden="true" className="h-4 w-4 text-muted-foreground transition-transform duration-200 group-open:rotate-180" />
            </summary>
            <div className="mt-3 space-y-6">
              <div className="rounded-xl border border-primary/15 bg-card p-6 shadow-card" style={{ contentVisibility: "auto", containIntrinsicSize: "auto 400px" }}>
                <MonthlyChecklist />
              </div>
              <div className="rounded-xl border border-primary/15 bg-card p-6 shadow-card" style={{ contentVisibility: "auto", containIntrinsicSize: "auto 400px" }}>
                <CostTracker />
              </div>
              <div className="rounded-xl border border-primary/15 bg-card p-6 shadow-card" style={{ contentVisibility: "auto", containIntrinsicSize: "auto 400px" }}>
                <SprinklerZonePlanner />
              </div>
              <div className="rounded-xl border border-primary/15 bg-card p-6 shadow-card" style={{ contentVisibility: "auto", containIntrinsicSize: "auto 350px" }}>
                <ActivityStreaks />
              </div>
              <div className="rounded-xl border border-primary/15 bg-card p-6 shadow-card" style={{ contentVisibility: "auto", containIntrinsicSize: "auto 300px" }}>
                <LawnCareTimer />
              </div>
            </div>
          </details>

          {/* Reports & Sharing */}
          <details className="group mb-6">
            <summary className="cursor-pointer list-none [&::-webkit-details-marker]:hidden font-display text-lg font-semibold flex items-center justify-between p-4 rounded-xl bg-card border border-primary/15 shadow-card hover:border-primary/30 transition-colors">
              <span className="flex items-center gap-2">
                <span aria-hidden="true">📝</span> Reports & Sharing
                <span className="text-xs font-normal text-muted-foreground bg-primary/10 rounded-full px-2 py-0.5">3</span>
              </span>
              <ChevronDown aria-hidden="true" className="h-4 w-4 text-muted-foreground transition-transform duration-200 group-open:rotate-180" />
            </summary>
            <div className="mt-3 space-y-6">
              <div className="rounded-xl border border-primary/15 bg-card p-6 shadow-card" style={{ contentVisibility: "auto", containIntrinsicSize: "auto 500px" }}>
                <LawnReportCard />
              </div>
              <div className="rounded-xl border border-primary/15 bg-card p-6 shadow-card" style={{ contentVisibility: "auto", containIntrinsicSize: "auto 400px" }}>
                <ProgressReport />
              </div>
              <div className="rounded-xl border border-primary/15 bg-card p-6 shadow-card" style={{ contentVisibility: "auto", containIntrinsicSize: "auto 350px" }}>
                <QRProfileShare />
              </div>
            </div>
          </details>
        </main>
      </PageTransition>
      <BottomNav />
    </div>
  );
};

export default Tools;
