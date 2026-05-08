"use client";

// Map view of filtered events. Uses Leaflet (no API key, OSM tiles, free).
//
// Loaded via next/dynamic with ssr:false from the parent because Leaflet
// hits `window` at import time. Don't import this file from a server
// component.
//
// Pin → popup with event name + date + venue + link to detail page. Pins
// at the same lat/lng would overlap perfectly; we sidestep clustering for
// now by jittering identical coordinates by a few metres so they're all
// individually tappable. If event volume per venue grows large enough that
// this gets messy, swap in leaflet.markercluster.

import { useEffect, useMemo, useRef } from "react";
import Link from "next/link";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { MapContainer, TileLayer, Marker, Popup, useMap, CircleMarker } from "react-leaflet";
import type { Event } from "@/lib/types";
import { eventSlug } from "@/lib/event-slug";
import { venueCoordinates } from "./geo-utils";

interface Props {
  events: Event[];
  userCoords?: { lat: number; lng: number } | null;
  onClose?: () => void;
}

// Fix Leaflet's default-marker-icon issue under bundlers (the default icon
// path resolves wrong via webpack). We sidestep by configuring divIcon-based
// markers with inline SVG — no external asset needed.
const PI_MARKER = L.divIcon({
  className: "pi-event-marker",
  html: `<div style="
    width: 32px; height: 32px;
    background: #B85C38;
    border: 3px solid #fff;
    border-radius: 50% 50% 50% 0;
    transform: rotate(-45deg);
    box-shadow: 0 2px 4px rgba(0,0,0,0.3);
    display: flex; align-items: center; justify-content: center;
  "><span style="
    transform: rotate(45deg);
    color: #fff;
    font-weight: bold;
    font-size: 14px;
  ">PI</span></div>`,
  iconSize: [32, 32],
  iconAnchor: [16, 28],
});

// Group events by their venue's exact coordinates so popups can list all
// events at the same venue. Returns an array of { coord, events[] } pins.
interface VenuePin {
  lat: number;
  lng: number;
  venue: string;
  events: Event[];
}

function groupEventsByVenue(events: Event[]): VenuePin[] {
  const map = new Map<string, VenuePin>();
  for (const ev of events) {
    const coord = venueCoordinates(ev.venue);
    if (!coord) continue;
    const key = `${coord.lat.toFixed(5)},${coord.lng.toFixed(5)}`;
    const existing = map.get(key);
    if (existing) {
      existing.events.push(ev);
    } else {
      map.set(key, {
        lat: coord.lat,
        lng: coord.lng,
        venue: ev.venue,
        events: [ev],
      });
    }
  }
  return Array.from(map.values());
}

function FitBounds({ pins, userCoords }: { pins: VenuePin[]; userCoords?: { lat: number; lng: number } | null }) {
  const map = useMap();
  useEffect(() => {
    if (pins.length === 0 && !userCoords) return;
    const points: L.LatLngTuple[] = pins.map((p) => [p.lat, p.lng]);
    if (userCoords) points.push([userCoords.lat, userCoords.lng]);
    if (points.length === 0) return;
    const bounds = L.latLngBounds(points);
    map.fitBounds(bounds, { padding: [40, 40], maxZoom: 12 });
  }, [pins, userCoords, map]);
  return null;
}

function formatDateLabel(isoDate: string): string {
  const d = new Date(`${isoDate}T00:00:00Z`);
  return d.toLocaleDateString("en-GB", {
    timeZone: "UTC",
    weekday: "short",
    day: "numeric",
    month: "short",
  });
}

export default function EventsMap({ events, userCoords, onClose }: Props) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const pins = useMemo(() => groupEventsByVenue(events), [events]);
  const skipped = events.length - pins.reduce((acc, p) => acc + p.events.length, 0);

  // Default centre: centre of UK if no pins and no user coords.
  const initialCentre: L.LatLngTuple = userCoords
    ? [userCoords.lat, userCoords.lng]
    : pins.length > 0
      ? [pins[0].lat, pins[0].lng]
      : [54.5, -3.0];

  return (
    <div ref={containerRef} className="relative overflow-hidden rounded-2xl border border-pi-ink/10 bg-white shadow-sm">
      {onClose && (
        <button
          type="button"
          onClick={onClose}
          className="absolute right-3 top-3 z-[1000] rounded-full bg-white/95 px-4 py-2 text-sm font-semibold text-pi-ink shadow-md hover:bg-white"
          aria-label="Close map and return to list view"
        >
          ✕ Close map
        </button>
      )}
      {skipped > 0 && (
        <div className="absolute bottom-3 left-3 z-[1000] rounded-lg bg-white/95 px-3 py-2 text-xs text-pi-ink/70 shadow">
          {skipped} {skipped === 1 ? "event" : "events"} not shown — venue
          location unknown
        </div>
      )}
      <div className="h-[60vh] min-h-[400px] w-full">
        <MapContainer
          center={initialCentre}
          zoom={6}
          scrollWheelZoom={false}
          className="h-full w-full"
          aria-label="Map of upcoming events"
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          <FitBounds pins={pins} userCoords={userCoords} />
          {userCoords && (
            <CircleMarker
              center={[userCoords.lat, userCoords.lng]}
              radius={8}
              pathOptions={{
                color: "#2563EB",
                fillColor: "#3B82F6",
                fillOpacity: 0.6,
                weight: 2,
              }}
            >
              <Popup>You are here</Popup>
            </CircleMarker>
          )}
          {pins.map((pin) => (
            <Marker
              key={`${pin.lat}-${pin.lng}`}
              position={[pin.lat, pin.lng]}
              icon={PI_MARKER}
            >
              <Popup>
                <div className="min-w-[200px] max-w-[260px] space-y-2">
                  <p className="font-display text-sm font-semibold leading-tight text-pi-ink">
                    {pin.venue}
                  </p>
                  <p className="text-xs text-pi-ink/60">
                    {pin.events.length}{" "}
                    {pin.events.length === 1 ? "event" : "events"}
                  </p>
                  <ul className="max-h-48 space-y-2 overflow-y-auto">
                    {pin.events.slice(0, 8).map((ev) => (
                      <li key={eventSlug(ev)}>
                        <Link
                          href={`/events/${eventSlug(ev)}`}
                          className="block rounded border border-pi-ink/10 p-2 text-xs text-pi-ink hover:border-pi-accent/40 hover:bg-pi-accent/5"
                        >
                          <span className="block font-semibold">
                            {formatDateLabel(ev.isoDate)}
                          </span>
                          <span className="block">{ev.name}</span>
                        </Link>
                      </li>
                    ))}
                    {pin.events.length > 8 && (
                      <li className="text-xs italic text-pi-ink/60">
                        …and {pin.events.length - 8} more
                      </li>
                    )}
                  </ul>
                </div>
              </Popup>
            </Marker>
          ))}
        </MapContainer>
      </div>
    </div>
  );
}
