// Per-act "more info & access" links for venue event carousels.
//
// Some venues publish a dedicated access/BSL help-centre article per headliner
// (e.g. Wembley's Freshdesk articles, which list every date plus how to book
// BSL and accessible seating). These are richer than the generic event page,
// so we surface them as the "more info" link on each act in the venue carousel.
//
// Keyed by canonical venue key → derived-artist slug (both lowercased). Verified
// live (HTTP 200) 2026-06-17. When an act's run finishes, its article 404s —
// remove the stale entry then.
const ACT_INFO_LINKS: Record<string, Record<string, string>> = {
  "wembley stadium, london": {
    "harry styles":
      "https://help.wembleystadium.com/support/solutions/articles/7000096874-harry-styles-together-together-12-13-17-19-20-23-26-27-29-june-1-3-4-july-2026",
    "bruno mars":
      "https://help.wembleystadium.com/support/solutions/articles/7000096724-bruno-mars-the-romantic-tour-2026-18-19-22-24-25-28-july-2026",
    "bon jovi":
      "https://help.wembleystadium.com/support/solutions/articles/7000095792-bon-jovi-forever-tour-4-6-9-september-2026",
    "my chemical romance":
      "https://help.wembleystadium.com/support/solutions/articles/7000094871-my-chemical-romance-long-live-the-black-parade-tour-8-10-11-july-2026",
    "luke combs":
      "https://help.wembleystadium.com/support/solutions/articles/7000095591-luke-combs-my-kinda-saturday-night-tour-31-july-1-2-august-2026",
    "the weeknd":
      "https://help.wembleystadium.com/support/solutions/articles/7000095163-the-weeknd-after-hours-til-dawn-tour-14-15-16-18-19-august-2026",
    "aew in london":
      "https://help.wembleystadium.com/support/solutions/articles/7000097135-aew-all-in-london-at-wembley-stadium-30-aug-2026",
  },
};

export function getActInfoUrl(
  venueKey: string,
  artist: string
): string | undefined {
  const venue = ACT_INFO_LINKS[venueKey.toLowerCase()];
  if (!venue) return undefined;
  return venue[artist.toLowerCase()];
}
