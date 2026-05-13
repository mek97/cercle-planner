export type Day = "fri" | "sat" | "sun";

export type GenreKey =
  | "techno" | "melodic" | "house" | "deep" | "organic"
  | "downtempo" | "progressive" | "electronica" | "bass"
  | "hardtechno" | "frenchhouse";

export type PersonaKey =
  | "dreamer" | "voyager" | "raver" | "fluidic" | "groover" | "wanderer";

export type FanbaseLevel = "small" | "medium" | "medium-large" | "large" | "massive";

export interface Track {
  title: string;
  note?: string;
  year?: number | null;
}

export interface CercleHistory {
  played: boolean;
  where: string;
}

export interface ArtistDetails {
  real_name: string;
  origin: string;
  active: string;
  listeners: string;
  fanbase: FanbaseLevel;
  labels: string[];
  top_tracks: Track[];
  cercle_history: CercleHistory;
  notable: string;
  vibe: string;
  best_for: string;
  collabs: string[];
}

export interface Mood {
  euphoric: number;
  hypnotic: number;
  gritty: number;
  dreamy: number;
  danceable: number;
  emotional: number;
}

export type MoodKey = keyof Mood;

export interface Artist {
  id: string;
  name: string;
  day: Day;
  genres: GenreKey[];
  bpm: [number, number];
  mood: Mood;
  blurb: string;
  details: ArtistDetails;
}

export interface Genre {
  label: string;
  color: string;
}

export interface QuizOption {
  label: string;
  weights: Partial<Record<PersonaKey, number>>;
}

export interface QuizQuestion {
  q: string;
  options: QuizOption[];
}

export interface Persona {
  name: string;
  color: string;
  desc: string;
  tags: string[];
  matches: string[];
}
