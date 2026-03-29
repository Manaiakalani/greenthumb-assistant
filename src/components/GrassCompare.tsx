import { useMemo, useState } from "react";
import { Scale } from "lucide-react";
import { useProfile } from "@/context/ProfileContext";
import {
  grassTypes,
  getGrassTypesForZone,
  TRAIT_LABELS,
  type GrassTypeInfo,
} from "@/data/grassTypes";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const TRAIT_KEYS = Object.keys(TRAIT_LABELS) as (keyof GrassTypeInfo["traits"])[];

function RatingDots({
  value,
  highlight,
}: {
  value: number;
  highlight: boolean;
}) {
  return (
    <span className="inline-flex gap-1" aria-label={`${value} out of 5`}>
      {[1, 2, 3, 4, 5].map((n) => (
        <span
          key={n}
          className={`inline-block h-2.5 w-2.5 rounded-full transition-colors ${
            n <= value
              ? highlight
                ? "bg-primary"
                : "bg-primary/60"
              : "bg-muted"
          }`}
          aria-hidden="true"
        />
      ))}
    </span>
  );
}

function getWinner(
  a: GrassTypeInfo,
  b: GrassTypeInfo,
  trait: keyof GrassTypeInfo["traits"],
): "a" | "b" | "tie" {
  if (trait === "maintenance") {
    // Lower maintenance is better
    if (a.traits[trait] < b.traits[trait]) return "a";
    if (a.traits[trait] > b.traits[trait]) return "b";
    return "tie";
  }
  if (a.traits[trait] > b.traits[trait]) return "a";
  if (a.traits[trait] < b.traits[trait]) return "b";
  return "tie";
}

function buildRecommendation(
  a: GrassTypeInfo,
  b: GrassTypeInfo,
  zone: string,
): string {
  const aWins: string[] = [];
  const bWins: string[] = [];

  for (const key of TRAIT_KEYS) {
    const winner = getWinner(a, b, key);
    const label = TRAIT_LABELS[key].toLowerCase();
    if (winner === "a") aWins.push(label);
    if (winner === "b") bWins.push(label);
  }

  const aPart =
    aWins.length > 0
      ? `${a.name} is better for ${aWins.slice(0, 3).join(", ")}`
      : `${a.name} ties across categories`;
  const bPart =
    bWins.length > 0
      ? `${b.name} excels at ${bWins.slice(0, 3).join(", ")}`
      : `${b.name} ties across categories`;

  return `For Zone ${zone}, ${aPart} while ${bPart}.`;
}

export function GrassCompare() {
  const { profile } = useProfile();

  const zoneSuggestions = useMemo(
    () => getGrassTypesForZone(profile.zone),
    [profile.zone],
  );

  const defaultA = profile.grassType || "Tall Fescue";
  const defaultB = useMemo(() => {
    const complement = zoneSuggestions.find((g) => g.name !== defaultA);
    return complement?.name ?? grassTypes[0].name;
  }, [zoneSuggestions, defaultA]);

  const [selectedA, setSelectedA] = useState(defaultA);
  const [selectedB, setSelectedB] = useState(defaultB);

  const grassA = useMemo(
    () => grassTypes.find((g) => g.name === selectedA) ?? grassTypes[0],
    [selectedA],
  );
  const grassB = useMemo(
    () => grassTypes.find((g) => g.name === selectedB) ?? grassTypes[1],
    [selectedB],
  );

  const recommendation = useMemo(
    () => buildRecommendation(grassA, grassB, profile.zone),
    [grassA, grassB, profile.zone],
  );

  const handleSwap = () => {
    setSelectedA(selectedB);
    setSelectedB(selectedA);
  };

  return (
    <div className="rounded-xl border border-primary/15 bg-card p-6 shadow-card">
      {/* Header */}
      <div className="mb-4 flex items-center gap-2">
        <Scale aria-hidden="true" className="h-5 w-5 text-primary" />
        <h2 className="font-display text-lg font-semibold text-foreground [text-wrap:balance]">
          Grass Comparison
        </h2>
      </div>

      {/* Zone suggestion */}
      {zoneSuggestions.length > 0 && (
        <p className="mb-4 text-xs text-muted-foreground">
          Showing grasses suited for your Zone {profile.zone}. You can compare
          any two types below.
        </p>
      )}

      {/* Selectors */}
      <div className="mb-5 grid grid-cols-2 gap-3">
        <div>
          <label className="mb-1 block text-xs font-medium text-muted-foreground">
            Grass A
          </label>
          <Select value={selectedA} onValueChange={setSelectedA}>
            <SelectTrigger className="min-h-[44px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {grassTypes.map((g) => (
                <SelectItem key={g.name} value={g.name}>
                  {g.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div>
          <label className="mb-1 block text-xs font-medium text-muted-foreground">
            Grass B
          </label>
          <Select value={selectedB} onValueChange={setSelectedB}>
            <SelectTrigger className="min-h-[44px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {grassTypes.map((g) => (
                <SelectItem key={g.name} value={g.name}>
                  {g.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Comparison table */}
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border">
              <th className="py-2 text-left text-xs font-medium text-muted-foreground">
                Trait
              </th>
              <th className="py-2 text-center text-xs font-medium text-muted-foreground">
                <span className="font-display">{grassA.name}</span>
              </th>
              <th className="py-2 text-center text-xs font-medium text-muted-foreground">
                <span className="font-display">{grassB.name}</span>
              </th>
            </tr>
          </thead>
          <tbody>
            {TRAIT_KEYS.map((key) => {
              const winner = getWinner(grassA, grassB, key);
              return (
                <tr key={key} className="border-b border-border/50">
                  <td className="py-2.5 text-foreground">
                    {TRAIT_LABELS[key]}
                  </td>
                  <td
                    className={`py-2.5 text-center ${
                      winner === "a" ? "rounded-md bg-primary/10" : ""
                    }`}
                  >
                    <RatingDots
                      value={grassA.traits[key]}
                      highlight={winner === "a"}
                    />
                  </td>
                  <td
                    className={`py-2.5 text-center ${
                      winner === "b" ? "rounded-md bg-primary/10" : ""
                    }`}
                  >
                    <RatingDots
                      value={grassB.traits[key]}
                      highlight={winner === "b"}
                    />
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Detail rows */}
      <div className="mt-4 grid grid-cols-2 gap-3 text-xs text-muted-foreground">
        <div>
          <p>
            <span className="font-medium text-foreground">Season:</span>{" "}
            {grassA.season === "cool" ? "Cool-Season" : "Warm-Season"}
          </p>
          <p>
            <span className="font-medium text-foreground">Mow Height:</span>{" "}
            {grassA.mowHeight}
          </p>
          <p>
            <span className="font-medium text-foreground">Water:</span>{" "}
            {grassA.waterNeeds}
          </p>
          <p>
            <span className="font-medium text-foreground">Establish:</span>{" "}
            {grassA.establishment}
          </p>
        </div>
        <div>
          <p>
            <span className="font-medium text-foreground">Season:</span>{" "}
            {grassB.season === "cool" ? "Cool-Season" : "Warm-Season"}
          </p>
          <p>
            <span className="font-medium text-foreground">Mow Height:</span>{" "}
            {grassB.mowHeight}
          </p>
          <p>
            <span className="font-medium text-foreground">Water:</span>{" "}
            {grassB.waterNeeds}
          </p>
          <p>
            <span className="font-medium text-foreground">Establish:</span>{" "}
            {grassB.establishment}
          </p>
        </div>
      </div>

      {/* Recommendation */}
      <div className="mt-4 rounded-lg bg-primary/5 p-3">
        <p className="text-sm text-foreground">{recommendation}</p>
      </div>

      {/* Swap button */}
      <button
        type="button"
        onClick={handleSwap}
        className="mt-4 inline-flex min-h-[44px] items-center gap-1.5 rounded-lg border border-primary/20 bg-background px-4 py-2 text-sm font-medium text-primary transition-colors hover:bg-primary/5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
      >
        ⇄ Compare Another
      </button>
    </div>
  );
}
