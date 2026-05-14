# Security Policy

Cercle Planner is a static, client-side site with no backend, no accounts,
and no telemetry. The realistic attack surface is the site itself (XSS via
data files, malicious third-party embeds, dependency vulnerabilities) and
the GitHub Pages deployment.

## Supported versions

Only the latest `main` (and whatever is currently deployed) is supported.
There are no maintained release branches.

## Reporting a vulnerability

**Please don't open a public GitHub issue for security problems.** Use one
of these instead:

- **GitHub private advisory** (preferred): open a draft at
  https://github.com/mek97/cercle-planner/security/advisories/new
- **Email:** mehul@earthsync.io — include "cercle-planner security" in
  the subject line

What to include:

- A description of the issue and its impact
- Steps to reproduce (URL, browser, viewport if relevant)
- A proof of concept if you have one

## What to expect

- Acknowledgement within ~7 days
- A best-effort fix timeline once the issue is confirmed — this is a hobby
  project maintained in spare time, so urgent issues are prioritised over
  minor hardening
- Credit in the release notes if you'd like it (optional)

## Out of scope

- Reports purely against `open.spotify.com` embeds, Spotify image CDNs, or
  GitHub Pages infrastructure — report those upstream
- Missing security headers that don't change real-world exposure for a
  static site (e.g. cookies aren't used, so cookie-related headers don't
  apply)
- Automated scanner output without a concrete reproduction
