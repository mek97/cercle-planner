import { AnimatePresence, motion } from "framer-motion";

interface Props { count: number; }

export function PicksPill({ count }: Props) {
  return (
    <AnimatePresence>
      {count > 0 && (
        <motion.a
          href="#schedule"
          className="fixed bottom-4 right-4 sm:bottom-7 sm:right-7 z-[60] inline-flex items-center gap-3 px-4 sm:px-5 py-3 sm:py-3.5 rounded-full text-black font-medium text-sm tracking-[0.01em] transition-transform hover:-translate-y-0.5"
          style={{
            background: "linear-gradient(120deg, var(--color-fri) 0%, var(--color-sat) 50%, var(--color-sun) 100%)",
            boxShadow:
              "0 18px 48px -12px rgba(255, 93, 138, 0.55), 0 0 0 1px rgba(255,255,255,0.12) inset",
            bottom: "calc(1rem + env(safe-area-inset-bottom, 0px))",
          }}
          initial={{ opacity: 0, y: 20, scale: 0.94 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 20, scale: 0.94 }}
          transition={{ type: "spring", stiffness: 380, damping: 30 }}
        >
          <span className="w-2 h-2 rounded-full bg-black shadow-[0_0_0_3px_rgba(10,8,16,0.18)]" />
          <span>
            <b className="font-[var(--font-display)] text-[17px] italic font-medium tracking-[-0.01em] mr-0.5">{count}</b>
            in your plan
          </span>
          <span className="font-mono text-[13px] opacity-70">→</span>
        </motion.a>
      )}
    </AnimatePresence>
  );
}
