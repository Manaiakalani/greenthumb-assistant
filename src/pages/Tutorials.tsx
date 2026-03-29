import { motion } from "motion/react";
import { BookOpen } from "lucide-react";
import { Link } from "react-router-dom";
import { AppHeader } from "@/components/AppHeader";
import { BottomNav } from "@/components/BottomNav";
import { PageTransition } from "@/components/PageTransition";
import { GuidedTutorial } from "@/components/GuidedTutorial";

const Tutorials = () => {
  return (
    <div className="min-h-screen bg-background pb-24">
      <AppHeader />
      <PageTransition>
        <main id="main-content" className="max-w-2xl mx-auto px-4">
          {/* Header */}
          <div className="mt-4 mb-6">
            <h1 className="font-display text-2xl font-bold text-foreground flex items-center gap-2">
              <BookOpen aria-hidden="true" className="h-6 w-6 text-primary" />
              Guided Tutorials
            </h1>
            <p className="text-sm text-muted-foreground mt-1">
              Step-by-step guides to level up your lawn care skills.
            </p>
            <Link
              to="/tools"
              className="inline-flex items-center gap-1.5 mt-2 text-xs font-medium text-primary hover:text-primary/80 transition-colors"
            >
              ← Back to Tools
            </Link>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <GuidedTutorial />
          </motion.div>
        </main>
      </PageTransition>
      <BottomNav />
    </div>
  );
};

export default Tutorials;
