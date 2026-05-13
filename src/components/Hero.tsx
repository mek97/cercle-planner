import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { ARTISTS } from "@/data/artists";
import { Button } from "@/components/ui/button";

interface Props { picksCount: number; }

export function Hero({ picksCount }: Props) {
  const uniqueGenres = new Set<string>();
  ARTISTS.forEach(a => a.genres.forEach(g => uniqueGenres.add(g)));

  const fadeUp = {
    hidden: { opacity: 0, y: 16 },
    show: (i = 0) => ({
      opacity: 1, y: 0,
      transition: { duration: 0.7, delay: i * 0.08, ease: [0.2, 0.8, 0.2, 1] as const },
    }),
  };

  return (
    <section className="relative z-10 max-w-[1280px] mx-auto px-4 sm:px-6 md:px-10 pt-7 sm:pt-12 md:pt-24 pb-10 md:pb-20">
      <motion.div
        className="flex items-center gap-3 flex-wrap mb-4 md:mb-5"
        variants={fadeUp} initial="hidden" animate="show" custom={0}
      >
        <div className="inline-flex items-center gap-2.5 font-mono text-[10px] sm:text-[11.5px] tracking-[0.18em] sm:tracking-[0.2em] uppercase text-[var(--color-ink-dim)] px-3 sm:px-4 py-2 border border-[var(--color-line)] rounded-full bg-white/[0.02] flex-wrap max-w-full">
          <span className="inline-flex items-center gap-2">
            <span
              className="w-1.5 h-1.5 rounded-full bg-[var(--color-sat)] shrink-0"
              style={{ animation: "pulse 2s infinite" }}
            />
            Cercle Festival
          </span>
          <span className="opacity-40">·</span>
          <span>Paris · May 22–24, 2026</span>
        </div>
        <a
          href="https://festival.cercle.io"
          target="_blank"
          rel="noopener noreferrer"
          className="font-mono text-[10.5px] tracking-[0.18em] uppercase text-[var(--color-ink-mute)] hover:text-[var(--color-ink-dim)] underline-offset-2 hover:underline transition-colors inline-flex items-center gap-1.5"
        >
          Fan-made · not affiliated
          <span className="opacity-60">↗</span>
        </a>
      </motion.div>

      <motion.p
        className="font-[var(--font-display)] italic text-[clamp(15.5px,1.8vw,21px)] text-[var(--color-ink-dim)] max-w-[680px] leading-snug mb-6 md:mb-8"
        variants={fadeUp} initial="hidden" animate="show" custom={1}
      >
        You know Cercle. The team that puts DJs on the Pyramids of Giza, the Eiffel Tower,
        a hot-air balloon over Cappadocia, and (memorably) the top of an iceberg.
        This time they stayed home.
        <span className="text-[var(--color-ink)] not-italic font-[var(--font-sans)] font-medium">
          {" "}Three days. Three space-themed stages. Forty-two sets. Forty-four artists.
          Sold out — but you're here anyway.
        </span>
      </motion.p>

      <motion.h1 className="display-h1 mb-5 md:mb-8 max-w-[1100px]" variants={fadeUp} initial="hidden" animate="show" custom={2}>
        Plan your <em className="display-em">perfect</em><br />
        weekend.
      </motion.h1>

      <motion.p className="text-[15px] md:text-lg leading-snug text-[var(--color-ink-dim)] max-w-[560px] mb-7 md:mb-10"
        variants={fadeUp} initial="hidden" animate="show" custom={3}>
        Take the vibe quiz, preview every artist on Spotify, drag a weekend together
        that doesn't have you sprinting between stages. Lives in your browser. Share
        it when you've got it figured out (or want bragging rights).
      </motion.p>

      <motion.div className="flex gap-3 flex-wrap mb-10 md:mb-16"
        variants={fadeUp} initial="hidden" animate="show" custom={4}>
        <Button asChild size="lg" variant="glow">
          <a href="#quiz">Start the vibe quiz <ArrowRight className="w-4 h-4" /></a>
        </Button>
        <Button asChild size="lg" variant="outline">
          <a href="#lineup">Skip to lineup</a>
        </Button>
      </motion.div>

      <style>{`
        @keyframes pulse {
          0%, 100% { box-shadow: 0 0 0 0 rgba(255, 93, 138, 0.6); }
          50%      { box-shadow: 0 0 0 8px rgba(255, 93, 138, 0); }
        }
      `}</style>

      <motion.div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6 pt-5 sm:pt-8 border-t border-[var(--color-line)] max-w-[760px]"
        variants={fadeUp} initial="hidden" animate="show" custom={5}>
        {[
          [ARTISTS.length, "sets"],
          [3, "days"],
          [uniqueGenres.size, "sub-genres"],
          [picksCount, "your picks"],
        ].map(([n, l]) => (
          <div key={l as string} className="flex flex-col gap-1">
            <strong className="font-[var(--font-display)] font-normal text-[34px] sm:text-[46px] leading-none tracking-[-0.022em] tabular-nums">{n}</strong>
            <span className="font-mono text-[10.5px] sm:text-[11px] tracking-[0.16em] uppercase text-[var(--color-ink-mute)]">{l}</span>
          </div>
        ))}
      </motion.div>
    </section>
  );
}
