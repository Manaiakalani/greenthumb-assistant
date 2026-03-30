import type { JournalEntry } from "@/types/journal";
import { ACTIVITY_META } from "@/types/journal";
import type { GlossaryTerm } from "@/data/glossaryTerms";
import type { Tutorial } from "@/data/tutorials";

export interface SearchResult {
  id: string;
  type: "page" | "tool" | "glossary" | "tutorial" | "journal" | "action";
  title: string;
  description: string;
  path: string;
  icon?: string;
  keywords: string[];
}

// ── Static page entries ─────────────────────────────────────────────────────

const PAGE_ENTRIES: SearchResult[] = [
  { id: "page-home", type: "page", title: "Home", description: "Dashboard overview and lawn health score", path: "/", icon: "Home", keywords: ["dashboard", "overview", "lawn", "home"] },
  { id: "page-tools", type: "page", title: "Tools", description: "Lawn care calculators and utilities", path: "/tools", icon: "Wrench", keywords: ["tools", "calculators", "utilities"] },
  { id: "page-journal", type: "page", title: "Journal", description: "Log lawn care activities and notes", path: "/journal", icon: "BookOpen", keywords: ["journal", "log", "entries", "notes", "activities"] },
  { id: "page-photos", type: "page", title: "Photos", description: "Photo timeline of your lawn progress", path: "/photos", icon: "Camera", keywords: ["photos", "pictures", "timeline", "progress"] },
  { id: "page-plan", type: "page", title: "Soil Plan", description: "Personalized soil improvement plan", path: "/plan", icon: "ClipboardList", keywords: ["soil", "plan", "improvement", "amendment"] },
  { id: "page-achievements", type: "page", title: "Achievements", description: "Earned badges and milestones", path: "/achievements", icon: "Trophy", keywords: ["achievements", "badges", "milestones", "rewards"] },
  { id: "page-gallery", type: "page", title: "Gallery", description: "Photo gallery and comparisons", path: "/gallery", icon: "Images", keywords: ["gallery", "photos", "compare"] },
  { id: "page-calendar", type: "page", title: "Calendar", description: "Seasonal lawn care calendar", path: "/calendar", icon: "CalendarDays", keywords: ["calendar", "schedule", "seasonal", "dates"] },
  { id: "page-glossary", type: "page", title: "Glossary", description: "Lawn care terms and definitions", path: "/glossary", icon: "BookA", keywords: ["glossary", "terms", "definitions", "dictionary"] },
  { id: "page-tutorials", type: "page", title: "Tutorials", description: "Step-by-step lawn care guides", path: "/tutorials", icon: "GraduationCap", keywords: ["tutorials", "guides", "how-to", "learn"] },
  { id: "page-pest-id", type: "page", title: "Pest Identifier", description: "Identify lawn pests and diseases", path: "/pest-identifier", icon: "Bug", keywords: ["pest", "identifier", "disease", "insect", "bug"] },
  { id: "page-grass-quiz", type: "page", title: "Grass Quiz", description: "Find the best grass type for your lawn", path: "/grass-quiz", icon: "HelpCircle", keywords: ["quiz", "grass", "type", "recommendation"] },
  { id: "page-profile", type: "page", title: "Profile", description: "Edit your lawn profile and settings", path: "/profile", icon: "User", keywords: ["profile", "settings", "zone", "region"] },
  { id: "page-privacy", type: "page", title: "Privacy", description: "Privacy policy and data information", path: "/privacy", icon: "Shield", keywords: ["privacy", "policy", "data"] },
];

// ── Static tool entries ─────────────────────────────────────────────────────

const TOOL_ENTRIES: SearchResult[] = [
  { id: "tool-watering-calc", type: "tool", title: "Watering Calculator", description: "Calculate how much to water your lawn", path: "/tools", icon: "Droplets", keywords: ["watering", "calculator", "irrigation", "sprinkler"] },
  { id: "tool-seed-calc", type: "tool", title: "Seed Calculator", description: "Determine seed quantity for your lawn size", path: "/tools", icon: "Calculator", keywords: ["seed", "calculator", "overseeding", "coverage"] },
  { id: "tool-cost-tracker", type: "tool", title: "Cost Tracker", description: "Track lawn care expenses over time", path: "/tools", icon: "DollarSign", keywords: ["cost", "tracker", "expenses", "budget", "money"] },
  { id: "tool-mowing-guide", type: "tool", title: "Mowing Height Guide", description: "Recommended mowing heights by grass type", path: "/tools", icon: "Scissors", keywords: ["mowing", "height", "guide", "cut"] },
  { id: "tool-soil-temp", type: "tool", title: "Soil Temperature Chart", description: "Track soil temperature trends", path: "/tools", icon: "Thermometer", keywords: ["soil", "temperature", "chart", "temp"] },
  { id: "tool-soil-test", type: "tool", title: "Soil Test Card", description: "Record and track soil test results", path: "/tools", icon: "FlaskConical", keywords: ["soil", "test", "pH", "nutrients"] },
  { id: "tool-lawn-size", type: "tool", title: "Lawn Size Estimator", description: "Estimate your lawn's total area", path: "/tools", icon: "Maximize", keywords: ["lawn", "size", "area", "square", "feet", "estimator"] },
  { id: "tool-fertilizer", type: "tool", title: "Fertilizer Decoder", description: "Understand N-P-K ratios and fertilizer labels", path: "/tools", icon: "Leaf", keywords: ["fertilizer", "decoder", "NPK", "nutrients"] },
  { id: "tool-soil-amendment", type: "tool", title: "Soil Amendment Calculator", description: "Calculate amendment quantities needed", path: "/tools", icon: "Beaker", keywords: ["soil", "amendment", "calculator", "lime", "compost"] },
  { id: "tool-grass-compare", type: "tool", title: "Grass Comparison", description: "Compare grass types side by side", path: "/tools", icon: "GitCompare", keywords: ["grass", "compare", "comparison", "types"] },
  { id: "tool-sprinkler", type: "tool", title: "Sprinkler Zone Planner", description: "Plan sprinkler zones for your yard", path: "/tools", icon: "Droplets", keywords: ["sprinkler", "zone", "planner", "irrigation"] },
  { id: "tool-checklist", type: "tool", title: "Monthly Checklist", description: "Monthly lawn care task checklist", path: "/tools", icon: "CheckSquare", keywords: ["monthly", "checklist", "tasks", "todo"] },
  { id: "tool-timer", type: "tool", title: "Lawn Care Timer", description: "Timer for lawn care activities", path: "/tools", icon: "Timer", keywords: ["timer", "stopwatch", "duration"] },
  { id: "tool-streaks", type: "tool", title: "Activity Streaks", description: "Track your lawn care consistency", path: "/tools", icon: "Flame", keywords: ["streaks", "activity", "consistency", "streak"] },
  { id: "tool-progress", type: "tool", title: "Progress Report", description: "Generate a lawn care progress report", path: "/tools", icon: "BarChart", keywords: ["progress", "report", "stats", "summary"] },
  { id: "tool-report-card", type: "tool", title: "Lawn Report Card", description: "Overall lawn health grade", path: "/tools", icon: "FileText", keywords: ["report", "card", "grade", "health"] },
];

// ── Action entries ──────────────────────────────────────────────────────────

const ACTION_ENTRIES: SearchResult[] = [
  { id: "action-dark-mode", type: "action", title: "Toggle Dark Mode", description: "Switch between light and dark theme", path: "#toggle-theme", icon: "Moon", keywords: ["dark", "mode", "theme", "light", "toggle"] },
  { id: "action-print", type: "action", title: "Print Report", description: "Print your lawn care report", path: "#print", icon: "Printer", keywords: ["print", "report", "pdf"] },
  { id: "action-export", type: "action", title: "Export Data", description: "Export your lawn data as a backup", path: "#export", icon: "Download", keywords: ["export", "data", "backup", "download"] },
];

// ── Build index ─────────────────────────────────────────────────────────────

export function buildSearchIndex(
  journal: JournalEntry[],
  glossaryTerms: GlossaryTerm[],
  tutorials: Tutorial[],
): SearchResult[] {
  const index: SearchResult[] = [...PAGE_ENTRIES, ...TOOL_ENTRIES, ...ACTION_ENTRIES];

  // Glossary terms
  for (const term of glossaryTerms) {
    index.push({
      id: `glossary-${term.term.toLowerCase().replace(/\s+/g, "-")}`,
      type: "glossary",
      title: term.term,
      description: term.definition,
      path: "/glossary",
      icon: "BookA",
      keywords: [term.category, ...(term.related ?? []).map((r) => r.toLowerCase())],
    });
  }

  // Tutorials
  for (const tut of tutorials) {
    index.push({
      id: `tutorial-${tut.id}`,
      type: "tutorial",
      title: tut.title,
      description: tut.description,
      path: "/tutorials",
      icon: "GraduationCap",
      keywords: [tut.category, ...tut.steps.map((s) => s.title.toLowerCase())],
    });
  }

  // Journal entries (most recent 20)
  const recent = journal.slice(0, 20);
  for (const entry of recent) {
    const meta = ACTIVITY_META[entry.activity];
    index.push({
      id: `journal-${entry.id}`,
      type: "journal",
      title: `${meta.emoji} ${meta.label} — ${entry.date}`,
      description: entry.notes || `${meta.label} on ${entry.date}`,
      path: "/journal",
      icon: "BookOpen",
      keywords: [entry.activity, meta.label.toLowerCase(), entry.date],
    });
  }

  return index;
}

// ── Fuzzy search with scoring ───────────────────────────────────────────────

function scoreResult(query: string, result: SearchResult): number {
  const q = query.toLowerCase();
  const title = result.title.toLowerCase();
  const desc = result.description.toLowerCase();

  let score = 0;

  // Title scoring
  if (title === q) score += 10;
  else if (title.startsWith(q)) score += 5;
  else if (title.includes(q)) score += 3;

  // Description scoring
  if (desc.includes(q)) score += 1;

  // Keyword scoring
  for (const kw of result.keywords) {
    if (kw.toLowerCase().includes(q) || q.includes(kw.toLowerCase())) {
      score += 2;
    }
  }

  // Multi-word query: score each word individually
  const words = q.split(/\s+/).filter(Boolean);
  if (words.length > 1) {
    for (const word of words) {
      if (title.includes(word)) score += 2;
      if (desc.includes(word)) score += 1;
      for (const kw of result.keywords) {
        if (kw.toLowerCase().includes(word)) score += 1;
      }
    }
  }

  return score;
}

export function searchIndex(query: string, index: SearchResult[]): SearchResult[] {
  if (!query.trim()) return [];

  const scored = index
    .map((result) => ({ result, score: scoreResult(query, result) }))
    .filter(({ score }) => score > 0)
    .sort((a, b) => b.score - a.score);

  return scored.slice(0, 10).map(({ result }) => result);
}
