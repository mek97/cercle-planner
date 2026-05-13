import { useMemo } from "react";
import {
  CartesianGrid, Line, LineChart, ReferenceLine, ResponsiveContainer,
  Tooltip, XAxis, YAxis,
} from "recharts";
import { ARTISTS } from "@/data/artists";
import { SCHEDULE, timeToMin } from "@/data/schedule";
import type { Day } from "@/data/types";
import { useChartTheme } from "./chartTheme";

const DAYS: Day[] = ["fri", "sat", "sun"];
const ARTIST_BY_ID = new Map(ARTISTS.map(a => [a.id, a]));

// build x-axis: hours 12..23
const HOURS = Array.from({ length: 12 }, (_, i) => 12 + i);

interface Point { hour: number; fri?: number; sat?: number; sun?: number; label: string; }

export function EnergyCurve({ picks }: { picks: Set<string> }) {
  const { C, tick, tooltipStyle } = useChartTheme();

  const data = useMemo<Point[]>(() => {
    const rows: Point[] = HOURS.map(h => ({ hour: h, label: `${String(h).padStart(2, "0")}:00` }));
    DAYS.forEach(d => {
      const picked = SCHEDULE
        .filter(s => s.day === d && picks.has(s.id))
        .sort((a, b) => timeToMin(a.start) - timeToMin(b.start));
      picked.forEach(s => {
        const artist = ARTIST_BY_ID.get(s.id);
        if (!artist) return;
        const mid = (artist.bpm[0] + artist.bpm[1]) / 2;
        // Mark the BPM at the midpoint hour of the set
        const midMin = (timeToMin(s.start) + timeToMin(s.end)) / 2;
        const hourBucket = Math.round(midMin / 60);
        const row = rows.find(r => r.hour === hourBucket);
        if (row) (row as any)[d] = mid;
      });
    });
    return rows;
  }, [picks]);

  const hasPicks = picks.size > 0;
  const dayColor: Record<Day, string> = { fri: C.fri, sat: C.sat, sun: C.sun };

  return (
    <div className="surface rounded-2xl p-8">
      <h4 className="font-[var(--font-display)] text-[22px] tracking-[-0.005em] mb-1">Energy through the weekend</h4>
      <p className="font-mono text-[12.5px] text-[var(--color-ink-mute)] tracking-[0.04em] mb-6">
        BPM curve plotted at each set's midpoint
      </p>

      <div className="h-[280px] relative">
        <ResponsiveContainer>
          <LineChart data={data} margin={{ top: 14, right: 14, bottom: 18, left: -10 }}>
            <defs>
              {DAYS.map(d => (
                <linearGradient key={d} id={`ec-${d}`} x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor={dayColor[d]} stopOpacity={0.3} />
                  <stop offset="100%" stopColor={dayColor[d]} stopOpacity={0} />
                </linearGradient>
              ))}
            </defs>
            <CartesianGrid stroke={C.line} />
            <XAxis dataKey="label" tick={tick} axisLine={false} tickLine={false} />
            <YAxis
              domain={[90, 170]} tick={tick}
              axisLine={false} tickLine={false} width={32}
              ticks={[100, 120, 140, 160]}
            />
            <ReferenceLine y={120} stroke={C.line} strokeDasharray="2 4" />
            <ReferenceLine y={140} stroke={C.line} strokeDasharray="2 4" />
            <Tooltip
              cursor={{ stroke: C.lineStrong, strokeWidth: 1 }}
              contentStyle={tooltipStyle}
              formatter={((v: number, name: string) => [`${v.toFixed(0)} BPM`, name.toUpperCase()]) as any}
            />
            {DAYS.map(d => (
              <Line
                key={d}
                type="monotone" dataKey={d}
                stroke={dayColor[d]}
                strokeWidth={2.4}
                dot={{ r: 4, fill: dayColor[d] }}
                activeDot={{ r: 6 }}
                connectNulls
                isAnimationActive animationDuration={700}
              />
            ))}
          </LineChart>
        </ResponsiveContainer>
        {!hasPicks && (
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <p className="font-[var(--font-display)] italic text-[var(--color-ink-mute)] text-[14px]">
              Your energy curve appears once you pick artists
            </p>
          </div>
        )}
      </div>

      <div className="flex gap-5 mt-4 font-mono text-[11px] tracking-[0.14em] text-[var(--color-ink-dim)] uppercase">
        {DAYS.map(d => (
          <span key={d} className="inline-flex items-center gap-2">
            <i className="w-2.5 h-2.5 rounded-sm" style={{ background: dayColor[d] }} />
            {d === "fri" ? "Friday" : d === "sat" ? "Saturday" : "Sunday"}
          </span>
        ))}
      </div>
    </div>
  );
}
