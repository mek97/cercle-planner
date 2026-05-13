export function Footer() {
  return (
    <footer className="relative z-10 max-w-[1280px] mx-auto mt-16 px-6 md:px-10 py-10 border-t border-[var(--color-line)] flex flex-col md:flex-row justify-between items-start gap-6 font-mono text-xs tracking-[0.04em] text-[var(--color-ink-mute)]">
      <div className="space-y-1">
        <div>
          <strong className="text-[var(--color-ink-dim)] font-medium">Cercle Festival 2026</strong>
          <span> · Bois de Boulogne, Paris · May 22–24</span>
        </div>
        <div className="text-[var(--color-ink-faint)] text-[11px]">
          Fan-made hobby project · not affiliated with Cercle, the festival, or any artist
        </div>
      </div>
      <div className="max-w-[500px] md:text-right leading-relaxed space-y-1.5">
        <div>
          Built with Claude and love. Lineup, set times &amp; artist data scraped (lovingly) from{" "}
          <a href="https://festival.cercle.io" target="_blank" rel="noopener noreferrer"
            className="text-[var(--color-ink-dim)] hover:text-[var(--color-ink)] underline-offset-2 hover:underline">
            festival.cercle.io
          </a>, Spotify, Resident Advisor, Wikipedia &amp; Cercle's YouTube.
        </div>
        <div className="text-[var(--color-ink-faint)] text-[11px] uppercase tracking-[0.06em]">
          Schedules change · trust the{" "}
          <a href="https://festival.cercle.io/line-up" target="_blank" rel="noopener noreferrer"
            className="hover:text-[var(--color-ink-dim)] underline-offset-2 hover:underline">
            official site
          </a>{" "}over us.
        </div>
        <div className="text-[var(--color-ink-faint)] text-[11px] uppercase tracking-[0.06em]">
          Zero tracking · your picks live in your browser, not ours ·{" "}
          <a
            href="https://github.com/mek97/cercle-planner"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-[var(--color-ink-dim)] underline-offset-2 hover:underline"
          >
            view source
          </a>
        </div>
      </div>
    </footer>
  );
}
