import { useMemo } from "react";
import { PolarAngleAxis, PolarGrid, PolarRadiusAxis, Radar, RadarChart, ResponsiveContainer } from "recharts";
import { ARTISTS } from "@/data/artists";
import type { MoodKey } from "@/data/types";
import { useChartTheme } from "./chartTheme";

const MOOD_AXES: MoodKey[] = ["euphoric", "hypnotic", "gritty", "dreamy", "danceable", "emotional"];
const MOOD_LABELS: Record<MoodKey, string> = {
  euphoric: "Euphoric", hypnotic: "Hypnotic", gritty: "Gritty",
  dreamy: "Dreamy", danceable: "Danceable", emotional: "Emotional",
};

export function MoodRadar({ picks }: { picks: Set<string> }) {
  const { C } = useChartTheme();
  const data = useMemo(() => {
    const picked = ARTISTS.filter(a => picks.has(a.id));
    return MOOD_AXES.map(axis => ({
      axis: MOOD_LABELS[axis],
      value: picked.length === 0 ? 0 : picked.reduce((s, a) => s + a.mood[axis], 0) / picked.length,
    }));
  }, [picks]);

  const hasPicks = picks.size > 0;

  return (
    <div className="surface rounded-2xl p-8">
      <h4 className="font-[var(--font-display)] text-[22px] tracking-[-0.005em] mb-1">Mood radar</h4>
      <p className="font-mono text-[12.5px] text-[var(--color-ink-mute)] tracking-[0.04em] mb-6">
        How your picks distribute across feelings
      </p>
      <div className="h-[300px] relative">
        <ResponsiveContainer>
          <RadarChart data={data} outerRadius="78%">
            <defs>
              <linearGradient id="radar-grad" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0%" stopColor={C.fri} stopOpacity={0.55} />
                <stop offset="50%" stopColor={C.sat} stopOpacity={0.5} />
                <stop offset="100%" stopColor={C.sun} stopOpacity={0.55} />
              </linearGradient>
            </defs>
            <PolarGrid stroke={C.lineStrong} strokeOpacity={0.5} />
            <PolarAngleAxis
              dataKey="axis"
              tick={{ fill: C.inkDim, fontFamily: "ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace", fontSize: 10, letterSpacing: "0.12em" }}
              tickFormatter={(v: string) => v.toUpperCase()}
            />
            <PolarRadiusAxis domain={[0, 5]} tick={false} axisLine={false} />
            <Radar
              dataKey="value"
              fill="url(#radar-grad)"
              fillOpacity={hasPicks ? 1 : 0}
              stroke={hasPicks ? C.ink : "transparent"}
              strokeOpacity={0.7}
              strokeWidth={1.5}
              isAnimationActive animationDuration={650}
              dot={hasPicks ? { fill: C.ink, r: 3 } as any : false}
            />
          </RadarChart>
        </ResponsiveContainer>
        {!hasPicks && (
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <p className="font-[var(--font-display)] italic text-[var(--color-ink-mute)] text-[14px]">
              Pick some artists to see your radar
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
