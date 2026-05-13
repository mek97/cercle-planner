// Official Cercle Festival 2026 afterparties.
// Different venues, different vibes, different DJs from the main lineup.
// Source: official festival programming.

import type { Day } from "./types";

export interface AfterpartyDj {
  name: string;
  vinyl?: boolean;          // [Vinyl] tag
  b2bWith?: string;         // name of b2b partner if applicable
  artistId?: string;        // link to main lineup artist id if same person
}

export interface Afterparty {
  id: string;
  day: Day;
  venue: string;
  venueNote?: string;       // for collabs like "× Imagine Family"
  start: string;            // "23:00" — same-night
  end: string;              // "07:00" or "09:00" — next morning
  lineup: AfterpartyDj[];
}

export const AFTERPARTIES: Afterparty[] = [
  {
    id: "fri-mia-mao",
    day: "fri",
    venue: "Mia Mao",
    start: "23:00",
    end: "07:00",
    lineup: [
      { name: "Bousti", vinyl: true },
      { name: "Denis Sulta" },
      { name: "Anfisa Letyago", artistId: "anfisa-letyago" },
      { name: "Agathe Mougin" },
    ],
  },
  {
    id: "sat-mia-mao",
    day: "sat",
    venue: "Mia Mao",
    start: "23:00",
    end: "07:00",
    lineup: [
      { name: "Ethel", vinyl: true },
      { name: "DJ Tennis", artistId: "lp-dj-tennis", b2bWith: "Jimi Jules" },
      { name: "Jimi Jules", artistId: "jimi-jules", b2bWith: "DJ Tennis" },
      { name: "Didi Han" },
    ],
  },
  {
    id: "sat-km25",
    day: "sat",
    venue: "Kilomètre 25",
    start: "23:00",
    end: "09:00",
    lineup: [
      { name: "Dish Dash" },
      { name: "Henri Bergmann" },
      { name: "Notre Dame" },
      { name: "Matisa" },
    ],
  },
  {
    id: "sun-mia-mao",
    day: "sun",
    venue: "Mia Mao",
    venueNote: "× Imagine Family",
    start: "23:00",
    end: "07:00",
    lineup: [
      { name: "Pastel", vinyl: true },
      { name: "Charonne", vinyl: true },
      { name: "Âme DJ", artistId: "ame-sama" },
      { name: "Abi", vinyl: true },
    ],
  },
];

export function afterpartiesForDay(day: Day): Afterparty[] {
  return AFTERPARTIES.filter(p => p.day === day);
}
