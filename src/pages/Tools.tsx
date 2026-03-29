import { lazy, Suspense } from "react";
import { motion } from "motion/react";
import { Wrench, ClipboardList, ChevronRight, Bug, BookOpen, Scissors, Calculator, CalendarDays, BookA } from "lucide-react";
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
    <div className="min-h-screen bg-background pb-24">
      <AppHeader />
      <PageTransition>
        <main id="main-content" className="max-w-2xl mx-auto px-4">
          {/* Header */}
          <div className="mt-4 mb-6">
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
              className="mb-6 rounded-xl border border-primary/20 bg-gradient-to-r from-primary/5 via-card to-card p-4 shadow-card flex items-center gap-3 hover:border-primary/40 transition-colors group"
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
          <div className="grid grid-cols-2 gap-3 mb-6">
            <Link to="/pest-identifier" className="focus-visible:ring-2 focus-visible:ring-primary focus-visible:outline-none rounded-xl">
              <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}
                className="rounded-xl border border-primary/15 bg-card p-4 shadow-card hover:border-primary/40 transition-colors flex items-center gap-3">
                <div className="rounded-lg bg-red-500/15 p-2"><Bug aria-hidden="true" className="h-5 w-5 text-red-500" /></div>
                <div><h3 className="text-sm font-display font-semibold text-foreground">Pest ID</h3><p className="text-xs text-muted-foreground">Identify issues</p></div>
              </motion.div>
            </Link>
            <Link to="/tutorials" className="focus-visible:ring-2 focus-visible:ring-primary focus-visible:outline-none rounded-xl">
              <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}
                className="rounded-xl border border-primary/15 bg-card p-4 shadow-card hover:border-primary/40 transition-colors flex items-center gap-3">
                <div className="rounded-lg bg-purple-500/15 p-2"><BookOpen aria-hidden="true" className="h-5 w-5 text-purple-500" /></div>
                <div><h3 className="text-sm font-display font-semibold text-foreground">Tutorials</h3><p className="text-xs text-muted-foreground">Learn techniques</p></div>
              </motion.div>
            </Link>
            <Link to="/grass-quiz" className="focus-visible:ring-2 focus-visible:ring-primary focus-visible:outline-none rounded-xl">
              <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}
                className="rounded-xl border border-primary/15 bg-card p-4 shadow-card hover:border-primary/40 transition-colors flex items-center gap-3">
                <div className="rounded-lg bg-green-500/15 p-2"><Scissors aria-hidden="true" className="h-5 w-5 text-green-500" /></div>
                <div><h3 className="text-sm font-display font-semibold text-foreground">Grass Quiz</h3><p className="text-xs text-muted-foreground">ID your grass</p></div>
              </motion.div>
            </Link>
            <Link to="/calendar" className="focus-visible:ring-2 focus-visible:ring-primary focus-visible:outline-none rounded-xl">
              <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}
                className="rounded-xl border border-primary/15 bg-card p-4 shadow-card hover:border-primary/40 transition-colors flex items-center gap-3">
                <div className="rounded-lg bg-blue-500/15 p-2"><CalendarDays aria-hidden="true" className="h-5 w-5 text-blue-500" /></div>
                <div><h3 className="text-sm font-display font-semibold text-foreground">Calendar</h3><p className="text-xs text-muted-foreground">Monthly view</p></div>
              </motion.div>
            </Link>
            <Link to="/glossary" className="focus-visible:ring-2 focus-visible:ring-primary focus-visible:outline-none rounded-xl">
              <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}
                className="rounded-xl border border-primary/15 bg-card p-4 shadow-card hover:border-primary/40 transition-colors flex items-center gap-3">
                <div className="rounded-lg bg-teal-500/15 p-2"><BookA aria-hidden="true" className="h-5 w-5 text-teal-500" /></div>
                <div><h3 className="text-sm font-display font-semibold text-foreground">Glossary</h3><p className="text-xs text-muted-foreground">80+ terms</p></div>
              </motion.div>
            </Link>
          </div>

          {/* Seasonal Tip of the Day */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6"
          >
            <SeasonalTipCard />
          </motion.div>

          {/* Monthly Checklist */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6 rounded-xl border border-primary/15 bg-card p-6 shadow-card"
            style={{ contentVisibility: "auto", containIntrinsicSize: "auto 400px" }}
          >
            <MonthlyChecklist />
          </motion.div>

          {/* Lawn Size Estimator */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            className="rounded-xl border border-primary/15 bg-card p-6 shadow-card"
          >
            <LawnSizeEstimator />
          </motion.div>

          {/* Watering Calculator */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.05 }}
            className="mt-6 rounded-xl border border-primary/15 bg-card p-6 shadow-card"
          >
            <WateringCalculator />
          </motion.div>

          {/* Mowing Height Guide */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.07 }}
            className="mt-6 rounded-xl border border-primary/15 bg-card p-6 shadow-card"
            style={{ contentVisibility: "auto", containIntrinsicSize: "auto 300px" }}
          >
            <MowingHeightGuide />
          </motion.div>

          {/* Seed Calculator */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.09 }}
            className="mt-6 rounded-xl border border-primary/15 bg-card p-6 shadow-card"
            style={{ contentVisibility: "auto", containIntrinsicSize: "auto 350px" }}
          >
            <SeedCalculator />
          </motion.div>

          {/* Cost Tracker */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.11 }}
            className="mt-6 rounded-xl border border-primary/15 bg-card p-6 shadow-card"
            style={{ contentVisibility: "auto", containIntrinsicSize: "auto 400px" }}
          >
            <CostTracker />
          </motion.div>

          {/* Lawn Care Timer */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.13 }}
            className="mt-6 rounded-xl border border-primary/15 bg-card p-6 shadow-card"
            style={{ contentVisibility: "auto", containIntrinsicSize: "auto 300px" }}
          >
            <LawnCareTimer />
          </motion.div>

          {/* Fertilizer Decoder */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.14 }}
            className="mt-6 rounded-xl border border-primary/15 bg-card p-6 shadow-card"
            style={{ contentVisibility: "auto", containIntrinsicSize: "auto 400px" }}
          >
            <FertilizerDecoder />
          </motion.div>

          {/* Soil Amendment Calculator */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 }}
            className="mt-6 rounded-xl border border-primary/15 bg-card p-6 shadow-card"
            style={{ contentVisibility: "auto", containIntrinsicSize: "auto 350px" }}
          >
            <SoilAmendmentCalc />
          </motion.div>

          {/* Grass Comparison Tool */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.16 }}
            className="mt-6 rounded-xl border border-primary/15 bg-card p-6 shadow-card"
            style={{ contentVisibility: "auto", containIntrinsicSize: "auto 400px" }}
          >
            <GrassCompare />
          </motion.div>

          {/* Sprinkler Zone Planner */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.17 }}
            className="mt-6 rounded-xl border border-primary/15 bg-card p-6 shadow-card"
            style={{ contentVisibility: "auto", containIntrinsicSize: "auto 400px" }}
          >
            <SprinklerZonePlanner />
          </motion.div>

          {/* Activity Streaks & Goals */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.18 }}
            className="mt-6 rounded-xl border border-primary/15 bg-card p-6 shadow-card"
            style={{ contentVisibility: "auto", containIntrinsicSize: "auto 350px" }}
          >
            <ActivityStreaks />
          </motion.div>

          {/* Soil Temperature Chart */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="mt-6 rounded-xl border border-primary/15 bg-card p-6 shadow-card"
            style={{ contentVisibility: "auto", containIntrinsicSize: "auto 300px" }}
          >
            <SoilTempChart currentTemp={weather?.current.soilTemp ?? null} />
          </motion.div>

          {/* Soil Test Results */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 }}
            className="mt-6 rounded-xl border border-primary/15 bg-card p-5 shadow-card"
            style={{ contentVisibility: "auto", containIntrinsicSize: "auto 300px" }}
          >
            <SoilTestCard />
          </motion.div>

          {/* Lawn Report Card */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.19 }}
            className="mt-6 rounded-xl border border-primary/15 bg-card p-6 shadow-card"
            style={{ contentVisibility: "auto", containIntrinsicSize: "auto 500px" }}
          >
            <LawnReportCard />
          </motion.div>

          {/* Progress Report */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="mt-6 rounded-xl border border-primary/15 bg-card p-6 shadow-card"
            style={{ contentVisibility: "auto", containIntrinsicSize: "auto 400px" }}
          >
            <ProgressReport />
          </motion.div>

          {/* QR Profile Share */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.21 }}
            className="mt-6 rounded-xl border border-primary/15 bg-card p-6 shadow-card"
            style={{ contentVisibility: "auto", containIntrinsicSize: "auto 350px" }}
          >
            <QRProfileShare />
          </motion.div>

          {/* Progress Charts */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="mt-6"
            style={{ contentVisibility: "auto", containIntrinsicSize: "auto 400px" }}
          >
            <ProgressCharts />
          </motion.div>

          {/* Weather Forecast Chart */}
          {weather?.daily && (
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.25 }}
              className="mt-6"
              style={{ contentVisibility: "auto", containIntrinsicSize: "auto 350px" }}
            >
              <Suspense fallback={<ChartSkeleton />}>
                <ForecastChart forecast={weather.daily} />
              </Suspense>
            </motion.div>
          )}

          {/* Weekly Activity Chart */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="mt-6"
            style={{ contentVisibility: "auto", containIntrinsicSize: "auto 350px" }}
          >
            <Suspense fallback={<ChartSkeleton />}>
              <WeeklyActivityChart />
            </Suspense>
          </motion.div>

          {/* Lawn Health Radar */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.35 }}
            className="mt-6"
            style={{ contentVisibility: "auto", containIntrinsicSize: "auto 350px" }}
          >
            <Suspense fallback={<ChartSkeleton />}>
              <LawnHealthRadar />
            </Suspense>
          </motion.div>

          {/* Achievement Donut */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="mt-6"
            style={{ contentVisibility: "auto", containIntrinsicSize: "auto 350px" }}
          >
            <Suspense fallback={<ChartSkeleton />}>
              <AchievementDonut />
            </Suspense>
          </motion.div>

          {/* Cost Over Time Chart */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.45 }}
            className="mt-6"
            style={{ contentVisibility: "auto", containIntrinsicSize: "auto 350px" }}
          >
            <Suspense fallback={<ChartSkeleton />}>
              <CostChart />
            </Suspense>
          </motion.div>

          {/* Mowing Frequency Chart */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="mt-6"
            style={{ contentVisibility: "auto", containIntrinsicSize: "auto 350px" }}
          >
            <Suspense fallback={<ChartSkeleton />}>
              <MowingFrequencyChart />
            </Suspense>
          </motion.div>
        </main>
      </PageTransition>
      <BottomNav />
    </div>
  );
};

export default Tools;
