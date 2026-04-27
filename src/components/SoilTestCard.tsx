import { useCallback, useMemo, useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import FlaskConical from "lucide-react/dist/esm/icons/flask-conical";
import Leaf from "lucide-react/dist/esm/icons/leaf";
import Info from "lucide-react/dist/esm/icons/info";
import Check from "lucide-react/dist/esm/icons/check";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { safeGetItem, safeSetItem } from "@/lib/safeStorage";
import type { NutrientLevel, SoilTestResults } from "@/types/profile";
import { formatShortDate } from "@/lib/dateFormat";

const STORAGE_KEY = "grasswise-soil-test";

const NUTRIENT_LEVELS: NutrientLevel[] = ["low", "adequate", "high"];

// ── colour helpers ──────────────────────────────────────────────
function phColor(ph: number) {
  if (ph < 5.5 || ph > 7.5) return "text-red-500 bg-red-500/15";
  if (ph < 6.0 || ph > 7.0) return "text-yellow-500 bg-yellow-500/15";
  return "text-green-500 bg-green-500/15";
}

function nutrientColor(level: NutrientLevel) {
  if (level === "low") return "text-red-500 bg-red-500/15";
  if (level === "high") return "text-yellow-500 bg-yellow-500/15";
  return "text-green-500 bg-green-500/15";
}

function nutrientDot(level: NutrientLevel) {
  if (level === "low") return "bg-red-500";
  if (level === "high") return "bg-yellow-500";
  return "bg-green-500";
}

// ── recommendations engine ──────────────────────────────────────
function getRecommendations(results: SoilTestResults): string[] {
  const recs: string[] = [];
  if (results.ph < 6.0) recs.push("Apply lime to raise soil pH");
  if (results.ph > 7.5) recs.push("Apply sulfur to lower pH");
  if (results.nitrogen === "low")
    recs.push("Increase nitrogen in your next fertilizer application");
  if (results.phosphorus === "low")
    recs.push("Use a starter fertilizer with phosphorus (e.g., 18-24-12)");
  if (results.phosphorus === "high")
    recs.push("Skip phosphorus — your soil has enough");
  if (results.potassium === "low")
    recs.push(
      "Add potassium-rich fertilizer (e.g., 0-0-60 muriate of potash)",
    );
  return recs;
}

// ── NutrientToggle ──────────────────────────────────────────────
function NutrientToggle({
  label,
  value,
  onChange,
}: {
  label: string;
  value: NutrientLevel;
  onChange: (v: NutrientLevel) => void;
}) {
  return (
    <div className="space-y-1.5">
      <Label className="text-xs font-medium text-muted-foreground">
        {label}
      </Label>
      <div className="flex rounded-lg border border-border overflow-hidden">
        {NUTRIENT_LEVELS.map((level) => (
          <button
            key={level}
            type="button"
            onClick={() => onChange(level)}
            aria-pressed={value === level}
            className={`flex-1 px-2 py-1.5 text-xs font-medium capitalize transition-colors ${
              value === level
                ? level === "low"
                  ? "bg-red-500/15 text-red-600"
                  : level === "high"
                    ? "bg-yellow-500/15 text-yellow-600"
                    : "bg-green-500/15 text-green-600"
                : "text-muted-foreground hover:bg-muted/50"
            }`}
          >
            {level}
          </button>
        ))}
      </div>
    </div>
  );
}

// ── main component ──────────────────────────────────────────────
export function SoilTestCard() {
  const [saved, setSaved] = useState<SoilTestResults | null>(() =>
    safeGetItem<SoilTestResults | null>(STORAGE_KEY, null),
  );
  const [editing, setEditing] = useState(saved === null);
  const [justSaved, setJustSaved] = useState(false);

  // form state
  const [ph, setPh] = useState(saved?.ph ?? 6.5);
  const [nitrogen, setNitrogen] = useState<NutrientLevel>(
    saved?.nitrogen ?? "adequate",
  );
  const [phosphorus, setPhosphorus] = useState<NutrientLevel>(
    saved?.phosphorus ?? "adequate",
  );
  const [potassium, setPotassium] = useState<NutrientLevel>(
    saved?.potassium ?? "adequate",
  );
  const [organicMatter, setOrganicMatter] = useState(
    saved?.organicMatter?.toString() ?? "",
  );
  const [testDate, setTestDate] = useState(
    saved?.testDate ?? new Date().toISOString().slice(0, 10),
  );

  const handleSave = useCallback(() => {
    const results: SoilTestResults = {
      ph,
      nitrogen,
      phosphorus,
      potassium,
      ...(organicMatter ? { organicMatter: parseFloat(organicMatter) } : {}),
      testDate,
    };
    safeSetItem(STORAGE_KEY, results);
    setSaved(results);
    setEditing(false);
    setJustSaved(true);
    setTimeout(() => setJustSaved(false), 2000);
  }, [ph, nitrogen, phosphorus, potassium, organicMatter, testDate]);

  const recommendations = useMemo(
    () => (saved ? getRecommendations(saved) : []),
    [saved],
  );

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <FlaskConical aria-hidden="true" className="h-5 w-5 text-primary" />
          <h3 className="font-display text-lg font-semibold text-foreground">
            Soil Test Results
          </h3>
        </div>
        {saved && !editing && (
          <Button
            variant="outline"
            size="sm"
            onClick={() => setEditing(true)}
            className="text-xs"
          >
            Edit Results
          </Button>
        )}
      </div>

      <AnimatePresence mode="wait">
        {editing ? (
          /* ── EDIT MODE ──────────────────────────────── */
          <motion.form
            key="form"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            className="space-y-4"
            onSubmit={(e) => {
              e.preventDefault();
              handleSave();
            }}
          >
            {/* pH */}
            <div className="space-y-1.5">
              <Label htmlFor="soil-ph" className="text-xs font-medium text-muted-foreground">
                pH Level
              </Label>
              <div className="flex items-center gap-3">
                <input
                  type="range"
                  id="soil-ph"
                  name="soil-ph"
                  min={4}
                  max={9}
                  step={0.1}
                  value={ph}
                  onChange={(e) => setPh(parseFloat(e.target.value))}
                  className="flex-1 accent-primary"
                />
                <Input
                  type="number"
                  min={4}
                  max={9}
                  step={0.1}
                  value={ph}
                  onChange={(e) => {
                    const v = parseFloat(e.target.value);
                    if (!isNaN(v) && v >= 4 && v <= 9) setPh(v);
                  }}
                  aria-label="pH level number input"
                  name="soil-ph-number"
                  autoComplete="off"
                  className="w-20 text-center text-sm"
                />
              </div>
              <p className="text-[10px] text-muted-foreground">
                Ideal for most lawns: 6.0–7.0
              </p>
            </div>

            {/* N-P-K toggles */}
            <div className="grid grid-cols-3 gap-3">
              <NutrientToggle
                label="Nitrogen (N)"
                value={nitrogen}
                onChange={setNitrogen}
              />
              <NutrientToggle
                label="Phosphorus (P)"
                value={phosphorus}
                onChange={setPhosphorus}
              />
              <NutrientToggle
                label="Potassium (K)"
                value={potassium}
                onChange={setPotassium}
              />
            </div>

            {/* Organic matter */}
            <div className="space-y-1.5">
              <Label
                htmlFor="organic-matter"
                className="text-xs font-medium text-muted-foreground"
              >
                Organic Matter % (optional)
              </Label>
              <Input
                id="organic-matter"
                type="number"
                min={0}
                max={100}
                step={0.1}
                placeholder="e.g. 3.5…"
                name="organic-matter"
                autoComplete="off"
                value={organicMatter}
                onChange={(e) => setOrganicMatter(e.target.value)}
                className="w-32 text-sm"
              />
            </div>

            {/* Date */}
            <div className="space-y-1.5">
              <Label
                htmlFor="test-date"
                className="text-xs font-medium text-muted-foreground"
              >
                Test Date
              </Label>
              <Input
                id="test-date"
                type="date"
                name="test-date"
                autoComplete="off"
                value={testDate}
                onChange={(e) => setTestDate(e.target.value)}
                className="w-44 text-sm"
              />
            </div>

            <div className="flex gap-2 pt-1">
              <Button type="submit" size="sm">
                Save Results
              </Button>
              {saved && (
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => setEditing(false)}
                >
                  Cancel
                </Button>
              )}
            </div>
          </motion.form>
        ) : saved ? (
          /* ── DISPLAY MODE ───────────────────────────── */
          <motion.div
            key="display"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            className="space-y-4"
          >
            {justSaved && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="flex items-center gap-2 rounded-lg bg-green-500/10 border border-green-500/20 p-2.5 text-xs text-green-600"
                aria-live="polite"
              >
                <Check aria-hidden="true" className="h-3.5 w-3.5" />
                Results saved
              </motion.div>
            )}

            {/* Result chips */}
            <div className="grid grid-cols-2 gap-2">
              <div
                className={`rounded-lg p-3 ${phColor(saved.ph)}`}
              >
                <span className="text-[10px] uppercase tracking-wider opacity-70">
                  pH
                </span>
                <p className="text-xl font-display font-bold tabular-nums">{saved.ph}</p>
              </div>
              {(
                [
                  ["Nitrogen", saved.nitrogen],
                  ["Phosphorus", saved.phosphorus],
                  ["Potassium", saved.potassium],
                ] as const
              ).map(([name, level]) => (
                <div
                  key={name}
                  className={`rounded-lg p-3 ${nutrientColor(level)}`}
                >
                  <span className="text-[10px] uppercase tracking-wider opacity-70">
                    {name}
                  </span>
                  <div className="flex items-center gap-1.5 mt-0.5">
                    <div
                      className={`h-2 w-2 rounded-full ${nutrientDot(level)}`}
                    />
                    <p className="text-sm font-semibold capitalize">{level}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Organic matter & date */}
            <div className="flex items-center gap-4 text-xs text-muted-foreground">
              {saved.organicMatter != null && (
                <span>
                  Organic matter: <strong>{saved.organicMatter}%</strong>
                </span>
              )}
              <span>
                Tested:{" "}
                <strong>
                  {formatShortDate(saved.testDate)}
                </strong>
              </span>
            </div>

            {/* Recommendations */}
            {recommendations.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 4 }}
                animate={{ opacity: 1, y: 0 }}
                className="rounded-lg border border-primary/15 bg-primary/5 p-3 space-y-2"
              >
                <div className="flex items-center gap-1.5">
                  <Leaf aria-hidden="true" className="h-3.5 w-3.5 text-primary" />
                  <span className="text-xs font-semibold text-foreground">
                    Recommendations
                  </span>
                </div>
                <ul className="space-y-1">
                  {recommendations.map((rec) => (
                    <li
                      key={rec}
                      className="text-xs text-muted-foreground flex items-start gap-1.5"
                    >
                      <span className="text-primary mt-0.5">•</span>
                      {rec}
                    </li>
                  ))}
                </ul>
              </motion.div>
            )}
          </motion.div>
        ) : null}
      </AnimatePresence>

      {/* When to test tip */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="flex items-start gap-2 rounded-lg border border-border bg-muted/30 p-3"
      >
        <Info aria-hidden="true" className="h-3.5 w-3.5 text-muted-foreground mt-0.5 shrink-0" />
        <p className="text-[11px] text-muted-foreground">
          Test every 2–3 years, ideally in fall. Your local extension office can
          provide lab-grade soil analysis.
        </p>
      </motion.div>
    </div>
  );
}
