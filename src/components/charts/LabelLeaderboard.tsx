import { useMemo } from "react";
import { Bar, BarChart, Cell, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { ARTISTS } from "@/data/artists";
import { ChartCard } from "./ChartCard";
import { useChartTheme } from "./chartTheme";

function normalize(raw: string): string {
  return raw.replace(/\s*\(.*?\)\s*/g, "").replace(/\s+\/\s+/g, " / ").trim();
}

export function LabelLeaderboard() {
  const { C, tick, tooltipStyle } = useChartTheme();
  const data = useMemo(() => {
    const counts = new Map<string, number>();
    ARTISTS.forEach(a => {
      const seen = new Set<string>();
      a.details.labels.forEach(raw => {
        const n = normalize(raw);
        if (!n || seen.has(n)) return;
        seen.add(n);
        counts.set(n, (counts.get(n) || 0) + 1);
      });
    });
    return [...counts.entries()]
      .filter(([, c]) => c >= 2)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 12)
      .map(([name, value]) => ({
        name: name.length > 22 ? name.slice(0, 20) + "…" : name,
        value,
      }));
  }, []);

  return (
    <ChartCard title="Labels in the lineup" sub="most-represented imprints" span={1}>
      <div className="h-[340px]">
        <ResponsiveContainer>
          <BarChart data={data} layout="vertical" margin={{ top: 4, right: 30, bottom: 4, left: 0 }}>
            <defs>
              <linearGradient id="lbl-grad" x1="0" x2="1" y1="0" y2="0">
                <stop offset="0%" stopColor={C.gold} />
                <stop offset="100%" stopColor={C.sat} />
              </linearGradient>
            </defs>
            <XAxis type="number" hide />
            <YAxis
              type="category" dataKey="name" width={140}
              tick={{ ...tick, fontFamily: "Inter", fontSize: 11.5, fill: C.inkDim }}
              axisLine={false} tickLine={false}
            />
            <Tooltip
              cursor={{ fill: C.line }}
              contentStyle={tooltipStyle}
              formatter={((v: number) => [`${v} artists`, ""]) as any}
            />
            <Bar
              dataKey="value" radius={[3, 3, 3, 3]}
              isAnimationActive animationDuration={650}
              label={{
                position: "right", offset: 6, fill: C.inkDim,
                fontSize: 10, fontFamily: "JetBrains Mono, monospace",
              }}
            >
              {data.map((_, i) => <Cell key={i} fill="url(#lbl-grad)" fillOpacity={0.92} />)}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </ChartCard>
  );
}
