import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { AlertTriangle, Check, Plus, Rocket } from "lucide-react";
import { ARTISTS } from "@/data/artists";
import { DAY_ACCENT, DAY_FULL, GENRES } from "@/data/genres";
import {
  DAY_START_MIN, DAY_RANGE_MIN, HOUR_MARKS,
  STAGES, STAGE_TAG, entriesForDay, findAlternateIds, findConflicts,
  leftPct, widthPct, talksForDay, type ScheduleEntry, type TalkEntry,
} from "@/data/schedule";
import type { Day } from "@/data/types";
import { SectionShell } from "./SectionShell";
import { Switch } from "@/components/ui/switch";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";

interface Props {
  picks: Set<string>;
  toggle: (id: string) => void;
  onOpen: (id: string) => void;
}

const ARTIST_BY_ID = new Map(ARTISTS.map(a => [a.id, a]));
const DAYS: Day[] = ["fri", "sat", "sun"];

export function ScheduleSection({ picks, toggle, onOpen }: Props) {
  const [onlyPicked, setOnlyPicked] = useState(false);

  const conflictsMap = useMemo(() => findConflicts(picks), [picks]);
  const alternateIds = useMemo(() => findAlternateIds(picks), [picks]);

  return (
    <SectionShell
      id="schedule"
      kicker="06 · Schedule"
      title={<>Your festival, <em className="display-em">hour by hour</em></>}
      lede="Three days, three stages, one Cupola full of talks (yes, talks at a music festival — very cute). Tap a block to dig in, hit + to lock it in. Clashes get a red dot so you can argue with yourself about which one to skip."
    >
      <div className="mb-4 px-3 py-2.5 rounded-lg border border-dashed border-[var(--color-line-strong)] bg-[color-mix(in_srgb,var(--color-accent)_5%,transparent)] text-[12px] text-[var(--color-ink-dim)] inline-flex items-center gap-2.5 flex-wrap">
        <span className="font-mono text-[9.5px] tracking-[0.18em] uppercase text-[var(--color-accent)]">Heads up</span>
        <span>Set times reflect the published timetable. Festival schedules can change — always cross-check the{" "}
          <a href="https://festival.cercle.io/line-up" target="_blank" rel="noopener noreferrer"
            className="text-[var(--color-ink)] underline-offset-2 hover:underline">
            official site
          </a>{" "}before the gates open.
        </span>
      </div>

      {/* global controls */}
      <div className="flex items-start sm:items-center justify-between gap-3 mb-6 flex-wrap">
        <div className="flex items-center gap-x-4 gap-y-1.5 flex-wrap font-mono text-[10.5px] sm:text-[11px] tracking-[0.06em] sm:tracking-[0.08em] text-[var(--color-ink-dim)]">
          <span className="uppercase tracking-[0.14em] text-[var(--color-ink-mute)]">Legend</span>
          {DAYS.map(d => (
            <span key={d} className="inline-flex items-center gap-2">
              <i className="w-2.5 h-2.5 rounded-full" style={{ background: DAY_ACCENT[d], boxShadow: `0 0 6px ${DAY_ACCENT[d]}` }} />
              {DAY_FULL[d]}
            </span>
          ))}
          <span className="inline-flex items-center gap-2">
            <Rocket className="w-3 h-3" style={{ color: "var(--color-accent)" }} />
            Cupola talks
          </span>
          <span className="inline-flex items-center gap-2">
            <i
              className="inline-block w-3 h-3 rounded-sm border border-dashed"
              style={{
                borderColor: "color-mix(in srgb, var(--color-accent) 55%, transparent)",
                background: "color-mix(in srgb, var(--color-accent) 10%, transparent)",
              }}
            />
            Alternates
          </span>
        </div>
        <label className="inline-flex items-center gap-2.5 cursor-pointer">
          <span className="font-mono text-[11px] tracking-[0.06em] text-[var(--color-ink-dim)] uppercase">Only my picks</span>
          <Switch checked={onlyPicked} onCheckedChange={setOnlyPicked} />
        </label>
      </div>

      {/* three day tables stacked */}
      <div className="space-y-7">
        {DAYS.map(day => (
          <DaySchedule
            key={day}
            day={day}
            onlyPicked={onlyPicked}
            picks={picks}
            conflictsMap={conflictsMap}
            alternateIds={alternateIds}
            toggle={toggle}
            onOpen={onOpen}
          />
        ))}
      </div>
    </SectionShell>
  );
}

interface DayProps {
  day: Day;
  onlyPicked: boolean;
  picks: Set<string>;
  conflictsMap: Map<string, string[]>;
  alternateIds: Set<string>;
  toggle: (id: string) => void;
  onOpen: (id: string) => void;
}

function DaySchedule({ day, onlyPicked, picks, conflictsMap, alternateIds, toggle, onOpen }: DayProps) {
  const entries = useMemo(() => entriesForDay(day), [day]);
  const talks = useMemo(() => talksForDay(day), [day]);

  const byStage = useMemo(() => {
    const m = new Map<string, ScheduleEntry[]>();
    STAGES.forEach(s => m.set(s, []));
    entries.forEach(e => m.get(e.stage)?.push(e));
    return m;
  }, [entries]);

  const pickedCount = entries.filter(e => picks.has(e.id)).length;
  const conflictsThisDay = useMemo(() => {
    const ids = new Set(entries.filter(e => picks.has(e.id)).map(e => e.id));
    return [...conflictsMap.entries()].filter(([id]) => ids.has(id));
  }, [entries, picks, conflictsMap]);

  const accent = DAY_ACCENT[day];

  return (
    <div className="surface rounded-2xl overflow-hidden">
      {/* day header */}
      <div className="px-5 md:px-7 pt-5 pb-4 border-b border-[var(--color-line)] flex items-center justify-between gap-4 flex-wrap relative">
        <div
          aria-hidden
          className="absolute top-0 left-0 h-full pointer-events-none"
          style={{
            width: 220,
            background: `linear-gradient(90deg, color-mix(in srgb, ${accent} 18%, transparent), transparent)`,
          }}
        />
        <div className="relative">
          <div className="flex items-baseline gap-3">
            <h3 className="font-[var(--font-display)] text-[clamp(28px,3.4vw,38px)] tracking-[-0.018em] leading-none"
              style={{ color: accent }}>
              {DAY_FULL[day]}
            </h3>
            <span className="font-mono text-[11px] tracking-[0.14em] text-[var(--color-ink-mute)] uppercase">
              {day === "fri" ? "May 22" : day === "sat" ? "May 23" : "May 24"}
            </span>
          </div>
          <div className="mt-1 font-mono text-[11px] tracking-[0.06em] text-[var(--color-ink-dim)]">
            {entries.length} sets · {talks.length} talks · {pickedCount} picked
            {conflictsThisDay.length > 0 && (
              <span className="text-rose-400 ml-2 inline-flex items-center gap-1">
                <AlertTriangle className="w-3 h-3" />
                {conflictsThisDay.length} time clash{conflictsThisDay.length === 1 ? "" : "es"}
              </span>
            )}
          </div>
        </div>
      </div>

      {/* gantt body */}
      <div className="overflow-x-auto">
        <div className="min-w-[720px] md:min-w-[940px] px-5 md:px-7 pt-5 pb-5">
          {/* time axis */}
          <div className="relative h-9 ml-[88px] md:ml-[130px] mb-2 border-b border-[var(--color-line)]">
            {HOUR_MARKS.map(h => {
              const minOfHour = h * 60;
              const left = ((minOfHour - DAY_START_MIN) / DAY_RANGE_MIN) * 100;
              if (left < 0 || left > 100) return null;
              return (
                <div key={h} className="absolute top-0 bottom-0 flex flex-col items-start" style={{ left: `${left}%` }}>
                  <span className="font-mono text-[10.5px] tracking-[0.1em] text-[var(--color-ink-mute)] -translate-x-1/2 pt-2">
                    {String(h).padStart(2, "0")}:00
                  </span>
                </div>
              );
            })}
          </div>

          {/* music stages */}
          {STAGES.map((stage, stageIdx) => {
            const stageEntries = byStage.get(stage) || [];
            const visible = onlyPicked
              ? stageEntries.filter(e => picks.has(e.id))
              : stageEntries;
            return (
              <div
                key={stage}
                className={cn(
                  "grid grid-cols-[88px_1fr] md:grid-cols-[130px_1fr] items-stretch min-h-[92px]",
                  stageIdx > 0 && "border-t border-[var(--color-line)]"
                )}
              >
                <div className="py-3 pr-4 flex flex-col justify-center border-r border-[var(--color-line)]">
                  <span className="font-[var(--font-display)] text-[20px] tracking-[-0.012em]">
                    {stage}
                  </span>
                  <span className="font-mono text-[9px] tracking-[0.14em] text-[var(--color-ink-mute)] uppercase mt-0.5">
                    {STAGE_TAG[stage]}
                  </span>
                  <span className="font-mono text-[10px] text-[var(--color-ink-faint)] mt-1 tracking-[0.06em]">
                    {stageEntries.length} sets
                  </span>
                </div>

                <div className="relative h-[92px]">
                  {HOUR_MARKS.map(h => {
                    const left = ((h * 60 - DAY_START_MIN) / DAY_RANGE_MIN) * 100;
                    if (left < 0 || left > 100) return null;
                    const isHalf = h % 2 === 0;
                    return (
                      <div key={h} className="absolute top-2 bottom-2 w-px"
                        style={{
                          left: `${left}%`,
                          background: isHalf ? "var(--color-line-strong)" : "var(--color-line)",
                          opacity: isHalf ? 0.4 : 0.6,
                        }} />
                    );
                  })}

                  {visible.map((e, idx) => (
                    <SetBlock
                      key={e.id}
                      entry={e}
                      idx={idx}
                      accent={accent}
                      isPicked={picks.has(e.id)}
                      isConflict={conflictsMap.has(e.id) && picks.has(e.id)}
                      isAlternate={alternateIds.has(e.id)}
                      onOpen={() => onOpen(e.id)}
                      onToggle={() => toggle(e.id)}
                    />
                  ))}
                </div>
              </div>
            );
          })}

          {/* Cupola talks — always rendered */}
          {talks.length > 0 && (
            <div className="grid grid-cols-[88px_1fr] md:grid-cols-[130px_1fr] items-stretch min-h-[68px] border-t border-dashed border-[var(--color-line)]">
              <div className="py-3 pr-4 flex flex-col justify-center border-r border-dashed border-[var(--color-line)]">
                <span className="font-[var(--font-display)] text-[18px] tracking-[-0.01em] flex items-center gap-2">
                  <Rocket className="w-3.5 h-3.5 text-[var(--color-accent)]" />
                  Cupola
                </span>
                <span className="font-mono text-[9px] tracking-[0.14em] text-[var(--color-ink-mute)] uppercase mt-0.5">
                  Conference talks
                </span>
                <span className="font-mono text-[10px] text-[var(--color-ink-faint)] mt-1 tracking-[0.06em]">
                  {talks.length} talks
                </span>
              </div>
              <div className="relative h-[68px]">
                {HOUR_MARKS.map(h => {
                  const left = ((h * 60 - DAY_START_MIN) / DAY_RANGE_MIN) * 100;
                  if (left < 0 || left > 100) return null;
                  const isHalf = h % 2 === 0;
                  return (
                    <div key={h} className="absolute top-2 bottom-2 w-px"
                      style={{
                        left: `${left}%`,
                        background: isHalf ? "var(--color-line-strong)" : "var(--color-line)",
                        opacity: isHalf ? 0.4 : 0.6,
                      }} />
                  );
                })}
                {talks.map((t, idx) => (
                  <TalkBlock key={`${t.day}-${t.start}-${idx}`} talk={t} idx={idx} />
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function SetBlock({
  entry: e, idx, accent, isPicked, isConflict, isAlternate, onOpen, onToggle,
}: {
  entry: ScheduleEntry; idx: number; accent: string;
  isPicked: boolean; isConflict: boolean; isAlternate: boolean;
  onOpen: () => void;
  onToggle: () => void;
}) {
  const artist = ARTIST_BY_ID.get(e.id);
  if (!artist) return null;
  const genreColor = GENRES[artist.genres[0]].color;
  const ACCENT_CYAN = "var(--color-accent)";

  // Restructure so the block body and the pick toggle are siblings (no nested-button HTML).
  return (
    <motion.div
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.28, delay: idx * 0.025 }}
      className="absolute top-3 bottom-3 rounded-lg overflow-hidden hover:z-[2]"
      style={{
        left: `${leftPct(e.start)}%`,
        width: `${widthPct(e.start, e.end)}%`,
        minWidth: "2px",
      }}
    >
      <Tooltip delayDuration={150}>
        <TooltipTrigger asChild>
          <button
            type="button"
            onClick={onOpen}
            className={cn(
              "relative w-full h-full rounded-lg overflow-hidden text-left transition-all cursor-pointer border",
              "hover:scale-[1.02] hover:shadow-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-sat)]",
            )}
            style={{
              background: isPicked
                ? `linear-gradient(135deg, ${accent} 0%, color-mix(in srgb, ${accent} 55%, transparent) 100%)`
                : isAlternate
                  ? `color-mix(in srgb, ${ACCENT_CYAN} 8%, transparent)`
                  : "color-mix(in srgb, white 3%, transparent)",
              borderColor: isPicked
                ? accent
                : isConflict ? "rgba(255,93,138,0.6)"
                : isAlternate ? `color-mix(in srgb, ${ACCENT_CYAN} 45%, transparent)`
                : "var(--color-line)",
              borderStyle: isAlternate && !isPicked ? "dashed" : "solid",
              boxShadow: isPicked
                ? `0 6px 18px -6px ${accent}`
                : isConflict ? "0 0 0 1px rgba(255,93,138,0.3)"
                : isAlternate ? `0 0 0 1px color-mix(in srgb, ${ACCENT_CYAN} 25%, transparent)`
                : undefined,
              color: isPicked ? "#0a0810" : "var(--color-ink-dim)",
            }}
          >
            <div className="h-full px-2.5 pr-7 py-1.5 flex flex-col justify-between">
              <div>
                <div className="h-[3px] -mx-2.5 -mt-1.5 mb-1.5" style={{ background: genreColor, opacity: isPicked ? 0.5 : 0.8 }} />
                <div className="text-[13px] font-medium leading-tight truncate flex items-center gap-1.5"
                  style={isPicked ? undefined : { color: "var(--color-ink)" }}>
                  <span className="truncate">{artist.name}</span>
                  {e.setType && (
                    <span
                      className="font-mono text-[8.5px] tracking-[0.12em] uppercase px-1 py-px rounded shrink-0"
                      style={isPicked
                        ? { background: "rgba(0,0,0,0.18)", color: "rgba(0,0,0,0.7)" }
                        : { background: "var(--color-line)", color: "var(--color-ink-mute)" }}
                    >{e.setType}</span>
                  )}
                </div>
              </div>
              <div className="font-mono text-[9.5px] tracking-[0.06em] flex items-center justify-between gap-1.5">
                <span style={isPicked ? { color: "rgba(0,0,0,0.7)" } : { color: "var(--color-ink-mute)" }}>
                  {e.start}–{e.end}
                </span>
                {isConflict && <AlertTriangle className="w-3 h-3 text-rose-400" />}
              </div>
            </div>
          </button>
        </TooltipTrigger>
        <TooltipContent side="top">
          <div>
            <div className="font-[var(--font-display)] text-sm">{artist.name}</div>
            <div className="text-[10px] text-[var(--color-ink-dim)] mt-0.5">
              {e.stage} · {e.start}–{e.end} · {artist.bpm[0]}–{artist.bpm[1]} BPM
            </div>
            {isConflict && (
              <div className="text-[10px] mt-1.5 text-rose-400 font-medium">
                Conflicts with another pick
              </div>
            )}
            {!isPicked && isAlternate && (
              <div className="text-[10px] mt-1.5 font-medium" style={{ color: "var(--color-accent)" }}>
                Alternate · plays at the same time as a pick
              </div>
            )}
          </div>
        </TooltipContent>
      </Tooltip>

      {/* sibling pick toggle for touch + keyboard friendliness */}
      <button
        type="button"
        onClick={(ev) => { ev.stopPropagation(); onToggle(); }}
        aria-label={isPicked ? `Remove ${artist.name} from plan` : `Add ${artist.name} to plan`}
        aria-pressed={isPicked}
        className="absolute top-1.5 right-1.5 w-[18px] h-[18px] rounded-full inline-flex items-center justify-center text-[10px] leading-none transition-all hover:scale-110 z-[1] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
        style={isPicked
          ? { background: "rgba(0,0,0,0.2)", color: "rgba(0,0,0,0.85)" }
          : { background: "rgba(255,255,255,0.08)", color: "var(--color-ink-dim)", border: "1px solid var(--color-line)" }}
      >
        {isPicked ? <Check className="w-2.5 h-2.5" /> : <Plus className="w-2.5 h-2.5" />}
      </button>
    </motion.div>
  );
}

function TalkBlock({ talk: t, idx }: { talk: TalkEntry; idx: number }) {
  return (
    <Tooltip delayDuration={150}>
      <TooltipTrigger asChild>
        <motion.div
          initial={{ opacity: 0, y: 4 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: idx * 0.025 }}
          className="absolute top-2.5 bottom-2.5 rounded-md overflow-hidden cursor-default border border-dashed flex items-center px-2"
          style={{
            left: `${leftPct(t.start)}%`,
            width: `${widthPct(t.start, t.end)}%`,
            background: "color-mix(in srgb, var(--color-accent) 8%, transparent)",
            borderColor: "color-mix(in srgb, var(--color-accent) 35%, transparent)",
            color: "var(--color-ink-dim)",
            minWidth: "2px",
          }}
        >
          <span className="text-[10.5px] leading-tight truncate font-medium" style={{ color: "var(--color-accent)" }}>
            {t.title}
          </span>
        </motion.div>
      </TooltipTrigger>
      <TooltipContent side="top">
        <div>
          <div className="font-[var(--font-display)] text-sm flex items-center gap-1.5">
            <Rocket className="w-3 h-3" style={{ color: "var(--color-accent)" }} />
            {t.title}
          </div>
          <div className="text-[10px] text-[var(--color-ink-dim)] mt-0.5">
            Cupola · {t.start}–{t.end}
          </div>
        </div>
      </TooltipContent>
    </Tooltip>
  );
}

