import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { ARTISTS } from "@/data/artists";
import { DAY_ACCENT, DAY_LABEL } from "@/data/genres";
import type { Artist, MoodKey } from "@/data/types";
import { parseListeners } from "@/utils";
import { ChartCard } from "./ChartCard";
import { useChartTheme } from "./chartTheme";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

type Axis = "bpm" | "euphoric" | "hypnotic" | "gritty" | "dreamy" | "danceable" | "emotional";

const AXIS_LABEL: Record<Axis, string> = {
  bpm: "BPM", euphoric: "Euphoric", hypnotic: "Hypnotic",
  gritty: "Gritty", dreamy: "Dreamy", danceable: "Danceable", emotional: "Emotional",
};
const AXIS_OPTIONS: Axis[] = ["bpm", "euphoric", "hypnotic", "gritty", "dreamy", "danceable", "emotional"];

function axisValue(a: Artist, axis: Axis): number {
  if (axis === "bpm") return (a.bpm[0] + a.bpm[1]) / 2;
  return a.mood[axis as MoodKey];
}
function axisRange(axis: Axis): [number, number] {
  if (axis === "bpm") return [90, 170];
  return [1, 5];
}

interface Props {
  picks: Set<string>;
  onOpen: (id: string) => void;
}

export function VibeMap({ picks, onOpen }: Props) {
  const { C } = useChartTheme();
  const [x, setX] = useState<Axis>("bpm");
  const [y, setY] = useState<Axis>("emotional");
  const [hover, setHover] = useState<string | null>(null);

  const W = 760, H = 500;
  const padL = 64, padR = 32, padT = 24, padB = 56;
  const innerW = W - padL - padR;
  const innerH = H - padT - padB;
  const [xMin, xMax] = axisRange(x);
  const [yMin, yMax] = axisRange(y);

  const seeded = (id: string) => {
    let h = 0; for (let i = 0; i < id.length; i++) h = (h * 31 + id.charCodeAt(i)) | 0;
    return ((h % 1000) / 1000 - 0.5) * 0.25;
  };

  const points = useMemo(() => {
    return ARTISTS.map(a => {
      const vx = axisValue(a, x);
      const vy = axisValue(a, y);
      const jx = x === "bpm" ? 0 : seeded(a.id + "x") * 2;
      const jy = y === "bpm" ? 0 : seeded(a.id + "y") * 2;
      const px = padL + ((vx + jx - xMin) / (xMax - xMin)) * innerW;
      const py = padT + innerH - ((vy + jy - yMin) / (yMax - yMin)) * innerH;
      const listeners = parseListeners(a.details.listeners) || 100_000;
      const radius = Math.max(4, Math.min(16, Math.log10(listeners / 1e4) * 3.5));
      return { a, px, py, radius, listeners };
    });
  }, [x, y, xMin, xMax, yMin, yMax, innerW, innerH]);

  const xTicks = x === "bpm" ? [100, 120, 140, 160] : [1, 2, 3, 4, 5];
  const yTicks = y === "bpm" ? [100, 120, 140, 160] : [1, 2, 3, 4, 5];

  const dayHex: Record<"fri" | "sat" | "sun", string> = { fri: C.fri, sat: C.sat, sun: C.sun };

  const axisPicker = (
    <div className="flex gap-2.5 flex-wrap items-center">
      {(["X", "Y"] as const).map(label => {
        const value = label === "X" ? x : y;
        const setter = label === "X" ? setX : setY;
        return (
          <div key={label} className="inline-flex items-center gap-2.5">
            <span className="font-mono text-[10.5px] tracking-[0.16em] uppercase text-[var(--color-ink-mute)]">{label}</span>
            <Select value={value} onValueChange={(v) => setter(v as Axis)}>
              {/* Wide enough for the longest label ("Danceable" / "Emotional")
                  so the trigger doesn't wrap onto two lines. */}
              <SelectTrigger className="w-[150px] whitespace-nowrap"><SelectValue /></SelectTrigger>
              <SelectContent>
                {AXIS_OPTIONS.map(o => (
                  <SelectItem key={o} value={o}>{AXIS_LABEL[o]}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        );
      })}
    </div>
  );

  return (
    <ChartCard
      title="Vibe map"
      sub="every artist on a 2D mood / tempo plane · click any dot"
      span={3}
      headerExtras={axisPicker}
    >
      <svg viewBox={`0 0 ${W} ${H}`} className="w-full h-auto">
        <defs>
          {(["fri", "sat", "sun"] as const).map(d => (
            <radialGradient key={d} id={`vm-${d}`}>
              <stop offset="0%" stopColor={dayHex[d]} stopOpacity={1} />
              <stop offset="100%" stopColor={dayHex[d]} stopOpacity={0.3} />
            </radialGradient>
          ))}
        </defs>

        <line x1={padL + innerW / 2} y1={padT} x2={padL + innerW / 2} y2={padT + innerH}
          stroke={C.line} strokeDasharray="2,4" />
        <line x1={padL} y1={padT + innerH / 2} x2={padL + innerW} y2={padT + innerH / 2}
          stroke={C.line} strokeDasharray="2,4" />

        {xTicks.map(v => {
          const px = padL + ((v - xMin) / (xMax - xMin)) * innerW;
          return (
            <g key={`xt-${v}`}>
              <line x1={px} y1={padT + innerH} x2={px} y2={padT + innerH + 5} stroke={C.inkMute} strokeWidth={1} />
              <text x={px} y={padT + innerH + 20} textAnchor="middle"
                fontFamily="ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace" fontSize={10} fill={C.inkMute}>{v}</text>
            </g>
          );
        })}
        {yTicks.map(v => {
          const py = padT + innerH - ((v - yMin) / (yMax - yMin)) * innerH;
          return (
            <g key={`yt-${v}`}>
              <line x1={padL - 5} y1={py} x2={padL} y2={py} stroke={C.inkMute} strokeWidth={1} />
              <text x={padL - 10} y={py + 3} textAnchor="end"
                fontFamily="ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace" fontSize={10} fill={C.inkMute}>{v}</text>
            </g>
          );
        })}

        <text x={padL + innerW / 2} y={H - 8} textAnchor="middle"
          fontFamily="ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace" fontSize={11} letterSpacing="0.18em" fill={C.inkDim}>
          {AXIS_LABEL[x].toUpperCase()} →
        </text>
        <text transform={`rotate(-90 14 ${padT + innerH / 2})`}
          x={14} y={padT + innerH / 2 + 3} textAnchor="middle"
          fontFamily="ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace" fontSize={11} letterSpacing="0.18em" fill={C.inkDim}>
          {AXIS_LABEL[y].toUpperCase()} →
        </text>

        {points.map(({ a, px, py, radius }) => {
          const isHover = hover === a.id;
          const isPicked = picks.has(a.id);
          return (
            <motion.g
              key={a.id} style={{ cursor: "pointer" }}
              onMouseEnter={() => setHover(a.id)}
              onMouseLeave={() => setHover(null)}
              onClick={() => onOpen(a.id)}
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.45, delay: Math.random() * 0.35, ease: [0.2, 0.8, 0.2, 1] }}
            >
              <circle cx={px} cy={py} r={radius + 6}
                fill={`url(#vm-${a.day})`} opacity={isHover ? 0.5 : 0.28} />
              <circle cx={px} cy={py} r={radius}
                fill={DAY_ACCENT[a.day]} opacity={isHover ? 1 : 0.9}
                stroke={isPicked ? C.ink : C.lineBright}
                strokeWidth={isPicked ? 2 : 1} />
            </motion.g>
          );
        })}

        {hover && (() => {
          const p = points.find(pt => pt.a.id === hover);
          if (!p) return null;
          const above = p.py > 60;
          const ty = above ? p.py - p.radius - 12 : p.py + p.radius + 22;
          return (
            <g pointerEvents="none">
              <text x={p.px} y={ty} textAnchor="middle"
                fontFamily="Georgia, serif" fontSize={17} fontWeight={500}
                fill={C.ink} stroke={C.bg0} strokeWidth={4} paintOrder="stroke">
                {p.a.name}
              </text>
              <text x={p.px} y={ty + 14} textAnchor="middle"
                fontFamily="ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace" fontSize={10}
                fill={C.inkDim} stroke={C.bg0} strokeWidth={3} paintOrder="stroke">
                {DAY_LABEL[p.a.day]} · {p.a.details.listeners}
              </text>
            </g>
          );
        })()}
      </svg>

      <div className="flex gap-5 flex-wrap mt-3.5 font-mono text-[11px] tracking-[0.12em] uppercase text-[var(--color-ink-dim)]">
        {(["fri", "sat", "sun"] as const).map(d => (
          <span key={d} className="inline-flex items-center gap-2">
            <i className="w-2.5 h-2.5 rounded-full"
              style={{ background: dayHex[d], boxShadow: `0 0 8px ${dayHex[d]}` }} />
            {d === "fri" ? "Friday" : d === "sat" ? "Saturday" : "Sunday"}
          </span>
        ))}
        <span className="ml-auto text-[var(--color-ink-mute)] italic font-[var(--font-display)] text-[12.5px] tracking-normal normal-case">
          Circle size = monthly listeners
        </span>
      </div>
    </ChartCard>
  );
}
