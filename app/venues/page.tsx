import type { Metadata } from "next";
import Link from "next/link";
import PageHero from "@/components/page-hero";
import { VENUE_TREE, totalVenues } from "@/lib/venue-tree";

export const metadata: Metadata = {
  title: "Venues — BSL & ISL access contacts | Performance Interpreting",
  description:
    "Access contacts and BSL relay info for 109+ UK and Ireland venues. Find the right team to talk to about Deaf access at concerts, sports, theatre and festivals.",
};

export default function VenuesIndexPage() {
  const total = totalVenues();
  const flagFor: Record<string, string> = {
    England: "🏴",
    Scotland: "🏴",
    Wales: "🏴",
    "Northern Ireland: ": "",
  };

  return (
    <>
      <PageHero
        title="Venues"
        subtitle={`Access contacts and BSL/ISL relay info for ${total} UK and Ireland venues. Before you buy tickets — contact the venue's access team. Ask for BSL or ISL and ask for seats where you can see the interpreter.`}
        backgroundImage="/images/concert.jpg"
      />

      <section className="section-padding section-gap" aria-labelledby="venues-heading">
        <h2 id="venues-heading" className="sr-only">
          Venues by country and city
        </h2>

        <div className="rounded-2xl border border-pi-warmth/30 bg-pi-warmth/5 p-5 md:p-6">
          <p className="font-display text-lg leading-tight text-pi-ink md:text-xl">
            Can&apos;t find your venue?
          </p>
          <p className="mt-1 text-base text-pi-ink/65">
            Use the request form and the team will contact the venue on your behalf.
          </p>
          <Link
            href="/events/request"
            className="mt-4 inline-flex shrink-0 items-center justify-center gap-2 rounded-full bg-pi-warmth-strong px-6 py-3 text-sm font-bold text-white shadow-lg shadow-pi-warmth/30 transition hover:brightness-110 hover:shadow-pi-warmth/50"
          >
            Request access for an event →
          </Link>
        </div>

        <div className="mt-10 space-y-6">
          {VENUE_TREE.map((c) => {
            const venueCount = c.cities.reduce((sum, ci) => sum + ci.venues.length, 0);
            const flag =
              c.country === "England" ? "🏴󠁧󠁢󠁥󠁮󠁧󠁿"
              : c.country === "Scotland" ? "🏴󠁧󠁢󠁳󠁣󠁴󠁿"
              : c.country === "Wales" ? "🏴󠁧󠁢󠁷󠁬󠁳󠁿"
              : c.country === "Northern Ireland" ? "🇬🇧"
              : c.country === "Ireland" ? "🇮🇪"
              : "";
            return (
              <details
                key={c.country}
                className="group rounded-2xl border border-pi-ink/10 bg-white shadow-sm"
                open={c.country === "England"}
              >
                <summary className="flex cursor-pointer items-center justify-between gap-3 rounded-2xl px-5 py-4 transition hover:bg-pi-canvas/40">
                  <div className="flex items-center gap-3">
                    <span aria-hidden="true" className="text-xl">{flag}</span>
                    <span className="font-display text-xl text-pi-ink">{c.country}</span>
                  </div>
                  <span className="rounded-full bg-pi-ink/5 px-3 py-1 text-xs font-semibold text-pi-ink/70">
                    {c.cities.length} {c.cities.length === 1 ? "city" : "cities"} · {venueCount} {venueCount === 1 ? "venue" : "venues"}
                  </span>
                </summary>

                <div className="border-t border-pi-ink/10 p-5">
                  <ul className="space-y-4">
                    {c.cities.map((ci) => (
                      <li key={ci.name}>
                        <p className="text-sm font-bold uppercase tracking-wider text-pi-accent">
                          {ci.name}{" "}
                          <span className="font-normal text-pi-ink/55">
                            · {ci.venues.length} {ci.venues.length === 1 ? "venue" : "venues"}
                          </span>
                        </p>
                        <ul className="mt-2 grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
                          {ci.venues.map((v) => (
                            <li key={v.slug}>
                              <Link
                                href={`/venues/${v.slug}`}
                                className="block rounded-lg border border-pi-ink/10 bg-pi-canvas/40 px-3 py-2 text-base text-pi-ink transition hover:border-pi-accent/40 hover:bg-pi-accent/5"
                              >
                                {v.display} <span aria-hidden="true" className="text-pi-accent">→</span>
                              </Link>
                            </li>
                          ))}
                        </ul>
                      </li>
                    ))}
                  </ul>
                </div>
              </details>
            );
          })}
        </div>
      </section>
    </>
  );
}
