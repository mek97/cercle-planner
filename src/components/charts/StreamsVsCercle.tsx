import { useMemo } from "react";
import { Cell, ResponsiveContainer, Scatter, ScatterChart, Tooltip, XAxis, YAxis, ZAxis } from "recharts";
import { ARTISTS } from "@/data/artists";
import { DAY_ACCENT } from "@/data/genres";
import { fmtListeners, parseListeners } from "@/utils";
import { ChartCard } from "./ChartCard";
import { useChartTheme } from "./chartTheme";

interface Props { onOpen: (id: string) => void; }

export function StreamsVsCercle({ onOpen }: Props) {
  const { C, tick, tooltipStyle } = useChartTheme();
  const points = useMemo(() => {
    return ARTISTS
      .map(a => ({
        a,
        listeners: parseListeners(a.details.listeners),
        alumni: a.details.cercle_history.played,
      }))
      .filter((x): x is { a: typeof ARTISTS[number]; listeners: number; alumni: boolean } => x.listeners !== null)
      .map(p => {
        let h = 0;
        for (let i = 0; i < p.a.id.length; i++) h = (h * 31 + p.a.id.charCodeAt(i)) | 0;
        const jx = ((h % 1000) / 1000 - 0.5) * 0.6;
        return {
          x: (p.alumni ? 1 : 0) + jx,
          y: p.listeners,
          name: p.a.name,
          color: DAY_ACCENT[p.a.day],
          id: p.a.id,
          alumni: p.alumni,
        };
      });
  }, []);

  return (
    <ChartCard title="Streams vs Cercle" sub="does past Cercle history skew listener counts?" span={1}>
      <div className="h-[340px]">
        <ResponsiveContainer>
          <ScatterChart margin={{ top: 30, right: 12, bottom: 36, left: 36 }}>
            <XAxis
              type="number" dataKey="x" domain={[-0.5, 1.5]}
              ticks={[0, 1]}
              tickFormatter={(v: number) => v === 0 ? "FIRST-TIME" : "ALUMNI"}
              tick={{ ...tick, fontSize: 10, letterSpacing: "0.16em", fill: C.inkDim }}
              axisLine={false} tickLine={false}
            />
            <YAxis
              type="number" dataKey="y"
              scale="log" domain={["dataMin", "dataMax"]}
              tickFormatter={fmtListeners}
              tick={{ ...tick, fontSize: 10 }}
              axisLine={false} tickLine={false}
            />
            <ZAxis range={[60, 120]} />
            <Tooltip
              cursor={false}
              content={({ active, payload }) => {
                if (!active || !payload?.length) return null;
                const p = payload[0].payload as any;
                return (
                  <div style={tooltipStyle}>
                    <div style={{ fontFamily: "Fraunces, serif", fontSize: 15, fontWeight: 500, color: C.ink, marginBottom: 4 }}>
                      {p.name}
                    </div>
                    <div style={{ color: C.inkDim }}>
                      {fmtListeners(p.y)} monthly · {p.alumni ? "alumni" : "first-time"}
                    </div>
                  </div>
                );
              }}
            />
            <Scatter
              data={points}
              onClick={(p: any) => p?.id && onOpen(p.id)}
              cursor="pointer"
              isAnimationActive animationDuration={700}
            >
              {points.map(p => (
                <Cell key={p.id} fill={p.color} fillOpacity={0.92} stroke={C.lineBright} strokeWidth={1} />
              ))}
            </Scatter>
          </ScatterChart>
        </ResponsiveContainer>
      </div>
    </ChartCard>
  );
}
