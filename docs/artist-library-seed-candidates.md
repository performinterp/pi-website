# Artist Library Seed Candidates

These are the recurring artists, festivals, and shows on the current PI Workflow schedule (316 events). Ranked by how often they appear — top of the list = highest reuse.

Coverage state at time of writing: 95.3% of events already get first-party images via the category-default fallback layer. The artist library is the polish-on-top — replacing generic category defaults with artist-specific imagery for headliners that recur.

## How to add an entry

1. Source an image — Wikimedia Commons for CC-safe; press kits for venues/festivals you work with directly.
2. Upload to `media.performanceinterpreting.co.uk/artists/<slug>.<ext>` (jpg or png).
3. Uncomment the matching line in [`lib/artist-library.ts`](../lib/artist-library.ts) (`ARTIST_LIBRARY` const). Use the slug column below verbatim.
4. **Never add a library entry pointing at a missing file** — it silently breaks that artist's card.

## Tier 1 — 4+ appearances (highest reuse)

| Count | Artist | Slug |
|------:|--------|------|
| 13 | Harry Styles | `harry-styles` |
| 9 | The Weeknd | `the-weeknd` |
| 9 | BST (British Summer Time) | `bst` |
| 7 | Metallica | `metallica` |
| 6 | London Pride | `london-pride` |
| 6 | Bruno Mars | `bruno-mars` |
| 6 | Bon Jovi | `bon-jovi` |
| 5 | Ariana Grande | `ariana-grande` |
| 4 | Lewis Capaldi | `lewis-capaldi` |
| 4 | Take That Circus | `take-that-circus` |

## Tier 2 — 3 appearances

| Count | Artist | Slug |
|------:|--------|------|
| 3 | My Chemical Romance | `my-chemical-romance` |
| 3 | Sammy Hagar | `sammy-hagar` |
| 3 | Luke Combs | `luke-combs` |
| 3 | Abba Voyage | `abba-voyage` |
| 3 | Hilary Duff | `hilary-duff` |
| 3 | David Sedaris | `david-sedaris` |
| 3 | Zach Bryan Heaven | `zach-bryan-heaven` |
| 3 | An Evening with David Sedaris | `an-evening-with-david-sedaris` (alias → use same image as `david-sedaris`) |

## Tier 3 — 2 appearances

| Count | Artist | Slug |
|------:|--------|------|
| 2 | Olivia Dean | `olivia-dean` |
| 2 | Bad Bunny | `bad-bunny` |
| 2 | BTS | `bts` |
| 2 | Bluey's Big Play | `bluey-s-big-play` |
| 2 | Critical Role | `critical-role` |
| 2 | System of a Down | `system-of-a-down` |
| 2 | Latitude | `latitude` |
| 2 | Summer Walker | `summer-walker` |
| 2 | Peter Kay | `peter-kay` |
| 2 | Hollywood Vampires | `hollywood-vampires` |
| 2 | Niall Horan | `niall-horan` |
| 2 | Westlife | `westlife` |
| 2 | Noah Kahan | `noah-kahan` |
| 2 | Myles Smith | `myles-smith` |
| 2 | Jamie Cullum | `jamie-cullum` |
| 2 | Dermot Kennedy | `dermot-kennedy` |
| 2 | Calvin Harris | `calvin-harris` |
| 2 | Brighton Pride | `brighton-pride` |
| 2 | Dog Man The Musical | `dog-man-the-musical` |
| 2 | Foo Fighters | `foo-fighters` |

## Notes

- "Circus Starr" already has multiple first-party images in the sheet (`media.performanceinterpreting.co.uk/artists/circus-starr-*.jpg`), so the per-event curation always wins — no library entry needed.
- "An Evening with David Sedaris" doesn't prefix-match `david-sedaris` (the event name starts with "An Evening with"), so it's listed as an explicit alias key pointing at the same image.
- Festivals (BST, Latitude, London Pride, Brighton Pride) currently fall back to `default-festival.png`, which is a generic festival shot. Adding specific imagery for each is high-impact because the same image fronts every appearance in that festival's run.
