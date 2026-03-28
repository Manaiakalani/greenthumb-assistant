import { createRoot } from "react-dom/client";
import App from "@/App";
import "@/index.css";
import "@/i18n"; // i18n must be imported before App renders
import { startReminderScheduler } from "@/lib/notifications";
import { reportWebVitals } from "@/lib/webVitals";

createRoot(document.getElementById("root")!).render(<App />);

// Start notification scheduler (checks hourly, sends at ~9 AM)
// Guard against duplicate timers during Vite HMR
if (!(window as Record<string, unknown>).__grasswise_scheduler) {
  (window as Record<string, unknown>).__grasswise_scheduler = true;
  startReminderScheduler();
}

// 🌱 Console easter egg
console.log(
  `%c
   ____                           _
  / ___|_ __ __ _ ___ _____      _(_)___  ___
 | |  _| '__/ _\` / __/ __\\ \\ /\\ / / / __|\\ _ \\
 | |_| | | | (_| \\__ \\__ \\\\ V  V /| \\__ \\  __/
  \\____|_|  \\__,_|___/___/ \\_/\\_/ |_|___/\\___|

  🌿 The weather app for your lawn.
  🪴 Built with React, TypeScript & a love for grass.
`,
  "color: #2c7a4a; font-family: monospace; font-size: 11px;",
);

// PWA service worker auto-registered by vite-plugin-pwa

// Report Core Web Vitals (logs to console in dev)
reportWebVitals();
