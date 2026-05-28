import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import PageHero from "@/components/page-hero";
import ContactCta from "@/components/contact-cta";
import { fetchEvents } from "@/lib/events";
import { eventSlug } from "@/lib/event-slug";
import type { Event } from "@/lib/types";

const SITE = "https://performanceinterpreting.co.uk";

// City landing pages mirror Auslan Stage Left's state-by-state pattern but
// tighter. Same event data as /events/, just scoped to one city for
// geographic-intent search ("BSL interpreted concerts Manchester" etc.).
// Individual event detail pages stay at /events/[slug]/ and are NOT
// rewritten — these are aggregation surfaces only.

function citySlug(name: string): string {
  return name
    .toLowerCase()
    .replace(/&/g, "and")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function cityDisplay(slug: string, eventsForCity: Event[]): string {
  // Prefer the casing from the actual data (the spreadsheet may have
  // "London" while the slug is "london") so the page reads naturally.
  return eventsForCity[0]?.city ?? slug
    .split("-")
    .map((p) => p.charAt(0).toUpperCase() + p.slice(1))
    .join(" ");
}

// Refresh every 30 min — matches the main /events/ page.
export const revalidate = 1800;
export const dynamicParams = false;

export async function generateStaticParams() {
  const events = await fetchEvents();
  const today = new Date();
  today.setUTCHours(0, 0, 0, 0);
  const upcoming = events.filter((ev) => new Date(`${ev.isoDate}T00:00:00Z`) >= today);
  const cities = new Set<string>();
  for (const ev of upcoming) {
    if (ev.city) cities.add(citySlug(ev.city));
  }
  return Array.from(cities).map((city) => ({ city }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ city: string }>;
}): Promise<Metadata> {
  const { city } = await params;
  const events = await fetchEvents();
  const today = new Date();
  today.setUTCHours(0, 0, 0, 0);
  const cityEvents = events.filter(
    (ev) =>
      citySlug(ev.city) === city &&
      new Date(`${ev.isoDate}T00:00:00Z`) >= today
  );
  if (cityEvents.length === 0) return { title: "City not found" };
  const display = cityDisplay(city, cityEvents);
  const count = cityEvents.length;
  return {
    title: `BSL & ISL Interpreted Events in ${display} - Performance Interpreting`,
    description: `${count} BSL or ISL interpreted event${count === 1 ? "" : "s"} coming up in ${display}. Concerts, festivals, theatre, sport, comedy and more — booked through Performance Interpreting.`,
    alternates: { canonical: `${SITE}/events/in/${city}/` },
    openGraph: {
      title: `BSL & ISL Interpreted Events in ${display} | Performance Interpreting`,
      description: `${count} upcoming BSL/ISL interpreted events in ${display}.`,
      url: `${SITE}/events/in/${city}/`,
      type: "website",
      images: ["/og-image.jpg"],
    },
  };
}

const DATE_FMT = new Intl.DateTimeFormat("en-GB", {
  weekday: "short",
  day: "numeric",
  month: "short",
  year: "numeric",
});

export default async function CityEventsPage({
  params,
}: {
  params: Promise<{ city: string }>;
}) {
  const { city } = await params;
  const events = await fetchEvents();
  const today = new Date();
  today.setUTCHours(0, 0, 0, 0);
  const cityEvents = events
    .filter(
      (ev) =>
        citySlug(ev.city) === city &&
        new Date(`${ev.isoDate}T00:00:00Z`) >= today
    )
    .sort((a, b) => a.isoDate.localeCompare(b.isoDate));

  if (cityEvents.length === 0) notFound();

  const display = cityDisplay(city, cityEvents);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "BreadcrumbList",
            itemListElement: [
              { "@type": "ListItem", position: 1, name: "Home", item: `${SITE}/` },
              { "@type": "ListItem", position: 2, name: "Events", item: `${SITE}/events/` },
              { "@type": "ListItem", position: 3, name: display, item: `${SITE}/events/in/${city}/` },
            ],
          }),
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "ItemList",
            name: `BSL & ISL interpreted events in ${display}`,
            description: `Upcoming Deaf-accessible live events in ${display}.`,
            numberOfItems: cityEvents.length,
            itemListElement: cityEvents.slice(0, 50).map((ev, i) => ({
              "@type": "ListItem",
              position: i + 1,
              item: {
                "@type": "Event",
                name: ev.name,
                startDate: ev.isoDate,
                location: { "@type": "Place", name: ev.venue, address: { "@type": "PostalAddress", addressLocality: ev.city, addressCountry: "GB" } },
                ...(ev.eventUrl ? { url: ev.eventUrl } : {}),
              },
            })),
          }),
        }}
      />

      <PageHero
        title={`BSL & ISL events in ${display}`}
        subtitle={`${cityEvents.length} upcoming Deaf-accessible live event${cityEvents.length === 1 ? "" : "s"} in ${display}.`}
        backgroundImage="/images/concert.jpg"
      />

      <section className="section-padding section-gap">
        <div className="mx-auto max-w-4xl">
          <div className="mb-8 flex flex-wrap items-center justify-between gap-3">
            <p className="text-sm text-pi-ink/65">
              {cityEvents.length} event{cityEvents.length === 1 ? "" : "s"} ·{" "}
              <Link href="/events/" className="text-pi-accent hover:underline">
                see all UK and Ireland events →
              </Link>
            </p>
          </div>

          <ul className="space-y-3">
            {cityEvents.map((ev) => {
              const slug = eventSlug(ev);
              const date = new Date(`${ev.isoDate}T00:00:00Z`);
              return (
                <li key={slug}>
                  <Link
                    href={`/events/${slug}/`}
                    className="group grid grid-cols-[auto_1fr_auto] items-center gap-4 rounded-2xl border border-pi-ink/10 bg-white p-4 transition-all hover:border-pi-accent/30 hover:shadow-md sm:p-5"
                  >
                    <div className="text-sm">
                      <p className="font-semibold text-pi-ink">{DATE_FMT.format(date)}</p>
                      {ev.time && <p className="mt-0.5 text-xs text-pi-ink/55">{ev.time}</p>}
                    </div>
                    <div className="min-w-0">
                      <p className="font-display font-bold text-pi-ink leading-snug group-hover:text-pi-accent transition-colors">
                        {ev.name}
                      </p>
                      <p className="mt-1 text-xs text-pi-ink/55">
                        {ev.venue}
                        {ev.category && <> · {ev.category}</>}
                        {ev.language && <> · {ev.language === "BSL_AND_ISL" ? "BSL + ISL" : ev.language}</>}
                      </p>
                    </div>
                    <span aria-hidden className="text-pi-ink/35 group-hover:text-pi-accent transition-colors">→</span>
                  </Link>
                </li>
              );
            })}
          </ul>

          <div className="mt-10 rounded-2xl border border-pi-accent/20 bg-pi-accent/5 p-6 text-sm text-pi-ink/75 leading-relaxed">
            <p className="font-display text-base font-bold text-pi-ink mb-2">
              Can&apos;t see your event in {display}?
            </p>
            <p>
              We&apos;ll talk to the venue or promoter about adding BSL or ISL access. <Link href="/contact" className="text-pi-accent underline underline-offset-4 hover:no-underline">Request interpretation</Link>.
            </p>
          </div>
        </div>
      </section>

      <ContactCta />
    </>
  );
}
