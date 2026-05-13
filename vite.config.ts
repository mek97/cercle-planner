import { defineConfig, type Plugin } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import path from "node:path";

// GitHub Pages serves the site from https://<user>.github.io/<repo>/, so the
// bundle has to reference assets via a matching sub-path. The deploy workflow
// passes VITE_BASE=/<repo>/; locally we keep relative paths so `npm run dev`
// and `npm run preview` work as before.
const base = process.env.VITE_BASE ?? "./";

// Vite injects `crossorigin` on the generated <script> and <link> tags, which
// forces a CORS check on assets that are always loaded same-origin in our
// deployment (GitHub Pages). Strip it so Safari doesn't waste a preflight and
// doesn't surface masked-URL errors for our own scripts.
const stripSameOriginCrossOrigin = (): Plugin => ({
  name: "strip-same-origin-crossorigin",
  enforce: "post",
  transformIndexHtml(html) {
    return html
      .replace(/(<script\b[^>]*?)\s+crossorigin\b/gi, "$1")
      .replace(/(<link\b[^>]*?)\s+crossorigin\b/gi, "$1");
  },
});

export default defineConfig({
  plugins: [react(), tailwindcss(), stripSameOriginCrossOrigin()],
  base,
  server: { port: 4321, open: true },
  build: { target: ["es2019", "safari13"], outDir: "dist" },
  resolve: {
    alias: { "@": path.resolve(__dirname, "./src") },
  },
});
