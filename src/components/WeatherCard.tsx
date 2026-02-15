import { motion } from "framer-motion";
import { Cloud, Droplets, Sun, Thermometer, Wind } from "lucide-react";

export function WeatherCard() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.1 }}
      className="rounded-xl border border-border bg-card p-5 shadow-card"
    >
      <div className="flex items-center justify-between mb-3">
        <h3 className="font-display text-base font-semibold text-foreground">Weather</h3>
        <span className="text-xs text-muted-foreground">Charlotte, NC</span>
      </div>

      <div className="flex items-center gap-4 mb-4">
        <div className="flex items-center gap-2">
          <Sun className="h-8 w-8 text-accent" />
          <span className="text-3xl font-display font-bold text-foreground">62°</span>
        </div>
        <div className="text-sm text-muted-foreground">
          <p>Partly Cloudy</p>
          <p className="text-xs">H: 68° · L: 45°</p>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-3">
        <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
          <Droplets className="h-3.5 w-3.5" />
          <span>42%</span>
        </div>
        <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
          <Wind className="h-3.5 w-3.5" />
          <span>8 mph</span>
        </div>
        <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
          <Cloud className="h-3.5 w-3.5" />
          <span>No rain</span>
        </div>
      </div>

      {/* Mini forecast */}
      <div className="mt-4 pt-3 border-t border-border">
        <div className="flex justify-between">
          {[
            { day: "Mon", temp: 65, icon: Sun },
            { day: "Tue", temp: 58, icon: Cloud },
            { day: "Wed", temp: 55, icon: Droplets },
            { day: "Thu", temp: 60, icon: Sun },
            { day: "Fri", temp: 63, icon: Sun },
          ].map(({ day, temp, icon: DayIcon }) => (
            <div key={day} className="flex flex-col items-center gap-1 text-xs text-muted-foreground">
              <span>{day}</span>
              <DayIcon className="h-3.5 w-3.5" />
              <span className="font-medium text-foreground">{temp}°</span>
            </div>
          ))}
        </div>
      </div>
    </motion.div>
  );
}
