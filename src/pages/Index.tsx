import { motion } from "framer-motion";
import { Scissors, Flower2, Droplets, AlertTriangle, ArrowUp, Leaf } from "lucide-react";
import { AppHeader } from "@/components/AppHeader";
import { LawnStatusBadge } from "@/components/LawnStatusBadge";
import { ActionCard } from "@/components/ActionCard";
import { SeasonalTimeline } from "@/components/SeasonalTimeline";
import { WeatherCard } from "@/components/WeatherCard";
import { QuickStats } from "@/components/QuickStats";
import heroLawn from "@/assets/hero-lawn.jpg";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <AppHeader />

      <main className="max-w-2xl mx-auto px-4 pb-12">
        {/* Hero Section */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6 }}
          className="relative rounded-2xl overflow-hidden mt-4 mb-6"
        >
          <img
            src={heroLawn}
            alt="Lush green lawn in morning sunlight"
            className="w-full h-44 object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-foreground/60 via-foreground/20 to-transparent" />
          <div className="absolute bottom-0 left-0 right-0 p-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-primary-foreground/80 text-sm font-body mb-0.5">Good morning 👋</p>
                <h1 className="font-display text-2xl font-bold text-primary-foreground">
                  Your Lawn Today
                </h1>
              </div>
              <LawnStatusBadge status="healthy" label="Healthy" className="bg-lawn-healthy/20 text-primary-foreground backdrop-blur-sm" />
            </div>
          </div>
        </motion.div>

        {/* Quick Stats */}
        <QuickStats />

        {/* Action Cards */}
        <div className="mt-6 space-y-3">
          <motion.h2
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="font-display text-lg font-semibold text-foreground"
          >
            Today's Actions
          </motion.h2>

          <ActionCard
            icon={Scissors}
            title="Mow Your Lawn"
            status="safe"
            statusLabel="Safe to Mow"
            description="Conditions are ideal for mowing. Cut to 3 inches — your Tall Fescue is in active spring growth."
            detail="Alternate your mowing direction from last time"
          />

          <ActionCard
            icon={Flower2}
            title="Fertilization"
            status="caution"
            statusLabel="Wait 5 More Days"
            description="Your spring fertilization window opens soon. Hold off until soil temps consistently hit 55°F."
            detail="Consider a slow-release nitrogen fertilizer"
          />

          <ActionCard
            icon={Droplets}
            title="Watering"
            status="safe"
            statusLabel="Not Needed Today"
            description="Rain yesterday provided sufficient moisture. Your lawn received about 0.5 inches — that's perfect."
          />

          <ActionCard
            icon={AlertTriangle}
            title="Weed Alert"
            status="danger"
            statusLabel="Action Needed"
            description="Pre-emergent herbicide window is closing. Apply within the next week to prevent crabgrass."
            detail="Soil temperature approaching 58°F threshold"
          />
        </div>

        {/* Seasonal Timeline */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.5 }}
          className="mt-8 rounded-xl border border-border bg-card p-5 shadow-card"
        >
          <SeasonalTimeline />
        </motion.div>

        {/* Weather */}
        <div className="mt-4">
          <WeatherCard />
        </div>

        {/* Lawn Profile Summary */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.5 }}
          className="mt-4 rounded-xl border border-border bg-card p-5 shadow-card"
        >
          <h3 className="font-display text-base font-semibold text-foreground mb-3">Your Lawn</h3>
          <div className="grid grid-cols-2 gap-3 text-sm">
            <div>
              <p className="text-muted-foreground text-xs">Grass Type</p>
              <p className="font-medium text-foreground flex items-center gap-1">
                <Leaf className="h-3.5 w-3.5 text-primary" />
                Tall Fescue
              </p>
            </div>
            <div>
              <p className="text-muted-foreground text-xs">Climate Zone</p>
              <p className="font-medium text-foreground">USDA Zone 7</p>
            </div>
            <div>
              <p className="text-muted-foreground text-xs">Region</p>
              <p className="font-medium text-foreground">Transition Zone</p>
            </div>
            <div>
              <p className="text-muted-foreground text-xs">Lawn Size</p>
              <p className="font-medium text-foreground">Medium</p>
            </div>
          </div>
          <div className="mt-3 pt-3 border-t border-border">
            <p className="text-xs text-muted-foreground flex items-center gap-1">
              <ArrowUp className="h-3 w-3" />
              Your lawn is in active spring growth — the best time of year for cool-season grass!
            </p>
          </div>
        </motion.div>
      </main>
    </div>
  );
};

export default Index;
