// PIPA's library of signed explainer videos. Mirrors the BSL + ISL catalogue
// shipped in the PI Events App (pi-events-standalone-app/.../app.js). Source
// of truth for the timings is the app — keep these in sync if either set
// gets re-edited.
//
// All clips are hosted on Cloudflare R2 at media.performanceinterpreting.co.uk.
// HTML5 video supports media-fragment URIs (#t=START or #t=START,END) so we
// can deep-link straight into the right chapter without splitting files.

const MEDIA_BASE = "https://media.performanceinterpreting.co.uk";

export type SignLanguage = "BSL" | "ISL";

export interface VideoChapter {
  time: number;
  label: string;
}

export interface SignVideo {
  src: string;
  chapters?: VideoChapter[];
}

// Catalogue keys that exist in both BSL + ISL. Each key represents a topic
// the model can request via the getSignedExplainer tool.
export type VideoKey =
  | "how-to-book"
  | "know-rights"
  | "orientation"
  | "categories"
  | "search"
  | "request"
  | "booking"
  | "faqs"
  | "tips"
  | "at-event"
  | "notifications"
  | "volunteer";

// Topic descriptions paired with each key — used in the tool description so
// the model picks the right key for a given user question.
export const VIDEO_TOPICS: Record<VideoKey, string> = {
  "how-to-book": "How to book an access ticket — find the event, check venues, contact, confirm, book, enjoy",
  "know-rights": "Your rights as a Deaf attendee — UK + Ireland + Northern Ireland framing, no extra cost, companion tickets, getting help",
  orientation: "Tour of the PI Events App — Events tab, Tool Kit, BSL & ISL videos, notifications, more, get in touch",
  categories: "Browsing event categories",
  search: "Searching for events",
  request: "Requesting an interpreter for an event",
  booking: "General booking guidance for accessing tickets",
  faqs: "Common Deaf-attendee FAQs — need to ask first? how early to book? cost? bring someone? where will the interpreter be?",
  tips: "Five practical tips — access booking line, best seats, email confirmation, arrive early, share feedback",
  "at-event": "What to do at the event — show staff, ordering, emergencies, speech-to-text",
  notifications: "Setting up app notifications",
  volunteer: "Volunteering with Performance Interpreting",
};

const BSL: Record<VideoKey, SignVideo> = {
  "how-to-book": {
    src: `${MEDIA_BASE}/bsl-how-to-book.mp4`,
    chapters: [
      { time: 0, label: "Intro" },
      { time: 10, label: "1. Find your event" },
      { time: 23, label: "2. Check venues list" },
      { time: 37, label: "3. Contact the venue" },
      { time: 53, label: "4. Tell them what you need" },
      { time: 70, label: "5. Get email confirmation" },
      { time: 83, label: "6. Enjoy the event" },
      { time: 103, label: "Venues & Ticket Vendors" },
    ],
  },
  "know-rights": {
    src: `${MEDIA_BASE}/bsl-know-rights.mp4`,
    chapters: [
      { time: 0, label: "Disclaimer" },
      { time: 7, label: "Your rights" },
      { time: 16, label: "England, Wales, Scotland" },
      { time: 56, label: "Northern Ireland" },
      { time: 80, label: "No extra cost" },
      { time: 91, label: "Companion tickets" },
      { time: 101, label: "Nimbus Access Card" },
      { time: 121, label: "Getting help" },
    ],
  },
  orientation: {
    src: `${MEDIA_BASE}/bsl-orientation.mp4`,
    chapters: [
      { time: 0, label: "Welcome" },
      { time: 15, label: "Events tab" },
      { time: 75, label: "Tool Kit tab" },
      { time: 110, label: "BSL & ISL tab" },
      { time: 133, label: "Notifications" },
      { time: 159, label: "More tab" },
      { time: 200, label: "Get in touch" },
    ],
  },
  categories: { src: `${MEDIA_BASE}/bsl-categories.mp4` },
  search: { src: `${MEDIA_BASE}/bsl-search.mp4` },
  request: { src: `${MEDIA_BASE}/bsl-request.mp4` },
  booking: { src: `${MEDIA_BASE}/bsl-booking.mp4` },
  faqs: {
    src: `${MEDIA_BASE}/bsl-faqs.mp4`,
    chapters: [
      { time: 0, label: "Q1: Need to ask first?" },
      { time: 31.32, label: "Q2: How early to book?" },
      { time: 54.56, label: "Q3: Cost more?" },
      { time: 76.44, label: "Q4: Bring someone?" },
      { time: 94.36, label: "Q5: BSL vs ISL?" },
      { time: 121.12, label: "Q7: Where is interpreter?" },
    ],
  },
  tips: {
    src: `${MEDIA_BASE}/bsl-tips.mp4`,
    chapters: [
      { time: 0, label: "Intro" },
      { time: 9, label: "Tip 1: Access booking line" },
      { time: 24, label: "Tip 2: Best seats" },
      { time: 41, label: "Tip 3: Email confirmation" },
      { time: 53, label: "Tip 4: Arrive early" },
      { time: 63.5, label: "Tip 5: Tell us how it went" },
    ],
  },
  "at-event": {
    src: `${MEDIA_BASE}/bsl-at-event.mp4`,
    chapters: [
      { time: 0, label: "Intro" },
      { time: 6, label: "Show Staff" },
      { time: 22, label: "Order" },
      { time: 33, label: "Emergency" },
      { time: 50, label: "Speech to Text" },
    ],
  },
  notifications: { src: `${MEDIA_BASE}/bsl-notifications.mp4` },
  volunteer: { src: `${MEDIA_BASE}/bsl-volunteer.mp4` },
};

const ISL: Record<VideoKey, SignVideo> = {
  "how-to-book": {
    src: `${MEDIA_BASE}/isl-how-to-book.mp4`,
    chapters: [
      { time: 0.1, label: "Intro" },
      { time: 11.6, label: "1. Find your event" },
      { time: 23.4, label: "2. Check venues list" },
      { time: 37.6, label: "3. Contact the venue" },
      { time: 47.6, label: "4. Get confirmation" },
      { time: 61.0, label: "5. Book your ticket" },
      { time: 73.3, label: "6. Enjoy the event" },
      { time: 86.0, label: "Venues & Ticket Vendors" },
    ],
  },
  "know-rights": {
    src: `${MEDIA_BASE}/isl-know-rights.mp4`,
    chapters: [
      { time: 0.1, label: "Disclaimer" },
      { time: 14.6, label: "Your rights in Ireland" },
      { time: 41.5, label: "Northern Ireland" },
      { time: 64.0, label: "No extra cost" },
      { time: 71.7, label: "Getting help" },
    ],
  },
  orientation: {
    src: `${MEDIA_BASE}/isl-orientation.mp4`,
    chapters: [
      { time: 0.8, label: "Welcome" },
      { time: 19.9, label: "Events tab" },
      { time: 88.5, label: "Tool Kit tab" },
      { time: 127.2, label: "ISL & BSL tab" },
      { time: 146.6, label: "Notifications" },
      { time: 169.4, label: "More tab" },
      { time: 203.5, label: "Get in touch" },
    ],
  },
  categories: { src: `${MEDIA_BASE}/isl-categories.mp4` },
  search: { src: `${MEDIA_BASE}/isl-search.mp4` },
  request: { src: `${MEDIA_BASE}/isl-request.mp4` },
  booking: { src: `${MEDIA_BASE}/isl-booking.mp4` },
  faqs: {
    src: `${MEDIA_BASE}/isl-faqs.mp4`,
    chapters: [
      { time: 0.4, label: "Q1: Need to ask first?" },
      { time: 27.1, label: "Q2: How early to book?" },
      { time: 50.62, label: "Q3: Cost more?" },
      { time: 70.22, label: "Q4: Bring someone?" },
      { time: 126.32, label: "Q5: ISL & BSL" },
      { time: 158.32, label: "Q6: Choose my interpreter?" },
    ],
  },
  tips: {
    src: `${MEDIA_BASE}/isl-tips.mp4`,
    chapters: [
      { time: 0, label: "Intro" },
      { time: 12.8, label: "Tip 1: Access booking line" },
      { time: 23.6, label: "Tip 2: Best seats" },
      { time: 37.2, label: "Tip 3: Email confirmation" },
      { time: 48.5, label: "Tip 4: Arrive early" },
      { time: 56.4, label: "Tip 5: Tell us how it went" },
    ],
  },
  "at-event": {
    src: `${MEDIA_BASE}/isl-at-event.mp4`,
    chapters: [
      { time: 0.5, label: "Intro" },
      { time: 8.0, label: "Show Staff" },
      { time: 29.7, label: "Order" },
      { time: 40.5, label: "Emergency" },
      { time: 56.4, label: "Speech to Text" },
    ],
  },
  notifications: { src: `${MEDIA_BASE}/isl-notifications.mp4` },
  volunteer: { src: `${MEDIA_BASE}/isl-volunteer.mp4` },
};

const CATALOGUE: Record<SignLanguage, Record<VideoKey, SignVideo>> = {
  BSL,
  ISL,
};

export const VIDEO_KEYS = Object.keys(BSL) as VideoKey[];

export function getSignVideo(
  key: VideoKey,
  language: SignLanguage
): SignVideo | undefined {
  return CATALOGUE[language]?.[key];
}

// Build a deep-link URL with a media-fragment timestamp for the given
// chapter (selected by 0-based index OR by fuzzy-matching a label).
// Browsers honour `#t=START` for HTML5 video.
export function buildSignVideoUrl(
  key: VideoKey,
  language: SignLanguage,
  options?: { chapterIndex?: number; chapter?: string }
): {
  url: string;
  chapterLabel: string | null;
  chapterTime: number;
  availableChapters: VideoChapter[];
} | null {
  const video = getSignVideo(key, language);
  if (!video) return null;
  const chapters = video.chapters ?? [];
  let chapterTime = 0;
  let chapterLabel: string | null = null;

  if (
    typeof options?.chapterIndex === "number" &&
    options.chapterIndex >= 0 &&
    options.chapterIndex < chapters.length
  ) {
    chapterTime = chapters[options.chapterIndex].time;
    chapterLabel = chapters[options.chapterIndex].label;
  } else if (options?.chapter && chapters.length > 0) {
    const match = findBestChapter(options.chapter, chapters);
    if (match) {
      chapterTime = match.time;
      chapterLabel = match.label;
    }
  }

  const url = chapterTime > 0 ? `${video.src}#t=${chapterTime}` : video.src;
  return { url, chapterLabel, chapterTime, availableChapters: chapters };
}

// Lightweight fuzzy match — counts shared lowercase word overlaps. Picks
// the chapter whose label shares the most words with the query, ignoring
// stop words and tiny ones. Handles inputs like "where will the
// interpreter be?" → "Q7: Where is interpreter?".
function findBestChapter(query: string, chapters: VideoChapter[]): VideoChapter | null {
  const STOP = new Set([
    "a", "an", "the", "is", "are", "was", "were", "be", "do", "does", "did",
    "to", "of", "in", "on", "at", "for", "with", "by", "from",
    "i", "you", "we", "they", "he", "she", "it",
    "my", "your", "our", "their",
    "and", "or", "but", "if", "then",
    "what", "where", "when", "why", "how", "which", "who",
  ]);
  const tokenise = (s: string) =>
    s
      .toLowerCase()
      .replace(/[^a-z0-9\s]/g, " ")
      .split(/\s+/)
      .filter((w) => w.length > 2 && !STOP.has(w));

  const queryTokens = new Set(tokenise(query));
  if (queryTokens.size === 0) return null;

  let best: VideoChapter | null = null;
  let bestScore = 0;
  for (const ch of chapters) {
    const labelTokens = tokenise(ch.label);
    let score = 0;
    for (const t of labelTokens) if (queryTokens.has(t)) score++;
    if (score > bestScore) {
      bestScore = score;
      best = ch;
    }
  }
  return bestScore > 0 ? best : null;
}

// Returns a compact, model-friendly listing of every key + chapter labels
// in the catalogue (in the requested language). Used to inline into the
// getSignedExplainer tool description so the model can pick the right
// chapter without a separate round-trip.
export function describeCatalogue(language: SignLanguage = "BSL"): string {
  const lines: string[] = [];
  for (const key of VIDEO_KEYS) {
    const video = getSignVideo(key, language);
    if (!video) continue;
    const chapters = video.chapters ?? [];
    if (chapters.length === 0) {
      lines.push(`- \`${key}\`: ${VIDEO_TOPICS[key]}`);
    } else {
      lines.push(`- \`${key}\`: ${VIDEO_TOPICS[key]}`);
      lines.push(
        `  chapters: ${chapters.map((c, i) => `${i}=${JSON.stringify(c.label)}`).join(", ")}`
      );
    }
  }
  return lines.join("\n");
}
