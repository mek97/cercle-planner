// Theme-aware color reader for SVG / Recharts attributes.
// Brand colors (day accents + genres) live in `colors.ts` and stay constant.
// Only neutrals (bg, ink, line) flip with the theme.

import { useTheme } from "@/lib/theme";
import { C } from "./colors";

const DARK_NEUTRALS = {
  bg0:  "#06050d",
  bg1:  "#0c0b18",
  bg2:  "#131124",
  ink:      "#faf6ec",
  inkDim:   "#cdc6b8",
  inkMute:  "#7d7666",
  inkFaint: "#4a443a",
  line:        "rgba(250, 246, 236, 0.06)",
  lineStrong:  "rgba(250, 246, 236, 0.14)",
  lineBright:  "rgba(250, 246, 236, 0.26)",
};

const LIGHT_NEUTRALS = {
  bg0:  "#f4f1e7",
  bg1:  "#fdfbf4",
  bg2:  "#ebe7db",
  // Stronger ink contrast on cream — the previous mute/faint tones were
  // visibly grey/washed-out on chart axes and gantt labels.
  ink:      "#14101e",
  inkDim:   "#2a2418",
  inkMute:  "#524a36",
  inkFaint: "#6b6452",
  line:        "rgba(20, 16, 30, 0.18)",
  lineStrong:  "rgba(20, 16, 30, 0.32)",
  lineBright:  "rgba(20, 16, 30, 0.46)",
};

// Slightly darkened brand palette for light mode — same hues but lower
// luminance / lower saturation so they don't scream against cream.
// Used by `useColors()` when theme is light. Genre and day accents follow
// the same compress: hot pink → maroon, neon blue → teal, etc.
const LIGHT_BRAND = {
  fri:    "#d6852f",   // was #ffb86b
  sat:    "#c93a64",   // was #ff5d8a
  sun:    "#7a5cd6",   // was #b18cff
  accent: "#1e94c8",   // was #4dd2ff
  gold:   "#a8841f",   // was #ffd166
  g: {
    techno:       "#c91f4b",
    melodic:      "#8a4dd6",
    house:        "#a8841f",
    deep:         "#1d8fbc",
    organic:      "#5fa84a",
    downtempo:    "#2da696",
    progressive:  "#c95a85",
    electronica:  "#5a64d4",
    bass:         "#cc6a1a",
    hardtechno:   "#c41848",
    frenchhouse:  "#c0851f",
  },
} as const;

// Relax literal types from `C` so the light-mode brand overrides type-check.
// Every brand colour widens to `string`; neutrals stay as-is.
type Widen<T> = T extends string ? string : { [K in keyof T]: Widen<T[K]> };
export type ChartColors = typeof DARK_NEUTRALS & Widen<typeof C>;

export function useColors(): ChartColors {
  const { theme } = useTheme();
  // Spread order matters: brand defaults first, then the theme's neutrals
  // override (they share keys like `lineStrong`, `inkDim`). If `C` came
  // last it would clobber the light-mode neutrals — silent miss that left
  // radar grid strokes rendering with dark hex on cream.
  if (theme === "light") {
    return {
      ...C,
      ...LIGHT_BRAND,
      g: { ...C.g, ...LIGHT_BRAND.g },
      ...LIGHT_NEUTRALS,
    };
  }
  return { ...C, ...DARK_NEUTRALS };
}
