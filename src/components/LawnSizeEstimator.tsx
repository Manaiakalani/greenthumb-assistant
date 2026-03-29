import { useCallback, useMemo, useState } from "react";
import { motion } from "motion/react";
import { Ruler, Save, Leaf, Sprout, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useProfile } from "@/context/ProfileContext";

type Shape = "direct" | "rectangle" | "circle" | "l-shape" | "irregular";

const SHAPE_OPTIONS: { value: Shape; label: string }[] = [
  { value: "direct", label: "Enter directly" },
  { value: "rectangle", label: "Rectangle" },
  { value: "circle", label: "Circle" },
  { value: "l-shape", label: "L-Shape" },
  { value: "irregular", label: "Irregular" },
];

function NumberInput({
  id,
  label,
  value,
  onChange,
  placeholder,
  unit = "ft",
}: {
  id?: string;
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  unit?: string;
}) {
  const inputId = id || `lawn-${label.toLowerCase().replace(/\s+/g, '-')}`;
  return (
    <div className="space-y-1.5">
      <Label htmlFor={inputId} className="text-xs">{label}</Label>
      <div className="relative">
        <input
          id={inputId}
          type="number"
          min={0}
          inputMode="decimal"
          name={inputId}
          autoComplete="off"
          className="w-full h-9 rounded-md border border-input bg-background px-3 pr-10 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
        />
        <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-muted-foreground">
          {unit}
        </span>
      </div>
    </div>
  );
}

export function LawnSizeEstimator() {
  const { profile, updateProfile } = useProfile();
  const [shape, setShape] = useState<Shape>("direct");
  const [directSqFt, setDirectSqFt] = useState("");
  const [rectLength, setRectLength] = useState("");
  const [rectWidth, setRectWidth] = useState("");
  const [circleDiameter, setCircleDiameter] = useState("");
  const [lRect1Length, setLRect1Length] = useState("");
  const [lRect1Width, setLRect1Width] = useState("");
  const [lRect2Length, setLRect2Length] = useState("");
  const [lRect2Width, setLRect2Width] = useState("");
  const [irregularSqFt, setIrregularSqFt] = useState("");
  const [subtractArea, setSubtractArea] = useState("");
  const [saved, setSaved] = useState(false);

  const grossArea = useMemo(() => {
    switch (shape) {
      case "direct":
        return parseFloat(directSqFt) || 0;
      case "rectangle":
        return (parseFloat(rectLength) || 0) * (parseFloat(rectWidth) || 0);
      case "circle": {
        const r = (parseFloat(circleDiameter) || 0) / 2;
        return Math.PI * r * r;
      }
      case "l-shape":
        return (
          (parseFloat(lRect1Length) || 0) * (parseFloat(lRect1Width) || 0) +
          (parseFloat(lRect2Length) || 0) * (parseFloat(lRect2Width) || 0)
        );
      case "irregular":
        return parseFloat(irregularSqFt) || 0;
      default:
        return 0;
    }
  }, [
    shape,
    directSqFt,
    rectLength,
    rectWidth,
    circleDiameter,
    lRect1Length,
    lRect1Width,
    lRect2Length,
    lRect2Width,
    irregularSqFt,
  ]);

  const netArea = Math.max(0, Math.round(grossArea - (parseFloat(subtractArea) || 0)));
  const canSave = netArea > 0;

  const handleSave = useCallback(() => {
    if (!canSave) return;
    updateProfile({ lawnSizeSqFt: netArea });
    setSaved(true);
  }, [canSave, netArea, updateProfile]);

  const displaySize = saved ? netArea : profile.lawnSizeSqFt;

  // Product calculations based on common lawn care rates
  const products = useMemo(() => {
    if (!displaySize) return null;
    const k = displaySize / 1000;
    return [
      {
        icon: Leaf,
        name: "Fertilizer (1\u00A0lb N / 1,000\u00A0sq\u00A0ft)",
        amount: `${(k * 1).toFixed(1)}\u00A0lbs`,
        note: "Per application — typical 24-0-6 bag covers ~5,000\u00A0sq\u00A0ft",
      },
      {
        icon: Sprout,
        name: "Seed for overseeding (tall fescue)",
        amount: `${(k * 5).toFixed(1)}\u00A0lbs`,
        note: "4–6\u00A0lbs per 1,000\u00A0sq\u00A0ft; using 5\u00A0lb midpoint",
      },
      {
        icon: ShieldCheck,
        name: "Pre-emergent (prodiamine 0.38%)",
        amount: `${(k * 3).toFixed(1)}\u00A0lbs`,
        note: "~3\u00A0lbs granular per 1,000\u00A0sq\u00A0ft per label rate",
      },
    ];
  }, [displaySize]);

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex items-center gap-2">
        <Ruler aria-hidden="true" className="h-5 w-5 text-primary" />
        <h3 className="font-display text-lg font-semibold text-foreground">
          Lawn Size Estimator
        </h3>
      </div>

      <p className="text-sm text-muted-foreground">
        Enter your lawn size directly or calculate it from shape measurements. Results are used for product quantity recommendations.
      </p>

      {/* Shape selector */}
      <div className="space-y-2">
        <Label htmlFor="lawn-calc-method">Calculation Method</Label>
        <Select
          value={shape}
          onValueChange={(v) => {
            setShape(v as Shape);
            setSaved(false);
          }}
        >
          <SelectTrigger id="lawn-calc-method">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {SHAPE_OPTIONS.map((o) => (
              <SelectItem key={o.value} value={o.value}>
                {o.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Shape-specific inputs */}
      <div className="grid grid-cols-2 gap-4">
        {shape === "direct" && (
          <div className="col-span-2">
            <NumberInput
              label="Total lawn area"
              value={directSqFt}
              onChange={(v) => { setDirectSqFt(v); setSaved(false); }}
              placeholder="e.g. 5000…"
              unit="sq ft"
            />
          </div>
        )}

        {shape === "rectangle" && (
          <>
            <NumberInput label="Length" value={rectLength} onChange={(v) => { setRectLength(v); setSaved(false); }} />
            <NumberInput label="Width" value={rectWidth} onChange={(v) => { setRectWidth(v); setSaved(false); }} />
          </>
        )}

        {shape === "circle" && (
          <div className="col-span-2">
            <NumberInput
              label="Diameter"
              value={circleDiameter}
              onChange={(v) => { setCircleDiameter(v); setSaved(false); }}
              placeholder="e.g. 80…"
            />
          </div>
        )}

        {shape === "l-shape" && (
          <>
            <NumberInput label="Section 1 length" value={lRect1Length} onChange={(v) => { setLRect1Length(v); setSaved(false); }} />
            <NumberInput label="Section 1 width" value={lRect1Width} onChange={(v) => { setLRect1Width(v); setSaved(false); }} />
            <NumberInput label="Section 2 length" value={lRect2Length} onChange={(v) => { setLRect2Length(v); setSaved(false); }} />
            <NumberInput label="Section 2 width" value={lRect2Width} onChange={(v) => { setLRect2Width(v); setSaved(false); }} />
          </>
        )}

        {shape === "irregular" && (
          <div className="col-span-2">
            <NumberInput
              label="Estimated total area"
              value={irregularSqFt}
              onChange={(v) => { setIrregularSqFt(v); setSaved(false); }}
              placeholder="Estimate total square footage…"
              unit="sq ft"
            />
          </div>
        )}
      </div>

      {/* Subtract non-lawn areas */}
      <NumberInput
        label="Subtract (house, driveway, garden beds)"
        value={subtractArea}
        onChange={(v) => { setSubtractArea(v); setSaved(false); }}
        placeholder="0"
        unit="sq ft"
      />

      {/* Computed area preview */}
      {grossArea > 0 && (
        <div className="text-sm text-muted-foreground">
          Calculated area:{" "}
          <span className="font-semibold text-foreground">
            {netArea.toLocaleString()}&nbsp;sq&nbsp;ft
          </span>
        </div>
      )}

      {/* Save button */}
      {!saved ? (
        <Button
          onClick={handleSave}
          disabled={!canSave}
          className="w-full gap-2 bg-primary"
        >
          <Save aria-hidden="true" className="h-4 w-4" />
          Save Lawn Size
        </Button>
      ) : null}

      {/* Results section */}
      {displaySize && displaySize > 0 && (saved || profile.lawnSizeSqFt) && (
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          className="rounded-xl border border-primary/20 bg-primary/5 p-5 space-y-4"
        >
          <div className="flex items-center justify-between">
            <h4 className="font-display font-semibold text-foreground">
              Saved Lawn Size
            </h4>
            <span className="text-xl font-display font-bold text-primary">
              {displaySize.toLocaleString()}&nbsp;sq&nbsp;ft
            </span>
          </div>

          {products && (
            <div className="space-y-3">
              <h5 className="text-sm font-display font-semibold text-foreground">
                Product Quantities
              </h5>
              <div className="divide-y divide-border rounded-lg border bg-background">
                {products.map((p) => (
                  <div
                    key={p.name}
                    className="flex items-start gap-3 px-4 py-3"
                  >
                    <p.icon aria-hidden="true" className="h-4 w-4 mt-0.5 shrink-0 text-primary" />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-baseline justify-between gap-2">
                        <span className="text-sm font-medium text-foreground">
                          {p.name}
                        </span>
                        <span className="text-sm font-display font-bold text-primary whitespace-nowrap">
                          {p.amount}
                        </span>
                      </div>
                      <p className="text-xs text-muted-foreground mt-0.5">
                        {p.note}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          <p className="text-xs text-muted-foreground text-center">
            💡 Product amounts are estimates — always follow the product label
          </p>
        </motion.div>
      )}
    </div>
  );
}
