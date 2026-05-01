import type { Event } from "./types";

function kebab(input: string): string {
  return input
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/&/g, " and ")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80);
}

export function eventSlug(event: Pick<Event, "name" | "isoDate" | "venue">): string {
  const parts = [kebab(event.name), event.isoDate, kebab(event.venue)].filter(Boolean);
  return parts.join("-");
}

export function findEventBySlug(events: Event[], slug: string): Event | undefined {
  return events.find((ev) => eventSlug(ev) === slug);
}
