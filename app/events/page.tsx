import type { Metadata } from "next";
import PageHero from "@/components/page-hero";
import ContactCta from "@/components/contact-cta";
import EventsFilter from "./_components/events-filter";
import { fetchEvents, uniqueValues } from "@/lib/events";

export const metadata: Metadata = {
  title: "Find Interpreted Events - Performance Interpreting",
  description:
    "Browse confirmed BSL and ISL interpreted events across the UK and Ireland. Concerts, festivals, theatre, sport, comedy and more - filter by date, city, category or interpretation language.",
};

export const revalidate = 1800;

export default async function EventsPage() {
  const events = await fetchEvents();

  const today = new Date();
  today.setUTCHours(0, 0, 0, 0);
  const upcoming = events.filter((ev) => new Date(`${ev.isoDate}T00:00:00Z`) >= today);

  const cities = uniqueValues(upcoming, "city");
  const categories = uniqueValues(upcoming, "category");

  return (
    <>
      <PageHero
        title="Find interpreted events"
        subtitle="Confirmed BSL and ISL interpreted events across the UK and Ireland. Filter by date, city, category or language."
        backgroundImage="/images/concert.jpg"
      />

      <section className="section-padding section-gap" aria-labelledby="events-heading">
        <h2 id="events-heading" className="sr-only">
          Upcoming interpreted events
        </h2>
        <p className="mb-3 text-right text-xs text-pi-ink/65">
          {upcoming.length} upcoming{" "}
          {upcoming.length === 1 ? "event" : "events"} - updated every 30 minutes
        </p>

        <EventsFilter events={upcoming} cities={cities} categories={categories} />
      </section>

      <ContactCta />
    </>
  );
}
