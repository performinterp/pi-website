"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import type { Event } from "@/lib/types";
import { eventSlug } from "@/lib/event-slug";

interface Props {
  events: Event[];
  cities: string[];
  categories: string[];
}

const PAGE_SIZE = 24;

// Levenshtein distance (small, no dep). Used to spelling-tolerantly match
// individual words. Cheap enough for our vocabulary sizes (~few hundred).
function lev(a: string, b: string): number {
  if (a === b) return 0;
  if (!a.length) return b.length;
  if (!b.length) return a.length;
  const m: number[][] = [];
  for (let i = 0; i <= b.length; i++) m[i] = [i];
  for (let j = 0; j <= a.length; j++) m[0][j] = j;
  for (let i = 1; i <= b.length; i++) {
    for (let j = 1; j <= a.length; j++) {
      m[i][j] = b[i - 1] === a[j - 1]
        ? m[i - 1][j - 1]
        : Math.min(m[i - 1][j - 1] + 1, m[i][j - 1] + 1, m[i - 1][j] + 1);
    }
  }
  return m[b.length][a.length];
}

// Fuzzy term match. Exact substring first; otherwise Levenshtein within a
// per-length tolerance on any word in haystack OR a sliding window. Helps
// when users misspell names — important for accessibility (BSL users may
// have less English-spelling exposure).
function fuzzyMatch(haystack: string, term: string): boolean {
  if (!term) return true;
  if (haystack.includes(term)) return true;
  if (term.length <= 3) return false; // too short — exact-only
  const tol = term.length <= 6 ? 1 : 2;
  const words = haystack.split(/\s+/);
  for (const w of words) {
    if (Math.abs(w.length - term.length) <= tol && lev(w, term) <= tol) return true;
    if (w.length >= term.length) {
      for (let s = 0; s <= w.length - term.length + tol; s++) {
        if (lev(w.substring(s, s + term.length), term) <= tol) return true;
      }
    }
  }
  return false;
}

const LANGUAGE_OPTIONS = [
  { value: "all", label: "Any language" },
  { value: "BSL", label: "BSL" },
  { value: "ISL", label: "ISL" },
  { value: "BSL_AND_ISL", label: "BSL & ISL" },
];

const STATUS_OPTIONS = [
  { value: "all", label: "All events" },
  { value: "booked", label: "Interpreter booked" },
  { value: "on-request", label: "Available on request" },
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
  const searchWrapRef = useRef<HTMLDivElement | null>(null);

  // Build a vocabulary of distinct event names + venues for the suggestion
  // dropdown. We deliberately don't include every interpreter name — that
  // would clutter results. Prefixed with type so the user sees at a glance
  // what they're picking.
  const vocabulary = useMemo(() => {
    const seen = new Map<string, "event" | "venue">();
    for (const ev of events) {
      if (ev.name && !seen.has(ev.name.toLowerCase())) seen.set(ev.name.toLowerCase(), "event");
      if (ev.venue && !seen.has(ev.venue.toLowerCase())) seen.set(ev.venue.toLowerCase(), "venue");
    }
    // Re-emit with original casing
    const map = new Map<string, { label: string; type: "event" | "venue" }>();
    for (const ev of events) {
      if (ev.name) {
        const k = ev.name.toLowerCase();
        if (!map.has(k)) map.set(k, { label: ev.name, type: seen.get(k) === "venue" ? "venue" : "event" });
      }
      if (ev.venue) {
        const k = ev.venue.toLowerCase();
        if (!map.has(k)) map.set(k, { label: ev.venue, type: "venue" });
      }
    }
    return Array.from(map.values());
  }, [events]);

  const suggestions = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (q.length < 2) return [];
    const exact: typeof vocabulary = [];
    const fuzzy: typeof vocabulary = [];
    for (const item of vocabulary) {
      const lower = item.label.toLowerCase();
      if (lower.includes(q)) exact.push(item);
      else if (fuzzyMatch(lower, q)) fuzzy.push(item);
      if (exact.length >= 6) break;
    }
    return [...exact, ...fuzzy].slice(0, 6);
  }, [search, vocabulary]);

  // Click-away handler for the suggestion dropdown
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
    const term = search.trim().toLowerCase();
    return events.filter((ev) => {
      if (term) {
        const haystack = `${ev.name} ${ev.venue} ${ev.city} ${ev.interpreters}`.toLowerCase();
        if (!fuzzyMatch(haystack, term)) return false;
      }
      if (city !== "all" && ev.city !== city) return false;
      if (category !== "all" && ev.category !== category) return false;
      if (language !== "all" && ev.language !== language) return false;
      if (interpreterStatus !== "all" && ev.interpreterStatus !== interpreterStatus) return false;
      if (fromDate && ev.isoDate < fromDate) return false;
      if (toDate && ev.isoDate > toDate) return false;
      return true;
    });
  }, [events, search, city, category, language, interpreterStatus, fromDate, toDate]);

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
    setVisible(PAGE_SIZE);
  }

  const inputClass =
    "w-full rounded-lg border border-pi-ink/15 bg-white px-3 py-2.5 text-sm text-pi-ink placeholder-pi-ink/40 outline-none transition focus:border-pi-accent focus:ring-1 focus:ring-pi-accent";
  const labelClass = "block text-xs font-semibold uppercase tracking-wide text-pi-ink/70";

  return (
    <>
      <div className="mb-6 flex flex-col gap-3 rounded-2xl border border-pi-gold/30 bg-gradient-to-r from-pi-gold/10 via-pi-warmth/5 to-transparent p-5 sm:flex-row sm:items-center sm:justify-between md:p-6">
        <div>
          <p className="font-display text-lg leading-tight text-pi-ink md:text-xl">
            Can&apos;t find your event?
          </p>
          <p className="mt-1 text-base text-pi-ink/65">
            We&apos;ll contact the venue to request BSL or ISL interpretation on
            your behalf.
          </p>
        </div>
        <Link
          href="/events/request"
          className="inline-flex shrink-0 items-center justify-center gap-2 rounded-full bg-pi-warmth-strong px-6 py-3 text-sm font-bold text-white shadow-lg shadow-pi-warmth/30 transition hover:brightness-110 hover:shadow-pi-warmth/50"
        >
          Request an Interpreter →
        </Link>
      </div>

      <div className="mb-10 rounded-2xl border border-pi-ink/10 bg-white p-5 shadow-sm md:p-6">
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          <div className="lg:col-span-3" ref={searchWrapRef}>
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
                placeholder="Artist, event, venue, interpreter... (typos OK)"
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
                          // Use mousedown so the click registers before the input's blur fires
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

          <div>
            <label htmlFor="ev-status" className={labelClass}>
              Interpreter status
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
            <label htmlFor="ev-category" className={labelClass}>
              Category
            </label>
            <select
              id="ev-category"
              value={category}
              onChange={(e) => {
                setCategory(e.target.value);
                setVisible(PAGE_SIZE);
              }}
              className={`${inputClass} mt-1.5`}
            >
              <option value="all">All categories</option>
              {categories.map((c) => (
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

          {/* Date range — pair From and To in a 2-col sub-grid so they share
              a row even on narrow phones (the parent grid only goes 2-col at
              md+, leaving these two stacked otherwise). */}
          <div className="grid grid-cols-2 gap-4 md:contents">
            <div>
              <label htmlFor="ev-from" className={labelClass}>
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
                className={`${inputClass} mt-1.5`}
              />
            </div>

            <div>
              <label htmlFor="ev-to" className={labelClass}>
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
                className={`${inputClass} mt-1.5`}
              />
            </div>
          </div>
        </div>

        <div className="mt-5 flex items-center justify-between gap-3">
          <p className="text-sm text-pi-ink/70" aria-live="polite">
            {filtered.length} {filtered.length === 1 ? "match" : "matches"}
          </p>
          <button
            type="button"
            onClick={reset}
            className="text-sm font-medium text-pi-accent hover:text-pi-ink"
          >
            Reset filters
          </button>
        </div>
      </div>

      {shown.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-pi-ink/15 p-12 text-center">
          <p className="font-display text-2xl text-pi-ink">No matching events</p>
          <p className="mx-auto mt-3 max-w-md text-base text-pi-ink/70">
            Try widening your filters, or request access for an event you&apos;re
            going to using the button above.
          </p>
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
