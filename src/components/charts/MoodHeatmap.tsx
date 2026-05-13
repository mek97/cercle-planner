import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { ChevronDown } from "lucide-react";
import { ARTISTS } from "@/data/artists";
import { DAY_ACCENT } from "@/data/genres";
import { similarity } from "@/data/quiz";
import type { Artist, MoodKey } from "@/data/types";
import { useQuizResult } from "@/hooks/useQuizResult";
import { ChartCard } from "./ChartCard";
import { useChartTheme } from "./chartTheme";

const MOOD_AXES: MoodKey[] = ["euphoric", "hypnotic", "gritty", "dreamy", "danceable", "emotional"];
const MOOD_LABELS: Record<MoodKey, string> = {
  euphoric: "Euph", hypnotic: "Hypn", gritty: "Grit",
  dreamy: "Drm", danceable: "Dnce", emotional: "Emo",
};

const COLLAPSED_COUNT = 12;

interface Props {
  picks: Set<string>;
  onOpen: (id: string) => void;
}

type Sort = "match" | "name" | "day";

export function MoodHeatmap({ picks, onOpen }: Props) {
  const { result } = useQuizResult();
  const { C } = useChartTheme();
  const [sort, setSort] = useState<Sort>(result ? "match" : "name");
  const [expanded, setExpanded] = useState(false);

  const sorted = useMemo<Artist[]>(() => {
    const arr = [...ARTISTS];
    if (sort === "match" && result) {
      arr.sort((a, b) => similarity(result.moodVector, b.mood) - similarity(result.moodVector, a.mood));
    } else if (sort === "day") {
      arr.sort((a, b) => a.day.localeCompare(b.day) || a.name.localeCompare(b.name));
    } else {
      arr.sort((a, b) => a.name.localeCompare(b.name));
    }
    return arr;
  }, [sort, result]);

  const visible = expanded ? sorted : sorted.slice(0, COLLAPSED_COUNT);
  const hiddenCount = sorted.length - visible.length;

  // Mood sparkline geometry. Each row renders a 6-point polyline tracing
  // intensity (0..5) across the mood axes — left = EUPH, right = EMO.
  // When the user has taken the quiz we ghost their profile underneath so
  // the artist line reads as "matches" wherever they sit close together.
  const SPARK_W = 220;
  const SPARK_H = 28;
  const SPARK_PAD_X = 6;
  const SPARK_PAD_Y = 4;
  const usable = SPARK_W - SPARK_PAD_X * 2;
  const step = usable / (MOOD_AXES.length - 1);
  const innerH = SPARK_H - SPARK_PAD_Y * 2;

  function points(mood: Record<MoodKey, number>): { x: number; y: number }[] {
    return MOOD_AXES.map((m, i) => ({
      x: SPARK_PAD_X + i * step,
      y: SPARK_PAD_Y + innerH - (mood[m] / 5) * innerH,
    }));
  }
  function path(pts: { x: number; y: number }[]): string {
    return `M ${pts.map(p => `${p.x.toFixed(1)} ${p.y.toFixed(1)}`).join(" L ")}`;
  }
  function area(pts: { x: number; y: number }[]): string {
    const last = pts[pts.length - 1];
    const first = pts[0];
    return `${path(pts)} L ${last.x.toFixed(1)} ${SPARK_PAD_Y + innerH} L ${first.x.toFixed(1)} ${SPARK_PAD_Y + innerH} Z`;
  }
  const userPts = result ? points(result.moodVector) : null;

  return (
    <ChartCard
      title="Mood heatmap"
      sub={result
        ? `top ${visible.length} by match · click a row to open`
        : `top ${visible.length} of ${sorted.length} · intensity on six mood axes`}
      span={3}
      headerExtras={
        <div className="inline-flex rounded-full bg-white/[0.03] border border-[var(--color-line)] p-1 gap-1">
          {([
            { k: "match", l: "Match", disabled: !result },
            { k: "name", l: "Name", disabled: false },
            { k: "day", l: "Day", disabled: false },
          ] as { k: Sort; l: string; disabled: boolean }[]).map(opt => (
            <button
              key={opt.k}
              disabled={opt.disabled}
              onClick={() => setSort(opt.k)}
              className={[
                "px-3 h-7 rounded-full font-mono text-[10.5px] tracking-[0.12em] uppercase transition-all",
                sort === opt.k
                  ? "bg-[var(--color-ink)] text-[var(--color-bg-0)]"
                  : "text-[var(--color-ink-dim)] hover:text-[var(--color-ink)]",
                opt.disabled && "opacity-30 cursor-not-allowed",
              ].join(" ")}
            >
              {opt.l}
            </button>
          ))}
        </div>
      }
    >
      <div className="overflow-x-auto -mx-7 px-7">
        <div className="min-w-[500px]">
          {/* Axis-label header — spread under the sparkline column */}
          <div className="grid items-center mb-2 pb-2 border-b border-[var(--color-line)]"
            style={{ gridTemplateColumns: `150px ${SPARK_W}px ${result ? "44px" : "0px"}` }}>
            <div />
            <div className="relative" style={{ height: 12 }}>
              {MOOD_AXES.map((m, i) => {
                const x = SPARK_PAD_X + i * step;
                return (
                  <span key={m}
                    className="absolute font-mono text-[9px] tracking-[0.12em] uppercase text-[var(--color-ink-mute)]"
                    style={{ left: `${x}px`, transform: "translateX(-50%)", whiteSpace: "nowrap" }}
                  >
                    {MOOD_LABELS[m]}
                  </span>
                );
              })}
            </div>
            {result && (
              <div className="text-right font-mono text-[9.5px] tracking-[0.14em] uppercase text-[var(--color-ink-mute)]">
                %
              </div>
            )}
          </div>

          {/* User profile mini-row — references the ghost overlay below */}
          {result && userPts && (
            <div className="grid items-center mb-1 py-1"
              style={{ gridTemplateColumns: `150px ${SPARK_W}px 44px` }}>
              <div className="text-[11.5px] font-[var(--font-display)] italic flex items-center gap-1.5 text-[var(--color-ink)]">
                <Sparkle /> Your profile
              </div>
              <svg width={SPARK_W} height={SPARK_H} viewBox={`0 0 ${SPARK_W} ${SPARK_H}`} aria-hidden="true">
                <line x1={SPARK_PAD_X} y1={SPARK_PAD_Y + innerH}
                  x2={SPARK_W - SPARK_PAD_X} y2={SPARK_PAD_Y + innerH}
                  stroke="var(--color-line)" />
                <path d={area(userPts)} fill={C.sat} fillOpacity={0.16} />
                <path d={path(userPts)} fill="none" stroke={C.sat} strokeWidth={1.5}
                  strokeLinecap="round" strokeLinejoin="round" />
                {userPts.map((p, i) => (
                  <circle key={i} cx={p.x} cy={p.y} r={1.8} fill={C.sat} />
                ))}
              </svg>
              <div />
            </div>
          )}

          {/* Artist rows — sparkline per artist, ghost user-profile overlay */}
          <div className="space-y-0">
            {visible.map((a, i) => {
              const sim = result ? similarity(result.moodVector, a.mood) : 0;
              const isPicked = picks.has(a.id);
              const accent = DAY_ACCENT[a.day];
              const pts = points(a.mood);
              return (
                <motion.button
                  key={a.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.2, delay: i * 0.012 }}
                  onClick={() => onOpen(a.id)}
                  className="w-full grid items-center text-left rounded-md py-1 hover:bg-white/[0.04] transition-colors"
                  style={{ gridTemplateColumns: `150px ${SPARK_W}px 44px` }}
                >
                  <div className="flex items-center gap-2 pl-1 min-w-0">
                    <span className="inline-block w-1.5 h-1.5 rounded-full shrink-0"
                      style={{ background: accent }} />
                    <span className={[
                      "text-[12.5px] truncate",
                      isPicked ? "text-[var(--color-ink)] font-medium" : "text-[var(--color-ink-dim)]",
                    ].join(" ")}>
                      {a.name}
                    </span>
                  </div>
                  <svg width={SPARK_W} height={SPARK_H} viewBox={`0 0 ${SPARK_W} ${SPARK_H}`} aria-hidden="true">
                    <line x1={SPARK_PAD_X} y1={SPARK_PAD_Y + innerH}
                      x2={SPARK_W - SPARK_PAD_X} y2={SPARK_PAD_Y + innerH}
                      stroke="var(--color-line)" />
                    {userPts && (
                      <path d={path(userPts)} fill="none"
                        stroke={C.sat} strokeOpacity={0.22} strokeWidth={1}
                        strokeDasharray="2 2" />
                    )}
                    <path d={area(pts)} fill={accent} fillOpacity={0.14} />
                    <path d={path(pts)} fill="none" stroke={accent} strokeWidth={1.5}
                      strokeLinecap="round" strokeLinejoin="round" />
                    {pts.map((p, j) => (
                      <circle key={j} cx={p.x} cy={p.y} r={1.6} fill={accent} />
                    ))}
                  </svg>
                  {result && (
                    <div className="text-right pr-1">
                      <span className="font-mono text-[10.5px] tabular-nums text-[var(--color-ink-dim)]">
                        {Math.round(sim * 100)}
                      </span>
                    </div>
                  )}
                </motion.button>
              );
            })}
          </div>

          {hiddenCount > 0 || expanded ? (
            <div className="mt-3 pt-3 border-t border-[var(--color-line)] flex justify-center">
              <button
                onClick={() => setExpanded(e => !e)}
                className="font-mono text-[10.5px] tracking-[0.16em] uppercase text-[var(--color-ink-mute)] hover:text-[var(--color-ink)] inline-flex items-center gap-1.5 transition-colors"
              >
                <ChevronDown
                  className="w-3 h-3 transition-transform"
                  style={{ transform: expanded ? "rotate(180deg)" : undefined }}
                />
                {expanded ? `Show top ${COLLAPSED_COUNT}` : `Show all ${sorted.length}`}
              </button>
            </div>
          ) : null}
        </div>
      </div>
    </ChartCard>
  );
}

function Sparkle() {
  return (
    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}
      strokeLinecap="round" strokeLinejoin="round"
      style={{ color: "var(--color-sat)" }}>
      <path d="M12 3 L13.5 9.5 L20 11 L13.5 12.5 L12 19 L10.5 12.5 L4 11 L10.5 9.5 Z"/>
    </svg>
  );
}
