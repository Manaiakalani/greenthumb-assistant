export interface TutorialStep {
  title: string;
  description: string;
  icon: string;
  tip?: string;
}

export interface Tutorial {
  id: string;
  title: string;
  description: string;
  steps: TutorialStep[];
  estimatedMinutes: number;
  category: "basics" | "seasonal" | "advanced";
}

export const tutorials: Tutorial[] = [
  {
    id: "mow-like-a-pro",
    title: "How to Mow Like a Pro",
    description:
      "Master the fundamentals of mowing for a healthier, thicker lawn.",
    category: "basics",
    estimatedMinutes: 8,
    steps: [
      {
        title: "Set the Right Height",
        description:
          "Never cut more than one-third of the grass blade at a time. For most cool-season grasses, keep the height at 3–4 inches; warm-season grasses do well at 1–2 inches.",
        icon: "Ruler",
        tip: "Raise the deck one notch during summer heat to reduce stress on your lawn.",
      },
      {
        title: "Alternate Your Pattern",
        description:
          "Change your mowing direction each session—horizontal, vertical, or diagonal. This prevents soil compaction and keeps grass blades growing upright.",
        icon: "Route",
        tip: "Diagonal striping gives a professional ball-field look without extra equipment.",
      },
      {
        title: "Mow at the Right Frequency",
        description:
          "During peak growing season, mow every 5–7 days. In slower months, every 10–14 days is enough. Let growth rate guide you, not the calendar.",
        icon: "CalendarDays",
        tip: "If the lawn looks shaggy after 4 days, it's time—don't wait for the weekend.",
      },
      {
        title: "Leave the Clippings (Mulch Mow)",
        description:
          "Grass clippings decompose quickly and return nitrogen to the soil. Use a mulching blade or mow over clippings a second time to break them down.",
        icon: "Recycle",
        tip: "Mulch mowing can supply up to 25% of your lawn's nitrogen needs each year.",
      },
      {
        title: "Keep Your Blades Sharp",
        description:
          "Dull blades tear grass instead of cutting it, leaving ragged edges that turn brown and invite disease. Sharpen or replace blades every 20–25 hours of use.",
        icon: "Scissors",
        tip: "Run a finger (carefully!) along the blade edge—if it feels round, it's time to sharpen.",
      },
    ],
  },
  {
    id: "watering-101",
    title: "Watering 101",
    description:
      "Learn when, how long, and how deeply to water for optimal results.",
    category: "basics",
    estimatedMinutes: 6,
    steps: [
      {
        title: "Water Early in the Morning",
        description:
          "The best time to water is between 6–10 AM. Cooler temps and less wind mean more water reaches the roots instead of evaporating.",
        icon: "Sunrise",
        tip: "Avoid watering in the evening—wet grass overnight encourages fungal disease.",
      },
      {
        title: "How Long to Run Sprinklers",
        description:
          "Most lawns need about 1 inch of water per week. Run your sprinklers for 20–30 minutes per zone, 2–3 times a week, depending on your system's output.",
        icon: "Timer",
        tip: "Place a tuna can on the lawn to measure output—when it's full, you've hit 1 inch.",
      },
      {
        title: "Deep vs. Shallow Watering",
        description:
          "Infrequent, deep watering encourages roots to grow deeper and makes your lawn drought-resistant. Frequent, shallow watering creates a weak root system.",
        icon: "ArrowDownToLine",
        tip: "Push a screwdriver into the soil after watering—it should slide in 6 inches easily.",
      },
      {
        title: "Use a Rain Gauge",
        description:
          "Track natural rainfall so you don't over-water. A simple rain gauge in your yard helps you subtract rain from your weekly watering target.",
        icon: "CloudRain",
        tip: "Many smart sprinkler controllers auto-adjust based on local weather data.",
      },
    ],
  },
  {
    id: "first-soil-test",
    title: "Your First Soil Test",
    description:
      "Understand your soil's pH and nutrients to unlock your lawn's potential.",
    category: "basics",
    estimatedMinutes: 10,
    steps: [
      {
        title: "Choose a Testing Kit",
        description:
          "You can use an at-home kit from a garden center or send samples to your local extension office for a detailed lab report. Lab tests are more accurate and cost around $15–25.",
        icon: "FlaskConical",
        tip: "Extension office tests often include free recommendations for your specific region.",
      },
      {
        title: "Collect Soil Samples",
        description:
          "Take 6–8 samples from different spots in your lawn at a depth of 4–6 inches. Mix them together in a clean bucket to get an average reading.",
        icon: "Shovel",
        tip: "Avoid sampling right after fertilizing—wait at least 6 weeks for accurate results.",
      },
      {
        title: "Read Your Results",
        description:
          "Key numbers to look for: pH (ideal is 6.0–7.0 for most grasses), nitrogen (N), phosphorus (P), potassium (K), and organic matter percentage.",
        icon: "FileSearch",
        tip: "A pH below 6.0 means your soil is acidic—lime can help raise it.",
      },
      {
        title: "Apply Amendments",
        description:
          "Based on results, add lime to raise pH, sulfur to lower it, or specific fertilizers to address nutrient deficiencies. Follow recommended application rates carefully.",
        icon: "Beaker",
        tip: "Apply lime in fall so it has time to work through the soil over winter.",
      },
      {
        title: "Retest Annually",
        description:
          "Soil conditions change over time. Retest each year (or every 2 years at minimum) to track improvement and adjust your plan.",
        icon: "RefreshCw",
        tip: "Test at the same time each year for the most consistent comparison.",
      },
    ],
  },
  {
    id: "fall-recovery",
    title: "Fall Lawn Recovery",
    description:
      "Revive your lawn after summer stress with this fall recovery plan.",
    category: "seasonal",
    estimatedMinutes: 8,
    steps: [
      {
        title: "Aerate Your Lawn",
        description:
          "Core aeration relieves compaction and lets water, air, and nutrients reach the root zone. Rent an aerator or hire a service in early fall when the soil is moist.",
        icon: "Wind",
        tip: "Leave the soil plugs on the lawn—they'll break down and feed the soil.",
      },
      {
        title: "Overseed Thin Areas",
        description:
          "After aerating, spread grass seed over thin or bare spots. The holes from aeration provide perfect seed-to-soil contact for germination.",
        icon: "Sprout",
        tip: "Use a seed blend matched to your existing grass type for a seamless look.",
      },
      {
        title: "Apply Fall Fertilizer",
        description:
          "A slow-release fertilizer high in potassium (K) strengthens roots before winter. Apply according to your soil test recommendations.",
        icon: "Leaf",
        tip: "Fall fertilizing is the single most important feeding of the year for cool-season lawns.",
      },
      {
        title: "Set Your Final Mow Height",
        description:
          "Gradually lower your mowing height by ½ inch over the last 2–3 mows of the season. This reduces snow mold risk and helps spring green-up.",
        icon: "ArrowDown",
        tip: "Don't scalp the lawn—the final cut should still be at least 2 inches.",
      },
    ],
  },
  {
    id: "spring-wake-up",
    title: "Spring Wake-Up",
    description:
      "Get your lawn off to a strong start with this spring checklist.",
    category: "seasonal",
    estimatedMinutes: 9,
    steps: [
      {
        title: "Clean Up Debris",
        description:
          "Remove leaves, sticks, and any winter debris. Rake gently to lift matted grass and improve airflow to the soil surface.",
        icon: "Trash2",
        tip: "A light raking also helps break up any thatch buildup from the previous year.",
      },
      {
        title: "First Mow of the Season",
        description:
          "Set your mower slightly lower than your summer height for the first cut. This removes dead tips and lets sunlight reach new growth.",
        icon: "Scissors",
        tip: "Make sure blades are freshly sharpened before the season's first mow.",
      },
      {
        title: "Apply Pre-Emergent Herbicide",
        description:
          "Timing is critical—apply when soil temperatures reach 55 °F for 3–5 consecutive days. This prevents crabgrass and other summer annuals from germinating.",
        icon: "Shield",
        tip: "Do NOT apply pre-emergent if you plan to overseed—it will prevent grass seed from germinating too.",
      },
      {
        title: "First Spring Fertilization",
        description:
          "Apply a balanced, slow-release fertilizer once the lawn is actively growing. Avoid heavy nitrogen in early spring—it pushes top growth at the expense of roots.",
        icon: "Flower2",
        tip: "Wait until you've mowed at least twice before applying spring fertilizer.",
      },
      {
        title: "Inspect for Problems",
        description:
          "Walk your lawn and look for bare spots, pest damage, fungal patches, or drainage issues. Early detection means easier (and cheaper) fixes.",
        icon: "Search",
        tip: "Take photos now so you can compare your lawn's progress throughout the season.",
      },
    ],
  },
  {
    id: "bare-patches",
    title: "Dealing with Bare Patches",
    description:
      "Fix unsightly bare spots with this step-by-step repair guide.",
    category: "advanced",
    estimatedMinutes: 7,
    steps: [
      {
        title: "Diagnose the Cause",
        description:
          "Common causes include pet urine, heavy foot traffic, grubs, fungal disease, or poor drainage. Identify the root cause before repairing so the problem doesn't return.",
        icon: "SearchCheck",
        tip: "Pull up a section of dead turf—if it lifts like a carpet, you likely have grubs.",
      },
      {
        title: "Prep the Soil",
        description:
          "Rake away dead grass and debris. Loosen the top 2–3 inches of soil with a garden fork or rake. Add a thin layer of compost to improve nutrient content.",
        icon: "Shovel",
        tip: "If the area is compacted, poke holes with a garden fork before adding compost.",
      },
      {
        title: "Seed or Sod",
        description:
          "For small patches, spread grass seed and lightly rake it in. For instant results, cut a piece of sod to fit. Press firmly so roots contact the soil.",
        icon: "Sprout",
        tip: "Cover seed with a thin layer of straw mulch to retain moisture during germination.",
      },
      {
        title: "Water and Maintain",
        description:
          "Keep the repaired area consistently moist (not soggy) for 2–3 weeks. Mist lightly 2–3 times daily until grass is established, then transition to normal watering.",
        icon: "Droplets",
        tip: "Place a light barrier (small flags or string) to keep foot traffic off new growth.",
      },
    ],
  },
  {
    id: "organic-lawn-care",
    title: "Organic Lawn Care",
    description:
      "Build a thriving lawn without synthetic chemicals using natural methods.",
    category: "advanced",
    estimatedMinutes: 9,
    steps: [
      {
        title: "Build Soil Health First",
        description:
          "Healthy soil = healthy lawn. Top-dress with compost annually, aerate regularly, and encourage earthworm activity. Test your soil to understand its organic matter content.",
        icon: "Mountain",
        tip: "Aim for at least 5% organic matter in your soil—most lawns start below 2%.",
      },
      {
        title: "Use Natural Fertilizers",
        description:
          "Replace synthetic fertilizers with compost, corn gluten meal, bone meal, or fish emulsion. These feed soil microbes as well as your grass.",
        icon: "Leaf",
        tip: "Corn gluten meal doubles as a pre-emergent herbicide when applied in early spring.",
      },
      {
        title: "Integrated Pest Management (IPM)",
        description:
          "Tolerate minor pest damage, encourage beneficial insects, and treat only when thresholds are exceeded. Use neem oil, beneficial nematodes, or diatomaceous earth.",
        icon: "Bug",
        tip: "A few clover patches actually benefit your lawn—clover fixes nitrogen naturally.",
      },
      {
        title: "Companion Planting",
        description:
          "Mix in micro-clover, native wildflowers, or low-growing herbs at the lawn edge. These add biodiversity, attract pollinators, and reduce the area needing intensive care.",
        icon: "TreePine",
        tip: "Micro-clover stays green in drought and needs almost no fertilizer.",
      },
    ],
  },
  {
    id: "winter-prep",
    title: "Winter Lawn Prep",
    description:
      "Protect your lawn and equipment before the cold months arrive.",
    category: "seasonal",
    estimatedMinutes: 5,
    steps: [
      {
        title: "Apply Final Fertilizer",
        description:
          "A winterizer fertilizer high in potassium helps grass store energy and resist cold damage. Apply 2–4 weeks before the first expected frost.",
        icon: "Snowflake",
        tip: "Don't apply after the ground freezes—the fertilizer won't reach the roots.",
      },
      {
        title: "Store Equipment Properly",
        description:
          "Drain or stabilize fuel in your mower, clean the deck, and sharpen blades for spring. Store in a dry area and disconnect spark plugs for safety.",
        icon: "Warehouse",
        tip: "Run the engine with stabilized fuel for a few minutes so it circulates through the system.",
      },
      {
        title: "Plan for Next Year",
        description:
          "Review this season's journal entries, soil test results, and photos. Set goals for next year: overseeding areas, new amendments, or equipment upgrades.",
        icon: "NotebookPen",
        tip: "Order seed and supplies in winter—prices are often lower and selection is better.",
      },
    ],
  },
];
