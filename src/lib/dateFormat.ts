/**
 * Consistent date/number formatters using Intl APIs.
 * Centralised here so every component renders dates the same way.
 */

const shortDate = new Intl.DateTimeFormat(undefined, {
  month: "short",
  day: "numeric",
  year: "numeric",
});

const shortDateNoYear = new Intl.DateTimeFormat(undefined, {
  month: "short",
  day: "numeric",
});

const longDate = new Intl.DateTimeFormat(undefined, {
  month: "long",
  day: "numeric",
  year: "numeric",
});

const monthYear = new Intl.DateTimeFormat(undefined, {
  month: "long",
  year: "numeric",
});

const shortMonth = new Intl.DateTimeFormat(undefined, {
  month: "short",
});

/** "Jan 5, 2025" */
export function formatShortDate(date: Date | string): string {
  const d = typeof date === "string" ? new Date(date) : date;
  return shortDate.format(d);
}

/** "Jan 5" (no year) */
export function formatShortDateNoYear(date: Date | string): string {
  const d = typeof date === "string" ? new Date(date) : date;
  return shortDateNoYear.format(d);
}

/** "January 5, 2025" */
export function formatLongDate(date: Date | string): string {
  const d = typeof date === "string" ? new Date(date) : date;
  return longDate.format(d);
}

/** "January 2025" */
export function formatMonthYear(date: Date | string): string {
  const d = typeof date === "string" ? new Date(date) : date;
  return monthYear.format(d);
}

/** "Jan" */
export function formatShortMonth(date: Date | string): string {
  const d = typeof date === "string" ? new Date(date) : date;
  return shortMonth.format(d);
}
