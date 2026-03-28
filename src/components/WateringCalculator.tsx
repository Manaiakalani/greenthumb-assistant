import { useCallback, useMemo, useState } from "react";
import { motion } from "framer-motion";
import { Calculator, Droplets } from "lucide-react";
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

const SPRINKLER_TYPES = {
  "rotary":     { label: "Rotary / Rotor",       rate: 0.5  },   // inches per hour
  "fixed":      { label: "Fixed / Spray Head",    rate: 1.5  },
  "oscillating":{ label: "Oscillating",           rate: 0.8  },
  "drip":       { label: "Drip / Soaker",         rate: 0.5  },
  "impact":     { label: "Impact Sprinkler",      rate: 0.7  },
} as const;

type SprinklerType = keyof typeof SPRINKLER_TYPES;

const LAWN_SIZE_SQFT: Record<string, number> = {
  Small: 2500,
  Medium: 5000,
  Large: 10000,
};

const TARGET_INCHES = 1.0; // inches per week recommended

export function WateringCalculator() {
  const { profile } = useProfile();
  const [sprinklerType, setSprinklerType] = useState<SprinklerType>("rotary");
  const [calculated, setCalculated] = useState(false);

  const sqft = LAWN_SIZE_SQFT[profile.lawnSize] ?? 5000;
  const sprinkler = SPRINKLER_TYPES[sprinklerType];

  const result = useMemo(() => {
    const minutesPerSession = Math.round((TARGET_INCHES / sprinkler.rate) * 60);
    const sessionsPerWeek = minutesPerSession > 40 ? 3 : 2;
    const perSession = Math.round(minutesPerSession / sessionsPerWeek);
    const gallonsPerWeek = Math.round(sqft * TARGET_INCHES * 0.623); // 0.623 gal per sqft-inch

    return { minutesPerSession: perSession, sessionsPerWeek, gallonsPerWeek, totalMinutes: minutesPerSession };
  }, [sprinkler.rate, sqft]);

  const handleCalculate = useCallback(() => setCalculated(true), []);

  return (
    <div className="space-y-5">
      <div className="flex items-center gap-2">
        <Calculator className="h-5 w-5 text-primary" />
        <h3 className="font-display text-lg font-semibold text-foreground">
          Watering Calculator
        </h3>
      </div>

      <p className="text-sm text-muted-foreground">
        Find out exactly how long to run your sprinklers each session for a healthy lawn.
      </p>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label>Sprinkler Type</Label>
          <Select value={sprinklerType} onValueChange={(v) => { setSprinklerType(v as SprinklerType); setCalculated(false); }}>
            <SelectTrigger><SelectValue /></SelectTrigger>
            <SelectContent>
              {Object.entries(SPRINKLER_TYPES).map(([key, { label }]) => (
                <SelectItem key={key} value={key}>{label}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label>Lawn Size</Label>
          <div className="flex items-center h-9 px-3 rounded-md border border-input bg-background text-sm">
            {profile.lawnSize} (~{sqft.toLocaleString()} sq ft)
          </div>
        </div>
      </div>

      <div className="flex items-center gap-2 text-xs text-muted-foreground">
        <Droplets className="h-3.5 w-3.5" />
        <span>Target: {TARGET_INCHES}" per week (recommended for most lawns)</span>
      </div>

      {!calculated ? (
        <Button onClick={handleCalculate} className="w-full gap-2 bg-primary">
          <Calculator className="h-4 w-4" />
          Calculate
        </Button>
      ) : (
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          className="rounded-xl border border-primary/20 bg-primary/5 p-5"
        >
          <h4 className="font-display font-semibold text-foreground mb-3">
            Your Watering Plan
          </h4>
          <div className="grid grid-cols-3 gap-4 text-center">
            <div>
              <p className="text-2xl font-display font-bold text-primary">{result.minutesPerSession}</p>
              <p className="text-xs text-muted-foreground">min per session</p>
            </div>
            <div>
              <p className="text-2xl font-display font-bold text-primary">{result.sessionsPerWeek}x</p>
              <p className="text-xs text-muted-foreground">per week</p>
            </div>
            <div>
              <p className="text-2xl font-display font-bold text-primary">{result.gallonsPerWeek}</p>
              <p className="text-xs text-muted-foreground">gal / week</p>
            </div>
          </div>
          <p className="mt-3 text-xs text-muted-foreground text-center">
            💡 Water early morning (6-10 AM) to minimize evaporation
          </p>
        </motion.div>
      )}
    </div>
  );
}
