import type { MetadataRoute } from "next";
import { fetchEvents } from "@/lib/events";
import { eventSlug } from "@/lib/event-slug";
import { VENUE_TREE } from "@/lib/venue-tree";

const BASE = "https://performanceinterpreting.co.uk";

// Dynamic sitemap supersedes the static public/sitemap.xml so the routes
// shipped overnight (testimonials, press, city landing pages) are discoverable
// by Google and AI crawlers without manual maintenance.

function citySlug(name: string): string {
  return name
    .toLowerCase()
    .replace(/&/g, "and")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date();

  const staticRoutes: MetadataRoute.Sitemap = [
    { url: `${BASE}/`, lastModified: now, changeFrequency: "weekly", priority: 1.0 },
    { url: `${BASE}/events/`, lastModified: now, changeFrequency: "daily", priority: 0.95 },
    { url: `${BASE}/organisers/`, lastModified: now, changeFrequency: "monthly", priority: 0.9 },
    { url: `${BASE}/festivals/`, lastModified: now, changeFrequency: "weekly", priority: 0.95 },
    { url: `${BASE}/sports/`, lastModified: now, changeFrequency: "weekly", priority: 0.95 },
    { url: `${BASE}/deaf-community/`, lastModified: now, changeFrequency: "monthly", priority: 0.9 },
    { url: `${BASE}/interpreters/`, lastModified: now, changeFrequency: "monthly", priority: 0.9 },
    { url: `${BASE}/about/`, lastModified: now, changeFrequency: "monthly", priority: 0.8 },
    { url: `${BASE}/venues/`, lastModified: now, changeFrequency: "weekly", priority: 0.8 },
    { url: `${BASE}/testimonials/`, lastModified: now, changeFrequency: "monthly", priority: 0.75 },
    { url: `${BASE}/press/`, lastModified: now, changeFrequency: "monthly", priority: 0.75 },
    { url: `${BASE}/app-guide/`, lastModified: now, changeFrequency: "monthly", priority: 0.7 },
    { url: `${BASE}/get-app/`, lastModified: now, changeFrequency: "yearly", priority: 0.6 },
    { url: `${BASE}/contact/`, lastModified: now, changeFrequency: "yearly", priority: 0.6 },
    { url: `${BASE}/accessibility/`, lastModified: now, changeFrequency: "yearly", priority: 0.5 },
    { url: `${BASE}/privacy/`, lastModified: now, changeFrequency: "yearly", priority: 0.3 },
  ];

  // Event slug pages — only currently-upcoming events go in the sitemap.
  // Past events drop off naturally on next regeneration.
  const events = await fetchEvents().catch(() => []);
  const today = new Date();
  today.setUTCHours(0, 0, 0, 0);
  const upcoming = events.filter((ev) => new Date(`${ev.isoDate}T00:00:00Z`) >= today);

  const eventRoutes: MetadataRoute.Sitemap = upcoming.map((ev) => ({
    url: `${BASE}/events/${eventSlug(ev)}/`,
    lastModified: now,
    changeFrequency: "weekly",
    priority: 0.7,
  }));

  // City landing pages — derived from the distinct cities currently hosting
  // upcoming events. Static-render-only (dynamicParams: false) so this
  // sitemap matches the actually-built routes.
  const cities = new Set<string>();
  for (const ev of upcoming) {
    if (ev.city) cities.add(citySlug(ev.city));
  }
  const cityRoutes: MetadataRoute.Sitemap = Array.from(cities).map((c) => ({
    url: `${BASE}/events/in/${c}/`,
    lastModified: now,
    changeFrequency: "daily",
    priority: 0.8,
  }));

  // Venue routes — VENUE_TREE has 109+ entries. Each is a real Place we can
  // surface for "BSL access at [venue]" queries.
  const venueRoutes: MetadataRoute.Sitemap = VENUE_TREE.flatMap((country) =>
    country.cities.flatMap((city) =>
      city.venues
        .filter((v) => v.slug)
        .map((v) => ({
          url: `${BASE}/venues/${v.slug}/`,
          lastModified: now,
          changeFrequency: "monthly" as const,
          priority: 0.6,
        }))
    )
  );

  return [...staticRoutes, ...eventRoutes, ...cityRoutes, ...venueRoutes];
}
