import React, { useMemo } from "react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";
import { motion } from "motion/react";
import type { CostEntry } from "@/lib/costTracker";
import { getCostsByMonth, loadCosts } from "@/lib/costTracker";

const FONT = "Inter, system-ui, sans-serif";

interface CostChartProps {
  entries?: CostEntry[];
}

function buildLast12Months(entries: CostEntry[]) {
  const byMonth = getCostsByMonth(entries);
  const now = new Date();
  const months: { month: string; spend: number }[] = [];

  for (let i = 11; i >= 0; i--) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
    const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
    const label = d.toLocaleString("default", { month: "short", year: "2-digit" });
    months.push({ month: label, spend: byMonth[key] ?? 0 });
  }

  return months;
}

const CostChartInner: React.FC<CostChartProps> = ({ entries }) => {
  const data = useMemo(() => buildLast12Months(entries ?? loadCosts()), [entries]);
  const hasData = data.some((d) => d.spend > 0);

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="rounded-xl border bg-card p-5 shadow-card"
    >
      <h3 className="font-display text-base font-semibold text-foreground mb-4">
        Monthly Spending
      </h3>

      {!hasData ? (
        <div className="flex flex-col items-center justify-center py-10 text-muted-foreground">
          <span className="text-3xl mb-2" aria-hidden="true">
            📊
          </span>
          <p className="text-sm">No spending data yet</p>
        </div>
      ) : (
        <ResponsiveContainer width="100%" height={280}>
          <AreaChart data={data} margin={{ top: 4, right: 4, left: -12, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
            <XAxis
              dataKey="month"
              tick={{ fontSize: 11, fontFamily: FONT, fill: "hsl(var(--muted-foreground))" }}
              tickLine={false}
              axisLine={{ stroke: "hsl(var(--border))" }}
            />
            <YAxis
              tick={{ fontSize: 11, fontFamily: FONT, fill: "hsl(var(--muted-foreground))" }}
              tickLine={false}
              axisLine={false}
              tickFormatter={(v: number) => `$${v}`}
            />
            <Tooltip
              contentStyle={{
                fontFamily: FONT,
                fontSize: 12,
                backgroundColor: "hsl(var(--card))",
                color: "hsl(var(--foreground))",
                borderColor: "hsl(var(--border))",
                borderRadius: 8,
              }}
              labelStyle={{
                fontFamily: FONT,
                fontWeight: 600,
                color: "hsl(var(--foreground))",
              }}
              formatter={(value: number) => [`$${value.toFixed(2)}`, "Spend"]}
            />
            <Area
              type="monotone"
              dataKey="spend"
              stroke="hsl(var(--primary))"
              fill="hsl(var(--primary))"
              fillOpacity={0.12}
              strokeWidth={2}
              dot={{ r: 3, fill: "hsl(var(--primary))" }}
              name="Spend"
            />
          </AreaChart>
        </ResponsiveContainer>
      )}
    </motion.div>
  );
};

export const CostChart = React.memo(CostChartInner);
