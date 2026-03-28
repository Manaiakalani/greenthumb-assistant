import { lazy, Suspense } from "react";
import { Toaster } from "@/components/ui/sonner";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { ThemeProvider } from "next-themes";
import { AnimatePresence, MotionConfig } from "framer-motion";
import { ProfileProvider } from "@/context/ProfileContext";
import { ErrorBoundary } from "@/components/ErrorBoundary";
import { useSeasonalTheme } from "@/hooks/useSeasonalTheme";
import Index from "@/pages/Index";
import NotFound from "@/pages/NotFound";

const Profile = lazy(() => import("@/pages/Profile"));
const Journal = lazy(() => import("@/pages/Journal"));
const Photos = lazy(() => import("@/pages/Photos"));
const Tools = lazy(() => import("@/pages/Tools"));
const Achievements = lazy(() => import("@/pages/Achievements"));
const Gallery = lazy(() => import("@/pages/Gallery"));
const SoilPlan = lazy(() => import("@/pages/SoilPlan"));

const queryClient = new QueryClient();

const LazyFallback = () => (
  <div className="min-h-screen flex items-center justify-center text-muted-foreground">
    Loading…
  </div>
);

function AnimatedRoutes() {
  const location = useLocation();
  useSeasonalTheme();
  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route path="/" element={<Index />} />
        <Route path="/profile" element={<Suspense fallback={<LazyFallback />}><Profile /></Suspense>} />
        <Route path="/journal" element={<Suspense fallback={<LazyFallback />}><Journal /></Suspense>} />
        <Route path="/photos" element={<Suspense fallback={<LazyFallback />}><Photos /></Suspense>} />
        <Route path="/tools" element={<Suspense fallback={<LazyFallback />}><Tools /></Suspense>} />
        <Route path="/achievements" element={<Suspense fallback={<LazyFallback />}><Achievements /></Suspense>} />
        <Route path="/gallery" element={<Suspense fallback={<LazyFallback />}><Gallery /></Suspense>} />
        <Route path="/plan" element={<Suspense fallback={<LazyFallback />}><SoilPlan /></Suspense>} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </AnimatePresence>
  );
}

const App = () => (
  <ErrorBoundary>
  <QueryClientProvider client={queryClient}>
    <MotionConfig reducedMotion="user">
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
    <ProfileProvider>
      {/* Skip-to-content link — first focusable element (WCAG 2.4.1) */}
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:top-2 focus:left-2 focus:z-[100] focus:rounded-md focus:bg-primary focus:px-4 focus:py-2 focus:text-primary-foreground focus:text-sm focus:font-medium focus:shadow-lg"
      >
        Skip to main content
      </a>
      <Toaster />
      <BrowserRouter>
        <AnimatedRoutes />
      </BrowserRouter>
    </ProfileProvider>
    </ThemeProvider>
    </MotionConfig>
  </QueryClientProvider>
  </ErrorBoundary>
);

export default App;
