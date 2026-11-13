// Easy Read summaries built from data: one event, one venue, one city.
// Static pages use content/easy-read.json instead. Pure functions, type-only
// imports, so Node can run the tests (scripts/easy-read-auto.test.mjs).
import type { Event, EasyReadPage, EasyReadPoint } from "./types";

const BSL_ICON = "/icons/easy-read/bsl-interpreter.png";
const ISL_ICON = "/icons/easy-read/isl-interpreter-white.png";

function longDate(isoDate: string): string {
  return new Date(`${isoDate}T00:00:00Z`)
    .toLocaleDateString("en-GB", {
      timeZone: "UTC",
      weekday: "long",
      day: "numeric",
      month: "long",
      year: "numeric",
    })
    .replace(",", "");
}

// "18:30" -> "6:30pm", "19:00" -> "7pm". Anything else (already "7:30pm",
// "Doors 6pm") is left as written.
function friendlyTime(time: string): string {
  const m = /^(\d{1,2}):(\d{2})$/.exec(time);
  if (!m) return time;
  const h = Number(m[1]);
  if (h > 23) return time;
  const suffix = h < 12 ? "am" : "pm";
  const h12 = h % 12 || 12;
  return m[2] === "00" ? `${h12}${suffix}` : `${h12}:${m[2]}${suffix}`;
}

function interpreterPoint(language: Event["language"]): EasyReadPoint {
  if (language === "ISL") return { icon: ISL_ICON, text: "An ISL interpreter is booked." };
  if (language === "BSL_AND_ISL") return { icon: BSL_ICON, text: "BSL and ISL interpreters are booked." };
  return { icon: BSL_ICON, text: "A BSL interpreter is booked." };
}

export function eventEasyRead(
  ev: Pick<
    Event,
    "name" | "isoDate" | "time" | "venue" | "city" | "language" | "interpreterStatus" | "soldOut" | "eventUrl"
  >,
): EasyReadPage {
  const where = ev.city && !ev.venue.includes(ev.city) ? `${ev.venue} in ${ev.city}` : ev.venue;
  const points: EasyReadPoint[] = [
    { icon: "📍", text: `${ev.name} is at ${where}.` },
    { icon: "📅", text: `It is on ${longDate(ev.isoDate)}.` },
  ];
  const time = ev.time.trim();
  if (time && !/tbc/i.test(time)) points.push({ icon: "🕖", text: `It starts at ${friendlyTime(time)}.` });
  const booked = ev.interpreterStatus === "booked";
  points.push(
    booked
      ? interpreterPoint(ev.language)
      : { icon: "❓", text: "No interpreter is booked yet. You can ask for one." },
  );
  if (ev.soldOut) points.push({ icon: "⚠️", text: "Tickets are sold out." });

  const requestHref = `/events/request?event=${encodeURIComponent(ev.name)}&venue=${encodeURIComponent(ev.venue)}&date=${encodeURIComponent(ev.isoDate)}`;
  const actions = booked
    ? ev.eventUrl.startsWith("https://")
      ? [{ label: "Book tickets", href: ev.eventUrl }]
      : []
    : [{ label: "Ask for an interpreter", href: requestHref }];
  return { title: ev.name, points, actions };
}

export function cityEasyRead(city: string, count: number): EasyReadPage {
  const text =
    count === 1
      ? "There is 1 event with BSL or ISL here."
      : `There are ${count} events with BSL or ISL here.`;
  return {
    title: `Events in ${city}`,
    points: [
      { icon: "📍", text },
      { icon: "👇", text: "The list is below. Pick an event to see more." },
    ],
  };
}

export function venueEasyRead(v: {
  name: string;
  city: string;
  email?: string;
  phone?: string;
  /** SignVideo (BSL video relay) link — the most direct route for a BSL user. */
  vrs?: string;
}): EasyReadPage {
  const points: EasyReadPoint[] = [
    { icon: "📍", text: `${v.name} is in ${v.city}.` },
  ];
  if (v.vrs) points.push({ icon: "📹", text: "You can call their access team in BSL. Use SignVideo." });
  else if (v.email || v.phone) points.push({ icon: "✉️", text: "You can contact their access team." });
  points.push({ icon: "❓", text: "You can ask us for an interpreter here." });

  const actions = [];
  if (v.vrs) actions.push({ label: "Call in BSL", href: v.vrs });
  else if (v.email) actions.push({ label: "Email their access team", href: `mailto:${v.email}` });
  else if (v.phone) actions.push({ label: "Call their access team", href: `tel:${v.phone}` });
  actions.push({
    label: "Ask for an interpreter",
    href: `/events/request?venue=${encodeURIComponent(v.name)}`,
  });
  return { title: v.name, points, actions };
}
