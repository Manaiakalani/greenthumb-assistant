import { useMemo, useState, useCallback } from "react";
import { motion, AnimatePresence } from "motion/react";
import CalendarDays from "lucide-react/dist/esm/icons/calendar-days";
import ChevronLeft from "lucide-react/dist/esm/icons/chevron-left";
import ChevronRight from "lucide-react/dist/esm/icons/chevron-right";
import { AppHeader } from "@/components/AppHeader";
import { BottomNav } from "@/components/BottomNav";
import { PageTransition } from "@/components/PageTransition";
import { useGrassStore } from "@/stores/useGrassStore";
import { useProfile } from "@/context/ProfileContext";
import { getPlanForRegion } from "@/data/soilPlans";
import { getTasksForMonth } from "@/data/monthlyTasks";
import {
  getDaysInMonth,
  getEventsForDate,
  isToday,
  isPast,
  formatFullDate,
  type CalendarEvent,
} from "@/lib/calendarUtils";

const WEEKDAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"] as const;

const MONTH_NAMES = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
] as const;

const DOT_COLORS: Record<CalendarEvent["type"], string> = {
  journal: "bg-green-500",
  plan: "bg-blue-500",
  task: "bg-orange-500",
};

const LEGEND: { type: CalendarEvent["type"]; label: string; color: string }[] = [
  { type: "journal", label: "Journal", color: "bg-green-500" },
  { type: "plan", label: "Soil Plan", color: "bg-blue-500" },
  { type: "task", label: "Tasks", color: "bg-orange-500" },
];

// Hoisted outside component to avoid re-creation on every render
const SLIDE_VARIANTS = {
  enter: (dir: number) => ({ x: dir > 0 ? 80 : -80, opacity: 0 }),
  center: { x: 0, opacity: 1 },
  exit: (dir: number) => ({ x: dir > 0 ? -80 : 80, opacity: 0 }),
};

const Calendar = () => {
  const now = new Date();
  const [year, setYear] = useState(now.getFullYear());
  const [month, setMonth] = useState(now.getMonth());
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [direction, setDirection] = useState(0); // -1 = prev, 1 = next

  const { profile } = useProfile();
  const journal = useGrassStore((s) => s.journal);

  const region = profile.region;

  const planApps = useMemo(() => {
    if (!region) return [];
    const plan = getPlanForRegion(region);
    return plan.applications;
  }, [region]);

  // Get tasks for current displayed month AND adjacent months (for padding days)
  const tasks = useMemo(() => {
    if (!region) return [];
    const current = getTasksForMonth(month + 1, region);
    const prev = getTasksForMonth(month === 0 ? 12 : month, region);
    const next = getTasksForMonth(month === 11 ? 1 : month + 2, region);
    // Deduplicate by id
    const map = new Map<string, (typeof current)[number]>();
    for (const t of [...prev, ...current, ...next]) map.set(t.id, t);
    return [...map.values()];
  }, [month, region]);

  const days = useMemo(() => getDaysInMonth(year, month), [year, month]);

  // Pre-compute events for every day in the grid
  const eventsMap = useMemo(() => {
    const map = new Map<string, CalendarEvent[]>();
    for (const { date } of days) {
      const key = date.toISOString().split("T")[0];
      if (!map.has(key)) {
        map.set(key, getEventsForDate(date, journal, planApps, tasks));
      }
    }
    return map;
  }, [days, journal, planApps, tasks]);

  const goToPrev = useCallback(() => {
    setDirection(-1);
    setSelectedDate(null);
    setMonth((m) => {
      if (m === 0) {
        setYear((y) => y - 1);
        return 11;
      }
      return m - 1;
    });
  }, []);

  const goToNext = useCallback(() => {
    setDirection(1);
    setSelectedDate(null);
    setMonth((m) => {
      if (m === 11) {
        setYear((y) => y + 1);
        return 0;
      }
      return m + 1;
    });
  }, []);

  const goToToday = useCallback(() => {
    const t = new Date();
    setDirection(0);
    setYear(t.getFullYear());
    setMonth(t.getMonth());
    setSelectedDate(null);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleDayClick = useCallback((date: Date) => {
    setSelectedDate((prev) =>
      prev && prev.getTime() === date.getTime() ? null : date,
    );
  }, []);

  const selectedEvents = useMemo(() => {
    if (!selectedDate) return [];
    const key = selectedDate.toISOString().split("T")[0];
    return eventsMap.get(key) ?? [];
  }, [selectedDate, eventsMap]);

  return (
    <div className="min-h-screen bg-background pb-28">
      <AppHeader />
      <PageTransition>
        <main id="main-content" className="max-w-2xl mx-auto px-5 sm:px-8">
          {/* Heading */}
          <div className="mt-6 mb-6">
            <h1 className="font-display text-2xl font-bold text-foreground flex items-center gap-2 [text-wrap:balance]">
              <CalendarDays aria-hidden="true" className="h-6 w-6 text-primary" />
              Calendar
            </h1>
            <p className="text-sm text-muted-foreground mt-1">
              All your lawn care events in one view.
            </p>
          </div>

          {/* Legend */}
          <div className="flex items-center gap-4 mb-4">
            {LEGEND.map((l) => (
              <div key={l.type} className="flex items-center gap-1.5">
                <span className={`h-2.5 w-2.5 rounded-full ${l.color}`} aria-hidden="true" />
                <span className="text-xs text-muted-foreground">{l.label}</span>
              </div>
            ))}
          </div>

          {/* Month navigation */}
          <div className="flex items-center justify-between mb-3">
            <button
              onClick={goToPrev}
              aria-label="Previous month"
              className="p-2 rounded-lg hover:bg-muted transition-colors min-w-[44px] min-h-[44px] flex items-center justify-center focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
            >
              <ChevronLeft className="h-5 w-5 text-foreground" aria-hidden="true" />
            </button>

            <button
              onClick={goToToday}
              aria-label={`Go to ${MONTH_NAMES[now.getMonth()]} ${now.getFullYear()}`}
              className="font-display text-lg font-semibold text-foreground hover:text-primary transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary rounded"
            >
              {MONTH_NAMES[month]} {year}
            </button>

            <button
              onClick={goToNext}
              aria-label="Next month"
              className="p-2 rounded-lg hover:bg-muted transition-colors min-w-[44px] min-h-[44px] flex items-center justify-center focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
            >
              <ChevronRight className="h-5 w-5 text-foreground" aria-hidden="true" />
            </button>
          </div>

          {/* Calendar grid */}
          <div className="rounded-xl border border-primary/10 bg-card shadow-card overflow-hidden">
            {/* Weekday headers */}
            <div className="grid grid-cols-7 border-b border-primary/10">
              {WEEKDAYS.map((d) => (
                <div
                  key={d}
                  className="py-2 text-center text-xs font-semibold text-muted-foreground uppercase tracking-wide"
                >
                  {d}
                </div>
              ))}
            </div>

            {/* Day cells */}
            <AnimatePresence mode="wait" custom={direction}>
              <motion.div
                key={`${year}-${month}`}
                custom={direction}
                variants={SLIDE_VARIANTS}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{ duration: 0.2, ease: "easeInOut" }}
                className="grid grid-cols-7"
              >
                {days.map(({ date, isCurrentMonth }) => {
                  const dateKey = date.toISOString().split("T")[0];
                  const events = eventsMap.get(dateKey) ?? [];
                  const today = isToday(date);
                  const past = isPast(date) && !today;
                  const isSelected =
                    selectedDate !== null &&
                    selectedDate.getTime() === date.getTime();

                  // Deduplicate event type dots
                  const dotTypes = [...new Set(events.map((e) => e.type))];

                  return (
                    <button
                      key={dateKey}
                      onClick={() => handleDayClick(date)}
                      aria-label={formatFullDate(date)}
                      aria-pressed={isSelected}
                      className={[
                        "relative flex flex-col items-center justify-center min-h-[44px] py-2 transition-colors",
                        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary",
                        !isCurrentMonth && "opacity-30",
                        isCurrentMonth && past && "opacity-60",
                        isSelected && "bg-primary/10",
                        !isSelected && "hover:bg-muted/50",
                      ]
                        .filter(Boolean)
                        .join(" ")}
                    >
                      {/* Day number */}
                      <span
                        className={[
                          "tabular-nums text-sm leading-none",
                          today
                            ? "font-bold text-primary"
                            : "text-foreground",
                        ]
                          .filter(Boolean)
                          .join(" ")}
                      >
                        {date.getDate()}
                      </span>

                      {/* Today ring */}
                      {today && (
                        <span className="absolute inset-x-auto top-1 h-1 w-1 rounded-full bg-primary" />
                      )}

                      {/* Event dots */}
                      {dotTypes.length > 0 && (
                        <span className="flex gap-0.5 mt-1">
                          {dotTypes.map((type) => (
                            <span
                              key={type}
                              aria-hidden="true"
                              className={`h-1.5 w-1.5 rounded-full ${DOT_COLORS[type]}`}
                            />
                          ))}
                        </span>
                      )}
                    </button>
                  );
                })}
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Expandable detail panel */}
          <AnimatePresence mode="wait">
            {selectedDate && (
              <motion.div
                key={selectedDate.toISOString()}
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.2, ease: "easeInOut" }}
                className="overflow-hidden"
              >
                <div className="mt-3 rounded-xl border border-primary/10 bg-card shadow-card p-4">
                  <h2 className="font-display text-base font-semibold text-foreground mb-3">
                    {selectedDate.toLocaleDateString("en-US", {
                      weekday: "long",
                      month: "long",
                      day: "numeric",
                    })}
                  </h2>

                  {selectedEvents.length === 0 ? (
                    <p className="text-sm text-muted-foreground">
                      No events on this day.
                    </p>
                  ) : (
                    <div className="space-y-2">
                      {selectedEvents.map((event, i) => (
                        <div
                          key={`${event.type}-${event.title}-${i}`}
                          className="flex items-start gap-3 rounded-lg border border-primary/10 bg-background p-3"
                        >
                          <span
                            className={`mt-0.5 h-2.5 w-2.5 rounded-full shrink-0 ${DOT_COLORS[event.type]}`}
                            aria-hidden="true"
                          />
                          <div className="min-w-0 flex-1">
                            <p className="text-sm font-medium text-foreground">
                              {event.title}
                            </p>
                            <p className="text-xs text-muted-foreground mt-0.5 break-words">
                              {event.detail}
                            </p>
                            <span className="inline-block mt-1 text-[10px] uppercase tracking-wider text-muted-foreground/70 bg-muted rounded px-1.5 py-0.5">
                              {event.type === "journal"
                                ? "Completed"
                                : event.type === "plan"
                                  ? "Scheduled"
                                  : "Pending"}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </main>
      </PageTransition>
      <BottomNav />
    </div>
  );
};

export default Calendar;
