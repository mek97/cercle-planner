import { useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { AlertTriangle, X } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { ShareMenu } from "./ShareMenu";
import { toastConfirm } from "@/lib/confirm";
import { ARTISTS } from "@/data/artists";
import { GENRES, DAY_FULL, DAY_LABEL, DAY_ACCENT } from "@/data/genres";
import { SCHEDULE, STAGE_LABEL, findConflicts, timeToMin, type ScheduleEntry } from "@/data/schedule";
import type { Day } from "@/data/types";
import { SectionShell } from "./SectionShell";

interface Props {
  picks: Set<string>;
  remove: (id: string) => void;
  clear: () => void;
  onOpen: (id: string) => void;
}

const SCHED_BY_ID = new Map(SCHEDULE.map(s => [s.id, s]));
const ARTIST_BY_ID = new Map(ARTISTS.map(a => [a.id, a]));

const EMPTY: Record<Day, string> = {
  fri: "Nothing picked yet — Friday opens early on Ariane.",
  sat: "Saturday is the big one. Add a few names.",
  sun: "Sunday closes late on Ariane. Add picks to plan your run.",
};

function DayCol({
  day, picks, remove, onOpen, conflicts,
}: {
  day: Day;
  picks: Set<string>;
  remove: (id: string) => void;
  onOpen: (id: string) => void;
  conflicts: Map<string, string[]>;
}) {
  const pickedEntries = useMemo<ScheduleEntry[]>(() => {
    return [...picks]
      .map(id => SCHED_BY_ID.get(id))
      .filter((e): e is ScheduleEntry => !!e && e.day === day)
      .sort((a, b) => timeToMin(a.start) - timeToMin(b.start));
  }, [day, picks]);

  const accent = DAY_ACCENT[day];

  return (
    <div className="surface rounded-2xl min-h-[320px]">
      <div className="p-7">
        <header className="grid grid-cols-[1fr_auto] items-baseline gap-2 mb-6 pb-4 border-b border-[var(--color-line)] relative">
          <span className="absolute -bottom-px left-0 w-8 h-px" style={{ background: accent }} />
          <h3 className="font-[var(--font-display)] text-[26px] tracking-[-0.015em] col-start-1">{DAY_FULL[day]}</h3>
          <span className="font-mono text-[11px] tracking-[0.14em] text-[var(--color-ink-mute)] uppercase col-start-1 row-start-2">
            {DAY_LABEL[day].split("·")[1]?.trim()}
          </span>
          <b className="font-[var(--font-display)] text-[32px] italic font-normal col-start-2 row-span-2 self-center" style={{ color: accent }}>
            {pickedEntries.length}
          </b>
        </header>

        {pickedEntries.length === 0 ? (
          <p className="text-sm italic text-[var(--color-ink-mute)]">{EMPTY[day]}</p>
        ) : (
          <ol className="list-none p-0 m-0 relative">
            <span className="absolute left-[7px] top-2 bottom-2 w-px bg-[var(--color-line-strong)]" />
            <AnimatePresence initial={false}>
              {pickedEntries.map(e => {
                const a = ARTIST_BY_ID.get(e.id);
                if (!a) return null;
                const genres = a.genres.slice(0, 2).map(g => GENRES[g].label).join(" · ");
                const conflict = conflicts.get(e.id);
                return (
                  <motion.li
                    key={e.id} layout
                    initial={{ opacity: 0, x: -8 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -8 }}
                    transition={{ duration: 0.28 }}
                    className="relative pl-8 pb-5 group"
                  >
                    <span
                      className="absolute left-0 top-1.5 w-[15px] h-[15px] rounded-full bg-[var(--color-bg-0)] border-2"
                      style={{ borderColor: accent, boxShadow: `0 0 14px color-mix(in srgb, ${accent} 50%, transparent)` }}
                    />
                    <div className="font-mono text-[11px] tracking-[0.14em] text-[var(--color-ink-mute)] mb-1 flex items-center gap-2">
                      <span>{e.start}–{e.end}</span>
                      <span className="opacity-50">·</span>
                      <span style={{ color: accent }}>{STAGE_LABEL[e.stage]}</span>
                    </div>
                    <div
                      className="font-[var(--font-display)] text-[19px] leading-snug cursor-pointer transition-colors hover:[color:var(--accent)]"
                      style={{ ["--accent" as any]: accent }}
                      onClick={() => onOpen(e.id)}
                    >{a.name}</div>
                    <div className="text-xs text-[var(--color-ink-mute)] mt-1">{genres} · {a.bpm[0]}–{a.bpm[1]} BPM</div>
                    {conflict && conflict.length > 0 && (
                      <ConflictRow ids={conflict} onOpen={onOpen} />
                    )}
                    <button
                      className="absolute right-0 top-1 text-[var(--color-ink-mute)] hover:text-[var(--color-ink)] md:opacity-0 md:group-hover:opacity-100 opacity-60 transition-opacity p-1 leading-none focus-visible:opacity-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-sat)] rounded-sm"
                      onClick={() => remove(e.id)}
                      aria-label={`Remove ${a.name}`}
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </motion.li>
                );
              })}
            </AnimatePresence>
          </ol>
        )}
      </div>
    </div>
  );
}

function ConflictRow({ ids, onOpen }: { ids: string[]; onOpen: (id: string) => void }) {
  return (
    <div className="mt-2 flex items-center gap-1.5 text-[11px] text-rose-400 font-mono tracking-[0.06em]">
      <AlertTriangle className="w-3 h-3" />
      <span className="uppercase tracking-[0.16em] text-[10px]">Clash</span>
      <span className="text-[var(--color-ink-mute)] normal-case tracking-normal">vs</span>
      {ids.map((id, i) => {
        const a = ARTIST_BY_ID.get(id);
        if (!a) return null;
        return (
          <button
            key={id}
            onClick={() => onOpen(id)}
            className="text-[var(--color-ink-dim)] hover:text-[var(--color-ink)] underline-offset-2 hover:underline normal-case tracking-normal"
          >
            {a.name}{i < ids.length - 1 ? "," : ""}
          </button>
        );
      })}
    </div>
  );
}

export function PlanSection({ picks, remove, clear, onOpen }: Props) {
  const conflicts = useMemo(() => findConflicts(picks), [picks]);

  async function exportPlan() {
    const lines = ["CERCLE FESTIVAL 2026 — MY PLAN", "Paris · May 22-24", ""];
    (["fri", "sat", "sun"] as Day[]).forEach(d => {
      const list = [...picks]
        .map(id => SCHED_BY_ID.get(id))
        .filter((e): e is ScheduleEntry => !!e && e.day === d)
        .sort((a, b) => timeToMin(a.start) - timeToMin(b.start));
      if (!list.length) return;
      lines.push(DAY_LABEL[d].toUpperCase());
      list.forEach(e => {
        const a = ARTIST_BY_ID.get(e.id);
        if (!a) return;
        lines.push(`  ${e.start}–${e.end}  ${STAGE_LABEL[e.stage].padEnd(9)}  ${a.name}`);
      });
      lines.push("");
    });
    try {
      await navigator.clipboard.writeText(lines.join("\n"));
      toast.success("Plan copied to clipboard", {
        description: `${[...picks].length} pick${picks.size === 1 ? "" : "s"} · ready to paste`,
      });
    } catch {
      toast.error("Couldn't copy to clipboard", {
        description: "Check console for the plan text",
      });
      console.log(lines.join("\n"));
    }
  }

  async function handleClear() {
    if (picks.size === 0) return;
    const ok = await toastConfirm(
      `Clear all ${picks.size} pick${picks.size === 1 ? "" : "s"}?`,
      "Your plan will be reset. This can't be undone.",
      { confirmLabel: "Clear", destructive: true },
    );
    if (ok) {
      clear();
      toast.success("Plan cleared");
    }
  }

  return (
    <SectionShell
      id="plan"
      kicker="08 · Plan"
      title={<>Your weekend, <em className="display-em">choreographed</em></>}
      lede="Your weekend, neatly stacked. A column per day, real set times, every clash flagged. Designed so you can stop arguing with yourself in line and just commit."
    >
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <DayCol day="fri" picks={picks} remove={remove} onOpen={onOpen} conflicts={conflicts} />
        <DayCol day="sat" picks={picks} remove={remove} onOpen={onOpen} conflicts={conflicts} />
        <DayCol day="sun" picks={picks} remove={remove} onOpen={onOpen} conflicts={conflicts} />
      </div>

      <div className="flex gap-3 flex-wrap">
        <ShareMenu picks={picks} />
        <Button variant="outline" onClick={exportPlan}>Copy as text</Button>
        <Button variant="destructive" onClick={handleClear}>Clear all picks</Button>
      </div>
    </SectionShell>
  );
}
