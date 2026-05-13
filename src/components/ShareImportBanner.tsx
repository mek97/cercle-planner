import { AnimatePresence, motion } from "framer-motion";
import { ArrowRight, Check, Sparkles, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PERSONAS } from "@/data/personas";
import type { PersonaKey } from "@/data/types";

interface Props {
  count: number;
  persona?: PersonaKey;
  onImport: () => void;
  onDismiss: () => void;
  open: boolean;
}

export function ShareImportBanner({ count, persona, onImport, onDismiss, open }: Props) {
  const senderPersona = persona ? PERSONAS[persona] : null;
  const profileOnly = count === 0 && !!senderPersona;

  let headline: React.ReactNode;
  if (profileOnly && senderPersona) {
    headline = <>A <span style={{ color: senderPersona.color }}>{senderPersona.name}</span> took the Cercle quiz</>;
  } else if (senderPersona) {
    headline = <>A <span style={{ color: senderPersona.color }}>{senderPersona.name}</span> shared their Cercle plan</>;
  } else {
    headline = "Someone shared their Cercle plan with you";
  }
  return (
    <AnimatePresence>
      {open && (count > 0 || profileOnly) && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.32, ease: [0.2, 0.8, 0.2, 1] }}
          className="fixed top-20 left-1/2 -translate-x-1/2 z-[55] max-w-[640px] w-[calc(100%-32px)]"
        >
          <div
            className="rounded-2xl border border-[var(--color-line-strong)] shadow-[0_20px_60px_-12px_rgba(0,0,0,0.5)] p-4 md:p-5 flex items-center gap-4"
            style={{
              background: senderPersona
                ? `linear-gradient(135deg, color-mix(in srgb, ${senderPersona.color} 22%, var(--color-bg-1)) 0%, var(--color-bg-1) 100%)`
                : "linear-gradient(135deg, color-mix(in srgb, var(--color-sat) 18%, var(--color-bg-1)) 0%, var(--color-bg-1) 100%)",
            }}
          >
            <div
              className="w-10 h-10 rounded-full flex items-center justify-center shrink-0"
              style={{
                background: senderPersona
                  ? `color-mix(in srgb, ${senderPersona.color} 25%, transparent)`
                  : "color-mix(in srgb, var(--color-sat) 25%, transparent)",
              }}
            >
              <Sparkles
                className="w-5 h-5"
                style={{ color: senderPersona ? senderPersona.color : "var(--color-sat)" }}
              />
            </div>
            <div className="flex-1 min-w-0">
              <div className="font-[var(--font-display)] text-[16px] tracking-[-0.005em] leading-snug">
                {headline}
              </div>
              <div className="text-[12.5px] text-[var(--color-ink-dim)] mt-0.5">
                {senderPersona?.tags?.length ? (
                  <>
                    <span className="font-mono text-[10px] tracking-[0.12em] uppercase">
                      {senderPersona.tags.slice(0, 3).join(" · ")}
                    </span>
                    {!profileOnly && <span className="mx-2 opacity-60">·</span>}
                  </>
                ) : null}
                {profileOnly
                  ? "Take the quiz to find your own festival profile."
                  : <>{count} artist{count === 1 ? "" : "s"} ready to import into your plan.</>}
              </div>
            </div>
            <div className="flex items-center gap-2 shrink-0">
              <Button size="sm" variant="glow" onClick={onImport}>
                {profileOnly ? (
                  <>
                    Take the quiz
                    <ArrowRight className="w-3.5 h-3.5" />
                  </>
                ) : (
                  <>
                    <Check className="w-3.5 h-3.5" />
                    Import
                  </>
                )}
              </Button>
              <button
                onClick={onDismiss}
                className="w-8 h-8 rounded-full inline-flex items-center justify-center text-[var(--color-ink-mute)] hover:text-[var(--color-ink)] hover:bg-white/5 transition-colors"
                aria-label="Dismiss"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
