// Hierarchical venue tree mirroring the PI Events App's curated booking-
// guide venues list (booking-guide-venues.html). 109 unique UK + Ireland
// venues grouped Country → City → Venue. Source of truth lives in the
// app; this is a parsed snapshot. Re-run scripts/sync-venue-tree.mjs to
// refresh from the app source.

import treeData from "./venue-tree.json";

export interface VenueLeaf {
  key: string;       // canonical lookup key (e.g. "The O2 Arena, London")
  display: string;   // display name (e.g. "The O2 Arena")
  slug: string;      // URL slug (e.g. "the-o2-arena-london")
  imageUrl?: string; // optional venue hero image (scraped/sourced separately)
}

export interface VenueCity {
  name: string;
  venues: VenueLeaf[];
}

export interface VenueCountry {
  country: string;
  cities: VenueCity[];
}

function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/&/g, "and")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

const RAW = treeData as Array<{
  country: string;
  cities: Array<{ name: string; venues: Array<{ key: string; display: string }> }>;
}>;

type RawVenue = { key: string; display: string; imageUrl?: string };

export const VENUE_TREE: VenueCountry[] = RAW.map((c) => ({
  country: c.country,
  cities: c.cities.map((city) => ({
    name: city.name,
    venues: (city.venues as RawVenue[]).map((v) => ({
      key: v.key,
      display: v.display,
      slug: slugify(`${v.display}-${city.name}`),
      imageUrl: v.imageUrl,
    })),
  })),
}));

let allVenues: VenueLeaf[] | null = null;
let bySlug: Map<string, VenueLeaf & { city: string; country: string }> | null = null;

function buildIndex() {
  if (allVenues) return;
  allVenues = [];
  bySlug = new Map();
  for (const c of VENUE_TREE) {
    for (const ci of c.cities) {
      for (const v of ci.venues) {
        allVenues.push(v);
        bySlug.set(v.slug, { ...v, city: ci.name, country: c.country });
      }
    }
  }
}

export function getAllVenues(): VenueLeaf[] {
  buildIndex();
  return allVenues!;
}

export function getVenueBySlug(
  slug: string
): (VenueLeaf & { city: string; country: string }) | undefined {
  buildIndex();
  return bySlug!.get(slug);
}

export function totalVenues(): number {
  buildIndex();
  return allVenues!.length;
}
