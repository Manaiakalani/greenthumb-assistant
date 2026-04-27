import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import { VitePWA } from "vite-plugin-pwa";
import { compression } from "vite-plugin-compression2";
import path from "path";

// https://vitejs.dev/config/
export default defineConfig({
  server: {
    host: "::",
    port: 8080,
    hmr: {
      overlay: false,
    },
  },
  plugins: [
    react(),
    VitePWA({
      registerType: "autoUpdate",
      includeAssets: ["favicon.ico", "favicon.svg", "icon-192.png", "icon-512.png"],
      manifest: {
        name: "Grasswise",
        short_name: "Grasswise",
        description: "Smart, location-aware lawn care guidance. Know what to do, when to do it.",
        start_url: "/",
        display: "standalone",
        background_color: "#f9f8f4",
        theme_color: "#2c7a4a",
        orientation: "portrait-primary",
        categories: ["lifestyle", "weather", "utilities"],
        icons: [
          { src: "/favicon.ico", sizes: "32x32", type: "image/x-icon" },
          { src: "/icon-192.png", sizes: "192x192", type: "image/png", purpose: "any maskable" },
          { src: "/icon-512.png", sizes: "512x512", type: "image/png", purpose: "any maskable" },
          { src: "/favicon.svg", sizes: "any", type: "image/svg+xml" },
        ],
        shortcuts: [
          { name: "Journal", short_name: "Journal", url: "/journal", icons: [{ src: "/icon-192.png", sizes: "192x192" }] },
          { name: "Photos", short_name: "Photos", url: "/photos", icons: [{ src: "/icon-192.png", sizes: "192x192" }] },
          { name: "Soil Plan", short_name: "Plan", url: "/plan", icons: [{ src: "/icon-192.png", sizes: "192x192" }] },
          { name: "Tools", short_name: "Tools", url: "/tools", icons: [{ src: "/icon-192.png", sizes: "192x192" }] },
        ],
      },
      workbox: {
        globPatterns: ["**/*.{js,css,html,ico,png,svg,webp,woff2}"],
        runtimeCaching: [
          {
            urlPattern: /^https:\/\/api\.open-meteo\.com\/.*/i,
            handler: "NetworkFirst",
            options: {
              cacheName: "weather-api",
              expiration: { maxEntries: 10, maxAgeSeconds: 60 * 60 },
            },
          },
        ],
        navigateFallback: "index.html",
        navigateFallbackDenylist: [/^\/api/],
        offlineGoogleAnalytics: false,
        cleanupOutdatedCaches: true,
      },
    }),
    // Pre-compress dist assets so nginx can serve via gzip_static (no per-request CPU).
    // Brotli skipped: official nginx:alpine image lacks ngx_brotli; gzip is the safe win.
    compression({
      algorithm: "gzip",
      threshold: 1024,
      include: [/\.(js|mjs|css|html|svg|json|webmanifest|ico)$/i],
      deleteOriginalAssets: false,
    }),
  ],
  build: {
    rollupOptions: {
      output: {
        manualChunks(id: string) {
          if (!id.includes("node_modules")) return;
          // React core — listed first so its files don't accidentally land in
          // other vendor chunks via CJS interop.
          if (
            id.includes("/react-dom/") ||
            id.includes("/react/") ||
            id.includes("/react-router/") ||
            id.includes("/react-router-dom/") ||
            id.includes("/react-is/") ||
            id.includes("/scheduler/")
          ) return "vendor-react";
          if (id.includes("/motion/") || id.includes("/framer-motion/")) return "vendor-motion";
          if (id.includes("/@tanstack/react-query/")) return "vendor-query";
          if (id.includes("/i18next") || id.includes("/react-i18next/")) return "vendor-i18n";
          if (id.includes("/@radix-ui/")) return "vendor-radix";
          if (id.includes("/lucide-react/")) return "vendor-icons";
          if (
            id.includes("/clsx/") ||
            id.includes("/tailwind-merge/") ||
            id.includes("/class-variance-authority/") ||
            id.includes("/sonner/") ||
            id.includes("/next-themes/") ||
            id.includes("/zustand/")
          ) return "vendor-utils";
          // recharts + d3 deliberately not chunked manually; rolldown's auto-split
          // attaches them to lazy chart chunks so the dashboard route never loads them.
        },
      },
    },
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
});
