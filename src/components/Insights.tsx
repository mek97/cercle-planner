import { useMemo } from "react";
import { ARTISTS } from "@/data/artists";
import { GENRES, DAY_FULL } from "@/data/genres";
import { findConflicts } from "@/data/schedule";
import type { GenreKey, MoodKey } from "@/data/types";

const MOOD_AXES: MoodKey[] = ["euphoric", "hypnotic", "gritty", "dreamy", "danceable", "emotional"];
const MOOD_LABELS: Record<MoodKey, string> = {
  euphoric: "Euphoric", hypnotic: "Hypnotic", gritty: "Gritty",
  dreamy: "Dreamy", danceable: "Danceable", emotional: "Emotional",
};

interface Card { accent: string; label: string; value: string; detail: string; }

export function Insights({ picks }: { picks: Set<string> }) {
  const cards = useMemo<Card[]>(() => {
    const picked = ARTISTS.filter(a => picks.has(a.id));
    if (picked.length === 0) {
      return [{
        accent: "var(--color-ink-mute)",
        label: "Start picking",
        value: "Insights wake up here",
        detail: "Add a few artists and we'll show you the shape of your weekend — conflicts, gaps, mood balance, and which day is your night.",
      }];
    }

    const out: Card[] = [];

    const genreCount: Partial<Record<GenreKey, number>> = {};
    picked.forEach(a => a.genres.forEach(g => { genreCount[g] = (genreCount[g] || 0) + 1; }));
    const [topG, topGn] = (Object.entries(genreCount) as [GenreKey, number][])
      .sort((a, b) => b[1] - a[1])[0];
    out.push({
      accent: GENRES[topG].color,
      label: "Your sound",
      value: GENRES[topG].label,
      detail: `${topGn} of your ${picked.length} picks lean ${GENRES[topG].label.toLowerCase()}. That's your weekend's center of gravity.`,
    });

    const dayCount = { fri: 0, sat: 0, sun: 0 };
    picked.forEach(a => { dayCount[a.day]++; });
    const busiest = (Object.entries(dayCount) as ["fri"|"sat"|"sun", number][])
      .sort((a, b) => b[1] - a[1])[0];
    out.push({
      accent: `var(--color-${busiest[0]})`,
      label: "Your big night",
      value: DAY_FULL[busiest[0]],
      detail: `${busiest[1]} artists on ${DAY_FULL[busiest[0]]}. Pace yourself — water, snacks, and a moment off the dancefloor.`,
    });

    const avgBpm = Math.round(picked.reduce((s, a) => s + (a.bpm[0] + a.bpm[1]) / 2, 0) / picked.length);
    const bpmText =
      avgBpm < 115 ? "A slow burn — you came to feel things." :
      avgBpm < 124 ? "Steady, grooving — classic dance-music sweet spot." :
      avgBpm < 130 ? "Peak-time pacing. Get ready for liftoff." :
      "Fast and ferocious. Hydrate and sleep before.";
    out.push({ accent: "var(--color-sat)", label: "Average BPM", value: `${avgBpm}`, detail: bpmText });

    const conflictsMap = findConflicts(picks);
    const conflictPairs = new Set<string>();
    conflictsMap.forEach((bs, a) => bs.forEach(b => conflictPairs.add([a, b].sort().join("|"))));
    const conflicts = conflictPairs.size;
    out.push({
      accent: conflicts > 0 ? "var(--color-sat)" : "var(--color-sun)",
      label: "Schedule overlaps",
      value: conflicts === 0 ? "All clear" : `${conflicts} clash${conflicts > 1 ? "es" : ""}`,
      detail: conflicts === 0
        ? "No time conflicts. Your picks flow cleanly across stages."
        : "Two or more of your picks play at the same time on different stages. Decide which set wins each clash.",
    });

    const moodAvg: Record<MoodKey, number> = {} as Record<MoodKey, number>;
    MOOD_AXES.forEach(m => { moodAvg[m] = picked.reduce((s, a) => s + a.mood[m], 0) / picked.length; });
    const [topMood, topMoodVal] = (Object.entries(moodAvg) as [MoodKey, number][])
      .sort((a, b) => b[1] - a[1])[0];
    out.push({
      accent: "var(--color-sun)",
      label: "Dominant mood",
      value: MOOD_LABELS[topMood],
      detail: `Your selections tilt ${topMood} (${topMoodVal.toFixed(1)}/5). The radar shows the full picture.`,
    });

    const unpicked = ARTISTS.filter(a => !picks.has(a.id));
    const recs = unpicked
      .map(a => ({ a, score: a.mood[topMood] }))
      .sort((x, y) => y.score - x.score)
      .slice(0, 3)
      .map(r => r.a.name);
    if (recs.length > 0) {
      out.push({
        accent: "var(--color-fri)",
        label: "You might also like",
        value: recs[0],
        detail: `If you love ${topMood} sets, also look at ${recs.slice(1).join(" and ")}.`,
      });
    }

    return out;
  }, [picks]);

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {cards.map((c, i) => (
        <div
          key={i}
          className="surface rounded-xl p-6 border-l-2"
          style={{ borderLeftColor: c.accent }}
        >
          <div className="font-mono text-[10px] tracking-[0.18em] uppercase text-[var(--color-ink-mute)] mb-2">{c.label}</div>
          <div className="font-[var(--font-display)] text-[24px] leading-tight tracking-[-0.01em] mb-1.5">{c.value}</div>
          <div className="text-[13px] leading-snug text-[var(--color-ink-dim)]">{c.detail}</div>
        </div>
      ))}
    </div>
  );
}
