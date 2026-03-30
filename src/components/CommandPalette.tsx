import { useState, useEffect, useRef, useCallback, useMemo } from "react";
import { AnimatePresence, motion } from "motion/react";
import { Search, X, Home, Wrench, BookA, GraduationCap, BookOpen, Zap } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useTheme } from "next-themes";
import { useGrassStore } from "@/stores/useGrassStore";
import { glossaryTerms } from "@/data/glossaryTerms";
import { tutorials } from "@/data/tutorials";
import { buildSearchIndex, searchIndex } from "@/lib/searchIndex";
import type { SearchResult } from "@/lib/searchIndex";
import { cn } from "@/lib/utils";

// ── Constants ───────────────────────────────────────────────────────────────

const RECENT_KEY = "grasswise-recent-searches";
const MAX_RECENT = 5;

const TYPE_CONFIG: Record<SearchResult["type"], { label: string; icon: React.ReactNode; color: string }> = {
  page:     { label: "Pages",     icon: <Home aria-hidden className="h-4 w-4" />,            color: "bg-blue-500/15 text-blue-700 dark:text-blue-300" },
  tool:     { label: "Tools",     icon: <Wrench aria-hidden className="h-4 w-4" />,           color: "bg-amber-500/15 text-amber-700 dark:text-amber-300" },
  glossary: { label: "Glossary",  icon: <BookA aria-hidden className="h-4 w-4" />,            color: "bg-emerald-500/15 text-emerald-700 dark:text-emerald-300" },
  tutorial: { label: "Tutorials", icon: <GraduationCap aria-hidden className="h-4 w-4" />,    color: "bg-purple-500/15 text-purple-700 dark:text-purple-300" },
  journal:  { label: "Journal",   icon: <BookOpen aria-hidden className="h-4 w-4" />,         color: "bg-sky-500/15 text-sky-700 dark:text-sky-300" },
  action:   { label: "Actions",   icon: <Zap aria-hidden className="h-4 w-4" />,              color: "bg-rose-500/15 text-rose-700 dark:text-rose-300" },
};

const TYPE_ORDER: SearchResult["type"][] = ["page", "tool", "glossary", "tutorial", "journal", "action"];

const QUICK_LINKS: SearchResult[] = [
  { id: "ql-home",       type: "page", title: "Home",       description: "Dashboard overview",       path: "/",               keywords: [] },
  { id: "ql-tools",      type: "page", title: "Tools",      description: "Calculators & utilities",  path: "/tools",          keywords: [] },
  { id: "ql-journal",    type: "page", title: "Journal",    description: "Log activities",           path: "/journal",        keywords: [] },
  { id: "ql-tutorials",  type: "page", title: "Tutorials",  description: "Step-by-step guides",      path: "/tutorials",      keywords: [] },
  { id: "ql-glossary",   type: "page", title: "Glossary",   description: "Lawn care terms",          path: "/glossary",       keywords: [] },
];

// ── Helpers ─────────────────────────────────────────────────────────────────

function loadRecentSearches(): string[] {
  try {
    const raw = localStorage.getItem(RECENT_KEY);
    return raw ? (JSON.parse(raw) as string[]).slice(0, MAX_RECENT) : [];
  } catch {
    return [];
  }
}

function saveRecentSearch(query: string) {
  try {
    const prev = loadRecentSearches().filter((q) => q !== query);
    const next = [query, ...prev].slice(0, MAX_RECENT);
    localStorage.setItem(RECENT_KEY, JSON.stringify(next));
  } catch {
    /* ignore */
  }
}

function groupByType(results: SearchResult[]): Map<SearchResult["type"], SearchResult[]> {
  const groups = new Map<SearchResult["type"], SearchResult[]>();
  for (const type of TYPE_ORDER) {
    const items = results.filter((r) => r.type === type);
    if (items.length > 0) groups.set(type, items);
  }
  return groups;
}

// ── Component ───────────────────────────────────────────────────────────────

interface CommandPaletteProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function CommandPalette({ open, onOpenChange }: CommandPaletteProps) {
  const [query, setQuery] = useState("");
  const [activeIndex, setActiveIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();
  const { setTheme, resolvedTheme } = useTheme();

  const journal = useGrassStore((s) => s.journal);
  const recentSearches = useMemo(() => loadRecentSearches(), [open]); // eslint-disable-line react-hooks/exhaustive-deps

  // Build index when open changes or data changes
  const index = useMemo(
    () => (open ? buildSearchIndex(journal, glossaryTerms, tutorials) : []),
    [open, journal],
  );

  const results = useMemo(() => searchIndex(query, index), [query, index]);
  const groups = useMemo(() => groupByType(results), [results]);

  // Flat list for keyboard nav
  const flatResults = useMemo(() => {
    if (results.length > 0) return results;
    if (!query) return QUICK_LINKS;
    return [];
  }, [results, query]);

  // Reset state when opening
  useEffect(() => {
    if (open) {
      setQuery("");
      setActiveIndex(0);
      requestAnimationFrame(() => inputRef.current?.focus());
    }
  }, [open]);

  // Keep activeIndex in bounds
  useEffect(() => {
    setActiveIndex(0);
  }, [query]);

  // Scroll active item into view
  useEffect(() => {
    const item = listRef.current?.querySelector("[data-active='true']");
    item?.scrollIntoView({ block: "nearest" });
  }, [activeIndex]);

  // ── Keyboard shortcut (Ctrl+K / Cmd+K) ─────────────────────────────────
  useEffect(() => {
    const handleGlobal = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        onOpenChange(!open);
      }
    };
    window.addEventListener("keydown", handleGlobal);
    return () => window.removeEventListener("keydown", handleGlobal);
  }, [open, onOpenChange]);

  // ── Select a result ────────────────────────────────────────────────────
  const selectResult = useCallback(
    (result: SearchResult) => {
      if (query) saveRecentSearch(query);
      onOpenChange(false);

      // Handle action results
      if (result.path === "#toggle-theme") {
        setTheme(resolvedTheme === "dark" ? "light" : "dark");
        return;
      }
      if (result.path === "#print") {
        window.print();
        return;
      }
      if (result.path === "#export") {
        navigate("/profile");
        return;
      }

      navigate(result.path);
    },
    [query, onOpenChange, navigate, setTheme, resolvedTheme],
  );

  // ── Keyboard nav inside modal ──────────────────────────────────────────
  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === "ArrowDown") {
        e.preventDefault();
        setActiveIndex((i) => Math.min(i + 1, flatResults.length - 1));
      } else if (e.key === "ArrowUp") {
        e.preventDefault();
        setActiveIndex((i) => Math.max(i - 1, 0));
      } else if (e.key === "Enter") {
        e.preventDefault();
        if (flatResults[activeIndex]) selectResult(flatResults[activeIndex]);
      } else if (e.key === "Escape") {
        e.preventDefault();
        onOpenChange(false);
      }
    },
    [flatResults, activeIndex, selectResult, onOpenChange],
  );

  // ── Render helpers ────────────────────────────────────────────────────
  const renderResult = (result: SearchResult, idx: number) => {
    const config = TYPE_CONFIG[result.type];
    const isActive = idx === activeIndex;

    return (
      <button
        key={result.id}
        role="option"
        aria-selected={isActive}
        data-active={isActive}
        onClick={() => selectResult(result)}
        onMouseEnter={() => setActiveIndex(idx)}
        className={cn(
          "flex items-center gap-3 w-full px-3 py-2.5 text-left rounded-lg transition-colors",
          isActive ? "bg-primary/20" : "hover:bg-primary/10",
        )}
      >
        <span className={cn("flex items-center justify-center h-8 w-8 rounded-lg shrink-0", config.color)}>
          {config.icon}
        </span>
        <div className="flex-1 min-w-0">
          <div className="text-sm font-medium text-foreground truncate">{result.title}</div>
          <div className="text-xs text-muted-foreground truncate">{result.description}</div>
        </div>
        <span className={cn("text-[10px] font-semibold uppercase px-1.5 py-0.5 rounded-full shrink-0", config.color)}>
          {result.type}
        </span>
      </button>
    );
  };

  // Map flat results index to grouped display
  let flatIdx = 0;
  const renderGrouped = () => {
    flatIdx = 0;
    const sections: React.ReactNode[] = [];
    for (const [type, items] of groups) {
      const config = TYPE_CONFIG[type];
      sections.push(
        <div key={type} className="mb-1">
          <div className="text-xs uppercase text-muted-foreground font-semibold px-3 py-1.5 tracking-wider">
            {config.label}
          </div>
          {items.map((item) => {
            const el = renderResult(item, flatIdx);
            flatIdx++;
            return el;
          })}
        </div>,
      );
    }
    return sections;
  };

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-[100] flex items-start justify-center pt-[15vh] px-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.15 }}
        >
          {/* Backdrop */}
          <motion.div
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            onClick={() => onOpenChange(false)}
            aria-hidden
          />

          {/* Dialog */}
          <motion.div
            role="dialog"
            aria-modal="true"
            aria-label="Search"
            className="relative w-full max-w-lg bg-card rounded-xl border border-border shadow-2xl overflow-hidden"
            initial={{ scale: 0.95, opacity: 0, y: -10 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.95, opacity: 0, y: -10 }}
            transition={{ duration: 0.15 }}
            onKeyDown={handleKeyDown}
          >
            {/* Search input */}
            <div className="flex items-center gap-3 px-4 py-3 border-b border-border">
              <Search aria-hidden className="h-5 w-5 text-muted-foreground shrink-0" />
              <input
                ref={inputRef}
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Type to search…"
                className="flex-1 bg-transparent text-lg text-foreground placeholder:text-muted-foreground focus:outline-none font-display"
                aria-label="Search"
                autoComplete="off"
                spellCheck={false}
              />
              <kbd className="hidden sm:inline-flex items-center gap-0.5 text-[10px] font-mono text-muted-foreground bg-muted border border-border rounded px-1.5 py-0.5">
                ESC
              </kbd>
              <button
                onClick={() => onOpenChange(false)}
                className="rounded-md p-1 text-muted-foreground hover:text-foreground transition-colors sm:hidden"
                aria-label="Close search"
              >
                <X aria-hidden className="h-4 w-4" />
              </button>
            </div>

            {/* Results area */}
            <div
              ref={listRef}
              role="listbox"
              aria-label="Search results"
              className="max-h-[50vh] overflow-y-auto overscroll-contain p-2"
            >
              {/* Live region for screen readers */}
              <div className="sr-only" aria-live="polite" aria-atomic="true">
                {query && results.length > 0 && `${results.length} result${results.length === 1 ? "" : "s"} found`}
                {query && results.length === 0 && "No results found"}
              </div>

              {/* Results grouped by type */}
              {query && results.length > 0 && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.1 }}
                >
                  {renderGrouped()}
                </motion.div>
              )}

              {/* Empty state */}
              {query && results.length === 0 && (
                <div className="py-8 text-center text-muted-foreground text-sm">
                  No results for &ldquo;{query}&rdquo;
                </div>
              )}

              {/* Empty query → quick links + recent searches */}
              {!query && (
                <div>
                  {recentSearches.length > 0 && (
                    <div className="mb-2">
                      <div className="text-xs uppercase text-muted-foreground font-semibold px-3 py-1.5 tracking-wider">
                        Recent Searches
                      </div>
                      {recentSearches.map((q) => (
                        <button
                          key={q}
                          className="flex items-center gap-3 w-full px-3 py-2 text-left rounded-lg text-sm text-foreground hover:bg-primary/10 transition-colors"
                          onClick={() => setQuery(q)}
                        >
                          <Search aria-hidden className="h-3.5 w-3.5 text-muted-foreground" />
                          {q}
                        </button>
                      ))}
                    </div>
                  )}
                  <div>
                    <div className="text-xs uppercase text-muted-foreground font-semibold px-3 py-1.5 tracking-wider">
                      Quick Links
                    </div>
                    {QUICK_LINKS.map((link, i) => renderResult(link, i))}
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
