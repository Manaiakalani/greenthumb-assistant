import { motion } from "motion/react";
import { Link } from "react-router-dom";
import { Shield, MapPin, HardDrive, Cloud, ArrowLeft } from "lucide-react";
import { AppHeader } from "@/components/AppHeader";
import { BottomNav } from "@/components/BottomNav";

export default function Privacy() {
  return (
    <div className="min-h-screen bg-background pb-24">
      <AppHeader />
      <main id="main-content" className="max-w-2xl mx-auto px-4 pt-6">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          <Link
            to="/"
            className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-primary transition-colors mb-6"
          >
            <ArrowLeft aria-hidden="true" className="h-4 w-4" />
            Back to Dashboard
          </Link>

          <div className="flex items-center gap-3 mb-6">
            <Shield aria-hidden="true" className="h-7 w-7 text-primary" />
            <h1 className="font-display text-2xl font-bold text-foreground">Privacy Policy</h1>
          </div>

          <p className="text-sm text-muted-foreground mb-8">
            Last updated: {new Date().toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}
          </p>

          <div className="space-y-8">
            {/* Overview */}
            <section>
              <h2 className="font-display text-lg font-semibold text-foreground mb-3">Overview</h2>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Grasswise is a client-side lawn care assistant. Your data stays on your device — we do not
                operate servers that collect, store, or process your personal information. This policy
                explains what data the app accesses and how it is used.
              </p>
            </section>

            {/* Location Data */}
            <section className="rounded-xl border border-border bg-card p-5">
              <div className="flex items-center gap-2.5 mb-3">
                <MapPin aria-hidden="true" className="h-5 w-5 text-primary" />
                <h2 className="font-display text-base font-semibold text-foreground">Location Data</h2>
              </div>
              <div className="space-y-3 text-sm text-muted-foreground leading-relaxed">
                <p>
                  <strong className="text-foreground">What we access:</strong> When you tap "Use my location,"
                  the app requests your approximate geographic coordinates via the browser Geolocation API.
                </p>
                <p>
                  <strong className="text-foreground">How it's used:</strong> Your coordinates are sent directly
                  to the <a href="https://open-meteo.com" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">Open-Meteo</a> weather
                  API to fetch local weather conditions and soil temperature. The request goes from your
                  browser to Open-Meteo's servers — Grasswise has no intermediary server.
                </p>
                <p>
                  <strong className="text-foreground">Storage:</strong> Your last-known coordinates are cached
                  in your browser's <code className="bg-muted px-1 py-0.5 rounded text-xs">localStorage</code> so
                  the app can display weather without re-prompting. You can clear this data at any time by
                  clearing your browser storage or revoking location permissions.
                </p>
                <p>
                  <strong className="text-foreground">Third-party:</strong> Open-Meteo is an open-source weather
                  API. Their privacy policy is available at{" "}
                  <a href="https://open-meteo.com/en/terms" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">
                    open-meteo.com/en/terms
                  </a>.
                </p>
              </div>
            </section>

            {/* Local Storage */}
            <section className="rounded-xl border border-border bg-card p-5">
              <div className="flex items-center gap-2.5 mb-3">
                <HardDrive aria-hidden="true" className="h-5 w-5 text-primary" />
                <h2 className="font-display text-base font-semibold text-foreground">Local Storage</h2>
              </div>
              <div className="space-y-3 text-sm text-muted-foreground leading-relaxed">
                <p>
                  Grasswise stores all app data in your browser's <code className="bg-muted px-1 py-0.5 rounded text-xs">localStorage</code>.
                  This includes:
                </p>
                <ul className="list-disc list-inside space-y-1 ml-2">
                  <li>Your lawn profile (grass type, zone, region, location)</li>
                  <li>Journal entries and weekly goals</li>
                  <li>Photo references</li>
                  <li>Achievements and progress</li>
                  <li>Theme preference (light/dark)</li>
                  <li>Onboarding completion status</li>
                  <li>Cached geolocation coordinates</li>
                </ul>
                <p>
                  This data <strong className="text-foreground">never leaves your device</strong>. It is not
                  sent to any server, analytics service, or third party. You can delete all stored data by
                  clearing your browser's site data for this domain.
                </p>
              </div>
            </section>

            {/* PWA & Offline */}
            <section className="rounded-xl border border-border bg-card p-5">
              <div className="flex items-center gap-2.5 mb-3">
                <Cloud aria-hidden="true" className="h-5 w-5 text-primary" />
                <h2 className="font-display text-base font-semibold text-foreground">PWA & Offline Access</h2>
              </div>
              <div className="space-y-3 text-sm text-muted-foreground leading-relaxed">
                <p>
                  Grasswise is a Progressive Web App (PWA). When installed, a service worker caches app
                  assets for offline use. Weather data is cached briefly (up to 1 hour) for offline access.
                </p>
                <p>
                  The service worker does not track your activity or send data to external servers. You can
                  uninstall the PWA and clear the service worker cache at any time through your browser settings.
                </p>
              </div>
            </section>

            {/* No Tracking */}
            <section>
              <h2 className="font-display text-lg font-semibold text-foreground mb-3">Analytics & Tracking</h2>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Grasswise does <strong className="text-foreground">not</strong> use cookies, analytics,
                advertising trackers, or any third-party tracking scripts. There are no user accounts,
                no sign-up, and no data collection.
              </p>
            </section>

            {/* Children */}
            <section>
              <h2 className="font-display text-lg font-semibold text-foreground mb-3">Children's Privacy</h2>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Grasswise does not knowingly collect any personal information from children. The app
                stores data only on the local device and makes no outbound data transfers beyond the
                weather API request.
              </p>
            </section>

            {/* Changes */}
            <section>
              <h2 className="font-display text-lg font-semibold text-foreground mb-3">Changes to This Policy</h2>
              <p className="text-sm text-muted-foreground leading-relaxed">
                If this policy is updated, the revision date at the top of this page will be changed.
                Continued use of the app after changes constitutes acceptance of the updated policy.
              </p>
            </section>

            {/* Contact */}
            <section className="pb-4">
              <h2 className="font-display text-lg font-semibold text-foreground mb-3">Contact</h2>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Questions about this privacy policy? Open an issue on the{" "}
                <a
                  href="https://github.com/Manaiakalani/greenthumb-assistant"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary hover:underline"
                >
                  GitHub repository
                </a>.
              </p>
            </section>
          </div>
        </motion.div>
      </main>
      <BottomNav />
    </div>
  );
}
