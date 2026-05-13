import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowUpRight, Menu, X } from "lucide-react";

const LINKS: [string, string][] = [
  ["#quiz", "Persona"],
  ["#matches", "For you"],
  ["#lineup", "Lineup"],
  ["#numbers", "Numbers"],
  ["#map", "Map"],
  ["#schedule", "Schedule"],
  ["#afterparties", "After dark"],
  ["#plan", "Plan"],
  ["#vibe", "Vibe"],
];

export function MobileNav() {
  const [open, setOpen] = useState(false);

  // close on Escape
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") setOpen(false); };
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKey);
    };
  }, [open]);

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        aria-label="Open menu"
        className="md:hidden inline-flex items-center justify-center w-9 h-9 rounded-full border border-[var(--color-line)] bg-white/[0.03] hover:bg-white/[0.08] text-[var(--color-ink-dim)] hover:text-[var(--color-ink)] transition-colors"
      >
        <Menu className="w-4 h-4" />
      </button>

      {createPortal(
      <AnimatePresence>
        {open && (
          <>
            <motion.div
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              onClick={() => setOpen(false)}
              className="lg:hidden fixed inset-0 z-[80] bg-[rgba(7,6,15,0.78)] backdrop-blur-md"
            />
            <motion.div
              initial={{ x: "100%" }} animate={{ x: 0 }} exit={{ x: "100%" }}
              transition={{ duration: 0.32, ease: [0.2, 0.8, 0.2, 1] }}
              className="lg:hidden fixed top-0 right-0 bottom-0 z-[81] w-[84%] max-w-[320px] border-l border-[var(--color-line-strong)] p-6 flex flex-col gap-1 overflow-y-auto shadow-[-20px_0_60px_rgba(0,0,0,0.4)]"
              style={{
                background: "linear-gradient(180deg, var(--color-bg-2) 0%, var(--color-bg-1) 100%)",
                height: "100svh",
                maxHeight: "100dvh",
                paddingBottom: "calc(1.5rem + env(safe-area-inset-bottom, 0px))",
              }}
            >
              <div className="flex items-center justify-between mb-6">
                <span className="font-mono text-[11px] tracking-[0.2em] uppercase text-[var(--color-ink-mute)]">
                  Sections
                </span>
                <button
                  type="button"
                  onClick={() => setOpen(false)}
                  aria-label="Close menu"
                  className="w-8 h-8 inline-flex items-center justify-center rounded-full text-[var(--color-ink-dim)] hover:bg-white/5 hover:text-[var(--color-ink)] transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
              <nav className="flex flex-col gap-px">
                {LINKS.map(([href, label], i) => (
                  <motion.a
                    key={href}
                    href={href}
                    onClick={() => setOpen(false)}
                    initial={{ opacity: 0, x: 12 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.04 + i * 0.025, duration: 0.3 }}
                    className="font-[var(--font-display)] text-[22px] tracking-[-0.012em] py-2.5 px-3 rounded-lg hover:bg-white/5 transition-colors flex items-center justify-between group"
                  >
                    <span className="text-[var(--color-ink-dim)] group-hover:text-[var(--color-ink)] transition-colors">
                      {label}
                    </span>
                    <span className="font-mono text-[10px] tracking-[0.14em] uppercase text-[var(--color-ink-mute)]">
                      0{i + 1}
                    </span>
                  </motion.a>
                ))}
              </nav>

              <motion.a
                href="https://festival.cercle.io"
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => setOpen(false)}
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.05 + LINKS.length * 0.025, duration: 0.3 }}
                className="mt-5 pt-5 border-t border-[var(--color-line)] flex items-center justify-between gap-3 py-2.5 px-3 rounded-lg hover:bg-white/5 transition-colors"
              >
                <div className="flex flex-col">
                  <span className="font-mono text-[10px] tracking-[0.16em] uppercase text-[var(--color-ink-mute)]">
                    Official site
                  </span>
                  <span className="font-[var(--font-display)] text-[17px] tracking-[-0.008em] text-[var(--color-ink-dim)]">
                    festival.cercle.io
                  </span>
                </div>
                <ArrowUpRight className="w-4 h-4 text-[var(--color-ink-mute)]" />
              </motion.a>
            </motion.div>
          </>
        )}
      </AnimatePresence>,
      document.body)}
    </>
  );
}
