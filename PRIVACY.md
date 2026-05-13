# Privacy

Cercle Planner is a fan-made hobby project. It does not have a backend and is
not affiliated with Cercle, the festival, or any artist.

## What we store

- **Your picks** (artist IDs you've saved) and **your quiz result** (festival
  persona) are written to your browser's `localStorage`. They never leave your
  device.
- **No accounts, no login, no email, no analytics, no tracking pixels.** The
  app's Content Security Policy (`connect-src 'self'`) prevents the site from
  making outbound network calls to any other origin.

You can wipe everything at any time by clearing your browser's site data, or
via the in-app "Reset all" option.

## Third parties you may interact with

- **Spotify previews.** When you preview a track, the page loads an iframe
  from `open.spotify.com`. Spotify is its own controller for whatever it
  collects in that iframe — see https://www.spotify.com/legal/privacy-policy/.
  If you don't click a preview, no Spotify request is made.
- **Artist images.** Loaded directly from Spotify's image CDNs
  (`i.scdn.co`, `image-cdn-ak.spotifycdn.com`, `image-cdn-fa.spotifycdn.com`).
  Standard browser image requests; no cookies or scripts.
- **GitHub Pages.** The site is hosted on GitHub Pages, so GitHub may log
  visitor IP addresses per their own privacy policy:
  https://docs.github.com/site-policy/privacy-policies/github-general-privacy-statement.

## Source

The full source code is at https://github.com/mek97/cercle-planner. Anyone can
verify these claims against the running code.

## Contact

Questions? Open an issue on the GitHub repo.
