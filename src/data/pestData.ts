// ---------------------------------------------------------------------------
// Pest, Disease & Weed data for the Pest & Disease Identifier
// ---------------------------------------------------------------------------

export interface PestDisease {
  id: string;
  name: string;
  type: "pest" | "disease" | "weed";
  symptoms: string[];
  description: string;
  causes: string[];
  treatments: string[];
  prevention: string[];
  seasonalRisk: ("spring" | "summer" | "fall" | "winter")[];
  affectedGrasses: string[];
  image?: string;
}

export const PEST_DISEASE_DATA: PestDisease[] = [
  // ── Pests ──────────────────────────────────────────────────────────────
  {
    id: "grubs",
    name: "White Grubs",
    type: "pest",
    symptoms: [
      "Irregular brown patches that peel up like carpet",
      "Spongy, loose turf that lifts easily",
      "Increased bird, skunk, or raccoon digging",
    ],
    description:
      "White grubs are the larvae of Japanese beetles, June bugs, and other scarab beetles. They feed on grass roots just below the soil surface, severing the root system and causing turf to die in irregular patches.",
    causes: [
      "Adult beetles laying eggs in moist turf during summer",
      "Frequent irrigation during egg-laying season",
      "Healthy lawns with thick root systems attract egg-laying adults",
    ],
    treatments: [
      "Apply a curative grub control product containing trichlorfon or carbaryl for active infestations",
      "Apply beneficial nematodes (Heterorhabditis bacteriophora) to soil in late summer",
      "Water treated areas thoroughly to move product into the root zone",
      "Reseed or resod damaged areas after grub populations are controlled",
    ],
    prevention: [
      "Apply preventive grub control (chlorantraniliprole) in late spring to early summer",
      "Reduce irrigation in July when beetles are laying eggs",
      "Encourage natural predators like birds and ground beetles",
    ],
    seasonalRisk: ["summer", "fall"],
    affectedGrasses: [
      "Kentucky Bluegrass",
      "Tall Fescue",
      "Perennial Ryegrass",
      "Bermudagrass",
    ],
    image: "🪲",
  },
  {
    id: "chinch-bugs",
    name: "Chinch Bugs",
    type: "pest",
    symptoms: [
      "Irregular yellowish patches that spread outward",
      "Grass turns straw-colored and dies despite watering",
      "Tiny black-and-white insects visible at the soil line",
    ],
    description:
      "Chinch bugs are small insects that pierce grass blades and suck plant juices while injecting a toxin that blocks water movement. Damage often appears first in sunny, dry areas.",
    causes: [
      "Hot, dry weather conditions",
      "Thick thatch layers that harbor insect populations",
      "Drought-stressed lawns are more vulnerable",
    ],
    treatments: [
      "Apply a labeled insecticide (bifenthrin or trichlorfon) to affected areas and a 5-foot buffer zone",
      "Water the lawn before application to bring insects to the surface",
      "For organic control, apply diatomaceous earth or Beauveria bassiana",
      "Dethatch the lawn after treatment to remove habitat",
    ],
    prevention: [
      "Maintain a thatch layer under ½ inch through regular dethatching",
      "Use endophyte-enhanced grass seed varieties for new plantings",
      "Avoid excessive nitrogen fertilization in summer",
      "Water deeply but infrequently to promote deep roots",
    ],
    seasonalRisk: ["summer"],
    affectedGrasses: [
      "St. Augustinegrass",
      "Kentucky Bluegrass",
      "Zoysiagrass",
      "Fine Fescue",
    ],
    image: "🐛",
  },
  {
    id: "sod-webworms",
    name: "Sod Webworms",
    type: "pest",
    symptoms: [
      "Small, irregular brown patches in the lawn",
      "Grass blades chewed off at the soil level",
      "Small tan moths flying in a zigzag pattern at dusk",
      "Green frass (excrement pellets) visible in thatch",
    ],
    description:
      "Sod webworms are the larvae of lawn moths. They feed on grass blades at night, cutting them off close to the crown. Heavy infestations can rapidly thin large areas of turf.",
    causes: [
      "Adult moths laying eggs in turf during warm evenings",
      "Thick thatch providing shelter for larvae",
      "Drought stress weakening turf's ability to recover",
    ],
    treatments: [
      "Apply Bacillus thuringiensis (Bt) for organic caterpillar control",
      "Use a labeled insecticide (bifenthrin, carbaryl) in the evening when larvae are active",
      "Water lightly before application to bring larvae to the surface",
      "Overseed damaged areas after treatment",
    ],
    prevention: [
      "Mow at the proper height to reduce moth egg-laying habitat",
      "Keep thatch under ½ inch with regular dethatching",
      "Encourage natural predators such as parasitic wasps and birds",
    ],
    seasonalRisk: ["summer", "fall"],
    affectedGrasses: [
      "Kentucky Bluegrass",
      "Tall Fescue",
      "Bermudagrass",
      "Zoysiagrass",
    ],
    image: "🦋",
  },
  {
    id: "armyworms",
    name: "Armyworms",
    type: "pest",
    symptoms: [
      "Rapidly expanding brown or bare patches",
      "Grass blades eaten down to the soil",
      "Large caterpillars (1–2 inches) visible on turf, especially early morning or evening",
    ],
    description:
      "Armyworms are voracious caterpillars that march across lawns in large numbers, consuming grass blades down to the crown. They can devastate an entire lawn in just a few days during peak outbreaks.",
    causes: [
      "Moth migration from southern regions in late summer",
      "Warm, humid weather accelerating population growth",
      "Lush, heavily fertilized turf attracting egg-laying moths",
    ],
    treatments: [
      "Apply Bacillus thuringiensis (Bt) at the first sign of damage",
      "Use a fast-acting insecticide (bifenthrin, cyfluthrin) for severe infestations",
      "Treat in the late afternoon or evening when larvae are actively feeding",
      "Water and fertilize after treatment to encourage regrowth",
    ],
    prevention: [
      "Monitor for moths and early damage starting in late summer",
      "Avoid excessive nitrogen fertilization that produces lush growth",
      "Maintain healthy turf so it can recover quickly from minor damage",
    ],
    seasonalRisk: ["summer", "fall"],
    affectedGrasses: [
      "Bermudagrass",
      "Tall Fescue",
      "Kentucky Bluegrass",
      "Ryegrass",
    ],
    image: "🐛",
  },
  {
    id: "mole-crickets",
    name: "Mole Crickets",
    type: "pest",
    symptoms: [
      "Raised tunnels or ridges visible on the lawn surface",
      "Spongy turf that feels soft underfoot",
      "Brown, dying grass in irregular patches",
      "Small mounds of soil pushed up overnight",
    ],
    description:
      "Mole crickets are burrowing insects that tunnel through the top few inches of soil, severing grass roots and drying out the turf above. They are most damaging in warm-season lawns in the Southeast.",
    causes: [
      "Sandy, well-drained soils are preferred habitat",
      "Warm-season turf in southeastern states is most vulnerable",
      "Adult flights and egg-laying in spring and early summer",
    ],
    treatments: [
      "Apply a granular insecticide (bifenthrin, imidacloprid) in June when nymphs are small",
      "Use mole cricket bait (containing indoxacarb) in the evening",
      "Apply beneficial nematodes (Steinernema scapterisci) as a biological control",
      "Water treated areas immediately to move product into soil",
    ],
    prevention: [
      "Apply preventive insecticide in late spring before damage appears",
      "Monitor with a soap flush test (2 tbsp dish soap per gallon of water) in spring",
      "Maintain healthy, dense turf to tolerate minor damage",
    ],
    seasonalRisk: ["spring", "summer"],
    affectedGrasses: [
      "Bermudagrass",
      "Bahiagrass",
      "St. Augustinegrass",
      "Centipedegrass",
    ],
    image: "🦗",
  },

  // ── Diseases ───────────────────────────────────────────────────────────
  {
    id: "dollar-spot",
    name: "Dollar Spot",
    type: "disease",
    symptoms: [
      "Small, silver-dollar-sized straw-colored spots",
      "Bleached lesions with reddish-brown borders on individual blades",
      "White, cobwebby mycelium visible in early morning dew",
    ],
    description:
      "Dollar spot is a common fungal disease caused by Clarireedia jacksonii. It thrives in lawns with low nitrogen fertility and appears as small, circular bleached patches, especially during warm days and cool nights.",
    causes: [
      "Low nitrogen fertility",
      "Extended periods of leaf wetness from dew or irrigation",
      "Warm days (60–85°F) with cool, humid nights",
      "Drought-stressed turf",
    ],
    treatments: [
      "Apply a balanced nitrogen fertilizer to help the lawn outgrow the disease",
      "Use a fungicide (propiconazole, myclobutanil) for severe outbreaks",
      "Remove morning dew by dragging a hose across the lawn",
      "Avoid watering in the evening",
    ],
    prevention: [
      "Maintain adequate nitrogen levels throughout the growing season",
      "Water deeply and infrequently, early in the morning",
      "Improve air circulation by pruning surrounding shrubs",
      "Avoid mowing wet grass to prevent spreading spores",
    ],
    seasonalRisk: ["spring", "summer", "fall"],
    affectedGrasses: [
      "Kentucky Bluegrass",
      "Fine Fescue",
      "Bermudagrass",
      "Zoysiagrass",
      "Perennial Ryegrass",
    ],
    image: "🟤",
  },
  {
    id: "brown-patch",
    name: "Brown Patch",
    type: "disease",
    symptoms: [
      "Large circular brown patches 1–3 feet in diameter",
      "A dark, smoke-colored ring at the edge of patches (smoke ring)",
      "Grass blades are brown and water-soaked at the base",
      "Patches may have green grass in the center (frog-eye pattern)",
    ],
    description:
      "Brown patch is caused by the fungus Rhizoctonia solani. It is one of the most widespread lawn diseases, appearing as large, roughly circular brown areas during warm, humid weather.",
    causes: [
      "Hot, humid conditions (above 80°F daytime, 60°F+ nights)",
      "Excessive nitrogen fertilization in summer",
      "Prolonged leaf wetness from evening irrigation",
      "Poor air circulation",
    ],
    treatments: [
      "Apply a systemic fungicide (azoxystrobin, propiconazole) when symptoms first appear",
      "Reduce nitrogen applications until the disease subsides",
      "Water only in early morning and avoid wetting foliage in the evening",
      "Mow at a higher setting to reduce stress on affected turf",
    ],
    prevention: [
      "Avoid heavy nitrogen fertilization during hot, humid weather",
      "Water early in the morning so grass dries quickly",
      "Improve drainage and air flow in problem areas",
      "Choose resistant cultivars when overseeding",
    ],
    seasonalRisk: ["summer"],
    affectedGrasses: [
      "Tall Fescue",
      "Perennial Ryegrass",
      "Kentucky Bluegrass",
      "St. Augustinegrass",
    ],
    image: "🍂",
  },
  {
    id: "pythium-blight",
    name: "Pythium Blight",
    type: "disease",
    symptoms: [
      "Greasy, dark, water-soaked patches that appear overnight",
      "White, cottony mycelium visible in early morning",
      "Grass blades feel slimy and mat together",
      "Patches follow drainage patterns or mowing direction",
    ],
    description:
      "Pythium blight is a fast-spreading water mold disease that can destroy large areas of turf in 24–48 hours under hot, humid conditions. It often appears in low-lying, poorly drained areas.",
    causes: [
      "Hot days (above 85°F) combined with warm, humid nights",
      "Poor drainage and compacted soil",
      "Excessive nitrogen fertilization",
      "Overwatering or prolonged leaf wetness",
    ],
    treatments: [
      "Apply a Pythium-specific fungicide (mefenoxam, fosetyl-Al) immediately",
      "Improve drainage in affected areas",
      "Avoid mowing or walking through infected areas to prevent spreading",
      "Reduce watering and allow soil to dry between irrigations",
    ],
    prevention: [
      "Ensure good drainage and aerate compacted soils",
      "Water early in the morning only",
      "Avoid excessive nitrogen during hot, humid periods",
      "Improve air circulation by thinning surrounding vegetation",
    ],
    seasonalRisk: ["summer"],
    affectedGrasses: [
      "Perennial Ryegrass",
      "Tall Fescue",
      "Kentucky Bluegrass",
      "Bermudagrass",
    ],
    image: "💧",
  },
  {
    id: "snow-mold",
    name: "Snow Mold",
    type: "disease",
    symptoms: [
      "Circular matted-down patches revealed after snow melts",
      "Gray (Typhula) or pink (Microdochium) fuzzy mycelium on grass",
      "Grass blades are matted, bleached, and stuck together",
    ],
    description:
      "Snow mold develops under prolonged snow cover on unfrozen ground. Gray snow mold (Typhula) and pink snow mold (Microdochium) leave circular patches of matted, discolored grass when snow melts in spring.",
    causes: [
      "Extended snow cover on unfrozen or partially frozen ground",
      "Heavy leaf cover or debris left on the lawn before winter",
      "Late-season nitrogen fertilization promoting lush growth",
    ],
    treatments: [
      "Gently rake matted areas to promote air circulation and drying",
      "Apply a light nitrogen fertilizer in early spring to encourage recovery",
      "Overseed heavily damaged areas once soil temperatures rise",
      "Fungicides are rarely needed — most lawns recover naturally",
    ],
    prevention: [
      "Mow the lawn at a slightly lower height for the last cut of the season",
      "Remove fallen leaves and debris before snowfall",
      "Avoid heavy nitrogen fertilization in late fall",
      "Spread out snow piles to speed melting in spring",
    ],
    seasonalRisk: ["winter", "spring"],
    affectedGrasses: [
      "Kentucky Bluegrass",
      "Fine Fescue",
      "Perennial Ryegrass",
      "Tall Fescue",
    ],
    image: "❄️",
  },
  {
    id: "fairy-ring",
    name: "Fairy Ring",
    type: "disease",
    symptoms: [
      "Dark-green circles or arcs of fast-growing grass",
      "Rings of mushrooms or puffballs appearing in the lawn",
      "Dead or brown grass within or at the edge of the ring",
    ],
    description:
      "Fairy rings are caused by soil-borne fungi that break down organic matter in the soil. They appear as dark circles of lush grass, often accompanied by mushrooms, and can persist for years.",
    causes: [
      "Decomposing organic matter (old tree roots, buried wood) in the soil",
      "Fungi forming a dense mycelial mat that repels water",
      "Established fairy rings expand outward each year",
    ],
    treatments: [
      "Aerate the ring and surrounding area to break up the fungal mat",
      "Apply a wetting agent to help water penetrate the hydrophobic soil",
      "Mask symptoms by fertilizing the rest of the lawn to match the ring's color",
      "For severe cases, remove 12 inches of soil and replace with fresh topsoil",
    ],
    prevention: [
      "Remove buried wood, old stumps, and construction debris before establishing turf",
      "Core aerate annually to reduce thatch and organic matter buildup",
      "Maintain consistent fertility and irrigation across the lawn",
    ],
    seasonalRisk: ["spring", "summer", "fall"],
    affectedGrasses: [
      "Kentucky Bluegrass",
      "Tall Fescue",
      "Bermudagrass",
      "Zoysiagrass",
      "Fine Fescue",
    ],
    image: "🍄",
  },
  {
    id: "red-thread",
    name: "Red Thread",
    type: "disease",
    symptoms: [
      "Irregular pink or reddish patches scattered across the lawn",
      "Red or pink thread-like strands extending from grass blade tips",
      "Grass blades turn tan but crowns usually survive",
    ],
    description:
      "Red thread is caused by the fungus Laetisaria fuciformis. It produces distinctive pink-red threadlike structures on grass blade tips. It rarely kills the grass but causes unsightly discoloration.",
    causes: [
      "Low nitrogen fertility",
      "Cool, humid weather (60–75°F) with prolonged leaf wetness",
      "Slow-growing turf under stress",
    ],
    treatments: [
      "Apply a nitrogen-rich fertilizer to promote growth and recovery",
      "Fungicide applications are rarely needed — fertility correction usually resolves it",
      "Mow regularly to remove affected blade tips",
      "Bag clippings during active infection to reduce spread",
    ],
    prevention: [
      "Maintain a consistent fertilization schedule with adequate nitrogen",
      "Water early in the morning to minimize leaf wetness duration",
      "Improve air circulation around the lawn",
    ],
    seasonalRisk: ["spring", "fall"],
    affectedGrasses: [
      "Perennial Ryegrass",
      "Fine Fescue",
      "Kentucky Bluegrass",
      "Tall Fescue",
    ],
    image: "🔴",
  },

  // ── Weeds ──────────────────────────────────────────────────────────────
  {
    id: "crabgrass",
    name: "Crabgrass",
    type: "weed",
    symptoms: [
      "Low-growing, sprawling clumps of light-green grass",
      "Stems that spread outward from a central point like crab legs",
      "Appears in thin, bare, or newly seeded areas",
    ],
    description:
      "Crabgrass is an annual warm-season weed that germinates when soil temperatures reach 55°F. It thrives in thin, stressed turf and dies with the first frost, leaving bare spots.",
    causes: [
      "Thin or bare spots in the lawn exposing soil to sunlight",
      "Mowing too short, which weakens desirable grass",
      "Compacted soil or poor drainage",
      "Soil temperatures above 55°F triggering germination",
    ],
    treatments: [
      "Apply a post-emergent crabgrass killer (quinclorac) to young plants",
      "Hand-pull small infestations before they set seed",
      "For mature plants, use a non-selective herbicide as a spot treatment",
      "Overseed bare areas in fall to crowd out future crabgrass",
    ],
    prevention: [
      "Apply a pre-emergent herbicide in early spring before soil reaches 55°F",
      "Maintain a dense, healthy lawn by mowing at 3–4 inches",
      "Overseed thin areas in fall to reduce bare soil",
      "Avoid disturbing soil in spring which can bring buried seeds to the surface",
    ],
    seasonalRisk: ["spring", "summer"],
    affectedGrasses: [
      "Kentucky Bluegrass",
      "Tall Fescue",
      "Perennial Ryegrass",
      "Fine Fescue",
    ],
    image: "🌿",
  },
  {
    id: "dandelion",
    name: "Dandelion",
    type: "weed",
    symptoms: [
      "Bright yellow flowers on hollow stems",
      "Rosette of jagged, deeply toothed leaves flat against the ground",
      "White, puffy seed heads that scatter in the wind",
    ],
    description:
      "Dandelions are perennial broadleaf weeds with deep taproots. They spread aggressively by wind-borne seeds and can colonize thin or stressed turf quickly.",
    causes: [
      "Thin turf allowing sunlight to reach soil",
      "Compacted soil creating favorable conditions",
      "Wind-borne seeds from neighboring areas",
      "Mowing too low, reducing grass competition",
    ],
    treatments: [
      "Apply a broadleaf herbicide (2,4-D, triclopyr, or dicamba) in fall for best results",
      "Dig out individual plants with a dandelion weeder, removing the entire taproot",
      "Spot-treat with a ready-to-use broadleaf weed spray",
      "Repeat applications may be needed for established infestations",
    ],
    prevention: [
      "Maintain thick, healthy turf that crowds out weed seedlings",
      "Mow at the proper height (3–4 inches) to shade the soil",
      "Fertilize regularly to keep the lawn dense and competitive",
      "Overseed thin areas in fall",
    ],
    seasonalRisk: ["spring", "fall"],
    affectedGrasses: [
      "Kentucky Bluegrass",
      "Tall Fescue",
      "Bermudagrass",
      "Perennial Ryegrass",
      "Fine Fescue",
    ],
    image: "🌼",
  },
  {
    id: "clover",
    name: "Clover",
    type: "weed",
    symptoms: [
      "Three-part (trifoliate) round leaves in spreading patches",
      "Small white or pink flower heads",
      "Creeping stems that root at the nodes",
    ],
    description:
      "White clover is a perennial broadleaf weed that fixes nitrogen from the air. It often appears in lawns with low fertility and thrives in cool, moist conditions.",
    causes: [
      "Low nitrogen fertility in the soil",
      "Compacted soil with poor drainage",
      "Mowing too short, reducing grass competitiveness",
      "Cool, moist growing conditions",
    ],
    treatments: [
      "Apply a broadleaf herbicide containing triclopyr or fluroxypyr",
      "Spot-treat small patches with a ready-to-use weed killer",
      "Hand-pull small infestations, removing stolons and roots",
      "Increase nitrogen fertilization — clover thrives in low-N soil",
    ],
    prevention: [
      "Maintain adequate nitrogen fertility throughout the season",
      "Mow at the recommended height for your grass type",
      "Overseed thin areas to increase grass density",
      "Core aerate to reduce compaction",
    ],
    seasonalRisk: ["spring", "summer", "fall"],
    affectedGrasses: [
      "Kentucky Bluegrass",
      "Tall Fescue",
      "Fine Fescue",
      "Perennial Ryegrass",
    ],
    image: "☘️",
  },
];
