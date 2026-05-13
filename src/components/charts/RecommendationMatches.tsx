import { useMemo } from "react";
import { motion } from "framer-motion";
import { Check, Plus, Sparkles } from "lucide-react";
import { ARTISTS } from "@/data/artists";
import { DAY_ACCENT, DAY_LABEL } from "@/data/genres";
import { recommendationScore } from "@/data/quiz";
import type { Artist } from "@/data/types";
import { useQuizResult } from "@/hooks/useQuizResult";
import { ChartCard } from "./ChartCard";
import { useChartTheme } from "./chartTheme";

interface Props {
  picks: Set<string>;
  toggle: (id: string) => void;
  onOpen: (id: string) => void;
}

export function RecommendationMatches({ picks, toggle, onOpen }: Props) {
  const { result } = useQuizResult();
  const { C } = useChartTheme();

  const ranked = useMemo(() => {
    if (!result) return null;
    return ARTISTS
      .map(a => ({ a, score: recommendationScore(result, a) }))
      .sort((x, y) => y.score.total - x.score.total)
      .slice(0, 12);
  }, [result]);

  return (
    <ChartCard
      title="Your top matches"
      sub={result
        ? "ranked by mood, BPM, discovery appetite, and genre affinity"
        : "complete the quiz to unlock personalised matches"}
      span={3}
    >
      {!ranked ? (
        <div className="flex flex-col items-center justify-center py-16 text-center">
          <div className="w-14 h-14 rounded-full bg-[color-mix(in_srgb,var(--color-sat)_20%,transparent)] flex items-center justify-center mb-4">
            <Sparkles className="w-6 h-6" style={{ color: C.sat }} />
          </div>
          <p className="font-[var(--font-display)] text-[20px] tracking-[-0.01em] max-w-[420px]">
            Take the persona quiz at the top of the page to see your top artist matches here.
          </p>
          <p className="text-[var(--color-ink-mute)] text-sm mt-2">
            Mood leads the score, with BPM, discovery appetite, and genre affinity as tie-breakers.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-2.5">
          {ranked.map((r, idx) => (
            <MatchRow
              key={r.a.id} artist={r.a} rank={idx + 1}
              score={r.score.total}
              picked={picks.has(r.a.id)}
              toggle={() => toggle(r.a.id)}
              onOpen={() => onOpen(r.a.id)}
            />
          ))}
        </div>
      )}
    </ChartCard>
  );
}

function MatchRow({
  artist, score, rank, picked, toggle, onOpen,
}: {
  artist: Artist; score: number; rank: number;
  picked: boolean; toggle: () => void; onOpen: () => void;
}) {
  const accent = DAY_ACCENT[artist.day];
  const pct = Math.max(0, Math.min(100, Math.round(score * 100)));

  return (
    <motion.div
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.32, delay: rank * 0.03 }}
      className="grid grid-cols-[28px_1fr_auto] items-center gap-3 py-2.5 group cursor-pointer"
      onClick={onOpen}
    >
      <span className="font-[var(--font-display)] italic text-[var(--color-ink-mute)] text-[18px] text-center leading-none">
        {String(rank).padStart(2, "0")}
      </span>

      <div className="min-w-0">
        <div className="flex items-baseline gap-3">
          <span className="font-[var(--font-display)] text-[17px] tracking-[-0.005em] truncate group-hover:text-[var(--color-ink)] transition-colors">
            {artist.name}
          </span>
          <span className="font-mono text-[10px] tracking-[0.14em] uppercase shrink-0" style={{ color: accent }}>
            {DAY_LABEL[artist.day]}
          </span>
        </div>
        <div className="mt-1.5 h-1.5 rounded-full bg-[var(--color-line)] overflow-hidden relative">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${pct}%` }}
            transition={{ duration: 0.9, delay: rank * 0.03, ease: [0.2, 0.8, 0.2, 1] }}
            className="h-full rounded-full"
            style={{
              background: `linear-gradient(90deg, ${accent}, var(--color-sat))`,
            }}
          />
        </div>
      </div>

      <div className="flex items-center gap-3 shrink-0">
        <span className="font-mono text-[12px] tabular-nums text-[var(--color-ink-dim)] w-10 text-right">
          {pct}%
        </span>
        <button
          onClick={(e) => { e.stopPropagation(); toggle(); }}
          aria-label={picked ? "Remove" : "Add to plan"}
          className="w-7 h-7 rounded-full border inline-flex items-center justify-center transition-all hover:scale-110"
          style={picked
            ? { background: accent, color: "#0a0810", borderColor: accent }
            : { background: "rgba(255,255,255,0.04)", borderColor: "var(--color-line)", color: "var(--color-ink-dim)" }}
        >
          {picked ? <Check className="w-3 h-3" /> : <Plus className="w-3 h-3" />}
        </button>
      </div>
    </motion.div>
  );
}
