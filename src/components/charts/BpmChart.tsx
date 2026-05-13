import { useMemo } from "react";
import {
  Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis,
} from "recharts";
import { ARTISTS } from "@/data/artists";
import { ChartCard } from "./ChartCard";
import { useChartTheme } from "./chartTheme";

interface Props { picks: Set<string>; }

export function BpmChart({ picks }: Props) {
  const { C, tick, tooltipStyle } = useChartTheme();
  const binSize = 5;
  const minBpm = 95, maxBpm = 175;
  const nBins = (maxBpm - minBpm) / binSize;

  const data = useMemo(() => {
    const bins: { bpm: number; count: number; pickedCount: number }[] = [];
    for (let i = 0; i < nBins; i++) {
      bins.push({ bpm: minBpm + i * binSize + binSize / 2, count: 0, pickedCount: 0 });
    }
    ARTISTS.forEach(a => {
      const avg = (a.bpm[0] + a.bpm[1]) / 2;
      const idx = Math.min(nBins - 1, Math.max(0, Math.floor((avg - minBpm) / binSize)));
      bins[idx].count++;
      if (picks.has(a.id)) bins[idx].pickedCount++;
    });
    return bins.filter(b => b.count > 0);
  }, [picks, nBins]);

  return (
    <ChartCard title="Tempo map" sub="BPM distribution · highlighted slice = your picks" span={2}>
      <div className="h-[240px]">
        <ResponsiveContainer>
          <BarChart data={data} margin={{ top: 18, right: 16, bottom: 4, left: -10 }}>
            <defs>
              <linearGradient id="bpm-grad" x1="0" x2="1" y1="0" y2="0">
                <stop offset="0%" stopColor={C.fri} />
                <stop offset="40%" stopColor={C.sat} />
                <stop offset="80%" stopColor={C.g.hardtechno} />
                <stop offset="100%" stopColor={C.sun} />
              </linearGradient>
            </defs>
            <CartesianGrid stroke={C.line} vertical={false} />
            <XAxis dataKey="bpm" tick={tick} axisLine={false} tickLine={false} interval={0} />
            <YAxis tick={tick} axisLine={false} tickLine={false} allowDecimals={false} width={28} />
            <Tooltip
              cursor={{ fill: C.line }}
              contentStyle={tooltipStyle}
              formatter={((v: number, _: string, item: any) => [
                `${v} artists`, item?.payload?.bpm ? `~${item.payload.bpm} BPM` : "",
              ]) as any}
            />
            <Bar dataKey="count" radius={[3, 3, 0, 0]} fill="url(#bpm-grad)" fillOpacity={0.9}
              isAnimationActive animationDuration={700} />
            <Bar dataKey="pickedCount" radius={[3, 3, 0, 0]} fill={C.ink} fillOpacity={0.92}
              isAnimationActive animationDuration={700} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </ChartCard>
  );
}
