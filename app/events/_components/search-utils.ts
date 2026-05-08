// Search utilities for the events filter.
//
// Three layers of matching, applied in order:
//
//   1. Substring (haystack.includes(term)) — the bedrock case
//   2. Synonym alias map — BSL/Deaf-community colloquialisms or common
//      English-as-second-language alternatives ("soccer" → "football",
//      "movie" → "theatre/film", artist nicknames). Cheap lookup.
//   3. Levenshtein word + sliding-window fuzzy — handles typos and
//      mis-spellings. Tolerance scales with query length.
//   4. Phonetic match (Metaphone-lite) — handles "Beyonsay" → "Beyoncé"
//      where edit distance is large but pronunciation matches.
//
// The component should call `fuzzyMatch(haystack, term)` for live filtering
// and `findSimilarTerms(query, vocabulary)` for "did you mean?" suggestions.

// ---------- Levenshtein ----------

export function levenshtein(a: string, b: string): number {
  if (a === b) return 0;
  if (!a.length) return b.length;
  if (!b.length) return a.length;
  const m: number[][] = [];
  for (let i = 0; i <= b.length; i++) m[i] = [i];
  for (let j = 0; j <= a.length; j++) m[0][j] = j;
  for (let i = 1; i <= b.length; i++) {
    for (let j = 1; j <= a.length; j++) {
      m[i][j] =
        b[i - 1] === a[j - 1]
          ? m[i - 1][j - 1]
          : Math.min(m[i - 1][j - 1] + 1, m[i][j - 1] + 1, m[i - 1][j] + 1);
    }
  }
  return m[b.length][a.length];
}

// ---------- Synonym map ----------
//
// Each key maps to one or more terms that should ALSO match. Bidirectional:
// if user types "soccer", they should also match events with "football"; if
// they type "football", they should match events that only contain "soccer".
// Keep entries lowercased.

const SYNONYM_GROUPS: string[][] = [
  ["soccer", "football"],
  ["movie", "movies", "film", "films", "cinema", "theatre"],
  ["show", "performance", "live"],
  ["concert", "gig", "live music"],
  ["panto", "pantomime"],
  ["stand up", "stand-up", "standup", "comedy"],
  // Common artist nickname / colloquial alternatives
  ["beyonce", "beyoncé", "queen bey"],
  ["bts", "bangtan"],
  ["the weeknd", "weeknd"],
  ["taylor swift", "tay swift", "tswift"],
];

// Build an index: lowercased term → array of equivalents (excluding self).
const SYNONYM_INDEX: Map<string, string[]> = (() => {
  const map = new Map<string, string[]>();
  for (const group of SYNONYM_GROUPS) {
    for (const term of group) {
      const others = group.filter((t) => t !== term);
      const existing = map.get(term) || [];
      map.set(term, [...existing, ...others]);
    }
  }
  return map;
})();

function synonymsFor(term: string): string[] {
  return SYNONYM_INDEX.get(term.toLowerCase()) || [];
}

// ---------- Metaphone-lite (phonetic matching) ----------
//
// Lightweight English phonetic key. Not a full Metaphone implementation —
// just the rules that matter most for proper-noun recall in this context:
//   - lowercase, strip non-alphabetic
//   - drop trailing silent vowels
//   - collapse double letters
//   - common substitutions: ph→f, ck→k, c(e/i/y)→s, c→k, q→k, x→ks,
//     z→s, gh→(drop), kn→n, wr→r, mb$→m
//   - drop interior vowels except first letter
//
// "Beyonce" and "Beyonsay" both reduce to "BNS" / "BYNS"-style keys that
// agree on enough leading consonants to match. Won't catch every
// homophone but covers most accented-name typos.

export function phoneticKey(s: string): string {
  let str = (s || "").toLowerCase().replace(/[^a-z]/g, "");
  if (!str) return "";

  // Silent letter rules first
  str = str.replace(/^kn/, "n").replace(/^wr/, "r").replace(/mb$/, "m");
  str = str.replace(/gh/g, "");
  str = str.replace(/ph/g, "f");
  str = str.replace(/ck/g, "k");
  str = str.replace(/sh/g, "x"); // collapse "sh" to a single token
  str = str.replace(/ch/g, "x");
  str = str.replace(/th/g, "0"); // single token for "th"
  str = str.replace(/c(?=[eiy])/g, "s");
  str = str.replace(/c/g, "k");
  str = str.replace(/q/g, "k");
  str = str.replace(/x/g, "ks");
  str = str.replace(/z/g, "s");
  // Vowel handling: keep first letter (whether vowel or consonant), drop
  // remaining vowels.
  if (str.length === 0) return "";
  const first = str[0];
  const rest = str.slice(1).replace(/[aeiouy]/g, "");
  str = first + rest;
  // Collapse runs of the same letter
  str = str.replace(/(.)\1+/g, "$1");
  return str;
}

function phoneticMatch(haystack: string, term: string): boolean {
  if (term.length < 4) return false;
  const tKey = phoneticKey(term);
  if (!tKey || tKey.length < 2) return false;
  // Compare against each word of the haystack
  const words = haystack.toLowerCase().split(/\s+/);
  for (const w of words) {
    const wKey = phoneticKey(w);
    if (!wKey) continue;
    if (wKey === tKey) return true;
    // Tolerance: short keys must match exactly; longer keys allow 1 edit
    if (tKey.length >= 4 && Math.abs(wKey.length - tKey.length) <= 1) {
      if (levenshtein(wKey, tKey) <= 1) return true;
    }
  }
  return false;
}

// ---------- fuzzyMatch (the main filtering predicate) ----------
//
// Returns true if `term` should match `haystack`. Used per-event to filter
// the live list. Trades some false-positives for recall — for an audience
// where English spelling may be a barrier, matching too broadly is much
// better than matching too narrowly.

export function fuzzyMatch(haystack: string, term: string): boolean {
  if (!term) return true;
  const t = term.toLowerCase().trim();
  const h = haystack.toLowerCase();
  if (!t) return true;

  // 1. Substring — fastest, handles the common case.
  if (h.includes(t)) return true;

  // 2. Synonym pass — does any of `term`'s synonyms appear in haystack?
  for (const syn of synonymsFor(t)) {
    if (h.includes(syn)) return true;
  }

  // Below this, term must be at least 4 chars to engage fuzzy logic
  // (shorter terms produce too many false positives).
  if (t.length <= 3) return false;

  // 3. Levenshtein word + sliding-window — handles typos.
  const tol = t.length <= 6 ? 1 : 2;
  const words = h.split(/\s+/);
  for (const w of words) {
    if (Math.abs(w.length - t.length) <= tol && levenshtein(w, t) <= tol) return true;
    if (w.length >= t.length) {
      for (let s = 0; s <= w.length - t.length + tol; s++) {
        if (levenshtein(w.substring(s, s + t.length), t) <= tol) return true;
      }
    }
  }

  // 4. Phonetic match — last resort for proper-noun mis-spellings.
  if (phoneticMatch(h, t)) return true;

  return false;
}

// ---------- findSimilarTerms (the "did you mean?" generator) ----------
//
// When the user's search returns no events, we want to surface the closest
// matches in vocabulary so they can tap one. Multi-strategy ranking:
//
//   - Prefix match: a vocabulary word starts with the query's first ~4 chars
//   - Levenshtein on the full string (tight tolerance)
//   - Word-level Levenshtein (per-word tolerance)
//   - Synonym hit
//   - Phonetic key hit
//
// Lower numeric distance = more confident match. Sorted by distance, then
// by vocabulary type priority (event > venue > interpreter), then alpha.

export interface VocabEntry {
  label: string;
  type: "event" | "venue" | "interpreter";
}

export interface Suggestion extends VocabEntry {
  distance: number;
}

export function findSimilarTerms(
  query: string,
  vocabulary: VocabEntry[],
  maxSuggestions = 3
): Suggestion[] {
  const q = (query || "").toLowerCase().trim();
  if (q.length < 3) return [];

  const qWords = q.split(/\s+/).filter((w) => w.length >= 3);
  const qPhonetic = phoneticKey(q);
  const qSynonyms = synonymsFor(q);
  const out: Suggestion[] = [];

  for (const entry of vocabulary) {
    const label = entry.label;
    const lower = label.toLowerCase();

    // Skip exact / substring matches — those should already be appearing
    // as direct results, not "did you mean?" suggestions.
    if (lower === q) continue;
    if (lower.includes(q) || q.includes(lower)) continue;

    let recorded = false;
    const record = (distance: number) => {
      if (recorded) return;
      out.push({ label, type: entry.type, distance });
      recorded = true;
    };

    // Strategy 1: prefix match (query starts like a word in label)
    const labelWords = lower.split(/\s+/).filter((w) => w.length >= 3);
    for (const lw of labelWords) {
      if (
        lw.startsWith(q.slice(0, 4)) &&
        Math.abs(lw.length - q.length) <= 3
      ) {
        record(0.5);
        break;
      }
    }
    if (recorded) continue;

    // Strategy 2: full-string Levenshtein (tight)
    if (Math.abs(label.length - q.length) <= 4) {
      const d = levenshtein(q, lower);
      const max = Math.max(2, Math.ceil(q.length * 0.25));
      if (d > 0 && d <= max) record(d);
    }
    if (recorded) continue;

    // Strategy 3: word-level Levenshtein
    for (const qw of qWords) {
      let matched = false;
      for (const lw of labelWords) {
        if (Math.abs(qw.length - lw.length) <= 2) {
          const wd = levenshtein(qw, lw);
          const maxWd = qw.length <= 5 ? 1 : 2;
          if (wd > 0 && wd <= maxWd) {
            record(wd + 1);
            matched = true;
            break;
          }
        }
      }
      if (matched) break;
    }
    if (recorded) continue;

    // Strategy 4: synonym hit — if any synonym of q is a substring of label
    for (const syn of qSynonyms) {
      if (lower.includes(syn)) {
        record(1.5);
        break;
      }
    }
    if (recorded) continue;

    // Strategy 5: phonetic key match (last resort, weaker confidence)
    if (qPhonetic && qPhonetic.length >= 3) {
      const lPhonetic = phoneticKey(label);
      if (
        lPhonetic === qPhonetic ||
        (Math.abs(lPhonetic.length - qPhonetic.length) <= 1 &&
          levenshtein(lPhonetic, qPhonetic) <= 1)
      ) {
        record(2.5);
      }
    }
  }

  const typePriority: Record<VocabEntry["type"], number> = {
    event: 0,
    venue: 1,
    interpreter: 2,
  };
  out.sort((a, b) => {
    if (a.distance !== b.distance) return a.distance - b.distance;
    const pa = typePriority[a.type] ?? 9;
    const pb = typePriority[b.type] ?? 9;
    if (pa !== pb) return pa - pb;
    return a.label.toLowerCase().localeCompare(b.label.toLowerCase());
  });

  // Dedupe by lowercased label, keep first (best-ranked) occurrence
  const seen = new Set<string>();
  const unique: Suggestion[] = [];
  for (const s of out) {
    const k = s.label.toLowerCase();
    if (seen.has(k)) continue;
    seen.add(k);
    unique.push(s);
    if (unique.length >= maxSuggestions) break;
  }
  return unique;
}

// ---------- buildVocabulary ----------

export function buildVocabulary(
  events: Array<{ name?: string; venue?: string; interpreters?: string }>
): VocabEntry[] {
  const seen = new Map<string, VocabEntry>();
  function add(label: string | undefined, type: VocabEntry["type"]) {
    if (!label) return;
    const trimmed = label.trim();
    if (trimmed.length < 3) return;
    const key = type + ":" + trimmed.toLowerCase();
    if (!seen.has(key)) seen.set(key, { label: trimmed, type });
  }
  for (const ev of events) {
    add(ev.name, "event");
    add(ev.venue, "venue");
    if (ev.venue && ev.venue.includes(",")) {
      add(ev.venue.split(",")[0], "venue");
    }
    if (ev.interpreters) {
      // Split on common separators staff use ("&", ",", " and ")
      const names = ev.interpreters.split(/\s*(?:,|&|\sand\s)\s*/i);
      for (const n of names) add(n, "interpreter");
    }
  }
  return Array.from(seen.values());
}
