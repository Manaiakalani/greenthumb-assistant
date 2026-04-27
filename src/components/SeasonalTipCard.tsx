import { useCallback, useEffect, useMemo, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import Heart from "lucide-react/dist/esm/icons/heart";
import RefreshCw from "lucide-react/dist/esm/icons/refresh-cw";
import Check from "lucide-react/dist/esm/icons/check";
import { cn } from "@/lib/utils";
import { safeGetItem, safeSetItem } from "@/lib/safeStorage";
import { useProfile } from "@/context/ProfileContext";
import { getSeason } from "@/data/stats";
import {
  SEASONAL_TIPS,
  CATEGORY_META,
  SEASON_GRADIENTS,
  type SeasonalTip,
} from "@/data/seasonalTips";

// ---------------------------------------------------------------------------
// Storage keys
// ---------------------------------------------------------------------------

const TIP_OF_DAY_KEY = "grasswise-tip-of-day";
const FAVORITES_KEY = "grasswise-favorite-tips";
const DISMISSED_KEY = "grasswise-dismissed-tips";

interface TipOfDay {
  tipId: string;
  date: string; // YYYY-MM-DD
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function todayISO(): string {
  return new Date().toISOString().split("T")[0];
}

function getRelevantTips(
  season: ReturnType<typeof getSeason>,
  region: string,
): SeasonalTip[] {
  return SEASONAL_TIPS.filter(
    (t) =>
      t.season === season &&
      t.regions.includes(region as SeasonalTip["regions"][number]),
  );
}

function pickRandom<T>(arr: T[]): T | undefined {
  if (!arr.length) return undefined;
  return arr[Math.floor(Math.random() * arr.length)];
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

interface SeasonalTipCardProps {
  className?: string;
}

export function SeasonalTipCard({ className }: SeasonalTipCardProps) {
  const { profile } = useProfile();

  const season = useMemo(() => getSeason(new Date().getMonth()), []);
  const relevantTips = useMemo(
    () => getRelevantTips(season, profile.region),
    [season, profile.region],
  );

  // ── Favorites ───────────────────────────────────────
  const [favorites, setFavorites] = useState<string[]>(() =>
    safeGetItem<string[]>(FAVORITES_KEY, []),
  );

  const toggleFavorite = useCallback(
    (id: string) => {
      setFavorites((prev) => {
        const next = prev.includes(id)
          ? prev.filter((f) => f !== id)
          : [...prev, id];
        safeSetItem(FAVORITES_KEY, next);
        return next;
      });
    },
    [],
  );

  // ── Dismissed ───────────────────────────────────────
  const [dismissed, setDismissed] = useState(false);
  const [dismissedIds, setDismissedIds] = useState<string[]>(() =>
    safeGetItem<string[]>(DISMISSED_KEY, []),
  );

  // ── Tip of the Day ─────────────────────────────────
  const [currentTip, setCurrentTip] = useState<SeasonalTip | null>(null);
  const [direction, setDirection] = useState(1);

  // Initialise "tip of the day" — same tip all day, keyed on date
  useEffect(() => {
    if (!relevantTips.length) return;

    const today = todayISO();
    const stored = safeGetItem<TipOfDay | null>(TIP_OF_DAY_KEY, null);

    let tip: SeasonalTip | undefined;
    if (stored?.date === today) {
      tip = relevantTips.find((t) => t.id === stored.tipId);
    }

    if (!tip) {
      // Pick a new random tip for today
      const undismissed = relevantTips.filter(
        (t) => !dismissedIds.includes(t.id),
      );
      const pool = undismissed.length ? undismissed : relevantTips;
      tip = pickRandom(pool);
      if (tip) {
        safeSetItem(TIP_OF_DAY_KEY, { tipId: tip.id, date: today } satisfies TipOfDay);
      }
    }

    if (tip) {
      // Defer state update to avoid synchronous setState in effect
      const id = requestAnimationFrame(() => setCurrentTip(tip!));
      return () => cancelAnimationFrame(id);
    }
  }, [relevantTips, dismissedIds]);

  // ── Next tip ────────────────────────────────────────
  const handleNextTip = useCallback(() => {
    if (relevantTips.length <= 1) return;
    setDirection(1);
    setCurrentTip((prev) => {
      const others = relevantTips.filter((t) => t.id !== prev?.id);
      return pickRandom(others) ?? prev;
    });
  }, [relevantTips]);

  // ── Dismiss ─────────────────────────────────────────
  const handleDismiss = useCallback(() => {
    if (!currentTip) return;
    setDismissedIds((prev) => {
      const next = [...prev, currentTip.id];
      safeSetItem(DISMISSED_KEY, next);
      return next;
    });
    setDismissed(true);
  }, [currentTip]);

  // ── Early returns ───────────────────────────────────
  if (!currentTip || dismissed) return null;

  const cat = CATEGORY_META[currentTip.category];
  const isFav = favorites.includes(currentTip.id);
  const gradient = SEASON_GRADIENTS[currentTip.season];

  return (
    <AnimatePresence mode="wait" custom={direction}>
      <motion.div
        key={currentTip.id}
        custom={direction}
        initial={{ opacity: 0, x: 40 * direction }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: -40 * direction }}
        transition={{ duration: 0.3, ease: "easeInOut" }}
        className={cn(
          "relative overflow-hidden rounded-xl border bg-card p-5 shadow-card",
          "bg-gradient-to-br",
          gradient,
          className,
        )}
      >
        {/* Category badge */}
        <div className="mb-3 flex items-center justify-between">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-primary/10 px-2.5 py-0.5 text-xs font-medium text-primary">
            <span aria-hidden="true">{cat.emoji}</span>
            {cat.label}
          </span>
          <span className="text-xs font-medium text-muted-foreground capitalize">
            {currentTip.season} Tip
          </span>
        </div>

        {/* Tip text */}
        <h3 className="font-display text-base font-semibold leading-snug text-foreground">
          {currentTip.tip}
        </h3>
        <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
          {currentTip.details}
        </p>

        {/* Weather trigger badge */}
        {currentTip.weatherTrigger && (
          <span className="mt-2 inline-block rounded-md bg-muted px-2 py-0.5 text-xs text-muted-foreground">
            🌡️ Triggered by {currentTip.weatherTrigger.condition} weather
            {currentTip.weatherTrigger.threshold
              ? ` (${currentTip.weatherTrigger.threshold}°F)`
              : ""}
          </span>
        )}

        {/* Actions */}
        <div className="mt-4 flex items-center gap-2">
          <button
            type="button"
            onClick={handleNextTip}
            className="inline-flex items-center gap-1.5 rounded-lg bg-primary/10 px-3 py-1.5 text-xs font-medium text-primary transition-colors hover:bg-primary/20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            <RefreshCw aria-hidden="true" className="h-3.5 w-3.5" />
            Next Tip
          </button>

          <button
            type="button"
            onClick={handleDismiss}
            className="inline-flex items-center gap-1.5 rounded-lg bg-muted px-3 py-1.5 text-xs font-medium text-muted-foreground transition-colors hover:bg-muted/80 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            <Check aria-hidden="true" className="h-3.5 w-3.5" />
            Got it!
          </button>

          <button
            type="button"
            aria-label={isFav ? "Remove from favorites" : "Add to favorites"}
            onClick={() => toggleFavorite(currentTip.id)}
            className={cn(
              "ml-auto rounded-lg p-1.5 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
              isFav
                ? "text-red-500 hover:text-red-600"
                : "text-muted-foreground hover:text-red-400",
            )}
          >
            <Heart
              aria-hidden="true"
              className={cn("h-4 w-4", isFav && "fill-current")}
            />
          </button>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
