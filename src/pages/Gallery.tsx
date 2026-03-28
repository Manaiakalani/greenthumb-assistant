import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, ChevronLeft, ChevronRight } from "lucide-react";
import { AppHeader } from "@/components/AppHeader";
import { BottomNav } from "@/components/BottomNav";
import { PageTransition } from "@/components/PageTransition";
import { CollectorCard, deriveRarity } from "@/components/CollectorCard";
import { CollectorCardModal } from "@/components/CollectorCardModal";
import { useProfile } from "@/context/ProfileContext";
import { ACHIEVEMENTS } from "@/lib/achievements";
import { useEarnedBadges } from "@/hooks/useEarnedBadges";
import type { Achievement } from "@/types/journal";
import type { UserProfile } from "@/types/profile";

/**
 * Example profiles for the gallery showcase — demonstrates different rarities.
 */
const EXAMPLE_PROFILES: (UserProfile & { _label: string })[] = [
  {
    _label: "Cool-Season Classic",
    name: "Alex",
    zone: "5",
    region: "Cool-Season",
    grassType: "Kentucky Bluegrass",
    lawnSize: "Large",
    location: "Minneapolis, MN",
  },
  {
    _label: "Southern Legend",
    name: "Jordan",
    zone: "9",
    region: "Warm-Season",
    grassType: "Bermudagrass",
    lawnSize: "Medium",
    location: "Houston, TX",
  },
  {
    _label: "Transition Hero",
    name: "Morgan",
    zone: "7",
    region: "Transition Zone",
    grassType: "Tall Fescue",
    lawnSize: "Small",
    location: "Charlotte, NC",
  },
  {
    _label: "Arctic Survivor",
    name: "Sam",
    zone: "2",
    region: "Cool-Season",
    grassType: "Fine Fescue",
    lawnSize: "Large",
    location: "Fairbanks, AK",
    latitude: 64.8,
    longitude: -147.7,
  },
  {
    _label: "Tropical Master",
    name: "Casey",
    zone: "12",
    region: "Warm-Season",
    grassType: "St. Augustinegrass",
    lawnSize: "Medium",
    location: "Honolulu, HI",
    latitude: 21.3,
    longitude: -157.8,
  },
];

/** Simulated badge sets for example cards (different combos to show variety) */
const EXAMPLE_BADGES: Achievement[][] = [
  ACHIEVEMENTS.filter((a) => ["first-log", "profile-complete", "streak-3", "first-mow"].includes(a.id)),
  ACHIEVEMENTS.filter((a) => ["first-log", "ten-logs", "summer-warrior", "card-generated", "dark-mode"].includes(a.id)),
  ACHIEVEMENTS.filter((a) => ["first-log", "first-photo", "profile-complete"].includes(a.id)),
  ACHIEVEMENTS.filter((a) => ["first-log", "ten-logs", "fifty-logs", "streak-7", "streak-3", "winter-survivor", "all-activities"].includes(a.id)),
  ACHIEVEMENTS.filter((a) => ["first-log", "ten-logs", "first-photo", "ten-photos", "streak-3", "profile-complete", "card-generated", "location-detect"].includes(a.id)),
];

const Gallery = () => {
  const { profile } = useProfile();
  const [selectedIdx, setSelectedIdx] = useState<number | null>(null);

  const { earned: userBadges } = useEarnedBadges();

  const allCards = [
    { profile, label: "Your Card", isUser: true, badges: userBadges },
    ...EXAMPLE_PROFILES.map((p, i) => ({ profile: p, label: p._label, isUser: false, badges: EXAMPLE_BADGES[i] ?? [] })),
  ];

  return (
    <div className="min-h-screen bg-background pb-20">
      <AppHeader />
      <PageTransition>
        <main id="main-content" className="max-w-2xl mx-auto px-4">
          {/* Header */}
          <div className="mt-4 mb-6">
            <h1 className="font-display text-2xl font-bold text-foreground flex items-center gap-2">
              <Sparkles className="h-6 w-6 text-primary" />
              Card Gallery
            </h1>
            <p className="text-sm text-muted-foreground mt-1">
              Browse collector cards and generate yours.
            </p>
          </div>

          {/* Your card CTA */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6 rounded-xl border border-primary/20 bg-primary/5 p-5 flex items-center justify-between"
          >
            <div>
              <p className="text-sm font-semibold text-foreground">Your Card</p>
              <p className="text-xs text-muted-foreground">
                {deriveRarity(profile)} rarity • Tap to download or share
              </p>
            </div>
            <CollectorCardModal />
          </motion.div>

          {/* Gallery grid */}
          <div className="grid grid-cols-2 gap-3">
            {allCards.map(({ profile: p, label, isUser, badges }, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
                onClick={() => setSelectedIdx(i)}
                className={`rounded-xl border p-2 cursor-pointer transition-all hover:shadow-lg ${
                  isUser
                    ? "border-primary/30 bg-primary/5"
                    : "border-primary/10 bg-card"
                }`}
              >
                <div className="overflow-hidden rounded-lg" style={{ aspectRatio: '3/4' }}>
                  <div className="w-full h-full" style={{ transform: 'scale(0.48)', transformOrigin: 'top left', width: '208%', height: '208%' }}>
                    <CollectorCard profile={p} earnedBadges={badges} />
                  </div>
                </div>
                <p className="text-[11px] font-medium text-foreground text-center mt-1 truncate">
                  {label}
                </p>
                <p className="text-[9px] text-muted-foreground text-center">
                  {deriveRarity(p)}
                </p>
              </motion.div>
            ))}
          </div>

          {/* Detail modal */}
          <AnimatePresence>
            {selectedIdx !== null && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                role="dialog"
                aria-modal="true"
                aria-label="Card detail view"
                className="fixed inset-0 z-[60] bg-black/70 backdrop-blur-sm flex items-center justify-center p-4"
                onClick={() => setSelectedIdx(null)}
                onKeyDown={(e) => {
                  if (e.key === 'Escape') setSelectedIdx(null);
                  if (e.key === 'ArrowLeft' && selectedIdx > 0) setSelectedIdx(selectedIdx - 1);
                  if (e.key === 'ArrowRight' && selectedIdx < allCards.length - 1) setSelectedIdx(selectedIdx + 1);
                }}
                tabIndex={-1}
                ref={(el) => el?.focus()}
              >
                <motion.div
                  initial={{ scale: 0.85, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0.85, opacity: 0 }}
                  className="relative max-w-[340px] w-full"
                  onClick={(e) => e.stopPropagation()}
                >
                  <CollectorCard profile={allCards[selectedIdx].profile} earnedBadges={allCards[selectedIdx].badges} />

                  <div className="flex justify-between mt-3">
                    <button
                      onClick={() => setSelectedIdx(Math.max(0, selectedIdx - 1))}
                      disabled={selectedIdx === 0}
                      className="p-2 rounded-full bg-white/10 text-white disabled:opacity-30 hover:bg-white/20"
                      aria-label="Previous card"
                    >
                      <ChevronLeft className="h-5 w-5" />
                    </button>
                    <p className="text-xs text-white/70 self-center">
                      {allCards[selectedIdx].label}
                    </p>
                    <button
                      onClick={() => setSelectedIdx(Math.min(allCards.length - 1, selectedIdx + 1))}
                      disabled={selectedIdx === allCards.length - 1}
                      className="p-2 rounded-full bg-white/10 text-white disabled:opacity-30 hover:bg-white/20"
                      aria-label="Next card"
                    >
                      <ChevronRight className="h-5 w-5" />
                    </button>
                  </div>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>
        </main>
      </PageTransition>
      <BottomNav />
    </div>
  );
};

export default Gallery;
