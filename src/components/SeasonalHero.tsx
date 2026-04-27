import { useMemo } from "react";
import { motion, AnimatePresence } from "motion/react";
import Leaf from "lucide-react/dist/esm/icons/leaf";
import { getSeasonalBackground } from "@/data/seasonalBackgrounds";

interface SeasonalHeroProps {
  /** Override month (0-based). Defaults to current month. */
  month?: number;
  /** Optional heading text */
  heading?: string;
  /** Optional subheading text */
  subheading?: string;
  className?: string;
}

export function SeasonalHero({
  month,
  heading = "Your Lawn This Season",
  subheading,
  className = "",
}: SeasonalHeroProps) {
  const currentMonth = month ?? new Date().getMonth();

  const bg = useMemo(() => getSeasonalBackground(currentMonth), [currentMonth]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3, ease: [0.23, 1, 0.32, 1] }}
      className={`relative rounded-2xl overflow-hidden ${className}`}
    >
      {/* Animated gradient background */}
      <AnimatePresence mode="sync">
        <motion.div
          key={bg.season}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3, ease: [0.23, 1, 0.32, 1] }}
          className="absolute inset-0"
          style={{ background: bg.gradient }}
        />
      </AnimatePresence>

      {/* Dark overlay for text readability */}
      <div
        className="absolute inset-0 bg-foreground/20"
        style={{ opacity: bg.overlayOpacity }}
      />

      {/* Content */}
      <div className="relative z-10 px-5 py-8 sm:py-10">
        {/* Season badge */}
        <motion.span
          key={`badge-${bg.season}`}
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.25, delay: 0.1, ease: [0.23, 1, 0.32, 1] }}
          className="inline-flex items-center gap-1.5 rounded-full bg-white/20 backdrop-blur-sm px-3 py-1 text-xs font-medium text-primary-foreground mb-3"
        >
          <Leaf className="h-3 w-3" aria-hidden="true" />
          {bg.season}
        </motion.span>

        <motion.h2
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.05, ease: [0.23, 1, 0.32, 1] }}
          className="font-display text-2xl sm:text-3xl font-bold text-primary-foreground"
        >
          {heading}
        </motion.h2>

        {subheading && (
          <motion.p
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.15, ease: [0.23, 1, 0.32, 1] }}
            className="mt-2 text-sm text-primary-foreground/80 max-w-md"
          >
            {subheading}
          </motion.p>
        )}
      </div>
    </motion.div>
  );
}
