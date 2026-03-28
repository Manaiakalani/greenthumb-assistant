import { motion, AnimatePresence } from "framer-motion";
import { Bell, ChevronRight } from "lucide-react";
import { Link } from "react-router-dom";
import { useSmartReminders, type SmartReminder } from "@/hooks/useSmartReminders";
import type { WeatherData } from "@/lib/weather";

const PRIORITY_STYLES: Record<SmartReminder["priority"], string> = {
  high: "border-red-500/20 bg-red-500/5",
  medium: "border-amber-500/20 bg-amber-500/5",
  low: "border-primary/15 bg-primary/5",
};

export function SmartReminders({ weather }: { weather?: WeatherData | null }) {
  const reminders = useSmartReminders(weather);

  if (reminders.length === 0) return null;

  return (
    <div className="rounded-xl border border-primary/15 bg-card p-5 shadow-card">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <Bell className="h-5 w-5 text-primary" />
          <h3 className="font-display text-base font-semibold text-foreground">
            Smart Reminders
          </h3>
        </div>
        <span className="text-[10px] text-muted-foreground px-2 py-0.5 rounded-full bg-primary/10">
          {reminders.length} tip{reminders.length !== 1 ? "s" : ""}
        </span>
      </div>

      <div className="space-y-2">
        <AnimatePresence>
          {reminders.map((reminder, i) => (
            <motion.div
              key={reminder.id}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.08 }}
              className={`flex items-start gap-3 p-3 rounded-lg border ${PRIORITY_STYLES[reminder.priority]}`}
            >
              <span className="text-lg shrink-0 mt-0.5">{reminder.emoji}</span>
              <p className="text-xs text-foreground/80 leading-relaxed flex-1">
                {reminder.message}
              </p>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      <Link
        to="/journal"
        className="flex items-center justify-center gap-1 mt-3 text-xs text-primary hover:underline"
      >
        Log an activity
        <ChevronRight className="h-3 w-3" />
      </Link>
    </div>
  );
}
