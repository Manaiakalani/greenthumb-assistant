import React, { useMemo } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  Cell,
} from "recharts";
import { motion } from "motion/react";
import { useProfile } from "@/context/ProfileContext";
import { getPlanForRegion, CATEGORY_META } from "@/data/soilPlans";
import type { ClimateRegion } from "@/types/profile";
import type { PlanApplication } from "@/data/soilPlans";

const FONT = "Inter, system-ui, sans-serif";

const MONTHS = [
  "Jan", "Feb", "Mar", "Apr", "May", "Jun",
  "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
];

// Colors per category — earth-tone palette
const CATEGORY_COLORS: Record<PlanApplication["category"], string> = {
  fertilizer: "hsl(152, 45%, 32%)",
  "weed-control": "hsl(42, 85%, 55%)",
  seeding: "hsl(85, 55%, 45%)",
  "soil-amendment": "hsl(28, 70%, 50%)",
  maintenance: "hsl(200, 65%, 50%)",
};

interface SoilPlanGanttProps {
  region?: ClimateRegion;
}

interface GanttRow {
  name: string;
  start: number;
  duration: number;
  category: PlanApplication["category"];
  dateRange: string;
}

interface GanttBarProps {
  x?: number;
  y?: number;
  width?: number;
  height?: number;
  payload?: GanttRow;
}

// Custom bar shape for future horizontal offset rendering
const _GanttBar = (props: GanttBarProps) => {
  const { x, y, width, height, payload } = props;
  if (!payload) return null;

  // The bar starts at monthStart and spans duration months
  // XAxis domain is 0-12, so we need to calculate the offset
  const totalWidth = props.background?.width ?? width;
  const barX = x + (payload.start / 12) * totalWidth;
  const barWidth = (payload.duration / 12) * totalWidth;

  return (
    <rect
      x={barX}
      y={y + 2}
      width={Math.max(barWidth, 4)}
      height={height - 4}
      fill={props.fill}
      rx={4}
      ry={4}
    />
  );
};

const SoilPlanGanttInner: React.FC<SoilPlanGanttProps> = ({ region }) => {
  const { profile } = useProfile();
  const effectiveRegion = region ?? profile.region ?? "Transition Zone";

  const rows = useMemo(() => {
    const plan = getPlanForRegion(effectiveRegion);
    return plan.applications.map((app): GanttRow => ({
      name: app.title,
      start: app.monthStart,
      duration: Math.max(app.monthEnd - app.monthStart + 1, 1),
      category: app.category,
      dateRange: app.dateRange,
    }));
  }, [effectiveRegion]);

  // Transformed data: each row has a fixed value of 1 for bar rendering,
  // but we render custom positioned bars using the GanttBar shape
  const chartData = rows.map((row) => ({
    name: row.name,
    // Encode as [start, end] for the bar
    span: [row.start, row.start + row.duration],
    category: row.category,
    dateRange: row.dateRange,
    start: row.start,
    duration: row.duration,
  }));

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="rounded-xl border bg-card p-5 shadow-card"
    >
      <h3 className="font-display text-base font-semibold text-foreground mb-1">
        Soil Plan Timeline
      </h3>
      <p className="text-xs text-muted-foreground mb-4" style={{ fontFamily: FONT }}>
        {effectiveRegion} — {new Date().getFullYear()}
      </p>
      <ResponsiveContainer width="100%" height={Math.max(rows.length * 36 + 40, 240)}>
        <BarChart
          data={chartData}
          layout="vertical"
          margin={{ top: 4, right: 12, left: 8, bottom: 4 }}
          barCategoryGap={4}
        >
          <CartesianGrid
            strokeDasharray="3 3"
            stroke="hsl(var(--border))"
            horizontal={false}
          />
          <XAxis
            type="number"
            domain={[0, 12]}
            ticks={[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12]}
            tickFormatter={(v: number) => (v < 12 ? MONTHS[v] : "")}
            tick={{
              fontSize: 10,
              fontFamily: FONT,
              fill: "hsl(var(--muted-foreground))",
            }}
            tickLine={false}
            axisLine={{ stroke: "hsl(var(--border))" }}
          />
          <YAxis
            type="category"
            dataKey="name"
            width={110}
            tick={{
              fontSize: 10,
              fontFamily: FONT,
              fill: "hsl(var(--muted-foreground))",
            }}
            tickLine={false}
            axisLine={false}
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
            formatter={(_value: unknown, _name: unknown, entry: { payload: GanttRow }) => {
              const row = entry.payload;
              const emoji = CATEGORY_META[row.category as PlanApplication["category"]]?.emoji ?? "";
              return [`${emoji} ${row.dateRange}`, row.name];
            }}
            labelFormatter={() => ""}
          />
          <Bar dataKey="span" radius={[4, 4, 4, 4]} barSize={20}>
            {chartData.map((entry, index) => (
              <Cell
                key={`cell-${index}`}
                fill={CATEGORY_COLORS[entry.category]}
              />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
      {/* Category legend */}
      <div className="flex flex-wrap justify-center gap-3 mt-3">
        {(Object.entries(CATEGORY_COLORS) as [PlanApplication["category"], string][]).map(
          ([cat, color]) => (
            <div key={cat} className="flex items-center gap-1.5">
              <span
                className="inline-block h-2.5 w-2.5 rounded-full"
                style={{ backgroundColor: color }}
              />
              <span
                className="text-xs text-muted-foreground capitalize"
                style={{ fontFamily: FONT }}
              >
                {cat.replace("-", " ")}
              </span>
            </div>
          ),
        )}
      </div>
    </motion.div>
  );
};

export const SoilPlanGantt = React.memo(SoilPlanGanttInner);
