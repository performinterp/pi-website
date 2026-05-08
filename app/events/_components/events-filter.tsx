"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import dynamic from "next/dynamic";
import Link from "next/link";
import type { Event } from "@/lib/types";
import { eventSlug } from "@/lib/event-slug";
import {
  fuzzyMatch,
  findSimilarTerms,
  buildVocabulary,
  type VocabEntry,
} from "./search-utils";
import { DATE_PRESETS, activePresetKey } from "./preset-dates";
import { CATEGORY_ICONS, CATEGORY_ORDER, iconForCategory } from "./category-icons";
import BslHelpVideo from "./bsl-help-video";
import {
  haversineKm,
  venueCoordinates,
  requestUserLocation,
  getCachedCoords,
} from "./geo-utils";

// Map view is client-only (Leaflet hits window at import). Dynamic import
// with ssr:false keeps SSR/SSG happy while still allowing the rest of this
// component to render on the server.
const EventsMap = dynamic(() => import("./events-map"), {
  ssr: false,
  loading: () => (
    <div className="flex h-[60vh] min-h-[400px] items-center justify-center rounded-2xl border border-pi-ink/10 bg-white text-sm text-pi-ink/60">
      Loading map…
    </div>
  ),
});

const NEAR_ME_DEFAULT_RADIUS_KM = 80; // ~50 miles, matches standalone app default

interface Props {
  events: Event[];
  cities: string[];
  categories: string[];
}

const PAGE_SIZE = 24;

const LANGUAGE_OPTIONS = [
  { value: "all", label: "Any language" },
  { value: "BSL", label: "BSL" },
  { value: "ISL", label: "ISL" },
  { value: "BSL_AND_ISL", label: "BSL & ISL" },
];

const STATUS_OPTIONS = [
  { value: "all", label: "All events" },
  { value: "booked", label: "Booked" },
  { value: "on-request", label: "On request" },
];

function formatDateLabel(isoDate: string): string {
  const date = new Date(`${isoDate}T00:00:00Z`);
  return date.toLocaleDateString("en-GB", {
    timeZone: "UTC",
    weekday: "short",
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

export default function EventsFilter({ events, cities, categories }: Props) {
  const [search, setSearch] = useState("");
  const [city, setCity] = useState("all");
  const [category, setCategory] = useState("all");
  const [language, setLanguage] = useState("all");
  const [interpreterStatus, setInterpreterStatus] = useState("all");
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [visible, setVisible] = useState(PAGE_SIZE);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [viewMode, setViewMode] = useState<"list" | "map">("list");
  const [userCoords, setUserCoords] = useState<{ lat: number; lng: number } | null>(null);
  const [nearMeActive, setNearMeActive] = useState(false);
  const [nearMeStatus, setNearMeStatus] = useState<"idle" | "loading" | "denied" | "unavailable" | "timeout">("idle");
  const searchWrapRef = useRef<HTMLDivElement | null>(null);

  // Re-hydrate cached user coords on mount (set during a previous Near me
  // tap in this session). Lets users keep "Near me" active across page
  // navigations within the session without re-prompting. We can't use a
  // lazy useState initialiser here because sessionStorage is unavailable
  // during SSR — would cause a hydration mismatch.
  useEffect(() => {
    const cached = getCachedCoords();
    // eslint-disable-next-line react-hooks/set-state-in-effect
    if (cached) setUserCoords(cached);
  }, []);

  async function activateNearMe() {
    if (nearMeActive) {
      setNearMeActive(false);
      setVisible(PAGE_SIZE);
      return;
    }
    if (userCoords) {
      setNearMeActive(true);
      setVisible(PAGE_SIZE);
      return;
    }
    setNearMeStatus("loading");
    const result = await requestUserLocation();
    if (result.status === "ok" && result.coords) {
      setUserCoords(result.coords);
      setNearMeActive(true);
      setNearMeStatus("idle");
    } else if (result.status !== "ok") {
      setNearMeStatus(result.status);
    }
    setVisible(PAGE_SIZE);
  }

  // Build a vocabulary of distinct event names + venues + interpreters,
  // used for both the substring suggestion dropdown and the "did you mean?"
  // empty state. Memoised — only rebuilds when the events list changes.
  const vocabulary: VocabEntry[] = useMemo(
    () =>
      buildVocabulary(
        events.map((e) => ({
          name: e.name,
          venue: e.venue,
          interpreters: e.interpreters,
        }))
      ),
    [events]
  );

  // Live suggestions: only EXACT substring matches (fuzzy-only suggestions
  // were creating "must pick a suggestion" confusion). The filter still
  // uses fuzzyMatch internally so typo'd searches keep working — this
  // dropdown is just for "is this venue in the feed?" discovery.
  const suggestions = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (q.length < 2) return [];
    const out: VocabEntry[] = [];
    for (const item of vocabulary) {
      if (item.label.toLowerCase().includes(q)) {
        out.push(item);
        if (out.length >= 6) break;
      }
    }
    return out;
  }, [search, vocabulary]);

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (searchWrapRef.current && !searchWrapRef.current.contains(e.target as Node)) {
        setShowSuggestions(false);
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  const filtered = useMemo(() => {
    const term = search.trim();
    return events.filter((ev) => {
      if (term) {
        const haystack = `${ev.name} ${ev.venue} ${ev.city} ${ev.interpreters}`;
        if (!fuzzyMatch(haystack, term)) return false;
      }
      if (city !== "all" && ev.city !== city) return false;
      if (category !== "all" && ev.category !== category) return false;
      if (language !== "all" && ev.language !== language) return false;
      if (interpreterStatus !== "all" && ev.interpreterStatus !== interpreterStatus) return false;
      if (fromDate && ev.isoDate < fromDate) return false;
      if (toDate && ev.isoDate > toDate) return false;
      if (nearMeActive && userCoords) {
        const venuePos = venueCoordinates(ev.venue);
        if (!venuePos) return false;
        const km = haversineKm(userCoords, venuePos);
        if (km > NEAR_ME_DEFAULT_RADIUS_KM) return false;
      }
      return true;
    });
  }, [
    events,
    search,
    city,
    category,
    language,
    interpreterStatus,
    fromDate,
    toDate,
    nearMeActive,
    userCoords,
  ]);

  // "Did you mean?" — only when search is non-empty AND no events match.
  // Keeps the recovery path for typo'd searches without cluttering the
  // dropdown above.
  const didYouMean = useMemo(() => {
    const term = search.trim();
    if (!term || filtered.length > 0) return [];
    return findSimilarTerms(term, vocabulary, 3);
  }, [search, filtered.length, vocabulary]);

  // Category grid — counts per category from current `events`. Includes
  // "All" pseudo-category as the leftmost card.
  const categoryCards = useMemo(() => {
    const counts = new Map<string, number>();
    for (const ev of events) {
      const c = ev.category || "Other";
      counts.set(c, (counts.get(c) || 0) + 1);
    }
    const ordered = [...CATEGORY_ORDER].filter((c) => counts.has(c));
    const extras = Array.from(counts.keys())
      .filter((c) => !CATEGORY_ORDER.includes(c))
      .sort();
    const list = [
      { key: "all", label: "All", count: events.length, icon: CATEGORY_ICONS.All },
      ...[...ordered, ...extras].map((c) => ({
        key: c,
        label: c,
        count: counts.get(c) || 0,
        icon: iconForCategory(c),
      })),
    ];
    // Keep categories that aren't represented in current events out of the
    // grid — but include the static `categories` prop's set if filter state
    // is referencing one with zero current events (avoids the active filter
    // disappearing).
    if (category !== "all" && !list.find((c) => c.key === category)) {
      list.push({
        key: category,
        label: category,
        count: 0,
        icon: iconForCategory(category),
      });
    }
    return list;
  }, [events, category]);

  const activeDatePreset = activePresetKey(fromDate, toDate);

  const shown = filtered.slice(0, visible);
  const hasMore = filtered.length > shown.length;

  function reset() {
    setSearch("");
    setCity("all");
    setCategory("all");
    setLanguage("all");
    setInterpreterStatus("all");
    setFromDate("");
    setToDate("");
    setNearMeActive(false);
    setVisible(PAGE_SIZE);
  }

  function applyDatePreset(key: string) {
    if (activeDatePreset === key) {
      // Toggle off
      setFromDate("");
      setToDate("");
      return;
    }
    const preset = DATE_PRESETS.find((p) => p.key === key);
    if (!preset) return;
    const range = preset.compute();
    setFromDate(range.from);
    setToDate(range.to);
    setVisible(PAGE_SIZE);
  }

  // Touch the unused `categories` prop to satisfy unused-var rules if any
  // and keep the public API of this component stable.
  void categories;

  const inputClass =
    "w-full rounded-lg border border-pi-ink/15 bg-white px-3 py-2.5 text-sm text-pi-ink placeholder-pi-ink/40 outline-none transition focus:border-pi-accent focus:ring-1 focus:ring-pi-accent";
  const labelClass = "block text-xs font-semibold uppercase tracking-wide text-pi-ink/70";

  return (
    <>
      <BslHelpVideo />

      <div className="mb-6 flex flex-col gap-3 rounded-2xl border border-pi-gold/30 bg-gradient-to-r from-pi-gold/10 via-pi-warmth/5 to-transparent p-5 sm:flex-row sm:items-center sm:justify-between md:p-6">
        <div>
          <p className="font-display text-lg leading-tight text-pi-ink md:text-xl">
            Can&apos;t find your event?
          </p>
          <p className="mt-1 text-base text-pi-ink/65">
            We&apos;ll ask the venue to book a BSL or ISL interpreter for you.
          </p>
        </div>
        <Link
          href="/events/request"
          className="inline-flex shrink-0 items-center justify-center gap-2 rounded-full bg-pi-warmth-strong px-6 py-3 text-sm font-bold text-white shadow-lg shadow-pi-warmth/30 transition hover:brightness-110 hover:shadow-pi-warmth/50"
        >
          Request an Interpreter →
        </Link>
      </div>

      <div className="mb-6 rounded-2xl border border-pi-ink/10 bg-white p-5 shadow-sm md:p-6">
        {/* Search input + suggestions */}
        <div ref={searchWrapRef}>
          <label htmlFor="ev-search" className={labelClass}>
            Search
          </label>
          <div className="relative">
            <input
              id="ev-search"
              type="search"
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setVisible(PAGE_SIZE);
                setShowSuggestions(true);
              }}
              onFocus={() => setShowSuggestions(true)}
              onKeyDown={(e) => {
                if (e.key === "Escape") setShowSuggestions(false);
              }}
              placeholder="Type anything — name, venue, interpreter (typos OK)"
              autoComplete="off"
              aria-autocomplete="list"
              aria-expanded={showSuggestions && suggestions.length > 0}
              aria-controls="ev-search-suggestions"
              className={`${inputClass} mt-1.5`}
            />
            {showSuggestions && suggestions.length > 0 && (
              <ul
                id="ev-search-suggestions"
                role="listbox"
                className="absolute left-0 right-0 top-full z-20 mt-1 max-h-64 overflow-y-auto rounded-lg border border-pi-ink/15 bg-white shadow-lg"
              >
                {suggestions.map((s, i) => (
                  <li key={`${s.type}-${i}-${s.label}`} role="option" aria-selected="false">
                    <button
                      type="button"
                      onMouseDown={(e) => {
                        e.preventDefault();
                        setSearch(s.label);
                        setShowSuggestions(false);
                        setVisible(PAGE_SIZE);
                      }}
                      className="flex w-full items-center justify-between gap-3 px-3 py-2 text-left text-sm text-pi-ink hover:bg-pi-warmth/10 focus:bg-pi-warmth/10 focus:outline-none"
                    >
                      <span className="truncate">{s.label}</span>
                      <span className="shrink-0 rounded-full bg-pi-ink/5 px-2 py-0.5 text-xs font-semibold uppercase tracking-wide text-pi-ink/60">
                        {s.type}
                      </span>
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>

        {/* Visual category grid */}
        <div className="mt-5">
          <p className={labelClass}>Category</p>
          <div className="mt-2 grid grid-cols-3 gap-2 sm:grid-cols-4 md:grid-cols-6">
            {categoryCards.map((c) => {
              const active = category === c.key;
              return (
                <button
                  key={c.key}
                  type="button"
                  onClick={() => {
                    setCategory(c.key);
                    setVisible(PAGE_SIZE);
                  }}
                  aria-pressed={active}
                  className={`flex flex-col items-center justify-center gap-1 rounded-xl border px-2 py-3 text-center transition ${
                    active
                      ? "border-pi-accent bg-pi-accent/10 ring-1 ring-pi-accent"
                      : "border-pi-ink/10 bg-white hover:border-pi-accent/40"
                  }`}
                >
                  <span aria-hidden="true" className="text-2xl leading-none">
                    {c.icon}
                  </span>
                  <span className="text-xs font-semibold leading-tight text-pi-ink">
                    {c.label}
                  </span>
                  <span className="text-[10px] font-semibold uppercase tracking-wide text-pi-ink/50">
                    {c.count}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Where — near-me filter */}
        <div className="mt-5">
          <p className={labelClass}>Where</p>
          <div className="mt-2 flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={activateNearMe}
              aria-pressed={nearMeActive}
              disabled={nearMeStatus === "loading"}
              className={`inline-flex items-center gap-2 rounded-full border px-4 py-1.5 text-sm font-semibold transition disabled:opacity-60 ${
                nearMeActive
                  ? "border-pi-accent bg-pi-accent text-white"
                  : "border-pi-ink/15 bg-white text-pi-ink hover:border-pi-accent/40"
              }`}
            >
              <span aria-hidden="true">📍</span>
              {nearMeStatus === "loading"
                ? "Finding you…"
                : nearMeActive
                  ? "Near me (50 mi)"
                  : "Near me"}
            </button>
            {nearMeStatus === "denied" && (
              <span className="text-xs text-pi-ink/60">
                Location denied — use the City filter instead.
              </span>
            )}
            {nearMeStatus === "unavailable" && (
              <span className="text-xs text-pi-ink/60">
                Location not available — use the City filter instead.
              </span>
            )}
            {nearMeStatus === "timeout" && (
              <span className="text-xs text-pi-ink/60">
                Couldn&apos;t get your location — try again or use City.
              </span>
            )}
          </div>
        </div>

        {/* Preset date buttons + From/To */}
        <div className="mt-5">
          <p className={labelClass}>When</p>
          <div className="mt-2 flex flex-wrap gap-2">
            {DATE_PRESETS.map((p) => {
              const active = activeDatePreset === p.key;
              return (
                <button
                  key={p.key}
                  type="button"
                  onClick={() => applyDatePreset(p.key)}
                  aria-pressed={active}
                  className={`rounded-full border px-4 py-1.5 text-sm font-semibold transition ${
                    active
                      ? "border-pi-accent bg-pi-accent text-white"
                      : "border-pi-ink/15 bg-white text-pi-ink hover:border-pi-accent/40"
                  }`}
                >
                  {p.label}
                </button>
              );
            })}
            {(fromDate || toDate) && (
              <button
                type="button"
                onClick={() => {
                  setFromDate("");
                  setToDate("");
                }}
                className="rounded-full border border-pi-ink/15 bg-white px-3 py-1.5 text-sm text-pi-ink/60 hover:text-pi-ink"
              >
                Clear dates ✕
              </button>
            )}
          </div>
          <div className="mt-3 grid grid-cols-2 gap-3">
            <div>
              <label htmlFor="ev-from" className="text-[11px] uppercase tracking-wide text-pi-ink/50">
                From
              </label>
              <input
                id="ev-from"
                type="date"
                value={fromDate}
                onChange={(e) => {
                  setFromDate(e.target.value);
                  setVisible(PAGE_SIZE);
                }}
                className={`${inputClass} mt-1`}
              />
            </div>
            <div>
              <label htmlFor="ev-to" className="text-[11px] uppercase tracking-wide text-pi-ink/50">
                To
              </label>
              <input
                id="ev-to"
                type="date"
                value={toDate}
                onChange={(e) => {
                  setToDate(e.target.value);
                  setVisible(PAGE_SIZE);
                }}
                className={`${inputClass} mt-1`}
              />
            </div>
          </div>
        </div>

        {/* Other selectable filters */}
        <div className="mt-5 grid gap-4 md:grid-cols-3">
          <div>
            <label htmlFor="ev-status" className={labelClass}>
              Status
            </label>
            <select
              id="ev-status"
              value={interpreterStatus}
              onChange={(e) => {
                setInterpreterStatus(e.target.value);
                setVisible(PAGE_SIZE);
              }}
              className={`${inputClass} mt-1.5`}
            >
              {STATUS_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label htmlFor="ev-city" className={labelClass}>
              City
            </label>
            <select
              id="ev-city"
              value={city}
              onChange={(e) => {
                setCity(e.target.value);
                setVisible(PAGE_SIZE);
              }}
              className={`${inputClass} mt-1.5`}
            >
              <option value="all">All cities</option>
              {cities.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label htmlFor="ev-language" className={labelClass}>
              Language
            </label>
            <select
              id="ev-language"
              value={language}
              onChange={(e) => {
                setLanguage(e.target.value);
                setVisible(PAGE_SIZE);
              }}
              className={`${inputClass} mt-1.5`}
            >
              {LANGUAGE_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="mt-5 flex flex-wrap items-center justify-between gap-3">
          <p className="text-sm text-pi-ink/70" aria-live="polite">
            {filtered.length} {filtered.length === 1 ? "match" : "matches"}
          </p>
          <div className="flex items-center gap-3">
            <div
              role="group"
              aria-label="View mode"
              className="inline-flex overflow-hidden rounded-full border border-pi-ink/15"
            >
              <button
                type="button"
                onClick={() => setViewMode("list")}
                aria-pressed={viewMode === "list"}
                className={`px-3 py-1.5 text-xs font-semibold transition ${
                  viewMode === "list"
                    ? "bg-pi-accent text-white"
                    : "bg-white text-pi-ink hover:bg-pi-accent/10"
                }`}
              >
                ☰ List
              </button>
              <button
                type="button"
                onClick={() => setViewMode("map")}
                aria-pressed={viewMode === "map"}
                className={`px-3 py-1.5 text-xs font-semibold transition ${
                  viewMode === "map"
                    ? "bg-pi-accent text-white"
                    : "bg-white text-pi-ink hover:bg-pi-accent/10"
                }`}
              >
                🗺️ Map
              </button>
            </div>
            <button
              type="button"
              onClick={reset}
              className="text-sm font-medium text-pi-accent hover:text-pi-ink"
            >
              Reset filters
            </button>
          </div>
        </div>
      </div>

      {viewMode === "map" ? (
        <EventsMap
          events={filtered}
          userCoords={userCoords}
          onClose={() => setViewMode("list")}
        />
      ) : shown.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-pi-ink/15 p-12 text-center">
          {search.trim() ? (
            <>
              <p className="font-display text-2xl text-pi-ink">
                No events match &ldquo;{search.trim()}&rdquo; yet
              </p>
              {didYouMean.length > 0 ? (
                <>
                  <p className="mx-auto mt-3 max-w-md text-base text-pi-ink/70">
                    Did you mean:
                  </p>
                  <div className="mt-3 flex flex-wrap justify-center gap-2">
                    {didYouMean.map((s) => (
                      <button
                        key={s.label}
                        type="button"
                        onClick={() => {
                          setSearch(s.label);
                          setVisible(PAGE_SIZE);
                          setShowSuggestions(false);
                        }}
                        className="rounded-full border border-pi-accent/30 bg-white px-4 py-2 text-sm font-semibold text-pi-accent hover:bg-pi-accent hover:text-white"
                      >
                        {s.label}
                      </button>
                    ))}
                  </div>
                  <p className="mx-auto mt-5 max-w-md text-sm text-pi-ink/60">
                    Or ask us to set this up:
                  </p>
                </>
              ) : (
                <p className="mx-auto mt-3 max-w-md text-base text-pi-ink/70">
                  We can ask the venue to book BSL or ISL for you.
                </p>
              )}
              <Link
                href={`/events/request?event=${encodeURIComponent(search.trim())}`}
                className="mt-3 inline-flex items-center justify-center gap-2 rounded-full bg-pi-warmth-strong px-6 py-3 text-sm font-bold text-white shadow-lg shadow-pi-warmth/30 transition hover:brightness-110 hover:shadow-pi-warmth/50"
              >
                Request &ldquo;{search.trim()}&rdquo; →
              </Link>
            </>
          ) : (
            <>
              <p className="font-display text-2xl text-pi-ink">No matching events</p>
              <p className="mx-auto mt-3 max-w-md text-base text-pi-ink/70">
                Try a different category or date. Or use the request button at
                the top of the page.
              </p>
            </>
          )}
        </div>
      ) : (
        <ul className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {shown.map((ev) => (
            <li key={eventSlug(ev)}>
              <EventCard event={ev} />
            </li>
          ))}
        </ul>
      )}

      {hasMore && (
        <div className="mt-10 text-center">
          <button
            type="button"
            onClick={() => setVisible((v) => v + PAGE_SIZE)}
            className="inline-flex items-center gap-2 rounded-full border border-pi-accent/30 bg-white px-6 py-2.5 text-sm font-semibold text-pi-accent transition hover:bg-pi-accent hover:text-white"
          >
            Show more events
          </button>
        </div>
      )}
    </>
  );
}

function EventCard({ event }: { event: Event }) {
  const isBooked = event.interpreterStatus === "booked";
  const stripBg = isBooked ? "bg-pi-success-strong" : "bg-pi-warmth-strong";
  const stripLabelClass = isBooked
    ? "text-pi-success-strong bg-pi-success-strong/10"
    : "text-pi-warmth-strong bg-pi-warmth-strong/10";
  const langPillBg = isBooked ? "bg-pi-success-strong" : "bg-pi-warmth-strong";
  const langLabel =
    event.language === "BSL_AND_ISL"
      ? "BSL & ISL"
      : event.language === "OTHER"
        ? event.interpretation || "Interpreted"
        : event.language;

  return (
    <Link
      href={`/events/${eventSlug(event)}`}
      className="group flex h-full flex-col overflow-hidden rounded-2xl border border-pi-ink/10 bg-white shadow-sm transition hover:-translate-y-0.5 hover:border-pi-accent/40 hover:shadow-md"
    >
      <div className="relative aspect-[16/10] w-full overflow-hidden bg-pi-canvas-soft">
        {event.imageUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={event.imageUrl}
            alt=""
            loading="lazy"
            className="h-full w-full object-cover transition group-hover:scale-[1.02]"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-pi-deep to-pi-navy text-sm font-semibold uppercase tracking-wide text-white/70">
            {event.category || "Event"}
          </div>
        )}
        <span
          className={`absolute left-3 top-3 rounded-full ${langPillBg} px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-white shadow-sm`}
        >
          {langLabel}
        </span>
        {event.soldOut && (
          <span className="absolute right-3 top-3 rounded-full bg-pi-error px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-white">
            Sold out
          </span>
        )}
      </div>

      <div className={`h-1 w-full ${stripBg}`} aria-hidden="true" />

      <div className="flex flex-1 flex-col gap-3 p-5">
        <div className="flex items-center justify-between gap-2">
          <p className="text-xs font-semibold uppercase tracking-wide text-pi-accent">
            {formatDateLabel(event.isoDate)}
            {event.time ? ` · ${event.time}` : ""}
          </p>
          <span
            className={`shrink-0 rounded-full px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider ${stripLabelClass}`}
          >
            {isBooked ? "Booked" : "On request"}
          </span>
        </div>
        <h3 className="font-display text-xl leading-tight text-pi-ink">{event.name}</h3>
        <p className="text-sm text-pi-ink/70">
          {event.venue}
          {event.city && !event.venue.includes(event.city) ? `, ${event.city}` : ""}
        </p>
        {event.interpreters && (
          <p className="mt-auto text-sm text-pi-ink/65">
            Interpreters: {event.interpreters}
          </p>
        )}
      </div>
    </Link>
  );
}
