import { Search } from "lucide-react";
import { GENRES } from "@/data/genres";
import type { Day, GenreKey } from "@/data/types";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface Props {
  day: Day | "all";
  setDay: (d: Day | "all") => void;
  activeGenres: Set<GenreKey>;
  toggleGenre: (g: GenreKey) => void;
  search: string;
  setSearch: (s: string) => void;
  usedGenres: GenreKey[];
}

// Day options use CSS variables so the active pill's background follows
// the theme-aware palette in `globals.css` (muted in light mode, neon in dark).
const DAY_OPTIONS: { key: Day | "all"; label: string; cssVar?: string; ink?: string }[] = [
  { key: "all", label: "All days" },
  { key: "fri", label: "Fri · 22", cssVar: "var(--color-fri)", ink: "#1a1208" },
  { key: "sat", label: "Sat · 23", cssVar: "var(--color-sat)", ink: "#1a0612" },
  { key: "sun", label: "Sun · 24", cssVar: "var(--color-sun)", ink: "#11091e" },
];

export function Filters({ day, setDay, activeGenres, toggleGenre, search, setSearch, usedGenres }: Props) {
  return (
    <div className="flex flex-wrap gap-3 md:gap-6 items-center mb-8 md:mb-10 pb-5 md:pb-6 border-b border-[var(--color-line)] min-w-0">
      <Tabs value={day} onValueChange={(v) => setDay(v as Day | "all")}>
        <TabsList>
          {DAY_OPTIONS.map(opt => (
            <TabsTrigger
              key={opt.key}
              value={opt.key}
              style={day === opt.key && opt.cssVar
                ? {
                    background: opt.cssVar,
                    color: opt.ink,
                    boxShadow: `0 4px 14px -6px color-mix(in srgb, ${opt.cssVar} 55%, transparent)`,
                  }
                : undefined}
            >
              {opt.label}
            </TabsTrigger>
          ))}
        </TabsList>
      </Tabs>

      <div className="flex flex-wrap gap-1.5 w-full md:w-auto">
        {usedGenres.map(g => {
          const active = activeGenres.has(g);
          // CSS var for the genre lets the muted light-mode palette flow through.
          const c = `var(--color-g-${g})`;
          return (
            <button
              key={g}
              onClick={() => toggleGenre(g)}
              className="font-mono text-[11px] tracking-[0.14em] uppercase px-3 h-7 rounded-full border transition-colors"
              style={active
                ? { background: `color-mix(in srgb, ${c} 22%, transparent)`, borderColor: c, color: c }
                : {
                    background: "color-mix(in srgb, var(--color-ink) 4%, transparent)",
                    borderColor: "var(--color-line-strong)",
                    color: "var(--color-ink-dim)",
                  }}
              onMouseEnter={(e) => {
                if (!active) {
                  (e.currentTarget as HTMLElement).style.background = "color-mix(in srgb, var(--color-ink) 8%, transparent)";
                  (e.currentTarget as HTMLElement).style.borderColor = "var(--color-line-bright)";
                }
              }}
              onMouseLeave={(e) => {
                if (!active) {
                  (e.currentTarget as HTMLElement).style.background = "color-mix(in srgb, var(--color-ink) 4%, transparent)";
                  (e.currentTarget as HTMLElement).style.borderColor = "var(--color-line-strong)";
                }
              }}
            >
              {GENRES[g].label}
            </button>
          );
        })}
      </div>

      <div className="relative md:ml-auto md:max-w-[260px] w-full md:w-auto">
        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-[var(--color-ink-mute)] pointer-events-none" />
        <input
          type="search"
          placeholder="Search artist…"
          aria-label="Search artists"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full h-9 pl-9 pr-4 rounded-full bg-white/[0.04] border border-[var(--color-line)] focus:border-[var(--color-ink-dim)] hover:bg-white/[0.06] hover:border-[var(--color-line-bright)] outline-none text-sm placeholder:text-[var(--color-ink-mute)] transition-colors"
        />
      </div>
    </div>
  );
}
