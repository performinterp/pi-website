import type { Metadata } from "next";
import Link from "next/link";
import { Link2, Sparkles } from "lucide-react";
import { notFound } from "next/navigation";
import { fetchEvents } from "@/lib/events";
import { eventSlug, findEventBySlug } from "@/lib/event-slug";
import {
  getVenueContact,
  getVenueDetails,
  getVenueFeatures,
  getAccessFeatureDef,
} from "@/lib/venues";
export const revalidate = 1800;

interface Params {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  const events = await fetchEvents();
  return events.map((ev) => ({ slug: eventSlug(ev) }));
}

function formatLongDate(isoDate: string): string {
  const date = new Date(`${isoDate}T00:00:00Z`);
  return date.toLocaleDateString("en-GB", {
    timeZone: "UTC",
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { slug } = await params;
  const events = await fetchEvents();
  const event = findEventBySlug(events, slug);
  if (!event) return { title: "Event not found - Performance Interpreting" };

  const langLabel =
    event.language === "BSL_AND_ISL"
      ? "BSL & ISL"
      : event.language === "OTHER"
        ? event.interpretation || "interpreted"
        : event.language;

  const statusWord = event.interpreterStatus === "booked" ? "interpreted" : "available on request";
  const title = `${event.name} - ${langLabel} ${statusWord} at ${event.venue}`;
  const description = `${event.name} on ${formatLongDate(event.isoDate)} at ${event.venue}${event.city ? `, ${event.city}` : ""}. ${langLabel} ${statusWord}.`;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      images: event.imageUrl ? [event.imageUrl] : undefined,
    },
  };
}

export default async function EventDetailPage({ params }: Params) {
  const { slug } = await params;
  const events = await fetchEvents();
  const event = findEventBySlug(events, slug);
  if (!event) notFound();

  const langLabel =
    event.language === "BSL_AND_ISL"
      ? "BSL & ISL"
      : event.language === "OTHER"
        ? event.interpretation || "Interpreted"
        : event.language;

  const isBooked = event.interpreterStatus === "booked";
  const statusBadgeClass = isBooked ? "bg-pi-success-strong" : "bg-pi-warmth-strong";
  const statusBadgeLabel = isBooked
    ? `${langLabel} Interpreter Booked`
    : `${langLabel} Available on Request`;

  const venueContact = getVenueContact(event.venue);
  const venueDetails = getVenueDetails(event.venue);
  const features = getVenueFeatures(event.venue, event.name);

  const eventSchema = {
    "@context": "https://schema.org",
    "@type": "Event",
    name: event.name,
    startDate: event.isoDate,
    eventStatus: "https://schema.org/EventScheduled",
    eventAttendanceMode: "https://schema.org/OfflineEventAttendanceMode",
    location: {
      "@type": "Place",
      name: event.venue,
      address:
        venueDetails?.address || event.city
          ? {
              "@type": "PostalAddress",
              streetAddress: venueDetails?.address,
              addressLocality: venueDetails?.city ?? event.city,
              postalCode: venueDetails?.postcode,
              addressCountry: "GB",
            }
          : undefined,
    },
    description:
      event.description ||
      `${event.name} at ${event.venue}${event.city ? `, ${event.city}` : ""} with ${langLabel} interpretation provided by Performance Interpreting.`,
    image: event.imageUrl || undefined,
    url: event.eventUrl || undefined,
    organizer: {
      "@type": "Organization",
      name: "Performance Interpreting",
      url: "https://performanceinterpreting.co.uk",
    },
    inLanguage: event.language === "ISL" ? "Irish Sign Language" : "British Sign Language",
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(eventSchema) }}
      />

      <article className="bg-pi-canvas">
        {/* Mobile hero — image banner (no text overlay) THEN dark
            metadata block below. Posters often have their own dense
            text/branding which fights with overlay text on small
            screens. Desktop keeps the cinematic overlay (md+ has the
            horizontal room). */}
        <div className="md:hidden">
          {event.imageUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={event.imageUrl}
              alt=""
              className="h-56 w-full object-cover"
            />
          ) : null}
          <div className="bg-pi-deep px-5 pt-6 pb-7 text-white">
            <Link
              href="/events/"
              className="inline-flex items-center gap-1 text-xs font-semibold uppercase tracking-wide text-white/80 hover:text-white"
            >
              ← All events
            </Link>
            <div className="mt-4 flex flex-wrap gap-2">
              <span className={`rounded-full ${statusBadgeClass} px-3 py-1 text-[11px] font-bold uppercase tracking-wider text-white shadow-sm`}>
                {statusBadgeLabel}
              </span>
              {event.category && (
                <span className="rounded-full bg-white/15 px-3 py-1 text-[11px] font-bold uppercase tracking-wider text-white">
                  {event.category}
                </span>
              )}
              {event.soldOut && (
                <span className="rounded-full bg-pi-error px-3 py-1 text-[11px] font-bold uppercase tracking-wider text-white">
                  Sold out
                </span>
              )}
            </div>
            <h1 className="mt-4 font-display text-3xl leading-tight text-white">
              {event.name}
            </h1>
            <p className="mt-3 text-base text-white/90">
              {formatLongDate(event.isoDate)}
              {event.time ? ` · ${event.time}` : ""}
            </p>
            <p className="mt-1 text-base text-white/80">
              {event.venue}
              {event.city && !event.venue.includes(event.city) ? `, ${event.city}` : ""}
            </p>
          </div>
        </div>

        {/* Desktop hero — cinematic overlay treatment (more room to breathe). */}
        <div className="relative hidden h-[55vh] min-h-[420px] w-full overflow-hidden bg-pi-navy md:block">
          {event.imageUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={event.imageUrl}
              alt=""
              className="h-full w-full object-cover"
            />
          ) : (
            <div className="h-full w-full bg-gradient-to-br from-pi-deep to-pi-navy" />
          )}
          <div
            className="absolute inset-0"
            style={{
              background:
                "linear-gradient(to top, rgba(2,1,66,0.95) 0%, rgba(2,1,66,0.6) 40%, rgba(2,1,66,0.2) 75%, transparent 100%)",
            }}
          />
          <div className="section-padding absolute inset-0 z-10 flex flex-col justify-end pb-14">
            <div className="max-w-3xl">
              <p className="mb-3 inline-flex items-center gap-2">
                <Link
                  href="/events/"
                  className="text-xs font-semibold uppercase tracking-wide text-white/80 hover:text-white"
                >
                  ← All events
                </Link>
              </p>
              <div className="mb-4 flex flex-wrap gap-2">
                <span
                  className={`rounded-full ${statusBadgeClass} px-3 py-1 text-[11px] font-bold uppercase tracking-wider text-white shadow-sm`}
                >
                  {statusBadgeLabel}
                </span>
                {event.category && (
                  <span className="rounded-full bg-white/15 px-3 py-1 text-[11px] font-bold uppercase tracking-wider text-white backdrop-blur-sm">
                    {event.category}
                  </span>
                )}
                {event.soldOut && (
                  <span className="rounded-full bg-pi-error px-3 py-1 text-[11px] font-bold uppercase tracking-wider text-white">
                    Sold out
                  </span>
                )}
              </div>
              <h1
                className="font-display text-5xl leading-tight text-white"
                style={{ textShadow: "0 1px 4px rgba(2,1,66,0.4)" }}
              >
                {event.name}
              </h1>
              <p
                className="mt-3 text-lg text-white/90"
                style={{ textShadow: "0 1px 3px rgba(2,1,66,0.3)" }}
              >
                {formatLongDate(event.isoDate)}
                {event.time ? ` · ${event.time}` : ""}
              </p>
              <p
                className="mt-1 text-lg text-white/80"
                style={{ textShadow: "0 1px 3px rgba(2,1,66,0.3)" }}
              >
                {event.venue}
                {event.city && !event.venue.includes(event.city) ? `, ${event.city}` : ""}
              </p>
            </div>
          </div>
        </div>

        {/*
          Booking panel is rendered at TWO positions so the visual order is
          consistent across breakpoints:
            mobile : Hero → About → Interpretation → [Booking] → Venue → Facilities
            desktop: same in main col, plus a sticky copy in the right column
          Each render is gated by responsive utility classes; the inactive
          copy is display:none, so the user only ever sees one.
        */}
        {(() => {
          const bookingPanel = venueContact || event.eventUrl ? (
            <div className="rounded-2xl border border-pi-ink/10 bg-white p-6 shadow-sm md:p-7">
              <h2 className="font-display text-xl text-pi-ink">
                {isBooked ? "Book access tickets" : "Contact the venue"}
              </h2>
              <p className="mt-2 text-base text-pi-ink/65">
                {isBooked
                  ? "Quickest route to your access ticket:"
                  : "Use these to ask the venue for an interpreter:"}
              </p>
              <ul className="mt-4 space-y-3">
                {venueContact?.vrs && (
                  <li>
                    <a
                      href={venueContact.vrs}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-between gap-3 rounded-xl border border-pi-accent/30 bg-pi-accent/5 p-3.5 transition hover:border-pi-accent hover:bg-pi-accent/10"
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src="/signvideo-logo.png"
                          alt=""
                          width={32}
                          height={32}
                          className="shrink-0 rounded-lg object-cover"
                        />
                        <div className="min-w-0">
                          <p className="text-xs font-bold uppercase tracking-wider text-pi-accent">
                            {venueContact.vrsLabel ?? "SignVideo"}
                          </p>
                          <p className="mt-0.5 text-base font-semibold text-pi-ink">
                            Call the access team
                          </p>
                        </div>
                      </div>
                      <span className="text-pi-accent">→</span>
                    </a>
                  </li>
                )}
                {venueContact?.email && (
                  <li>
                    <Link
                      href={`/events/request?event=${encodeURIComponent(event.name)}&venue=${encodeURIComponent(event.venue)}&date=${encodeURIComponent(event.isoDate)}`}
                      className="flex items-center justify-between gap-3 rounded-xl border border-pi-warmth/30 bg-pi-warmth/5 p-3.5 transition hover:border-pi-warmth hover:bg-pi-warmth/10"
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-pi-warmth/15 text-pi-warmth">
                          <Sparkles className="h-4 w-4" aria-hidden="true" />
                        </span>
                        <div className="min-w-0">
                          <p className="text-xs font-bold uppercase tracking-wider text-pi-warmth-strong">
                            Email the venue
                          </p>
                          <p className="mt-0.5 text-base font-semibold text-pi-ink">
                            Use AI to generate your email
                          </p>
                        </div>
                      </div>
                      <span className="text-pi-warmth">→</span>
                    </Link>
                  </li>
                )}
                {venueContact?.phone && (
                  <li>
                    <a
                      href={`tel:${venueContact.phone}`}
                      className="flex items-start justify-between gap-3 rounded-xl border border-pi-ink/15 bg-white p-3.5 transition hover:border-pi-accent/50"
                    >
                      <div>
                        <p className="text-xs font-bold uppercase tracking-wider text-pi-ink/65">
                          Phone
                        </p>
                        <p className="mt-0.5 text-base font-semibold text-pi-ink">
                          {venueContact.phone}
                        </p>
                      </div>
                      <span className="text-pi-accent">→</span>
                    </a>
                  </li>
                )}
                {event.eventUrl && (
                  <li>
                    <a
                      href={event.eventUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-between gap-3 rounded-xl border border-pi-ink/15 bg-white p-3.5 transition hover:border-pi-accent/50"
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-pi-ink/5 text-pi-ink/70">
                          <Link2 className="h-4 w-4" aria-hidden="true" />
                        </span>
                        <div className="min-w-0">
                          <p className="text-xs font-bold uppercase tracking-wider text-pi-ink/65">
                            Event page
                          </p>
                          <p className="mt-0.5 text-base font-semibold text-pi-ink">
                            Tickets &amp; venue info
                          </p>
                        </div>
                      </div>
                      <span className="text-pi-accent">→</span>
                    </a>
                  </li>
                )}
              </ul>
              {venueContact?.note && !venueContact.bslGuaranteed && (
                <p className="mt-4 text-sm leading-relaxed text-pi-ink/70">
                  {venueContact.note}
                </p>
              )}
            </div>
          ) : null;

          return (
            <div className="section-padding section-gap">
              <div className="grid gap-12 lg:grid-cols-[1.6fr_1fr]">
                <div className="space-y-10">
              {event.description && (
                <section>
                  <h2 className="font-display text-2xl text-pi-ink md:text-3xl">
                    About this event
                  </h2>
                  <p className="mt-4 whitespace-pre-line text-base leading-relaxed text-pi-ink/75">
                    {event.description}
                  </p>
                </section>
              )}

              <section>
                <div
                  className={`rounded-2xl border p-5 ${
                    isBooked
                      ? "border-pi-success/30 bg-pi-success/5"
                      : "border-pi-warmth/30 bg-pi-warmth/5"
                  }`}
                >
                  <p
                    className={`font-display text-xl ${
                      isBooked ? "text-pi-success-strong" : "text-pi-warmth-strong"
                    }`}
                  >
                    {statusBadgeLabel}
                  </p>
                  <p className="mt-2 text-base leading-relaxed text-pi-ink/75">
                    {isBooked
                      ? `${langLabel} interpretation is confirmed for this performance.`
                      : `${langLabel} interpretation is not yet confirmed. The venue accepts requests — use the form on this page and we'll contact them on your behalf.`}
                  </p>
                  {venueContact?.bslGuaranteed && (
                    <p className="mt-3 rounded-lg bg-pi-success-strong/10 p-3 text-sm font-medium text-pi-success-strong">
                      ✓ {venueContact.note ??
                        `${langLabel} provided at all events at this venue as standard.`}
                    </p>
                  )}
                </div>

                {(event.interpreters && isBooked) || event.format ? (
                  <dl className="mt-5 grid gap-4 sm:grid-cols-2">
                    {event.interpreters && isBooked && (
                      <Detail label="Interpreting team">{event.interpreters}</Detail>
                    )}
                    {event.format && <Detail label="Format">{event.format}</Detail>}
                  </dl>
                ) : null}
              </section>

              {/* Mobile-only booking panel — desktop renders the same panel
                  inside the sticky aside in the right column. */}
              {bookingPanel && (
                <div id="request-access" className="lg:hidden">
                  {bookingPanel}
                </div>
              )}

              {(venueDetails?.mapsUrl ||
                venueDetails?.address ||
                venueDetails?.postcode) && (
                <section>
                  <h2 className="font-display text-2xl text-pi-ink md:text-3xl">
                    Venue
                  </h2>
                  <div className="mt-4 rounded-2xl border border-pi-ink/10 bg-white p-5">
                    <p className="font-semibold text-pi-ink">{event.venue}</p>
                    {(venueDetails?.address ||
                      venueDetails?.address2 ||
                      venueDetails?.postcode) && (
                      <address className="mt-2 not-italic text-base leading-relaxed text-pi-ink/70">
                        {venueDetails?.address && <>{venueDetails.address}<br /></>}
                        {venueDetails?.address2 && <>{venueDetails.address2}<br /></>}
                        {venueDetails?.city && <>{venueDetails.city}<br /></>}
                        {venueDetails?.postcode && <>{venueDetails.postcode}</>}
                      </address>
                    )}
                    {venueDetails?.mapsUrl && (
                      <a
                        href={venueDetails.mapsUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="mt-4 inline-flex items-center gap-2 text-base font-semibold text-pi-accent hover:text-pi-ink"
                      >
                        Open in Google Maps →
                      </a>
                    )}
                  </div>
                </section>
              )}

              {features.length > 0 && (
                <section>
                  <h2 className="font-display text-2xl text-pi-ink md:text-3xl">
                    Accessible facilities
                  </h2>
                  <p className="mt-2 text-base text-pi-ink/65">
                    Verified from the venue&apos;s official accessibility page.
                  </p>
                  <ul className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                    {features.map((key) => {
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
                            <p className="text-base font-semibold text-pi-ink">
                              {def.label}
                            </p>
                            <p className="text-sm leading-snug text-pi-ink/70">
                              {def.desc}
                            </p>
                          </div>
                        </li>
                      );
                    })}
                  </ul>
                </section>
              )}
            </div>

            {/* Desktop sticky aside — hidden on mobile (mobile copy renders
                inline between Interpretation and Venue above). */}
            <aside className="hidden lg:block lg:sticky lg:top-24 lg:self-start">
              {bookingPanel}
            </aside>
              </div>
            </div>
          );
        })()}
      </article>
    </>
  );
}

function Detail({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <dt className="text-xs font-semibold uppercase tracking-wide text-pi-ink/65">
        {label}
      </dt>
      <dd className="mt-1 text-base text-pi-ink">{children}</dd>
    </div>
  );
}
