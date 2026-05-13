// Single source of truth for palette colors as hex strings.
// CSS variables in src/styles/globals.css mirror these for CSS use.
// JS / SVG / Recharts use these literals directly so colors render correctly
// in `fill` and `stroke` SVG attributes (where CSS vars can't be resolved).

export const C = {
  // canvas
  bg0:  "#07060f",
  bg1:  "#0c0b18",
  bg2:  "#131124",
  bg3:  "#1c1934",

  // ink
  ink:      "#fbf7ee",
  inkDim:   "#cdc6b8",
  inkMute:  "#807a6a",
  inkFaint: "#4f4a3f",

  // lines
  line:        "rgba(251, 247, 238, 0.07)",
  lineStrong:  "rgba(251, 247, 238, 0.16)",
  lineBright:  "rgba(251, 247, 238, 0.28)",

  // day accents — festival sunset
  fri:    "#ffb86b",
  sat:    "#ff5d8a",
  sun:    "#b18cff",
  accent: "#4dd2ff",
  gold:   "#ffd166",

  // genre palette
  g: {
    techno:       "#ff3b66",
    melodic:      "#c084fc",
    house:        "#ffd166",
    deep:         "#38d4ff",
    organic:      "#9ce37d",
    downtempo:    "#5eead4",
    progressive:  "#ff8fb1",
    electronica:  "#8b91ff",
    bass:         "#ff9747",
    hardtechno:   "#ff2e63",
    frenchhouse:  "#ffb84d",
  },
} as const;

export type Hex = string;
