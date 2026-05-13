import { motion } from "framer-motion";
import { Check, Plus } from "lucide-react";
import type { Artist } from "@/data/types";
import { GENRES, DAY_LABEL } from "@/data/genres";
import { fanbaseDots } from "@/utils";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { Avatar } from "./Avatar";

interface Props {
  artist: Artist;
  picked: boolean;
  onOpen: () => void;
  onToggle: () => void;
}

export function ArtistCard({ artist, picked, onOpen, onToggle }: Props) {
  // Use the theme-aware CSS variable instead of the hex constant, so cards
  // pick up the muted light-mode palette automatically. The variable name
  // matches the keys defined in globals.css: --color-fri/sat/sun.
  const accent = `var(--color-${artist.day})`;
  const dots = fanbaseDots(artist.details.fanbase);

  // Use a non-interactive container with role=group; the open and toggle actions
  // are sibling buttons so we don't have an interactive-inside-interactive HTML violation.
  return (
    <motion.div
      whileHover={{ y: -3 }}
      transition={{ type: "spring", stiffness: 380, damping: 28 }}
      className="relative h-full"
    >
      {/* primary card surface — acts as the open trigger */}
      <button
        type="button"
        onClick={onOpen}
        aria-label={`Open ${artist.name}`}
        className="text-left h-full min-h-[188px] w-full relative overflow-hidden rounded-2xl p-5 pr-14 flex flex-col justify-between gap-3 surface transition-all cursor-pointer hover:border-[var(--color-line-bright)] hover:shadow-[0_8px_24px_-12px_rgba(24,20,35,0.18)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-sat)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--color-bg-0)]"
        style={picked ? {
          borderColor: accent,
          // Subtle, contained glow — was 32px blur / 45% mix; trimmed so the
          // picked state reads as a confident outline rather than a halo
          // that bleeds into neighbouring cards.
          boxShadow: `0 8px 22px -12px color-mix(in srgb, ${accent} 32%, transparent), 0 0 0 1px color-mix(in srgb, ${accent} 22%, transparent) inset`,
        } : undefined}
      >
        <div
          className="absolute top-0 left-0 right-0 h-[2px] origin-left transition-transform duration-500"
          style={{
            background: accent,
            transform: picked ? "scaleX(1)" : "scaleX(0)",
            // Softer ribbon glow — was 12px blur full-strength.
            boxShadow: picked ? `0 0 8px color-mix(in srgb, ${accent} 55%, transparent)` : undefined,
          }}
        />

        <div>
          <div className="font-mono text-[10px] tracking-[0.18em] uppercase mb-3 flex items-center gap-2"
            style={{ color: accent }}>
            <span>{DAY_LABEL[artist.day]}</span>
            {artist.details.cercle_history.played && (
              <span title="Cercle alumnus"
                className="inline-block w-1.5 h-1.5 rounded-full"
                style={{
                  background: accent,
                  boxShadow: `0 0 6px color-mix(in srgb, ${accent} 60%, transparent)`,
                }} />
            )}
          </div>
          <div className="flex items-center gap-3 mb-2.5">
            <Avatar artist={artist} size={44} rounded={false} />
            <h4 className="font-[var(--font-display)] text-[22px] leading-[1.1] tracking-[-0.012em] flex-1 min-w-0 break-words">
              {artist.name}
            </h4>
          </div>
          <p className="text-[13px] text-[var(--color-ink-mute)] leading-relaxed mb-3 line-clamp-2">
            {artist.blurb}
          </p>
        </div>

        <div className="flex justify-between items-end gap-2">
          <div className="flex flex-wrap gap-1.5">
            {artist.genres.slice(0, 3).map(g => (
              <span key={g} className="genre-pill" style={{ ["--gc" as any]: `var(--color-g-${g})` }}>
                {GENRES[g].label}
              </span>
            ))}
          </div>
          <Tooltip delayDuration={250}>
            <TooltipTrigger asChild>
              <span className="fb-dots" style={{ ["--dot-color" as any]: accent }}>
                {[1, 2, 3, 4].map(i => <i key={i} className={i <= dots ? "on" : ""} />)}
              </span>
            </TooltipTrigger>
            <TooltipContent>Fanbase: {artist.details.fanbase}</TooltipContent>
          </Tooltip>
        </div>
      </button>

      {/* pick toggle — sibling button, absolutely positioned on top of the card */}
      <Tooltip delayDuration={250}>
        <TooltipTrigger asChild>
          <button
            type="button"
            aria-label={picked ? `Remove ${artist.name} from plan` : `Add ${artist.name} to plan`}
            aria-pressed={picked}
            onClick={onToggle}
            className="absolute top-3 right-3 w-[30px] h-[30px] rounded-full inline-flex items-center justify-center border transition-all hover:scale-110 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-sat)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--color-bg-0)] z-10"
            style={picked ? {
              background: accent, color: "#0a0810",
              borderColor: "transparent",
              // Tightened halo — was 18px full-strength.
              boxShadow: `0 0 10px color-mix(in srgb, ${accent} 55%, transparent)`,
            } : {
              background: "rgba(255,255,255,0.06)",
              borderColor: "var(--color-line)",
              color: "var(--color-ink-dim)",
            }}
            onMouseEnter={(e) => { if (!picked) { (e.currentTarget as HTMLElement).style.background = accent; (e.currentTarget as HTMLElement).style.color = "#0a0810"; } }}
            onMouseLeave={(e) => { if (!picked) { (e.currentTarget as HTMLElement).style.background = "rgba(255,255,255,0.06)"; (e.currentTarget as HTMLElement).style.color = "var(--color-ink-dim)"; } }}
          >
            {picked ? <Check className="w-3.5 h-3.5" /> : <Plus className="w-3.5 h-3.5" />}
          </button>
        </TooltipTrigger>
        <TooltipContent side="left">{picked ? "Remove from plan" : "Add to plan"}</TooltipContent>
      </Tooltip>
    </motion.div>
  );
}
