import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import path from "node:path";

// GitHub Pages serves the site from https://<user>.github.io/<repo>/, so the
// bundle has to reference assets via a matching sub-path. The deploy workflow
// passes VITE_BASE=/<repo>/; locally we keep relative paths so `npm run dev`
// and `npm run preview` work as before.
const base = process.env.VITE_BASE ?? "./";

export default defineConfig({
  plugins: [react(), tailwindcss()],
  base,
  server: { port: 4321, open: true },
  build: { target: "es2022", outDir: "dist" },
  resolve: {
    alias: { "@": path.resolve(__dirname, "./src") },
  },
});
