# Contributing

Cercle Planner is a personal hobby project — a fan-made planner for Cercle
Festival 2026. It's not affiliated with Cercle, the festival, or any artist.

Issues and pull requests are welcome. This doc covers how to get set up and
what to expect from the review process.

## Ground rules

- **Be kind.** Assume good intent. Keep discussion focused on the code.
  Full text in [CODE_OF_CONDUCT.md](CODE_OF_CONDUCT.md).
- **No tracking, no accounts, no backend.** The app is a static site that
  stores picks in `localStorage`. Changes that would add analytics, telemetry,
  remote logging, or any outbound network call beyond what's listed in
  [PRIVACY.md](PRIVACY.md) will not be accepted.
- **Stay within scope.** This is a planner for one specific festival
  (Cercle 2026, Paris, May 22–24). It's not a generic festival tool.

## Getting set up

```bash
git clone https://github.com/mek97/cercle-planner.git
cd cercle-planner
npm install
npm run dev          # http://localhost:5173
```

Other useful scripts:

```bash
npm run build        # type-check + production build into dist/
npm run preview      # serve the built bundle locally
```

Node 20+ is recommended. There's no test suite — verify changes in the browser.

## Project layout

See the **Structure** section of [README.md](README.md) for the full tree.
Quick orientation:

- `src/components/` — UI sections and charts
- `src/data/` — artists, schedule, personas, quiz, genres, Spotify IDs, types
- `src/hooks/` — `usePicks` (localStorage-backed Set), `useQuizResult`
- `src/styles/globals.css` — design tokens, reset, component styles

Raw research that fed `src/data/artists.ts` lives at the repo root
(`research-*.json`, `spotify-ids-*.json`).

## Making a change

1. Branch from `main` with a short prefix that describes the change:
   `feat/...`, `fix/...`, `docs/...`, `chore/...`, `refactor/...`.
2. Keep PRs focused — one concern per PR is much easier to review.
3. Match the surrounding code style. No linter is enforced; just keep it
   consistent with the file you're editing.
4. Before opening the PR, run `npm run build` to confirm TypeScript and Vite
   are both happy.
5. Test the change in the browser. For UI work, check both desktop and mobile
   widths (the app supports down to 320px) and both light and dark themes.

## Pull requests

- Title: short and imperative (e.g. `Fix conflict pill overlap on iOS Safari`).
- Description: explain the **why**, not just the **what**. A screenshot or
  short clip is worth a lot for visual changes.
- Link any issue the PR closes (`Closes #123`).
- Keep diffs reviewable. If a refactor is needed to enable a feature, two
  PRs (refactor first, feature second) are easier than one big one.

CI is light — Dependabot keeps dependencies fresh, and that's about it. Review
is manual.

## Reporting bugs and suggesting ideas

Open a GitHub issue with:

- What you expected
- What actually happened
- Steps to reproduce (URL, browser, viewport size if it's visual)
- A screenshot if the bug is visual

For feature ideas, describe the use case before the implementation — it's
easier to discuss the goal than a specific design.

## Security

Don't open a public issue for security problems. See
[SECURITY.md](SECURITY.md) for how to report privately.

## License

The source is [MIT-licensed](LICENSE). By contributing, you agree that your
contribution will be released under the same license.
