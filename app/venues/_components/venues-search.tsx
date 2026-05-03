"use client";

import { useId, useMemo, useState } from "react";
import Link from "next/link";
import { Search } from "lucide-react";

interface VenueRecord {
  display: string;
  city: string;
  country: string;
  slug: string;
}

interface Props {
  venues: VenueRecord[];
}

// Loose tokenisation — punctuation in, treat acronyms (e.g. "O2") as tokens.
function tokens(s: string): string[] {
  return s
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, " ")
    .split(/\s+/)
    .filter((t) => t.length > 0);
}

// Fuzzy-friendly contains: each query token must appear as a substring in
// any of the venue's tokens (display + city). Tolerates spelling variation
// at the start of a word and small typos by accepting any token that
// contains the query token as a substring.
function matches(query: string, v: VenueRecord): number {
  const q = tokens(query);
  if (q.length === 0) return 0;
  const hay = tokens(`${v.display} ${v.city} ${v.country}`);
  let score = 0;
  for (const qt of q) {
    let bestForToken = 0;
    for (const ht of hay) {
      if (ht === qt) bestForToken = Math.max(bestForToken, 3);
      else if (ht.startsWith(qt)) bestForToken = Math.max(bestForToken, 2);
      else if (ht.includes(qt)) bestForToken = Math.max(bestForToken, 1);
    }
    if (bestForToken === 0) return 0; // every query token must hit
    score += bestForToken;
  }
  return score;
}

export default function VenuesSearch({ venues }: Props) {
  const [query, setQuery] = useState("");
  const [focused, setFocused] = useState(false);
  const inputId = useId();
  const listId = useId();

  const suggestions = useMemo(() => {
    const q = query.trim();
    if (q.length < 2) return [];
    return venues
      .map((v) => ({ v, score: matches(q, v) }))
      .filter((x) => x.score > 0)
      .sort((a, b) => b.score - a.score || a.v.display.localeCompare(b.v.display))
      .slice(0, 8)
      .map((x) => x.v);
  }, [query, venues]);

  const showList = focused && query.trim().length >= 2;

  return (
    <div className="relative">
      <label htmlFor={inputId} className="sr-only">
        Search venues
      </label>
      <div className="relative">
        <Search
          aria-hidden="true"
          className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-pi-ink/40"
        />
        <input
          id={inputId}
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => setFocused(true)}
          onBlur={() => setTimeout(() => setFocused(false), 150)}
          placeholder="Search venues — try city or venue name"
          autoComplete="off"
          aria-controls={listId}
          aria-expanded={showList}
          className="w-full rounded-full border border-pi-ink/15 bg-white pl-11 pr-4 py-3 text-base text-pi-ink placeholder-pi-ink/45 outline-none transition focus:border-pi-accent focus:ring-2 focus:ring-pi-accent"
        />
      </div>

      {showList && (
        <ul
          id={listId}
          role="listbox"
          className="absolute left-0 right-0 top-full z-20 mt-2 max-h-[60vh] overflow-y-auto rounded-2xl border border-pi-ink/10 bg-white shadow-2xl shadow-black/10"
        >
          {suggestions.length === 0 ? (
            <li className="px-4 py-3 text-base text-pi-ink/65">
              No venues match &ldquo;{query.trim()}&rdquo;.
            </li>
          ) : (
            suggestions.map((v) => (
              <li key={v.slug} role="option">
                <Link
                  href={`/venues/${v.slug}/`}
                  className="block border-b border-pi-ink/5 px-4 py-3 text-base text-pi-ink transition hover:bg-pi-accent/5 last:border-b-0"
                >
                  <span className="font-semibold">{v.display}</span>{" "}
                  <span className="text-sm text-pi-ink/65">
                    · {v.city}, {v.country}
                  </span>
                </Link>
              </li>
            ))
          )}
        </ul>
      )}
    </div>
  );
}
