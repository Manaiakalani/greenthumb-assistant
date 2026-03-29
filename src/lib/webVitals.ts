import { onCLS, onINP, onLCP, onFCP, onTTFB, type Metric } from "web-vitals";

/**
 * Log Core Web Vitals to the console in development.
 * Replace `logMetric` with an analytics endpoint in production.
 */
function logMetric(metric: Metric) {
  if (import.meta.env.DEV) {
    // eslint-disable-next-line no-console
    console.debug(
      `[web-vitals] ${metric.name}: ${Math.round(metric.value * 100) / 100}`,
      metric.rating,
    );
  }
}

export function reportWebVitals(onReport: (m: Metric) => void = logMetric) {
  onCLS(onReport);
  onINP(onReport);
  onLCP(onReport);
  onFCP(onReport);
  onTTFB(onReport);
}
