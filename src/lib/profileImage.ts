// Generates a polished share image (PNG) from a user's quiz result.
// Renders to SVG → rasterises via <canvas>. No external libraries.
// System font stack so we don't have to embed webfont blobs in the SVG.

import { PERSONAS } from "@/data/personas";
import type { QuizResult } from "@/data/quiz";
import type { MoodKey } from "@/data/types";

const W = 1080;
const H = 1350;

// 0..5 scale, 6 moods around the circle
const MOOD_AXES: MoodKey[] = ["euphoric", "hypnotic", "gritty", "dreamy", "danceable", "emotional"];
const MOOD_LABEL: Record<MoodKey, string> = {
  euphoric: "EUPH", hypnotic: "HYPN", gritty: "GRIT",
  dreamy: "DRMY", danceable: "DNCE", emotional: "EMO",
};

function escapeXml(s: string): string {
  return s.replace(/[&<>"']/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", "\"": "&quot;", "'": "&apos;" }[c]!));
}

function topMoodLabel(v: Record<MoodKey, number>): string {
  let topKey: MoodKey = "danceable";
  let topVal = -Infinity;
  (Object.entries(v) as [MoodKey, number][]).forEach(([k, val]) => {
    if (val > topVal) { topVal = val; topKey = k; }
  });
  return topKey.charAt(0).toUpperCase() + topKey.slice(1);
}

// Compute radar polygon coordinates for the mood vector
function radarPoints(moodVector: Record<MoodKey, number>, cx: number, cy: number, radius: number): string {
  const n = MOOD_AXES.length;
  const pts = MOOD_AXES.map((m, i) => {
    const angle = (i / n) * Math.PI * 2 - Math.PI / 2;
    const v = Math.max(0, Math.min(5, moodVector[m] ?? 0));
    const r = (v / 5) * radius;
    return [cx + Math.cos(angle) * r, cy + Math.sin(angle) * r];
  });
  return pts.map(p => p.join(",")).join(" ");
}

function radarRings(cx: number, cy: number, radius: number): string {
  return [1, 2, 3, 4].map(i => {
    const r = (i / 4) * radius;
    return `<circle cx="${cx}" cy="${cy}" r="${r}" fill="none" stroke="rgba(255,255,255,0.10)" stroke-width="1"/>`;
  }).join("");
}

function radarAxisLines(cx: number, cy: number, radius: number): string {
  const n = MOOD_AXES.length;
  return MOOD_AXES.map((_, i) => {
    const angle = (i / n) * Math.PI * 2 - Math.PI / 2;
    const x = cx + Math.cos(angle) * radius;
    const y = cy + Math.sin(angle) * radius;
    return `<line x1="${cx}" y1="${cy}" x2="${x}" y2="${y}" stroke="rgba(255,255,255,0.10)" stroke-width="1"/>`;
  }).join("");
}

function radarAxisLabels(cx: number, cy: number, radius: number): string {
  const n = MOOD_AXES.length;
  return MOOD_AXES.map((m, i) => {
    const angle = (i / n) * Math.PI * 2 - Math.PI / 2;
    const r = radius + 28;
    const x = cx + Math.cos(angle) * r;
    const y = cy + Math.sin(angle) * r + 6;
    return `<text x="${x}" y="${y}" text-anchor="middle" fill="rgba(255,255,255,0.55)" font-family="ui-monospace, Menlo, monospace" font-size="18" letter-spacing="2.2">${MOOD_LABEL[m]}</text>`;
  }).join("");
}

// Build an SVG string sized for Instagram portrait (1080x1350).
//
// Vertical layout (in viewBox y coords):
//   0–100   header bar
//   100–540 persona orb (cy=320, r=200)
//   600–712 persona name + "notes of" subtitle
//   750     tags row
//   810–1170 mood radar (cy=990, r=180) with labels
//   1200–1290 stat tiles
//   1310    footer
export function renderProfileSVG(result: QuizResult): string {
  const primary = PERSONAS[result.primaryPersona];
  const secondary = PERSONAS[result.secondaryPersona];

  const orbCx = W / 2;
  const orbCy = 320;

  const radarCx = W / 2;
  const radarCy = 970;
  const radarR = 170;

  const tags = primary.tags?.slice(0, 3) ?? [];
  const topMood = topMoodLabel(result.moodVector);

  return `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}">
  <defs>
    <linearGradient id="bg" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" stop-color="#0c0b18"/>
      <stop offset="100%" stop-color="#06050d"/>
    </linearGradient>
    <radialGradient id="orb-primary" cx="50%" cy="50%" r="50%">
      <stop offset="0%" stop-color="${primary.color}" stop-opacity="0.85"/>
      <stop offset="100%" stop-color="${primary.color}" stop-opacity="0"/>
    </radialGradient>
    <radialGradient id="orb-secondary" cx="50%" cy="50%" r="50%">
      <stop offset="0%" stop-color="${secondary.color}" stop-opacity="0.45"/>
      <stop offset="100%" stop-color="${secondary.color}" stop-opacity="0"/>
    </radialGradient>
    <linearGradient id="radar-fill" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="${primary.color}" stop-opacity="0.55"/>
      <stop offset="100%" stop-color="${secondary.color}" stop-opacity="0.55"/>
    </linearGradient>
  </defs>

  <!-- background -->
  <rect width="${W}" height="${H}" fill="url(#bg)"/>

  <!-- header brand bar -->
  <g>
    <circle cx="80" cy="80" r="10" fill="${primary.color}"/>
    <text x="110" y="90" fill="#cdc6b8" font-family="ui-monospace, Menlo, monospace" font-size="22" letter-spacing="4">CERCLE · 26</text>
    <text x="${W - 80}" y="90" fill="#7d7666" font-family="ui-monospace, Menlo, monospace" font-size="20" letter-spacing="3" text-anchor="end">FESTIVAL PROFILE</text>
  </g>

  <!-- persona orb -->
  <circle cx="${orbCx}" cy="${orbCy}" r="240" fill="url(#orb-secondary)"/>
  <circle cx="${orbCx}" cy="${orbCy}" r="200" fill="url(#orb-primary)"/>
  <circle cx="${orbCx}" cy="${orbCy}" r="120" fill="none" stroke="${primary.color}" stroke-opacity="0.5" stroke-width="1"/>
  <circle cx="${orbCx}" cy="${orbCy}" r="78"  fill="none" stroke="${primary.color}" stroke-opacity="0.4" stroke-width="1"/>
  <circle cx="${orbCx}" cy="${orbCy}" r="44"  fill="none" stroke="${primary.color}" stroke-opacity="0.3" stroke-width="1"/>

  <!-- persona name -->
  <text x="${W / 2}" y="640" text-anchor="middle"
        fill="${primary.color}"
        font-family="Georgia, 'Times New Roman', serif"
        font-size="92" font-weight="400" letter-spacing="-2">
    ${escapeXml(primary.name)}
  </text>
  <text x="${W / 2}" y="688" text-anchor="middle"
        fill="#cdc6b8"
        font-family="Georgia, 'Times New Roman', serif"
        font-size="28" font-style="italic">
    with notes of <tspan fill="${secondary.color}">${escapeXml(secondary.name.replace(/^The\s+/, ""))}</tspan>
  </text>

  <!-- tags -->
  ${tags.length > 0 ? `<text x="${W / 2}" y="744" text-anchor="middle"
        fill="#cdc6b8"
        font-family="ui-monospace, Menlo, monospace"
        font-size="20" letter-spacing="4">
    ${escapeXml(tags.join("  ·  ").toUpperCase())}
  </text>` : ""}

  <!-- mood radar -->
  <g>
    ${radarRings(radarCx, radarCy, radarR)}
    ${radarAxisLines(radarCx, radarCy, radarR)}
    <polygon points="${radarPoints(result.moodVector, radarCx, radarCy, radarR)}"
             fill="url(#radar-fill)" stroke="${primary.color}" stroke-width="2"/>
    ${radarAxisLabels(radarCx, radarCy, radarR)}
  </g>

  <!-- stats row -->
  <g transform="translate(120, 1200)">
    ${statBox(0,   "BPM TARGET", `${result.bpmPreference[0]}–${result.bpmPreference[1]}`, primary.color)}
    ${statBox(280, "DISCOVERY",  `${Math.round(result.discoveryBias * 100)}%`,             primary.color)}
    ${statBox(560, "TOP MOOD",   topMood.toUpperCase(),                                    primary.color)}
  </g>

  <!-- footer -->
  <text x="${W / 2}" y="${H - 30}" text-anchor="middle"
        fill="#7d7666"
        font-family="ui-monospace, Menlo, monospace"
        font-size="18" letter-spacing="3">
    FIND YOUR FESTIVAL PROFILE
  </text>
</svg>`;
}

function statBox(x: number, label: string, value: string, accent: string): string {
  return `<g transform="translate(${x}, 0)">
    <rect x="0" y="0" width="240" height="100" rx="14" fill="rgba(255,255,255,0.04)" stroke="rgba(255,255,255,0.10)" stroke-width="1"/>
    <text x="120" y="36" text-anchor="middle"
          fill="#7d7666" font-family="ui-monospace, Menlo, monospace"
          font-size="16" letter-spacing="3">${escapeXml(label)}</text>
    <text x="120" y="76" text-anchor="middle"
          fill="${accent}" font-family="Georgia, 'Times New Roman', serif"
          font-size="32" letter-spacing="-0.5">${escapeXml(value)}</text>
  </g>`;
}

// Greedy word-wrap to a soft character budget per line.
function wrapText(text: string, maxChars: number): string[] {
  const words = text.split(/\s+/);
  const lines: string[] = [];
  let current = "";
  for (const w of words) {
    if ((current + " " + w).trim().length <= maxChars) {
      current = (current + " " + w).trim();
    } else {
      if (current) lines.push(current);
      current = w;
    }
  }
  if (current) lines.push(current);
  return lines;
}

// Convert an SVG string to a PNG Blob via a hidden canvas.
export async function svgToPngBlob(svg: string, width: number, height: number): Promise<Blob> {
  const blob = new Blob([svg], { type: "image/svg+xml;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  try {
    const img = await new Promise<HTMLImageElement>((resolve, reject) => {
      const im = new Image();
      im.crossOrigin = "anonymous";
      im.onload = () => resolve(im);
      im.onerror = () => reject(new Error("Failed to load SVG into image"));
      im.src = url;
    });
    const canvas = document.createElement("canvas");
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext("2d");
    if (!ctx) throw new Error("No 2D context");
    ctx.drawImage(img, 0, 0, width, height);
    return await new Promise<Blob>((resolve, reject) => {
      canvas.toBlob(b => (b ? resolve(b) : reject(new Error("toBlob returned null"))), "image/png", 0.95);
    });
  } finally {
    URL.revokeObjectURL(url);
  }
}

// One-shot: result → PNG Blob at the share-card dimensions.
export async function renderProfilePng(result: QuizResult): Promise<Blob> {
  return svgToPngBlob(renderProfileSVG(result), W, H);
}

export const PROFILE_IMAGE_DIMENSIONS = { width: W, height: H } as const;
