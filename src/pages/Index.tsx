import { useCallback, useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link, useNavigate } from "react-router-dom";
import {
  MapPin,
  ClipboardList,
  ChevronRight,
} from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { useProfile } from "@/context/ProfileContext";
import { fetchWeather } from "@/lib/weather";
import { AppHeader } from "@/components/AppHeader";
import { HeroSection } from "@/components/HeroSection";
import { QuickStats } from "@/components/QuickStats";
import { ActionsSection } from "@/components/ActionsSection";
import { SeasonalTimeline } from "@/components/SeasonalTimeline";
import { WeatherCard } from "@/components/WeatherCard";
import { LawnProfile } from "@/components/LawnProfile";
import { CommunityStats } from "@/components/CommunityStats";
import { OnboardingModal } from "@/components/OnboardingModal";
import { BottomNav } from "@/components/BottomNav";
import { InstallBanner } from "@/components/InstallBanner";
import { LawnHealthScore } from "@/components/LawnHealthScore";
import { SmartReminders } from "@/components/SmartReminders";
import { Skeleton } from "@/components/ui/skeleton";

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
  const { data: weather } = useQuery({
    queryKey: ["weather", profile.latitude, profile.longitude, profile.location],
    queryFn: () =>
      fetchWeather({
        latitude: profile.latitude,
        longitude: profile.longitude,
        location: profile.location || undefined,
      }),
    enabled: !!(profile.latitude != null || profile.location),
    staleTime: 15 * 60 * 1000,
    retry: 1,
  });

  // Onboarding modal
  const [showOnboarding, setShowOnboarding] = useState(
    () => localStorage.getItem(ONBOARDING_KEY) !== "true",
  );

  const handleOnboardingComplete = useCallback(() => {
    localStorage.setItem(ONBOARDING_KEY, "true");
    setShowOnboarding(false);
  }, []);

  // Skeleton for first render
  const [ready, setReady] = useState(false);
  useEffect(() => {
    setReady(true);
  }, []);

  return (
    <div className="min-h-screen bg-background pb-20">
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

            {/* First-time setup prompt */}
            {!hasCompletedSetup && (
              <motion.div
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-6 rounded-xl border border-primary/30 bg-primary/5 p-4 flex items-center gap-3"
              >
                <div className="rounded-lg bg-primary/10 p-2">
                  <MapPin className="h-5 w-5 text-primary" />
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
                  <ClipboardList className="h-5 w-5 text-primary" />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="text-sm font-display font-semibold text-foreground">
                    My Lawn Plan
                  </h3>
                  <p className="text-xs text-muted-foreground">
                    View your full-year soil & fertilizer schedule.
                  </p>
                </div>
                <ChevronRight className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors shrink-0" />
              </motion.div>
            </Link>

            <CommunityStats />

            <LawnProfile />

            {/* Seasonal Timeline */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.5 }}
              className="mt-6 rounded-xl border border-primary/15 bg-card p-6 shadow-card"
            >
              <SeasonalTimeline />
            </motion.div>
          </>
        )}
      </main>

      <BottomNav />
    </div>
  );
};

export default Index;
