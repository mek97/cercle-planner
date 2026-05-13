import { Clock, MousePointerClick, Sparkles } from "lucide-react";
import { SectionShell } from "./SectionShell";
import { Quiz } from "./Quiz";
import { useQuizResult } from "@/hooks/useQuizResult";

interface Props {
  onApply: (matches: string[]) => void;
}

export function QuizSection({ onApply }: Props) {
  const { result, setResult } = useQuizResult();

  return (
    <SectionShell
      id="quiz"
      kicker="01 · The big test"
      title={<>What kind of <em className="display-em">viber</em> are you?</>}
      lede="Brace yourself — quite possibly the hardest questionnaire you'll ever take. Seven questions, no wrong answers, no jury. Pick the option that makes you go &quot;yes, that one,&quot; and the entire lineup will rearrange itself like a very polite golden retriever. Takes 90 seconds. Maybe two minutes if you really agonise over BPMs."
    >
      {/* Quiz description card — sits above the quiz */}
      <div className="mb-5 grid grid-cols-1 sm:grid-cols-3 gap-3 max-w-[820px]">
        <Hint
          icon={<MousePointerClick className="w-3.5 h-3.5" />}
          label="One tap"
          text="Most questions auto-advance the second you pick. No back-and-forth."
        />
        <Hint
          icon={<Clock className="w-3.5 h-3.5" />}
          label="Faster than a hold queue"
          text="Seven questions, mostly multiple choice. One slider, one ranking round."
        />
        <Hint
          icon={<Sparkles className="w-3.5 h-3.5" />}
          label="Does the math"
          text="Powers your matches, your mood heatmap, and a smart-built weekend."
        />
      </div>

      <Quiz onComplete={setResult} onApply={onApply} />

      {result && (
        <p className="mt-4 font-mono text-[10.5px] tracking-[0.14em] uppercase text-[var(--color-ink-mute)]">
          Result saved · view it any time in section 02 · For you
        </p>
      )}
    </SectionShell>
  );
}

function Hint({
  icon, label, text,
}: { icon: React.ReactNode; label: string; text: string }) {
  return (
    <div className="surface rounded-xl p-3.5 flex gap-3 items-start">
      <span
        className="w-7 h-7 rounded-full inline-flex items-center justify-center shrink-0"
        style={{
          background: "color-mix(in srgb, var(--color-sat) 14%, transparent)",
          color: "var(--color-sat)",
        }}
      >
        {icon}
      </span>
      <div className="min-w-0">
        <div className="font-mono text-[10px] tracking-[0.16em] uppercase text-[var(--color-ink-mute)] mb-0.5">
          {label}
        </div>
        <div className="text-[12.5px] text-[var(--color-ink-dim)] leading-snug">
          {text}
        </div>
      </div>
    </div>
  );
}
