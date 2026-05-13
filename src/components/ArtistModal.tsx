import type { Artist } from "@/data/types";
import { GENRES, DAY_LABEL, DAY_ACCENT } from "@/data/genres";
import { SPOTIFY_IDS } from "@/data/spotify";
import { fanbaseDots } from "@/utils";
import { Dialog, DialogContent, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Avatar } from "./Avatar";

interface Props {
  artist: Artist | null;
  picked: boolean;
  onClose: () => void;
  onToggle: (id: string) => void;
}

export function ArtistModal({ artist, picked, onClose, onToggle }: Props) {
  return (
    <Dialog open={!!artist} onOpenChange={(o) => { if (!o) onClose(); }}>
      <DialogContent>
        {artist && (
          <>
            <DialogTitle className="sr-only">{artist.name}</DialogTitle>
            <DialogDescription className="sr-only">
              {artist.details.vibe || artist.blurb}
            </DialogDescription>
            <ArtistDetail artist={artist} picked={picked} onToggle={onToggle} />
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}

function ArtistDetail({ artist, picked, onToggle }: { artist: Artist; picked: boolean; onToggle: (id: string) => void }) {
  const d = artist.details;
  const dayColor = DAY_ACCENT[artist.day];
  const spotifyIds = SPOTIFY_IDS[artist.id] || [];
  const dots = fanbaseDots(d.fanbase);

  return (
    <div className="px-5 sm:px-8 md:px-12 py-10 sm:py-12 md:py-14 relative">
      <div className="absolute left-0 top-10 bottom-10 sm:top-12 sm:bottom-12 w-[3px] rounded-full"
        style={{ background: dayColor, boxShadow: `0 0 22px ${dayColor}` }} />

      <header className="mb-6">
        <div className="flex items-center gap-2.5 font-mono text-[11px] tracking-[0.18em] uppercase text-[var(--color-ink-mute)] mb-4 flex-wrap">
          <span style={{ color: dayColor }}>{DAY_LABEL[artist.day]}</span>
          <span className="opacity-40">·</span>
          <span>{d.origin}</span>
        </div>
        <div className="flex items-start gap-4 mb-4">
          <Avatar artist={artist} size={80} rounded={false} className="mt-1.5" />
          <div className="min-w-0 flex-1">
            <h2 className="font-[var(--font-display)] font-normal text-[clamp(34px,4.8vw,54px)] leading-[1.02] tracking-[-0.028em] mb-2">
              {artist.name}
            </h2>
            {d.real_name && d.real_name !== artist.name && (
              <div className="font-mono text-xs text-[var(--color-ink-mute)] tracking-[0.08em]">{d.real_name}</div>
            )}
          </div>
        </div>
        <p className="font-[var(--font-display)] italic font-light text-[20px] leading-snug text-[var(--color-ink-dim)] max-w-[580px]">
          {d.vibe || artist.blurb}
        </p>
      </header>

      {spotifyIds.length > 0 && (
        <section className="mt-8 mb-2 relative">
          <span className="absolute -top-2.5 left-3.5 px-2.5 bg-[#0c0b1d] font-mono text-[9.5px] tracking-[0.18em] text-[var(--color-ink-mute)] uppercase z-10">
            Listen on Spotify
          </span>
          <div className="flex flex-col gap-3">
            {spotifyIds.map(sid => (
              <iframe key={sid}
                src={`https://open.spotify.com/embed/artist/${sid}?utm_source=generator&theme=0`}
                width="100%" height={352} frameBorder={0}
                allow="autoplay; encrypted-media; fullscreen; picture-in-picture"
                referrerPolicy="no-referrer"
                loading="lazy"
                title={`${artist.name} on Spotify`}
                className="rounded-xl bg-[var(--color-bg-2)] block"
              />
            ))}
          </div>
        </section>
      )}

      <div className="my-7 p-5 px-6 rounded-xl border border-l-[3px] flex items-center gap-5 flex-wrap"
        style={{
          background: d.cercle_history.played
            ? `linear-gradient(180deg, color-mix(in srgb, ${dayColor} 12%, transparent), rgba(255,255,255,0.01))`
            : "linear-gradient(180deg, rgba(255,255,255,0.035), rgba(255,255,255,0.01))",
          borderColor: "var(--color-line)",
          borderLeftColor: d.cercle_history.played ? dayColor : "var(--color-accent)",
        }}>
        <div className="font-mono text-[10px] tracking-[0.18em] uppercase font-medium flex-shrink-0"
          style={{ color: d.cercle_history.played ? dayColor : "var(--color-accent)" }}>
          {d.cercle_history.played ? "Cercle alumnus" : "Cercle debut"}
        </div>
        <div className="text-sm leading-snug text-[var(--color-ink-dim)]">{d.cercle_history.where}</div>
      </div>

      <section className="grid grid-cols-2 md:grid-cols-4 gap-px my-7 bg-[var(--color-line)] rounded-xl overflow-hidden">
        {[
          { label: "Monthly listeners", value: d.listeners || "—", small: false as const },
          {
            label: "Fanbase",
            value: (
              <span className="flex items-center gap-2.5">
                <span className="fb-dots" style={{ ["--dot-color" as any]: dayColor }}>
                  {[1, 2, 3, 4].map(i => <i key={i} className={i <= dots ? "on" : ""} />)}
                </span>
                <span className="font-mono text-[11px] text-[var(--color-ink-dim)]">{d.fanbase}</span>
              </span>
            ),
            small: false as const,
          },
          { label: "BPM", value: `${artist.bpm[0]}–${artist.bpm[1]}`, small: false as const },
          { label: "Best for", value: d.best_for || "—", small: true as const },
        ].map((s, i) => (
          <div key={i} className="bg-[var(--color-bg-1)] p-4">
            <div className="font-mono text-[9.5px] tracking-[0.16em] uppercase text-[var(--color-ink-mute)] mb-2">
              {s.label}
            </div>
            <div className={s.small
              ? "text-xs leading-snug text-[var(--color-ink-dim)]"
              : "font-[var(--font-display)] text-[17px] leading-tight tracking-[-0.01em]"}>
              {s.value}
            </div>
          </div>
        ))}
      </section>

      {d.top_tracks.length > 0 && (
        <Section title="Most-played tracks">
          <ol className="flex flex-col gap-px bg-[var(--color-line)] rounded-xl overflow-hidden">
            {d.top_tracks.map((tr, i) => (
              <li key={i} className="grid grid-cols-[28px_1fr_auto] items-center gap-3.5 px-4 py-3 bg-[var(--color-bg-1)] hover:bg-[var(--color-bg-2)] transition-colors">
                <span className="font-mono text-[11px] text-[var(--color-ink-mute)]">{String(i + 1).padStart(2, "0")}</span>
                <span className="text-sm flex items-baseline flex-wrap gap-2.5">
                  {tr.title}
                  {tr.year && <span className="font-mono text-[10px] text-[var(--color-ink-mute)]">{tr.year}</span>}
                </span>
                <span className="font-mono text-[10.5px] text-[var(--color-ink-mute)] text-right max-w-[260px] hidden md:inline">
                  {tr.note}
                </span>
              </li>
            ))}
          </ol>
        </Section>
      )}

      {d.labels.length > 0 && (
        <Section title="Labels">
          <div className="flex flex-wrap gap-1.5">
            {d.labels.map(l => <Badge key={l}>{l}</Badge>)}
          </div>
        </Section>
      )}

      <Section title="Genres">
        <div className="flex flex-wrap gap-1.5">
          {artist.genres.map(g => (
            <span key={g}
              className="font-mono text-[10.5px] tracking-[0.1em] uppercase px-3 py-1.5 rounded-full border"
              style={{
                background: `color-mix(in srgb, ${GENRES[g].color} 14%, transparent)`,
                borderColor: `color-mix(in srgb, ${GENRES[g].color} 35%, transparent)`,
                color: GENRES[g].color,
              }}>{GENRES[g].label}</span>
          ))}
        </div>
      </Section>

      {d.collabs.length > 0 && (
        <Section title="Frequent collaborators">
          <div className="flex flex-wrap gap-1.5">
            {d.collabs.map(c => <Badge key={c}>{c}</Badge>)}
          </div>
        </Section>
      )}

      {d.notable && <Section title="Notable"><p className="text-sm leading-relaxed text-[var(--color-ink-dim)]">{d.notable}</p></Section>}
      {d.active && <Section title="Active since"><p className="text-sm leading-relaxed text-[var(--color-ink-dim)]">{d.active}</p></Section>}

      <Separator className="my-8" />
      <div className="flex justify-end">
        {picked ? (
          <Button variant="destructive" size="lg" onClick={() => onToggle(artist.id)}>Remove from plan</Button>
        ) : (
          <button
            onClick={() => onToggle(artist.id)}
            className="inline-flex items-center justify-center gap-2 h-12 px-6 rounded-full text-[#0a0810] font-semibold text-sm transition-all hover:-translate-y-px"
            style={{
              background: `linear-gradient(120deg, ${dayColor}, var(--color-sat), var(--color-sun))`,
              boxShadow: `0 12px 28px -10px ${dayColor}`,
            }}
          >
            Add to plan
          </button>
        )}
      </div>
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="my-6">
      <h3 className="font-mono text-[10px] tracking-[0.22em] uppercase text-[var(--color-ink-mute)] font-medium mb-3.5">
        {title}
      </h3>
      {children}
    </section>
  );
}
