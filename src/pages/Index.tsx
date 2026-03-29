import { lazy, Suspense, useCallback, useEffect, useState, useSyncExternalStore } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Link, useNavigate } from "react-router-dom";
import {
  MapPin,
  ClipboardList,
  ChevronRight,
} from "lucide-react";
import { useProfile } from "@/context/ProfileContext";
import { useWeather } from "@/hooks/useWeather";
import { AppHeader } from "@/components/AppHeader";
import { HeroSection } from "@/components/HeroSection";
import { QuickStats } from "@/components/QuickStats";
import { ActionsSection } from "@/components/ActionsSection";
import { WeatherCard } from "@/components/WeatherCard";
import { OnboardingModal } from "@/components/OnboardingModal";
import { BottomNav } from "@/components/BottomNav";
import { InstallBanner } from "@/components/InstallBanner";
import { ReminderBanner } from "@/components/ReminderBanner";
import { WeatherAlerts } from "@/components/WeatherAlerts";
import { LawnHealthScore } from "@/components/LawnHealthScore";
import { SmartReminders } from "@/components/SmartReminders";
import { safeGetRaw, safeSetItem } from "@/lib/safeStorage";
import { checkAndNotify } from "@/lib/planReminders";
import { getPlanForRegion } from "@/data/soilPlans";
import { Skeleton } from "@/components/ui/skeleton";

// Below-fold components — lazy-loaded for faster initial paint
const SeasonalTimeline = lazy(() => import("@/components/SeasonalTimeline").then(m => ({ default: m.SeasonalTimeline })));
const LawnProfile = lazy(() => import("@/components/LawnProfile").then(m => ({ default: m.LawnProfile })));
const CommunityStats = lazy(() => import("@/components/CommunityStats").then(m => ({ default: m.CommunityStats })));

const ONBOARDING_KEY = "grasswise-onboarding-done";

function DashboardSkeleton() {
  return (
    <div className="space-y-6 animate-pulse">
      <Skeleton className="h-24 rounded-xl" />
      <div className="grid grid-cols-3 gap-3">
        <Skeleton className="h-20 rounded-xl" />
        <Skeleton className="h-20 rounded-xl" />
        <Skeleton className="h-20 rounded-xl" />
      </div>
      <Skeleton className="h-48 rounded-xl" />
      <Skeleton className="h-32 rounded-xl" />
    </div>
  );
}

const Index = () => {
  const { profile, hasCompletedSetup } = useProfile();
  const navigate = useNavigate();

  // Fetch weather for SmartReminders
  const { data: weather } = useWeather();

  // Check for upcoming plan tasks and send browser notifications on mount
  useEffect(() => {
    const region = profile.climateRegion ?? "Transition Zone";
    const plan = getPlanForRegion(region);
    checkAndNotify(plan.applications, plan.year);
  }, [profile.climateRegion]);

  // Onboarding modal
  const [showOnboarding, setShowOnboarding] = useState(
    () => safeGetRaw(ONBOARDING_KEY) !== "true",
  );

  const handleOnboardingComplete = useCallback(() => {
    safeSetItem(ONBOARDING_KEY, "true");
    setShowOnboarding(false);
  }, []);

  // Hydration-safe mount check for skeleton
  const ready = useSyncExternalStore(
    () => () => {},
    () => true,
    () => false,
  );

  return (
    <div className="min-h-screen bg-background pb-24">
      <AppHeader />

      {/* Onboarding overlay */}
      <AnimatePresence>
        {showOnboarding && (
          <OnboardingModal
            onComplete={handleOnboardingComplete}
            onGoToProfile={() => navigate("/profile")}
          />
        )}
      </AnimatePresence>

      <main id="main-content" className="max-w-2xl mx-auto px-4">
        {!ready ? (
          <div className="mt-6"><DashboardSkeleton /></div>
        ) : (
          <>
            <HeroSection />

            <InstallBanner />
            <ReminderBanner />

            {/* First-time setup prompt */}
            {!hasCompletedSetup && (
              <motion.div
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-6 rounded-xl border border-primary/30 bg-primary/5 p-4 flex items-center gap-3"
              >
                <div className="rounded-lg bg-primary/10 p-2">
                  <MapPin aria-hidden="true" className="h-5 w-5 text-primary" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-foreground">
                    Set up your lawn profile
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Get personalized care recommendations for your area.
                  </p>
                </div>
                <Link
                  to="/profile"
                  className="shrink-0 rounded-lg bg-primary px-3 py-1.5 text-xs font-medium text-primary-foreground hover:bg-primary/90 transition-colors"
                >
                  Get Started
                </Link>
              </motion.div>
            )}

            <QuickStats />

            <div className="mt-6">
              <LawnHealthScore />
            </div>

            <div className="mt-6">
              <WeatherCard />
            </div>

            {weather && (
              <div className="mt-4">
                <WeatherAlerts weather={weather} />
              </div>
            )}

            <div className="mt-6">
              <SmartReminders weather={weather} />
            </div>

            <ActionsSection />

            {/* Lawn Plan CTA */}
            <Link to="/plan">
              <motion.div
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.25 }}
                className="mt-4 rounded-xl border border-primary/20 bg-gradient-to-r from-primary/5 via-card to-card p-4 shadow-card flex items-center gap-3 hover:border-primary/40 transition-colors group"
              >
                <div className="rounded-lg bg-primary/15 p-2.5">
                  <ClipboardList aria-hidden="true" className="h-5 w-5 text-primary" />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="text-sm font-display font-semibold text-foreground">
                    My Lawn Plan
                  </h3>
                  <p className="text-xs text-muted-foreground">
                    View your full-year soil & fertilizer schedule.
                  </p>
                </div>
                <ChevronRight aria-hidden="true" className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors shrink-0" />
              </motion.div>
            </Link>

            <Suspense fallback={<Skeleton className="h-24 rounded-xl mt-6" />}>
              <CommunityStats />
            </Suspense>

            <Suspense fallback={<Skeleton className="h-32 rounded-xl mt-6" />}>
              <LawnProfile />
            </Suspense>

            {/* Seasonal Timeline */}
            <Suspense fallback={<Skeleton className="h-48 rounded-xl mt-6" />}>
              <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3, duration: 0.5 }}
                className="mt-6 rounded-xl border border-primary/15 bg-card p-6 shadow-card"
              >
                <SeasonalTimeline />
              </motion.div>
            </Suspense>
          </>
        )}
      </main>

      <BottomNav />
    </div>
  );
};

export default Index;
