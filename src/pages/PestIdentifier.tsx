import { useCallback, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "motion/react";
import ArrowLeft from "lucide-react/dist/esm/icons/arrow-left";
import ArrowRight from "lucide-react/dist/esm/icons/arrow-right";
import Bug from "lucide-react/dist/esm/icons/bug";
import Check from "lucide-react/dist/esm/icons/check";
import Flower2 from "lucide-react/dist/esm/icons/flower-2";
import Leaf from "lucide-react/dist/esm/icons/leaf";
import RefreshCcw from "lucide-react/dist/esm/icons/refresh-ccw";
import Search from "lucide-react/dist/esm/icons/search";
import Shield from "lucide-react/dist/esm/icons/shield";
import Snowflake from "lucide-react/dist/esm/icons/snowflake";
import Sprout from "lucide-react/dist/esm/icons/sprout";
import Sun from "lucide-react/dist/esm/icons/sun";
import TreeDeciduous from "lucide-react/dist/esm/icons/tree-deciduous";
import Wheat from "lucide-react/dist/esm/icons/wheat";
import { AppHeader } from "@/components/AppHeader";
import { BottomNav } from "@/components/BottomNav";
import { Button } from "@/components/ui/button";
import { PEST_DISEASE_DATA, type PestDisease } from "@/data/pestData";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

interface SymptomOption {
  id: string;
  label: string;
  description?: string;
  icon: React.ReactNode;
}

type Season = "spring" | "summer" | "fall" | "winter";

// ---------------------------------------------------------------------------
// Step 1 — Primary symptom categories
// ---------------------------------------------------------------------------

const PRIMARY_SYMPTOMS: SymptomOption[] = [
  {
    id: "brown-patches",
    label: "Brown patches",
    description: "Circular or irregular areas of dead-looking grass",
    icon: <Leaf aria-hidden="true" className="h-5 w-5" />,
  },
  {
    id: "thin-bare",
    label: "Thin / bare spots",
    description: "Grass is thinning out or missing entirely",
    icon: <Sprout aria-hidden="true" className="h-5 w-5" />,
  },
  {
    id: "discolored",
    label: "Discolored blades",
    description: "Yellow, red, pink, or bleached grass blades",
    icon: <Wheat aria-hidden="true" className="h-5 w-5" />,
  },
  {
    id: "insects",
    label: "Insects visible",
    description: "Bugs, larvae, or caterpillars on the turf",
    icon: <Bug aria-hidden="true" className="h-5 w-5" />,
  },
  {
    id: "mushrooms",
    label: "Mushrooms / fungi",
    description: "Mushrooms, mold, or fuzzy growth on the lawn",
    icon: <Flower2 aria-hidden="true" className="h-5 w-5" />,
  },
  {
    id: "weeds",
    label: "Weeds",
    description: "Unwanted plants spreading through the lawn",
    icon: <TreeDeciduous aria-hidden="true" className="h-5 w-5" />,
  },
];

// ---------------------------------------------------------------------------
// Step 2 — Follow-up questions per primary symptom
// ---------------------------------------------------------------------------

interface FollowUp {
  id: string;
  title: string;
  subtitle: string;
  options: SymptomOption[];
}

const EMPTY_FOLLOWUPS: FollowUp[] = [];

const FOLLOW_UPS: Record<string, FollowUp[]> = {
  "brown-patches": [
    {
      id: "patch-size",
      title: "How big are the patches?",
      subtitle: "Estimate the typical patch diameter.",
      options: [
        {
          id: "small",
          label: "Silver-dollar sized (< 4 in)",
          description: "Likely dollar spot or early disease",
          icon: <Search aria-hidden="true" className="h-5 w-5" />,
        },
        {
          id: "medium",
          label: "Dinner-plate sized (4–12 in)",
          description: "Could be grubs, chinch bugs, or disease",
          icon: <Leaf aria-hidden="true" className="h-5 w-5" />,
        },
        {
          id: "large",
          label: "Large patches (1+ ft)",
          description: "Often brown patch, Pythium, or armyworms",
          icon: <TreeDeciduous aria-hidden="true" className="h-5 w-5" />,
        },
      ],
    },
    {
      id: "patch-detail",
      title: "What else do you notice?",
      subtitle: "Any extra clues help narrow it down.",
      options: [
        {
          id: "peeling",
          label: "Turf peels up like carpet",
          description: "Roots may be severed by grubs",
          icon: <Sprout aria-hidden="true" className="h-5 w-5" />,
        },
        {
          id: "ring-edge",
          label: "Dark ring at the patch edge",
          description: "Classic sign of brown patch (smoke ring)",
          icon: <Flower2 aria-hidden="true" className="h-5 w-5" />,
        },
        {
          id: "greasy",
          label: "Slimy or greasy feel",
          description: "Water-soaked blades suggest Pythium",
          icon: <Wheat aria-hidden="true" className="h-5 w-5" />,
        },
        {
          id: "none-extra",
          label: "None of these",
          icon: <Search aria-hidden="true" className="h-5 w-5" />,
        },
      ],
    },
  ],
  "thin-bare": [
    {
      id: "thin-pattern",
      title: "What pattern do you see?",
      subtitle: "How are the thin spots arranged?",
      options: [
        {
          id: "random-thin",
          label: "Random thin areas",
          description: "No clear pattern to the damage",
          icon: <Sprout aria-hidden="true" className="h-5 w-5" />,
        },
        {
          id: "spreading-edges",
          label: "Spreading from edges/hot spots",
          description: "Damage is expanding outward",
          icon: <Leaf aria-hidden="true" className="h-5 w-5" />,
        },
        {
          id: "tunnels",
          label: "Raised tunnels or spongy feel",
          description: "Mole crickets or burrowing insects",
          icon: <Bug aria-hidden="true" className="h-5 w-5" />,
        },
      ],
    },
  ],
  discolored: [
    {
      id: "color-type",
      title: "What color do you see?",
      subtitle: "The discoloration type is an important clue.",
      options: [
        {
          id: "yellow",
          label: "Yellow or straw-colored",
          description: "Nutrient issues, chinch bugs, or drought",
          icon: <Sun aria-hidden="true" className="h-5 w-5" />,
        },
        {
          id: "pink-red",
          label: "Pink or red threads / strands",
          description: "Red thread disease",
          icon: <Flower2 aria-hidden="true" className="h-5 w-5" />,
        },
        {
          id: "bleached",
          label: "Bleached or white lesions",
          description: "Dollar spot or snow mold",
          icon: <Snowflake aria-hidden="true" className="h-5 w-5" />,
        },
        {
          id: "dark-green-ring",
          label: "Unusually dark green rings",
          description: "Fairy ring fungi enriching the soil",
          icon: <Leaf aria-hidden="true" className="h-5 w-5" />,
        },
      ],
    },
  ],
  insects: [
    {
      id: "insect-type",
      title: "What kind of insects?",
      subtitle: "Describe what you see on or in the lawn.",
      options: [
        {
          id: "white-grubs",
          label: "White, C-shaped grubs in soil",
          description: "Beetle larvae feeding on roots",
          icon: <Bug aria-hidden="true" className="h-5 w-5" />,
        },
        {
          id: "small-black",
          label: "Tiny black-and-white bugs at soil line",
          description: "Likely chinch bugs",
          icon: <Bug aria-hidden="true" className="h-5 w-5" />,
        },
        {
          id: "caterpillars",
          label: "Caterpillars or worms on grass",
          description: "Sod webworms or armyworms",
          icon: <Bug aria-hidden="true" className="h-5 w-5" />,
        },
        {
          id: "moths",
          label: "Small moths flying near turf at dusk",
          description: "Adult form of sod webworms",
          icon: <Bug aria-hidden="true" className="h-5 w-5" />,
        },
      ],
    },
  ],
  mushrooms: [
    {
      id: "fungus-pattern",
      title: "How are the mushrooms arranged?",
      subtitle: "The growth pattern helps identify the cause.",
      options: [
        {
          id: "circle",
          label: "In a circle or arc",
          description: "Classic fairy ring formation",
          icon: <Flower2 aria-hidden="true" className="h-5 w-5" />,
        },
        {
          id: "scattered",
          label: "Scattered randomly",
          description: "Decomposing organic matter below",
          icon: <TreeDeciduous aria-hidden="true" className="h-5 w-5" />,
        },
        {
          id: "fuzzy-mold",
          label: "Fuzzy or cobwebby growth on grass",
          description: "Could be Pythium or snow mold",
          icon: <Snowflake aria-hidden="true" className="h-5 w-5" />,
        },
      ],
    },
  ],
  weeds: [
    {
      id: "weed-type",
      title: "What do the weeds look like?",
      subtitle: "Leaf shape is the best identifier for weeds.",
      options: [
        {
          id: "grassy-weed",
          label: "Grass-like, low and sprawling",
          description: "Crabgrass or other annual grassy weeds",
          icon: <Wheat aria-hidden="true" className="h-5 w-5" />,
        },
        {
          id: "broadleaf-flower",
          label: "Broadleaf with yellow flowers",
          description: "Dandelion or similar broadleaf weeds",
          icon: <Flower2 aria-hidden="true" className="h-5 w-5" />,
        },
        {
          id: "clover-like",
          label: "Three-part round leaves, white flowers",
          description: "White clover",
          icon: <Leaf aria-hidden="true" className="h-5 w-5" />,
        },
      ],
    },
  ],
};

// ---------------------------------------------------------------------------
// Season options
// ---------------------------------------------------------------------------

const SEASON_OPTIONS: SymptomOption[] = [
  {
    id: "spring",
    label: "Spring",
    description: "March – May",
    icon: <Sprout aria-hidden="true" className="h-5 w-5" />,
  },
  {
    id: "summer",
    label: "Summer",
    description: "June – August",
    icon: <Sun aria-hidden="true" className="h-5 w-5" />,
  },
  {
    id: "fall",
    label: "Fall",
    description: "September – November",
    icon: <Leaf aria-hidden="true" className="h-5 w-5" />,
  },
  {
    id: "winter",
    label: "Winter",
    description: "December – February",
    icon: <Snowflake aria-hidden="true" className="h-5 w-5" />,
  },
];

// ---------------------------------------------------------------------------
// Scoring / matching logic
// ---------------------------------------------------------------------------

interface MatchResult {
  pest: PestDisease;
  confidence: number;
}

/**
 * Maps user answers to scores for each pest/disease entry.
 * Higher scores → higher confidence match.
 */
function computeMatches(
  primary: string,
  followUpAnswers: Record<string, string>,
  season: Season,
): MatchResult[] {
  const scores = new Map<string, number>();
  const maxPossible = 10; // normalisation ceiling

  for (const entry of PEST_DISEASE_DATA) {
    let score = 0;

    // — Primary symptom matching —
    if (primary === "brown-patches") {
      if (entry.type === "disease") score += 2;
      if (entry.id === "grubs" || entry.id === "chinch-bugs") score += 2;
    }
    if (primary === "thin-bare") {
      if (entry.id === "mole-crickets") score += 3;
      if (entry.id === "grubs") score += 2;
      if (entry.id === "sod-webworms" || entry.id === "armyworms") score += 2;
      if (entry.type === "weed") score += 1;
    }
    if (primary === "discolored") {
      if (entry.type === "disease") score += 2;
      if (entry.id === "chinch-bugs") score += 1;
    }
    if (primary === "insects") {
      if (entry.type === "pest") score += 2;
    }
    if (primary === "mushrooms") {
      if (entry.id === "fairy-ring") score += 3;
      if (entry.id === "pythium-blight" || entry.id === "snow-mold") score += 2;
    }
    if (primary === "weeds") {
      if (entry.type === "weed") score += 3;
    }

    // — Follow-up answer matching —
    for (const answer of Object.values(followUpAnswers)) {
      // Patch size
      if (answer === "small" && entry.id === "dollar-spot") score += 3;
      if (answer === "medium" && (entry.id === "grubs" || entry.id === "chinch-bugs")) score += 2;
      if (answer === "large" && (entry.id === "brown-patch" || entry.id === "pythium-blight" || entry.id === "armyworms")) score += 2;

      // Patch details
      if (answer === "peeling" && entry.id === "grubs") score += 3;
      if (answer === "ring-edge" && entry.id === "brown-patch") score += 3;
      if (answer === "greasy" && entry.id === "pythium-blight") score += 3;

      // Thin patterns
      if (answer === "tunnels" && entry.id === "mole-crickets") score += 3;
      if (answer === "spreading-edges" && (entry.id === "chinch-bugs" || entry.id === "armyworms")) score += 2;
      if (answer === "random-thin" && (entry.type === "weed" || entry.id === "sod-webworms")) score += 1;

      // Discoloration
      if (answer === "yellow" && (entry.id === "chinch-bugs" || entry.id === "dollar-spot")) score += 2;
      if (answer === "pink-red" && entry.id === "red-thread") score += 4;
      if (answer === "bleached" && (entry.id === "dollar-spot" || entry.id === "snow-mold")) score += 3;
      if (answer === "dark-green-ring" && entry.id === "fairy-ring") score += 4;

      // Insects
      if (answer === "white-grubs" && entry.id === "grubs") score += 4;
      if (answer === "small-black" && entry.id === "chinch-bugs") score += 4;
      if (answer === "caterpillars" && (entry.id === "sod-webworms" || entry.id === "armyworms")) score += 3;
      if (answer === "moths" && entry.id === "sod-webworms") score += 4;

      // Mushrooms
      if (answer === "circle" && entry.id === "fairy-ring") score += 4;
      if (answer === "fuzzy-mold" && (entry.id === "pythium-blight" || entry.id === "snow-mold")) score += 3;

      // Weeds
      if (answer === "grassy-weed" && entry.id === "crabgrass") score += 4;
      if (answer === "broadleaf-flower" && entry.id === "dandelion") score += 4;
      if (answer === "clover-like" && entry.id === "clover") score += 4;
    }

    // — Season bonus —
    if (entry.seasonalRisk.includes(season)) score += 1;

    if (score > 0) {
      scores.set(entry.id, score);
    }
  }

  // Normalise & sort
  const maxScore = Math.max(1, ...scores.values());
  const normFactor = Math.min(maxScore, maxPossible);

  return Array.from(scores.entries())
    .sort((a, b) => b[1] - a[1])
    .slice(0, 3)
    .map(([id, score]) => ({
      pest: PEST_DISEASE_DATA.find((p) => p.id === id)!,
      confidence: Math.min(99, Math.round((score / normFactor) * 100)),
    }));
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

// Hoisted outside component to avoid re-creation on every render
const SLIDE_VARIANTS = {
  enter: (d: number) => ({ x: d > 0 ? 80 : -80, opacity: 0 }),
  center: { x: 0, opacity: 1 },
  exit: (d: number) => ({ x: d > 0 ? -80 : 80, opacity: 0 }),
};

const TYPE_BADGE_COLORS: Record<string, string> = {
  pest: "bg-destructive/10 text-destructive",
  disease: "bg-lawn-caution/20 text-foreground",
  weed: "bg-primary/10 text-primary",
};

function TypeBadge({ type }: { type: PestDisease["type"] }) {
  return (
    <span
      className={`text-xs font-medium px-2 py-0.5 rounded-full ${TYPE_BADGE_COLORS[type] ?? ""}`}
    >
      {type.charAt(0).toUpperCase() + type.slice(1)}
    </span>
  );
}

const PestIdentifier = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const [primary, setPrimary] = useState<string | null>(null);
  const [followUpAnswers, setFollowUpAnswers] = useState<Record<string, string>>({});
  const [season, setSeason] = useState<Season | null>(null);
  const [direction, setDirection] = useState(1);

  const followUps = useMemo(
    () => (primary ? (FOLLOW_UPS[primary] ?? EMPTY_FOLLOWUPS) : EMPTY_FOLLOWUPS),
    [primary],
  );
  // Steps: 0 = primary, 1..N = follow-ups, N+1 = season, N+2 = results
  const totalQuestions = 1 + followUps.length + 1; // primary + follow-ups + season
  const totalSteps = totalQuestions + 1; // +1 for results screen
  const showResults = currentStep === totalQuestions;

  const results = useMemo(
    () =>
      showResults && primary && season
        ? computeMatches(primary, followUpAnswers, season)
        : [],
    [showResults, primary, followUpAnswers, season],
  );

  // Which follow-up index are we on? (0-based, relative to follow-ups array)
  const followUpIndex = currentStep - 1;
  const isOnFollowUp = followUpIndex >= 0 && followUpIndex < followUps.length;
  const isOnSeason = currentStep === 1 + followUps.length;

  const currentAnswer = (() => {
    if (currentStep === 0) return primary;
    if (isOnFollowUp) {
      const fu = followUps[followUpIndex];
      return fu ? followUpAnswers[fu.id] ?? null : null;
    }
    if (isOnSeason) return season;
    return null;
  })();

  const goNext = useCallback(() => {
    setDirection(1);
    setCurrentStep((s) => s + 1);
  }, []);

  const goBack = useCallback(() => {
    setDirection(-1);
    setCurrentStep((s) => Math.max(s - 1, 0));
  }, []);

  const startOver = useCallback(() => {
    setDirection(-1);
    setCurrentStep(0);
    setPrimary(null);
    setFollowUpAnswers({});
    setSeason(null);
  }, []);

  const selectOption = useCallback(
    (id: string) => {
      if (currentStep === 0) {
        setPrimary(id);
        // Reset follow-up answers when primary changes
        setFollowUpAnswers({});
      } else if (isOnFollowUp) {
        const fu = followUps[followUpIndex];
        if (fu) setFollowUpAnswers((prev) => ({ ...prev, [fu.id]: id }));
      } else if (isOnSeason) {
        setSeason(id as Season);
      }
    },
    [currentStep, isOnFollowUp, isOnSeason, followUps, followUpIndex],
  );

  // Determine current step UI
  let stepTitle = "";
  let stepSubtitle = "";
  let stepOptions: SymptomOption[] = [];

  if (currentStep === 0) {
    stepTitle = "What do you see?";
    stepSubtitle = "Select the symptom that best describes your lawn problem.";
    stepOptions = PRIMARY_SYMPTOMS;
  } else if (isOnFollowUp) {
    const fu = followUps[followUpIndex];
    if (fu) {
      stepTitle = fu.title;
      stepSubtitle = fu.subtitle;
      stepOptions = fu.options;
    }
  } else if (isOnSeason) {
    stepTitle = "What season is it?";
    stepSubtitle = "Seasonal timing helps narrow the diagnosis.";
    stepOptions = SEASON_OPTIONS;
  }

  return (
    <div className="min-h-screen bg-background pb-28">
      <AppHeader />

      <main id="main-content" className="max-w-2xl mx-auto px-5 sm:px-8 pb-12">
        {/* Back / nav */}
        <motion.div
          initial={{ opacity: 0, x: -8 }}
          animate={{ opacity: 1, x: 0 }}
          className="mt-4 mb-6"
        >
          <Button
            variant="ghost"
            size="sm"
            onClick={() =>
              currentStep === 0 ? window.history.back() : goBack()
            }
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
              Step {Math.min(currentStep + 1, totalSteps)} of {totalSteps}
            </span>
            <span>
              {Math.round(((currentStep + 1) / totalSteps) * 100)}%
            </span>
          </div>
          <div className="h-2 rounded-full bg-muted overflow-hidden">
            <motion.div
              className="h-full rounded-full bg-primary"
              initial={false}
              animate={{
                width: `${((currentStep + 1) / totalSteps) * 100}%`,
              }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
            />
          </div>
        </div>

        {/* Animated content */}
        <AnimatePresence mode="wait" custom={direction}>
          {!showResults ? (
            <motion.div
              key={`step-${currentStep}`}
              custom={direction}
              variants={SLIDE_VARIANTS}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
            >
              <h1 className="font-display text-2xl font-bold text-foreground mb-1 [text-wrap:balance]">
                {stepTitle}
              </h1>
              <p className="text-sm text-muted-foreground mb-6">
                {stepSubtitle}
              </p>

              <div className="space-y-3">
                {stepOptions.map((opt) => {
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
                        <Check
                          aria-hidden="true"
                          className="h-5 w-5 text-primary shrink-0 ml-auto self-center"
                        />
                      )}
                    </button>
                  );
                })}
              </div>

              {/* Next */}
              <div className="mt-8 flex justify-end">
                <Button
                  onClick={goNext}
                  disabled={!currentAnswer}
                  className="gap-1.5"
                >
                  {currentStep === totalQuestions - 1 ? "See Results" : "Next"}
                  <ArrowRight aria-hidden="true" className="h-4 w-4" />
                </Button>
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="results"
              custom={direction}
              variants={SLIDE_VARIANTS}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
            >
              <h1 className="font-display text-2xl font-bold text-foreground mb-1 [text-wrap:balance]">
                Diagnosis Results
              </h1>
              <p className="text-sm text-muted-foreground mb-6">
                Based on your answers, here are the most likely matches.
              </p>

              {results.length === 0 ? (
                <div className="rounded-xl border bg-card p-6 text-center text-muted-foreground">
                  We couldn't find a match. Try adjusting your answers.
                </div>
              ) : (
                <div className="space-y-5">
                  {results.map((r, i) => (
                    <motion.div
                      key={r.pest.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.15 * i }}
                      className="rounded-xl border border-primary/20 bg-card p-6 shadow-card"
                    >
                      {/* Header */}
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-3">
                          <span className="text-3xl" role="img" aria-label={r.pest.name}>
                            {r.pest.image}
                          </span>
                          <div>
                            <div className="flex items-center gap-2 mb-0.5">
                              <p className="font-display font-semibold text-foreground">
                                {i === 0 ? "Best Match" : i === 1 ? "Runner-up" : "Possible"}
                              </p>
                              <TypeBadge type={r.pest.type} />
                            </div>
                            <p className="text-lg font-bold text-primary">
                              {r.pest.name}
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
                        {r.pest.description}
                      </p>

                      {/* Symptoms */}
                      <div className="mb-4">
                        <p className="text-xs font-semibold text-foreground uppercase tracking-wide mb-1">
                          Key Symptoms
                        </p>
                        <ul className="list-disc list-inside text-sm text-muted-foreground space-y-0.5">
                          {r.pest.symptoms.map((s) => (
                            <li key={s}>{s}</li>
                          ))}
                        </ul>
                      </div>

                      {/* Treatments */}
                      <div className="mb-4">
                        <p className="text-xs font-semibold text-foreground uppercase tracking-wide mb-1 flex items-center gap-1">
                          <Shield aria-hidden="true" className="h-3.5 w-3.5 text-primary" />
                          Treatment Steps
                        </p>
                        <ol className="list-decimal list-inside text-sm text-muted-foreground space-y-0.5">
                          {r.pest.treatments.map((t) => (
                            <li key={t}>{t}</li>
                          ))}
                        </ol>
                      </div>

                      {/* Prevention */}
                      <div className="mb-3">
                        <p className="text-xs font-semibold text-foreground uppercase tracking-wide mb-1">
                          Prevention
                        </p>
                        <ul className="list-disc list-inside text-sm text-muted-foreground space-y-0.5">
                          {r.pest.prevention.map((p) => (
                            <li key={p}>{p}</li>
                          ))}
                        </ul>
                      </div>

                      {/* Season chips */}
                      <div className="flex flex-wrap gap-1.5">
                        {r.pest.seasonalRisk.map((s) => (
                          <span
                            key={s}
                            className="text-xs bg-muted text-muted-foreground px-2 py-0.5 rounded-full"
                          >
                            {s.charAt(0).toUpperCase() + s.slice(1)}
                          </span>
                        ))}
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}

              {/* Actions */}
              <div className="mt-8 flex flex-col sm:flex-row items-center gap-3">
                <Button variant="ghost" onClick={startOver} className="gap-1.5">
                  <RefreshCcw aria-hidden="true" className="h-4 w-4" />
                  Start Over
                </Button>
                <Button
                  variant="link"
                  asChild
                  className="text-muted-foreground"
                >
                  <Link to="/">Back to Dashboard</Link>
                </Button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      <BottomNav />
    </div>
  );
};

export default PestIdentifier;
