import { useMemo } from "react";
import { motion } from "framer-motion";
import { toast } from "sonner";
import { RotateCcw, Sparkles } from "lucide-react";
import { toastConfirm } from "@/lib/confirm";
import { PolarAngleAxis, PolarGrid, Radar, RadarChart, ResponsiveContainer } from "recharts";
import { PERSONAS } from "@/data/personas";
import { useColors } from "@/data/useColors";
import { useQuizResult } from "@/hooks/useQuizResult";
import type { MoodKey, PersonaKey } from "@/data/types";
import { Button } from "@/components/ui/button";
import { ProfileShareButtons } from "./ProfileShareButtons";

const MOOD_AXES: MoodKey[] = ["euphoric", "hypnotic", "gritty", "dreamy", "danceable", "emotional"];
const MOOD_LABELS: Record<MoodKey, string> = {
  euphoric: "Euph", hypnotic: "Hypn", gritty: "Grit",
  dreamy: "Drm", danceable: "Dnce", emotional: "Emo",
};

export function QuizProfileCard() {
  const { result, clear } = useQuizResult();
  const C = useColors();

  const personaShares = useMemo(() => {
    if (!result) return [];
    const total = Object.values(result.personaScores).reduce((s, v) => s + v, 0);
    return (Object.entries(result.personaScores) as [PersonaKey, number][])
      .map(([k, v]) => ({ key: k, share: total > 0 ? (v / total) * 100 : 0 }))
      .sort((a, b) => b.share - a.share);
  }, [result]);

  if (!result) {
    return (
      <div className="surface rounded-2xl p-7 flex flex-col md:flex-row items-start md:items-center gap-5 mb-5">
        <div
          className="w-14 h-14 rounded-full flex items-center justify-center shrink-0"
          style={{ background: "color-mix(in srgb, var(--color-sat) 18%, transparent)" }}
        >
          <Sparkles className="w-6 h-6" style={{ color: C.sat }} />
        </div>
        <div className="flex-1 min-w-0">
          <div className="font-[var(--font-display)] text-[22px] tracking-[-0.012em] leading-tight">
            No quiz result yet.
          </div>
          <p className="text-[var(--color-ink-mute)] text-sm mt-1 leading-relaxed">
            Take the 7-question persona quiz above and your festival profile will live here — persona breakdown, mood vector, BPM target — driving every recommendation below.
          </p>
        </div>
        <Button asChild variant="glow">
          <a href="#quiz">Take the quiz →</a>
        </Button>
      </div>
    );
  }

  const primary = PERSONAS[result.primaryPersona];
  const secondary = PERSONAS[result.secondaryPersona];

  const radarData = MOOD_AXES.map(axis => ({
    axis: MOOD_LABELS[axis],
    value: result.moodVector[axis],
  }));

  return (
    <motion.div
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: [0.2, 0.8, 0.2, 1] }}
      className="surface rounded-2xl overflow-hidden mb-5"
    >
      <div className="grid lg:grid-cols-[280px_1fr_1fr] gap-px bg-[var(--color-line)]">
        {/* persona art */}
        <div className="bg-[var(--color-bg-1)] p-7 flex flex-col items-center text-center relative overflow-hidden">
          <div
            aria-hidden
            className="absolute inset-0 pointer-events-none"
            style={{
              background: `radial-gradient(circle at 50% 35%, color-mix(in srgb, ${primary.color} 28%, transparent), transparent 65%)`,
            }}
          />
          <svg viewBox="0 0 200 200" className="w-[180px] h-[180px] relative">
            <defs>
              <radialGradient id="qpc-primary" cx="50%" cy="50%" r="50%">
                <stop offset="0%" stopColor={primary.color} stopOpacity={0.95} />
                <stop offset="100%" stopColor={primary.color} stopOpacity={0} />
              </radialGradient>
              <radialGradient id="qpc-secondary" cx="50%" cy="50%" r="50%">
                <stop offset="0%" stopColor={secondary.color} stopOpacity={0.5} />
                <stop offset="100%" stopColor={secondary.color} stopOpacity={0} />
              </radialGradient>
            </defs>
            <circle cx="100" cy="100" r="92" fill="url(#qpc-secondary)" />
            <circle cx="100" cy="100" r="80" fill="url(#qpc-primary)" />
            {[58, 38, 20].map((r, i) => (
              <motion.circle
                key={r} cx="100" cy="100" r={r}
                fill="none" stroke={primary.color} strokeWidth={1} opacity={0.55 - i * 0.12}
                animate={{ scale: [1, 1.07 + i * 0.04, 1] }}
                transition={{ duration: 4.5, repeat: Infinity, delay: i * 0.5 }}
              />
            ))}
          </svg>
          <div className="kicker !mb-1 !mt-2">Your festival profile</div>
          <div className="font-[var(--font-display)] text-[28px] tracking-[-0.018em] leading-none relative" style={{ color: primary.color }}>
            {primary.name}
          </div>
          <div className="text-[var(--color-ink-mute)] text-xs mt-1.5 font-[var(--font-display)] italic relative">
            with notes of <span style={{ color: secondary.color }}>{secondary.name}</span>
          </div>
        </div>

        {/* mood radar + key stats */}
        <div className="bg-[var(--color-bg-1)] p-7">
          <div className="kicker !mb-3">Your mood signature</div>
          <p className="text-[13px] text-[var(--color-ink-dim)] leading-relaxed mb-2">
            {primary.desc}
          </p>
          <div className="h-[180px]">
            <ResponsiveContainer>
              <RadarChart data={radarData} outerRadius="80%">
                <defs>
                  <linearGradient id="qpc-radar" x1="0" y1="0" x2="1" y2="1">
                    <stop offset="0%" stopColor={primary.color} stopOpacity={0.5} />
                    <stop offset="100%" stopColor={secondary.color} stopOpacity={0.5} />
                  </linearGradient>
                </defs>
                <PolarGrid stroke={C.lineStrong} strokeOpacity={0.5} />
                <PolarAngleAxis
                  dataKey="axis"
                  tick={{ fill: C.inkDim, fontFamily: "JetBrains Mono, monospace", fontSize: 9, letterSpacing: "0.1em" }}
                  tickFormatter={(v: string) => v.toUpperCase()}
                />
                <Radar
                  dataKey="value"
                  fill="url(#qpc-radar)"
                  fillOpacity={1}
                  stroke={primary.color}
                  strokeOpacity={0.85}
                  strokeWidth={1.5}
                  dot={{ fill: primary.color, r: 3 } as any}
                  isAnimationActive
                  animationDuration={700}
                />
              </RadarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* persona breakdown + key stats */}
        <div className="bg-[var(--color-bg-1)] p-7 flex flex-col">
          <div className="kicker !mb-3">Your persona blend</div>
          <div className="space-y-1.5 flex-1">
            {personaShares.map(p => {
              const persona = PERSONAS[p.key];
              const isTop = p.key === result.primaryPersona;
              return (
                <div key={p.key} className="flex items-center gap-3 text-xs">
                  <span
                    className="w-[78px] font-[var(--font-display)] text-[13px] tracking-[-0.005em] truncate"
                    style={{ color: isTop ? persona.color : "var(--color-ink-dim)" }}
                  >
                    {persona.name.replace("The ", "")}
                  </span>
                  <div className="flex-1 h-1.5 rounded-full bg-[var(--color-line)] overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }} animate={{ width: `${p.share}%` }}
                      transition={{ duration: 0.9, ease: [0.2, 0.8, 0.2, 1] }}
                      className="h-full rounded-full"
                      style={{ background: persona.color }}
                    />
                  </div>
                  <span className="font-mono text-[10.5px] text-[var(--color-ink-dim)] w-9 text-right tabular-nums">
                    {Math.round(p.share)}%
                  </span>
                </div>
              );
            })}
          </div>

          <div className="grid grid-cols-3 gap-px bg-[var(--color-line)] mt-5 rounded-md overflow-hidden">
            {[
              { label: "BPM target", value: `${result.bpmPreference[0]}–${result.bpmPreference[1]}` },
              { label: "Discovery", value: `${Math.round(result.discoveryBias * 100)}%` },
              { label: "Top mood", value: topMoodLabel(result.moodVector) },
            ].map((s, i) => (
              <div key={i} className="bg-[var(--color-bg-1)] py-2.5 px-3">
                <div className="font-mono text-[9px] tracking-[0.16em] uppercase text-[var(--color-ink-mute)] mb-0.5">
                  {s.label}
                </div>
                <div className="font-[var(--font-display)] text-[15px] tracking-[-0.01em] leading-tight">
                  {s.value}
                </div>
              </div>
            ))}
          </div>

          <div className="mt-4 pt-4 border-t border-[var(--color-line)]">
            <div className="font-mono text-[9.5px] tracking-[0.16em] uppercase text-[var(--color-ink-mute)] mb-2">
              Share your profile
            </div>
            <ProfileShareButtons result={result} size="sm" />
            <div className="flex gap-2 mt-3 flex-wrap">
              <Button asChild size="sm" variant="ghost">
                <a href="#quiz">
                  <RotateCcw className="w-3 h-3" />
                  Retake quiz
                </a>
              </Button>
              <Button size="sm" variant="ghost" onClick={async () => {
                const ok = await toastConfirm(
                  "Reset your quiz result?",
                  "You'll need to retake to see personal matches.",
                  { confirmLabel: "Reset", destructive: true },
                );
                if (ok) { clear(); toast.success("Quiz cleared"); }
              }}>
                Clear result
              </Button>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

function topMoodLabel(v: Record<string, number>): string {
  const top = (Object.entries(v) as [string, number][]).sort((a, b) => b[1] - a[1])[0];
  if (!top) return "—";
  return top[0].charAt(0).toUpperCase() + top[0].slice(1);
}
