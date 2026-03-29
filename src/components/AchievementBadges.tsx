import { motion } from "motion/react";
import { Trophy, Lock } from "lucide-react";
import { ACHIEVEMENTS } from "@/lib/achievements";
import { useEarnedBadges } from "@/hooks/useEarnedBadges";
import { formatShortDate } from "@/lib/dateFormat";

export function AchievementBadges() {
  const { earned, earnedIds, earnedMap, total } = useEarnedBadges();
  const unlocked = earned.length;

  const categories = ["milestone", "streak", "seasonal", "explorer"] as const;
  const categoryLabels: Record<string, string> = {
    milestone: "Milestones",
    streak: "Streaks",
    seasonal: "Seasonal",
    explorer: "Explorer",
  };

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Trophy className="h-5 w-5 text-primary" aria-hidden="true" />
          <h3 className="font-display text-lg font-semibold text-foreground">
            Achievements
          </h3>
        </div>
        <span className="text-xs text-muted-foreground font-medium px-2.5 py-1 rounded-full bg-primary/10 border border-primary/20">
          {unlocked}/{total}
        </span>
      </div>

      {/* Progress bar */}
      <div className="h-2 rounded-full bg-secondary overflow-hidden">
        <motion.div
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="h-full rounded-full bg-primary origin-left"
          style={{ width: `${(unlocked / total) * 100}%` }}
        />
      </div>

      {categories.map((cat) => {
        const items = ACHIEVEMENTS.filter((a) => a.category === cat);
        return (
          <div key={cat}>
            <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">
              {categoryLabels[cat]}
            </h4>
            <div className="grid grid-cols-3 gap-2">
              {items.map((achievement) => {
                return (
                  <motion.div
                    key={achievement.id}
                    whileHover={{ scale: 1.03 }}
                    className={`rounded-xl border p-3 text-center transition-colors ${
                      earnedIds.has(achievement.id)
                        ? "border-primary/25 bg-primary/5"
                        : "border-border bg-card opacity-50"
                    }`}
                  >
                    <div className="text-2xl mb-1">
                      {earnedIds.has(achievement.id) ? achievement.emoji : <Lock className="h-5 w-5 mx-auto text-muted-foreground" />}
                    </div>
                    <p className={`text-[11px] font-medium leading-tight ${earnedIds.has(achievement.id) ? "text-foreground" : "text-muted-foreground"}`}>
                      {achievement.title}
                    </p>
                    {earnedIds.has(achievement.id) && earnedMap.has(achievement.id) && (
                      <p className="text-[9px] text-muted-foreground mt-0.5">
                        {formatShortDate(earnedMap.get(achievement.id)!.earnedAt)}
                      </p>
                    )}
                    {!earnedIds.has(achievement.id) && (
                      <p className="text-[9px] text-muted-foreground mt-0.5">
                        {achievement.description}
                      </p>
                    )}
                  </motion.div>
                );
              })}
            </div>
          </div>
        );
      })}
    </div>
  );
}
