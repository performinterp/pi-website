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
  /** Raw promo photo straight from the sheet. May be a third-party URL that
   *  aggressive content blockers strip — the gradient fallback covers that. */
  imageUrl: string;
  status: "booked" | "on-request" | "mixed";
  dates: ArtistDate[];
}

function statusPill(status: ArtistGroup["status"]) {
  if (status === "booked")
    return { label: "✓ BSL interpreter booked", cls: "bg-pi-success-strong/20 text-white" };
  if (status === "mixed")
    return { label: "Some dates booked", cls: "bg-pi-warmth-strong/25 text-white" };
  return { label: "Available on request", cls: "bg-white/20 text-white" };
}

/** Artist photo with a graceful gradient + initial fallback when the image
 *  fails to load (blocked third-party host, dead URL, etc.). */
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

function GroupCard({ group, defaultOpen }: { group: ArtistGroup; defaultOpen: boolean }) {
  const [open, setOpen] = useState(defaultOpen);
  const pill = statusPill(group.status);
  const count = group.dates.length;
  const panelId = `artist-${group.artist.replace(/[^a-z0-9]+/gi, "-").toLowerCase()}`;

  return (
    <li className="overflow-hidden rounded-2xl border border-pi-ink/10 bg-white shadow-sm">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
        aria-controls={panelId}
        className="group relative flex h-40 w-full items-end overflow-hidden text-left md:h-48"
      >
        <ArtistImage src={group.imageUrl} artist={group.artist} />
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(to top, rgba(6,15,46,0.92) 0%, rgba(6,15,46,0.45) 55%, rgba(6,15,46,0.12) 100%)",
          }}
        />
        <div className="relative flex w-full items-end justify-between gap-3 p-5">
          <div className="min-w-0">
            <h3 className="font-display text-2xl leading-tight text-white md:text-3xl">
              {group.artist}
            </h3>
            <div className="mt-2 flex flex-wrap items-center gap-2">
              <span className="rounded-full bg-white/15 px-2.5 py-1 text-xs font-bold uppercase tracking-wide text-white">
                {count} {count === 1 ? "date" : "dates"}
              </span>
              <span className={`rounded-full px-2.5 py-1 text-xs font-semibold ${pill.cls}`}>
                {pill.label}
              </span>
            </div>
          </div>
          <span
            aria-hidden="true"
            className={`shrink-0 rounded-full bg-white/15 p-2 text-white transition-transform duration-200 ${
              open ? "rotate-180" : ""
            }`}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <path d="M6 9l6 6 6-6" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </span>
        </div>
      </button>

      {open && (
        <ul id={panelId} className="divide-y divide-pi-ink/8 border-t border-pi-ink/8">
          {group.dates.map((d) => (
            <li key={d.slug}>
              <Link
                href={`/events/${d.slug}`}
                className="flex items-center justify-between gap-3 px-5 py-3.5 transition hover:bg-pi-canvas-soft"
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
      )}
    </li>
  );
}

export default function VenueEventsAccordion({ groups }: { groups: ArtistGroup[] }) {
  return (
    <ul className="mt-5 grid gap-4 sm:grid-cols-2">
      {groups.map((group, i) => (
        <GroupCard key={group.artist} group={group} defaultOpen={i === 0} />
      ))}
    </ul>
  );
}
