"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import dynamic from "next/dynamic";
import Link from "next/link";
import type { Event } from "@/lib/types";
import type { ClubView } from "@/lib/clubs";
import { eventSlug } from "@/lib/event-slug";
import {
  fuzzyMatch,
  findSimilarTerms,
  buildVocabulary,
  type VocabEntry,
} from "./search-utils";
import { DATE_PRESETS, activePresetKey } from "./preset-dates";
import { CATEGORY_ICONS, CATEGORY_ORDER, groupCategory, iconForCategory } from "./category-icons";
import BslHelpVideo from "./bsl-help-video";
import EventImage from "@/components/event-image";
import {
  haversineKm,
  venueCoordinates,
  requestUserLocation,
  getCachedCoords,
} from "./geo-utils";
import { useEasyRead } from "@/lib/easy-read";

// Map view is client-only (Leaflet hits window at import). Dynamic import
// with ssr:false keeps SSR/SSG happy while still allowing the rest of this
// component to render on the server.
const EventsMap = dynamic(() => import("./events-map"), {
  ssr: false,
  loading: () => (
    <div className="flex h-[60vh] min-h-[400px] items-center justify-center rounded-2xl border border-pi-ink/10 bg-white text-base text-pi-ink/60">
      Loading map…
    </div>
  ),
});

const NEAR_ME_DEFAULT_RADIUS_KM = 80; // ~50 miles, matches standalone app default

interface Props {
  events: Event[];
  cities: string[];
  categories: string[];
  clubs: ClubView[];
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

export default function EventsFilter({ events, cities, categories, clubs }: Props) {
  const { on: easyRead } = useEasyRead();
  const [search, setSearch] = useState("");
  const [city, setCity] = useState("all");
  const [category, setCategory] = useState("all");
  const [club, setClub] = useState("all");
  const [language, setLanguage] = useState("all");
  const [interpreterStatus, setInterpreterStatus] = useState("all");
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [visible, setVisible] = useState(PAGE_SIZE);
  const [showSuggestions, setShowSuggestions] = useState(false);
  // Suggestion highlighted with the arrow keys (-1 = none).
  const [activeIdx, setActiveIdx] = useState(-1);
  // Phones only: the place/date/language filters fold away by default.
  const [moreOpen, setMoreOpen] = useState(false);
  const [viewMode, setViewMode] = useState<"list" | "map">("list");
  const [userCoords, setUserCoords] = useState<{ lat: number; lng: number } | null>(null);
  const [nearMeActive, setNearMeActive] = useState(false);
  const [nearMeStatus, setNearMeStatus] = useState<"idle" | "loading" | "denied" | "unavailable" | "timeout">("idle");
  const searchWrapRef = useRef<HTMLDivElement | null>(null);
  const resultsRef = useRef<HTMLDivElement | null>(null);
  const categoryRef = useRef<HTMLDivElement | null>(null);
  const countRef = useRef<HTMLDivElement | null>(null);

  function scrollToSearch() {
    // Delay slightly so mobile keyboard / focus-driven native scroll
    // doesn't override us.
    setTimeout(() => {
      searchWrapRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 60);
  }

  function scrollToResults() {
    setTimeout(() => {
      resultsRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 60);
  }

  // Phones: a category tap takes you to the results (the match count, then
  // the events). Otherwise the tap looks like it did nothing. The count row
  // has a link back up to the categories.
  function scrollToRef(ref: React.RefObject<HTMLDivElement | null>) {
    setTimeout(() => {
      const calm = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      ref.current?.scrollIntoView({ behavior: calm ? "auto" : "smooth", block: "start" });
    }, 60);
  }

  function revealResults() {
    if (window.matchMedia("(max-width: 767px)").matches) scrollToRef(countRef);
  }

  function chooseSuggestion(label: string) {
    setSearch(label);
    setShowSuggestions(false);
    setActiveIdx(-1);
    setVisible(PAGE_SIZE);
    scrollToResults();
  }

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
      if (category !== "all" && !ev.categories.some((c) => groupCategory(c) === category)) return false;
      if (club !== "all" && ev.clubKey !== club) return false;
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
    club,
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
  // "All" pseudo-category as the leftmost card. Multi-category events
  // contribute to each of their categories' counts (so a "Concert,Festival"
  // event increments both the Concert and Festival tallies).
  const categoryCards = useMemo(() => {
    const counts = new Map<string, number>();
    for (const ev of events) {
      const cats = ev.categories.length > 0 ? [...new Set(ev.categories.map(groupCategory))] : ["Other"];
      for (const c of cats) {
        counts.set(c, (counts.get(c) || 0) + 1);
      }
    }
    const ordered = [...CATEGORY_ORDER].filter(
      (c) => counts.has(c) || (c === "Sports" && clubs.length > 0)
    );
    const extras = Array.from(counts.keys())
      .filter((c) => !CATEGORY_ORDER.includes(c))
      .sort();
    const list = [
      { key: "all", label: "All", count: events.length, icon: CATEGORY_ICONS.All },
      ...[...ordered, ...extras].map((c) => ({
        key: c,
        label: c === "Festival" ? "Festivals" : c,
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
  }, [events, category, clubs]);

  const selectedClub = club !== "all" ? clubs.find((c) => c.key === club) : undefined;

  const activeDatePreset = activePresetKey(fromDate, toDate);
  const moreActive = [
    nearMeActive,
    !!(fromDate || toDate),
    interpreterStatus !== "all",
    city !== "all",
    language !== "all",
  ].filter(Boolean).length;

  const shown = filtered.slice(0, visible);
  const hasMore = filtered.length > shown.length;
  // Only booked events carry real names ("Request Interpreter" is a placeholder).
  const showInterpreterNote = shown.some((ev) => ev.interpreters && ev.interpreterStatus === "booked");

  function reset() {
    setSearch("");
    setCity("all");
    setCategory("all");
    setClub("all");
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
    "w-full rounded-lg border border-pi-ink/15 bg-white px-3 py-2.5 text-base text-pi-ink placeholder-pi-ink/40 outline-none transition focus:border-pi-accent focus:ring-1 focus:ring-pi-accent";
  const labelClass = "block text-sm font-semibold uppercase tracking-wide text-pi-ink/70";

  return (
    <>
      <BslHelpVideo />

      {/* "Can't find your event?" banner — hidden in Easy-Read mode (its
          message is repeated in the empty state where it's most relevant,
          and it adds visual noise here for low-fluency users). */}
      {!easyRead && (
        <Link
          href="/events/request"
          className="mb-4 block rounded-xl border border-pi-gold/30 bg-pi-gold/10 px-4 py-3 text-base text-pi-ink md:hidden"
        >
          Can&apos;t find your event?{" "}
          <span className="font-bold underline underline-offset-2">Request an Interpreter →</span>
        </Link>
      )}
      {!easyRead && (
        <div className="mb-6 hidden flex-col gap-3 rounded-2xl border border-pi-gold/30 bg-gradient-to-r from-pi-gold/10 via-pi-warmth/5 to-transparent p-5 sm:flex-row sm:items-center sm:justify-between md:flex md:p-6">
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
            className="inline-flex shrink-0 items-center justify-center gap-2 rounded-full bg-pi-warmth-strong px-6 py-3 text-base font-bold text-white shadow-lg shadow-pi-warmth/30 transition hover:brightness-110 hover:shadow-pi-warmth/50"
          >
            Request an Interpreter →
          </Link>
        </div>
      )}

      <div className="mb-6 rounded-2xl border border-pi-ink/10 bg-white p-5 shadow-sm md:p-6">
        {/* Search input + suggestions */}
        <div ref={searchWrapRef} className="scroll-mt-24">
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
                setActiveIdx(-1);
              }}
              onFocus={() => {
                setShowSuggestions(true);
                scrollToSearch();
              }}
              onKeyDown={(e) => {
                const open = showSuggestions && suggestions.length > 0;
                if (e.key === "ArrowDown" && suggestions.length > 0) {
                  e.preventDefault();
                  setShowSuggestions(true);
                  setActiveIdx((i) => Math.min(i + 1, suggestions.length - 1));
                }
                if (e.key === "ArrowUp" && open) {
                  e.preventDefault();
                  setActiveIdx((i) => Math.max(i - 1, -1));
                }
                if (e.key === "Escape") {
                  setShowSuggestions(false);
                  setActiveIdx(-1);
                }
                if (e.key === "Enter") {
                  e.preventDefault();
                  if (open && activeIdx >= 0) {
                    chooseSuggestion(suggestions[activeIdx].label);
                    return;
                  }
                  setShowSuggestions(false);
                  (e.currentTarget as HTMLInputElement).blur();
                  scrollToResults();
                }
              }}
              placeholder={easyRead ? "Type a name or place" : "Type anything — name, venue, interpreter (typos OK)"}
              autoComplete="off"
              role="combobox"
              aria-autocomplete="list"
              aria-expanded={showSuggestions && suggestions.length > 0}
              aria-controls="ev-search-suggestions"
              aria-activedescendant={
                showSuggestions && activeIdx >= 0 ? `ev-sugg-${activeIdx}` : undefined
              }
              className={`${inputClass} mt-1.5`}
            />
            {showSuggestions && suggestions.length > 0 && (
              <ul
                id="ev-search-suggestions"
                role="listbox"
                aria-label="Suggestions"
                className="absolute left-0 right-0 top-full z-20 mt-1 max-h-64 overflow-y-auto rounded-lg border border-pi-ink/15 bg-white shadow-lg"
              >
                {/* Options aren't focusable: focus stays in the input and the
                    arrow keys move aria-activedescendant (combobox pattern). */}
                {suggestions.map((s, i) => (
                  <li
                    key={`${s.type}-${i}-${s.label}`}
                    id={`ev-sugg-${i}`}
                    role="option"
                    aria-selected={i === activeIdx}
                    onMouseDown={(e) => {
                      e.preventDefault();
                      chooseSuggestion(s.label);
                    }}
                    className={`flex w-full cursor-pointer items-center justify-between gap-3 px-3 py-2 text-left text-base text-pi-ink hover:bg-pi-warmth/10 ${
                      i === activeIdx ? "bg-pi-warmth/15 outline outline-2 -outline-offset-2 outline-pi-accent" : ""
                    }`}
                  >
                    <span className="truncate">{s.label}</span>
                    <span className="shrink-0 rounded-full bg-pi-ink/5 px-2 py-0.5 text-sm font-semibold uppercase tracking-wide text-pi-ink/60">
                      {s.type}
                    </span>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>

        {/* Visual category grid */}
        <div ref={categoryRef} className="mt-5 scroll-mt-20">
          <p className={labelClass}>Category</p>
          {/* Phones: small wrapping buttons so every category is visible at
              once (a swipe row looked like only two). md+: the card grid. */}
          <div className="mt-2 flex flex-wrap gap-2 md:grid md:grid-cols-6">
            {categoryCards.map((c) => {
              const active = category === c.key;
              return (
                <button
                  key={c.key}
                  type="button"
                  onClick={() => {
                    setCategory(c.key);
                    setClub("all");
                    setVisible(PAGE_SIZE);
                    revealResults();
                  }}
                  aria-pressed={active}
                  className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-2.5 transition md:flex md:flex-col md:justify-center md:gap-1 md:rounded-xl md:px-2 md:py-3 md:text-center ${
                    active
                      ? "border-pi-accent bg-pi-accent/10 ring-1 ring-pi-accent"
                      : "border-pi-ink/10 bg-white hover:border-pi-accent/40"
                  }`}
                >
                  <span aria-hidden="true" className="text-lg leading-none md:text-2xl">
                    {c.icon}
                  </span>
                  <span className="text-sm font-semibold leading-tight text-pi-ink">
                    {c.label}
                  </span>
                  <span className="text-xs font-semibold tracking-wide text-pi-ink/70 md:uppercase">
                    {c.count}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Club picker — only when Sports is selected and we have club data */}
        {category === "Sports" && clubs.length > 0 && (
          <div className="mt-5">
            <p className={labelClass}>Club</p>
            <div className="mt-2 grid grid-cols-2 gap-2 sm:grid-cols-3 md:grid-cols-6">
              <button
                type="button"
                onClick={() => {
                  setClub("all");
                  setVisible(PAGE_SIZE);
                }}
                aria-pressed={club === "all"}
                className={`flex flex-col items-center justify-center gap-1 rounded-xl border px-2 py-3 text-center transition ${
                  club === "all"
                    ? "border-pi-accent bg-pi-accent/10 ring-1 ring-pi-accent"
                    : "border-pi-ink/10 bg-white hover:border-pi-accent/40"
                }`}
              >
                <span className="text-base font-semibold leading-tight text-pi-ink">
                  All clubs
                </span>
              </button>
              {clubs.map((c) => {
                const active = club === c.key;
                return (
                  <button
                    key={c.key}
                    type="button"
                    onClick={() => {
                      setClub(club === c.key ? "all" : c.key);
                      setVisible(PAGE_SIZE);
                    }}
                    aria-pressed={active}
                    className={`flex flex-col items-center gap-1.5 rounded-xl border p-2 text-center transition ${
                      active
                        ? "border-pi-accent bg-pi-accent/10 ring-1 ring-pi-accent"
                        : "border-pi-ink/10 bg-white hover:border-pi-accent/40"
                    }`}
                  >
                    <ClubImage
                      src={c.imageUrl}
                      alt={c.imageAlt || c.display}
                      className="aspect-[16/9] w-full rounded-lg object-cover"
                    />
                    <span className="text-base font-semibold leading-tight text-pi-ink">
                      {c.display}
                    </span>
                    <span className="text-sm leading-snug text-pi-ink/70">
                      {c.bslHeadline}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        <button
          type="button"
          onClick={() => setMoreOpen((v) => !v)}
          aria-expanded={moreOpen}
          aria-controls="ev-more-filters"
          className="mt-5 flex w-full items-center justify-between gap-3 rounded-xl border border-pi-ink/15 px-4 py-3 text-left md:hidden"
        >
          <span>
            <span className="block text-base font-semibold text-pi-ink">
              More filters{moreActive > 0 ? ` (${moreActive} on)` : ""}
            </span>
            <span className="block text-sm text-pi-ink/70">Near me, dates, city, language</span>
          </span>
          <span aria-hidden="true" className={`text-pi-ink/70 transition-transform motion-reduce:transition-none ${moreOpen ? "rotate-180" : ""}`}>
            ▾
          </span>
        </button>

        {/* Always open from md up; behind the button above on phones. */}
        <div id="ev-more-filters" className={moreOpen ? "" : "hidden md:block"}>
        {/* Where — near-me filter */}
        <div className="mt-5">
          <p className={labelClass}>Where</p>
          <div className="mt-2 flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={activateNearMe}
              aria-pressed={nearMeActive}
              disabled={nearMeStatus === "loading"}
              className={`inline-flex items-center gap-2 rounded-full border px-4 py-1.5 text-base font-semibold transition disabled:opacity-60 ${
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
              <span className="text-sm text-pi-ink/60">
                Location denied — use the City filter instead.
              </span>
            )}
            {nearMeStatus === "unavailable" && (
              <span className="text-sm text-pi-ink/60">
                Location not available — use the City filter instead.
              </span>
            )}
            {nearMeStatus === "timeout" && (
              <span className="text-sm text-pi-ink/60">
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
                  className={`rounded-full border px-4 py-1.5 text-base font-semibold transition ${
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
                className="rounded-full border border-pi-ink/15 bg-white px-3 py-1.5 text-base text-pi-ink/60 hover:text-pi-ink"
              >
                Clear dates ✕
              </button>
            )}
          </div>
          {/* Typed From/To inputs are hidden in Easy-Read — preset buttons
              cover the common cases without forcing users to know the
              dd/mm/yyyy format conventions. */}
          {!easyRead && (
            <div className="mt-3 grid grid-cols-2 gap-3">
              {/* min-w-0: iPhone date boxes otherwise refuse to shrink and
                  spill out of the panel. */}
              <div className="min-w-0">
                <label htmlFor="ev-from" className="text-xs uppercase tracking-wide text-pi-ink/50">
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
                  className={`${inputClass} mt-1 min-w-0`}
                />
              </div>
              <div className="min-w-0">
                <label htmlFor="ev-to" className="text-xs uppercase tracking-wide text-pi-ink/50">
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
                  className={`${inputClass} mt-1 min-w-0`}
                />
              </div>
            </div>
          )}
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
        </div>

        <div ref={countRef} className="mt-5 flex scroll-mt-20 flex-wrap items-center justify-between gap-3">
          <div>
            <p className="text-base text-pi-ink/70" aria-live="polite">
              {filtered.length} {filtered.length === 1 ? "match" : "matches"}
            </p>
            {category !== "all" && (
              <button
                type="button"
                onClick={() => scrollToRef(categoryRef)}
                className="text-base font-semibold text-pi-accent underline underline-offset-2 md:hidden"
              >
                {categoryCards.find((c) => c.key === category)?.label ?? category} · change
              </button>
            )}
            {showInterpreterNote && (
              <p className="text-sm text-pi-ink/60">* Interpreters may change.</p>
            )}
          </div>
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
                className={`px-3 py-1.5 text-sm font-semibold transition ${
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
                className={`px-3 py-1.5 text-sm font-semibold transition ${
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
              className="text-base font-medium text-pi-accent hover:text-pi-ink"
            >
              Reset filters
            </button>
          </div>
        </div>
      </div>

      <div ref={resultsRef} className="scroll-mt-24">
      {selectedClub && (
        <div className="mb-6 overflow-hidden rounded-2xl border border-pi-ink/10 bg-white shadow-sm">
          <ClubImage
            src={selectedClub.imageUrl}
            alt={selectedClub.imageAlt || selectedClub.display}
            className="aspect-[16/9] w-full object-cover"
          />
          <div className="p-5 md:p-6">
            <h3 className="font-display text-2xl text-pi-ink">{selectedClub.display}</h3>
            <p className="mt-1 font-semibold text-pi-accent">{selectedClub.bslHeadline}</p>
            {selectedClub.bslDetail && (
              <p className="mt-2 text-base text-pi-ink/70">{selectedClub.bslDetail}</p>
            )}

            <div className="mt-4 flex flex-wrap gap-2">
              {selectedClub.fixturesUrlMen.startsWith("https://") && (
                <a
                  href={selectedClub.fixturesUrlMen}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="rounded-full border border-pi-accent px-4 py-2 text-base font-semibold text-pi-accent hover:bg-pi-accent/10"
                >
                  {selectedClub.fixturesUrlWomen.startsWith("https://")
                    ? "Men's fixtures"
                    : "Fixtures"}
                </a>
              )}
              {selectedClub.fixturesUrlWomen.startsWith("https://") && (
                <a
                  href={selectedClub.fixturesUrlWomen}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="rounded-full border border-pi-accent px-4 py-2 text-base font-semibold text-pi-accent hover:bg-pi-accent/10"
                >
                  Women&apos;s fixtures
                </a>
              )}
              {selectedClub.ticketsUrl.startsWith("https://") && (
                <a
                  href={selectedClub.ticketsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="rounded-full border border-pi-accent px-4 py-2 text-base font-semibold text-pi-accent hover:bg-pi-accent/10"
                >
                  Tickets
                </a>
              )}
              {selectedClub.accessPageUrl.startsWith("https://") && (
                <a
                  href={selectedClub.accessPageUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="rounded-full border border-pi-accent px-4 py-2 text-base font-semibold text-pi-accent hover:bg-pi-accent/10"
                >
                  Accessibility
                </a>
              )}
            </div>

            {(selectedClub.accessEmail || selectedClub.accessPhone) && (
              <div className="mt-4">
                <h4 className="text-base font-semibold text-pi-ink">Accessibility team</h4>
                <div className="mt-1 flex flex-wrap gap-4 text-base">
                  {selectedClub.accessEmail && (
                    <a
                      href={`mailto:${selectedClub.accessEmail}`}
                      className="text-pi-accent hover:underline"
                    >
                      {selectedClub.accessEmail}
                    </a>
                  )}
                  {selectedClub.accessPhone && (
                    <a
                      href={`tel:${selectedClub.accessPhone.replace(/\s+/g, "")}`}
                      className="text-pi-accent hover:underline"
                    >
                      {selectedClub.accessPhone}
                    </a>
                  )}
                </div>
              </div>
            )}

            {selectedClub.grounds.length > 0 && (
              <div className="mt-4">
                <h4 className="text-base font-semibold text-pi-ink">
                  {selectedClub.grounds.length === 1 ? "Ground" : "Grounds"}
                </h4>
                <ul className="mt-1 space-y-2">
                  {selectedClub.grounds.map((g) => (
                    <li
                      key={g.key}
                      className="flex flex-wrap items-center gap-3 text-base text-pi-ink/80"
                    >
                      <span>
                        <span className="font-semibold text-pi-ink">{g.display}</span>
                        {g.address ? ` — ${g.address}` : ""}
                      </span>
                      {g.mapsUrl.startsWith("https://") && (
                        <a
                          href={g.mapsUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="rounded-full border border-pi-accent px-4 py-2 text-sm font-semibold text-pi-accent hover:bg-pi-accent/10"
                        >
                          Map
                        </a>
                      )}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {filtered.length === 0 && (
              <p className="mt-4 rounded-lg bg-pi-accent/5 p-3 text-base text-pi-ink/70">
                No PI-listed matches here right now. Use the fixtures button to see what&apos;s
                coming up.
              </p>
            )}

            {selectedClub.imageCredit && (
              <p className="mt-4 text-sm text-pi-ink/50">{selectedClub.imageCredit}</p>
            )}
          </div>
        </div>
      )}
      {viewMode === "map" ? (
        <EventsMap
          events={filtered}
          userCoords={userCoords}
          onClose={() => setViewMode("list")}
        />
      ) : shown.length === 0 && !selectedClub ? (
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
                        className="rounded-full border border-pi-accent/30 bg-white px-4 py-2 text-base font-semibold text-pi-accent hover:bg-pi-accent hover:text-white"
                      >
                        {s.label}
                      </button>
                    ))}
                  </div>
                  <p className="mx-auto mt-5 max-w-md text-base text-pi-ink/60">
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
                className="mt-3 inline-flex items-center justify-center gap-2 rounded-full bg-pi-warmth-strong px-6 py-3 text-base font-bold text-white shadow-lg shadow-pi-warmth/30 transition hover:brightness-110 hover:shadow-pi-warmth/50"
              >
                Request &ldquo;{search.trim()}&rdquo; →
              </Link>
            </>
          ) : (
            <>
              <p className="font-display text-2xl text-pi-ink">No matching events</p>
              {easyRead ? (
                <>
                  <p className="mx-auto mt-3 max-w-md text-base text-pi-ink/70">
                    Try another category. Or pick a different date.
                  </p>
                  <Link
                    href="/events/request"
                    className="mt-4 inline-flex items-center justify-center gap-2 rounded-full bg-pi-warmth-strong px-6 py-3 text-base font-bold text-white shadow-lg shadow-pi-warmth/30 transition hover:brightness-110 hover:shadow-pi-warmth/50"
                  >
                    ✉️ Ask for an interpreter
                  </Link>
                </>
              ) : (
                <p className="mx-auto mt-3 max-w-md text-base text-pi-ink/70">
                  Try a different category or date. Or use the request button at
                  the top of the page.
                </p>
              )}
            </>
          )}
        </div>
      ) : (
        <ul className={
          easyRead
            ? "grid gap-6"
            : "grid gap-6 sm:grid-cols-2 lg:grid-cols-3"
        }>
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
            className="inline-flex items-center gap-2 rounded-full border border-pi-accent/30 bg-white px-6 py-2.5 text-base font-semibold text-pi-accent transition hover:bg-pi-accent hover:text-white"
          >
            Show more events
          </button>
        </div>
      )}
      </div>
    </>
  );
}

// Image with a graceful fallback to the same gradient EventCard uses — for
// club thumbnails/panel images that have no URL, or whose URL 404s.
function ClubImage({
  src,
  alt,
  className,
}: {
  src: string;
  alt: string;
  className?: string;
}) {
  const [failed, setFailed] = useState(false);
  if (!src || failed) {
    return (
      <div
        className={`flex items-center justify-center bg-gradient-to-br from-pi-deep to-pi-navy ${className || ""}`}
      />
    );
  }
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={src}
      alt={alt}
      loading="lazy"
      onError={() => setFailed(true)}
      className={className}
    />
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
        <EventImage
          src={event.imageUrl}
          fallback={event.imageFallback}
          lazy
          className="h-full w-full object-cover transition group-hover:scale-[1.02]"
          placeholder={
            <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-pi-deep to-pi-navy text-base font-semibold uppercase tracking-wide text-white/70">
              {event.category || "Event"}
            </div>
          }
        />
        <span
          className={`absolute left-3 top-3 rounded-full ${langPillBg} px-2.5 py-1 text-xs font-bold uppercase tracking-wider text-white shadow-sm`}
        >
          {langLabel}
        </span>
        {event.soldOut && (
          <span className="absolute right-3 top-3 rounded-full bg-pi-error px-2.5 py-1 text-xs font-bold uppercase tracking-wider text-white">
            Sold out
          </span>
        )}
      </div>

      <div className={`h-1 w-full ${stripBg}`} aria-hidden="true" />

      <div className="flex flex-1 flex-col gap-3 p-5">
        <div className="flex items-center justify-between gap-2">
          <p className="text-sm font-semibold uppercase tracking-wide text-pi-accent">
            {formatDateLabel(event.isoDate)}
            {event.time ? ` · ${event.time}` : ""}
          </p>
          <span
            className={`shrink-0 rounded-full px-2 py-0.5 text-xs font-bold uppercase tracking-wider ${stripLabelClass}`}
          >
            {isBooked ? "Booked" : "On request"}
          </span>
        </div>
        <h3 className="font-display text-xl leading-tight text-pi-ink">{event.name}</h3>
        <p className="text-base text-pi-ink/70">
          {event.venue}
          {event.city && !event.venue.includes(event.city) ? `, ${event.city}` : ""}
        </p>
        {event.interpreters && (
          <p className="mt-auto text-base text-pi-ink/65">
            Interpreters: {event.interpreters}
            {isBooked && (
              <>
                <span aria-hidden="true">*</span>
                <span className="sr-only"> (may change)</span>
              </>
            )}
          </p>
        )}
      </div>
    </Link>
  );
}
