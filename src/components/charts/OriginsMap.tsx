import { useMemo } from "react";
import { ARTISTS } from "@/data/artists";
import { DAY_ACCENT } from "@/data/genres";
import type { Artist } from "@/data/types";
import { ChartCard } from "./ChartCard";
import { useChartTheme } from "./chartTheme";

const COUNTRY_POS: Record<string, [number, number]> = {
  Germany: [50.5, 36],     Switzerland: [50, 42],   Italy: [52, 46],
  France: [47, 42],        UK: [45, 34],            Netherlands: [49, 34],
  Spain: [43, 46],         Sweden: [52, 25],        Norway: [50, 24],
  Finland: [56, 22],       Denmark: [51, 30],       Ukraine: [60, 36],
  Russia: [62, 28],        Palestine: [60, 50],     Turkey: [60, 46],
  USA: [20, 42],           Canada: [18, 30],        Brazil: [32, 72],
  Chile: [28, 78],         Colombia: [25, 62],      Zambia: [56, 72],
  "South Africa": [57, 80],
};

function inferCountry(a: Artist): string | null {
  const s = a.details.origin.toLowerCase();
  if (/germany|berlin|hamburg|göttingen|karlsruhe|bavaria/.test(s)) return "Germany";
  if (/switzerland|zürich|lucerne/.test(s)) return "Switzerland";
  if (/italy|naples|milan|rome|parma/.test(s)) return "Italy";
  if (/france|paris|lille|bordeaux|lyon|versailles|angers|alps/.test(s)) return "France";
  if (/uk|london|cornwall|witney|midlands|southampton|glasgow/.test(s)) return "UK";
  if (/netherlands|amsterdam/.test(s)) return "Netherlands";
  if (/spain|alicante/.test(s)) return "Spain";
  if (/norway|stavanger|tromsø|bergen/.test(s)) return "Norway";
  if (/finland|helsinki/.test(s)) return "Finland";
  if (/denmark|copenhagen/.test(s)) return "Denmark";
  if (/ukraine|kyiv|kirovograd/.test(s)) return "Ukraine";
  if (/russia|siberia|mirny/.test(s)) return "Russia";
  if (/palestine|ramallah/.test(s)) return "Palestine";
  if (/turkey|istanbul|bursa/.test(s)) return "Turkey";
  if (/brazil|são paulo|amparo|mundo novo/.test(s)) return "Brazil";
  if (/chile/.test(s)) return "Chile";
  if (/colombia/.test(s)) return "Colombia";
  if (/zambia/.test(s)) return "Zambia";
  if (/south africa|cape town/.test(s)) return "South Africa";
  if (/usa|united states|new jersey|san francisco|denver|oregon/.test(s)) return "USA";
  if (/canada/.test(s)) return "Canada";
  return null;
}

interface Props {
  picks: Set<string>;
  onOpen: (id: string) => void;
}

export function OriginsMap({ picks, onOpen }: Props) {
  const { C } = useChartTheme();
  const grouped = useMemo(() => {
    const m = new Map<string, Artist[]>();
    ARTISTS.forEach(a => {
      const c = inferCountry(a);
      if (!c) return;
      if (!m.has(c)) m.set(c, []);
      m.get(c)!.push(a);
    });
    return m;
  }, []);

  const W = 760, H = 380;
  const landFill = C.line;

  return (
    <ChartCard title="Where they come from" sub="origins · click a dot to open" span={3}>
      <svg viewBox={`0 0 ${W} ${H}`} className="w-full h-auto" role="img">
        <path d="M 30 60 Q 80 50, 160 70 L 200 130 Q 180 180, 140 200 L 80 200 Q 40 180, 30 130 Z" fill={landFill} stroke={C.lineStrong} strokeWidth={0.5} />
        <path d="M 180 220 Q 230 210, 260 250 L 250 320 Q 220 340, 200 320 L 180 280 Z" fill={landFill} stroke={C.lineStrong} strokeWidth={0.5} />
        <path d="M 320 80 Q 380 70, 460 90 L 480 150 Q 450 180, 400 175 L 340 160 Q 310 130, 320 80 Z" fill={landFill} stroke={C.lineStrong} strokeWidth={0.5} />
        <path d="M 380 200 Q 440 200, 470 240 L 460 310 Q 430 340, 410 320 L 380 280 Z" fill={landFill} stroke={C.lineStrong} strokeWidth={0.5} />
        <path d="M 460 80 Q 580 70, 680 110 L 700 180 Q 640 210, 580 200 L 480 180 Q 460 130, 460 80 Z" fill={landFill} stroke={C.lineStrong} strokeWidth={0.5} />

        {[...grouped.entries()].map(([country, artists]) => {
          const pos = COUNTRY_POS[country];
          if (!pos) return null;
          const cx = (pos[0] / 100) * W;
          const cy = (pos[1] / 100) * H;
          return (
            <g key={country}>
              {artists.map((a, i) => {
                const angle = (i / artists.length) * Math.PI * 2;
                const offset = artists.length > 1 ? 9 + i * 1.5 : 0;
                const x = cx + Math.cos(angle) * offset;
                const y = cy + Math.sin(angle) * offset;
                const picked = picks.has(a.id);
                return (
                  <g key={a.id} style={{ cursor: "pointer" }} onClick={() => onOpen(a.id)}>
                    <title>{`${a.name} · ${country}`}</title>
                    <circle cx={x} cy={y} r={10} fill={DAY_ACCENT[a.day]} opacity={0.18} />
                    <circle cx={x} cy={y} r={picked ? 7 : 5}
                      fill={DAY_ACCENT[a.day]} opacity={picked ? 1 : 0.92}
                      stroke={picked ? C.ink : C.bg0}
                      strokeWidth={picked ? 1.5 : 0.5} />
                  </g>
                );
              })}
              <text x={cx} y={cy + 22} textAnchor="middle"
                fontFamily="ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace" fontSize={9}
                fill={C.inkMute} letterSpacing="0.08em">{country.toUpperCase()}</text>
            </g>
          );
        })}
      </svg>
    </ChartCard>
  );
}
