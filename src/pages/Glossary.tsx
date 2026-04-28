import { useCallback, useMemo, useRef, useState } from "react";
import BookOpen from "lucide-react/dist/esm/icons/book-open";
import Search from "lucide-react/dist/esm/icons/search";
import { AppHeader } from "@/components/AppHeader";
import { BottomNav } from "@/components/BottomNav";
import { PageTransition } from "@/components/PageTransition";
import { Input } from "@/components/ui/input";
import {
  glossaryTerms,
  GLOSSARY_CATEGORIES,
  type GlossaryCategory,
} from "@/data/glossaryTerms";

const CATEGORY_COLORS: Record<GlossaryCategory, string> = {
  basics: "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300",
  soil: "bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-300",
  grass: "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300",
  pests: "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300",
  equipment:
    "bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300",
  techniques:
    "bg-teal-100 text-teal-800 dark:bg-teal-900/30 dark:text-teal-300",
};

const sortedTerms = [...glossaryTerms].sort((a, b) =>
  a.term.localeCompare(b.term),
);

const Glossary = () => {
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState<string>("all");
  const termRefs = useRef<Map<string, HTMLElement>>(new Map());

  const filtered = useMemo(() => {
    const q = search.toLowerCase().trim();
    return sortedTerms.filter((t) => {
      const matchesCategory =
        activeCategory === "all" || t.category === activeCategory;
      const matchesSearch =
        !q ||
        t.term.toLowerCase().includes(q) ||
        t.definition.toLowerCase().includes(q);
      return matchesCategory && matchesSearch;
    });
  }, [search, activeCategory]);

  const grouped = useMemo(() => {
    const map = new Map<string, typeof filtered>();
    for (const term of filtered) {
      const letter = term.term[0].toUpperCase();
      const arr = map.get(letter) ?? [];
      arr.push(term);
      map.set(letter, arr);
    }
    return Array.from(map.entries()).sort(([a], [b]) => a.localeCompare(b));
  }, [filtered]);

  const scrollToTerm = useCallback((termName: string) => {
    const el = termRefs.current.get(termName);
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "center" });
      el.classList.add("ring-2", "ring-primary");
      setTimeout(() => el.classList.remove("ring-2", "ring-primary"), 1500);
    }
  }, []);

  const setTermRef = useCallback(
    (termName: string) => (el: HTMLDivElement | null) => {
      if (el) {
        termRefs.current.set(termName, el);
      } else {
        termRefs.current.delete(termName);
      }
    },
    [],
  );

  return (
    <div className="min-h-screen bg-background pb-28">
      <AppHeader />
      <PageTransition>
        <main id="main-content" className="max-w-2xl mx-auto px-5 sm:px-8">
          {/* Header */}
          <div className="mt-4 mb-6">
            <h1 className="font-display text-2xl font-bold text-foreground flex items-center gap-2 [text-wrap:balance]">
              <BookOpen aria-hidden="true" className="h-6 w-6 text-primary" />
              Lawn Care Glossary
            </h1>
            <p className="text-sm text-muted-foreground mt-1">
              A comprehensive reference for lawn care terms and concepts.
            </p>
          </div>

          {/* Search */}
          <div className="relative mb-4">
            <Search
              aria-hidden="true"
              className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground"
            />
            <Input
              type="search"
              placeholder="Search terms..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="min-h-[44px] pl-9 focus-visible:ring-2 focus-visible:ring-primary"
              aria-label="Search glossary terms"
            />
          </div>

          {/* Category pills */}
          <div className="mb-4 flex flex-wrap gap-2">
            {GLOSSARY_CATEGORIES.map((cat) => (
              <button
                key={cat.value}
                type="button"
                onClick={() => setActiveCategory(cat.value)}
                className={`rounded-full px-3 py-1.5 text-xs font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary ${
                  activeCategory === cat.value
                    ? "bg-primary/10 border border-primary/20 text-primary"
                    : "bg-muted/50 border border-transparent text-muted-foreground hover:bg-muted"
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>

          {/* Result count */}
          <p className="mb-4 text-xs text-muted-foreground">
            {filtered.length} of {glossaryTerms.length} terms
          </p>

          {/* Terms */}
          {grouped.length === 0 ? (
            <div className="rounded-xl border border-primary/15 bg-card p-8 text-center shadow-card">
              <p className="font-display text-lg font-semibold text-foreground">
                No terms found
              </p>
              <p className="mt-1 text-sm text-muted-foreground">
                Try a different search or category filter.
              </p>
            </div>
          ) : (
            grouped.map(([letter, terms]) => (
              <div key={letter} className="mb-6" style={{ contentVisibility: "auto", containIntrinsicSize: "auto 200px" }}>
                <h2 className="sticky top-14 z-10 mb-2 border-b border-border bg-background/90 py-1 font-display text-lg font-bold text-primary backdrop-blur-sm">
                  {letter}
                </h2>
                <div className="space-y-3">
                  {terms.map((t) => (
                    <div
                      key={t.term}
                      ref={setTermRef(t.term)}
                      className="rounded-xl border border-primary/15 bg-card p-4 shadow-card transition-colors"
                    >
                      <div className="flex items-start justify-between gap-2">
                        <h3 className="font-display text-base font-semibold text-foreground">
                          {t.term}
                        </h3>
                        <span
                          className={`shrink-0 rounded-full px-2 py-0.5 text-[10px] font-medium ${CATEGORY_COLORS[t.category]}`}
                        >
                          {t.category}
                        </span>
                      </div>
                      <p className="mt-1 text-sm text-muted-foreground">
                        {t.definition}
                      </p>
                      {t.related && t.related.length > 0 ? (
                        <div className="mt-2 flex flex-wrap gap-1.5">
                          <span className="text-[10px] font-medium text-muted-foreground">
                            Related:
                          </span>
                          {t.related.map((r) => (
                            <button
                              key={r}
                              type="button"
                              onClick={() => {
                                setSearch("");
                                setActiveCategory("all");
                                // Delay to let filter reset render
                                requestAnimationFrame(() =>
                                  scrollToTerm(r),
                                );
                              }}
                              className="rounded-md bg-primary/5 px-1.5 py-0.5 text-[10px] font-medium text-primary transition-colors hover:bg-primary/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                            >
                              {r}
                            </button>
                          ))}
                        </div>
                      ) : null}
                    </div>
                  ))}
                </div>
              </div>
            ))
          )}
        </main>
      </PageTransition>
      <BottomNav />
    </div>
  );
};

export default Glossary;
