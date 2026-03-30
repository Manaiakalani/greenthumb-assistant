import { describe, it, expect } from "vitest";
import {
  getDaysInMonth,
  getEventsForDate,
  isToday,
  type CalendarEvent,
} from "@/lib/calendarUtils";
import type { JournalEntry } from "@/types/journal";
import type { PlanApplication } from "@/lib/calendarUtils";
import type { MonthlyTask } from "@/data/monthlyTasks";

describe("calendarUtils", () => {
  describe("getDaysInMonth", () => {
    it("returns 35 or 42 days to fill the grid", () => {
      const days = getDaysInMonth(2025, 0); // January 2025
      expect([35, 42]).toContain(days.length);
    });

    it("includes padding days from previous month", () => {
      // January 2025 starts on Wednesday (day index 3), so 3 padding days from Dec
      const days = getDaysInMonth(2025, 0);
      const prevMonthDays = days.filter(
        (d) => !d.isCurrentMonth && d.date.getMonth() === 11,
      );
      expect(prevMonthDays.length).toBeGreaterThan(0);
    });

    it("includes padding days from next month", () => {
      const days = getDaysInMonth(2025, 0);
      const nextMonthDays = days.filter(
        (d) => !d.isCurrentMonth && d.date.getMonth() === 1,
      );
      expect(nextMonthDays.length).toBeGreaterThan(0);
    });

    it("marks current-month days correctly", () => {
      const days = getDaysInMonth(2025, 0);
      const currentMonthDays = days.filter((d) => d.isCurrentMonth);
      expect(currentMonthDays).toHaveLength(31); // January has 31 days
    });

    it("handles February in a leap year", () => {
      const days = getDaysInMonth(2024, 1); // Feb 2024 is a leap year
      const currentMonthDays = days.filter((d) => d.isCurrentMonth);
      expect(currentMonthDays).toHaveLength(29);
    });

    it("returns 42 days when month needs 6 rows", () => {
      // March 2025 starts on Saturday (day index 6) → needs 6 rows
      const days = getDaysInMonth(2025, 2);
      expect(days.length).toBe(42);
    });
  });

  describe("isToday", () => {
    it("returns true for today's date", () => {
      expect(isToday(new Date())).toBe(true);
    });

    it("returns false for yesterday", () => {
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);
      expect(isToday(yesterday)).toBe(false);
    });

    it("returns false for a date in a different year", () => {
      const pastDate = new Date(2020, 0, 1);
      expect(isToday(pastDate)).toBe(false);
    });
  });

  describe("getEventsForDate", () => {
    const journalEntries: JournalEntry[] = [
      {
        id: "j1",
        date: "2025-06-15",
        activity: "mow",
        notes: "Cut to 3 inches",
        createdAt: Date.now(),
      },
      {
        id: "j2",
        date: "2025-06-15",
        activity: "water",
        notes: "Morning watering",
        createdAt: Date.now(),
      },
    ];

    const planApps: PlanApplication[] = [
      {
        id: "p1",
        title: "Apply Pre-Emergent",
        dateRange: "Mar-Apr",
        category: "fertilizing",
        monthStart: 3,
        monthEnd: 4,
        description: "Apply pre-emergent herbicide",
      },
      {
        id: "p2",
        title: "Summer Fertilizer",
        dateRange: "Jun-Jul",
        category: "fertilizing",
        monthStart: 6,
        monthEnd: 7,
      },
    ];

    const tasks: MonthlyTask[] = [
      {
        id: "t1",
        month: 6,
        title: "Raise mowing height",
        description: "Raise to 3-4 inches for summer",
        category: "mowing",
        regions: ["Cool-Season"],
        priority: "essential",
      },
    ];

    it("merges journal, plan, and task events for a matching date", () => {
      const date = new Date(2025, 5, 15); // June 15, 2025
      const events = getEventsForDate(date, journalEntries, planApps, tasks);

      // 2 journal + 1 plan (Summer Fertilizer) + 1 task
      expect(events).toHaveLength(4);

      const types = events.map((e) => e.type);
      expect(types).toContain("journal");
      expect(types).toContain("plan");
      expect(types).toContain("task");
    });

    it("returns empty array for date with no events", () => {
      const date = new Date(2025, 11, 25); // December 25
      const events = getEventsForDate(date, journalEntries, planApps, tasks);
      expect(events).toEqual([]);
    });

    it("returns only journal events when no plans/tasks match", () => {
      const date = new Date(2025, 5, 15); // June 15
      const events = getEventsForDate(date, journalEntries, [], []);
      expect(events).toHaveLength(2);
      expect(events.every((e) => e.type === "journal")).toBe(true);
    });

    it("returns plan events for any day within the month range", () => {
      const date = new Date(2025, 2, 1); // March 1
      const events = getEventsForDate(date, [], planApps, []);
      expect(events).toHaveLength(1);
      expect(events[0].title).toBe("Apply Pre-Emergent");
    });
  });
});
