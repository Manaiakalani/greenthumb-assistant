import { useCallback, useState, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import Bell from "lucide-react/dist/esm/icons/bell";
import BellOff from "lucide-react/dist/esm/icons/bell-off";
import Shield from "lucide-react/dist/esm/icons/shield";
import Droplets from "lucide-react/dist/esm/icons/droplets";
import Scissors from "lucide-react/dist/esm/icons/scissors";
import Leaf from "lucide-react/dist/esm/icons/leaf";
import {
  loadNotificationPrefs,
  saveNotificationPrefs,
  requestPermission,
} from "@/lib/notifications";
import type { NotificationPrefs } from "@/types/journal";

export function NotificationSettings() {
  const [prefs, setPrefs] = useState<NotificationPrefs>(loadNotificationPrefs);
  const [permissionState, setPermissionState] = useState<NotificationPermission | "unsupported">(
    () => ("Notification" in window ? Notification.permission : "unsupported"),
  );
  const toggling = useRef(false);

  const update = useCallback((partial: Partial<NotificationPrefs>) => {
    setPrefs((prev) => {
      const next = { ...prev, ...partial };
      saveNotificationPrefs(next);
      return next;
    });
  }, []);

  const handleToggleEnabled = useCallback(async () => {
    if (toggling.current) return;
    toggling.current = true;
    try {
      if (!prefs.enabled) {
        const granted = await requestPermission();
        if (!granted) {
          setPermissionState("Notification" in window ? Notification.permission : "unsupported");
          return;
        }
        setPermissionState("granted");
        update({ enabled: true });
      } else {
        update({ enabled: false });
      }
    } finally {
      toggling.current = false;
    }
  }, [prefs.enabled, update]);

  const toggleOptions = [
    { key: "mowReminder"    as const, icon: Scissors, label: "Mow reminders",       desc: "Seasonal mowing nudges" },
    { key: "waterReminder"  as const, icon: Droplets,  label: "Water reminders",      desc: "Hot-day watering alerts" },
    { key: "seasonalTips"   as const, icon: Leaf,      label: "Seasonal tips",        desc: "Seasonal lawn care advice" },
  ];

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <Bell className="h-5 w-5 text-primary" aria-hidden="true" />
        <h3 className="font-display text-lg font-semibold text-foreground">
          Notifications
        </h3>
      </div>

      {permissionState === "unsupported" && (
        <p className="text-xs text-muted-foreground">
          Your browser doesn't support push notifications.
        </p>
      )}

      {permissionState === "denied" && (
        <div className="flex items-center gap-2 rounded-lg bg-destructive/10 border border-destructive/20 p-3 text-xs text-destructive">
          <Shield className="h-4 w-4 shrink-0" />
          <span>Notifications are blocked. Please enable them in your browser settings.</span>
        </div>
      )}

      {/* Master toggle */}
      <button
        onClick={handleToggleEnabled}
        disabled={permissionState === "unsupported" || permissionState === "denied"}
        role="switch"
        aria-checked={prefs.enabled}
        className="w-full flex items-center justify-between rounded-xl border border-primary/15 bg-card p-4 transition-colors hover:bg-primary/5 disabled:opacity-50"
      >
        <div className="flex items-center gap-3">
          {prefs.enabled ? (
            <Bell className="h-5 w-5 text-primary" aria-hidden="true" />
          ) : (
            <BellOff aria-hidden="true" className="h-5 w-5 text-muted-foreground" />
          )}
          <div className="text-left">
            <p className="text-sm font-medium text-foreground">
              {prefs.enabled ? "Notifications on" : "Notifications off"}
            </p>
            <p className="text-xs text-muted-foreground">
              Daily lawn care reminders around 9 AM
            </p>
          </div>
        </div>
        <div className={`w-10 h-6 rounded-full transition-colors flex items-center ${prefs.enabled ? "bg-primary justify-end" : "bg-secondary justify-start"}`}>
          <motion.div
            layout
            className="w-5 h-5 rounded-full bg-white shadow-sm mx-0.5"
          />
        </div>
      </button>

      {/* Sub-toggles */}
      <AnimatePresence>
        {prefs.enabled && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden space-y-2"
          >
            {toggleOptions.map(({ key, icon: Icon, label, desc }) => (
              <button
                key={key}
                onClick={() => update({ [key]: !prefs[key] })}
                role="switch"
                aria-checked={prefs[key]}
                className="w-full flex items-center justify-between rounded-lg border border-border bg-card p-3 transition-colors hover:bg-primary/5"
              >
                <div className="flex items-center gap-2.5">
                  <Icon className={`h-4 w-4 ${prefs[key] ? "text-primary" : "text-muted-foreground"}`} />
                  <div className="text-left">
                    <p className="text-sm font-medium text-foreground">{label}</p>
                    <p className="text-[11px] text-muted-foreground">{desc}</p>
                  </div>
                </div>
                <div className={`w-8 h-5 rounded-full transition-colors flex items-center ${prefs[key] ? "bg-primary justify-end" : "bg-secondary justify-start"}`}>
                  <motion.div layout className="w-4 h-4 rounded-full bg-white shadow-sm mx-0.5" />
                </div>
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
