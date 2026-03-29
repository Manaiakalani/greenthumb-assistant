/**
 * iCalendar (.ics) generation and download utilities for soil plan steps.
 */

function pad(n: number): string {
  return n.toString().padStart(2, "0");
}

function formatDateValue(d: Date): string {
  return `${d.getFullYear()}${pad(d.getMonth() + 1)}${pad(d.getDate())}`;
}

function generateUid(): string {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 10)}@grasswise`;
}

function escapeIcsText(text: string): string {
  return text.replace(/\\/g, "\\\\").replace(/;/g, "\\;").replace(/,/g, "\\,").replace(/\n/g, "\\n");
}

export function generateIcsEvent(options: {
  title: string;
  description: string;
  startDate: Date;
  endDate: Date;
  location?: string;
}): string {
  const { title, description, startDate, endDate, location } = options;
  // For all-day events, DTEND is exclusive — add one day so the last day is included
  const exclusiveEnd = new Date(endDate);
  exclusiveEnd.setDate(exclusiveEnd.getDate() + 1);

  const lines = [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//Grasswise//Lawn Plan//EN",
    "CALSCALE:GREGORIAN",
    "BEGIN:VEVENT",
    `UID:${generateUid()}`,
    `DTSTART;VALUE=DATE:${formatDateValue(startDate)}`,
    `DTEND;VALUE=DATE:${formatDateValue(exclusiveEnd)}`,
    `SUMMARY:${escapeIcsText(title)}`,
    `DESCRIPTION:${escapeIcsText(description)}`,
    ...(location ? [`LOCATION:${escapeIcsText(location)}`] : []),
    "END:VEVENT",
    "END:VCALENDAR",
  ];

  return lines.join("\r\n");
}

export function generateIcsMultipleEvents(
  events: {
    title: string;
    description: string;
    startDate: Date;
    endDate: Date;
    location?: string;
  }[],
): string {
  const lines = [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//Grasswise//Lawn Plan//EN",
    "CALSCALE:GREGORIAN",
  ];

  for (const { title, description, startDate, endDate, location } of events) {
    const exclusiveEnd = new Date(endDate);
    exclusiveEnd.setDate(exclusiveEnd.getDate() + 1);

    lines.push(
      "BEGIN:VEVENT",
      `UID:${generateUid()}`,
      `DTSTART;VALUE=DATE:${formatDateValue(startDate)}`,
      `DTEND;VALUE=DATE:${formatDateValue(exclusiveEnd)}`,
      `SUMMARY:${escapeIcsText(title)}`,
      `DESCRIPTION:${escapeIcsText(description)}`,
      ...(location ? [`LOCATION:${escapeIcsText(location)}`] : []),
      "END:VEVENT",
    );
  }

  lines.push("END:VCALENDAR");
  return lines.join("\r\n");
}

export function downloadIcsFile(icsContent: string, filename: string): void {
  const blob = new Blob([icsContent], { type: "text/calendar;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = filename.endsWith(".ics") ? filename : `${filename}.ics`;
  document.body.appendChild(anchor);
  anchor.click();
  document.body.removeChild(anchor);
  URL.revokeObjectURL(url);
}

const MONTH_MAP: Record<string, number> = {
  January: 0, February: 1, March: 2, April: 3,
  May: 4, June: 5, July: 6, August: 7,
  September: 8, October: 9, November: 10, December: 11,
};

/**
 * Parse a human-readable date range like "May 17 – May 24" or
 * "September 20 – October 20" into start/end Date objects for the given year.
 */
export function parseApplicationDateRange(
  dateRange: string,
  year: number,
): { start: Date; end: Date } {
  // Normalize dashes (en-dash, em-dash, hyphen)
  const normalized = dateRange.replace(/[–—-]/g, "–");
  const [startPart, endPart] = normalized.split("–").map((s) => s.trim());

  function parseDate(part: string, fallbackMonth?: number): Date {
    const tokens = part.split(/\s+/);
    let month: number;
    let day: number;

    if (tokens.length === 2) {
      month = MONTH_MAP[tokens[0]] ?? 0;
      day = parseInt(tokens[1], 10);
    } else if (tokens.length === 1 && fallbackMonth !== undefined) {
      month = fallbackMonth;
      day = parseInt(tokens[0], 10);
    } else {
      month = 0;
      day = 1;
    }

    return new Date(year, month, day);
  }

  const start = parseDate(startPart);
  const end = parseDate(endPart, start.getMonth());

  return { start, end };
}
