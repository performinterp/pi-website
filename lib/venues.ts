import data from "./venue-data.json";

export interface AccessFeatureDef {
  icon: string;
  label: string;
  desc: string;
}

export interface VenueDetails {
  address?: string;
  address2?: string;
  city?: string;
  postcode?: string;
  mapsUrl?: string;
}

export interface VenueContact {
  email?: string;
  vrs?: string;
  vrsLabel?: string;
  phone?: string;
  note?: string;
  bslGuaranteed?: boolean;
  url?: string;
  form?: string;
}

const ACCESS_FEATURE_DEFS = data.ACCESS_FEATURE_DEFS as Record<string, AccessFeatureDef>;
const VENUE_ACCESS_FEATURES = data.VENUE_ACCESS_FEATURES as Record<string, string[]>;
const VENUE_DETAILS = data.VENUE_DETAILS as Record<string, VenueDetails>;
const VENUE_CONTACTS = data.VENUE_CONTACTS as Record<string, VenueContact>;

function norm(s: string): string {
  return s.toLowerCase().replace(/,/g, "").replace(/\s+/g, " ").trim();
}

function longestMatch<T>(map: Record<string, T>, query: string): T | undefined {
  const n = norm(query);
  if (map[n]) return map[n];
  let best: T | undefined;
  let bestLen = 0;
  for (const [key, value] of Object.entries(map)) {
    if (n.includes(key) || key.includes(n)) {
      if (key.length > bestLen) {
        bestLen = key.length;
        best = value;
      }
    }
  }
  return best;
}

export function getAccessFeatureDef(key: string): AccessFeatureDef | undefined {
  return ACCESS_FEATURE_DEFS[key];
}

export function listAllFeatureDefs(): Record<string, AccessFeatureDef> {
  return ACCESS_FEATURE_DEFS;
}

export function getVenueFeatures(venue: string, eventName?: string): string[] {
  if (eventName) {
    const fromEvent = longestMatch(VENUE_ACCESS_FEATURES, eventName);
    if (fromEvent) return fromEvent;
  }
  if (venue) {
    const fromVenue = longestMatch(VENUE_ACCESS_FEATURES, venue);
    if (fromVenue) return fromVenue;
  }
  if (venue) {
    const contact = longestMatch(VENUE_CONTACTS, venue);
    if (contact) {
      const altVenue = Object.entries(VENUE_CONTACTS).find(
        ([, v]) => v === contact
      )?.[0];
      if (altVenue) {
        const features = longestMatch(VENUE_ACCESS_FEATURES, altVenue);
        if (features) return features;
      }
    }
  }
  return [];
}

export function getVenueDetails(venue: string): VenueDetails | undefined {
  return longestMatch(VENUE_DETAILS, venue);
}

export function getVenueContact(venue: string): VenueContact | undefined {
  return longestMatch(VENUE_CONTACTS, venue);
}

// Ported from pi-events-standalone-app/public/app.js — findMatchingVenues (line 4834).
// Used by the request-an-interpreter form's debounced auto-lookup.
export interface VenueMatch extends VenueContact {
  venueName: string;
}

export function findMatchingVenues(query: string): VenueMatch[] {
  if (!query || query.trim() === "") return [];
  const queryLower = norm(query);

  if (VENUE_CONTACTS[queryLower]) {
    return [{ venueName: queryLower, ...VENUE_CONTACTS[queryLower] }];
  }

  const matches: VenueMatch[] = [];
  const seenEmails = new Set<string>();
  for (const [key, contact] of Object.entries(VENUE_CONTACTS)) {
    if (
      (queryLower.includes(key) || key.includes(queryLower)) &&
      !seenEmails.has(contact.email ?? "")
    ) {
      matches.push({ venueName: key, ...contact });
      seenEmails.add(contact.email ?? "");
    }
  }

  matches.sort((a, b) => a.venueName.length - b.venueName.length);
  return matches;
}
