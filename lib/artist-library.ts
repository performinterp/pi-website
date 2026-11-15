// Curated library of artist images plus the category default: the picture
// an event card falls back to.
//
// Order (lib/events.ts, components/event-image.tsx):
//   1. The sheet's own picture, wherever it's hosted (e.g. the O2's poster).
//   2. If that's missing or fails to load (some Safari content blockers strip
//      third-party images): the artist library, then the category default.
//   3. If none of those: a plain navy card with the category name.
// Until Nov 2026 the default beat any non-PI sheet picture, so 89% of
// upcoming events showed a default even when the sheet had the real one.
//
// Artist matching is prefix-only — "Harry Styles Concert" matches "harry-styles"
// but "An Evening with David Sedaris" does NOT match "david-sedaris". To cover
// non-prefix variants, add an explicit alias key pointing at the same image,
// e.g. "an-evening-with-david-sedaris": `${CDN_BASE}david-sedaris.jpg`.

const CDN_BASE = "https://media.performanceinterpreting.co.uk/artists/";
const DEFAULTS_BASE = "https://media.performanceinterpreting.co.uk/defaults/";

// A default must show the genre and nothing else (Marie, Nov 2026). The
// comedy, family, festival, theatre and sport photos each showed a specific
// act, show, stage or person, which on another event implies they're on the
// bill, so those categories now get the plain navy card instead. Concert
// keeps its photo of a PI interpreter at work.
//
// Normalised match: category name lowercased and reduced to first alphanumeric
// run (so "Camping Festival" → "camping"), then mapped here.
const CATEGORY_DEFAULTS: Readonly<Record<string, string>> = {
  concert: `${DEFAULTS_BASE}default-concert.jpg`,
};

// Sheet values that are placeholders, not pictures of the event: the site's
// own stock photos (/images/...) and any of the shared defaults. The
// publishing script writes defaults into the sheet, sometimes the concert one
// on Family, Comedy or Talks rows, so the site ignores them and picks its own
// by category.
const PLACEHOLDER_IMAGE =
  /^https?:\/\/(www\.)?performanceinterpreting\.co\.uk\/images\/|\/defaults\/default-/;

export function isPlaceholderImage(url: string): boolean {
  return PLACEHOLDER_IMAGE.test(url);
}

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
  // Official Live Tour key art — no year on the artwork, so the prefix key
  // covers every tour year ("Strictly Come Dancing Tour 2027" and successors).
  "strictly-come-dancing": "/artists/strictly-come-dancing.jpg",
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

// Test-friendly export — only consumed if a future test runner is added.
export const __testing = { slugify, ARTIST_LIBRARY, CATEGORY_DEFAULTS, CDN_BASE };
