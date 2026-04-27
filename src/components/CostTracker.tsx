import React, { useState, useMemo, useCallback } from "react";
import { motion, AnimatePresence } from "motion/react";
import DollarSign from "lucide-react/dist/esm/icons/dollar-sign";
import Trash2 from "lucide-react/dist/esm/icons/trash-2";
import Plus from "lucide-react/dist/esm/icons/plus";
import {
  loadCosts,
  addCost,
  deleteCost,
  getTotalSpend,
  getSpendByCategory,
} from "@/lib/costTracker";
import type { CostEntry } from "@/lib/costTracker";
import { CostChart } from "@/components/charts/CostChart";

// ---------------------------------------------------------------------------
// Constants
// ---------------------------------------------------------------------------

const CATEGORIES: { value: CostEntry["category"]; label: string }[] = [
  { value: "fertilizer", label: "Fertilizer" },
  { value: "seed", label: "Seed" },
  { value: "pesticide", label: "Pesticide" },
  { value: "equipment", label: "Equipment" },
  { value: "service", label: "Service" },
  { value: "other", label: "Other" },
];

const CATEGORY_COLORS: Record<CostEntry["category"], string> = {
  fertilizer: "bg-green-500",
  seed: "bg-amber-500",
  pesticide: "bg-red-400",
  equipment: "bg-blue-500",
  service: "bg-purple-500",
  other: "bg-gray-400",
};

const currency = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
});

function toISODate(d: Date): string {
  return d.toISOString().slice(0, 10);
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export const CostTracker: React.FC = () => {
  const [entries, setEntries] = useState<CostEntry[]>(loadCosts);

  // Form state
  const [date, setDate] = useState(toISODate(new Date()));
  const [category, setCategory] = useState<CostEntry["category"]>("fertilizer");
  const [product, setProduct] = useState("");
  const [amount, setAmount] = useState("");
  const [formError, setFormError] = useState<string | null>(null);

  // Derived stats
  const now = new Date();
  const thisYear = now.getFullYear();
  const thisMonth = now.getMonth();

  const stats = useMemo(() => {
    const yearEntries = entries.filter(
      (e) => new Date(e.date).getFullYear() === thisYear,
    );
    const monthEntries = yearEntries.filter(
      (e) => new Date(e.date).getMonth() === thisMonth,
    );

    const totalYear = getTotalSpend(yearEntries);
    const totalMonth = getTotalSpend(monthEntries);
    const monthsElapsed = thisMonth + 1;
    const avgMonthly = monthsElapsed > 0 ? totalYear / monthsElapsed : 0;
    const byCategory = getSpendByCategory(yearEntries);

    return { totalYear, totalMonth, avgMonthly, byCategory };
  }, [entries, thisYear, thisMonth]);

  // Handlers
  const handleSubmit = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault();
      setFormError(null);

      const trimmed = product.trim();
      const parsed = parseFloat(amount);

      if (!trimmed) {
        setFormError("Product name is required.");
        return;
      }
      if (Number.isNaN(parsed) || parsed <= 0) {
        setFormError("Amount must be greater than $0.");
        return;
      }

      const updated = addCost({
        date,
        category,
        product: trimmed,
        amount: Math.round(parsed * 100) / 100,
      });
      setEntries(updated);
      setProduct("");
      setAmount("");
    },
    [date, category, product, amount],
  );

  const handleDelete = useCallback((id: string) => {
    setEntries(deleteCost(id));
  }, []);

  // Category breakdown bar
  const categoryTotal = Object.values(stats.byCategory).reduce(
    (a, b) => a + b,
    0,
  );

  return (
    <div className="space-y-6">
      {/* ── Add Expense Form ────────────────────────────────────────── */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="rounded-xl border bg-card p-5 shadow-card"
      >
        <div className="flex items-center gap-2 mb-4">
          <DollarSign
            className="h-5 w-5 text-primary"
            aria-hidden="true"
          />
          <h3 className="font-display text-base font-semibold text-foreground">
            Add Expense
          </h3>
        </div>

        <form onSubmit={handleSubmit} className="space-y-3">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label
                htmlFor="cost-date"
                className="block text-xs font-medium text-muted-foreground mb-1"
              >
                Date
              </label>
              <input
                id="cost-date"
                type="date"
                name="expense-date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm text-foreground transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              />
            </div>

            <div>
              <label
                htmlFor="cost-category"
                className="block text-xs font-medium text-muted-foreground mb-1"
              >
                Category
              </label>
              <select
                id="cost-category"
                name="expense-category"
                value={category}
                onChange={(e) =>
                  setCategory(e.target.value as CostEntry["category"])
                }
                className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm text-foreground transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              >
                {CATEGORIES.map((c) => (
                  <option key={c.value} value={c.value}>
                    {c.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label
                htmlFor="cost-product"
                className="block text-xs font-medium text-muted-foreground mb-1"
              >
                Product
              </label>
              <input
                id="cost-product"
                type="text"
                name="expense-product"
                autoComplete="off"
                placeholder="e.g. Scotts Turf Builder"
                value={product}
                onChange={(e) => setProduct(e.target.value)}
                className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm text-foreground transition-colors placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              />
            </div>

            <div>
              <label
                htmlFor="cost-amount"
                className="block text-xs font-medium text-muted-foreground mb-1"
              >
                Amount ($)
              </label>
              <input
                id="cost-amount"
                type="number"
                name="expense-amount"
                autoComplete="off"
                inputMode="decimal"
                step="0.01"
                min="0.01"
                placeholder="0.00"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm tabular-nums text-foreground transition-colors placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              />
            </div>
          </div>

          {formError && (
            <p className="text-xs text-destructive" role="alert">
              {formError}
            </p>
          )}

          <button
            type="submit"
            className="inline-flex min-h-[44px] items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            <Plus className="h-4 w-4" aria-hidden="true" />
            Add Expense
          </button>
        </form>
      </motion.div>

      {/* ── Summary Stats ───────────────────────────────────────────── */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.05 }}
        className="rounded-xl border bg-card p-5 shadow-card"
      >
        <h3 className="font-display text-base font-semibold text-foreground mb-4">
          Spending Summary
        </h3>

        <div className="grid grid-cols-3 gap-4 text-center">
          <div>
            <p className="text-xs text-muted-foreground">This Year</p>
            <p className="text-lg font-semibold tabular-nums text-foreground">
              {currency.format(stats.totalYear)}
            </p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground">This Month</p>
            <p className="text-lg font-semibold tabular-nums text-foreground">
              {currency.format(stats.totalMonth)}
            </p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground">Avg / Month</p>
            <p className="text-lg font-semibold tabular-nums text-foreground">
              {currency.format(stats.avgMonthly)}
            </p>
          </div>
        </div>

        {/* Category breakdown bar */}
        {categoryTotal > 0 && (
          <div className="mt-5">
            <p className="text-xs font-medium text-muted-foreground mb-2">
              By Category
            </p>
            <div className="flex h-3 w-full overflow-hidden rounded-full">
              {CATEGORIES.map((c) => {
                const pct =
                  categoryTotal > 0
                    ? (stats.byCategory[c.value] / categoryTotal) * 100
                    : 0;
                if (pct === 0) return null;
                return (
                  <div
                    key={c.value}
                    className={`${CATEGORY_COLORS[c.value]} transition-colors`}
                    style={{ width: `${pct}%` }}
                    title={`${c.label}: ${currency.format(stats.byCategory[c.value])} (${pct.toFixed(0)}%)`}
                  />
                );
              })}
            </div>
            <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1">
              {CATEGORIES.map((c) => {
                if (stats.byCategory[c.value] === 0) return null;
                return (
                  <span
                    key={c.value}
                    className="inline-flex items-center gap-1 text-xs text-muted-foreground"
                  >
                    <span
                      className={`inline-block h-2 w-2 rounded-full ${CATEGORY_COLORS[c.value]}`}
                      aria-hidden="true"
                    />
                    {c.label}
                  </span>
                );
              })}
            </div>
          </div>
        )}
      </motion.div>

      {/* ── Chart ────────────────────────────────────────────────────── */}
      <CostChart entries={entries} />

      {/* ── Recent Entries ──────────────────────────────────────────── */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.1 }}
        className="rounded-xl border bg-card p-5 shadow-card"
      >
        <h3 className="font-display text-base font-semibold text-foreground mb-4">
          Recent Expenses
        </h3>

        {entries.length === 0 ? (
          <p className="text-sm text-muted-foreground py-4 text-center">
            No expenses recorded yet.
          </p>
        ) : (
          <ul className="divide-y divide-border">
            <AnimatePresence initial={false}>
              {entries.slice(0, 10).map((entry) => (
                <motion.li
                  key={entry.id}
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.2 }}
                  className="flex items-center justify-between gap-3 py-3"
                >
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <span
                        className={`inline-block h-2 w-2 shrink-0 rounded-full ${CATEGORY_COLORS[entry.category]}`}
                        aria-hidden="true"
                      />
                      <span className="truncate text-sm font-medium text-foreground">
                        {entry.product}
                      </span>
                    </div>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      {new Date(entry.date).toLocaleDateString()} ·{" "}
                      {CATEGORIES.find((c) => c.value === entry.category)
                        ?.label ?? entry.category}
                    </p>
                  </div>

                  <span className="shrink-0 text-sm font-semibold tabular-nums text-foreground">
                    {currency.format(entry.amount)}
                  </span>

                  <button
                    type="button"
                    onClick={() => handleDelete(entry.id)}
                    aria-label={`Delete ${entry.product}`}
                    className="inline-flex min-h-[44px] min-w-[44px] items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-destructive/10 hover:text-destructive focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                  >
                    <Trash2 className="h-4 w-4" aria-hidden="true" />
                  </button>
                </motion.li>
              ))}
            </AnimatePresence>
          </ul>
        )}
      </motion.div>
    </div>
  );
};
