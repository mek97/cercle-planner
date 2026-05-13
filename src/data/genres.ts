import type { Genre, GenreKey } from "./types";
import { C } from "./colors";

export const GENRES: Record<GenreKey, Genre> = {
  techno:      { label: "Techno",         color: C.g.techno },
  melodic:     { label: "Melodic Techno", color: C.g.melodic },
  house:       { label: "House",          color: C.g.house },
  deep:        { label: "Deep House",     color: C.g.deep },
  organic:     { label: "Organic House",  color: C.g.organic },
  downtempo:   { label: "Downtempo",      color: C.g.downtempo },
  progressive: { label: "Progressive",    color: C.g.progressive },
  electronica: { label: "Electronica",    color: C.g.electronica },
  bass:        { label: "Bass / Garage",  color: C.g.bass },
  hardtechno:  { label: "Hard Techno",    color: C.g.hardtechno },
  frenchhouse: { label: "French House",   color: C.g.frenchhouse },
};

export const DAY_LABEL = {
  fri: "Fri · May 22",
  sat: "Sat · May 23",
  sun: "Sun · May 24",
} as const;

export const DAY_ACCENT = {
  fri: C.fri,
  sat: C.sat,
  sun: C.sun,
} as const;

export const DAY_FULL = {
  fri: "Friday",
  sat: "Saturday",
  sun: "Sunday",
} as const;

// Note: real set times now live in src/data/schedule.ts (single source of truth).
