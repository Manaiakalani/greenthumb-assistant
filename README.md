# 🌱 Grasswise — Smart Lawn Care for Your Region

> The weather app for your lawn. Know exactly when to mow, fertilize, and water — and when to leave it alone.

Grasswise is a progressive web app that delivers **personalized, season-aware lawn care guidance** based on your location, climate zone, and grass type. Track your lawn care activities, earn achievement badges, snap progress photos, and share vintage collector cards with friends.

---

## ✨ Features

### Core
- **Live Weather Dashboard** — Real-time conditions from [Open-Meteo](https://open-meteo.com/) including temperature, humidity, wind, soil temperature, and a 5-day forecast
- **Season-Aware Actions** — 48 unique care recommendations across 4 seasons × 3 climate regions, personalized to your grass type
- **Smart Quick Stats** — At-a-glance growth rate, mow interval, water needs, and season indicator that updates automatically
- **USDA Zone Detection** — Auto-detect your location, hardiness zone, and climate region using browser geolocation
- **Seasonal Timeline** — A 12-month visual roadmap showing growth phases and tasks for your region
- **Dynamic Health Badge** — Lawn status (Thriving, Dormant, Recovering, Heat Stress) derived from your region's current growth phase

### Intelligence
- **🏥 Lawn Health Score** — 0-100 composite score with circular gauge, letter grade, and breakdown across Consistency, Variety, Recency, and Engagement — plus actionable tips to improve
- **🔔 Smart Reminders** — Context-aware nudges based on your journal history and live weather (e.g. "Rain coming — skip watering!", "It's been 12 days since your last mow", "High heat alert!")
- **📊 Activity Trends** — 6-month stacked bar chart showing activity breakdown by type, visible on the Tools page

### Activity Tracking
- **Lawn Journal** — Log mowing, watering, fertilizing, seeding, aeration, and more with notes and dates
- **📅 Activity Heatmap** — GitHub-style contribution grid showing the last 16 weeks of activity at a glance
- **Photo Timeline** — Capture lawn progress photos with camera support, image compression, and a lightbox gallery
- **Streak Tracking** — See your consecutive-day activity streaks with a 🔥 counter
- **Weekly Goals** — Set per-activity weekly targets and track progress with auto-resetting each Monday

### Tools & Data
- **Watering Calculator** — Select your sprinkler type and get exact minutes per session, sessions per week, and gallons per week
- **Soil Temperature Chart** — Visual gradient bar showing current soil temp at 6 cm depth with lawn-care insights per range
- **🌿 Soil & Fertilizer Plan** — Zone-based seasonal plan with monthly action checklist, progress tracking, and winter tips for Cool-Season, Transition, and Warm-Season regions
- **Community Pulse** — See what other lawn keepers in your region are doing this season (dormant %, mowing %, watering %)

### Gamification
- **17 Achievement Badges** — Earn badges across Milestones, Streaks, Seasonal, and Explorer categories
- **Collector Card Generator** — Pokémon-card-style "Lawn Care Collector's Card" with rarity system (Common → Legendary), fun titles, and foil shimmer effects
- **Card Gallery** — Browse example cards from different regions and rarities with a detail lightbox
- **🃏 Card Social Sharing** — Download your card as PNG, share via Web Share API, or copy a ready-made social media caption

### Data Safety
- **📦 Export & Backup** — One-click JSON export of all data (profile, journal, photos, achievements, goals)
- **🔄 Restore from Backup** — Import a previous backup with confirmation dialog — never lose your progress

### Polish
- **Onboarding Walkthrough** — 3-step intro modal for new users with skip option
- **PWA Install Banner** — Native install prompt on the dashboard for supported browsers
- **Push Notifications** — Opt-in daily lawn care reminders (mow, water, seasonal tips) at ~9 AM
- **Bottom Navigation** — Mobile-friendly tab bar with animated active indicator and 44px+ touch targets
- **Page Transitions** — Smooth fade/slide animations between pages via Framer Motion
- **Skeleton Loading** — Graceful loading states on first visit
- **Haptic Feedback** — Subtle vibration on key actions (mobile devices)
- **Dark Mode** — System-aware theme toggle with smooth transitions
- **Seasonal Theme Accents** — Accent colors shift with the season (spring green → summer gold → fall amber → winter blue)
- **PWA Support** — Installable on mobile (192px + 512px icons) with offline caching via service worker
- **Accessibility** — `aria-label`s, `focus-visible` states, `prefers-reduced-motion` support, `MotionConfig`, and keyboard-navigable modals
- **Error Boundary** — Graceful crash recovery with "Try Again" button

---

## 🛠️ Tech Stack

| Layer | Technology |
|-------|------------|
| Framework | React 18 + TypeScript 5.9 |
| Build | Vite 6 + SWC |
| Styling | Tailwind CSS 3 + CSS custom properties + seasonal accent overrides |
| Animation | Framer Motion (with `MotionConfig reducedMotion="user"`) |
| Data Fetching | TanStack React Query |
| Routing | React Router DOM 6 |
| Theme | next-themes (system/light/dark) |
| Weather API | Open-Meteo (free, no API key required) |
| Geolocation | Browser Geolocation API + Nominatim + USDA PHZM |
| Card Export | html2canvas (lazy-loaded) |
| UI Primitives | Radix UI (Dialog, Select, Label) |
| Icons | Lucide React |
| Toasts | Sonner |
| PWA | Service worker (SPA fallback, cache eviction, versioned cache) + Web App Manifest |
| Storage | localStorage with error handling and quota awareness |

**Production deps:** 17 · **Dev deps:** 15 · **Zero backend — 100% client-side**

---

## 🚀 Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) 18+ and npm

### Install & Run

```sh
# Clone the repo
git clone https://github.com/your-username/grasswise.git
cd grasswise

# Install dependencies
npm install

# Start development server
npm run dev
```

The app will be available at **http://localhost:8080/**

### Other Commands

```sh
npm run build      # Production build → dist/
npm run preview    # Preview production build locally
npm run lint       # Run ESLint
npx tsc --noEmit   # Type-check without emitting
```

---

## 📁 Project Structure

```
src/
├── components/          # UI components
│   ├── ui/              # Radix-based primitives (button, dialog, input, select, etc.)
│   ├── ActivityHeatmap.tsx       ← GitHub-style 16-week contribution grid
│   ├── AppHeader.tsx             ← Sticky header with logo, zone badge, theme toggle
│   ├── BottomNav.tsx             ← Mobile tab bar (6 tabs, 44px+ touch targets)
│   ├── CollectorCard.tsx         ← Vintage botanical card with rarity system
│   ├── CollectorCardModal.tsx    ← Download / share / caption card as PNG
│   ├── CommunityStats.tsx        ← Regional community pulse
│   ├── ErrorBoundary.tsx         ← React error boundary with recovery UI
│   ├── ExportBackup.tsx          ← JSON export + restore from backup
│   ├── InstallBanner.tsx         ← PWA install prompt banner
│   ├── LawnHealthScore.tsx       ← 0-100 circular gauge with breakdown
│   ├── NotificationSettings.tsx  ← Push notification toggles
│   ├── OnboardingModal.tsx       ← 3-step first-time walkthrough
│   ├── PageTransition.tsx        ← Animated route wrapper
│   ├── ProgressCharts.tsx        ← 6-month activity trends bar chart
│   ├── SmartReminders.tsx        ← Context-aware nudge cards
│   ├── WeatherCard.tsx           ← Live weather + 5-day forecast
│   ├── WeeklyGoalsWidget.tsx     ← Per-activity weekly goal tracker
│   └── ...                       ← HeroSection, QuickStats, ActionsSection, etc.
├── context/
│   └── ProfileContext.tsx        ← Global profile state + localStorage sync
├── data/
│   ├── season-actions.ts         ← 48 season × region care recommendations
│   ├── season-stats.ts           ← Growth rate, mow interval, water needs
│   ├── lawn-profile.ts           ← Growth phase + health badge derivation
│   ├── season-timeline.ts        ← 12-month visual roadmap data
│   └── soilPlans.ts              ← Zone-based fertilizer plan engine (3 regions)
├── hooks/
│   ├── useEarnedBadges.ts        ← Memoized earned badge loader
│   ├── useInstallPrompt.ts       ← PWA beforeinstallprompt hook
│   ├── useLawnHealth.ts          ← 0-100 health score computation
│   ├── useSeasonalTheme.ts       ← Applies seasonal CSS class to <html>
│   └── useSmartReminders.ts      ← Context-aware reminder generator
├── lib/
│   ├── achievements.ts           ← 17 achievement definitions + batched check
│   ├── geolocation.ts            ← Browser geolocation + reverse geocoding
│   ├── haptics.ts                ← Vibration API wrapper
│   ├── journal.ts                ← CRUD for journal, photos, weekly goals
│   ├── notifications.ts          ← Push notification scheduler
│   └── weather.ts                ← Open-Meteo API client
├── pages/
│   ├── Index.tsx                 ← Dashboard: hero, stats, health score, weather, reminders
│   ├── Journal.tsx               ← Activity log + heatmap + weekly goals
│   ├── Photos.tsx                ← Photo timeline with lightbox
│   ├── Tools.tsx                 ← Watering calc, soil temp, progress charts
│   ├── Achievements.tsx          ← Badge collection page
│   ├── Gallery.tsx               ← Collector card gallery
│   ├── SoilPlan.tsx              ← Soil & fertilizer plan with checklist
│   ├── Profile.tsx               ← Profile editor + notifications + backup
│   └── NotFound.tsx
├── types/
│   ├── journal.ts                ← ActivityType, JournalEntry, PhotoEntry, Achievement, etc.
│   └── profile.ts                ← UserProfile, USDAZone, ClimateRegion, GrassType
├── App.tsx                       ← Root: providers, ErrorBoundary, MotionConfig, routes
├── main.tsx                      ← Entry point + SW registration
└── index.css                     ← Tailwind + CSS variables + seasonal themes + reduced-motion
public/
├── favicon.svg                   ← SVG app icon (leaf on green)
├── icon-192.png                  ← PWA icon 192×192
├── icon-512.png                  ← PWA icon 512×512
├── manifest.json                 ← PWA manifest (4 icon sizes)
├── sw.js                         ← Service worker (SPA fallback, versioned cache, eviction)
└── robots.txt
```

---

## 🌍 How It Works

1. **Set your profile** — Enter your location or tap "Detect" to auto-fill zone, region, and coordinates
2. **Check your health score** — The 0-100 Lawn Health Score tells you how well you're maintaining your lawn
3. **Get live weather** — Open-Meteo fetches current conditions + 5-day forecast based on your lat/lng
4. **Read smart reminders** — Weather-aware and history-aware nudges keep you on track
5. **See what to do** — Season-aware actions tell you exactly what your lawn needs right now
6. **Log your work** — Track every mow, water, and treatment in the journal with dates and notes
7. **Watch the heatmap fill in** — A GitHub-style grid shows your consistency over 16 weeks
8. **Snap photos** — Build a visual timeline of your lawn's progress over weeks and months
9. **Use the tools** — Calculate watering schedules, monitor soil temp, and review activity trends
10. **Earn badges** — Unlock 17 achievements by maintaining streaks, trying new activities, and more
11. **Share your card** — Generate a collector card with your lawn profile and share it on social media
12. **Back up your data** — Export everything as JSON and restore anytime

---

## � Docker

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

---

## �🔒 Privacy

All data is stored **locally in your browser** using localStorage. No data is sent to any server except weather API requests to Open-Meteo (which only receives your coordinates, not your name or profile). You can export and delete your data at any time.

---

## 📄 License

MIT

---

<p align="center">
  Built with 🌿 and a love for grass.
</p>
