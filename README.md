# 🌱 Grasswise — Smart Lawn Care for Your Region

> The weather app for your lawn. Know exactly when to mow, fertilize, and water — and when to leave it alone.

Grasswise is a progressive web app that delivers **personalized, season-aware lawn care guidance** based on your location, climate zone, and grass type. Track your lawn care activities, earn achievement badges, snap progress photos, and share vintage collector cards with friends.

---

## ✨ Features

### Core
- **Live Weather Dashboard** — Real-time conditions from [Open-Meteo](https://open-meteo.com/) with dual °F/°C display, humidity, wind, "feels like", soil temperature, and a 5-day forecast
- **Season-Aware Actions** — 48 unique care recommendations across 4 seasons × 3 climate regions, personalized to your grass type
- **Smart Quick Stats** — At-a-glance growth rate, mow interval, water needs, and season indicator that updates automatically
- **USDA Zone Detection** — Auto-detect your location, hardiness zone, and climate region using browser geolocation
- **Seasonal Timeline** — 5-month carousel with arrow navigation, dot indicators, and animated transitions — centered on the current month
- **Dynamic Health Badge** — Lawn status (Thriving, Dormant, Recovering, Heat Stress) derived from your region's current growth phase

### Intelligence
- **Lawn Health Score** — 0-100 composite score with circular gauge, letter grade, and breakdown across Consistency, Variety, Recency, and Engagement — plus actionable tips to improve
- **Smart Reminders** — Context-aware nudges based on your journal history and live weather (e.g. "Rain coming — skip watering!", "It's been 12 days since your last mow", "High heat alert!")
- **5 Recharts Visualizations** — Weekly activity stacked bar chart, lawn health radar, weather forecast composed chart, achievement donut, and soil plan Gantt timeline
- **Soil Plan Reminders** — Notification banner for upcoming fertilizer/soil tasks within a 7-day window

### Activity Tracking
- **Lawn Journal** — Log mowing, watering, fertilizing, seeding, aeration, and more with notes and dates
- **Activity Heatmap** — GitHub-style contribution grid showing the last 16 weeks of activity at a glance
- **Photo Timeline** — Capture lawn progress photos with camera support, image compression, and a lightbox gallery
- **Before/After Compare** — Draggable slider to compare lawn photos side-by-side
- **Streak Tracking** — See your consecutive-day activity streaks with a fire counter
- **Weekly Goals** — Set per-activity weekly targets and track progress with auto-resetting each Monday

### Tools & Data
- **Grass Type Quiz** — 5-step interactive quiz (climate zone → blade shape → growth habit → color → results) with profile save
- **Soil Test Input** — pH slider + nitrogen/phosphorus/potassium toggles with color-coded recommendations
- **Lawn Size Estimator** — Shape-based area calculator (rectangle, circle, L-shape) with product quantity estimates
- **Weather-Aware Watering Calculator** — Factors in recent rainfall, rain forecast, and suggests best watering days
- **Soil Temperature Chart** — Visual gradient bar showing current soil temp at 6 cm depth with lawn-care insights per range
- **Research-Backed Soil & Fertilizer Plans** — Zone-based seasonal plans with monthly action checklists, progress tracking, calendar export, and print support. Plans sourced from Virginia Tech, NC State, Purdue, Texas A&M, UF/IFAS, and USDA extension research — fall-heavy nitrogen, soil-temp-triggered pre-emergents, and grass-type-specific warnings
- **Calendar Export** — Download individual or all soil plan steps as .ics files for your calendar app
- **Print Plan** — @media print optimized layout for printing soil plans
- **Community Pulse** — See what other lawn keepers in your region are doing this season (dormant %, mowing %, watering %)

### Gamification
- **17 Achievement Badges** — Earn badges across Milestones, Streaks, Seasonal, and Explorer categories
- **Collector Card Generator** — Vintage botanical-style "Lawn Care Collector's Card" with rarity system (Common → Legendary), fun titles, and foil shimmer effects
- **Card Gallery** — Browse example cards from different regions and rarities with a detail lightbox
- **Card Social Sharing** — Download your card as PNG, share via Web Share API, or copy a ready-made social media caption

### Data Safety
- **Full JSON Backup** — One-click export of all data (profile, journal, photos, achievements, goals, soil test, lawn size)
- **Restore from Backup** — Import a previous backup with validation and confirmation dialog — never lose your progress

### Polish
- **Onboarding Walkthrough** — 3-step intro modal for new users with skip option
- **PWA Install Banner** — Native install prompt on the dashboard for supported browsers
- **Browser Notifications** — Opt-in reminders for upcoming soil plan tasks (no server required)
- **Bottom Navigation** — Mobile-friendly tab bar with animated active indicator and 44px+ touch targets
- **Page Transitions** — Smooth fade/slide animations between pages via Motion
- **Skeleton Loading** — Graceful loading states on first visit
- **Haptic Feedback** — Subtle vibration on key actions (mobile devices)
- **Dark Mode** — System-aware theme toggle with smooth transitions; charts adapt colors automatically
- **Seasonal Theme Accents** — Accent colors shift with the season (spring green → summer gold → fall amber → winter blue)
- **Typography** — Inter variable font (optical sizing) for body, Fraunces serif for display headings
- **PWA Support** — Installable on mobile (192px + 512px icons) with offline fallback page, Workbox-powered service worker, and app shortcuts
- **Accessibility** — `aria-label`s, `aria-expanded`, `aria-pressed`, `focus-visible` states, `prefers-reduced-motion` support, `MotionConfig`, keyboard-navigable galleries, form label associations, and 44px+ touch targets
- **Error Boundary** — Graceful crash recovery with "Try Again" button
- **Privacy Policy** — Full /privacy page covering location data, localStorage, PWA, no-tracking, children's privacy
- **Bundle Splitting** — Vendor chunks for React, Recharts, Motion, React Query, and UI — main bundle reduced by ~95%
- **Safe Storage** — localStorage wrapper with try/catch for Safari private mode and quota exceeded errors

---

## Tech Stack

| Layer | Technology |
|-------|------------|
| Framework | React 18 + TypeScript 5.9 |
| Build | Vite 6 + SWC |
| Styling | Tailwind CSS 3 + CSS custom properties + seasonal accent overrides |
| Fonts | Inter (variable, optical sizing) + Fraunces (display serif) via Google Fonts |
| Animation | Motion (tree-shaking entry for Framer Motion 12+, `MotionConfig reducedMotion="user"`) |
| Charts | Recharts 3 (BarChart, RadarChart, ComposedChart, PieChart) |
| Data Fetching | TanStack React Query 5 |
| Routing | React Router DOM 6 |
| State | Zustand 5 (journal/photos/achievements) + React Context (profile) |
| Theme | next-themes (system/light/dark) |
| Weather API | [Open-Meteo](https://open-meteo.com/) (free, no API key required) |
| Geolocation | Browser Geolocation API + Nominatim + USDA PHZM |
| Card Export | html2canvas (lazy-loaded) |
| UI Primitives | Radix UI (Dialog, Select, Label) |
| Icons | Lucide React |
| Toasts | Sonner |
| PWA | vite-plugin-pwa + Workbox (generateSW, offline fallback, app shortcuts) |
| Storage | localStorage with safe wrapper (quota + privacy mode handling) |
| Testing | Vitest 4 (136 unit tests) + Playwright (252 E2E tests x 6 browsers) |
| i18n | react-i18next (en locale, extensible) |

**Production deps:** 21 | **Dev deps:** 20 | **Zero backend — 100% client-side**

---

## Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) 18+ and npm

### Install & Run

```sh
# Clone the repo
git clone https://github.com/Manaiakalani/greenthumb-assistant.git
cd greenthumb-assistant

# Install dependencies
npm install --legacy-peer-deps

# Start development server
npm run dev
```

The app will be available at **http://localhost:8080/**

### Commands

```sh
npm run dev            # Start dev server
npm run build          # Production build -> dist/
npm run preview        # Preview production build locally
npm run lint           # Run ESLint
npm run lint:fix       # Run ESLint with auto-fix
npm run typecheck      # Type-check without emitting (tsc --noEmit)
npm run test           # Run unit tests (Vitest, 136 tests)
npm run test:watch     # Run unit tests in watch mode
npm run test:coverage  # Run unit tests with coverage report
npm run test:e2e       # Run Playwright E2E tests (252 tests x 6 browsers)
```

---

## Testing

### Unit Tests (Vitest)

136 tests across 10 test files covering weather utilities, state management, safe storage, components, and error boundaries.

```sh
npm run test
```

### End-to-End Tests (Playwright)

252 tests across 6 browser projects:
- Desktop: Chromium, Firefox, WebKit (Safari)
- Mobile: Pixel 7 (Chrome), iPhone 14 (Safari)
- Tablet: iPad (Safari)

```sh
# Install browsers (first time only)
npx playwright install

# Run all E2E tests
npm run test:e2e

# Run with UI mode
npx playwright test --ui
```

Tests cover: homepage, quick stats, weather, actions, seasonal timeline carousel, lawn profile, bottom navigation, 404 pages, accessibility (landmarks, alt text, keyboard focus, headings, skip link), visual polish (no horizontal scroll, no console errors, no crashes), mobile layout (viewport, fixed nav, touch targets, grid adaptation, bottom padding), dark mode, and all page routes.

---

## Project Structure

```
src/
├── components/          # UI components
│   ├── ui/              # Radix-based primitives (button, dialog, input, select, etc.)
│   ├── charts/          # Recharts visualizations
│   │   ├── WeeklyActivityChart    <- Stacked bar (last 8 weeks journal)
│   │   ├── LawnHealthRadar        <- Radar chart (4 health dimensions)
│   │   ├── ForecastChart          <- Composed chart (temp lines + precip bars)
│   │   ├── AchievementDonut       <- Pie donut (earned vs locked badges)
│   │   └── SoilPlanGantt          <- Horizontal bar (monthly plan timeline)
│   ├── DataBackupCard             <- Full JSON backup & restore card
│   ├── LawnSizeEstimator          <- Shape-based area calculator
│   ├── PhotoCompare               <- Before/after draggable slider
│   ├── ReminderBanner             <- Upcoming soil plan task notifications
│   ├── SeasonalTimeline           <- 5-month carousel with arrow navigation
│   ├── SoilTestCard               <- pH/NPK input with recommendations
│   ├── WateringCalculator         <- Weather-aware watering with rainfall
│   ├── WeatherCard                <- Live weather + dual F/C + geolocation
│   └── ...                        <- HeroSection, QuickStats, SmartReminders, etc.
├── data/
│   └── soilPlans                  <- Research-backed fertilizer plans (3 zones)
├── hooks/
│   ├── useWeather                 <- Shared weather query hook (TanStack Query)
│   └── ...                        <- useLawnHealth, useSmartReminders, etc.
├── lib/
│   ├── calendar                   <- .ics calendar file generation
│   ├── dataExport                 <- Full JSON backup & restore utilities
│   ├── planReminders              <- Plan-based notification scheduling
│   ├── safeStorage                <- Safe localStorage wrapper
│   └── ...                        <- achievements, geolocation, weather, etc.
├── pages/
│   ├── Index                      <- Dashboard: hero, weather, reminders, health, charts
│   ├── Tools                      <- Charts, watering calc, soil test, lawn size
│   ├── SoilPlan                   <- Fertilizer plan + Gantt + calendar export + print
│   ├── GrassQuiz                  <- 5-step grass identification quiz
│   ├── Privacy                    <- Full privacy policy page
│   └── ...                        <- Journal, Photos, Profile, Achievements, Gallery
├── test/                          <- 10 test files, 136 unit tests
└── types/                         <- TypeScript interfaces
e2e/
└── fit-and-finish.spec.ts         <- 252 Playwright E2E tests
```

---

## How It Works

1. **Set your profile** — Enter your location or tap "Use my location" to auto-fill zone, region, and coordinates
2. **Take the grass quiz** — Identify your grass type through a 5-step visual quiz
3. **Check your health score** — The 0-100 Lawn Health Score tells you how well you're maintaining your lawn
4. **Get live weather** — Open-Meteo fetches current conditions + 5-day forecast with dual F/C display
5. **Read smart reminders** — Weather-aware and history-aware nudges keep you on track
6. **Follow your soil plan** — Research-backed fertilizer schedules with calendar export and progress tracking
7. **See what to do** — Season-aware actions tell you exactly what your lawn needs right now
8. **Log your work** — Track every mow, water, and treatment in the journal with dates and notes
9. **Watch the heatmap fill in** — A GitHub-style grid shows your consistency over 16 weeks
10. **Snap photos** — Build a visual timeline and compare before/after with a drag slider
11. **Use the tools** — Calculate watering, input soil test results, estimate lawn size, and explore data charts
12. **Earn badges** — Unlock 17 achievements by maintaining streaks, trying new activities, and more
13. **Share your card** — Generate a collector card with your lawn profile and share it on social media
14. **Back up your data** — Export everything as JSON and restore anytime

---

## Docker

### Build & Run

```sh
# Build the image
docker build -t grasswise .

# Run on port 8080
docker run -p 8080:80 grasswise
```

### Docker Compose

```sh
docker compose up -d
```

The app will be available at **http://localhost:8080/**

The Docker image uses a multi-stage build (Node 22 Alpine -> Nginx Alpine) with:
- Gzip compression for all text assets
- Immutable caching for hashed `/assets/` files (1 year)
- Security headers (X-Frame-Options, X-Content-Type-Options, Referrer-Policy, Permissions-Policy)
- SPA fallback routing via `try_files`
- WebP and WOFF2 caching support

---

## Privacy

All data is stored **locally in your browser** using localStorage. No data is sent to any server except weather API requests to [Open-Meteo](https://open-meteo.com/) (which only receives your coordinates, not your name or profile). The app includes a full [Privacy Policy](/privacy) page. You can export and delete your data at any time.

---

## License

MIT

---

<p align="center">
  Built with 🌿 and a love for grass.
</p>
