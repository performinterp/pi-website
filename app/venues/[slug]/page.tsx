import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Mail, Link2, MapPin } from "lucide-react";
import {
  getVenueContact,
  getVenueDetails,
  getVenueFeatures,
  getAccessFeatureDef,
} from "@/lib/venues";
import { getAllVenues, getVenueBySlug } from "@/lib/venue-tree";
import { fetchEvents } from "@/lib/events";
import { eventSlug } from "@/lib/event-slug";

export const revalidate = 1800;

interface Params {
  params: Promise<{ slug: string }>;
}

export function generateStaticParams() {
  return getAllVenues().map((v) => ({ slug: v.slug }));
}

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { slug } = await params;
  const venue = getVenueBySlug(slug);
  if (!venue) return { title: "Venue not found — Performance Interpreting" };
  return {
    title: `${venue.display} — BSL & ISL access | Performance Interpreting`,
    description: `Access contact, BSL relay and accessibility info for ${venue.display}, ${venue.city}. How to request a sign language interpreter for events at this venue.`,
  };
}

export default async function VenueDetailPage({ params }: Params) {
  const { slug } = await params;
  const venue = getVenueBySlug(slug);
  if (!venue) notFound();

  const contact = getVenueContact(venue.key);
  const details = getVenueDetails(venue.key);
  const featureKeys = getVenueFeatures(venue.key);

  const events = await fetchEvents();
  const today = new Date();
  today.setUTCHours(0, 0, 0, 0);
  const upcomingHere = events
    .filter((e) => new Date(`${e.isoDate}T00:00:00Z`) >= today)
    .filter((e) => {
      const v = e.venue.toLowerCase();
      return (
        v === venue.key.toLowerCase() ||
        v === venue.display.toLowerCase() ||
        v.includes(venue.display.toLowerCase())
      );
    })
    .slice(0, 6);

  return (
    <>
      <section className="relative bg-pi-deep px-5 pb-10 pt-28 text-white md:pb-14 md:pt-32">
        {venue.imageUrl && (
          <>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={venue.imageUrl}
              alt=""
              className="absolute inset-0 h-full w-full object-cover opacity-50"
              loading="eager"
            />
            <div
              className="absolute inset-0"
              style={{
                background:
                  "linear-gradient(to top, rgba(6,15,46,0.92) 0%, rgba(6,15,46,0.55) 55%, rgba(6,15,46,0.2) 100%)",
              }}
            />
          </>
        )}
        <div className="relative mx-auto max-w-5xl">
          <Link
            href="/venues/"
            className="inline-flex items-center gap-1 text-xs font-semibold uppercase tracking-wide text-white/80 hover:text-white"
          >
            ← All venues
          </Link>
          <h1 className="mt-4 font-display text-3xl leading-tight md:text-5xl">
            {venue.display}
          </h1>
          <p className="mt-3 text-base text-white/80 md:text-lg">
            {venue.city}, {venue.country}
          </p>
          {contact?.bslGuaranteed && (
            <p className="mt-4 inline-flex items-center gap-2 rounded-full bg-pi-success-strong/20 px-3 py-1.5 text-sm font-semibold text-white">
              ✓ BSL provided at all events here as standard
            </p>
          )}
        </div>
      </section>

      <article className="bg-pi-canvas">
        <div className="section-padding section-gap">
          <div className="mx-auto grid max-w-5xl gap-10 lg:grid-cols-[1.3fr_1fr]">
            <div className="space-y-8">
              <section>
                <h2 className="font-display text-2xl text-pi-ink md:text-3xl">
                  Contact the venue's access team
                </h2>
                <p className="mt-2 text-base text-pi-ink/65">
                  Before you buy tickets, get in touch about BSL or ISL interpretation and ask
                  for seats with a clear sightline to the interpreter.
                </p>

                {(contact?.email || contact?.vrs || contact?.phone) ? (
                  <ul className="mt-5 space-y-3">
                    {contact?.vrs && (
                      <li>
                        <a
                          href={contact.vrs}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center justify-between gap-3 rounded-xl border border-pi-accent/30 bg-pi-accent/5 p-4 transition hover:border-pi-accent hover:bg-pi-accent/10"
                        >
                          <div className="flex items-center gap-3 min-w-0">
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img
                              src="/signvideo-logo.png"
                              alt=""
                              width={36}
                              height={36}
                              className="shrink-0 rounded-lg"
                            />
                            <div>
                              <p className="text-xs font-bold uppercase tracking-wider text-pi-accent">
                                {contact.vrsLabel ?? "SignVideo BSL relay"}
                              </p>
                              <p className="mt-0.5 text-base font-semibold text-pi-ink">
                                Call the access team in BSL
                              </p>
                            </div>
                          </div>
                          <span className="text-pi-accent">→</span>
                        </a>
                      </li>
                    )}
                    {contact?.email && (
                      <li>
                        <a
                          href={`mailto:${contact.email}`}
                          className="flex items-center justify-between gap-3 rounded-xl border border-pi-ink/15 bg-white p-4 transition hover:border-pi-accent/50"
                        >
                          <div className="flex items-center gap-3 min-w-0">
                            <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-pi-warmth-strong/15 text-pi-warmth-strong">
                              <Mail className="h-5 w-5" aria-hidden="true" />
                            </span>
                            <div className="min-w-0">
                              <p className="text-xs font-bold uppercase tracking-wider text-pi-warmth-strong">
                                Access team email
                              </p>
                              <p className="mt-0.5 break-all text-base font-semibold text-pi-ink">
                                {contact.email}
                              </p>
                            </div>
                          </div>
                          <span className="text-pi-accent">→</span>
                        </a>
                      </li>
                    )}
                    {contact?.phone && (
                      <li>
                        <a
                          href={`tel:${contact.phone}`}
                          className="flex items-center justify-between gap-3 rounded-xl border border-pi-ink/15 bg-white p-4 transition hover:border-pi-accent/50"
                        >
                          <div>
                            <p className="text-xs font-bold uppercase tracking-wider text-pi-ink/55">
                              Phone
                            </p>
                            <p className="mt-0.5 text-base font-semibold text-pi-ink">
                              {contact.phone}
                            </p>
                          </div>
                          <span className="text-pi-accent">→</span>
                        </a>
                      </li>
                    )}
                    {contact?.url && (
                      <li>
                        <a
                          href={contact.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center justify-between gap-3 rounded-xl border border-pi-ink/15 bg-white p-4 transition hover:border-pi-accent/50"
                        >
                          <div className="flex items-center gap-3 min-w-0">
                            <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-pi-ink/5 text-pi-ink/70">
                              <Link2 className="h-5 w-5" aria-hidden="true" />
                            </span>
                            <div>
                              <p className="text-xs font-bold uppercase tracking-wider text-pi-ink/55">
                                Venue access page
                              </p>
                              <p className="mt-0.5 text-base font-semibold text-pi-ink">
                                Open
                              </p>
                            </div>
                          </div>
                          <span className="text-pi-accent">→</span>
                        </a>
                      </li>
                    )}
                  </ul>
                ) : (
                  <div className="mt-5 rounded-xl border border-pi-ink/10 bg-pi-canvas-soft p-5">
                    <p className="text-base text-pi-ink/70">
                      We don&apos;t have an access contact on file for this venue yet.
                    </p>
                    <Link
                      href="/events/request"
                      className="mt-4 inline-flex items-center gap-2 rounded-full bg-pi-warmth-strong px-5 py-2.5 text-sm font-bold text-white shadow-md shadow-pi-warmth/30 transition hover:brightness-110"
                    >
                      Request access via PI →
                    </Link>
                  </div>
                )}

                {contact?.note && (
                  <p className="mt-5 rounded-lg bg-pi-canvas-soft p-3 text-sm leading-relaxed text-pi-ink/70">
                    {contact.note}
                  </p>
                )}
              </section>

              {featureKeys.length > 0 && (
                <section>
                  <h2 className="font-display text-2xl text-pi-ink md:text-3xl">
                    Accessible facilities
                  </h2>
                  <p className="mt-2 text-base text-pi-ink/70">
                    Reported by the venue. Always confirm with their access team for your
                    specific needs.
                  </p>
                  <ul className="mt-5 grid gap-3 sm:grid-cols-2">
                    {featureKeys.map((key) => {
                      const def = getAccessFeatureDef(key);
                      if (!def) return null;
                      return (
                        <li
                          key={key}
                          className="flex items-start gap-3 rounded-xl border border-pi-ink/10 bg-white p-3.5"
                        >
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img
                            src={`/access-icons/${def.icon.replace(/^icons\//, "")}`}
                            alt=""
                            width={28}
                            height={28}
                            className="shrink-0"
                          />
                          <div className="min-w-0">
                            <p className="text-base font-semibold text-pi-ink">{def.label}</p>
                            <p className="text-sm leading-snug text-pi-ink/70">{def.desc}</p>
                          </div>
                        </li>
                      );
                    })}
                  </ul>
                </section>
              )}

              {upcomingHere.length > 0 && (
                <section>
                  <h2 className="font-display text-2xl text-pi-ink md:text-3xl">
                    Upcoming interpreted events at {venue.display}
                  </h2>
                  <ul className="mt-5 space-y-3">
                    {upcomingHere.map((e) => (
                      <li key={eventSlug(e)}>
                        <Link
                          href={`/events/${eventSlug(e)}`}
                          className="flex items-center justify-between gap-3 rounded-xl border border-pi-ink/10 bg-white p-4 transition hover:border-pi-accent/40"
                        >
                          <div className="min-w-0">
                            <p className="text-base font-semibold text-pi-ink">{e.name}</p>
                            <p className="mt-0.5 text-sm text-pi-ink/70">
                              {new Date(`${e.isoDate}T00:00:00Z`).toLocaleDateString("en-GB", {
                                timeZone: "UTC",
                                weekday: "short",
                                day: "numeric",
                                month: "long",
                                year: "numeric",
                              })}
                              {" · "}
                              {e.interpreterStatus === "booked" ? "Interpreter booked" : "On request"}
                            </p>
                          </div>
                          <span aria-hidden="true" className="text-pi-accent">→</span>
                        </Link>
                      </li>
                    ))}
                  </ul>
                </section>
              )}
            </div>

            <aside className="space-y-6">
              {(details?.address || details?.postcode || details?.mapsUrl) && (
                <div className="rounded-2xl border border-pi-ink/10 bg-white p-5">
                  <p className="text-xs font-bold uppercase tracking-wider text-pi-accent">
                    Venue address
                  </p>
                  <address className="mt-2 not-italic text-base leading-relaxed text-pi-ink/80">
                    {details?.address && (<>{details.address}<br /></>)}
                    {details?.address2 && (<>{details.address2}<br /></>)}
                    {(details?.city || venue.city) && <>{details?.city || venue.city}<br /></>}
                    {details?.postcode && <>{details.postcode}</>}
                  </address>
                  {details?.mapsUrl && (
                    <a
                      href={details.mapsUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mt-4 inline-flex items-center gap-2 text-base font-semibold text-pi-accent hover:text-pi-ink"
                    >
                      <MapPin className="h-4 w-4" aria-hidden="true" />
                      Open in Google Maps →
                    </a>
                  )}
                </div>
              )}

              <div className="rounded-2xl border border-pi-warmth/30 bg-pi-warmth/5 p-5">
                <p className="font-display text-lg leading-tight text-pi-ink">
                  Need an interpreter at this venue?
                </p>
                <p className="mt-2 text-base text-pi-ink/70">
                  If a specific event isn&apos;t already covered, PI can contact the venue on your behalf.
                </p>
                <Link
                  href={`/events/request?venue=${encodeURIComponent(venue.display)}`}
                  className="mt-4 inline-flex items-center gap-2 rounded-full bg-pi-warmth-strong px-5 py-2.5 text-sm font-bold text-white shadow-md shadow-pi-warmth/30 transition hover:brightness-110"
                >
                  Request an interpreter →
                </Link>
              </div>
            </aside>
          </div>
        </div>
      </article>
    </>
  );
}
