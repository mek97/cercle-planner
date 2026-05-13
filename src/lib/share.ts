// Sharable-plan helpers.
// Two distinct share modes:
//   • Profile share   — just the festival persona, no picks:
//       #p=voyager&s=dreamer
//   • Timetable share — picks (optionally annotated with profile):
//       #share=adriatique,artbat,eric-prydz
//       #share=...&p=voyager&s=dreamer
// Hash (not query string) keeps the page from reloading on share.

import { ARTISTS } from "@/data/artists";
import { PERSONAS } from "@/data/personas";
import type { PersonaKey } from "@/data/types";

const VALID_IDS = new Set(ARTISTS.map(a => a.id));
const VALID_PERSONAS = new Set(Object.keys(PERSONAS) as PersonaKey[]);

// Backwards-compat for renamed persona keys: shared URLs minted before the
// renames still parse cleanly. Chain: romantic → soarer → fluidic.
const PERSONA_ALIASES: Record<string, PersonaKey> = {
  romantic: "fluidic",
  soarer: "fluidic",
};

function normalizePersona(raw: string | undefined): PersonaKey | undefined {
  if (!raw) return undefined;
  const aliased = PERSONA_ALIASES[raw] ?? raw;
  return VALID_PERSONAS.has(aliased as PersonaKey) ? (aliased as PersonaKey) : undefined;
}

export interface ShareProfile {
  persona?: PersonaKey;
  secondaryPersona?: PersonaKey;
}

export interface ShareData extends ShareProfile {
  picks: string[];
}

export function encodePicks(picks: Iterable<string>): string {
  return [...picks].filter(id => VALID_IDS.has(id)).join(",");
}

export function decodePicks(encoded: string | null | undefined): string[] {
  if (!encoded) return [];
  return encoded.split(",").map(s => s.trim()).filter(id => VALID_IDS.has(id));
}

function baseUrl(): string {
  return typeof window !== "undefined"
    ? window.location.origin + window.location.pathname
    : "https://cercle.io";
}

// Timetable share — picks list, optionally tagged with sender's persona.
export function buildShareUrl(picks: Iterable<string>, profile?: ShareProfile): string {
  const ids = encodePicks(picks);
  if (!ids) return baseUrl();
  const parts = [`share=${ids}`];
  if (profile?.persona && VALID_PERSONAS.has(profile.persona)) parts.push(`p=${profile.persona}`);
  if (profile?.secondaryPersona && VALID_PERSONAS.has(profile.secondaryPersona)) parts.push(`s=${profile.secondaryPersona}`);
  return `${baseUrl()}#${parts.join("&")}`;
}

// Profile-only share — no picks, just the persona. The recipient lands on
// the page with a banner inviting them to take the quiz themselves.
export function buildProfileShareUrl(profile: ShareProfile): string {
  const parts: string[] = [];
  if (profile.persona && VALID_PERSONAS.has(profile.persona)) parts.push(`p=${profile.persona}`);
  if (profile.secondaryPersona && VALID_PERSONAS.has(profile.secondaryPersona)) parts.push(`s=${profile.secondaryPersona}`);
  if (parts.length === 0) return baseUrl();
  return `${baseUrl()}#${parts.join("&")}`;
}

function safeDecode(raw: string): string {
  try { return decodeURIComponent(raw); } catch { return raw; }
}

function matchHashParam(name: string): string | null {
  if (typeof window === "undefined") return null;
  const m = window.location.hash.match(new RegExp(`(?:^#|&)${name}=([^&]+)`));
  return m ? safeDecode(m[1]) : null;
}

export function readShareFromHash(): string[] {
  const raw = matchHashParam("share");
  return decodePicks(raw);
}

export function readShareDataFromHash(): ShareData {
  const picks = readShareFromHash();
  return {
    picks,
    persona: normalizePersona(matchHashParam("p") ?? undefined),
    secondaryPersona: normalizePersona(matchHashParam("s") ?? undefined),
  };
}

export function clearShareHash() {
  if (typeof window === "undefined") return;
  if (/share=|[?&#]p=|[?&#]s=/.test(window.location.hash)) {
    history.replaceState(null, "", window.location.pathname + window.location.search);
  }
}

// Timetable share message — leads with pick count, persona is optional flavour.
export function buildShareMessage(count: number, url: string, profile?: ShareProfile): string {
  const lines = ["My Cercle Festival 2026 plan"];
  if (profile?.persona) {
    const primary = PERSONAS[profile.persona];
    const secondary = profile.secondaryPersona ? PERSONAS[profile.secondaryPersona] : undefined;
    const headline = secondary
      ? `${primary.name} × ${secondary.name.replace(/^The\s+/, "")}`
      : primary.name;
    lines.push(`Profile: ${headline}`);
    if (primary.tags?.length) lines.push(`Vibe: ${primary.tags.slice(0, 3).join(" · ")}`);
  }
  lines.push(`${count} pick${count === 1 ? "" : "s"} across the weekend`);
  lines.push(url);
  return lines.join("\n");
}

// Profile-only share message — invites the recipient to find their own profile.
export function buildProfileShareMessage(url: string, profile: ShareProfile): string {
  if (!profile.persona) return `My Cercle Festival 2026 profile — ${url}`;
  const primary = PERSONAS[profile.persona];
  const secondary = profile.secondaryPersona ? PERSONAS[profile.secondaryPersona] : undefined;
  const headline = secondary
    ? `${primary.name} × ${secondary.name.replace(/^The\s+/, "")}`
    : primary.name;
  const lines = [
    `My Cercle Festival 2026 profile: ${headline}`,
  ];
  if (primary.tags?.length) lines.push(`Vibe: ${primary.tags.slice(0, 3).join(" · ")}`);
  lines.push("What's your festival profile?");
  lines.push(url);
  return lines.join("\n");
}
