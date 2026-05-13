# Cercle Festival 2026 · Planner

A personal, interactive planner for Cercle Festival 2026 (Bois de Boulogne, Paris · May 22–24).
React + TypeScript + Vite + Framer Motion. No backend — picks persist in `localStorage`.

## Run

```bash
npm install          # one-time
npm run dev          # dev server with hot reload  →  http://localhost:5173
npm run build        # production build  →  dist/
npm run preview      # preview the built bundle
```

After `npm run build` you can also just `open dist/index.html` (`base: "./"` is set so the
static bundle works directly from the filesystem).

## Structure

```
src/
├── App.tsx                            composes all sections
├── main.tsx                           React entry
├── data/
│   ├── artists.ts                     42 artists with rich detail (origin, top tracks,
│   │                                   Spotify listeners, Cercle history, vibe, BPM, mood…)
│   ├── personas.ts                    quiz archetypes and smart-match personas
│   ├── quiz.ts                        7-question quiz scoring + smart matches
│   ├── genres.ts                      genre palette + day labels + slot ordering
│   ├── schedule.ts                    timetable, talks, conflicts, alternates
│   ├── spotify.ts                     Spotify artist IDs for the in-modal embed player
│   └── types.ts                       TypeScript interfaces for everything above
├── hooks/
│   ├── usePicks.ts                    Set<string> of picked artist IDs · persists to localStorage
│   └── useQuizResult.ts               shared quiz-result store backed by localStorage
├── components/
│   ├── Aurora.tsx                     animated gradient backdrop (4 blobs + grain)
│   ├── Nav.tsx, Hero.tsx, Footer.tsx
│   ├── QuizSection.tsx, Quiz.tsx      vibe quiz + persona reveal
│   ├── MatchesSection.tsx             saved profile + ranked recommendations
│   ├── LineupSection.tsx              filterable artist grid
│   ├── ArtistCard.tsx, Filters.tsx
│   ├── ArtistModal.tsx                full artist detail panel with Spotify embed
│   ├── NumbersSection.tsx             lineup analytics (see charts/)
│   ├── charts/
│   │   ├── GenreDonut.tsx             primary-genre distribution
│   │   ├── StreamsVsCercle.tsx        listener scale vs Cercle history
│   │   ├── CercleBreakdown.tsx        alumni vs first-time arc
│   │   ├── BpmChart.tsx               BPM histogram, picks highlighted
│   │   ├── FanbasePyramid.tsx         42 glowing bricks sorted by fanbase
│   │   ├── MoodRadar.tsx              radar of your picks' moods
│   │   ├── MoodHeatmap.tsx            day-by-mood matrix
│   │   ├── DayGenreStack.tsx          genre mix by day
│   │   └── EnergyCurve.tsx            BPM curve across the three days
│   ├── MapSection.tsx                 stage map + picked artists by stage
│   ├── ScheduleSection.tsx            timetable with conflicts and alternates
│   ├── AfterpartiesSection.tsx        after-dark recommendations
│   ├── PlanSection.tsx                three-column timeline w/ conflict detection
│   ├── VibeSection.tsx                mood radar + energy curve + insights
│   ├── Insights.tsx                   dynamic insight cards
│   ├── PicksPill.tsx                  floating "X in your plan" pill
│   └── RevealSection.tsx              viewport-triggered fade-up wrapper
└── styles/
    └── globals.css                    tokens · reset · component styles
```

## Data sources

Raw research dumps that produced `data/artists.ts` live at the repo root:
- `research-friday.json`, `research-saturday.json`, `research-sunday.json` — full bios, top
  tracks, Cercle history, etc.
- `spotify-ids-1.json`, `spotify-ids-2.json` — Spotify artist IDs.

These were compiled from Spotify, Resident Advisor, Wikipedia, kworb.net stream counts,
Cercle's official YouTube channel, and festival profiles.
