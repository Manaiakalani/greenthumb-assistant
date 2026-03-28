import { motion } from "framer-motion";
import { Users, TrendingUp, Scissors, Droplets } from "lucide-react";
import { useProfile } from "@/context/ProfileContext";
import { getSeason } from "@/data/stats";
import type { ClimateRegion } from "@/types/profile";

/**
 * Simulated community stats — in a real app these would come from a backend.
 * We derive plausible numbers from the user's region and current season.
 */
function getCommunityStats(region: ClimateRegion, month: number) {
  const season = getSeason(month);

  const dormantPct: Record<string, Record<ClimateRegion, number>> = {
    winter: { "Cool-Season": 78, "Transition Zone": 65, "Warm-Season": 82 },
    spring: { "Cool-Season": 5,  "Transition Zone": 3,  "Warm-Season": 15 },
    summer: { "Cool-Season": 10, "Transition Zone": 5,  "Warm-Season": 2 },
    fall:   { "Cool-Season": 15, "Transition Zone": 12, "Warm-Season": 30 },
  };

  const mowingPct: Record<string, Record<ClimateRegion, number>> = {
    winter: { "Cool-Season": 5,  "Transition Zone": 12, "Warm-Season": 8 },
    spring: { "Cool-Season": 87, "Transition Zone": 82, "Warm-Season": 72 },
    summer: { "Cool-Season": 65, "Transition Zone": 78, "Warm-Season": 91 },
    fall:   { "Cool-Season": 80, "Transition Zone": 75, "Warm-Season": 45 },
  };

  const wateringPct: Record<string, Record<ClimateRegion, number>> = {
    winter: { "Cool-Season": 3,  "Transition Zone": 8,  "Warm-Season": 5 },
    spring: { "Cool-Season": 42, "Transition Zone": 55, "Warm-Season": 60 },
    summer: { "Cool-Season": 78, "Transition Zone": 85, "Warm-Season": 92 },
    fall:   { "Cool-Season": 35, "Transition Zone": 45, "Warm-Season": 55 },
  };

  return {
    dormant: dormantPct[season][region],
    mowing: mowingPct[season][region],
    watering: wateringPct[season][region],
    activeUsers: Math.floor(1200 + Math.sin(month * 0.8) * 400 + (month * 37 % 100)),
  };
}

export function CommunityStats() {
  const { profile } = useProfile();
  const stats = getCommunityStats(profile.region, new Date().getMonth());

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.35, duration: 0.4 }}
      className="mt-6 rounded-xl border border-primary/15 bg-card p-6 shadow-card"
    >
      <div className="flex items-center gap-2 mb-4">
        <Users className="h-4 w-4 text-primary" />
        <h3 className="font-display text-base font-semibold text-foreground">
          Community Pulse
        </h3>
        <span className="text-xs text-muted-foreground">
          · {profile.region}
        </span>
      </div>

      <div className="grid grid-cols-3 gap-4">
        <div className="text-center">
          <div className="flex items-center justify-center gap-1 mb-1">
            <TrendingUp className="h-3.5 w-3.5 text-lawn-dormant" />
          </div>
          <p className="text-lg font-display font-bold text-foreground">{stats.dormant}%</p>
          <p className="text-[11px] text-muted-foreground">Lawns Dormant</p>
        </div>
        <div className="text-center">
          <div className="flex items-center justify-center gap-1 mb-1">
            <Scissors className="h-3.5 w-3.5 text-primary" />
          </div>
          <p className="text-lg font-display font-bold text-foreground">{stats.mowing}%</p>
          <p className="text-[11px] text-muted-foreground">Actively Mowing</p>
        </div>
        <div className="text-center">
          <div className="flex items-center justify-center gap-1 mb-1">
            <Droplets className="h-3.5 w-3.5 text-blue-500" />
          </div>
          <p className="text-lg font-display font-bold text-foreground">{stats.watering}%</p>
          <p className="text-[11px] text-muted-foreground">Watering</p>
        </div>
      </div>

      <p className="mt-3 pt-3 border-t border-primary/10 text-[11px] text-muted-foreground text-center">
        🌍 Based on {stats.activeUsers.toLocaleString()} {profile.region} lawn keepers
      </p>
    </motion.div>
  );
}
