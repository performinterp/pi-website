# Deaf Expo 2026 — Day 1 traffic snapshot

**Captured:** 2026-05-15 (Day 1, late afternoon — before the 12h Vercel Hobby retention window rolls)
**Source:** Vercel → pi-website → Observability → Edge Requests, range = last 12h
**Site:** `performanceinterpreting.co.uk` (Next.js on Vercel)
**Plan ceiling:** Hobby — observability retention capped at 12h, no historical Analytics until @vercel/analytics shipped (deployed alongside this snapshot).

## Headline numbers (last 12h ending ~3 min before capture)

- **Total Edge Requests:** 18,000
- **HTTP mix:** 2XX dominant, small 3XX, small 4XX slice
- **Estimated unique browser sessions:** ~170–190 (proxied via `_tree.segment` hit counts)
- **Pre-expo baseline (off-the-cuff):** roughly 10–30 sessions/day at this hour for this site, so Day 1 is ~6–10× normal.

## Top routes by request count

| Route | Requests | Cache |
|---|---:|:---:|
| `/videos/app-guide/order.mp4` | 3,300 | 100% |
| `/404` | 1,100 | 100% |
| `/videos/app-guide/browse.mp4` | 200 | 100% |
| `/videos/app-guide/search.mp4` | 195 | 100% |
| `/get-app.segments/_tree.segment` | 192 | 100% |
| `/videos/app-guide/request.mp4` | 189 | 100% |
| `/videos/app-guide/notifications.mp4` | 186 | 100% |
| `/videos/app-guide/videos.mp4` | 185 | 100% |
| `/videos/app-guide/rights.mp4` | 183 | 100% |
| `/icons/pi-logo-wide.svg` | 182 | 100% |
| `/contact.segments/_tree.segment` | 181 | 100% |
| `/events.segments/_tree.segment` | 178 | 100% |
| `/deaf-community.segments/_tree.segment` | 178 | 100% |
| `/interpreters.segments/_tree.segment` | 177 | 100% |
| `/privacy.segments/_tree.segment` | 173 | 100% |
| `/about.segments/_tree.segment` | 173 | 100% |
| `/organisers.segments/_tree.segment` | 172 | 100% |
| `/index.segments/_tree.segment` | 169 | 100% |
| `/app-guide` | 140 | 100% |

## Per-page session estimate (from `_tree.segment` hits)

| Page | Approx sessions |
|---|---:|
| `/get-app` | 192 |
| `/contact` | 181 |
| `/events` | 178 |
| `/deaf-community` | 178 |
| `/interpreters` | 177 |
| `/privacy` | 173 |
| `/about` | 173 |
| `/organisers` | 172 |
| `/` (home) | 169 |

Pages are hit fairly evenly — visitors are exploring the site, not bouncing.

## Standout signals

**Good:** `/get-app` is the most-hit page and the app-guide MP4s collectively pulled 5K+ asset requests. The expo funnel (booth → site → app guide → store) is operating as designed.

**Worth investigating:** 1.1K hits to `/404` is high relative to ~170 sessions. Possible causes:
- Broken external link (flyer / QR code / press mention pointing to a dead URL)
- Bot/scanner traffic
- Old URLs being advertised somewhere that no longer resolve

Action: glance at Vercel Logs filtering for `status:404` to identify the most-requested 404 paths. Not urgent tonight; worth 10 minutes before Day 2.

## Caveats

- `_tree.segment` hit counts are an *imperfect* proxy for unique sessions. Next.js 16 loads these on navigation; cached locally per browser; cross-page navigations may reuse a single fetch. Treat the 170–190 number as order-of-magnitude.
- 12h is the Hobby observability ceiling. Day 1's full 24h is **not** recoverable after this window rolls.
- Vercel Analytics is wired up in the same commit as this snapshot — Day 2 onward will have proper page-view + visitor data in the Analytics tab.

## Plan upgrade decision (deferred)

Pro plan ($20/mo) unlocks 30-day observability retention + custom queries + anomaly alerts. Worth it if expo / launch traffic spikes become a recurring measurement need. Not required for normal operation now that Vercel Analytics is shipping.
