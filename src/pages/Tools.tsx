import { motion } from "framer-motion";
import { Wrench, ClipboardList, ChevronRight } from "lucide-react";
import { Link } from "react-router-dom";
import { AppHeader } from "@/components/AppHeader";
import { BottomNav } from "@/components/BottomNav";
import { PageTransition } from "@/components/PageTransition";
import { WateringCalculator } from "@/components/WateringCalculator";
import { SoilTempChart } from "@/components/SoilTempChart";
import { ProgressCharts } from "@/components/ProgressCharts";
import { useQuery } from "@tanstack/react-query";
import { fetchWeather } from "@/lib/weather";
import { useProfile } from "@/context/ProfileContext";

const Tools = () => {
  const { profile } = useProfile();

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

  return (
    <div className="min-h-screen bg-background pb-20">
      <AppHeader />
      <PageTransition>
        <main id="main-content" className="max-w-2xl mx-auto px-4">
          {/* Header */}
          <div className="mt-4 mb-6">
            <h1 className="font-display text-2xl font-bold text-foreground flex items-center gap-2">
              <Wrench className="h-6 w-6 text-primary" />
              Lawn Tools
            </h1>
            <p className="text-sm text-muted-foreground mt-1">
              Calculators and data for smarter lawn care.
            </p>
          </div>

          {/* Soil & Fertilizer Plan CTA */}
          <Link to="/plan">
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-6 rounded-xl border border-primary/20 bg-gradient-to-r from-primary/5 via-card to-card p-4 shadow-card flex items-center gap-3 hover:border-primary/40 transition-colors group"
            >
              <div className="rounded-lg bg-primary/15 p-2.5">
                <ClipboardList className="h-5 w-5 text-primary" />
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="text-sm font-display font-semibold text-foreground">
                  My Lawn Plan
                </h3>
                <p className="text-xs text-muted-foreground">
                  Zone-based soil & fertilizer schedule for {profile.region}.
                </p>
              </div>
              <ChevronRight className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors shrink-0" />
            </motion.div>
          </Link>

          {/* Watering Calculator */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            className="rounded-xl border border-primary/15 bg-card p-6 shadow-card"
          >
            <WateringCalculator />
          </motion.div>

          {/* Soil Temperature Chart */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="mt-6 rounded-xl border border-primary/15 bg-card p-6 shadow-card"
          >
            <SoilTempChart currentTemp={weather?.current.soilTemp ?? null} />
          </motion.div>

          {/* Progress Charts */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="mt-6"
          >
            <ProgressCharts />
          </motion.div>
        </main>
      </PageTransition>
      <BottomNav />
    </div>
  );
};

export default Tools;
