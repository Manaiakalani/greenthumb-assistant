import React from "react";
import {
  ComposedChart,
  Line,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer,
  CartesianGrid,
  Area,
} from "recharts";
import { motion } from "motion/react";
import type { DailyForecast } from "@/lib/weather";

const FONT = "Inter, system-ui, sans-serif";

interface ForecastChartProps {
  forecast: DailyForecast[];
}

const ForecastChartInner: React.FC<ForecastChartProps> = ({ forecast }) => {
  if (!forecast || forecast.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="rounded-xl border bg-card p-5 shadow-card"
      >
        <h3 className="font-display text-base font-semibold text-foreground mb-4">
          Weather Forecast
        </h3>
        <div className="flex flex-col items-center justify-center py-10 text-muted-foreground">
          <span className="text-3xl mb-2">🌤️</span>
          <p className="text-sm">No forecast data available</p>
        </div>
      </motion.div>
    );
  }

  const data = forecast.map((day) => ({
    day: day.dayName,
    tempHigh: day.tempHigh,
    tempLow: day.tempLow,
    precipitation: day.precipitationSum,
  }));

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="rounded-xl border bg-card p-5 shadow-card"
    >
      <h3 className="font-display text-base font-semibold text-foreground mb-4">
        Weather Forecast
      </h3>
      <ResponsiveContainer width="100%" height={280}>
        <ComposedChart data={data} margin={{ top: 4, right: 4, left: -12, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
          <XAxis
            dataKey="day"
            tick={{ fontSize: 11, fontFamily: FONT, fill: "hsl(var(--muted-foreground))" }}
            tickLine={false}
            axisLine={{ stroke: "hsl(var(--border))" }}
          />
          <YAxis
            yAxisId="temp"
            tick={{ fontSize: 11, fontFamily: FONT, fill: "hsl(var(--muted-foreground))" }}
            tickLine={false}
            axisLine={false}
            unit="°F"
          />
          <YAxis
            yAxisId="precip"
            orientation="right"
            tick={{ fontSize: 11, fontFamily: FONT, fill: "hsl(var(--muted-foreground))" }}
            tickLine={false}
            axisLine={false}
            unit="in"
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
            labelStyle={{ fontFamily: FONT, fontWeight: 600, color: "hsl(var(--foreground))" }}
            formatter={(value: number, name: string) => {
              if (name === "precipitation") return [`${value} in`, "Precip"];
              return [`${value}°F`, name === "tempHigh" ? "High" : "Low"];
            }}
          />
          <Legend
            wrapperStyle={{ fontFamily: FONT, fontSize: 11, color: "hsl(var(--muted-foreground))" }}
            iconType="circle"
            iconSize={8}
          />
          <Area
            yAxisId="temp"
            type="monotone"
            dataKey="tempHigh"
            stroke="hsl(4, 72%, 55%)"
            fill="hsl(4, 72%, 55%)"
            fillOpacity={0.08}
            strokeWidth={2}
            name="High"
            dot={{ r: 3, fill: "hsl(4, 72%, 55%)" }}
          />
          <Line
            yAxisId="temp"
            type="monotone"
            dataKey="tempLow"
            stroke="hsl(200, 65%, 50%)"
            strokeWidth={2}
            name="Low"
            dot={{ r: 3, fill: "hsl(200, 65%, 50%)" }}
          />
          <Bar
            yAxisId="precip"
            dataKey="precipitation"
            fill="hsl(200, 65%, 50%)"
            fillOpacity={0.4}
            name="Precip"
            radius={[3, 3, 0, 0]}
            barSize={20}
          />
        </ComposedChart>
      </ResponsiveContainer>
    </motion.div>
  );
};

export const ForecastChart = React.memo(ForecastChartInner);
