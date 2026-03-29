import { motion } from "motion/react";
import { Trophy, Images } from "lucide-react";
import { Link } from "react-router-dom";
import { AppHeader } from "@/components/AppHeader";
import { BottomNav } from "@/components/BottomNav";
import { PageTransition } from "@/components/PageTransition";
import { AchievementBadges } from "@/components/AchievementBadges";

const Achievements = () => {
  return (
    <div className="min-h-screen bg-background pb-24">
      <AppHeader />
      <PageTransition>
        <main id="main-content" className="max-w-2xl mx-auto px-4">
          {/* Header */}
          <div className="mt-4 mb-6">
            <h1 className="font-display text-2xl font-bold text-foreground flex items-center gap-2">
              <Trophy className="h-6 w-6 text-primary" />
              Achievements
            </h1>
            <p className="text-sm text-muted-foreground mt-1">
              Earn badges by taking care of your lawn.
            </p>
            <Link
              to="/gallery"
              className="inline-flex items-center gap-1.5 mt-2 text-xs font-medium text-primary hover:text-primary/80 transition-colors"
            >
              <Images className="h-3.5 w-3.5" />
              View Card Gallery
            </Link>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            className="rounded-xl border border-primary/15 bg-card p-6 shadow-card"
          >
            <AchievementBadges />
          </motion.div>
        </main>
      </PageTransition>
      <BottomNav />
    </div>
  );
};

export default Achievements;
