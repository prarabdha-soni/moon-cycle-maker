// Simple Vite config for static site deployment
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import tsConfigPaths from "vite-tsconfig-paths";

export default defineConfig({
  plugins: [react(), tailwindcss(), tsConfigPaths()],
  resolve: {
    alias: {
      "@": "/src",
    },
  },
});
