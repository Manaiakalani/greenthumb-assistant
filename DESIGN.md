---
name: Grasswise
description: The weather app for your lawn. A warm, encouraging, location-aware lawn-care companion that nudges without nagging.
version: alpha
colors:
  # ── Light theme ────────────────────────────────────────────────────────
  background: "#faf9f4"
  on-background: "#18261e"
  surface: "#faf9f4"
  surface-container-lowest: "#ffffff"
  surface-container-low: "#fdfdf9"
  surface-container: "#f3f4ea"
  surface-container-high: "#ebede0"
  surface-container-highest: "#e3e9d6"
  on-surface: "#18261e"
  on-surface-variant: "#677b71"
  outline: "#a9b29c"
  outline-variant: "#dfe2d2"
  primary: "#2d7754"
  on-primary: "#faf9f4"
  primary-container: "#3a9c6a"
  on-primary-container: "#0c2a1c"
  secondary: "#e3e9d6"
  on-secondary: "#25382d"
  tertiary: "#efb434"
  on-tertiary: "#3d2e0f"
  tertiary-container: "#fcecc4"
  on-tertiary-container: "#3d2e0f"
  error: "#db4a3a"
  on-error: "#ffffff"
  error-container: "#fbd9d3"
  on-error-container: "#5b160c"
  # Lawn-status semantics — used on score chips, indicators, charts.
  lawn-healthy: "#319e58"
  lawn-caution: "#efb434"
  lawn-danger: "#db4a3a"
  lawn-dormant: "#8e95a3"
  # ── Dark theme (suffixed; consumers may map to the same names under .dark) ──
  background-dark: "#111c16"
  on-background-dark: "#ecebde"
  surface-dark: "#111c16"
  surface-container-lowest-dark: "#0b1410"
  surface-container-low-dark: "#161f1a"
  surface-container-dark: "#1a221d"
  surface-container-high-dark: "#202a24"
  surface-container-highest-dark: "#28332c"
  on-surface-dark: "#ecebde"
  on-surface-variant-dark: "#8a9489"
  outline-dark: "#5e6a63"
  outline-variant-dark: "#2e3933"
  primary-dark: "#43b070"
  on-primary-dark: "#08130c"
  primary-container-dark: "#1f5a3a"
  on-primary-container-dark: "#c5ecd3"
  secondary-dark: "#28332c"
  on-secondary-dark: "#d6dccd"
  tertiary-dark: "#df9e23"
  on-tertiary-dark: "#f4e4ba"
  error-dark: "#ba412e"
  on-error-dark: "#ffffff"
  lawn-healthy-dark: "#3eb262"
  lawn-caution-dark: "#df9e23"
  lawn-danger-dark: "#ba412e"
  lawn-dormant-dark: "#6c7484"
typography:
  display-xl:
    fontFamily: Fraunces
    fontSize: 60px
    fontWeight: "600"
    lineHeight: 64px
    letterSpacing: -0.02em
    fontVariation: "'opsz' 144"
  display-lg:
    fontFamily: Fraunces
    fontSize: 44px
    fontWeight: "600"
    lineHeight: 52px
    letterSpacing: -0.02em
    fontVariation: "'opsz' 96"
  headline-lg:
    fontFamily: Fraunces
    fontSize: 32px
    fontWeight: "600"
    lineHeight: 40px
    letterSpacing: -0.01em
  headline-md:
    fontFamily: Fraunces
    fontSize: 24px
    fontWeight: "600"
    lineHeight: 32px
  headline-sm:
    fontFamily: Fraunces
    fontSize: 20px
    fontWeight: "600"
    lineHeight: 28px
  title-md:
    fontFamily: Inter
    fontSize: 16px
    fontWeight: "600"
    lineHeight: 24px
  body-lg:
    fontFamily: Inter
    fontSize: 18px
    fontWeight: "400"
    lineHeight: 28px
  body-md:
    fontFamily: Inter
    fontSize: 16px
    fontWeight: "400"
    lineHeight: 24px
  body-sm:
    fontFamily: Inter
    fontSize: 14px
    fontWeight: "400"
    lineHeight: 20px
  label-md:
    fontFamily: Inter
    fontSize: 14px
    fontWeight: "500"
    lineHeight: 20px
  label-sm:
    fontFamily: Inter
    fontSize: 12px
    fontWeight: "500"
    lineHeight: 16px
    letterSpacing: 0.01em
  numeric-stat:
    fontFamily: Inter
    fontSize: 32px
    fontWeight: "600"
    lineHeight: 36px
    letterSpacing: -0.01em
    fontFeature: "'tnum' 1, 'cv11' 1"
rounded:
  none: 0px
  sm: 8px
  DEFAULT: 10px
  md: 10px
  lg: 12px
  xl: 16px
  "2xl": 20px
  full: 9999px
spacing:
  unit: 4px
  xs: 4px
  sm: 8px
  md: 12px
  base: 16px
  lg: 24px
  xl: 32px
  "2xl": 48px
  "3xl": 64px
  gutter: 16px
  page-padding-mobile: 16px
  page-padding-desktop: 32px
  card-padding: 20px
  bottom-nav-height: 64px
  safe-area-bottom: env(safe-area-inset-bottom, 0px)
elevation:
  shadow-card: "0 1px 3px rgba(38, 53, 46, 0.06), 0 4px 12px rgba(38, 53, 46, 0.04)"
  shadow-card-hover: "0 4px 12px rgba(38, 53, 46, 0.10), 0 8px 24px rgba(38, 53, 46, 0.06)"
  shadow-status: "0 2px 8px rgba(45, 119, 84, 0.20)"
  shadow-popover: "0 8px 24px rgba(38, 53, 46, 0.12), 0 2px 6px rgba(38, 53, 46, 0.06)"
  shadow-modal: "0 24px 48px rgba(38, 53, 46, 0.20), 0 8px 16px rgba(38, 53, 46, 0.08)"
motion:
  easing-out: "cubic-bezier(0.23, 1, 0.32, 1)"
  easing-in-out: "cubic-bezier(0.77, 0, 0.175, 1)"
  easing-drawer: "cubic-bezier(0.32, 0.72, 0, 1)"
  duration-instant: 0ms
  duration-quick: 120ms
  duration-standard: 180ms
  duration-moderate: 250ms
  duration-expressive: 600ms
  press-scale: 0.97
  reduced-motion: respect
breakpoints:
  sm: 640px
  md: 768px
  lg: 1024px
  xl: 1280px
  "2xl": 1536px
  container-max: 1400px
iconography:
  library: lucide
  default-size: 16px
  nav-size: 20px
  hero-size: 24px
  stroke-width: 2px
  style: rounded-line
seasonal-accents:
  spring: "#3ec381"
  summer: "#efb434"
  fall: "#dc8633"
  winter: "#4a8fcb"
pwa:
  app-name: Grasswise
  theme-color-light: "#2c7a4a"
  theme-color-dark: "#111c16"
  background-color: "#faf9f4"
  display: standalone
  icon-style: rounded-square-gradient
components:
  card-surface:
    backgroundColor: "{colors.surface-container-low}"
    textColor: "{colors.on-surface}"
    rounded: "{rounded.lg}"
    padding: "{spacing.card-padding}"
  card-surface-hover:
    backgroundColor: "{colors.surface-container}"
  hero-card:
    backgroundColor: "{colors.primary}"
    textColor: "{colors.on-primary}"
    rounded: "{rounded.xl}"
    padding: "{spacing.lg}"
  button-primary:
    backgroundColor: "{colors.primary}"
    textColor: "{colors.on-primary}"
    typography: "{typography.label-md}"
    rounded: "{rounded.md}"
    height: 40px
    padding: "0 16px"
  button-primary-hover:
    backgroundColor: "{colors.primary-container}"
  button-secondary:
    backgroundColor: "{colors.secondary}"
    textColor: "{colors.on-secondary}"
    typography: "{typography.label-md}"
    rounded: "{rounded.md}"
    height: 40px
    padding: "0 16px"
  button-ghost:
    backgroundColor: transparent
    textColor: "{colors.on-surface}"
    typography: "{typography.label-md}"
    rounded: "{rounded.md}"
    height: 40px
    padding: "0 12px"
  button-ghost-hover:
    backgroundColor: "{colors.surface-container-high}"
  button-icon:
    backgroundColor: transparent
    rounded: "{rounded.md}"
    height: 40px
    width: 40px
  button-pressed:
    # Active state shrinks 3% — universal across all button variants.
    typography: "{typography.label-md}"
  input-field:
    backgroundColor: "{colors.surface-container-lowest}"
    textColor: "{colors.on-surface}"
    typography: "{typography.body-md}"
    rounded: "{rounded.md}"
    height: 40px
    padding: "0 12px"
  input-field-focus:
    backgroundColor: "{colors.surface-container-lowest}"
  status-chip-healthy:
    backgroundColor: "{colors.lawn-healthy}"
    textColor: "#ffffff"
    typography: "{typography.label-sm}"
    rounded: "{rounded.full}"
    padding: "4px 10px"
  status-chip-caution:
    backgroundColor: "{colors.lawn-caution}"
    textColor: "{colors.on-tertiary}"
    typography: "{typography.label-sm}"
    rounded: "{rounded.full}"
    padding: "4px 10px"
  status-chip-danger:
    backgroundColor: "{colors.lawn-danger}"
    textColor: "#ffffff"
    typography: "{typography.label-sm}"
    rounded: "{rounded.full}"
    padding: "4px 10px"
  status-chip-dormant:
    backgroundColor: "{colors.lawn-dormant}"
    textColor: "#ffffff"
    typography: "{typography.label-sm}"
    rounded: "{rounded.full}"
    padding: "4px 10px"
  bottom-nav:
    backgroundColor: "{colors.surface-container-lowest}"
    textColor: "{colors.on-surface-variant}"
    height: "{spacing.bottom-nav-height}"
  bottom-nav-active:
    textColor: "{colors.primary}"
  modal-sheet:
    backgroundColor: "{colors.surface-container-lowest}"
    textColor: "{colors.on-surface}"
    rounded: "{rounded.xl}"
    padding: "{spacing.lg}"
  popover:
    backgroundColor: "{colors.surface-container-lowest}"
    textColor: "{colors.on-surface}"
    rounded: "{rounded.md}"
    padding: "{spacing.md}"
  collector-card:
    backgroundColor: "{colors.surface-container-low}"
    rounded: "{rounded.xl}"
    padding: "{spacing.base}"
---

## Overview

Grasswise is the weather app for your lawn. The product personality is a knowledgeable next-door neighbor: warm, plain-spoken, encouraging, and seasonally aware. The aesthetic borrows from analog garden almanacs — soft cream paper, deep forest ink, a single gold accent — and re-renders them as a calm, mobile-first dashboard.

The mood is **grounded, optimistic, hands-in-the-dirt**. It is not corporate. It is not gamer-aggressive. It is not minimalist-clinical. There is room for a little personality — a serif headline that reads like a question ("Where's your lawn?"), a status badge that grins green when things are healthy — but never at the cost of clarity. Every screen earns its space by telling the user what to do today, what to skip, and why.

The interface should feel like opening a well-worn field notebook: structured, but not stiff.

## Colors

The palette has three voices: a warm-cream stage, a deep-forest protagonist, and a golden-hour spotlight.

- **Primary — Forest Green.** The brand's voice. Used on the principal call-to-action of any screen, the active bottom-nav item, the focus ring, the hero band. One primary action per view, almost always. The shade leans cool and saturated enough to feel confident, but never neon.
- **Surface — Warm Cream.** The background is intentionally off-white with a faint yellow cast. It reads as "paper," not "screen." Cards sit a hair brighter than the surface (or pure white), separated by tonal shift more than by hard borders.
- **Tertiary / Accent — Goldenrod.** A warm amber pulled straight from a midsummer afternoon. It signals attention without alarm: caution chips, season-summer accent, highlights inside hero illustrations. Use sparingly — accent loses meaning when it's everywhere.
- **Lawn-status semantics.** Four dedicated tokens — healthy, caution, danger, dormant — drive the lawn health score, charts, weather alerts, and progress chips. They map loosely to traffic-light intuition, but the dormant grey is a deliberate fourth state: "your lawn is fine, it's just resting."
- **Dark mode** preserves the same hierarchy without inverting brand. The cream becomes near-black with a green undertone (not pure black), the forest primary brightens into a more luminous green so it still reads as the same character on a darker stage. Cards are tonal lifts of the background, never pure black-on-black.

The seasonal accent rotates between four values across the year — fresh green in spring, gold in summer, burnt orange in fall, cool blue in winter. The rotation is subtle: only the accent shifts. Primary, surfaces, and type stay constant so the product never looks like a different app.

## Typography

Two families, used with discipline.

- **Fraunces (variable serif)** is the voice of the brand. It carries every page title, hero question, modal headline, and major card title. Use weight 600, optical-size set to the actual rendered size, and a slightly tight tracking on display sizes (`-0.02em`) so it reads as confident, not bookish. Never set Fraunces below 18px — small serif on a phone is a usability tax.
- **Inter** carries everything else: body copy, labels, buttons, form inputs, microcopy, numbers. Weight 400 for body, 500 for labels, 600 for buttons and emphasized titles. The variable axis lets type look "right" at any size without manual tracking adjustments.

Headings are sentence case, not Title Case. Questions are encouraged ("Ready to mow?"). Numerals in stats use tabular figures (`tnum`) so columns of moisture, soil temp, days-since-watered align cleanly. Body text balances with `text-wrap: balance` on headings to avoid orphans.

Hierarchy in practice: a dashboard has at most one display-size headline, two or three section headlines, and the rest is body or label. If a screen has six font sizes on it, something is wrong.

## Layout

Mobile-first, dashboard-shaped, single column on phones. The viewport is treated as a stack of cards separated by a comfortable gutter — never a dense table, never a wall of unbroken text.

- **Page padding** is 16px on mobile, 32px on desktop. Content max-width caps near 1400px so wide monitors don't sprawl.
- **Bottom navigation** is the primary navigation on mobile: 64px tall, fixed to the viewport bottom, with a safe-area inset so it sits above the iOS home indicator. Active item shows in primary green with a focus-visible ring.
- **Cards** are the atomic unit: rounded 12–16px corners, surface-container-low fill, hairline outline-variant border, soft two-stop shadow. They lift on hover (desktop) by deepening the shadow, never by translating — translation triggers motion sickness in long lists.
- **Density** is comfortable, not crammed. Vertical rhythm uses 16/24/32px steps; sub-16px gaps are reserved for inline elements (icon + label, label + value).
- **Print** reflows to a single column with hidden navigation — the journal and seasonal plan should be printable as a tidy field reference.

## Elevation & Depth

Depth is signaled with **two soft shadows stacked**, never with hard drop-shadows or harsh outlines. Light mode shadows are tinted dark green at 4–10% opacity so they melt into the cream surface. Dark mode shadows are pure black at slightly higher opacity. Hierarchy:

- **Flat** — page background, dividers.
- **Card** — default content blocks, lifted by the smallest shadow.
- **Card-hover** — pointer-hover state on desktop only; doubles the blur.
- **Status** — primary-tinted glow under high-emphasis chips and hero calls-to-action.
- **Popover** — menus, dropdowns, tooltips. Slightly stronger than card.
- **Modal** — onboarding, confirmations, full-screen sheets. The strongest shadow, paired with a backdrop blur.

Glassmorphism is not used. The aesthetic is paper, not glass.

## Shapes

Corners are **soft but not pillowy**. The base radius is 10–12px — large enough to feel friendly on a phone, small enough to keep the layout architectural. Pills (`9999px`) are reserved for status chips and small toggles where the rounded form encodes meaning ("this is a label, not a button"). Pure squares are avoided except for thumbnail photo grids, where photo aspect ratio takes precedence.

Buttons match cards in radius family (`md`), inputs the same. Hero blocks and modals step up to `xl` for a slightly more inviting silhouette.

## Components

- **Buttons.** Filled-primary for the page's main action; secondary (sage) for paired alternatives; ghost for tertiary affordances and toolbar items; icon-only for header utilities. Every variant scales to 0.97 on press for tactile feedback. Disabled buttons drop to 50% opacity. Minimum tap target is 40×40 on dense toolbars, 44×44 anywhere a finger is the primary input.
- **Cards.** Rounded 12–16px, surface-container-low fill, soft two-stop shadow, optional outline-variant hairline. Title in Fraunces 600, body in Inter 400. Padding 16–20px depending on density.
- **Hero band.** Forest-green filled card at the top of the dashboard, with a subtle 135° gradient to a brighter green. Holds one large question or one large stat.
- **Status chips.** Pills filled with a lawn-status color, label in `label-sm`. Used on the lawn health score, weather alerts, journal entries.
- **Forms.** Input fields have a clear filled background (surface-container-lowest), 40px tall, 12px horizontal padding, focus ring in primary green at 2px offset. Labels sit above inputs, never as ghost placeholders for required fields.
- **Modals & sheets.** Centered on desktop, full-bleed bottom-sheet on mobile. Zoom-in fade on entrance (180ms standard, ease-out), fade-out on exit. Close target is at least 44×44.
- **Bottom navigation.** Five to six items maximum, icon + label, active item in primary green with a focus-visible ring on keyboard nav.
- **Charts.** Use the four lawn-status tokens for categorical series; primary green for the dominant line. Always pair color with shape (icon, label, pattern) for accessibility — never carry meaning by color alone.
- **Collector cards.** Achievement-style cards have a slow foil-shimmer animation behind a translucent overlay; this is the one place the product permits a flourish.

## Motion

Three easing curves, used deliberately:

- **ease-out** (`cubic-bezier(0.23, 1, 0.32, 1)`) — the default. Apply to entrances, hover lifts, button presses, page enters. Things arrive softly and settle.
- **ease-in-out** (`cubic-bezier(0.77, 0, 0.175, 1)`) — symmetric transitions: tab switches, theme toggles, value tweens that need to feel reversible.
- **ease-drawer** (`cubic-bezier(0.32, 0.72, 0, 1)`) — bottom-sheets, drawers, anything sliding from an edge. Snappy at the start, gentle at the rest.

Duration scale: 120ms for micro-interactions (button press, hover), 180ms for standard component entrances, 250ms for modals and page transitions, 600ms reserved for first-paint hero moments and the foil shimmer. Anything longer than 250ms in routine UI is a smell.

`prefers-reduced-motion` is **respected globally** — animations collapse to near-instant (0.01ms) and the foil shimmer halts. The motion system is a treat, not a tax.

## Iconography & Imagery

Icons are line-style at 2px stroke, rounded line-caps, 16px default in dense UI and 20–24px in navigation and heroes. They are functional, not decorative — every icon sits next to a label except in unambiguous toolbar contexts (back, close, search).

Imagery is two-tier:

- **User photographs** (lawn journal entries, before/after comparisons) are presented as-is, in their native aspect ratios, with rounded 12px corners and no filters. The user's lawn is the hero; the design system steps back.
- **Decorative illustrations** (seasonal heroes, empty states) lean warm and hand-drawn. They are never stock photography.

The PWA icon is a rounded-square gradient in the brand greens. The favicon mirrors it.

## Accessibility & Inclusivity

- **Tap targets** are 44×44 minimum on primary surfaces; 40×40 is acceptable in dense desktop toolbars where pointer precision is assumed.
- **Focus-visible** rings are mandatory on every interactive element, 2px primary green at 2px offset. Keyboard navigation is a first-class path through the entire app.
- **Color contrast** meets WCAG AA at minimum for body text and 3:1 for large text and UI components, in both themes. Lawn-status colors pass on their paired surfaces.
- **Color is never the only signal.** Status communicates with icon + label + color, charts with shape + color.
- **Reduced-motion** is honored. Reduced-data and offline states have explicit fallbacks.
- **A skip-to-content link** is the first focusable element on every page.
- **Form errors** use the destructive token plus an inline message — never a red border alone.

## Voice in UI Copy

Friendly, second-person, plain English. Short. Encouraging without saccharine.

- ✅ "Log a watering."
- ❌ "Submit hydration record."
- ✅ "Your lawn's resting. Mow next week."
- ❌ "Mowing operation deferred per dormancy heuristic."
- ✅ "Where's your lawn?"
- ❌ "Please specify your geolocation to proceed."

Buttons are verbs. Empty states explain what would be there and how to start. Errors blame the situation, not the user. Numbers are formatted with units inline ("1.2 in" not "1.2"). Seasonal copy can lean a touch poetic in heroes, but never in form labels.

## Do's and Don'ts

**Do**

- Use one primary green action per screen.
- Let cards breathe — generous padding, comfortable gutters.
- Pair every color signal with shape, icon, or label.
- Let the user's photos be the loudest thing on the page.
- Respect reduced-motion globally, not per-component.

**Don't**

- Don't introduce a fourth color family. The system is forest, cream, gold, plus four lawn-status tones — and that's the brief.
- Don't use pure black or pure white in either theme.
- Don't slide modals from the top, and don't bounce on entrance.
- Don't carry meaning in color alone.
- Don't use shadows to fake hard borders, or borders to fake shadows.

## When to Break the Rules

- **Hero animations** on first paint may exceed the 250ms ceiling — a 600ms ease-out for the seasonal headline reveal is permitted, exactly once per route.
- **Stat dashboards** may use the numeric-stat token at sizes larger than headline-md if column alignment requires it. Tabular figures are the discipline that earns the size.
- **Collector / achievement screens** are the one approved space for a flourish — foil shimmer, gentle scale on hover, a touch more saturation. Treat them like the inside of the dust jacket: surprising, brief, optional.
- **Print views** discard shadows, backgrounds, and decorative imagery in favor of legibility. The design system steps aside for the page.

In every other case: defer to the system.
