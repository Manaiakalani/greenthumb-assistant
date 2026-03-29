import React from "react";
import { motion } from "motion/react";
import type { QuickStatItem } from "@/types/lawn";
import { useProfile } from "@/context/ProfileContext";
import { getSeasonalStats } from "@/data/stats";

function QuickStat({ icon: Icon, label, value, sub }: QuickStatItem) {
  return (
    <div className="flex flex-col items-center gap-1.5 p-4 rounded-xl bg-card border border-primary/15 shadow-card">
      <Icon aria-hidden="true" className="h-4 w-4 text-primary mb-0.5" />
      <span className="text-lg font-display font-bold text-foreground tabular-nums">{value}</span>
      <span className="text-[11px] text-muted-foreground leading-tight text-center">{label}</span>
      {sub && <span className="text-[10px] text-muted-foreground/60">{sub}</span>}
    </div>
  );
}

export const QuickStats = React.memo(function QuickStats() {
  const { profile } = useProfile();
  const stats = getSeasonalStats(profile.region, new Date().getMonth());

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.15 }}
      className="grid grid-cols-2 sm:grid-cols-4 gap-3"
    >
      {stats.map((stat) => (
        <QuickStat key={stat.label} {...stat} />
      ))}
    </motion.div>
  );
});
