// New quiz schema — multi-modal questions, weighted answers, per-answer intensity.
// Designed against music-personality research (Russell's affect circumplex valence×arousal;
// Rentfrow's MUSIC model) and the festival's actual mood/BPM axes.

import type { Artist, GenreKey, MoodKey, PersonaKey } from "./types";

export type Intensity = 1 | 2 | 3;  // lightly · firmly · absolutely

export type MoodDelta = Partial<Record<MoodKey, number>>;
export type PersonaDelta = Partial<Record<PersonaKey, number>>;

export interface OptionContribution {
  mood?: MoodDelta;          // contribution to ideal mood vector
  persona?: PersonaDelta;    // contribution to persona scores
  bpm?: [number, number];    // contribution to preferred bpm range (averaged)
  genres?: GenreKey[];       // affinity to specific genres
}

interface BaseQuestion {
  id: string;
  prompt: string;
  helper?: string;
}

export interface SingleQuestion extends BaseQuestion {
  kind: "single";
  options: {
    label: string;
    sublabel?: string;
    contrib: OptionContribution;
  }[];
}

export interface SliderQuestion extends BaseQuestion {
  kind: "slider";
  min: number;
  max: number;
  step: number;
  defaultValue: number;
  unit?: string;
  startLabel: string;
  endLabel: string;
  // map a normalized 0..1 value to a contribution
  contribAt: (v01: number) => OptionContribution;
}

export interface RankQuestion extends BaseQuestion {
  kind: "rank";
  maxPicks: number;
  options: {
    key: string;
    label: string;
    sublabel?: string;
    contrib: OptionContribution; // weight scaled by rank (1st=3x, 2nd=2x, 3rd=1x)
  }[];
}

export type Question = SingleQuestion | SliderQuestion | RankQuestion;

// ──────────────────────────────────────────────────────────────
// THE QUESTIONS — 7 thoughtful, each designed to extract a clear
// signal about a different musical dimension.
// ──────────────────────────────────────────────────────────────
export const QUIZ_V2: Question[] = [
  {
    id: "moment",
    kind: "single",
    prompt: "Pick the moment that defines a perfect set.",
    helper: "Different sets are built around different moments.",
    options: [
      {
        label: "A long hypnotic build before the drop",
        sublabel: "patient, slow-rising, payoff-driven",
        contrib: {
          mood: { hypnotic: 4, emotional: 3, danceable: 2 },
          persona: { voyager: 3, dreamer: 2 },
        },
      },
      {
        label: "The 4am hands-up peak with a hard kick",
        sublabel: "relentless, sweaty, vertical",
        contrib: {
          mood: { gritty: 4, danceable: 5, euphoric: 3 },
          persona: { raver: 4 },
        },
      },
      {
        label: "The sunrise set — ambient, reverberant, soft",
        sublabel: "tearful, washed-out, ceremonial",
        contrib: {
          mood: { dreamy: 5, emotional: 4, hypnotic: 3 },
          persona: { dreamer: 3, voyager: 2 },
        },
      },
      {
        label: "The 11pm groove that makes everyone dance together",
        sublabel: "joyful, physical, shared",
        contrib: {
          mood: { danceable: 5, euphoric: 4, emotional: 2 },
          persona: { groover: 4 },
        },
      },
      {
        label: "A guitar riff or live vocal piercing the synths",
        sublabel: "human, melodic, song-like",
        contrib: {
          mood: { emotional: 4, dreamy: 3, euphoric: 3 },
          persona: { fluidic: 3, wanderer: 2 },
        },
      },
    ],
  },
  {
    id: "bpm",
    kind: "single",
    prompt: "How fast should the night feel?",
    helper: "No need to know BPM — pick the vibe and we'll match the tempo.",
    options: [
      {
        label: "Slow & deep",
        sublabel: "breathy, sub-bass, downtempo · ~95–115 BPM",
        contrib: { bpm: [95, 115], persona: { voyager: 3, dreamer: 2 }, mood: { dreamy: 3, hypnotic: 2 } },
      },
      {
        label: "Steady groove",
        sublabel: "head-nod house tempo · ~115–125 BPM",
        contrib: { bpm: [115, 125], persona: { groover: 3, fluidic: 1 }, mood: { danceable: 3 } },
      },
      {
        label: "Driving & melodic",
        sublabel: "peak-hour, full dancefloor · ~125–135 BPM",
        contrib: { bpm: [125, 135], persona: { fluidic: 3, dreamer: 1 }, mood: { euphoric: 3, hypnotic: 2 } },
      },
      {
        label: "Fast & hard",
        sublabel: "techno, trance, relentless · ~135–150 BPM",
        contrib: { bpm: [135, 150], persona: { raver: 4 }, mood: { gritty: 4, danceable: 3 } },
      },
    ],
  },
  {
    id: "moods",
    kind: "rank",
    prompt: "Pick your top three feelings.",
    helper: "Tap to pick (up to 3). Tap order sets the priority — first pick matters most.",
    maxPicks: 3,
    options: [
      { key: "euphoric",   label: "Euphoric",   sublabel: "soaring, anthemic",     contrib: { mood: { euphoric: 5 },   persona: { fluidic: 2, groover: 1 } } },
      { key: "hypnotic",   label: "Hypnotic",   sublabel: "patient, locked-in",    contrib: { mood: { hypnotic: 5 },   persona: { voyager: 3 } } },
      { key: "gritty",     label: "Gritty",     sublabel: "raw, hard, physical",   contrib: { mood: { gritty: 5 },     persona: { raver: 3 } } },
      { key: "dreamy",     label: "Dreamy",     sublabel: "soft, ambient, lifted", contrib: { mood: { dreamy: 5 },     persona: { dreamer: 3 } } },
      { key: "danceable",  label: "Danceable",  sublabel: "groove-first, kinetic", contrib: { mood: { danceable: 5 },  persona: { groover: 3 } } },
      // Rebalanced: emotional resonates more with the Dreamer (sunset / strings)
      // than the Soarer (drop chaser). Was romantic:2 / dreamer:1 — flipped.
      { key: "emotional",  label: "Emotional",  sublabel: "feels-led, melodic",    contrib: { mood: { emotional: 5 },  persona: { dreamer: 2, fluidic: 1 } } },
    ],
  },
  {
    id: "discovery",
    kind: "slider",
    prompt: "Discovery dial.",
    helper: "How adventurous are you willing to be?",
    min: 0,
    max: 100,
    step: 5,
    defaultValue: 50,
    startLabel: "names I love",
    endLabel: "hidden gems",
    contribAt: (v01) => {
      // value used externally to favor lower/higher listener counts
      if (v01 < 0.33) return { persona: { fluidic: 2, groover: 1 } };
      if (v01 < 0.66) return {};
      return { persona: { voyager: 3, dreamer: 1, wanderer: 1 } };
    },
  },
  {
    id: "venue",
    kind: "single",
    prompt: "Which space feels most right?",
    helper: "Different sounds suit different rooms.",
    options: [
      {
        label: "A wide festival mainstage at sunset",
        sublabel: "big sky, big drop, big crowd",
        contrib: {
          mood: { euphoric: 4, emotional: 3 },
          persona: { fluidic: 3 },
        },
      },
      {
        label: "A dark club where bass hits your chest",
        sublabel: "low ceiling, hot, deeply physical",
        contrib: {
          mood: { gritty: 4, danceable: 4 },
          persona: { raver: 2, groover: 2 },
        },
      },
      {
        label: "A theatre with an audiovisual show",
        sublabel: "seated, immersive, cinematic",
        contrib: {
          mood: { dreamy: 4, emotional: 4, hypnotic: 3 },
          persona: { voyager: 3, dreamer: 2 },
        },
      },
      {
        label: "A campfire stage under trees",
        sublabel: "earthy, intimate, handcrafted",
        contrib: {
          mood: { dreamy: 3, emotional: 3 },
          persona: { wanderer: 4 },
          genres: ["organic", "downtempo"],
        },
      },
    ],
  },
  {
    id: "live",
    kind: "slider",
    prompt: "How important are live elements?",
    helper: "Guitar, vocals, drums, live keys — vs pure DJ selectorship.",
    min: 0,
    max: 100,
    step: 5,
    defaultValue: 50,
    startLabel: "pure DJ set",
    endLabel: "live instruments",
    contribAt: (v01) => {
      // Anthem fans love pure DJ sets too — small Soarer bump on the low end.
      if (v01 < 0.33) return { persona: { groover: 1, raver: 1, fluidic: 1 } };
      if (v01 < 0.66) return { mood: { emotional: 2 } };
      return { mood: { emotional: 4, dreamy: 2 }, persona: { dreamer: 2, wanderer: 1 }, genres: ["electronica", "organic"] };
    },
  },
  {
    id: "vocals",
    kind: "single",
    prompt: "Your relationship with vocals.",
    options: [
      {
        label: "Wordless chants, ethnic vocals, breath",
        sublabel: "voice as texture, not language",
        contrib: { mood: { dreamy: 3, emotional: 2 }, persona: { wanderer: 3, dreamer: 1 } },
      },
      {
        label: "Pop-leaning hooks I can sing along to",
        sublabel: "songwriting front and center",
        contrib: { mood: { euphoric: 4, emotional: 3 }, persona: { fluidic: 3, groover: 1 } },
      },
      {
        label: "Just texture — repeated phrases, no story",
        sublabel: "voice as another synth",
        contrib: { mood: { hypnotic: 3 }, persona: { voyager: 3, dreamer: 1 } },
      },
      {
        label: "None — vocals dilute techno",
        sublabel: "drums and bass only",
        contrib: { mood: { gritty: 3, danceable: 2 }, persona: { raver: 4 } },
      },
    ],
  },
];

// Compute the final result from answers.
export interface RawAnswer {
  questionId: string;
  // single → option index; slider → value; rank → ordered array of option keys
  value: number | string[] | number[];
  intensity: Intensity;   // user's "how strongly" multiplier
}

export interface QuizResult {
  moodVector: Record<MoodKey, number>;       // 0-5 scale
  personaScores: Record<PersonaKey, number>;
  primaryPersona: PersonaKey;
  secondaryPersona: PersonaKey;
  bpmPreference: [number, number];
  discoveryBias: number;       // 0..1 (0 = familiar, 1 = adventurous)
  genreAffinities: Partial<Record<GenreKey, number>>;
  answeredAt: number;
}

export function computeResult(answers: RawAnswer[]): QuizResult {
  const mood: Record<MoodKey, number> = {
    euphoric: 0, hypnotic: 0, gritty: 0, dreamy: 0, danceable: 0, emotional: 0,
  };
  const persona: Record<PersonaKey, number> = {
    dreamer: 0, voyager: 0, raver: 0, fluidic: 0, groover: 0, wanderer: 0,
  };
  const bpms: number[][] = [];
  const genres: Partial<Record<GenreKey, number>> = {};
  let discoveryBias = 0.5;
  let totalWeight = 0;

  function apply(c: OptionContribution, weight: number) {
    if (c.mood) for (const k in c.mood) mood[k as MoodKey] += (c.mood[k as MoodKey] || 0) * weight;
    if (c.persona) for (const k in c.persona) persona[k as PersonaKey] += (c.persona[k as PersonaKey] || 0) * weight;
    if (c.bpm) bpms.push([c.bpm[0], c.bpm[1], weight]);
    if (c.genres) c.genres.forEach(g => { genres[g] = (genres[g] || 0) + weight; });
  }

  answers.forEach(a => {
    const q = QUIZ_V2.find(x => x.id === a.questionId);
    if (!q) return;
    const w = a.intensity;
    totalWeight += w;
    if (q.kind === "single" && typeof a.value === "number") {
      apply(q.options[a.value]?.contrib || {}, w);
    } else if (q.kind === "slider" && typeof a.value === "number") {
      const v01 = (a.value - q.min) / (q.max - q.min);
      apply(q.contribAt(v01), w);
      if (q.id === "discovery") discoveryBias = v01;
    } else if (q.kind === "rank" && Array.isArray(a.value)) {
      (a.value as string[]).forEach((key, idx) => {
        const opt = q.options.find(o => o.key === key);
        if (opt) {
          const rankMult = q.maxPicks - idx; // 3 / 2 / 1
          apply(opt.contrib, w * rankMult);
        }
      });
    }
  });

  // Normalize mood vector to 0-5 scale
  const moodMax = Math.max(...Object.values(mood));
  if (moodMax > 0) {
    (Object.keys(mood) as MoodKey[]).forEach(k => { mood[k] = Math.min(5, (mood[k] / moodMax) * 5); });
  }

  // Resolve bpm preference (proper weighted average)
  let bpmLo = 115, bpmHi = 130;
  if (bpms.length > 0) {
    const ws = bpms.reduce((s, [, , w]) => s + w, 0);
    bpmLo = bpms.reduce((s, [lo, , w]) => s + lo * w, 0) / ws;
    bpmHi = bpms.reduce((s, [, hi, w]) => s + hi * w, 0) / ws;
  }

  // Top personas
  const personaSorted = (Object.entries(persona) as [PersonaKey, number][])
    .sort((a, b) => b[1] - a[1]);
  const primaryPersona = personaSorted[0]?.[0] || "dreamer";
  const secondaryPersona = personaSorted[1]?.[0] || "voyager";

  return {
    moodVector: mood,
    personaScores: persona,
    primaryPersona,
    secondaryPersona,
    bpmPreference: [Math.round(bpmLo), Math.round(bpmHi)],
    discoveryBias,
    genreAffinities: genres,
    answeredAt: Date.now(),
  };
}

// Cosine similarity between two mood vectors (1-5 scales).
export function similarity(
  user: Record<MoodKey, number>,
  artist: Record<MoodKey, number>,
): number {
  const keys: MoodKey[] = ["euphoric","hypnotic","gritty","dreamy","danceable","emotional"];
  let dot = 0, nu = 0, na = 0;
  for (const k of keys) {
    dot += user[k] * artist[k];
    nu += user[k] * user[k];
    na += artist[k] * artist[k];
  }
  if (nu === 0 || na === 0) return 0;
  return dot / (Math.sqrt(nu) * Math.sqrt(na));
}

function midpoint([lo, hi]: [number, number]): number {
  return (lo + hi) / 2;
}

function bpmFit(result: QuizResult, artist: Artist): number {
  const userMid = midpoint(result.bpmPreference);
  const artistMid = midpoint(artist.bpm);
  const distance = Math.abs(userMid - artistMid);
  return Math.max(0, 1 - distance / 35);
}

const FANBASE_DISCOVERY: Record<Artist["details"]["fanbase"], number> = {
  small: 1,
  medium: 0.74,
  "medium-large": 0.54,
  large: 0.32,
  massive: 0.08,
};

function listenerDiscoveryValue(listeners: string): number | null {
  const match = listeners.match(/~?([\d.]+)\s*([KM])/i);
  if (!match) return null;
  const value = Number(match[1]);
  const unit = match[2].toUpperCase();
  if (!Number.isFinite(value)) return null;
  const monthly = unit === "M" ? value * 1_000_000 : value * 1_000;
  const min = Math.log10(50_000);
  const max = Math.log10(5_000_000);
  const normalizedPopularity = Math.max(0, Math.min(1, (Math.log10(monthly) - min) / (max - min)));
  return 1 - normalizedPopularity;
}

function discoveryFit(result: QuizResult, artist: Artist): number {
  const fromListeners = listenerDiscoveryValue(artist.details.listeners);
  const artistDiscovery = fromListeners ?? FANBASE_DISCOVERY[artist.details.fanbase];
  return 1 - Math.abs(result.discoveryBias - artistDiscovery);
}

function genreFit(result: QuizResult, artist: Artist): number {
  const weights = result.genreAffinities;
  const total = Object.values(weights).reduce((sum, n) => sum + (n || 0), 0);
  if (total <= 0) return 0.5;
  const artistWeight = artist.genres.reduce((sum, g) => sum + (weights[g] || 0), 0);
  return Math.max(0, Math.min(1, artistWeight / total));
}

export interface RecommendationScore {
  total: number;
  mood: number;
  bpm: number;
  discovery: number;
  genre: number;
}

export function recommendationScore(result: QuizResult, artist: Artist): RecommendationScore {
  const mood = similarity(result.moodVector, artist.mood);
  const bpm = bpmFit(result, artist);
  const discovery = discoveryFit(result, artist);
  const genre = genreFit(result, artist);
  return {
    mood,
    bpm,
    discovery,
    genre,
    total: (mood * 0.62) + (bpm * 0.18) + (discovery * 0.12) + (genre * 0.08),
  };
}

// Smart match algorithm — for each day, picks the highest-scoring
// time-conflict-free subset of sets via weighted interval scheduling. This
// fills the whole day end-to-end rather than capping at N picks, so every
// contiguous time slot gets covered.
//
// Per-day algorithm:
//   1. Score every set by the blended recommendation score
//   2. Sort by end time, compute predecessor index p[i] (latest non-overlap)
//   3. DP: opt[i] = max(score[i-1] + opt[p[i-1]+1], opt[i-1])
//   4. Reconstruct → the largest-sum non-overlapping subset
//
// All scores are positive (cosine), so the DP fills the day with the best
// non-overlapping picks rather than leaving gaps.

import type { ScheduleEntry } from "./schedule";

export interface SmartMatchResult {
  ids: string[];
  alternates: string[];     // strong matches that conflicted with picks
  clashes: number;          // always 0 by construction
  byDay: { fri: number; sat: number; sun: number };
}

function tToMin(t: string): number {
  const [h, m] = t.split(":").map(Number);
  return h * 60 + m;
}

export function smartMatches(
  artists: Artist[],
  result: QuizResult,
  getScheduleEntry: (id: string) => ScheduleEntry | undefined,
  _overlaps: (a: ScheduleEntry, b: ScheduleEntry) => boolean,
  opts: { alternatesPerDay?: number } = {},
): SmartMatchResult {
  const alternatesPerDay = opts.alternatesPerDay ?? 3;

  const scored = artists
    .map(a => ({ a, score: recommendationScore(result, a).total, entry: getScheduleEntry(a.id) }))
    .filter((x): x is { a: Artist; score: number; entry: ScheduleEntry } => !!x.entry);

  const days: Array<"fri" | "sat" | "sun"> = ["fri", "sat", "sun"];
  const allPicks: ScheduleEntry[] = [];
  const allAlternates: string[] = [];

  for (const day of days) {
    const dayItems = scored
      .filter(x => x.entry.day === day)
      .map(x => ({ ...x, start: tToMin(x.entry.start), end: tToMin(x.entry.end) }))
      .sort((a, b) => a.end - b.end);

    const n = dayItems.length;
    if (n === 0) continue;

    // p[i] = largest j < i with sets[j].end <= sets[i].start, else -1.
    const p: number[] = new Array(n).fill(-1);
    for (let i = 0; i < n; i++) {
      for (let j = i - 1; j >= 0; j--) {
        if (dayItems[j].end <= dayItems[i].start) { p[i] = j; break; }
      }
    }

    // opt[k] = best score considering the first k sets.
    const opt: number[] = new Array(n + 1).fill(0);
    for (let i = 1; i <= n; i++) {
      const take = dayItems[i - 1].score + (p[i - 1] >= 0 ? opt[p[i - 1] + 1] : 0);
      const skip = opt[i - 1];
      opt[i] = Math.max(take, skip);
    }

    // Reconstruct chosen indices.
    const chosen: number[] = [];
    let i = n;
    while (i > 0) {
      const take = dayItems[i - 1].score + (p[i - 1] >= 0 ? opt[p[i - 1] + 1] : 0);
      if (take > opt[i - 1]) {
        chosen.push(i - 1);
        i = p[i - 1] + 1;       // jump to the latest compatible predecessor (or 0)
      } else {
        i -= 1;
      }
    }
    chosen.reverse();
    const chosenIds = new Set(chosen.map(idx => dayItems[idx].a.id));
    chosen.forEach(idx => allPicks.push(dayItems[idx].entry));

    // Alternates for this day = next-highest-scoring sets that we had to
    // skip because they clashed with a pick. These are surfaced in cyan
    // so the user can see "if not X then Y".
    const dayAlternates = [...dayItems]
      .filter(x => !chosenIds.has(x.a.id))
      .sort((a, b) => b.score - a.score)
      .slice(0, alternatesPerDay)
      .map(x => x.a.id);
    allAlternates.push(...dayAlternates);
  }

  const byDay = { fri: 0, sat: 0, sun: 0 };
  allPicks.forEach(p => { byDay[p.day as keyof typeof byDay] += 1; });

  return {
    ids: allPicks.map(p => p.id),
    alternates: allAlternates,
    clashes: 0,
    byDay,
  };
}
