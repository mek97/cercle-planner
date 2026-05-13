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
        <div className="text-[var(--color-ink-faint)] text-[11px] uppercase tracking-[0.06em] inline-flex items-center gap-2 md:justify-end flex-wrap">
          <span>Zero tracking · your picks live in your browser, not ours</span>
          <a
            href="https://github.com/mek97/cercle-planner"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="View source on GitHub"
            className="inline-flex items-center text-[var(--color-ink-faint)] hover:text-[var(--color-ink-dim)] transition-colors"
          >
            <GithubMark />
          </a>
        </div>
      </div>
    </footer>
  );
}

function GithubMark() {
  return (
    <svg viewBox="0 0 24 24" className="w-3.5 h-3.5" fill="currentColor" aria-hidden="true">
      <path d="M12 .5C5.65.5.5 5.65.5 12c0 5.08 3.29 9.39 7.86 10.91.58.1.79-.25.79-.55v-2.08c-3.2.7-3.87-1.36-3.87-1.36-.52-1.33-1.28-1.68-1.28-1.68-1.05-.72.08-.71.08-.71 1.16.08 1.77 1.19 1.77 1.19 1.03 1.76 2.7 1.25 3.36.95.1-.75.4-1.26.73-1.55-2.55-.29-5.24-1.28-5.24-5.69 0-1.26.45-2.28 1.18-3.09-.12-.29-.51-1.46.11-3.04 0 0 .96-.31 3.15 1.18a10.94 10.94 0 0 1 5.74 0c2.19-1.49 3.15-1.18 3.15-1.18.62 1.58.23 2.75.11 3.04.74.81 1.18 1.83 1.18 3.09 0 4.42-2.7 5.39-5.27 5.68.41.36.78 1.06.78 2.14v3.17c0 .31.21.66.79.55C20.21 21.38 23.5 17.08 23.5 12 23.5 5.65 18.35.5 12 .5Z" />
    </svg>
  );
}
