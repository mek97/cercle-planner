import { useEffect, useState } from "react";
import { ArrowUpRight } from "lucide-react";
import { ThemeToggle } from "./ThemeToggle";
import { SettingsMenu } from "./SettingsMenu";
import { MobileNav } from "./MobileNav";
import { cn } from "@/lib/utils";

interface NavProps {
  picksCount: number;
  hasQuiz: boolean;
  onClearPicks: () => void;
  onResetQuiz: () => void;
  onResetAll: () => void;
}

const NAV_LINKS: [string, string][] = [
  ["quiz", "Persona"],
  ["matches", "Matches"],
  ["lineup", "Lineup"],
  ["numbers", "Numbers"],
  ["map", "Map"],
  ["schedule", "Schedule"],
  ["afterparties", "After dark"],
  ["plan", "Plan"],
  ["vibe", "Vibe"],
];

// Track which section is in view so the matching nav link can highlight.
function useActiveSection(ids: string[]): string | null {
  const [active, setActive] = useState<string | null>(null);
  useEffect(() => {
    if (typeof IntersectionObserver === "undefined") return;
    const obs = new IntersectionObserver(
      entries => {
        // Pick the section closest to the top of the viewport that's intersecting.
        const visible = entries
          .filter(e => e.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
        if (visible.length > 0) setActive(visible[0].target.id);
      },
      // Trigger when the section's top crosses ~100px from the top (just under the sticky nav).
      { rootMargin: "-90px 0px -55% 0px", threshold: 0 },
    );
    ids.forEach(id => {
      const el = document.getElementById(id);
      if (el) obs.observe(el);
    });
    return () => obs.disconnect();
  }, [ids]);
  return active;
}

export function Nav({ picksCount, hasQuiz, onClearPicks, onResetQuiz, onResetAll }: NavProps) {
  const active = useActiveSection(NAV_LINKS.map(([id]) => id));

  return (
    <header className="sticky top-0 z-50 grid grid-cols-[auto_1fr_auto] gap-4 md:gap-8 items-center px-4 sm:px-6 md:px-10 py-3 md:py-4 backdrop-blur-xl bg-[color-mix(in_srgb,var(--color-bg-0)_92%,transparent)] border-b border-[var(--color-line)]">
      <a href="#top" className="flex items-center gap-3 font-mono text-[12.5px] tracking-[0.2em] hover:opacity-80 transition-opacity">
        <span
          className="w-3.5 h-3.5 rounded-full animate-[spin_9s_linear_infinite] shrink-0"
          style={{
            background:
              "conic-gradient(from 180deg, var(--color-fri), var(--color-sat), var(--color-sun), var(--color-accent), var(--color-fri))",
            boxShadow:
              "0 0 16px rgba(255, 93, 138, 0.45), 0 0 36px rgba(177, 140, 255, 0.25)",
          }}
        />
        <span>CERCLE · 26</span>
      </a>
      <nav
        aria-label="Sections"
        className="hidden md:flex justify-center gap-1 lg:gap-1.5 xl:gap-2 text-[12px] lg:text-[13px] whitespace-nowrap"
      >
        {NAV_LINKS.map(([id, label]) => {
          const isActive = active === id;
          return (
            <a
              key={id}
              href={`#${id}`}
              aria-current={isActive ? "true" : undefined}
              className={cn(
                "relative px-2 lg:px-2.5 py-1.5 rounded-md transition-colors",
                isActive
                  ? "text-[var(--color-ink)] bg-[color-mix(in_srgb,var(--color-ink)_8%,transparent)]"
                  : "text-[var(--color-ink-dim)] hover:text-[var(--color-ink)] hover:bg-[color-mix(in_srgb,var(--color-ink)_5%,transparent)]",
              )}
            >
              {label}
              <span
                className={cn(
                  "pointer-events-none absolute left-2 right-2 lg:left-2.5 lg:right-2.5 -bottom-0.5 h-px origin-left transition-transform duration-300",
                  isActive ? "scale-x-100" : "scale-x-0",
                )}
                style={{ background: "var(--color-sat)" }}
              />
            </a>
          );
        })}
      </nav>
      <div className="flex items-center gap-2 font-mono text-[11.5px] text-[var(--color-ink-dim)] tracking-[0.04em]">
        <span className="hidden xl:inline-flex items-center gap-2 mr-1">
          <span
            className="w-1.5 h-1.5 rounded-full bg-[var(--color-sat)]"
            style={{ animation: "pulse 2s infinite" }}
          />
          <span>May 22 – 24</span>
        </span>
        <a
          href="https://festival.cercle.io"
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Open the official Cercle Festival site (opens in a new tab)"
          className="hidden sm:inline-flex items-center gap-1.5 h-9 px-3 rounded-full border border-[var(--color-line-strong)] text-[var(--color-ink-dim)] hover:text-[var(--color-ink)] hover:border-[var(--color-sat)] hover:bg-[color-mix(in_srgb,var(--color-sat)_8%,transparent)] transition-all text-[10.5px] lg:text-[11px] tracking-[0.06em] whitespace-nowrap"
        >
          <span className="hidden lg:inline">Official site</span>
          <span className="lg:hidden">Official</span>
          <ArrowUpRight className="w-3 h-3" />
        </a>
        <SettingsMenu
          picksCount={picksCount}
          hasQuiz={hasQuiz}
          onClearPicks={onClearPicks}
          onResetQuiz={onResetQuiz}
          onResetAll={onResetAll}
        />
        <ThemeToggle />
        <MobileNav />
      </div>
      <style>{`
        @keyframes pulse {
          0%, 100% { box-shadow: 0 0 0 0 rgba(255, 93, 138, 0.6); }
          50%      { box-shadow: 0 0 0 10px rgba(255, 93, 138, 0); }
        }
      `}</style>
    </header>
  );
}
