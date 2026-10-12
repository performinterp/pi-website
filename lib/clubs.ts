// Sports club cards — ported from the native app's tested club-matching logic
// (pi-events-standalone-app). Data is bundled from the PI Live Config sheet's
// "clubs" + "venues_candidate" tabs (see lib/club-config.json). Pure, server-
// usable module: no fetches, safe to import from a server component.

import clubConfig from "./club-config.json";
import { findMatchingVenues } from "./venues";
import type { Event } from "./types";

const SAFE_KEY = /^[a-z0-9-]+$/;

interface ClubRow {
  key?: string;
  display?: string;
  sort_order?: string;
  active?: string;
  teams?: string;
  venue_keys?: string;
  bsl_headline?: string;
  bsl_detail?: string;
  access_email?: string;
  access_phone?: string;
  access_page_url?: string;
  fixtures_url_men?: string;
  fixtures_url_women?: string;
  tickets_url?: string;
  image_url?: string;
  image_alt?: string;
  image_credit?: string;
  match_aliases?: string;
  [key: string]: unknown;
}

interface GroundRow {
  key?: string;
  display?: string;
  aliases?: string;
  address?: string;
  address2?: string;
  postcode?: string;
  city?: string;
  maps_url?: string;
  [key: string]: unknown;
}

export interface ClubGround {
  key: string;
  display: string;
  address: string;
  mapsUrl: string;
}

export interface ClubView {
  key: string;
  display: string;
  sortOrder: number;
  teams: string[];
  venueKeys: string[];
  bslHeadline: string;
  bslDetail: string;
  accessEmail: string;
  accessPhone: string;
  accessPageUrl: string;
  fixturesUrlMen: string;
  fixturesUrlWomen: string;
  ticketsUrl: string;
  imageUrl: string;
  imageAlt: string;
  imageCredit: string;
  aliases: string[];
  grounds: ClubGround[];
}

interface ClubBase {
  key: string;
  display: string;
  sortOrder: number;
  teams: string[];
  venueKeys: string[];
  bslHeadline: string;
  bslDetail: string;
  accessEmail: string;
  accessPhone: string;
  accessPageUrl: string;
  fixturesUrlMen: string;
  fixturesUrlWomen: string;
  ticketsUrl: string;
  imageUrl: string;
  imageAlt: string;
  imageCredit: string;
  aliases: string[];
}

function str(v: unknown): string {
  return String(v == null ? "" : v).trim();
}

function splitPipes(s: unknown): string[] {
  return String(s || "")
    .split("|")
    .map((x) => x.trim())
    .filter(Boolean);
}

// Ported exactly from the app's normaliseClub (pi-events-standalone-app).
function normaliseClub(r: ClubRow): ClubBase | null {
  const key = str(r.key).toLowerCase();
  if (!key || !SAFE_KEY.test(key) || !str(r.display)) return null;
  const active = str(r.active);
  if (active && !/^(true|yes|1)$/i.test(active)) return null;
  const detail = str(r.bsl_detail);
  return {
    key,
    display: str(r.display),
    sortOrder: parseInt(str(r.sort_order), 10) || 999,
    teams: splitPipes(r.teams),
    venueKeys: splitPipes(r.venue_keys).map((k) => k.toLowerCase()),
    bslHeadline: str(r.bsl_headline),
    // Unconfirmed wording never ships.
    bslDetail: /^pending/i.test(detail) ? "" : detail,
    accessEmail: str(r.access_email),
    accessPhone: str(r.access_phone),
    accessPageUrl: str(r.access_page_url),
    fixturesUrlMen: str(r.fixtures_url_men),
    fixturesUrlWomen: str(r.fixtures_url_women),
    ticketsUrl: str(r.tickets_url),
    imageUrl: str(r.image_url),
    imageAlt: str(r.image_alt),
    imageCredit: str(r.image_credit),
    aliases: splitPipes(r.match_aliases).map((a) => a.toLowerCase()),
  };
}

function buildClubList(rows: ClubRow[] | undefined): ClubBase[] {
  return (rows || [])
    .map(normaliseClub)
    .filter((c): c is ClubBase => c !== null)
    .sort((a, b) => a.sortOrder - b.sortOrder || a.display.localeCompare(b.display));
}

// Home side of a fixture title: text before " v " / " vs ". Whole title if none.
function homeSide(title: string): string {
  const t = str(title);
  const m = t.match(/^(.*?)\s+vs?\.?\s+/i);
  return (m ? m[1] : t).toLowerCase();
}

function hasWord(haystack: string, phrase: string): boolean {
  const esc = phrase.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  return new RegExp("(^|[^a-z0-9])" + esc + "($|[^a-z0-9])").test(haystack);
}

function normaliseVenue(s: string | undefined | null): string {
  return String(s || "")
    .toLowerCase()
    .replace(/\s+/g, " ")
    .trim();
}

// --- Grounds (raw, keyed) ---------------------------------------------------

const rawGrounds: GroundRow[] = (clubConfig as { grounds?: GroundRow[] }).grounds || [];

interface GroundRaw {
  key: string;
  display: string;
  address: string;
  mapsUrl: string;
}

const groundByKey = new Map<string, GroundRaw>();
// Every normalised alias (including the ground's own display) mapped to its
// ground key, used to resolve an event's venue to a ground. Sorted longest
// alias first so "wembley stadium" beats "wembley".
const aliasIndex: { alias: string; groundKey: string }[] = [];

for (const row of rawGrounds) {
  const key = str(row.key).toLowerCase();
  if (!key) continue;
  const display = str(row.display);
  const address = [str(row.address), str(row.address2), str(row.postcode)]
    .filter(Boolean)
    .join(", ");
  const mapsUrl = str(row.maps_url);
  groundByKey.set(key, { key, display, address, mapsUrl });

  const aliases = new Set<string>();
  for (const a of splitPipes(row.aliases)) aliases.add(normaliseVenue(a));
  if (display) aliases.add(normaliseVenue(display));
  for (const alias of aliases) {
    if (alias) aliasIndex.push({ alias, groundKey: key });
  }
}

aliasIndex.sort((a, b) => b.alias.length - a.alias.length);

function venueMatchesAlias(v: string, alias: string): boolean {
  if (!alias) return false;
  if (v === alias || v.startsWith(alias)) return true;
  return hasWord(v, alias);
}

/**
 * Venue key for a website event. Mirrors the native app's venue-table lookup:
 *  1. Normalised venue equals/starts-with/contains (whole words) a ground
 *     alias or display — longest alias wins. Returns that ground's key.
 *  2. Otherwise, if the site's existing venue lookup recognises the venue
 *     (findMatchingVenues), it's a KNOWN venue that isn't a club ground
 *     (e.g. Villa Park) — returns 'other' so it never matches a club.
 *  3. Otherwise returns '' (unknown venue — the fixture title decides).
 */
export function eventGroundKey(event: { venue?: string | null }): string {
  const v = normaliseVenue(event.venue);
  if (!v) return "";
  for (const entry of aliasIndex) {
    if (venueMatchesAlias(v, entry.alias)) return entry.groundKey;
  }
  if (findMatchingVenues(event.venue || "").length > 0) return "other";
  return "";
}

// --- Clubs -------------------------------------------------------------

let cachedClubs: ClubView[] | null = null;

export function getClubs(): ClubView[] {
  if (cachedClubs) return cachedClubs;
  const base = buildClubList((clubConfig as { clubs?: ClubRow[] }).clubs);
  cachedClubs = base.map((club) => {
    const grounds: ClubGround[] = [];
    for (const vk of club.venueKeys) {
      const ground = groundByKey.get(vk);
      if (ground) {
        grounds.push({
          key: ground.key,
          display: ground.display,
          address: ground.address,
          mapsUrl: ground.mapsUrl,
        });
      }
    }
    return { ...club, grounds };
  });
  return cachedClubs;
}

/**
 * A listing belongs to a club when it is Sports, the HOME side names the
 * club (whole words), and — if the venue is known — the venue is one of the
 * club's grounds.
 */
function matchesClub(
  event: Pick<Event, "name" | "categories">,
  club: ClubView,
  eventVenueKey: string
): boolean {
  const cats = (event.categories || []).map((c) => c.toLowerCase());
  if (!cats.includes("sports")) return false;
  const home = homeSide(event.name);
  if (!club.aliases.some((a) => hasWord(home, a))) return false;
  const vk = str(eventVenueKey).toLowerCase();
  if (vk && club.venueKeys.length && club.venueKeys.indexOf(vk) < 0) return false;
  return true;
}

export function clubKeyFor(
  event: Pick<Event, "name" | "categories" | "venue">,
  clubs: ClubView[]
): string {
  const eventVenueKey = eventGroundKey(event);
  for (const club of clubs) {
    if (matchesClub(event, club, eventVenueKey)) return club.key;
  }
  return "";
}
