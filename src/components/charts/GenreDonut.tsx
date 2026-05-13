import { useMemo } from "react";
import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts";
import { ARTISTS } from "@/data/artists";
import { GENRES } from "@/data/genres";
import type { GenreKey } from "@/data/types";
import { ChartCard } from "./ChartCard";
import { useChartTheme } from "./chartTheme";

export function GenreDonut() {
  const { C, tooltipStyle } = useChartTheme();

  const data = useMemo(() => {
    const counts: Partial<Record<GenreKey, number>> = {};
    ARTISTS.forEach(a => {
      const g = a.genres[0];
      counts[g] = (counts[g] || 0) + 1;
    });
    return (Object.entries(counts) as [GenreKey, number][])
      .sort((a, b) => b[1] - a[1])
      .map(([key, value]) => ({ key, name: GENRES[key].label, value, color: GENRES[key].color }));
  }, []);

  const total = ARTISTS.length;

  return (
    <ChartCard title="Genre mix" sub={`across all ${total} artists`} span={1}>
      <div className="relative h-[300px]">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              dataKey="value"
              innerRadius="58%"
              outerRadius="88%"
              paddingAngle={1.5}
              stroke={C.bg0}
              strokeWidth={2}
              startAngle={90}
              endAngle={-270}
              isAnimationActive
              animationBegin={150}
              animationDuration={750}
            >
              {data.map(d => (
                <Cell key={d.key} fill={d.color} fillOpacity={0.92} />
              ))}
            </Pie>
            <Tooltip
              contentStyle={tooltipStyle}
              formatter={((value: number, _: string, item: any) => [`${value} artists`, item?.payload?.name]) as any}
            />
          </PieChart>
        </ResponsiveContainer>
        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
          <div className="font-[var(--font-display)] text-[44px] tracking-[-0.022em] leading-none">{total}</div>
          <div className="font-mono text-[10px] tracking-[0.18em] text-[var(--color-ink-mute)] mt-1">ARTISTS</div>
        </div>
      </div>
      <ul className="mt-4 flex flex-col gap-1.5">
        {data.map(d => (
          <li key={d.key} className="grid grid-cols-[12px_1fr_auto] items-center gap-2.5 text-xs text-[var(--color-ink-dim)]">
            <i
              className="w-2.5 h-2.5 rounded-[3px]"
              style={{ background: d.color, boxShadow: `0 0 8px ${d.color}` }}
            />
            <span>{d.name}</span>
            <b className="font-mono text-[11px] text-[var(--color-ink)] tracking-[0.04em] font-normal">{d.value}</b>
          </li>
        ))}
      </ul>
    </ChartCard>
  );
}
