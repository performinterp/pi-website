"use client";

import { useState } from "react";
import Link from "next/link";

export interface ArtistDate {
  slug: string;
  dateLabel: string;
  booked: boolean;
  soldOut: boolean;
}

export interface ArtistGroup {
  artist: string;
  /** First-party image (resolved via the artist library → /artists/*). The
   *  gradient + initial fallback covers any artist not yet in the library. */
  imageUrl: string;
  /** Optional venue help-centre article for this act (access/BSL + ticket
   *  info). Surfaced as a "more info" link in the act's detail panel. */
  moreInfoUrl?: string;
  status: "booked" | "on-request" | "mixed";
  dates: ArtistDate[];
}

function statusPill(status: ArtistGroup["status"]) {
  if (status === "booked")
    return { label: "✓ BSL booked", cls: "bg-pi-success-strong/20 text-white" };
  if (status === "mixed")
    return { label: "Some booked", cls: "bg-pi-warmth-strong/30 text-white" };
  return { label: "On request", cls: "bg-white/20 text-white" };
}

/** Artist photo with a graceful gradient + initial fallback when the image
 *  fails to load. */
function ArtistImage({ src, artist }: { src: string; artist: string }) {
  const [broken, setBroken] = useState(!src);
  const initial = artist.trim().charAt(0).toUpperCase() || "♪";
  return (
    <div className="absolute inset-0 bg-gradient-to-br from-pi-deep via-pi-accent/40 to-pi-deep">
      {!broken && (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={src}
          alt=""
          onError={() => setBroken(true)}
          className="h-full w-full object-cover"
          loading="lazy"
        />
      )}
      {broken && (
        <span
          aria-hidden="true"
          className="absolute inset-0 flex items-center justify-center font-display text-6xl text-white/25"
        >
          {initial}
        </span>
      )}
    </div>
  );
}

export default function VenueEventsCarousel({ groups }: { groups: ArtistGroup[] }) {
  const [selected, setSelected] = useState(0);
  const active = groups[selected] ?? groups[0];

  return (
    <div className="mt-5">
      {/* Swipeable row of acts */}
      <ul className="-mx-1 flex snap-x snap-mandatory gap-3 overflow-x-auto px-1 pb-3 [scrollbar-width:thin]">
        {groups.map((g, i) => {
          const pill = statusPill(g.status);
          const isActive = i === selected;
          return (
            <li key={g.artist} className="w-36 shrink-0 snap-start sm:w-40">
              <button
                type="button"
                onClick={() => setSelected(i)}
                aria-pressed={isActive}
                className={`group relative block aspect-[3/4] w-full overflow-hidden rounded-2xl text-left transition ${
                  isActive
                    ? "ring-2 ring-pi-accent ring-offset-2 ring-offset-pi-canvas"
                    : "opacity-90 hover:opacity-100"
                }`}
              >
                <ArtistImage src={g.imageUrl} artist={g.artist} />
                <div
                  className="absolute inset-0"
                  style={{
                    background:
                      "linear-gradient(to top, rgba(6,15,46,0.94) 0%, rgba(6,15,46,0.35) 55%, rgba(6,15,46,0.05) 100%)",
                  }}
                />
                <div className="absolute inset-x-0 bottom-0 p-3">
                  <p className="font-display text-base leading-tight text-white">
                    {g.artist}
                  </p>
                  <div className="mt-1.5 flex flex-wrap items-center gap-1">
                    <span className="rounded-full bg-white/15 px-2 py-0.5 text-[11px] font-bold uppercase tracking-wide text-white">
                      {g.dates.length} {g.dates.length === 1 ? "date" : "dates"}
                    </span>
                    <span className={`rounded-full px-2 py-0.5 text-[11px] font-semibold ${pill.cls}`}>
                      {pill.label}
                    </span>
                  </div>
                </div>
              </button>
            </li>
          );
        })}
      </ul>

      {/* Dates for the selected act */}
      {active && (
        <div className="mt-2 rounded-2xl border border-pi-ink/10 bg-white p-2 shadow-sm">
          <div className="flex items-center justify-between gap-3 px-3 pb-1 pt-2">
            <h3 className="font-display text-lg text-pi-ink">{active.artist}</h3>
            <span className="text-sm font-semibold text-pi-ink/55">
              {active.dates.length} {active.dates.length === 1 ? "date" : "dates"}
            </span>
          </div>
          {active.moreInfoUrl && (
            <a
              href={active.moreInfoUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="mx-3 mb-1 mt-1 inline-flex items-center gap-1.5 text-sm font-semibold text-pi-accent hover:text-pi-ink"
            >
              Access &amp; ticket info at the venue
              <span aria-hidden="true">→</span>
            </a>
          )}
          <ul className="divide-y divide-pi-ink/8">
            {active.dates.map((d) => (
              <li key={d.slug}>
                <Link
                  href={`/events/${d.slug}`}
                  className="flex items-center justify-between gap-3 rounded-lg px-3 py-3 transition hover:bg-pi-canvas-soft"
                >
                  <div className="min-w-0">
                    <p className="text-base font-semibold text-pi-ink">{d.dateLabel}</p>
                    <p className="mt-0.5 text-sm text-pi-ink/70">
                      {d.booked ? "Interpreter booked" : "Available on request"}
                      {d.soldOut && " · Sold out"}
                    </p>
                  </div>
                  <span aria-hidden="true" className="text-pi-accent">→</span>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
