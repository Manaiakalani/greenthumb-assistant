import { useState } from "react";
import { motion } from "motion/react";
import MapPin from "lucide-react/dist/esm/icons/map-pin";
import Leaf from "lucide-react/dist/esm/icons/leaf";
import Sparkles from "lucide-react/dist/esm/icons/sparkles";
import ArrowRight from "lucide-react/dist/esm/icons/arrow-right";
import Check from "lucide-react/dist/esm/icons/check";
import { Button } from "@/components/ui/button";

const STEPS = [
  {
    icon: MapPin,
    title: "Where's your lawn?",
    description: "Set your location so we can give you weather-accurate recommendations. You can auto-detect or type it in.",
    color: "bg-blue-500",
  },
  {
    icon: Leaf,
    title: "What are you growing?",
    description: "Tell us your grass type and climate zone. We'll tailor every action, stat, and timeline to your lawn.",
    color: "bg-green-500",
  },
  {
    icon: Sparkles,
    title: "You're all set!",
    description: "Your dashboard is personalized. Check back daily for season-aware actions, weather updates, and lawn care tips.",
    color: "bg-amber-500",
  },
] as const;

interface OnboardingModalProps {
  onComplete: () => void;
  onGoToProfile: () => void;
}

export function OnboardingModal({ onComplete, onGoToProfile }: OnboardingModalProps) {
  const [step, setStep] = useState(0);
  const current = STEPS[step];
  const Icon = current.icon;
  const isLast = step === STEPS.length - 1;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      role="dialog"
      aria-modal="true"
      aria-label="Welcome to Grasswise"
      className="fixed inset-0 z-[60] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4"
      onKeyDown={(e) => { if (e.key === 'Escape') onComplete(); }}
      tabIndex={-1}
      ref={(el) => el?.focus()}
    >
      <motion.div
        key={step}
        initial={{ opacity: 0, y: 20, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: -20, scale: 0.95 }}
        transition={{ type: "spring", duration: 0.5 }}
        className="w-full max-w-sm rounded-2xl bg-card border border-primary/15 shadow-2xl overflow-hidden overscroll-y-contain"
      >
        {/* Progress dots */}
        <div className="flex justify-center gap-2 pt-5">
          {STEPS.map((_, i) => (
            <div
              key={i}
              className={`h-1.5 rounded-full transition-[width,background-color] duration-300 ${
                i === step ? "w-6 bg-primary" : i < step ? "w-1.5 bg-primary/50" : "w-1.5 bg-border"
              }`}
            />
          ))}
        </div>

        <div className="p-7 sm:p-8 text-center">
          {/* Icon */}
          <motion.div
            key={`icon-${step}`}
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.25, ease: [0.23, 1, 0.32, 1] }}
            className={`mx-auto w-14 h-14 rounded-2xl ${current.color} flex items-center justify-center mb-5`}
          >
            <Icon className="h-7 w-7 text-white" />
          </motion.div>

          <h2 className="font-display text-xl font-bold text-foreground mb-2">
            {current.title}
          </h2>
          <p className="text-sm text-muted-foreground leading-relaxed mb-7">
            {current.description}
          </p>

          <div className="flex gap-3">
            {step > 0 && (
              <Button
                variant="outline"
                onClick={() => setStep((s) => s - 1)}
                className="flex-1"
                size="sm"
              >
                Back
              </Button>
            )}

            {isLast ? (
              <>
                <Button
                  variant="outline"
                  onClick={() => { onGoToProfile(); onComplete(); }}
                  className="flex-1 gap-1"
                  size="sm"
                >
                  Set Up Profile
                </Button>
                <Button
                  onClick={onComplete}
                  className="flex-1 gap-1 bg-primary"
                  size="sm"
                >
                  <Check className="h-3.5 w-3.5" />
                  Let's Go!
                </Button>
              </>
            ) : (
              <Button
                onClick={() => setStep((s) => s + 1)}
                className="flex-1 gap-1 bg-primary"
                size="sm"
              >
                Next
                <ArrowRight className="h-3.5 w-3.5" />
              </Button>
            )}
          </div>
        </div>

        {/* Skip link */}
        {!isLast && (
          <div className="pb-4 text-center">
            <button
              onClick={onComplete}
              className="text-xs text-muted-foreground hover:text-foreground transition-colors"
            >
              Skip intro
            </button>
          </div>
        )}
      </motion.div>
    </motion.div>
  );
}
