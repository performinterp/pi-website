import type { Metadata } from "next";
import Link from "next/link";
import PageHero from "@/components/page-hero";
import { VENUE_TREE, getAllVenues, totalVenues } from "@/lib/venue-tree";
import VenuesSearch from "./_components/venues-search";

export const metadata: Metadata = {
  title: "Venues — BSL & ISL access contacts | Performance Interpreting",
  description:
    "Access contacts and BSL relay info for 109+ UK and Ireland venues. Find the right team to talk to about Deaf access at concerts, sports, theatre and festivals.",
};

const FLAG: Record<string, string> = {
  England: "🏴󠁧󠁢󠁥󠁮󠁧󠁿",
  Scotland: "🏴󠁧󠁢󠁳󠁣󠁴󠁿",
  Wales: "🏴󠁧󠁢󠁷󠁬󠁳󠁿",
  "Northern Ireland": "🇬🇧",
  Ireland: "🇮🇪",
};

export default function VenuesIndexPage() {
  const total = totalVenues();

  // Build a flat list for the search component with city + country attached.
  const searchVenues = VENUE_TREE.flatMap((c) =>
    c.cities.flatMap((ci) =>
      ci.venues.map((v) => ({
        display: v.display,
        city: ci.name,
        country: c.country,
        slug: v.slug,
      }))
    )
  );

  return (
    <>
      <PageHero
        title="Venues"
        subtitle={`Access contacts for ${total} UK and Ireland venues. Search by name, or browse by country and city.`}
        backgroundImage="/images/concert.jpg"
      />

      <section className="section-padding section-gap" aria-labelledby="venues-heading">
        <h2 id="venues-heading" className="sr-only">
          Find a venue
        </h2>

        {/* Search — primary path. Tap a suggestion to jump straight to the venue page. */}
        <VenuesSearch venues={searchVenues} />

        <p className="mt-3 text-sm text-pi-ink/65">
          Or browse by country below. Tap a country to see its cities, then tap a city to see venues.
        </p>

        {/* Two-level accordion: countries collapsed by default, cities collapsed inside. */}
        <div className="mt-8 space-y-3">
          {VENUE_TREE.map((c) => {
            const venueCount = c.cities.reduce((sum, ci) => sum + ci.venues.length, 0);
            return (
              <details
                key={c.country}
                className="group rounded-2xl border border-pi-ink/10 bg-white shadow-sm"
              >
                <summary className="flex cursor-pointer list-none items-center justify-between gap-3 rounded-2xl px-5 py-4 transition hover:bg-pi-canvas/40">
                  <div className="flex items-center gap-3">
                    <span aria-hidden="true" className="text-xl">{FLAG[c.country] ?? ""}</span>
                    <span className="font-display text-xl text-pi-ink">{c.country}</span>
                  </div>
                  <span className="flex items-center gap-3">
                    <span className="rounded-full bg-pi-ink/5 px-3 py-1 text-xs font-semibold text-pi-ink/70">
                      {venueCount} {venueCount === 1 ? "venue" : "venues"}
                    </span>
                    <span aria-hidden="true" className="text-pi-accent transition group-open:rotate-180">▾</span>
                  </span>
                </summary>

                <div className="border-t border-pi-ink/10 p-3 sm:p-4">
                  <ul className="space-y-1.5">
                    {c.cities.map((ci) => (
                      <li key={ci.name}>
                        <details className="group/city rounded-xl bg-pi-canvas/30">
                          <summary className="flex cursor-pointer list-none items-center justify-between gap-3 rounded-xl px-4 py-3 transition hover:bg-pi-accent/5">
                            <span className="text-base font-semibold text-pi-ink">{ci.name}</span>
                            <span className="flex items-center gap-2.5">
                              <span className="text-xs font-semibold text-pi-ink/55">
                                {ci.venues.length} {ci.venues.length === 1 ? "venue" : "venues"}
                              </span>
                              <span aria-hidden="true" className="text-pi-accent/70 transition group-open/city:rotate-180">▾</span>
                            </span>
                          </summary>
                          <ul className="grid gap-2 px-3 pb-3 pt-1 sm:grid-cols-2">
                            {ci.venues.map((v) => (
                              <li key={v.slug}>
                                <Link
                                  href={`/venues/${v.slug}/`}
                                  className="block rounded-lg border border-pi-ink/10 bg-white px-3 py-2.5 text-base text-pi-ink transition hover:border-pi-accent/40 hover:bg-pi-accent/5"
                                >
                                  {v.display} <span aria-hidden="true" className="text-pi-accent">→</span>
                                </Link>
                              </li>
                            ))}
                          </ul>
                        </details>
                      </li>
                    ))}
                  </ul>
                </div>
              </details>
            );
          })}
        </div>

        {/* Below the directory — the genuine help paths if the user can't find their venue. */}
        <div className="mt-12 rounded-2xl border border-pi-ink/10 bg-pi-canvas-soft p-5 md:p-6">
          <p className="font-display text-xl leading-tight text-pi-ink">
            Can&apos;t find your venue?
          </p>
          <p className="mt-2 text-base text-pi-ink/70">
            We list venues we work with regularly. If yours isn&apos;t here, here&apos;s what you can do:
          </p>
          <ul className="mt-4 space-y-3">
            <li className="rounded-xl border border-pi-ink/10 bg-white p-4">
              <p className="text-base font-semibold text-pi-ink">
                You have an event in mind and want BSL or ISL at it
              </p>
              <p className="mt-1 text-sm text-pi-ink/70">
                Send us the event details and we&apos;ll contact the venue on your behalf.
              </p>
              <Link
                href="/events/request"
                className="mt-3 inline-flex items-center gap-2 rounded-full bg-pi-warmth-strong px-5 py-2.5 text-sm font-bold text-white shadow-md shadow-pi-warmth/30 transition hover:brightness-110"
              >
                Request access for an event →
              </Link>
            </li>
            <li className="rounded-xl border border-pi-ink/10 bg-white p-4">
              <p className="text-base font-semibold text-pi-ink">
                You want to know if a venue is accessible
              </p>
              <p className="mt-1 text-sm text-pi-ink/70">
                Ask PIPA — our assistant can look up venue contacts and access info.
              </p>
              <p className="mt-3 text-sm text-pi-ink/55">
                Tap the chat button at the bottom-right of the page.
              </p>
            </li>
            <li className="rounded-xl border border-pi-ink/10 bg-white p-4">
              <p className="text-base font-semibold text-pi-ink">
                You want to ask the team something else
              </p>
              <p className="mt-1 text-sm text-pi-ink/70">
                Get in touch directly.
              </p>
              <Link
                href="/contact"
                className="mt-3 inline-flex items-center gap-2 rounded-full border border-pi-accent/40 bg-white px-5 py-2.5 text-sm font-bold text-pi-accent transition hover:bg-pi-accent hover:text-white"
              >
                Contact PI →
              </Link>
            </li>
          </ul>
        </div>
      </section>
    </>
  );
}
