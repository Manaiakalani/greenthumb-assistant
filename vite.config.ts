import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import { VitePWA } from "vite-plugin-pwa";
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
  ],
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          'vendor-react': ['react', 'react-dom', 'react-router-dom'],
          'vendor-charts': ['recharts'],
          'vendor-motion': ['motion'],
          'vendor-query': ['@tanstack/react-query'],
          'vendor-ui': ['lucide-react', 'sonner', 'next-themes'],
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
