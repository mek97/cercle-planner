import { useMemo } from "react";
import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts";
import { ARTISTS } from "@/data/artists";
import { ChartCard } from "./ChartCard";
import { useChartTheme } from "./chartTheme";

export function CercleBreakdown() {
  const { C, tooltipStyle } = useChartTheme();

  const { alumni, debut, data } = useMemo(() => {
    const a = ARTISTS.filter(x => x.details.cercle_history.played).length;
    const d = ARTISTS.length - a;
    return {
      alumni: a, debut: d,
      data: [
        { name: "Cercle alumni", value: a, color: C.sat },
        { name: "First-time at Cercle", value: d, color: C.accent },
      ],
    };
  }, [C.sat, C.accent]);

  return (
    <ChartCard title="Cercle history" sub="alumni vs first-time" span={1}>
      <div className="relative h-[230px]">
        <ResponsiveContainer>
          <PieChart>
            <Pie
              data={data} dataKey="value"
              innerRadius="68%" outerRadius="95%"
              startAngle={90} endAngle={-270}
              paddingAngle={2}
              stroke={C.bg0} strokeWidth={2}
              cornerRadius={5}
              isAnimationActive animationDuration={700}
            >
              {data.map((d, i) => <Cell key={i} fill={d.color} fillOpacity={0.95} />)}
            </Pie>
            <Tooltip
              contentStyle={tooltipStyle}
              formatter={((v: number, _: string, item: any) => [`${v} artists`, item?.payload?.name]) as any}
            />
          </PieChart>
        </ResponsiveContainer>
        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
          <div className="font-[var(--font-display)] text-[44px] tracking-[-0.022em] leading-none">{alumni}</div>
          <div className="font-mono text-[9px] tracking-[0.16em] text-[var(--color-ink-mute)] mt-1">RETURNING</div>
        </div>
      </div>
      <div className="flex flex-col gap-2.5 mt-4">
        <Stat label="Cercle alumni" value={alumni} color={C.sat} />
        <Stat label="First-time at Cercle" value={debut} color={C.accent} />
      </div>
    </ChartCard>
  );
}

function Stat({ label, value, color }: { label: string; value: number; color: string }) {
  return (
    <div
      className="flex justify-between items-center px-4 py-3 bg-[var(--color-surface)] rounded-lg text-[13px] text-[var(--color-ink-dim)] border-l-2"
      style={{ borderLeftColor: color }}
    >
      <span>{label}</span>
      <b className="font-[var(--font-display)] text-[22px] italic font-normal" style={{ color }}>{value}</b>
    </div>
  );
}
