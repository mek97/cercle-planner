import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import { Disc3, MapPin, Moon, Sunrise } from "lucide-react";
import { ARTISTS } from "@/data/artists";
import { AFTERPARTIES, afterpartiesForDay, type Afterparty, type AfterpartyDj } from "@/data/afterparties";

const VALID_ARTIST_IDS = new Set(ARTISTS.map(a => a.id));
import { DAY_ACCENT, DAY_FULL } from "@/data/genres";
import type { Day } from "@/data/types";
import { SectionShell } from "./SectionShell";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";

interface Props {
  onOpen: (id: string) => void;
}

// Listen for cross-component "open artist" events from the Name buttons

function durationHours(start: string, end: string): number {
  const [sh, sm] = start.split(":").map(Number);
  const [eh, em] = end.split(":").map(Number);
  // end is next-day, so add 24h to it
  const startMin = sh * 60 + sm;
  const endMin = (eh + 24) * 60 + em;
  return (endMin - startMin) / 60;
}

export function AfterpartiesSection({ onOpen }: Props) {
  const [day, setDay] = useState<Day>("fri");

  // Bridge: <Name> buttons emit a "cercle:open-artist" event so we don't need
  // to thread `onOpen` deep into the folded-b2b rendering.
  useEffect(() => {
    const handler = (e: Event) => {
      const id = (e as CustomEvent).detail;
      // Validate against known artist ids — defence-in-depth so a malicious
      // console caller (or a bad extension dispatching the same event) can't
      // even cause a state churn.
      if (typeof id === "string" && VALID_ARTIST_IDS.has(id)) onOpen(id);
    };
    window.addEventListener("cercle:open-artist", handler);
    return () => window.removeEventListener("cercle:open-artist", handler);
  }, [onOpen]);

  const parties = useMemo(() => afterpartiesForDay(day), [day]);
  const totalDjs = AFTERPARTIES.reduce((s, p) => s + p.lineup.length, 0);

  return (
    <SectionShell
      id="afterparties"
      kicker="07 · After dark"
      title={<>The night <em className="display-em">keeps going</em></>}
      lede={`Main stages close at 11. Sleep is later. ${totalDjs} more DJs running deep at Mia Mao and Kilomètre 25 — vinyl-only sets, surprise b2bs, names you'll later claim you've been into for ages.`}
    >
      <div className="flex items-center justify-between gap-3 mb-5 flex-wrap">
        <Tabs value={day} onValueChange={(v) => setDay(v as Day)}>
          <TabsList>
            <TabsTrigger value="fri" style={day === "fri" ? activeStyle("fri") : undefined}>Fri night</TabsTrigger>
            <TabsTrigger value="sat" style={day === "sat" ? activeStyle("sat") : undefined}>Sat night</TabsTrigger>
            <TabsTrigger value="sun" style={day === "sun" ? activeStyle("sun") : undefined}>Sun night</TabsTrigger>
          </TabsList>
        </Tabs>
        <span className="font-mono text-[11px] tracking-[0.06em] text-[var(--color-ink-mute)] uppercase">
          {parties.length} {parties.length === 1 ? "party" : "parties"} · {DAY_FULL[day]}
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {parties.map((p, i) => (
          <PartyCard key={p.id} party={p} accent={DAY_ACCENT[p.day]} onOpen={onOpen} delay={i * 0.08} />
        ))}
      </div>
    </SectionShell>
  );
}

function activeStyle(day: Day): React.CSSProperties {
  const c = DAY_ACCENT[day];
  return {
    background: c,
    color: day === "fri" ? "#1a1208" : day === "sat" ? "#1a0612" : "#11091e",
    boxShadow: `0 6px 18px -6px ${c}`,
  };
}

function PartyCard({
  party, accent, onOpen, delay,
}: { party: Afterparty; accent: string; onOpen: (id: string) => void; delay: number }) {
  const hours = durationHours(party.start, party.end);
  // Fold a b2b pair into one row, but preserve BOTH partners' artistIds so the row
  // can offer separate click-throughs to each artist's profile.
  interface FoldedDj extends AfterpartyDj { partnerArtistId?: string; partnerName?: string; }
  const seenNames = new Set<string>();
  const visibleLineup: FoldedDj[] = [];
  party.lineup.forEach(dj => {
    if (dj.b2bWith && seenNames.has(dj.b2bWith)) return; // already rendered the partner row
    const partner = dj.b2bWith ? party.lineup.find(p => p.name === dj.b2bWith) : undefined;
    visibleLineup.push({
      ...dj,
      partnerArtistId: partner?.artistId,
      partnerName: partner?.name,
    });
    seenNames.add(dj.name);
  });

  return (
    <motion.div
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45, delay, ease: [0.2, 0.8, 0.2, 1] }}
      className="surface rounded-2xl relative overflow-hidden"
    >
      {/* accent halo */}
      <div
        aria-hidden
        className="absolute -top-20 -right-20 w-64 h-64 rounded-full pointer-events-none"
        style={{
          background: `radial-gradient(circle, ${accent} 0%, transparent 60%)`,
          opacity: 0.18,
          filter: "blur(60px)",
        }}
      />

      <div className="relative p-6 md:p-7">
        {/* header */}
        <div className="flex items-start justify-between gap-4 mb-5">
          <div className="min-w-0 flex-1">
            <div className="font-mono text-[10px] tracking-[0.18em] uppercase text-[var(--color-ink-mute)] mb-2 flex items-center gap-2 flex-wrap">
              <span className="inline-flex items-center gap-1.5" style={{ color: accent }}>
                <Moon className="w-3 h-3" /> Afterparty
              </span>
              <span className="opacity-40">·</span>
              <span>{DAY_FULL[party.day]} night</span>
            </div>
            <h3 className="font-[var(--font-display)] text-[28px] tracking-[-0.012em] leading-none flex items-center gap-2.5 flex-wrap">
              <MapPin className="w-5 h-5" style={{ color: accent }} />
              <span>{party.venue}</span>
              {party.venueNote && (
                <span className="text-[var(--color-ink-mute)] font-light text-[20px] italic">{party.venueNote}</span>
              )}
            </h3>
          </div>

          {/* duration pill */}
          <div className="shrink-0 text-right">
            <div className="font-[var(--font-display)] text-[24px] italic font-normal" style={{ color: accent }}>
              {hours}h
            </div>
            <div className="font-mono text-[9px] tracking-[0.14em] text-[var(--color-ink-mute)] uppercase mt-0.5">
              all-night
            </div>
          </div>
        </div>

        {/* time band */}
        <div className="flex items-center gap-3 mb-6 text-[13px]">
          <span className="font-mono tabular-nums text-[var(--color-ink-dim)]">{party.start}</span>
          <div className="relative flex-1 h-1.5 rounded-full bg-[var(--color-line)] overflow-hidden">
            <div
              className="absolute inset-0 rounded-full"
              style={{
                background: `linear-gradient(90deg, ${accent}, color-mix(in srgb, var(--color-sun) 70%, transparent), var(--color-accent))`,
                opacity: 0.85,
              }}
            />
          </div>
          <span className="font-mono tabular-nums text-[var(--color-ink-dim)] inline-flex items-center gap-1">
            <Sunrise className="w-3 h-3 opacity-70" />
            {party.end}
          </span>
        </div>

        {/* lineup */}
        <div className="space-y-1.5">
          <div className="font-mono text-[10px] tracking-[0.18em] uppercase text-[var(--color-ink-mute)] mb-2">
            Lineup
          </div>
          {visibleLineup.map((dj, idx) => {
            const isB2b = !!dj.b2bWith;

            return (
              <div key={idx} className="flex items-center gap-3 group">
                <span className="font-mono italic text-[14px] text-[var(--color-ink-mute)] w-6 text-center leading-none">
                  {String(idx + 1).padStart(2, "0")}
                </span>
                <span className="flex-1 text-[16px] font-[var(--font-display)] tracking-[-0.005em] flex items-baseline gap-1.5 flex-wrap">
                  <Name name={dj.name} artistId={dj.artistId} accent={accent} />
                  {isB2b && (
                    <>
                      <span className="text-[var(--color-ink-mute)] text-[11px] font-mono italic">b2b</span>
                      <Name name={dj.partnerName || dj.b2bWith!} artistId={dj.partnerArtistId} accent={accent} />
                    </>
                  )}
                </span>
                <div className="flex items-center gap-1.5 shrink-0">
                  {/* partner's vinyl flag if folded */}
                  {dj.vinyl && (
                    <Tooltip delayDuration={200}>
                      <TooltipTrigger asChild>
                        <span className="inline-flex items-center gap-1 px-2 h-5 rounded-full font-mono text-[9.5px] tracking-[0.14em] uppercase border"
                          style={{ borderColor: "var(--color-line-strong)", color: "var(--color-ink-dim)" }}>
                          <Disc3 className="w-2.5 h-2.5" /> Vinyl
                        </span>
                      </TooltipTrigger>
                      <TooltipContent>Playing vinyl only</TooltipContent>
                    </Tooltip>
                  )}
                  {isB2b && (
                    <span className="inline-flex items-center gap-1 px-2 h-5 rounded-full font-mono text-[9.5px] tracking-[0.14em] uppercase border"
                      style={{ borderColor: `color-mix(in srgb, ${accent} 35%, transparent)`, color: accent }}>
                      b2b
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </motion.div>
  );
}

function Name({ name, artistId, accent }: { name: string; artistId?: string; accent: string }) {
  // No artistId from main lineup — show as static text
  if (!artistId) return <span>{name}</span>;
  return (
    <Tooltip delayDuration={200}>
      <TooltipTrigger asChild>
        <button
          onClick={() => {
            const event = new CustomEvent("cercle:open-artist", { detail: artistId });
            window.dispatchEvent(event);
          }}
          className="hover:[color:var(--accent)] transition-colors"
          style={{ ["--accent" as any]: accent }}
        >
          {name}
          <span className="ml-1 inline-block w-1 h-1 rounded-full align-middle" style={{ background: accent }} />
        </button>
      </TooltipTrigger>
      <TooltipContent>Also playing the main festival — click to open</TooltipContent>
    </Tooltip>
  );
}
