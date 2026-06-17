// Curated library of artist images plus category-default fallback, both
// hosted first-party so cards never go blank.
//
// Why this exists: third-party venue and press images (theo2.co.uk,
// wembleystadium.com, independent.co.uk, livenationinternational.com,
// downloadfestival.co.uk, billboard.com, etc.) are aggressively stripped by
// Safari content blockers and ITP in some user profiles, leaving event cards
// with empty image boxes. Images on media.performanceinterpreting.co.uk are
// served first-party and never blocked.
//
// Resolution order at sheet-read time (lib/events.ts):
//   1. First-party sheet URL (per-event curation always wins)
//   2. Artist library hit (recurring headliners with a curated image)
//   3. Category default on PI CDN (covers the long tail with category imagery)
//   4. Original third-party sheet URL (last resort — may be blocked)
//
// Artist matching is prefix-only — "Harry Styles Concert" matches "harry-styles"
// but "An Evening with David Sedaris" does NOT match "david-sedaris". To cover
// non-prefix variants, add an explicit alias key pointing at the same image,
// e.g. "an-evening-with-david-sedaris": `${CDN_BASE}david-sedaris.jpg`.

const CDN_BASE = "https://media.performanceinterpreting.co.uk/artists/";
const DEFAULTS_BASE = "https://media.performanceinterpreting.co.uk/defaults/";

// Category defaults already living on the CDN. Verified live 2026-06-09:
//   default-concert.jpg, default-comedy.jpg, default-family.png,
//   default-festival.png, default-theatre.jpg
//
// Sheet categories that don't have a 1:1 default fall back to the closest
// match (Pride/Camping Festival/Non-Camping Festival → festival; Other → concert).
// Sports has no CDN default yet — uses a local first-party fallback below.
//
// Normalised match: category name lowercased and reduced to first alphanumeric
// run (so "Camping Festival" → "camping"), then mapped here.
const CATEGORY_DEFAULTS: Readonly<Record<string, string>> = {
  concert: `${DEFAULTS_BASE}default-concert.jpg`,
  comedy: `${DEFAULTS_BASE}default-comedy.jpg`,
  family: `${DEFAULTS_BASE}default-family.png`,
  festival: `${DEFAULTS_BASE}default-festival.png`,
  camping: `${DEFAULTS_BASE}default-festival.png`,
  "non-camping": `${DEFAULTS_BASE}default-festival.png`,
  pride: `${DEFAULTS_BASE}default-festival.png`,
  theatre: `${DEFAULTS_BASE}default-theatre.jpg`,
  // Sports has no CDN default — served first-party from the site's own /public.
  sports: "/images/football-stadium.jpg",
  // Talks & Discussions: no good visual default — return null so the existing
  // gradient placeholder in events-filter.tsx renders the category name instead.
  // Same for "Other".
};

// Keys MUST be canonical artist/festival slugs (lowercase, hyphenated).
// Add an entry ONLY after the image is uploaded to CDN_BASE<slug>.<ext> —
// an entry pointing at a missing file would silently break that artist's card.
//
// Seed candidate list (38 recurring acts ranked by appearance count) lives at
// docs/artist-library-seed-candidates.md.
const ARTIST_LIBRARY: Readonly<Record<string, string>> = {
  // Seeded 2026-06-17 with recurring Wembley Stadium headliners. These are
  // hosted first-party in /public/artists (same origin → never blocked by
  // content blockers), sourced from Wikimedia Commons (CC-licensed). Keys are
  // canonical slugs; prefix-matched so "Harry Styles Concert" → "harry-styles"
  // and "The Weeknd & Supporting Act" → "the-weeknd".
  "harry-styles": "/artists/harry-styles.jpg",
  "bruno-mars": "/artists/bruno-mars.jpg",
  "the-weeknd": "/artists/the-weeknd.jpg",
  "bon-jovi": "/artists/bon-jovi.jpg",
  "my-chemical-romance": "/artists/my-chemical-romance.jpg",
  "luke-combs": "/artists/luke-combs.jpg",
};

// Sorted longest-first so progressive prefix match picks the most specific key
// when multiple library entries could match the same event name.
const SORTED_KEYS = Object.keys(ARTIST_LIBRARY).sort((a, b) => b.length - a.length);

function slugify(s: string): string {
  return s
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export function resolveLibraryImage(eventName: string): string | null {
  if (SORTED_KEYS.length === 0) return null;
  const slug = slugify(eventName);
  for (const key of SORTED_KEYS) {
    if (slug === key || slug.startsWith(`${key}-`)) {
      return ARTIST_LIBRARY[key];
    }
  }
  return null;
}

export function resolveCategoryFallback(category: string): string | null {
  const key = slugify(category).split("-")[0];
  if (!key) return null;
  // Two-word categories ("Camping Festival", "Non-Camping Festival") need the
  // full normalised form to disambiguate from plain "Festival".
  const full = slugify(category);
  if (full.startsWith("non-camping")) return CATEGORY_DEFAULTS["non-camping"] ?? null;
  if (full.startsWith("camping")) return CATEGORY_DEFAULTS["camping"] ?? null;
  return CATEGORY_DEFAULTS[key] ?? null;
}

export function isFirstPartyImage(url: string): boolean {
  return (
    url.startsWith("https://media.performanceinterpreting.co.uk/") ||
    url.startsWith("/")
  );
}

// Test-friendly export — only consumed if a future test runner is added.
export const __testing = { slugify, ARTIST_LIBRARY, CATEGORY_DEFAULTS, CDN_BASE };
