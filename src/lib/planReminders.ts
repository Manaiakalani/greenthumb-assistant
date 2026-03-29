import type { PlanApplication } from "@/data/soilPlans";
import { safeGetItem, safeSetItem } from "@/lib/safeStorage";
import { requestPermission, sendNotification } from "@/lib/notifications";

/* ─── Types ──────────────────────────────────────────── */

export interface PlanReminder {
  id: string;
  stepId: string;
  title: string;
  body: string;
  scheduledDate: string; // ISO date
  dismissed: boolean;
}

/* ─── Storage keys ───────────────────────────────────── */

const DISMISSED_KEY = "grasswise-dismissed-reminders";
const NOTIFIED_KEY = "grasswise-notified-reminders";

/* ─── Date parsing ───────────────────────────────────── */

const MONTHS: Record<string, number> = {
  January: 0, February: 1, March: 2, April: 3, May: 4, June: 5,
  July: 6, August: 7, September: 8, October: 9, November: 10, December: 11,
};

/** Parse "March 15 – April 15" → start Date for the given year */
function parseDateRangeStart(dateRange: string, year: number): Date | null {
  // Split on en-dash or hyphen surrounded by spaces
  const startPart = dateRange.split(/\s*[–—-]\s*/)[0]?.trim();
  if (!startPart) return null;

  const match = startPart.match(/^(\w+)\s+(\d+)$/);
  if (!match) return null;

  const month = MONTHS[match[1]];
  const day = parseInt(match[2], 10);
  if (month === undefined || isNaN(day)) return null;

  return new Date(year, month, day);
}

/* ─── Public API ─────────────────────────────────────── */

/**
 * Check which plan steps start within the next 7 days and return
 * PlanReminder objects for each.
 */
export function getUpcomingReminders(
  applications: PlanApplication[],
  year: number,
): PlanReminder[] {
  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const weekAhead = new Date(today);
  weekAhead.setDate(weekAhead.getDate() + 7);

  const dismissed = new Set(getDismissedReminders());

  return applications
    .map((app) => {
      const start = parseDateRangeStart(app.dateRange, year);
      if (!start) return null;

      // Include steps that start today through 7 days from now
      if (start < today || start > weekAhead) return null;

      const id = `${year}-${app.id}`;
      return {
        id,
        stepId: app.id,
        title: app.title,
        body: `${app.dateRange} — ${app.instruction}`,
        scheduledDate: start.toISOString(),
        dismissed: dismissed.has(id),
      } satisfies PlanReminder;
    })
    .filter((r): r is PlanReminder => r !== null);
}

/** Request browser Notification permission. */
export async function requestNotificationPermission(): Promise<boolean> {
  return requestPermission();
}

/** Show a browser notification using the Notification API. */
export function showNotification(
  title: string,
  body: string,
  icon = "/favicon.svg",
): void {
  sendNotification(title, body, icon);
}

/**
 * Check for upcoming plan tasks and show browser notifications for any
 * that haven't been notified yet. Call on app load.
 */
export function checkAndNotify(
  applications: PlanApplication[],
  year: number,
): void {
  if (
    !("Notification" in window) ||
    Notification.permission !== "granted"
  ) {
    return;
  }

  const reminders = getUpcomingReminders(applications, year);
  const notified = new Set(getNotifiedReminders());

  for (const r of reminders) {
    if (r.dismissed || notified.has(r.id)) continue;
    showNotification(`🌱 ${r.title}`, r.body);
    notified.add(r.id);
  }

  // Persist notified set so we don't repeat on next load
  safeSetItem(NOTIFIED_KEY, [...notified]);
}

/** Mark a reminder as dismissed (persisted in localStorage). */
export function dismissReminder(id: string): void {
  const dismissed = getDismissedReminders();
  const dismissedSet = new Set(dismissed);
  if (!dismissedSet.has(id)) {
    dismissed.push(id);
    safeSetItem(DISMISSED_KEY, dismissed);
  }
}

/** Get the list of dismissed reminder IDs. */
export function getDismissedReminders(): string[] {
  return safeGetItem<string[]>(DISMISSED_KEY, []);
}

/* ─── Private helpers ────────────────────────────────── */

function getNotifiedReminders(): string[] {
  return safeGetItem<string[]>(NOTIFIED_KEY, []);
}
