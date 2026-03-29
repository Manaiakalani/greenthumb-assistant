export interface FertilizerPreset {
  name: string;
  n: number;
  p: number;
  k: number;
  type: string;
  description: string;
}

export const fertilizerPresets: FertilizerPreset[] = [
  {
    name: "Spring Fertilizer (24-0-3)",
    n: 24,
    p: 0,
    k: 3,
    type: "Spring",
    description:
      "High nitrogen for rapid spring green-up. Best applied when grass is actively growing.",
  },
  {
    name: "Starter Fertilizer (10-18-10)",
    n: 10,
    p: 18,
    k: 10,
    type: "Starter",
    description:
      "High phosphorus to promote strong root development in newly seeded or sodded lawns.",
  },
  {
    name: "Winterizer (22-0-14)",
    n: 22,
    p: 0,
    k: 14,
    type: "Winterizer",
    description:
      "High potassium builds stress tolerance and helps lawns survive winter dormancy.",
  },
  {
    name: "Balanced (10-10-10)",
    n: 10,
    p: 10,
    k: 10,
    type: "Balanced",
    description:
      "Equal parts N-P-K for general-purpose feeding when soil test results are unavailable.",
  },
  {
    name: "Lawn Maintenance (32-0-4)",
    n: 32,
    p: 0,
    k: 4,
    type: "Spring",
    description:
      "Fast-release nitrogen for quick color response during the growing season.",
  },
  {
    name: "Slow-Release (21-0-0)",
    n: 21,
    p: 0,
    k: 0,
    type: "Spring",
    description:
      "Nitrogen-only slow-release formula that feeds gradually over 8-10 weeks.",
  },
  {
    name: "Fall Fertilizer (24-0-10)",
    n: 24,
    p: 0,
    k: 10,
    type: "Winterizer",
    description:
      "Moderate potassium to prepare cool-season grasses for fall root growth and winter hardiness.",
  },
  {
    name: "Organic (5-3-4)",
    n: 5,
    p: 3,
    k: 4,
    type: "Balanced",
    description:
      "Low-analysis organic blend that feeds soil biology and provides gentle, steady nutrition.",
  },
  {
    name: "Phosphorus-Free (28-0-3)",
    n: 28,
    p: 0,
    k: 3,
    type: "Spring",
    description:
      "Compliant with phosphorus-ban regulations. Use on established lawns with adequate soil P levels.",
  },
  {
    name: "New Lawn Starter (12-25-8)",
    n: 12,
    p: 25,
    k: 8,
    type: "Starter",
    description:
      "Extra-high phosphorus for maximum root establishment on bare soil or overseeded areas.",
  },
];
