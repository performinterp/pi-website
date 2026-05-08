// Geographic utilities: distance math, venue coordinate lookup, geolocation
// permission flow. Used by both the "Near me" filter and the map view.
//
// Venue coordinates source: lib/venue-coordinates.json (366 entries, mirrored
// from the standalone app's offline geocoding cache). When new venues appear
// in the feed, regenerate that file via the standalone app's geocoding job
// rather than calling a live geocoder from the browser.

import venueCoords from "@/lib/venue-coordinates.json";

export interface VenueCoord {
  lat: number;
  lng: number;
  match?: string; // human-readable match used during geocoding
}

const COORDS = venueCoords as Record<string, VenueCoord>;

// ---------- Coordinate lookup ----------
//
// Venue strings vary in punctuation/casing across sources, so the lookup is
// best-effort: try exact, then progressively relax (case-insensitive,
// trimmed, prefix-only). Returns null for venues we don't have coordinates
// for — caller decides how to handle.

const COORDS_LOWER: Record<string, VenueCoord> = (() => {
  const m: Record<string, VenueCoord> = {};
  for (const k of Object.keys(COORDS)) m[k.toLowerCase()] = COORDS[k];
  return m;
})();

export function venueCoordinates(venue: string): VenueCoord | null {
  if (!venue) return null;
  const trimmed = venue.trim();
  if (COORDS[trimmed]) return COORDS[trimmed];
  const lower = trimmed.toLowerCase();
  if (COORDS_LOWER[lower]) return COORDS_LOWER[lower];
  // Strip a single trailing ", City" (publisher sometimes appends, sometimes not)
  const commaIdx = trimmed.lastIndexOf(",");
  if (commaIdx > 0) {
    const head = trimmed.slice(0, commaIdx).trim().toLowerCase();
    if (COORDS_LOWER[head]) return COORDS_LOWER[head];
  }
  // Last resort: prefix match on first 20 chars
  const prefix = lower.slice(0, 20);
  for (const k of Object.keys(COORDS_LOWER)) {
    if (k.startsWith(prefix)) return COORDS_LOWER[k];
  }
  return null;
}

// ---------- Haversine distance ----------

const R_KM = 6371;

export function haversineKm(
  a: { lat: number; lng: number },
  b: { lat: number; lng: number }
): number {
  const toRad = (deg: number) => (deg * Math.PI) / 180;
  const dLat = toRad(b.lat - a.lat);
  const dLng = toRad(b.lng - a.lng);
  const lat1 = toRad(a.lat);
  const lat2 = toRad(b.lat);
  const h =
    Math.sin(dLat / 2) ** 2 +
    Math.sin(dLng / 2) ** 2 * Math.cos(lat1) * Math.cos(lat2);
  return 2 * R_KM * Math.asin(Math.sqrt(h));
}

export function kmToMi(km: number): number {
  return km * 0.621371;
}

// ---------- Geolocation ----------
//
// Returns user coordinates from the browser geolocation API. Caches the
// result in sessionStorage so subsequent reads don't re-prompt. Caller
// gets a status string telling them what to render:
//
//   "ok"        — coords returned, use them
//   "denied"    — user said no; show a manual location entry fallback
//   "unavailable" — browser doesn't support geolocation
//   "timeout"   — got no answer within 10s; user can retry

export interface GeoResult {
  status: "ok" | "denied" | "unavailable" | "timeout";
  coords?: { lat: number; lng: number };
}

const SESSION_KEY = "pi-user-coords";

export function getCachedCoords(): { lat: number; lng: number } | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = sessionStorage.getItem(SESSION_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    if (typeof parsed.lat === "number" && typeof parsed.lng === "number") {
      return parsed;
    }
  } catch {
    // ignore parse errors
  }
  return null;
}

export function requestUserLocation(): Promise<GeoResult> {
  return new Promise((resolve) => {
    if (typeof window === "undefined" || !("geolocation" in navigator)) {
      resolve({ status: "unavailable" });
      return;
    }
    const cached = getCachedCoords();
    if (cached) {
      resolve({ status: "ok", coords: cached });
      return;
    }
    const timer = setTimeout(() => resolve({ status: "timeout" }), 10000);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        clearTimeout(timer);
        const coords = {
          lat: pos.coords.latitude,
          lng: pos.coords.longitude,
        };
        try {
          sessionStorage.setItem(SESSION_KEY, JSON.stringify(coords));
        } catch {
          // sessionStorage may be unavailable (private mode, etc.) — non-fatal
        }
        resolve({ status: "ok", coords });
      },
      (err) => {
        clearTimeout(timer);
        if (err.code === err.PERMISSION_DENIED) {
          resolve({ status: "denied" });
        } else {
          resolve({ status: "unavailable" });
        }
      },
      { enableHighAccuracy: false, maximumAge: 5 * 60 * 1000, timeout: 10000 }
    );
  });
}
