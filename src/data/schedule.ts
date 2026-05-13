// Official Cercle Festival 2026 timetable.
// Source: festival.cercle.io/line-up timetable image (verified set times,
// stage assignments, and durations for all 42 artists).

import type { Day } from "./types";

export type Stage = "Ariane" | "A380" | "Concorde" | "Cupola";
export type SetType = "DJ Set" | "Live" | "Set" | "b2b";

export interface ScheduleEntry {
  id: string;
  day: Day;
  stage: Stage;
  start: string; // "HH:MM" 24h
  end: string;
  setType?: SetType;
}

export interface TalkEntry {
  day: Day;
  start: string;
  end: string;
  title: string;
}

// Music stages — these populate the main schedule view.
export const STAGES: Stage[] = ["Ariane", "A380", "Concorde"];

// All four physical spaces (Cupola hosts the space-themed talks).
export const ALL_STAGES: Stage[] = ["Ariane", "A380", "Concorde", "Cupola"];

export const STAGE_LABEL: Record<Stage, string> = {
  Ariane: "Ariane",
  A380: "A380",
  Concorde: "Concorde",
  Cupola: "Cupola",
};

export const STAGE_TAG: Record<Stage, string> = {
  Ariane:   "Main stage · headliners",
  A380:     "Second stage",
  Concorde: "Third stage",
  Cupola:   "Conference talks · space-themed",
};

export const SCHEDULE: ScheduleEntry[] = [
  // ─── Friday May 22 ───
  { id: "rodrigo-gallardo", day: "fri", stage: "Ariane",   start: "12:30", end: "15:00" },
  { id: "acid-pauli",       day: "fri", stage: "Ariane",   start: "15:00", end: "17:00" },
  { id: "enfant-sauvage",   day: "fri", stage: "Ariane",   start: "17:00", end: "18:30" },
  { id: "mind-against",     day: "fri", stage: "Ariane",   start: "18:30", end: "20:30" },
  { id: "adriatique",       day: "fri", stage: "Ariane",   start: "20:30", end: "23:00" },
  { id: "berlioz",          day: "fri", stage: "A380",     start: "14:00", end: "16:30", setType: "DJ Set" },
  { id: "carlita",          day: "fri", stage: "A380",     start: "16:30", end: "18:30" },
  { id: "sammy-virji",      day: "fri", stage: "A380",     start: "18:30", end: "20:30" },
  { id: "kerri-chandler",   day: "fri", stage: "A380",     start: "20:30", end: "22:30" },
  { id: "marten-lou",       day: "fri", stage: "Concorde", start: "15:00", end: "17:00" },
  { id: "kilimanjaro",      day: "fri", stage: "Concorde", start: "17:00", end: "19:00" },
  { id: "arodes",           day: "fri", stage: "Concorde", start: "19:00", end: "20:30" },
  { id: "anna",             day: "fri", stage: "Concorde", start: "20:30", end: "22:00" },

  // ─── Saturday May 23 ───
  { id: "parra",            day: "sat", stage: "Ariane",   start: "12:30", end: "14:00" },
  { id: "lane8",            day: "sat", stage: "Ariane",   start: "14:00", end: "16:00" },
  { id: "kolsch",           day: "sat", stage: "Ariane",   start: "16:00", end: "18:00" },
  { id: "michael-bibi",     day: "sat", stage: "Ariane",   start: "18:00", end: "21:00" },
  { id: "monolink",         day: "sat", stage: "Ariane",   start: "21:15", end: "23:00" },
  { id: "kasablanca",       day: "sat", stage: "A380",     start: "14:00", end: "15:30" },
  { id: "etienne",          day: "sat", stage: "A380",     start: "15:30", end: "17:00" },
  { id: "vintage-culture",  day: "sat", stage: "A380",     start: "17:00", end: "18:30" },
  { id: "artbat",           day: "sat", stage: "A380",     start: "18:30", end: "21:00" },
  { id: "anfisa-letyago",   day: "sat", stage: "A380",     start: "21:00", end: "22:30" },
  { id: "ginton",           day: "sat", stage: "Concorde", start: "13:00", end: "15:00" },
  { id: "kenya-grace",      day: "sat", stage: "Concorde", start: "15:00", end: "16:00" },
  { id: "lp-dj-tennis",     day: "sat", stage: "Concorde", start: "16:00", end: "19:00", setType: "b2b" },
  { id: "jimi-jules",       day: "sat", stage: "Concorde", start: "19:00", end: "22:00" },

  // ─── Sunday May 24 ───
  { id: "yotto",            day: "sun", stage: "Ariane",   start: "12:00", end: "14:30" },
  { id: "nimino",           day: "sun", stage: "Ariane",   start: "14:30", end: "16:30", setType: "DJ Set" },
  { id: "thylacine",        day: "sun", stage: "Ariane",   start: "16:30", end: "18:00" },
  { id: "ben-bohmer",       day: "sun", stage: "Ariane",   start: "18:00", end: "19:30" },
  { id: "miss-monique",     day: "sun", stage: "Ariane",   start: "19:30", end: "21:30" },
  { id: "eric-prydz",       day: "sun", stage: "Ariane",   start: "21:30", end: "23:00" },
  { id: "meera",            day: "sun", stage: "A380",     start: "14:00", end: "16:00" },
  { id: "royksopp",         day: "sun", stage: "A380",     start: "16:00", end: "17:30", setType: "DJ Set" },
  { id: "ame-sama",         day: "sun", stage: "A380",     start: "17:30", end: "19:30", setType: "b2b" },
  { id: "anetha",           day: "sun", stage: "A380",     start: "19:30", end: "21:00" },
  { id: "funk-tribu",       day: "sun", stage: "A380",     start: "21:00", end: "22:30" },
  { id: "deer-jade",        day: "sun", stage: "Concorde", start: "13:00", end: "15:30" },
  { id: "weval",            day: "sun", stage: "Concorde", start: "15:30", end: "17:00", setType: "Live" },
  { id: "aaron-hibell",     day: "sun", stage: "Concorde", start: "17:00", end: "20:00", setType: "DJ Set" },
  { id: "mahmut-orhan",     day: "sun", stage: "Concorde", start: "20:00", end: "22:00" },
];

// ──────────────────────────────────────────────
// Cupola conference talks (space-themed programming)
// 30-minute slots, separate from the music stages.
// ──────────────────────────────────────────────
export const TALKS: TalkEntry[] = [
  // ── Friday ──
  { day: "fri", start: "15:00", end: "15:30", title: "I Met An Alien?" },
  { day: "fri", start: "15:30", end: "16:00", title: "The Fifth Element" },
  { day: "fri", start: "16:00", end: "16:30", title: "Sonic Journey Through the Solar System" },
  { day: "fri", start: "17:00", end: "17:30", title: "The 2026 Golden Records" },

  // ── Saturday ──
  { day: "sat", start: "14:00", end: "14:30", title: "Sounds of Ariane 6" },
  { day: "sat", start: "15:00", end: "15:30", title: "Flavours of Space" },
  { day: "sat", start: "16:00", end: "16:30", title: "Sonic Journey Through the Solar System" },
  { day: "sat", start: "17:00", end: "17:30", title: "Train Like an Astronaut" },
  { day: "sat", start: "18:00", end: "18:30", title: "The 2026 Golden Records" },

  // ── Sunday ──
  { day: "sun", start: "14:00", end: "14:30", title: "The 2026 Golden Records" },
  { day: "sun", start: "15:00", end: "15:30", title: "Cercle Festival on Mars" },
  { day: "sun", start: "16:00", end: "16:30", title: "Exploring Space and Sound" },
  { day: "sun", start: "17:00", end: "17:30", title: "Asteroid Alert: When Fiction Becomes Reality" },
  { day: "sun", start: "18:00", end: "18:30", title: "Sonic Journey Through the Solar System" },
];

export function talksForDay(day: Day): TalkEntry[] {
  return TALKS.filter(t => t.day === day).sort((a, b) => timeToMin(a.start) - timeToMin(b.start));
}

// ──────────────────────────────────────────────
// Helpers
// ──────────────────────────────────────────────
const byId = new Map(SCHEDULE.map(s => [s.id, s]));

export function getEntry(id: string): ScheduleEntry | undefined {
  return byId.get(id);
}

export function timeToMin(t: string): number {
  const [h, m] = t.split(":").map(Number);
  return h * 60 + m;
}

export function minToTime(min: number): string {
  const h = Math.floor(min / 60);
  const m = min % 60;
  return `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}`;
}

export function durationMin(entry: ScheduleEntry): number {
  return timeToMin(entry.end) - timeToMin(entry.start);
}

// Display range for the time axis — covers every day's earliest start
// (12:00) and latest end (23:00).
export const DAY_START_H = 12;
export const DAY_END_H = 23.25;   // a hair past 23:00 so 23:00 marks fit
export const DAY_START_MIN = DAY_START_H * 60;
export const DAY_END_MIN = DAY_END_H * 60;
export const DAY_RANGE_MIN = DAY_END_MIN - DAY_START_MIN;

export function leftPct(t: string): number {
  return ((timeToMin(t) - DAY_START_MIN) / DAY_RANGE_MIN) * 100;
}

export function widthPct(start: string, end: string): number {
  return ((timeToMin(end) - timeToMin(start)) / DAY_RANGE_MIN) * 100;
}

// Two entries overlap in time AND happen on the same day on different stages.
export function overlaps(a: ScheduleEntry, b: ScheduleEntry): boolean {
  if (a.day !== b.day || a.stage === b.stage) return false;
  return timeToMin(a.start) < timeToMin(b.end) && timeToMin(b.start) < timeToMin(a.end);
}

// For a set of picked ids, return a map of id → list of conflicting ids
export function findConflicts(pickedIds: Iterable<string>): Map<string, string[]> {
  const conflicts = new Map<string, string[]>();
  const entries = [...pickedIds].map(id => byId.get(id)).filter(Boolean) as ScheduleEntry[];
  for (let i = 0; i < entries.length; i++) {
    for (let j = i + 1; j < entries.length; j++) {
      if (overlaps(entries[i], entries[j])) {
        const a = entries[i].id, b = entries[j].id;
        if (!conflicts.has(a)) conflicts.set(a, []);
        if (!conflicts.has(b)) conflicts.set(b, []);
        conflicts.get(a)!.push(b);
        conflicts.get(b)!.push(a);
      }
    }
  }
  return conflicts;
}

// For a set of picked ids, return a map of pickedId → list of cross-stage
// alternates (unpicked entries playing at the same time on different stages).
// Lets us tell the user "instead of X you could also catch Y".
export function findAlternates(pickedIds: Iterable<string>): Map<string, string[]> {
  const alts = new Map<string, string[]>();
  const pickedEntries = [...pickedIds].map(id => byId.get(id)).filter(Boolean) as ScheduleEntry[];
  for (const picked of pickedEntries) {
    const list: string[] = [];
    for (const candidate of SCHEDULE) {
      if (candidate.id === picked.id) continue;
      if (pickedEntries.some(p => p.id === candidate.id)) continue;
      if (overlaps(picked, candidate)) list.push(candidate.id);
    }
    if (list.length > 0) alts.set(picked.id, list);
  }
  return alts;
}

// Set of every entry-id that is an alternate (unpicked, overlaps SOME picked entry).
// Convenient for highlighting in the schedule.
export function findAlternateIds(pickedIds: Iterable<string>): Set<string> {
  const out = new Set<string>();
  const pickedEntries = [...pickedIds].map(id => byId.get(id)).filter(Boolean) as ScheduleEntry[];
  if (pickedEntries.length === 0) return out;
  const pickedSet = new Set(pickedEntries.map(e => e.id));
  for (const candidate of SCHEDULE) {
    if (pickedSet.has(candidate.id)) continue;
    if (pickedEntries.some(p => overlaps(p, candidate))) out.add(candidate.id);
  }
  return out;
}

// Get all entries for a day, sorted by stage order then start time
export function entriesForDay(day: Day): ScheduleEntry[] {
  return SCHEDULE
    .filter(e => e.day === day)
    .sort((a, b) =>
      STAGES.indexOf(a.stage) - STAGES.indexOf(b.stage) ||
      timeToMin(a.start) - timeToMin(b.start)
    );
}

// Hour markers shown on the time axis: 12, 13, 14, … 23.
export const HOUR_MARKS = Array.from(
  { length: Math.floor(DAY_END_H - DAY_START_H) + 1 },
  (_, i) => DAY_START_H + i,
);
