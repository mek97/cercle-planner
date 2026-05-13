import { useMemo } from "react";
import {
  Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis, Legend,
} from "recharts";
import { ARTISTS } from "@/data/artists";
import { GENRES, DAY_FULL } from "@/data/genres";
import type { Day, GenreKey } from "@/data/types";
import { ChartCard } from "./ChartCard";
import { useChartTheme } from "./chartTheme";

const DAYS: Day[] = ["fri", "sat", "sun"];

export function DayGenreStack() {
  const { C, tick, tooltipStyle } = useChartTheme();
  const { data, genres } = useMemo(() => {
    const used = new Set<GenreKey>();
    const rows: Record<string, number | string>[] = DAYS.map(d => ({ day: DAY_FULL[d] }));
    ARTISTS.forEach(a => {
      const g = a.genres[0];
      used.add(g);
      const row = rows[DAYS.indexOf(a.day)];
      row[g] = ((row[g] as number) || 0) + 1;
    });
    return { data: rows, genres: [...used].sort() };
  }, []);

  return (
    <ChartCard title="Day × genre" sub="how each night breaks down" span={1}>
      <div className="h-[260px]">
        <ResponsiveContainer>
          <BarChart data={data} layout="vertical" margin={{ top: 4, right: 20, bottom: 4, left: -10 }}>
            <CartesianGrid stroke={C.line} horizontal={false} />
            <XAxis type="number" hide />
            <YAxis
              type="category" dataKey="day"
              tick={{ ...tick, fontFamily: "system-ui, -apple-system, BlinkMacSystemFont, Segoe UI, sans-serif", fontSize: 12, fill: C.inkDim }}
              axisLine={false} tickLine={false} width={70}
            />
            <Tooltip
              cursor={{ fill: C.line }}
              contentStyle={tooltipStyle}
              formatter={((v: number, name: string) => [`${v}`, GENRES[name as GenreKey]?.label || name]) as any}
            />
            {genres.map((g, i) => (
              <Bar
                key={g} dataKey={g} stackId="1"
                fill={GENRES[g].color} fillOpacity={0.9}
                radius={i === genres.length - 1 ? [0, 3, 3, 0] : 0}
                isAnimationActive animationBegin={i * 60} animationDuration={500}
              />
            ))}
            <Legend
              wrapperStyle={{ paddingTop: 10, fontSize: 10, fontFamily: "ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace", letterSpacing: "0.08em", color: C.inkDim }}
              iconType="square"
              formatter={(v: string) => GENRES[v as GenreKey]?.label || v}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </ChartCard>
  );
}
