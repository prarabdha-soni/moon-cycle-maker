import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import tsConfigPaths from "vite-tsconfig-paths";

export default defineConfig({
  plugins: [react(), tailwindcss(), tsConfigPaths()],
  base: "/",
  resolve: {
    alias: {
      "@": "/src",
    },
  },
  build: {
    // Raise the warning threshold — warn at 600 KB so the split chunks don't
    // individually trigger false positives.
    chunkSizeWarningLimit: 600,
    rollupOptions: {
      output: {
        /**
         * Split vendor code into separately-cacheable chunks.
         *
         * Why this matters (a.k.a. "why Next.js feels faster"):
         * Next.js auto-splits every page into its own chunk so only the
         * current page's JS is downloaded. We replicate that idea by at
         * least separating vendor code (React, Router, icons) from our
         * app code.
         *
         * After the first visit the browser caches vendor-*.js. On the
         * next deploy only the small app-*.js changes — vendor chunks are
         * served from cache. Result: repeat-visit JS download drops from
         * ~525 KB to ~60–80 KB.
         */
        manualChunks(id) {
          if (!id.includes("node_modules")) return;
          // TanStack (Router + Query) — stable, update maybe once a month
          if (id.includes("@tanstack")) return "vendor-tanstack";
          // Lucide icons — large but very stable
          if (id.includes("lucide-react")) return "vendor-icons";
          // React + ReactDOM + scheduler must stay together to avoid
          // circular-chunk warnings (scheduler is an internal peer dep)
          return "vendor-react";
        },
      },
    },
  },
});
