import { useMemo, useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Link } from "react-router-dom";
import { Bell, X } from "lucide-react";
import { useProfile } from "@/context/ProfileContext";
import { getPlanForRegion } from "@/data/soilPlans";
import {
  getUpcomingReminders,
  dismissReminder,
  requestNotificationPermission,
  type PlanReminder,
} from "@/lib/planReminders";

export function ReminderBanner() {
  const { profile } = useProfile();
  const [dismissedIds, setDismissedIds] = useState<Set<string>>(new Set());

  const permissionState = useMemo<
    "granted" | "denied" | "default" | "unsupported"
  >(() => {
    if (!("Notification" in window)) return "unsupported";
    return Notification.permission as "granted" | "denied" | "default";
  }, []);

  const [permState, setPermState] = useState(permissionState);

  // Derive reminders from props — no effect needed
  const reminders = useMemo(() => {
    const region = profile.climateRegion ?? "Transition Zone";
    const plan = getPlanForRegion(region);
    return getUpcomingReminders(plan.applications, plan.year)
      .filter((r) => !r.dismissed && !dismissedIds.has(r.id))
      .slice(0, 2);
  }, [profile.climateRegion, dismissedIds]);

  const handleDismiss = (id: string) => {
    dismissReminder(id);
    setDismissedIds((prev) => new Set(prev).add(id));
  };

  const handleRequestPermission = async () => {
    const granted = await requestNotificationPermission();
    setPermState(granted ? "granted" : "denied");
  };

  if (reminders.length === 0 && permState !== "default") return null;

  return (
    <AnimatePresence mode="sync">
      {/* Permission request banner */}
      {permState === "default" && (
        <motion.div
          key="perm"
          initial={{ opacity: 0, y: -12 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -12 }}
          className="mb-3 rounded-xl border border-amber-400/30 bg-amber-500/10 p-3 flex items-center gap-3"
        >
          <div className="rounded-lg bg-amber-500/15 p-2 shrink-0">
            <Bell aria-hidden="true" className="h-4 w-4 text-amber-600 dark:text-amber-400" />
          </div>
          <p className="flex-1 text-xs text-foreground">
            Enable notifications for lawn care reminders
          </p>
          <button
            onClick={handleRequestPermission}
            className="shrink-0 rounded-lg bg-primary px-3 py-2.5 text-xs font-medium text-primary-foreground hover:bg-primary/90 transition-colors min-h-[44px] min-w-[44px] flex items-center"
          >
            Enable
          </button>
        </motion.div>
      )}

      {/* Upcoming task reminders */}
      {reminders.map((r) => (
        <motion.div
          key={r.id}
          initial={{ opacity: 0, y: -12 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, height: 0, marginBottom: 0 }}
          className="mb-3 rounded-xl border border-primary/25 bg-gradient-to-r from-primary/10 to-primary/5 p-3 flex items-center gap-3"
        >
          <div className="rounded-lg bg-primary/15 p-2 shrink-0">
            <Bell aria-hidden="true" className="h-4 w-4 text-primary" />
          </div>
          <Link to="/plan" className="flex-1 min-w-0">
            <p className="text-sm font-medium text-foreground truncate">
              🔔 Upcoming: {r.title}
            </p>
            <p className="text-xs text-muted-foreground truncate">
              {r.body}. Tap to view plan
            </p>
          </Link>
          <button
            onClick={() => handleDismiss(r.id)}
            className="shrink-0 p-2.5 rounded-md text-muted-foreground hover:text-foreground transition-colors min-h-[44px] min-w-[44px] flex items-center justify-center"
            aria-label={`Dismiss ${r.title} reminder`}
          >
            <X aria-hidden="true" className="h-4 w-4" />
          </button>
        </motion.div>
      ))}
    </AnimatePresence>
  );
}
