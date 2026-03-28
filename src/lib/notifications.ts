import type { NotificationPrefs } from "@/types/journal";

const PREFS_KEY = "grasswise-notification-prefs";

export function loadNotificationPrefs(): NotificationPrefs {
  try {
    const raw = localStorage.getItem(PREFS_KEY);
    if (raw) return JSON.parse(raw) as NotificationPrefs;
  } catch { /* ignore */ }
  return { enabled: false, mowReminder: true, waterReminder: true, seasonalTips: true };
}

export function saveNotificationPrefs(prefs: NotificationPrefs) {
  localStorage.setItem(PREFS_KEY, JSON.stringify(prefs));
}

/**
 * Request notification permission and return whether it was granted.
 */
export async function requestPermission(): Promise<boolean> {
  if (!("Notification" in window)) return false;
  if (Notification.permission === "granted") return true;
  if (Notification.permission === "denied") return false;
  const result = await Notification.requestPermission();
  return result === "granted";
}

/**
 * Send a local notification (if permission granted).
 */
export function sendNotification(title: string, body: string, icon = "/favicon.svg") {
  if (!("Notification" in window) || Notification.permission !== "granted") return;
  new Notification(title, { body, icon, badge: icon });
}

/**
 * Schedule a daily check for lawn care reminders.
 * Called once from main.tsx. Uses setInterval to check every hour.
 */
export function startReminderScheduler() {
  // Check every hour
  const HOUR = 60 * 60 * 1000;
  const LAST_KEY = "grasswise-last-reminder";

  function check() {
    const prefs = loadNotificationPrefs();
    if (!prefs.enabled) return;

    // Only send one reminder per day
    const today = new Date().toISOString().split("T")[0];
    if (localStorage.getItem(LAST_KEY) === today) return;

    const hour = new Date().getHours();
    // Send reminder around 9 AM
    if (hour < 9 || hour > 10) return;

    localStorage.setItem(LAST_KEY, today);

    const month = new Date().getMonth();
    const season = month >= 2 && month <= 4 ? "spring" : month >= 5 && month <= 7 ? "summer" : month >= 8 && month <= 10 ? "fall" : "winter";

    if (prefs.mowReminder && (season === "spring" || season === "summer" || season === "fall")) {
      sendNotification("🌱 Grasswise", "Time to check if your lawn needs mowing today!");
    } else if (prefs.waterReminder && season === "summer") {
      sendNotification("💧 Grasswise", "Hot day ahead — your lawn might need watering!");
    } else if (prefs.seasonalTips) {
      const tips: Record<string, string> = {
        spring: "Spring is here! Great time to check for weeds and apply fertilizer.",
        summer: "Keep an eye on soil moisture during the summer heat.",
        fall: "Fall is perfect for overseeding and aeration.",
        winter: "Your lawn is resting. Good time to plan for spring!",
      };
      sendNotification("🌿 Grasswise", tips[season]);
    }
  }

  // Initial check after 5 seconds
  setTimeout(check, 5000);
  setInterval(check, HOUR);
}
