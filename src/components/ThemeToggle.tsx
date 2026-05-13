import { Moon, Sun } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import { useTheme } from "@/lib/theme";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";

export function ThemeToggle() {
  const { theme, toggle } = useTheme();

  return (
    <Tooltip delayDuration={250}>
      <TooltipTrigger asChild>
        <button
          onClick={toggle}
          aria-label={theme === "dark" ? "Switch to light mode" : "Switch to dark mode"}
          className="relative inline-flex items-center justify-center w-9 h-9 rounded-full border border-[var(--color-line)] bg-white/[0.03] hover:bg-white/[0.08] hover:border-[var(--color-line-bright)] text-[var(--color-ink-dim)] hover:text-[var(--color-ink)] transition-colors overflow-hidden"
        >
          <AnimatePresence mode="wait" initial={false}>
            {theme === "dark" ? (
              <motion.span
                key="moon"
                initial={{ opacity: 0, rotate: -90, scale: 0.5 }}
                animate={{ opacity: 1, rotate: 0, scale: 1 }}
                exit={{ opacity: 0, rotate: 90, scale: 0.5 }}
                transition={{ duration: 0.25, ease: [0.2, 0.8, 0.2, 1] }}
                className="absolute"
              >
                <Moon className="w-4 h-4" />
              </motion.span>
            ) : (
              <motion.span
                key="sun"
                initial={{ opacity: 0, rotate: 90, scale: 0.5 }}
                animate={{ opacity: 1, rotate: 0, scale: 1 }}
                exit={{ opacity: 0, rotate: -90, scale: 0.5 }}
                transition={{ duration: 0.25, ease: [0.2, 0.8, 0.2, 1] }}
                className="absolute"
              >
                <Sun className="w-4 h-4" />
              </motion.span>
            )}
          </AnimatePresence>
        </button>
      </TooltipTrigger>
      <TooltipContent>{theme === "dark" ? "Switch to light" : "Switch to dark"}</TooltipContent>
    </Tooltip>
  );
}
