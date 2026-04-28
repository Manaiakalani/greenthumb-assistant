import { useCallback, useMemo, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { motion, AnimatePresence } from "motion/react";
import ArrowLeft from "lucide-react/dist/esm/icons/arrow-left";
import ArrowRight from "lucide-react/dist/esm/icons/arrow-right";
import Check from "lucide-react/dist/esm/icons/check";
import Flower2 from "lucide-react/dist/esm/icons/flower-2";
import Leaf from "lucide-react/dist/esm/icons/leaf";
import MapPin from "lucide-react/dist/esm/icons/map-pin";
import Sprout from "lucide-react/dist/esm/icons/sprout";
import Sun from "lucide-react/dist/esm/icons/sun";
import Wheat from "lucide-react/dist/esm/icons/wheat";
import { toast } from "sonner";
import { useProfile } from "@/context/ProfileContext";
import { AppHeader } from "@/components/AppHeader";
import { BottomNav } from "@/components/BottomNav";
import { Button } from "@/components/ui/button";
import type { ClimateRegion } from "@/types/profile";

// ---------------------------------------------------------------------------
// Quiz data
// ---------------------------------------------------------------------------

interface QuizOption {
  id: string;
  label: string;
  description?: string;
  icon?: React.ReactNode;
}

interface QuizStep {
  id: string;
  title: string;
  subtitle: string;
  options: QuizOption[];
}

const STEPS: QuizStep[] = [
  {
    id: "climate",
    title: "Where do you live?",
    subtitle: "Select the climate zone that best matches your area.",
    options: [
      {
        id: "cool",
        label: "Cool (Zones 1–4)",
        description: "Northern regions with cold winters and mild summers.",
        icon: <Flower2 aria-hidden="true" className="h-5 w-5" />,
      },
      {
        id: "transition",
        label: "Transition (Zones 5–7)",
        description: "Mid-range climates with hot summers and cold winters.",
        icon: <Sun aria-hidden="true" className="h-5 w-5" />,
      },
      {
        id: "warm",
        label: "Warm (Zones 8–13)",
        description: "Southern regions with mild winters and hot summers.",
        icon: <MapPin aria-hidden="true" className="h-5 w-5" />,
      },
    ],
  },
  {
    id: "blade",
    title: "What do your grass blades look like?",
    subtitle: "Look closely at individual blades — shape matters!",
    options: [
      {
        id: "wide",
        label: "Wide, flat blades",
        description: "St. Augustine, Tall Fescue",
        icon: <Leaf aria-hidden="true" className="h-5 w-5" />,
      },
      {
        id: "fine",
        label: "Fine, needle-like",
        description: "Fine Fescue, Bermuda",
        icon: <Wheat aria-hidden="true" className="h-5 w-5" />,
      },
      {
        id: "boat",
        label: "Boat-shaped tips",
        description: "Kentucky Bluegrass",
        icon: <Sprout aria-hidden="true" className="h-5 w-5" />,
      },
      {
        id: "coarse",
        label: "Pointed, coarse",
        description: "Zoysia, Bahia",
        icon: <Leaf aria-hidden="true" className="h-5 w-5" />,
      },
    ],
  },
  {
    id: "growth",
    title: "How does your grass spread?",
    subtitle: "Observe how new grass fills in bare spots.",
    options: [
      {
        id: "stolons",
        label: "Stolons (above ground)",
        description: "Bermuda, St. Augustine, Centipede",
        icon: <Sprout aria-hidden="true" className="h-5 w-5" />,
      },
      {
        id: "rhizomes",
        label: "Rhizomes (underground)",
        description: "Kentucky Bluegrass, Zoysia",
        icon: <Flower2 aria-hidden="true" className="h-5 w-5" />,
      },
      {
        id: "bunch",
        label: "Bunch-type / clumping",
        description: "Tall Fescue, Ryegrass, Bahia",
        icon: <Wheat aria-hidden="true" className="h-5 w-5" />,
      },
    ],
  },
  {
    id: "color",
    title: "What color is your lawn in peak season?",
    subtitle: "Think about the dominant shade when it's growing best.",
    options: [
      {
        id: "blue-green",
        label: "Deep blue-green",
        description: "Kentucky Bluegrass",
        icon: <Leaf aria-hidden="true" className="h-5 w-5" />,
      },
      {
        id: "medium-green",
        label: "Medium green",
        description: "Tall Fescue, Ryegrass",
        icon: <Sprout aria-hidden="true" className="h-5 w-5" />,
      },
      {
        id: "dark-green",
        label: "Dark green",
        description: "Bermuda, Zoysia",
        icon: <Leaf aria-hidden="true" className="h-5 w-5" />,
      },
      {
        id: "light-green",
        label: "Light / apple green",
        description: "Centipede, St. Augustine",
        icon: <Sun aria-hidden="true" className="h-5 w-5" />,
      },
    ],
  },
];

// ---------------------------------------------------------------------------
// Scoring logic
// ---------------------------------------------------------------------------

type GrassCandidate =
  | "Kentucky Bluegrass"
  | "Tall Fescue"
  | "Fine Fescue"
  | "Perennial Ryegrass"
  | "Bermudagrass"
  | "Zoysiagrass"
  | "St. Augustinegrass"
  | "Centipedegrass"
  | "Bahiagrass";

const ALL_GRASSES: GrassCandidate[] = [
  "Kentucky Bluegrass",
  "Tall Fescue",
  "Fine Fescue",
  "Perennial Ryegrass",
  "Bermudagrass",
  "Zoysiagrass",
  "St. Augustinegrass",
  "Centipedegrass",
  "Bahiagrass",
];

// Points awarded per answer → grass type
const SCORE_MAP: Record<string, Partial<Record<GrassCandidate, number>>> = {
  // Climate
  cool: { "Kentucky Bluegrass": 2, "Tall Fescue": 2, "Fine Fescue": 2, "Perennial Ryegrass": 2 },
  transition: { "Tall Fescue": 2, "Kentucky Bluegrass": 1, Zoysiagrass: 1, Bermudagrass: 1 },
  warm: { Bermudagrass: 2, Zoysiagrass: 2, "St. Augustinegrass": 2, Centipedegrass: 2, Bahiagrass: 2 },
  // Blade
  wide: { "St. Augustinegrass": 2, "Tall Fescue": 2 },
  fine: { "Fine Fescue": 2, Bermudagrass: 2 },
  boat: { "Kentucky Bluegrass": 3 },
  coarse: { Zoysiagrass: 2, Bahiagrass: 2 },
  // Growth
  stolons: { Bermudagrass: 2, "St. Augustinegrass": 2, Centipedegrass: 2 },
  rhizomes: { "Kentucky Bluegrass": 2, Zoysiagrass: 2 },
  bunch: { "Tall Fescue": 2, "Perennial Ryegrass": 2, Bahiagrass: 2 },
  // Color
  "blue-green": { "Kentucky Bluegrass": 2 },
  "medium-green": { "Tall Fescue": 2, "Perennial Ryegrass": 2 },
  "dark-green": { Bermudagrass: 2, Zoysiagrass: 2 },
  "light-green": { Centipedegrass: 2, "St. Augustinegrass": 2 },
};

const GRASS_DESCRIPTIONS: Record<GrassCandidate, string> = {
  "Kentucky Bluegrass":
    "A popular cool-season grass known for its rich blue-green color, fine texture, and excellent self-repair ability through rhizomes.",
  "Tall Fescue":
    "A versatile, drought-tolerant cool-season grass with deep roots and a coarse texture. Great for transition zones.",
  "Fine Fescue":
    "A fine-textured, shade-tolerant cool-season grass ideal for low-maintenance lawns in northern climates.",
  "Perennial Ryegrass":
    "A fast-germinating cool-season grass with a fine texture, often used for overseeding and quick lawn establishment.",
  Bermudagrass:
    "An aggressive, heat-loving warm-season grass with excellent wear tolerance. Goes dormant in winter.",
  Zoysiagrass:
    "A dense, slow-growing warm-season grass with good cold tolerance. Creates a thick, carpet-like lawn.",
  "St. Augustinegrass":
    "A coarse-textured warm-season grass that thrives in shade and coastal areas. Popular in the Deep South.",
  Centipedegrass:
    "A low-maintenance warm-season grass with a light green color. Prefers acidic soils and minimal fertilization.",
  Bahiagrass:
    "A tough, drought-tolerant warm-season grass with a coarse texture. Great for sandy soils in the Southeast.",
};

function climateForAnswer(answerId: string): ClimateRegion {
  if (answerId === "cool") return "Cool-Season";
  if (answerId === "warm") return "Warm-Season";
  return "Transition Zone";
}

interface QuizResult {
  grass: GrassCandidate;
  confidence: number;
}

function computeResults(answers: Record<string, string>): QuizResult[] {
  const scores: Record<string, number> = {};
  for (const g of ALL_GRASSES) scores[g] = 0;

  let maxPossible = 0;
  for (const answer of Object.values(answers)) {
    const mapping = SCORE_MAP[answer];
    if (!mapping) continue;
    const stepMax = Math.max(...Object.values(mapping));
    maxPossible += stepMax;
    for (const [grass, pts] of Object.entries(mapping)) {
      scores[grass] = (scores[grass] ?? 0) + pts;
    }
  }

  if (maxPossible === 0) maxPossible = 1;

  return Object.entries(scores)
    .filter(([, s]) => s > 0)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 2)
    .map(([grass, score]) => ({
      grass: grass as GrassCandidate,
      confidence: Math.round((score / maxPossible) * 100),
    }));
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

const TOTAL_STEPS = STEPS.length + 1; // +1 for results

const GrassQuiz = () => {
  const navigate = useNavigate();
  const { updateProfile } = useProfile();
  const [currentStep, setCurrentStep] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [direction, setDirection] = useState(1); // 1 = forward, -1 = back

  const isLastQuestion = currentStep === STEPS.length - 1;
  const showResults = currentStep === STEPS.length;

  const results = useMemo(
    () => (showResults ? computeResults(answers) : []),
    [showResults, answers],
  );

  const selectOption = useCallback(
    (optionId: string) => {
      const step = STEPS[currentStep];
      if (!step) return;
      setAnswers((prev) => ({ ...prev, [step.id]: optionId }));
    },
    [currentStep],
  );

  const goNext = useCallback(() => {
    setDirection(1);
    setCurrentStep((s) => Math.min(s + 1, STEPS.length));
  }, []);

  const goBack = useCallback(() => {
    setDirection(-1);
    setCurrentStep((s) => Math.max(s - 1, 0));
  }, []);

  const applyResult = useCallback(
    (grass: GrassCandidate) => {
      const climateAnswer = answers.climate;
      const region: ClimateRegion = climateAnswer
        ? climateForAnswer(climateAnswer)
        : "Transition Zone";
      updateProfile({ grassType: grass, region });
      toast.success("Grass type updated!", {
        description: `Your profile now uses ${grass}.`,
      });
      navigate("/profile");
    },
    [answers, updateProfile, navigate],
  );

  const step = STEPS[currentStep] as QuizStep | undefined;
  const currentAnswer = step ? answers[step.id] : undefined;

  const variants = {
    enter: (d: number) => ({ x: d > 0 ? 80 : -80, opacity: 0 }),
    center: { x: 0, opacity: 1 },
    exit: (d: number) => ({ x: d > 0 ? -80 : 80, opacity: 0 }),
  };

  return (
    <div className="min-h-screen bg-background pb-28">
      <AppHeader />

      <main id="main-content" className="max-w-2xl mx-auto px-5 sm:px-8 pb-12">
        {/* Back button */}
        <motion.div
          initial={{ opacity: 0, x: -8 }}
          animate={{ opacity: 1, x: 0 }}
          className="mt-4 mb-6"
        >
          <Button
            variant="ghost"
            size="sm"
            onClick={() => (currentStep === 0 ? navigate(-1) : goBack())}
            className="gap-1.5 text-muted-foreground hover:text-foreground"
          >
            <ArrowLeft aria-hidden="true" className="h-4 w-4" />
            {currentStep === 0 ? "Back" : "Previous Question"}
          </Button>
        </motion.div>

        {/* Progress bar */}
        <div className="mb-8">
          <div className="flex items-center justify-between text-xs text-muted-foreground mb-2">
            <span>
              Step {Math.min(currentStep + 1, TOTAL_STEPS)} of {TOTAL_STEPS}
            </span>
            <span>
              {Math.round(((currentStep + 1) / TOTAL_STEPS) * 100)}%
            </span>
          </div>
          <div className="h-2 rounded-full bg-muted overflow-hidden">
            <motion.div
              className="h-full rounded-full bg-primary"
              initial={false}
              animate={{
                width: `${((currentStep + 1) / TOTAL_STEPS) * 100}%`,
              }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
            />
          </div>
        </div>

        {/* Animated step content */}
        <AnimatePresence mode="wait" custom={direction}>
          {!showResults && step ? (
            <motion.div
              key={step.id}
              custom={direction}
              variants={variants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
            >
              <h1 className="font-display text-2xl font-bold text-foreground mb-1">
                {step.title}
              </h1>
              <p className="text-sm text-muted-foreground mb-6">
                {step.subtitle}
              </p>

              <div className="space-y-3">
                {step.options.map((opt) => {
                  const selected = currentAnswer === opt.id;
                  return (
                    <button
                      key={opt.id}
                      type="button"
                      onClick={() => selectOption(opt.id)}
                      className={`w-full text-left rounded-xl border p-4 transition-colors flex items-start gap-3 focus-visible:ring-2 focus-visible:ring-primary focus-visible:outline-none ${
                        selected
                          ? "border-primary bg-primary/10 ring-2 ring-primary/30"
                          : "border-border bg-card hover:border-primary/40"
                      }`}
                    >
                      <div
                        className={`shrink-0 rounded-lg p-2 ${
                          selected
                            ? "bg-primary text-primary-foreground"
                            : "bg-muted text-muted-foreground"
                        }`}
                      >
                        {opt.icon}
                      </div>
                      <div className="min-w-0">
                        <p className="font-medium text-foreground">
                          {opt.label}
                        </p>
                        {opt.description && (
                          <p className="text-xs text-muted-foreground mt-0.5">
                            {opt.description}
                          </p>
                        )}
                      </div>
                      {selected && (
                        <Check aria-hidden="true" className="h-5 w-5 text-primary shrink-0 ml-auto self-center" />
                      )}
                    </button>
                  );
                })}
              </div>

              {/* Next button */}
              <div className="mt-8 flex justify-end">
                <Button
                  onClick={goNext}
                  disabled={!currentAnswer}
                  className="gap-1.5"
                >
                  {isLastQuestion ? "See Results" : "Next"}
                  <ArrowRight aria-hidden="true" className="h-4 w-4" />
                </Button>
              </div>
            </motion.div>
          ) : showResults ? (
            <motion.div
              key="results"
              custom={direction}
              variants={variants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
            >
              <h1 className="font-display text-2xl font-bold text-foreground mb-1">
                Your Results
              </h1>
              <p className="text-sm text-muted-foreground mb-6">
                Based on your answers, here's what we think you're growing.
              </p>

              {results.length === 0 ? (
                <div className="rounded-xl border bg-card p-6 text-center text-muted-foreground">
                  We couldn't determine a match. Try retaking the quiz.
                </div>
              ) : (
                <div className="space-y-4">
                  {results.map((r, i) => (
                    <div
                      key={r.grass}
                      className="rounded-xl border border-primary/20 bg-card p-6 shadow-card"
                    >
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-2">
                          <div className="rounded-lg bg-primary/10 p-2">
                            <Sprout aria-hidden="true" className="h-5 w-5 text-primary" />
                          </div>
                          <div>
                            <p className="font-display font-semibold text-foreground">
                              {i === 0 ? "Best Match" : "Runner-up"}
                            </p>
                            <p className="text-lg font-bold text-primary">
                              {r.grass}
                            </p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-2xl font-bold text-primary">
                            {r.confidence}%
                          </p>
                          <p className="text-xs text-muted-foreground">
                            confidence
                          </p>
                        </div>
                      </div>

                      {/* Confidence bar */}
                      <div className="h-2 rounded-full bg-muted overflow-hidden mb-4">
                        <motion.div
                          className="h-full rounded-full bg-primary origin-left"
                          style={{ width: `${r.confidence}%` }}
                          initial={{ scaleX: 0 }}
                          animate={{ scaleX: 1 }}
                          transition={{
                            delay: 0.3 + i * 0.2,
                            duration: 0.6,
                            ease: "easeOut",
                          }}
                        />
                      </div>

                      <p className="text-sm text-muted-foreground mb-4">
                        {GRASS_DESCRIPTIONS[r.grass]}
                      </p>

                      <Button
                        onClick={() => applyResult(r.grass)}
                        variant={i === 0 ? "default" : "outline"}
                        className="w-full gap-1.5"
                      >
                        <Check aria-hidden="true" className="h-4 w-4" />
                        Use {r.grass}
                      </Button>
                    </div>
                  ))}
                </div>
              )}

              {/* Retake / back */}
              <div className="mt-8 flex flex-col sm:flex-row items-center gap-3">
                <Button
                  variant="ghost"
                  onClick={() => {
                    setAnswers({});
                    setDirection(-1);
                    setCurrentStep(0);
                  }}
                  className="gap-1.5"
                >
                  <ArrowLeft aria-hidden="true" className="h-4 w-4" />
                  Retake Quiz
                </Button>
                <Button
                  variant="link"
                  asChild
                  className="text-muted-foreground"
                >
                  <Link to="/profile">
                    Back to Profile
                  </Link>
                </Button>
              </div>
            </motion.div>
          ) : null}
        </AnimatePresence>
      </main>

      <BottomNav />
    </div>
  );
};

export default GrassQuiz;
