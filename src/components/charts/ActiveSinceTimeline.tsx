import { useMemo, useState } from "react";
import { ARTISTS } from "@/data/artists";
import { DAY_ACCENT, DAY_LABEL } from "@/data/genres";
import { ChartCard } from "./ChartCard";
import { useChartTheme } from "./chartTheme";

function extractYear(s: string): number | null {
  const m = s.match(/(19|20)\d{2}/g);
  if (!m) return null;
  return Math.min(...m.map(Number));
}

interface Props { onOpen: (id: string) => void; }

export function ActiveSinceTimeline({ onOpen }: Props) {
  const { C } = useChartTheme();
  const [hover, setHover] = useState<string | null>(null);

  const dots = useMemo(() => {
    return ARTISTS
      .map(a => ({ a, year: extractYear(a.details.active) }))
      .filter((x): x is { a: typeof ARTISTS[number]; year: number } => x.year !== null)
      .sort((x, y) => x.year - y.year);
  }, []);

  const W = 760, H = 230;
  const padL = 40, padR = 40, padT = 60, padB = 50;
  const innerW = W - padL - padR;
  const innerH = H - padT - padB;
  const minY = Math.min(...dots.map(d => d.year));
  const maxY = Math.max(...dots.map(d => d.year));

  const binMap = new Map<number, typeof dots>();
  dots.forEach(d => {
    if (!binMap.has(d.year)) binMap.set(d.year, []);
    binMap.get(d.year)!.push(d);
  });

  const ticks: number[] = [];
  for (let y = Math.floor(minY / 5) * 5; y <= maxY; y += 5) ticks.push(y);

  return (
    <ChartCard title="Active since" sub="when each artist's project started" span={2}>
      <svg viewBox={`0 0 ${W} ${H}`} className="w-full h-auto">
        <line x1={padL} x2={W - padR} y1={padT + innerH} y2={padT + innerH} stroke={C.lineStrong} strokeWidth={1} />
        {ticks.map(y => {
          const px = padL + ((y - minY) / (maxY - minY)) * innerW;
          return (
            <g key={y}>
              <line x1={px} y1={padT + innerH} x2={px} y2={padT + innerH + 6} stroke={C.inkMute} strokeWidth={1} />
              <text x={px} y={padT + innerH + 22} textAnchor="middle"
                fontFamily="JetBrains Mono, monospace" fontSize={11}
                fill={y % 10 === 0 ? C.inkDim : C.inkMute}
                letterSpacing="0.06em">{y}</text>
            </g>
          );
        })}
        {[...binMap.entries()].map(([year, group]) => {
          const px = padL + ((year - minY) / (maxY - minY)) * innerW;
          return group.map((d, i) => {
            const py = padT + innerH - 12 - i * 14;
            const isHover = hover === d.a.id;
            return (
              <g key={d.a.id} style={{ cursor: "pointer" }}
                onMouseEnter={() => setHover(d.a.id)}
                onMouseLeave={() => setHover(null)}
                onClick={() => onOpen(d.a.id)}>
                <line x1={px} x2={px} y1={py + 6} y2={padT + innerH - 1}
                  stroke={DAY_ACCENT[d.a.day]} strokeWidth={0.6} opacity={0.3} />
                <circle cx={px} cy={py} r={isHover ? 6 : 4.5}
                  fill={DAY_ACCENT[d.a.day]} opacity={isHover ? 1 : 0.92}
                  stroke={isHover ? C.ink : "transparent"} strokeWidth={1} />
              </g>
            );
          });
        })}
        {hover && (() => {
          const t = dots.find(d => d.a.id === hover);
          if (!t) return null;
          const px = padL + ((t.year - minY) / (maxY - minY)) * innerW;
          return (
            <g pointerEvents="none">
              <text x={px} y={36} textAnchor="middle"
                fontFamily="Fraunces, serif" fontSize={17} fontWeight={500}
                fill={C.ink} stroke={C.bg0} strokeWidth={4} paintOrder="stroke">
                {t.a.name}
              </text>
              <text x={px} y={50} textAnchor="middle"
                fontFamily="JetBrains Mono, monospace" fontSize={10}
                fill={C.inkDim} stroke={C.bg0} strokeWidth={3} paintOrder="stroke">
                since {t.year} · {DAY_LABEL[t.a.day]}
              </text>
            </g>
          );
        })()}
      </svg>
    </ChartCard>
  );
}
