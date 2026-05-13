import { useMemo, useState, useRef, useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowRight, Check, ChevronLeft, ChevronRight, Sparkles } from "lucide-react";
import { computeResult, QUIZ_V2, recommendationScore, smartMatches, type Intensity, type QuizResult, type RawAnswer } from "@/data/quiz";
import { PERSONAS } from "@/data/personas";
import { ARTISTS } from "@/data/artists";
import { getEntry, overlaps } from "@/data/schedule";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Slider } from "@/components/ui/slider";
import { ProfileShareButtons } from "./ProfileShareButtons";
import type { PersonaKey } from "@/data/types";
import { cn } from "@/lib/utils";

interface Props {
  onComplete: (result: QuizResult) => void;
  onApply: (matches: string[]) => void;
}

const PROGRESS_KEY = "cercle-26-quiz-progress";

interface InFlight { step: number; answers: Record<string, RawAnswer>; }

function loadProgress(): InFlight | null {
  try {
    const raw = localStorage.getItem(PROGRESS_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as Partial<InFlight>;
    if (!parsed || typeof parsed.step !== "number" || !parsed.answers || typeof parsed.answers !== "object") {
      return null;
    }
    const step = Math.max(0, Math.min(QUIZ_V2.length - 1, Math.floor(parsed.step)));
    const validQuestionIds = new Set(QUIZ_V2.map(q => q.id));
    const answers = Object.fromEntries(
      Object.entries(parsed.answers).filter(([id, answer]) => {
        return validQuestionIds.has(id) &&
          answer &&
          typeof answer === "object" &&
          (answer as RawAnswer).questionId === id &&
          [1, 2, 3].includes((answer as RawAnswer).intensity);
      }),
    ) as Record<string, RawAnswer>;
    return { step, answers };
  } catch { return null; }
}
function saveProgress(p: InFlight | null) {
  try {
    if (!p) localStorage.removeItem(PROGRESS_KEY);
    else localStorage.setItem(PROGRESS_KEY, JSON.stringify(p));
  } catch {}
}

export function Quiz({ onComplete, onApply }: Props) {
  const saved = loadProgress();
  const [step, setStep] = useState(saved?.step ?? 0);
  const [answers, setAnswers] = useState<Record<string, RawAnswer>>(saved?.answers ?? {});
  const [showResult, setShowResult] = useState<QuizResult | null>(null);
  const advanceTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  // persist in-flight quiz state so closing the tab mid-quiz doesn't lose progress
  useEffect(() => {
    if (showResult) saveProgress(null);
    else if (step > 0 || Object.keys(answers).length > 0) {
      saveProgress({ step, answers });
    }
  }, [step, answers, showResult]);

  const q = QUIZ_V2[step];
  const isLast = step === QUIZ_V2.length - 1;
  const isFirst = step === 0;
  const pct = ((step + (answers[q.id] ? 1 : 0)) / QUIZ_V2.length) * 100;
  const current = answers[q?.id || ""];
  const canAdvance = !!current;

  function setAnswer(value: RawAnswer["value"], intensity: Intensity = 2) {
    setAnswers(prev => ({ ...prev, [q.id]: { questionId: q.id, value, intensity } }));
  }
  function setIntensity(intensity: Intensity) {
    if (!current) return;
    setAnswers(prev => ({ ...prev, [q.id]: { ...current, intensity } }));
  }

  function advance() {
    if (advanceTimer.current) clearTimeout(advanceTimer.current);
    if (!canAdvance) return;
    if (isLast) {
      const result = computeResult(Object.values(answers));
      setShowResult(result);
      onComplete(result);
    } else {
      setStep(step + 1);
    }
  }

  function back() {
    if (advanceTimer.current) clearTimeout(advanceTimer.current);
    if (!isFirst) setStep(step - 1);
  }

  // clear any pending auto-advance on unmount or step change
  useEffect(() => () => {
    if (advanceTimer.current) clearTimeout(advanceTimer.current);
  }, [step]);

  function handleSinglePick(idx: number) {
    setAnswer(idx);
    // auto-advance 350ms after picking on single-choice
    if (advanceTimer.current) clearTimeout(advanceTimer.current);
    advanceTimer.current = setTimeout(() => {
      if (isLast) {
        const result = computeResult(
          Object.values({ ...answers, [q.id]: { questionId: q.id, value: idx, intensity: 2 } })
        );
        setShowResult(result);
        onComplete(result);
      } else {
        setStep(prevStep => prevStep + 1);
      }
    }, 350);
  }

  function retake() {
    if (advanceTimer.current) clearTimeout(advanceTimer.current);
    saveProgress(null);
    setStep(0);
    setAnswers({});
    setShowResult(null);
  }

  if (showResult) {
    return <ResultView result={showResult} retake={retake} onApply={onApply} />;
  }

  return (
    <div className="surface rounded-2xl sm:rounded-3xl max-w-[820px] min-h-[440px] p-5 sm:p-6 md:p-10 relative overflow-hidden">
      <div className="absolute top-0 left-0 right-0">
        <Progress value={pct} />
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={q.id}
          initial={{ opacity: 0, x: 24 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -24 }}
          transition={{ duration: 0.32, ease: [0.2, 0.8, 0.2, 1] }}
        >
          <div className="flex items-center justify-between mb-3">
            <div className="mono-meta !mb-0">Question {step + 1} of {QUIZ_V2.length}</div>
            <button
              onClick={back}
              disabled={isFirst}
              className="font-mono text-[10.5px] tracking-[0.16em] uppercase text-[var(--color-ink-mute)] hover:text-[var(--color-ink)] disabled:opacity-30 disabled:cursor-not-allowed inline-flex items-center gap-1 transition-colors"
            >
              <ChevronLeft className="w-3 h-3" /> Back
            </button>
          </div>
          <h3 className="font-[var(--font-display)] text-[clamp(24px,3vw,32px)] font-normal leading-[1.2] tracking-[-0.012em] mb-1.5">
            {q.prompt}
          </h3>
          {q.helper && <p className="text-sm text-[var(--color-ink-mute)] mb-7">{q.helper}</p>}

          {q.kind === "single" && (
            <SingleRenderer
              q={q as any}
              value={current?.value as number | undefined}
              onPick={handleSinglePick}
            />
          )}
          {q.kind === "slider" && (
            <SliderRenderer
              q={q as any}
              value={current?.value as number | undefined}
              onPick={(v) => setAnswer(v)}
              onAdvance={advance}
              isLast={isLast}
            />
          )}
          {q.kind === "rank" && (
            <RankRenderer
              q={q as any}
              value={current?.value as string[] | undefined}
              onPick={(v) => setAnswer(v)}
              onAdvance={advance}
              isLast={isLast}
            />
          )}
        </motion.div>
      </AnimatePresence>

      {/* optional intensity fine-tune — collapsed by default, expand to access */}
      {current && q.kind === "single" && (
        <IntensityFineTune
          intensity={current.intensity}
          onChange={setIntensity}
        />
      )}
    </div>
  );
}

// ─────────────────────────────────────────────
// Optional intensity tune — for users who care.
// Default Firmly, collapsed by default.
// ─────────────────────────────────────────────
function IntensityFineTune({
  intensity, onChange,
}: { intensity: Intensity; onChange: (i: Intensity) => void }) {
  const [open, setOpen] = useState(false);
  const labels: Record<Intensity, string> = { 1: "Lightly", 2: "Firmly", 3: "Absolutely" };

  if (!open) {
    return (
      <button
        onClick={() => setOpen(true)}
        className="absolute bottom-4 right-5 font-mono text-[10px] tracking-[0.16em] uppercase text-[var(--color-ink-mute)] hover:text-[var(--color-ink-dim)] transition-colors"
      >
        Weight: {labels[intensity].toLowerCase()} · adjust
      </button>
    );
  }

  return (
    <div className="absolute bottom-3 right-5 inline-flex items-center gap-2">
      <span className="font-mono text-[10px] tracking-[0.14em] uppercase text-[var(--color-ink-mute)]">Weight</span>
      <div className="inline-flex gap-1 rounded-full bg-white/[0.03] border border-[var(--color-line)] p-1">
        {([1, 2, 3] as Intensity[]).map(lvl => {
          const active = intensity === lvl;
          return (
            <button
              key={lvl}
              onClick={() => onChange(lvl)}
              className={cn(
                "px-2.5 h-6 rounded-full font-mono text-[9.5px] tracking-[0.12em] uppercase transition-all",
                active
                  ? "bg-[var(--color-ink)] text-[var(--color-bg-0)]"
                  : "text-[var(--color-ink-dim)] hover:text-[var(--color-ink)]"
              )}
            >
              {labels[lvl]}
            </button>
          );
        })}
      </div>
      <button onClick={() => setOpen(false)} className="text-[var(--color-ink-mute)] hover:text-[var(--color-ink)] text-base leading-none">×</button>
    </div>
  );
}

// ─────────────────────────────────────────────
// SINGLE — bigger, friendlier, auto-advance on click
// ─────────────────────────────────────────────
function SingleRenderer({
  q, value, onPick,
}: { q: any; value: number | undefined; onPick: (v: number) => void }) {
  return (
    <div className="grid gap-2.5">
      {q.options.map((opt: any, i: number) => {
        const active = value === i;
        return (
          <motion.button
            key={i}
            onClick={() => onPick(i)}
            whileTap={{ scale: 0.99 }}
            className={cn(
              "text-left rounded-xl px-5 py-4 border transition-all flex items-start justify-between gap-4 group",
              active
                ? "border-[var(--color-sat)] bg-[color-mix(in_srgb,var(--color-sat)_12%,transparent)]"
                : "border-[var(--color-line)] bg-white/[0.02] hover:border-[var(--color-line-bright)] hover:bg-white/[0.05]"
            )}
          >
            <div>
              <div className={cn("text-[15px] leading-snug font-medium", active && "text-[var(--color-ink)]")}>
                {opt.label}
              </div>
              {opt.sublabel && (
                <div className="text-xs text-[var(--color-ink-mute)] italic mt-1 font-[var(--font-display)]">
                  {opt.sublabel}
                </div>
              )}
            </div>
            <span className={cn(
              "shrink-0 w-5 h-5 rounded-full border flex items-center justify-center transition-all",
              active
                ? "border-[var(--color-sat)] bg-[var(--color-sat)] text-[#0a0810]"
                : "border-[var(--color-line-strong)] text-transparent group-hover:border-[var(--color-line-bright)]"
            )}>
              <Check className="w-3 h-3" />
            </span>
          </motion.button>
        );
      })}
    </div>
  );
}

// ─────────────────────────────────────────────
// SLIDER — explicit Next button, no auto-advance (user might keep adjusting)
// ─────────────────────────────────────────────
function SliderRenderer({
  q, value, onPick, onAdvance, isLast,
}: {
  q: any; value: number | undefined; onPick: (v: number) => void;
  onAdvance: () => void; isLast: boolean;
}) {
  const v = value ?? q.defaultValue;
  // Seed default in an effect so the user can press Next without touching the slider.
  // Effect-based so we don't trigger a state update during render.
  useEffect(() => {
    if (value === undefined) onPick(q.defaultValue);
  }, [q.id]);
  return (
    <div className="pt-3">
      <div className="flex justify-between items-baseline mb-6">
        <span className="font-mono text-[11px] tracking-[0.14em] uppercase text-[var(--color-ink-mute)]">
          {q.startLabel}
        </span>
        <motion.span
          key={v}
          initial={{ scale: 1.05 }} animate={{ scale: 1 }}
          className="font-[var(--font-display)] text-[44px] tracking-[-0.022em] leading-none"
        >
          {v}<span className="text-[var(--color-ink-mute)] text-base font-mono ml-1">{q.unit || ""}</span>
        </motion.span>
        <span className="font-mono text-[11px] tracking-[0.14em] uppercase text-[var(--color-ink-mute)]">
          {q.endLabel}
        </span>
      </div>
      <Slider
        min={q.min} max={q.max} step={q.step}
        value={[v]}
        onValueChange={(arr) => onPick(arr[0])}
      />
      <div className="grid grid-cols-3 mt-4 text-[10px] font-mono tracking-[0.12em] uppercase text-[var(--color-ink-faint)]">
        <span>{q.min}{q.unit}</span>
        <span className="text-center">{Math.round((q.min + q.max) / 2)}{q.unit}</span>
        <span className="text-right">{q.max}{q.unit}</span>
      </div>
      <div className="mt-7 flex justify-end">
        <Button variant="glow" onClick={onAdvance}>
          {isLast ? "See my profile" : "Next"}
          {isLast ? <Sparkles className="w-3.5 h-3.5" /> : <ChevronRight className="w-3.5 h-3.5" />}
        </Button>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────
// RANK — pick at least 1 (max 3), no required reorder, prominent Done
// ─────────────────────────────────────────────
function RankRenderer({
  q, value, onPick, onAdvance, isLast,
}: {
  q: any; value: string[] | undefined; onPick: (v: string[]) => void;
  onAdvance: () => void; isLast: boolean;
}) {
  const picks: string[] = value || [];

  function toggle(key: string) {
    if (picks.includes(key)) onPick(picks.filter(k => k !== key));
    else if (picks.length < q.maxPicks) onPick([...picks, key]);
  }

  return (
    <div className="space-y-5">
      <div className="grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-3 gap-2">
        {q.options.map((opt: any) => {
          const isPicked = picks.includes(opt.key);
          const rank = isPicked ? picks.indexOf(opt.key) + 1 : null;
          const disabled = !isPicked && picks.length >= q.maxPicks;
          return (
            <motion.button
              key={opt.key}
              onClick={() => !disabled && toggle(opt.key)}
              whileTap={{ scale: 0.98 }}
              disabled={disabled}
              className={cn(
                "relative text-left rounded-xl px-4 py-3.5 border transition-all",
                isPicked
                  ? "border-[var(--color-sat)] bg-[color-mix(in_srgb,var(--color-sat)_12%,transparent)]"
                  : "border-[var(--color-line)] bg-white/[0.02] hover:border-[var(--color-line-bright)] hover:bg-white/[0.05]",
                disabled && "opacity-30 cursor-not-allowed"
              )}
            >
              {rank && (
                <span className="absolute top-2 right-2 w-5 h-5 rounded-full bg-[var(--color-sat)] text-[#0a0810] font-mono text-[10px] flex items-center justify-center font-semibold">
                  {rank}
                </span>
              )}
              <div className="text-[14px] font-medium leading-snug">{opt.label}</div>
              {opt.sublabel && (
                <div className="text-[11px] text-[var(--color-ink-mute)] italic font-[var(--font-display)] mt-0.5">
                  {opt.sublabel}
                </div>
              )}
            </motion.button>
          );
        })}
      </div>

      <div className="flex justify-between items-center pt-2">
        <span className="font-mono text-[10.5px] tracking-[0.14em] uppercase text-[var(--color-ink-mute)]">
          {picks.length === 0
            ? `Pick 1–${q.maxPicks} · order matters`
            : `${picks.length} picked${picks.length < q.maxPicks ? ` · ${q.maxPicks - picks.length} more if you want` : ""}`}
        </span>
        <Button
          variant={picks.length > 0 ? "glow" : "outline"}
          onClick={onAdvance}
          disabled={picks.length === 0}
        >
          {isLast ? "See my profile" : "Next"}
          {isLast ? <Sparkles className="w-3.5 h-3.5" /> : <ChevronRight className="w-3.5 h-3.5" />}
        </Button>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────
// Result view (unchanged)
// ─────────────────────────────────────────────
function ResultView({
  result, retake, onApply,
}: { result: QuizResult; retake: () => void; onApply: (ids: string[]) => void }) {
  const primary = PERSONAS[result.primaryPersona];
  const secondary = PERSONAS[result.secondaryPersona];

  const matches = useMemo(() => {
    return ARTISTS
      .map(a => ({ a, score: recommendationScore(result, a).total }))
      .sort((x, y) => y.score - x.score)
      .slice(0, 8);
  }, [result]);

  // Smart picks: weighted interval scheduling per day — fills every
  // contiguous time slot with the best-fit non-overlapping artists.
  const smartResult = useMemo(() => {
    return smartMatches(ARTISTS, result, getEntry, overlaps, {
      alternatesPerDay: 3,
    });
  }, [result]);

  const alternateArtists = useMemo(() => {
    const byId = new Map(ARTISTS.map(a => [a.id, a]));
    return smartResult.alternates
      .map(id => ({ id, artist: byId.get(id), entry: getEntry(id) }))
      .filter((x): x is { id: string; artist: NonNullable<typeof x.artist>; entry: NonNullable<typeof x.entry> } =>
        !!x.artist && !!x.entry,
      );
  }, [smartResult.alternates]);

  const personaTotal = Object.values(result.personaScores).reduce((s, v) => s + v, 0);
  const personaShares = (Object.entries(result.personaScores) as [keyof typeof PERSONAS, number][])
    .map(([k, v]) => ({ key: k, share: personaTotal > 0 ? (v / personaTotal) * 100 : 0 }))
    .sort((a, b) => b.share - a.share);

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.55, ease: [0.2, 0.8, 0.2, 1] }}
      className="surface rounded-3xl max-w-[1000px] p-6 md:p-12"
    >
      <div className="grid md:grid-cols-[260px_1fr] gap-10 items-start">
        <div className="max-w-[220px] mx-auto md:mx-0">
          <svg viewBox="0 0 200 200" className="w-full h-auto" aria-hidden="true">
            <defs>
              <radialGradient id="pg-primary" cx="50%" cy="50%" r="50%">
                <stop offset="0%" stopColor={primary.color} stopOpacity={0.95} />
                <stop offset="100%" stopColor={primary.color} stopOpacity={0} />
              </radialGradient>
              <radialGradient id="pg-secondary" cx="50%" cy="50%" r="50%">
                <stop offset="0%" stopColor={secondary.color} stopOpacity={0.5} />
                <stop offset="100%" stopColor={secondary.color} stopOpacity={0} />
              </radialGradient>
            </defs>
            <circle cx="100" cy="100" r="92" fill="url(#pg-secondary)" />
            <circle cx="100" cy="100" r="86" fill="url(#pg-primary)" />
            {[60, 40, 22].map((r, i) => (
              <motion.circle
                key={r} cx="100" cy="100" r={r}
                fill="none" stroke={primary.color} strokeWidth={1} opacity={0.55 - i * 0.12}
                animate={{ scale: [1, 1.08 + i * 0.04, 1] }}
                transition={{ duration: 4, repeat: Infinity, delay: i * 0.5 }}
              />
            ))}
          </svg>
        </div>

        <div className="min-w-0">
          <div className="kicker">Your festival profile</div>
          <h3 className="font-[var(--font-display)] text-[clamp(32px,4.2vw,48px)] leading-none tracking-[-0.024em] mb-2">
            <span style={{ color: primary.color }}>{primary.name}</span>
            <span className="text-[var(--color-ink-mute)] font-light"> with notes of </span>
            <span style={{ color: secondary.color }}>{secondary.name}</span>
          </h3>
          <p className="text-[var(--color-ink-dim)] text-base leading-relaxed mb-6">
            {primary.desc}
          </p>

          <div className="mb-6">
            <div className="font-mono text-[10px] tracking-[0.18em] uppercase text-[var(--color-ink-mute)] mb-3">
              How your answers broke down
            </div>
            <div className="space-y-1.5">
              {personaShares.map(p => {
                const persona = PERSONAS[p.key];
                return (
                  <div key={p.key} className="flex items-center gap-3 text-xs">
                    <span className="w-[88px] text-[var(--color-ink-dim)] font-[var(--font-display)] text-[14px] tracking-[-0.005em]">
                      {persona.name}
                    </span>
                    <div className="flex-1 h-1.5 rounded-full bg-[var(--color-line)] overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }} animate={{ width: `${p.share}%` }}
                        transition={{ duration: 1, ease: [0.2, 0.8, 0.2, 1] }}
                        className="h-full rounded-full"
                        style={{ background: persona.color }}
                      />
                    </div>
                    <span className="font-mono text-[11px] text-[var(--color-ink-dim)] w-10 text-right">
                      {Math.round(p.share)}%
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-px bg-[var(--color-line)] rounded-xl overflow-hidden mb-6">
            {[
              { label: "BPM target", value: `${result.bpmPreference[0]}–${result.bpmPreference[1]}` },
              { label: "Discovery", value: `${Math.round(result.discoveryBias * 100)}%` },
              { label: "Top mood", value: topMoodLabel(result.moodVector) },
              { label: "Match pool", value: `${matches.length} artists` },
            ].map((s, i) => (
              <div key={i} className="bg-[var(--color-bg-1)] p-3.5">
                <div className="font-mono text-[9.5px] tracking-[0.16em] uppercase text-[var(--color-ink-mute)] mb-1">
                  {s.label}
                </div>
                <div className="font-[var(--font-display)] text-[18px] tracking-[-0.01em] leading-tight">
                  {s.value}
                </div>
              </div>
            ))}
          </div>

          <PrimaryCTA
            count={smartResult.ids.length}
            onApply={() => onApply(smartResult.ids)}
            result={result}
            retake={retake}
          />
          <div className="mt-3 font-mono text-[10.5px] tracking-[0.14em] uppercase text-[var(--color-ink-mute)]">
            Fri ({smartResult.byDay.fri}) · Sat ({smartResult.byDay.sat}) · Sun ({smartResult.byDay.sun}) · full days, clash-free
          </div>

          {alternateArtists.length > 0 && (
            <div
              className="mt-7 pt-5 border-t border-dashed border-[var(--color-line)] rounded-b-xl px-1"
              style={{ borderTopColor: "color-mix(in srgb, var(--color-accent) 30%, var(--color-line))" }}
            >
              <div className="flex items-center justify-between gap-3 mb-3 flex-wrap">
                <div>
                  <div
                    className="font-mono text-[10px] tracking-[0.18em] uppercase mb-1"
                    style={{ color: "var(--color-accent)" }}
                  >
                    Alternates · same vibe, different sets
                  </div>
                  <div className="text-[12.5px] text-[var(--color-ink-dim)] leading-snug">
                    Next-best matches not in your weekend yet — tap to add any that catch your eye.
                  </div>
                </div>
                <Button
                  variant="outline"
                  onClick={() => onApply([...smartResult.ids, ...smartResult.alternates])}
                >
                  Add alternates too
                </Button>
              </div>
              <div className="flex gap-2 flex-wrap">
                {alternateArtists.map(({ id, artist, entry }) => (
                  <button
                    key={id}
                    type="button"
                    onClick={() => onApply([...smartResult.ids, id])}
                    className="inline-flex items-center gap-2 rounded-full border border-dashed px-3 py-1.5 transition-all hover:scale-[1.03] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-accent)]"
                    style={{
                      borderColor: "color-mix(in srgb, var(--color-accent) 45%, transparent)",
                      background: "color-mix(in srgb, var(--color-accent) 8%, transparent)",
                      color: "var(--color-ink)",
                    }}
                    aria-label={`Add ${artist.name} as an alternate (${entry.day === "fri" ? "Friday" : entry.day === "sat" ? "Saturday" : "Sunday"}, ${entry.start})`}
                  >
                    <span className="font-[var(--font-display)] text-[13px] tracking-[-0.005em]">
                      {artist.name}
                    </span>
                    <span
                      className="font-mono text-[9.5px] tracking-[0.12em] uppercase"
                      style={{ color: "var(--color-accent)" }}
                    >
                      {entry.day} · {entry.start}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          )}
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

// ─────────────────────────────────────────────
// The headline action — visually loud so users don't miss it.
// Pulse ring + hint label + chunky button. Secondary actions below
// (Share via WhatsApp / Copy link / All matches / Retake).
// ─────────────────────────────────────────────
function PrimaryCTA({
  count, onApply, result, retake,
}: {
  count: number;
  onApply: () => void;
  result: QuizResult;
  retake: () => void;
}) {
  return (
    <div>
      <div className="flex items-center gap-2 mb-2.5 font-mono text-[10.5px] tracking-[0.18em] uppercase text-[var(--color-sat)]">
        <Sparkles className="w-3 h-3" />
        <span>Tap to apply these picks</span>
      </div>

      {/* Hero CTA — pulse ring + chunky button */}
      <div className="relative inline-block">
        <motion.span
          aria-hidden
          className="pointer-events-none absolute -inset-2 rounded-full"
          style={{
            background:
              "radial-gradient(closest-side, color-mix(in srgb, var(--color-sat) 32%, transparent), transparent 75%)",
            filter: "blur(8px)",
          }}
          animate={{ opacity: [0.55, 0.95, 0.55], scale: [1, 1.06, 1] }}
          transition={{ duration: 2.4, repeat: Infinity, ease: "easeInOut" }}
        />
        <Button
          variant="glow"
          size="lg"
          onClick={onApply}
          className="relative text-[15px] px-7 shadow-[0_18px_45px_-12px_rgba(255,93,138,0.75)]"
        >
          Build my weekend
          <span className="font-mono text-[11px] opacity-80 tracking-[0.08em]">({count} picks)</span>
          <ArrowRight className="w-4 h-4" />
        </Button>
      </div>

      {/* Secondary row — share festival profile + nav */}
      <div className="mt-4">
        <div className="font-mono text-[10px] tracking-[0.16em] uppercase text-[var(--color-ink-mute)] mb-2">
          Share your festival profile
        </div>
        <div className="flex gap-2 flex-wrap items-center">
          <ProfileShareButtons result={result} />
          <Button variant="ghost" size="sm" asChild>
            <a href="#matches">All matches</a>
          </Button>
          <Button variant="ghost" size="sm" onClick={retake}>Retake quiz</Button>
        </div>
        <div className="mt-1.5 text-[11px] text-[var(--color-ink-mute)] leading-snug">
          Generates a polished image you can post anywhere. To share your timetable instead, head to the <a href="#plan" className="text-[var(--color-ink)] underline-offset-2 hover:underline">Plan</a> section.
        </div>
      </div>
    </div>
  );
}
