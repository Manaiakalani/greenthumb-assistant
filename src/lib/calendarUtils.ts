import type { JournalEntry } from "@/types/journal";
import { ACTIVITY_META } from "@/types/journal";
import type { MonthlyTask } from "@/data/monthlyTasks";

/** Represents a single plan application from soilPlans */
export interface PlanApplication {
  id: string;
  title: string;
  dateRange: string;
  category: string;
  monthStart: number;
  monthEnd: number;
  description?: string;
  instruction?: string;
}

export interface CalendarEvent {
  type: "journal" | "plan" | "task";
  title: string;
  detail: string;
  category: string;
}

export interface CalendarDay {
  date: Date;
  isCurrentMonth: boolean;
}

/**
 * Build an array of dates for a month grid (Sun–Sat).
 * Includes padding days from previous and next months to fill 6×7 = 42 cells.
 */
export function getDaysInMonth(year: number, month: number): CalendarDay[] {
  const firstDay = new Date(year, month, 1);
  const startPad = firstDay.getDay(); // 0=Sun

  const days: CalendarDay[] = [];

  // Previous month padding
  for (let i = startPad - 1; i >= 0; i--) {
    days.push({
      date: new Date(year, month, -i),
      isCurrentMonth: false,
    });
  }

  // Current month
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  for (let d = 1; d <= daysInMonth; d++) {
    days.push({
      date: new Date(year, month, d),
      isCurrentMonth: true,
    });
  }

  // Next month padding (fill to 42 cells, or 35 if it fits)
  const totalRows = days.length > 35 ? 42 : 35;
  while (days.length < totalRows) {
    const next = days.length - startPad - daysInMonth + 1;
    days.push({
      date: new Date(year, month + 1, next),
      isCurrentMonth: false,
    });
  }

  return days;
}

/** Format a Date as YYYY-MM-DD (local time) */
function toDateStr(d: Date): string {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

/**
 * Gather all events for a specific date from the three data sources.
 */
export function getEventsForDate(
  date: Date,
  journal: JournalEntry[],
  planApps: PlanApplication[],
  tasks: MonthlyTask[],
): CalendarEvent[] {
  const dateStr = toDateStr(date);
  const month = date.getMonth() + 1; // 1-indexed
  const events: CalendarEvent[] = [];

  // Journal entries — exact date match
  for (const entry of journal) {
    if (entry.date === dateStr) {
      const meta = ACTIVITY_META[entry.activity];
      events.push({
        type: "journal",
        title: `${meta.emoji} ${meta.label}`,
        detail: entry.notes || "No notes",
        category: entry.activity,
      });
    }
  }

  // Soil plan applications — month range match
  for (const app of planApps) {
    if (month >= app.monthStart && month <= app.monthEnd) {
      events.push({
        type: "plan",
        title: app.title,
        detail: app.dateRange,
        category: app.category,
      });
    }
  }

  // Monthly tasks — month match
  for (const task of tasks) {
    if (task.month === month) {
      events.push({
        type: "task",
        title: task.title,
        detail: task.description,
        category: task.category,
      });
    }
  }

  return events;
}

/** Check whether a date is today (local time) */
export function isToday(date: Date): boolean {
  const now = new Date();
  return (
    date.getFullYear() === now.getFullYear() &&
    date.getMonth() === now.getMonth() &&
    date.getDate() === now.getDate()
  );
}

/** Check whether a date is in the past (before today, local time) */
export function isPast(date: Date): boolean {
  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  return date < today;
}

/** Format a Date for aria-label (e.g. "Monday, January 15, 2025") */
export function formatFullDate(date: Date): string {
  return date.toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}
