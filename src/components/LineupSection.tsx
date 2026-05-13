import { useMemo, useState } from "react";
import { ARTISTS } from "../data/artists";
import type { Artist, Day, GenreKey } from "../data/types";
import { ArtistCard } from "./ArtistCard";
import { Filters } from "./Filters";
import { SectionShell } from "./SectionShell";

interface Props {
  picks: Set<string>;
  toggle: (id: string) => void;
  onOpen: (id: string) => void;
}

export function LineupSection({ picks, toggle, onOpen }: Props) {
  const [day, setDay] = useState<Day | "all">("all");
  const [activeGenres, setActiveGenres] = useState<Set<GenreKey>>(new Set());
  const [search, setSearch] = useState("");

  const usedGenres = useMemo<GenreKey[]>(() => {
    const s = new Set<GenreKey>();
    ARTISTS.forEach(a => a.genres.forEach(g => s.add(g)));
    return [...s];
  }, []);

  const toggleGenre = (g: GenreKey) => {
    const next = new Set(activeGenres);
    if (next.has(g)) next.delete(g); else next.add(g);
    setActiveGenres(next);
  };

  const visible = useMemo<Artist[]>(() => {
    return ARTISTS.filter(a => {
      if (day !== "all" && a.day !== day) return false;
      if (activeGenres.size > 0 && !a.genres.some(g => activeGenres.has(g))) return false;
      if (search && !a.name.toLowerCase().includes(search.toLowerCase())) return false;
      return true;
    });
  }, [day, activeGenres, search]);

  return (
    <SectionShell
      id="lineup"
      kicker="03 · Explore"
      title={<>The full <em className="display-em">lineup</em></>}
      lede="Forty-two artists. Tap any card and you get the full file — top tracks, fanbase, vibe, Cercle history, a Spotify player, and a + button so you don't have to remember everyone's name later."
    >
      <Filters
        day={day} setDay={setDay}
        activeGenres={activeGenres} toggleGenre={toggleGenre}
        search={search} setSearch={setSearch}
        usedGenres={usedGenres}
      />

      {visible.length === 0 ? (
        <p className="text-center text-[var(--color-ink-mute)] font-mono text-[13px] py-16 tracking-[0.06em]">
          No artists match those filters.
        </p>
      ) : (
        <div className="grid gap-4 grid-cols-[repeat(auto-fill,minmax(248px,1fr))]">
          {visible.map(a => (
            <ArtistCard
              key={a.id}
              artist={a}
              picked={picks.has(a.id)}
              onOpen={() => onOpen(a.id)}
              onToggle={() => toggle(a.id)}
            />
          ))}
        </div>
      )}
    </SectionShell>
  );
}
