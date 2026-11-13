# Easy Read site-wide Implementation Plan

> **For agentic workers:** REQUIRED: Use superpowers:subagent-driven-development (if subagents available) or superpowers:executing-plans to implement this plan. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Make Easy Read do something useful on every page of performanceinterpreting.co.uk. Today the toggle only changes 5 places.

**Architecture:** There are two layers.

- **The mode layer (Chunk 1).** It is pure CSS keyed on `html[data-easy-read="on"]`, plus a `useCalmMotion()` hook. Together they make every page easier to read and stop everything moving, with no per-page code.
- **The content layer (Chunk 2).** It adds a server-rendered `er-only` summary box near the top of each page. The wording comes from `content/easy-read.json` for static pages. For event, venue and city pages it is built from data. The full page stays visible below the box.

**Tech Stack:** Next.js 16 (app router), React 19, Tailwind v4, TypeScript, Node 22 (`node --test --experimental-strip-types` for pure-function tests, no new dependencies).

**Decisions already made (James, 13 Nov 2026):**

- **Wording:** ships after it passes the checker (Task 7) and Claude's review. Marie reviews it after it is live.
- **Full page:** stays visible below the summary in Easy Read. Nothing is hidden.
- **Signed video:** the summaries use the existing BSL/ISL explainer clips where they fit (`lib/sign-videos.ts`). Each summary also has a slot for signed page intros we film later.

**Ground rules for every task:**

- **Where to work:** in the worktree `/Users/james/Projects/Performance-Interpreting/pi-website/.worktrees/easy-read` on branch `feat/easy-read-sitewide`. Never `cd` to the main checkout.
- **Committing:** stage explicit paths only, never `git add -A` or `commit -a`. End every commit message with:
  ```
  Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>
  Claude-Session: https://claude.ai/code/session_018wCQ4gvfe7hCmEvxdB8qL2
  ```
- **Dependencies:** no new ones, and no changes to `package.json` except the one `scripts` entry in Task 7.
- **The dev server** creates `AGENTS.md`. Never commit it.
- **Deaf-audience wording:** never use "speak", "speaks" or "speak our language". Use "sign", or "use BSL".

---

## Chunk 1: The mode works on every page

### Task 1: `useCalmMotion()` hook

**Files:**
- Modify: `lib/easy-read.tsx` (add the export after `useEasyRead`)

- [ ] **Step 1: Add the hook**

```tsx
// True when moving parts should stay still: Easy Read is on, or the
// visitor's system asks for reduced motion. Carousels, counters, the app
// pop-up and looping demo videos read this instead of starting timers.
export function useCalmMotion(): boolean {
  const { on } = useEasyRead();
  const [reduced, setReduced] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setReduced(mq.matches);
    const onChange = (e: MediaQueryListEvent) => setReduced(e.matches);
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);
  return on || reduced;
}
```

`useState` and `useEffect` are already imported in this file.

- [ ] **Step 2: Fix the returning-visitor flash (existing bug).** In `EasyReadProvider` today the hydrate effect queues `setOnState(true)`, but the mirror effect runs in the same commit with `on=false` and writes `data-easy-read="off"` and localStorage `"off"` before flipping back. Every returning Easy Read visitor sees the standard page flash. Add a `ready` flag so the mirror effect only writes after hydration:

```tsx
const [on, setOnState] = useState(false);
// The inline <head> script already set data-easy-read for first paint.
// Don't mirror state back until localStorage has been read, or the first
// commit (on=false) would overwrite "on" with "off" and flash the page.
const [ready, setReady] = useState(false);

useEffect(() => {
  try {
    const stored = window.localStorage.getItem(STORAGE_KEY);
    // eslint-disable-next-line react-hooks/set-state-in-effect
    if (stored === "on") setOnState(true);
  } catch {
    // localStorage may be unavailable (private mode, etc.) — ignore
  }
  setReady(true);
}, []);

useEffect(() => {
  if (!ready || typeof document === "undefined") return;
  document.documentElement.dataset.easyRead = on ? "on" : "off";
  try {
    window.localStorage.setItem(STORAGE_KEY, on ? "on" : "off");
  } catch {
    // localStorage may be unavailable — ignore
  }
}, [on, ready]);
```

Keep the existing comments above these effects, updated to match.

- [ ] **Step 3: Typecheck.** Run `npx tsc --noEmit -p .`. Expected: no errors.

- [ ] **Step 4: Commit.** Run `git add lib/easy-read.tsx` and commit with `feat(easy-read): useCalmMotion hook; stop the returning-visitor flash`.

### Task 2: Easy Read CSS layer

**Files:**
- Modify: `app/globals.css`. Append directly after the existing `.er-only` / `.er-hide` rules (currently lines 41–47).

- [ ] **Step 1: Append this block**

```css
/* ─── Easy Read mode ──────────────────────────────────────────────────
   Applies on every page when the visitor turns Easy Read on
   (data-easy-read="on" on <html>, set before first paint). No per-page
   code needed: bigger text, calmer layout, nothing moving. Page
   summaries in plain English come from content/easy-read.json (see
   components/easy-read-summary.tsx). */

/* 1. Bigger text. Tailwind v4 text utilities read these theme
   variables, so this scales every text-xs/sm/base/lg/xl on the site.
   The biggest headings come down a little so they don't dominate. */
html[data-easy-read="on"] {
  --text-xs: 0.9375rem;   /* 12px -> 15px */
  --text-sm: 1.0625rem;   /* 14px -> 17px */
  --text-base: 1.1875rem; /* 16px -> 19px */
  --text-lg: 1.3125rem;   /* 18px -> 21px */
  --text-xl: 1.4375rem;   /* 20px -> 23px */
  --text-5xl: 2.75rem;    /* 48px -> 44px */
  --text-6xl: 3rem;       /* 60px -> 48px */
  scroll-behavior: auto;
}
html[data-easy-read="on"] :is([class*="text-[10px]"], [class*="text-[11px]"], [class*="text-[12px]"], [class*="text-[13px]"]) {
  font-size: var(--text-sm) !important;
}

/* 2. Easier to read: more space between lines, shorter lines, no ALL
   CAPS, no italics, normal letter spacing, underlined links in text. */
html[data-easy-read="on"] main :is(p, li, dd, label) { line-height: 1.7; }
html[data-easy-read="on"] main p { max-width: 70ch; }
html[data-easy-read="on"] main .text-center p { margin-inline: auto; }
html[data-easy-read="on"] .uppercase { text-transform: none; }
html[data-easy-read="on"] [class*="tracking-"] { letter-spacing: normal; }
html[data-easy-read="on"] :is(.italic, em, i, blockquote) { font-style: normal; }
html[data-easy-read="on"] main :is(p, li) a { text-decoration: underline; text-underline-offset: 3px; }
html[data-easy-read="on"] :focus-visible { outline: 3px solid var(--color-pi-accent); outline-offset: 3px; }

/* 3. Stronger text colour. Faded grey text becomes near-black and faded
   white text on dark panels becomes solid white. The selectors match a
   class at the start or after a space, so hover:/focus: variants such
   as "hover:text-pi-ink/80" are left alone. :where() keeps specificity
   low (0,1,1), so an element's own hover:text-… colour still wins on
   hover. */
html[data-easy-read="on"] :where([class^="text-pi-ink/"], [class*=" text-pi-ink/"]) {
  color: color-mix(in srgb, var(--color-pi-ink) 88%, transparent);
}
html[data-easy-read="on"] :where([class^="text-white/"], [class*=" text-white/"]) { color: #fff; }

/* 4. Nothing moves by itself. Spinners, the recording dot and the chat
   "thinking" dots keep moving because they tell the visitor something
   is happening. Fade-in-on-scroll blocks (AnimateIn) show straight away. */
html[data-easy-read="on"] *:not(.animate-spin, .animate-pulse, .animate-bounce),
html[data-easy-read="on"] *::before,
html[data-easy-read="on"] *::after {
  animation: none !important;
  scroll-behavior: auto !important;
}
html[data-easy-read="on"] [data-animate-in] {
  opacity: 1 !important;
  transform: none !important;
  transition: none !important;
}

/* 5. Shorter picture banners, so the page content (and its Easy Read
   summary) is on screen straight away. The top padding clears the
   fixed header (h-16 / md:h-20). */
html[data-easy-read="on"] [data-page-hero] { min-height: 0 !important; }
html[data-easy-read="on"] [data-page-hero-inner] {
  min-height: 0 !important;
  padding-top: 6.5rem !important;
  padding-bottom: 1.75rem !important;
}
/* Heroes that aren't PageHero (home, event and venue pages) — see Task 3
   Step 8. */
html[data-easy-read="on"] [data-hero-own] { min-height: 0 !important; height: auto !important; }

/* 6. The client logo ticker becomes a still, wrapped row (Task 3 Step 9
   stops rendering the duplicate set). */
html[data-easy-read="on"] [data-ticker] {
  width: auto !important;
  flex-wrap: wrap;
  justify-content: center;
  row-gap: 1.5rem;
}
```

Note: the arbitrary-size rule uses `!important`, so `text-[11px] md:text-base` becomes `--text-sm` at every width. That's intended; the Task 6 visual check includes the header and footer.

- [ ] **Step 2: Check Tailwind uses the variables.** Run `npm run build`. Then run:

```bash
grep -o 'text-xs{font-size:var(--text-xs)' .next/static/css/*.css | head -1 \
  || grep -rho '\.text-xs{[^}]*}' .next/static/ | head -1
```

Expected: `.text-xs` reads `font-size:var(--text-xs)`. If it uses a literal rem value instead, STOP and report. Part 1 of the CSS would then need a different approach.

- [ ] **Step 3: Commit.** Run `git add app/globals.css` and commit with `feat(easy-read): site-wide type, contrast and motion layer`.

### Task 3: Motion sources follow Easy Read

**Files:**
- Modify: `components/animate-in.tsx`. Add the attribute `data-animate-in=""` to the wrapping `<div ref={ref}>`. Nothing else changes, because CSS does the work.
- Modify: `components/page-hero.tsx`. Add `data-page-hero=""` to the outer `<section>`, and `data-page-hero-inner=""` to the content `<div className={\`section-padding relative z-10 ...\`}>`.
- Modify: `components/animated-counter.tsx`
- Modify: `components/review-carousel.tsx`
- Modify: `components/app-screenshot-carousel.tsx`. It has two auto-advance effects: around line 83 in `AppScreenshotCarousel` and around line 199 in `MobileScreenshotCarousel`.
- Modify: `components/scroll-video.tsx`
- Modify: `components/app-promo-banner.tsx`

- [ ] **Step 1: `animated-counter.tsx`.** Import `useCalmMotion` from `@/lib/easy-read`. Call `const calm = useCalmMotion();` and change the render to show the final number when calm:

```tsx
<span ref={ref}>
  {calm ? numericValue : count}
  <span className="text-pi-gold">{suffix}</span>
</span>
```

The interval may still run, which is harmless. The displayed value ignores it.

- [ ] **Step 2: `review-carousel.tsx`.** Import the hook. Then:

```tsx
const calm = useCalmMotion();
useEffect(() => {
  if (calm) return;
  const id = setInterval(next, 5000);
  return () => clearInterval(id);
}, [next, calm]);
```

- [ ] **Step 3: `app-screenshot-carousel.tsx`.** In both components add `const calm = useCalmMotion();`.
  - **`AppScreenshotCarousel`:** in the auto-advance effect use `if (paused || calm) return;` and add `calm` to the deps.
  - **`MobileScreenshotCarousel`:** use `if (userTookControl || calm) return;` and add `calm` to the deps.

- [ ] **Step 4: `scroll-video.tsx`.** Import the hook and add `const calm = useCalmMotion();`.
  - **In the effect:** when `calm` is true, don't create the IntersectionObserver. Call `el.pause()` and return a cleanup that only cancels the rAF loop. Add `calm` to the deps.
  - **On the `<video>`:** add `controls={calm}` and `loop={!calm}`, so Easy Read visitors press play themselves and it doesn't repeat forever.

- [ ] **Step 5: `app-promo-banner.tsx`.** Import the hook and add `const calm = useCalmMotion();`.
  - **In the scroll effect:** add `if (calm) return;` right after `if (hidden) return;`, and add `calm` to the deps.
  - **Before `return (`:** add `if (calm && !open) return null;`. That way it never pops up in Easy Read, and a banner that is already open still closes normally.

- [ ] **Step 6: Logo ticker (`components/logo-ticker.tsx`).** The desktop marquee (`flex w-max` + inline `animation: ticker-scroll`) would freeze at translateX(0) with the duplicate set and overflow logos cut off. Import the hook; `const calm = useCalmMotion();`; render `const allClients = calm ? clients : [...clients, ...clients];` and add `data-ticker=""` to the animated `<div className="flex w-max" …>`. The CSS from Task 2 §6 wraps it into a still, centred row. Leave `MobileLogoReveal` alone (it doesn't move by itself).

- [ ] **Step 7: Press kit demo videos (`app/press/pi-events-app/page.tsx`, ~line 226, `autoPlay muted loop`).** The page is a server component, so create `components/calm-video.tsx`:

```tsx
"use client";

// A muted demo <video> that autoplays and loops normally, but in Easy
// Read (or with reduced motion) stays paused with controls so the visitor
// chooses when to play it. The server render still has autoPlay, so we
// pause it after hydration if needed.
import { useEffect, useRef, type ComponentProps } from "react";
import { useCalmMotion } from "@/lib/easy-read";

export default function CalmVideo(props: ComponentProps<"video">) {
  const calm = useCalmMotion();
  const ref = useRef<HTMLVideoElement>(null);
  useEffect(() => {
    if (calm) ref.current?.pause();
  }, [calm]);
  return <video ref={ref} {...props} autoPlay={!calm && props.autoPlay} loop={!calm && props.loop} controls={calm || props.controls} />;
}
```

Replace each autoplaying `<video …>` on that page with `<CalmVideo …>` (same props). Do not touch `components/assistant.tsx:89` (that video starts on the visitor's tap).

- [ ] **Step 8: Venue events carousel nudge (`app/venues/_components/venue-events-carousel.tsx`, ~lines 89–100).** It runs a `setTimeout` scroll "nudge" to hint it scrolls. Import the hook, `const calm = useCalmMotion();`, skip the nudge when `calm` (early return in that effect, add `calm` to deps).

- [ ] **Step 9: Heroes that aren't `PageHero`.** Add `data-hero-own=""` to the tall hero section in `app/page.tsx` (~line 93, `min-h-[72vh]`), `app/events/[slug]/page.tsx` (~line 209, `h-[55vh] min-h-[420px]`, and its mobile hero if separate) and the hero in `app/venues/[slug]/page.tsx`. Task 2's CSS sets `min-height:0; height:auto` on them in Easy Read. **Check each one in the browser (Task 6):** if a hero's text is absolutely positioned and the hero collapses to nothing with `height:auto`, instead give that element `data-hero-cap=""` and add to globals.css `html[data-easy-read="on"] [data-hero-cap] { min-height: 0 !important; height: 40vh !important; }`. Report which you used.

- [ ] **Step 10: Lint and typecheck.** Run `npx tsc --noEmit -p . && npx eslint` on every file touched in this task. Expected: no errors. Warnings that were already there are fine.

- [ ] **Step 11: Commit.** Stage the touched files explicitly and commit with `feat(easy-read): carousels, counters, ticker, pop-up and demo videos stay still`.

### Task 4: The toggle is findable on phones

**Files:**
- Modify: `components/easy-read-toggle.tsx` (full replacement below)
- Modify: `components/mobile-nav.tsx`. In the CTA footer `<div className="px-6 pb-10 pt-4 ...">`, add `<EasyReadToggle variant="menu" />` above the CTA `<Link>`, wrapped in `<div className="mb-3">`.

- [ ] **Step 1: Replace `components/easy-read-toggle.tsx`**

```tsx
"use client";

// Easy Read toggle. Two places:
//   - "pill" (header): icon + the words "Easy Read" on every screen size.
//     An icon alone wasn't recognisable, and the people who need this
//     most are the least likely to guess what an eye symbol means.
//   - "menu" (mobile menu): a full-width row that says On / Off.
// The accessible name says the current state so screen readers announce
// "Easy Read is on" / "Easy Read is off".

import { BookOpen, Check } from "lucide-react";
import { useEasyRead } from "@/lib/easy-read";

interface Props {
  variant?: "pill" | "menu";
}

export default function EasyReadToggle({ variant = "pill" }: Props) {
  const { on, toggle } = useEasyRead();
  const label = on ? "Easy Read is on. Tap to turn it off." : "Easy Read is off. Tap to turn it on.";

  if (variant === "menu") {
    return (
      <button
        type="button"
        onClick={toggle}
        aria-pressed={on}
        aria-label={label}
        className="flex w-full items-center justify-between rounded-2xl border border-white/20 px-5 py-4 text-left text-base font-semibold text-white transition hover:bg-white/10"
      >
        <span className="flex items-center gap-3">
          <BookOpen size={22} aria-hidden="true" />
          Easy Read
        </span>
        <span className={`rounded-full px-3 py-1 text-sm ${on ? "bg-pi-accent text-white" : "bg-white/10 text-white"}`}>
          {on ? "On" : "Off"}
        </span>
      </button>
    );
  }

  return (
    <button
      type="button"
      onClick={toggle}
      aria-pressed={on}
      aria-label={label}
      className={`inline-flex items-center gap-1.5 whitespace-nowrap rounded-full border px-2.5 py-1.5 text-xs font-semibold transition sm:px-3.5 sm:text-sm ${
        on
          ? "border-pi-accent bg-pi-accent text-white shadow-sm"
          : "border-pi-ink/20 bg-white text-pi-ink hover:border-pi-accent/40 hover:bg-pi-accent/5"
      }`}
    >
      {on ? <Check size={16} aria-hidden="true" /> : <BookOpen size={16} aria-hidden="true" />}
      Easy Read
    </button>
  );
}
```

- [ ] **Step 2:** `components/nav-inner.tsx` renders `<EasyReadToggle />`, which now defaults to "pill". Search for other uses with `grep -rn "EasyReadToggle" app components`, and update any `variant="compact"` / `variant="full"` to `"pill"`.

- [ ] **Step 3: Lint, typecheck and commit.** Run the same commands as in Task 3, then commit with `feat(easy-read): toggle shows its name on phones and sits in the mobile menu`.

### Task 5: PIPA answers in Easy Read

**Files:**
- Modify: `lib/api-schemas.ts` (`ChatBodySchema`, about line 352)
- Modify: `app/api/chat/route.ts` (where `audience` is read, about line 311, and the `system:` string, about line 401)
- Modify: `components/assistant.tsx` (the transport, about line 334)

- [ ] **Step 1: Schema.** Add `easyRead: z.boolean().optional(),` to `ChatBodySchema` after `audience`.

- [ ] **Step 2: Route.**
  - **Read the flag:** `const { audience, easyRead } = parsed.data;`
  - **Add this constant** near `audienceContext`:

```ts
// Appended when the visitor has Easy Read on. Changes how PIPA writes,
// not what it knows or the rules above.
const EASY_READ_BLOCK = `

## Easy Read mode
This visitor has Easy Read turned on. Write every reply in Easy Read:
- Short sentences. Aim for 10 words or fewer. One idea per sentence.
- Everyday words. If you must use a hard word, explain it straight away.
- No idioms, jokes or figures of speech.
- Put the most important thing first.
- Use a numbered list for steps.
- Keep the reply short: 5 sentences or fewer unless they ask for more.
- Write numbers as digits.`;
```

  - **Use it in the system prompt:** ``system: `${knowledge}\n\n${audienceBlock}${easyRead ? EASY_READ_BLOCK : ""}`,``

- [ ] **Step 3: Client.** In `assistant.tsx`:
  - **Import:** `useEasyRead` from `@/lib/easy-read`.
  - **Keep a ref in sync** with the flag:

```tsx
const { on: easyRead } = useEasyRead();
const easyReadRef = useRef(false);
useEffect(() => {
  easyReadRef.current = easyRead;
}, [easyRead]);
```

  - **Send it:** change the transport body to `body: () => ({ audience: audienceRef.current, easyRead: easyReadRef.current }),`

- [ ] **Step 4: Lint, typecheck and commit.** Commit with `feat(assistant): PIPA writes in Easy Read when the mode is on`.

### Task 6: Chunk 1 verification

- [ ] **Step 1: Build and lint.** Run `npx tsc --noEmit -p . && npm run lint && npm run build`. Expected: the build passes. Lint shows no new errors.
- [ ] **Step 2: Start the dev server.** Run `npx next dev -p 3014` in the background.
- [ ] **Step 3: Check four pages in the browser.**
  - **Pages:** `/about/`, `/festivals/`, `/events/` and `/deaf-community/`, with Easy Read on.
  - **How to turn it on:** click the header toggle, or set it in the page with `localStorage.setItem('pi-easy-read','on')` and reload.
  - **Confirm:**
    - text is visibly bigger
    - no ALL CAPS labels
    - the hero banner is short
    - carousels don't advance after 10 seconds
    - the app pop-up doesn't appear after scrolling past 500px
    - the toggle reads "Easy Read"
  - **Then turn Easy Read off** and confirm the pages look exactly as before.
- [ ] **Step 4: PIPA.** With Easy Read on, ask "how do I get an interpreter at a concert?". The reply should be short sentences.
- [ ] **Step 5: Stop the dev server.** Don't commit `AGENTS.md`.

---

## Chunk 2: Easy Read summaries on every page

### Task 7: Easy Read wording checker (test first)

**Files:**
- Create: `scripts/check-easy-read.mjs`
- Create: `scripts/check-easy-read.test.mjs`
- Modify: `package.json`, adding to `scripts` only: `"check:easy-read": "node scripts/check-easy-read.mjs"`

**Rules the checker enforces.** Each one comes from the Mencap / gov.uk Easy Read guidance.

- **Shape of the file:** every key starts with `/`. Each entry has `title` (≤ 6 words) and `points` (2–6 items). Each point has `icon` (non-empty) and `text`.
- **Sentences:** `text` has 1–3 sentences. Sentences split on `.`, `!` or `?` followed by a space or the end. Every sentence in `title`, `text` and action `label` has ≤ 15 words.
- **Actions:** `actions` is optional, with ≤ 2 items. Each `label` has ≤ 5 words. Each `href` starts with `/`, `https://`, `mailto:` or `tel:`.
- **Signed video:** `signed` is optional. If present it needs a `label`, plus either a `videoKey` from this list or a `bslUrl` / `islUrl` starting with `https://`. The list mirrors `lib/sign-videos.ts`, so keep the two in sync: `how-to-book`, `know-rights`, `orientation`, `categories`, `search`, `request`, `booking`, `faqs`, `tips`, `at-event`, `notifications`, `volunteer`.
- **Banned in any string** (case-insensitive): `\bspeak(s|ing)?\b`, `\butili[sz]e`, `\bfacilitate`, `\bensure\b`, `\bleverage`, `\bseamless`, `\bin order to\b`, `\bprior to\b`, `\be\.g\.`, `;`.
- **Coverage.** This check is skipped when a file path argument is given. Every static page route must have an entry: each `app/**/page.tsx` path without a `[` segment, mapped to its route (`app/page.tsx` → `/`, `app/about/page.tsx` → `/about`). The exceptions are `/qr` and anything under `/api`.
- **Output and exit code:** print one line per problem, `route: problem`. Exit 1 if there are any problems. Otherwise print `easy-read: N pages OK` and exit 0.

- [ ] **Step 1: Write the failing test** in `scripts/check-easy-read.test.mjs`:

```js
import { test } from "node:test";
import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import { mkdtempSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";

const run = (data) => {
  const dir = mkdtempSync(join(tmpdir(), "er-"));
  const file = join(dir, "er.json");
  writeFileSync(file, JSON.stringify(data));
  return spawnSync(process.execPath, ["scripts/check-easy-read.mjs", file], { encoding: "utf8" });
};

const good = {
  "/about": {
    title: "About us",
    points: [
      { icon: "👋", text: "We are Performance Interpreting." },
      { icon: "🎤", text: "We bring BSL to live events." },
    ],
    actions: [{ label: "Find an event", href: "/events" }],
  },
};

test("passes good wording", () => {
  const r = run(good);
  assert.equal(r.status, 0, r.stdout + r.stderr);
});

test("fails a long sentence", () => {
  const bad = structuredClone(good);
  bad["/about"].points[0].text =
    "We are a company that has been providing interpreters for a very long time to many venues.";
  const r = run(bad);
  assert.equal(r.status, 1);
  assert.match(r.stdout, /\/about: .*words/);
});

test("fails banned words and too many actions", () => {
  const bad = structuredClone(good);
  bad["/about"].points[1].text = "We speak your language.";
  bad["/about"].actions.push({ label: "A", href: "/a" }, { label: "B", href: "/b" });
  const r = run(bad);
  assert.equal(r.status, 1);
  assert.match(r.stdout, /speak/);
  assert.match(r.stdout, /actions/);
});

test("fails an unknown video key", () => {
  const bad = structuredClone(good);
  bad["/about"].signed = { videoKey: "nope", label: "Watch" };
  const r = run(bad);
  assert.equal(r.status, 1);
  assert.match(r.stdout, /videoKey/);
});
```

- [ ] **Step 2: Run it and confirm it fails.** Run `node --test scripts/check-easy-read.test.mjs`. Expected: FAIL, because the script doesn't exist yet.
- [ ] **Step 3: Write `scripts/check-easy-read.mjs`** implementing the rules above. Use plain Node, no dependencies, and a short header comment saying what it checks and how to run it. Import `process` from `node:process` (and use `node:` imports throughout) so ESLint's flat config doesn't flag `no-undef`; run `npx eslint scripts/` and fix anything it reports.
- [ ] **Step 4: Run the tests and confirm they pass.** Run `node --test scripts/check-easy-read.test.mjs`. Expected: 4 pass.
- [ ] **Step 5: Commit.** Stage the 2 scripts and `package.json`, then commit with `feat(easy-read): wording checker for Easy Read copy`.

### Task 8: `SignedClip` component (generalise the events BSL video)

**Files:**
- Create: `components/signed-clip.tsx`
- Modify: `app/events/_components/bsl-help-video.tsx`. It becomes a thin wrapper, and the events page must look and behave exactly as now.

- [ ] **Step 1: Create `components/signed-clip.tsx`.**
  - **Starting point:** move the full player from `bsl-help-video.tsx`. That includes the collapsed button, the BSL/ISL switch, the custom scrubber, the play overlay and the help line.
  - **Props:** `{ label: string; videoKey?: VideoKey; bslUrl?: string; islUrl?: string }`.
  - **Choosing the video URL:** use `bslUrl ?? getSignVideo(videoKey, "BSL")?.src`, and likewise for ISL. `getSignVideo(key, language)` is in `lib/sign-videos.ts`.
  - **Language switch:** show the BSL/ISL switch only when both URLs exist. When only one exists, use it and hide the switch.
  - **Text:** the button's second line is `label`. The `aria-label` on the `<video>` is `` `${label}, in ${language}` ``.
  - **Ids:** generate the panel id with `useId()`, because more than one clip can be on a page.
  - **When neither URL resolves:** return `null`.
  - **Header comment:** copy the existing one from `bsl-help-video.tsx` (R2 hosting, no native controls because they cover the signer's hands).
- [ ] **Step 2: Replace `bsl-help-video.tsx`:**

```tsx
"use client";

// BSL & ISL "how to search" intro on /events. The player lives in
// components/signed-clip.tsx so Easy Read summaries can reuse it.
import SignedClip from "@/components/signed-clip";

export default function BslHelpVideo() {
  return <SignedClip videoKey="search" label="How to find your event" />;
}
```

- [ ] **Step 3: Lint, typecheck and commit.** Commit with `refactor(events): signed clip player shared via components/signed-clip`.

### Task 9: Summary types, loader and component

**Files:**
- Modify: `lib/types.ts`. Append the interfaces below.
- Modify: `lib/content.ts`. Add the loader below, and add `EasyReadPage` to the type import.
- Create: `components/easy-read-summary.tsx`
- Create: `content/easy-read.json`. Start with `{}`. Task 10 fills it.

- [ ] **Step 1: Types (`lib/types.ts`)**

```ts
// ─── Easy Read summaries (content/easy-read.json + lib/easy-read-auto.ts)
export interface EasyReadPoint {
  /** An emoji, or a path under /public (e.g. /icons/easy-read/bsl-interpreter.png).
   *  Image paths containing "-white" are drawn on a dark circle. */
  icon: string;
  text: string;
}
export interface EasyReadAction {
  label: string;
  href: string;
  style?: "primary" | "secondary";
}
export interface EasyReadSigned {
  label: string;
  /** A clip from the existing catalogue in lib/sign-videos.ts. */
  videoKey?: import("./sign-videos").VideoKey;
  /** Or our own signed intro for this page, once it's filmed. */
  bslUrl?: string;
  islUrl?: string;
}
export interface EasyReadPage {
  title: string;
  points: EasyReadPoint[];
  actions?: EasyReadAction[];
  signed?: EasyReadSigned;
}
```

- [ ] **Step 2: Loader (`lib/content.ts`)**

```ts
export const getEasyRead = (route: string): EasyReadPage | undefined =>
  load<Record<string, EasyReadPage>>("easy-read.json")[route];
```

- [ ] **Step 3: Create `components/easy-read-summary.tsx`.** It is a server component, with no `"use client"`.
  - **Wrapper:** an `er-only` `<section>` placed right after the page hero. It is hidden unless Easy Read is on, and it is rendered on the server, so it is visible on first paint for returning Easy Read users.
  - **Box:** use the classes `mx-auto max-w-3xl rounded-3xl border-2 border-pi-accent/30 bg-white p-6 shadow-sm md:p-8`, inside a `section-padding pt-8 pb-2` wrapper.
  - **Heading:** an eyebrow `<p>` reading "This page in Easy Read" (`text-base font-semibold text-pi-accent`), then an `<h2>` with `page.title` (`mt-1 font-display text-3xl leading-tight text-pi-ink`).
  - **Points:** a `<ul className="mt-6 space-y-5">`. Each `<li className="flex items-start gap-4">` has a picture on the left and text on the right, as in Mencap's layout.
    - **The picture** is a `h-14 w-14 shrink-0 rounded-2xl` box. For an emoji icon it has `bg-pi-accent/10 text-3xl` and is `aria-hidden`. For an image icon (one starting with `/`) it is an `<img alt="" className="h-10 w-10 object-contain">` on `bg-pi-accent/10`, or on `bg-pi-navy` when the path contains `-white`.
    - **The text** is `<span className="pt-2.5 text-xl leading-relaxed text-pi-ink">`.
  - **Signed video:** if `page.signed` is set, render `<div className="mt-8"><SignedClip {...page.signed} /></div>`.
  - **Actions:** if present, render a `<div className="mt-8 flex flex-col gap-3 sm:flex-row sm:flex-wrap">`.
    - **Primary style** (the default for the first action): `inline-flex items-center justify-center rounded-full bg-pi-accent px-7 py-3.5 text-lg font-bold text-white hover:brightness-110`.
    - **Secondary style:** `inline-flex items-center justify-center rounded-full border-2 border-pi-accent px-7 py-3 text-lg font-semibold text-pi-accent hover:bg-pi-accent/10`.
    - **Links:** internal hrefs (starting with `/`) use `next/link`. Anything else uses `<a>`. `https://` links also get `target="_blank" rel="noopener noreferrer"`.
  - **Footer line:** `<p className="mt-8 border-t border-pi-ink/10 pt-5 text-lg text-pi-ink">The full page is below. It has more detail.</p>`
  - **Props:** `{ page: EasyReadPage | undefined }`. Return `null` when `page` is undefined.
  - **Header comment:** say where the copy lives, and that wording is checked with `npm run check:easy-read`.
- [ ] **Step 4: Lint, typecheck and commit.** Commit with `feat(easy-read): summary box component and content loader`.

### Task 10: The wording (`content/easy-read.json`)

**Owner:** the planning model (Opus) drafts or reviews. This is a judgment task, not a mechanical one.

**Routes:** `/`, `/about`, `/accessibility`, `/app-guide`, `/app-privacy`, `/contact`, `/deaf-community`, `/events`, `/events/request`, `/festivals`, `/get-app/choose`, `/interpreters`, `/organisers`, `/press`, `/press/pi-events-app`, `/privacy`, `/sports`, `/testimonials`, `/venues`.

**Writing rules** (the checker enforces the mechanical ones):

- **Write from the page.** Every fact comes from that page's current content. No new claims, numbers, prices or promises.
- **Shape:** 3–6 points, most important first. One idea per sentence, and ≤ 15 words per sentence (aim for 10).
- **Voice:** use "we" (Performance Interpreting) and "you" (the visitor). Active verbs, everyday words, digits for numbers.
- **Hard words:** explain any you must use in the same point. Example: "BSL means British Sign Language."
- **Pictures:** each point gets one emoji whose literal meaning matches the sentence. Don't use hand-sign emoji (🤟👌🖐) for signing, because they show ASL or gestures, not BSL. For "a BSL interpreter" use `/icons/easy-read/bsl-interpreter.png` (added in Task 12).
- **Actions:** 1–2, verb first ("Find an event", "Ask for an interpreter", "Send us a message").
- **Deaf-audience wording:** no "speak". Lipreaders are "people who lipread". Don't lead with royal events.
- **Legal pages** (privacy, app-privacy, accessibility): say plainly what we collect, why, and the visitor's main right ("You can ask us to delete your information."). Name who to contact.
- **Signed clips where they fit:**
  - `/events/request` → `request`
  - `/deaf-community` → `orientation`
  - `/app-guide` → `orientation`
  - `/accessibility` → `know-rights`
  - `/festivals` and `/sports` → `at-event`
  - `/events` → none, because the page already has the search clip.

- [ ] **Step 1: Draft** the entries for all routes. Read each page's actual content first.
- [ ] **Step 2: Check.** Run `npm run check:easy-read`. Expected: `easy-read: 19 pages OK`. Fix and re-run until it passes.
- [ ] **Step 3: Read aloud.** The reviewer reads every entry as a visitor with a reading age of about 9 would, and checks every fact against its page.
- [ ] **Step 4: Commit.** Commit with `content(easy-read): plain-English summaries for 19 pages`.

### Task 11: Put the summaries on the pages

**Files:** each static page in Task 10.

**Pattern:**

```tsx
import EasyReadSummary from "@/components/easy-read-summary";
import { getEasyRead } from "@/lib/content";
// …
<EasyReadSummary page={getEasyRead("/about")} />
```

**Where it goes:**

- **Pages with a `PageHero`:** directly after it.
- **Pages without one:** as the first thing inside the page's root fragment.
- **Client-component pages:** check for `"use client"` at the top of the page file. If it's there, call `getEasyRead` in a server parent, or pass the data in as props. Report any such page instead of guessing.

**Pages that already have Easy Read blocks.** They follow James's decision: the full page stays below.

- **Unwrapping `er-hide contents`:** delete the opening `<div className="er-hide contents">` AND its matching closing `</div>` (it's near the end of the page's JSX — find it by matching indentation/comments, then confirm with `npx tsc --noEmit -p .`). Keep everything between them.
- **`app/page.tsx`:** remove the `er-only` section (lines ~35–87) and unwrap the `<div className="er-hide contents">` wrapper around the standard page, keeping its children. Put `<EasyReadSummary page={getEasyRead("/")} />` directly AFTER the hero section, not above it — the header is transparent with a white logo at the top of the page, so a white box above the hero would hide the logo. The removed block's links (Find an event, Ask for an interpreter, email, contact) must appear in the `/` JSON entry.
- **`app/deaf-community/page.tsx`:** same. Remove the `er-only` "Welcome" section and unwrap the `er-hide contents` wrapper. Insert the summary after the hero. The 3 steps and the app store buttons are covered by JSON points and actions. App store links are external `https://` actions; copy the URLs from `components/app-store-buttons.tsx`.
- **`app/contact/page.tsx`:** replace the `er-only` intro with the summary, and remove the `er-hide` from the enquiry cards.
- **`app/events/request/page.tsx`:** add the summary after the hero. Keep `request-intro.tsx`. Its Easy Read steps are good and stay.
- **`app/events/page.tsx`:** add the summary after the hero. `events-filter.tsx` keeps its Easy Read tweaks.

- [ ] **Step 1:** Wire all 19 pages.
- [ ] **Step 2: Check for leftovers.** Run `grep -rn 'er-only\|er-hide' app components`. Expected: only `globals.css` rules, `components/easy-read-summary.tsx`, and any remaining intentional uses in `events-filter.tsx`. List anything else.
- [ ] **Step 3:** Run `npx tsc --noEmit -p . && npm run lint && npm run check:easy-read`.
- [ ] **Step 4: Commit.** Commit with `feat(easy-read): summaries on every page, full page kept below`.

### Task 12: Summaries built from data (events, venues, cities)

**Files:**
- Create: `lib/easy-read-auto.ts`. Pure functions only, with type-only imports (so Node can strip types).
- Create: `scripts/easy-read-auto.test.mjs`
- Create: `public/icons/easy-read/bsl-interpreter.png` and `public/icons/easy-read/isl-interpreter-white.png`, resized from PI's own sign icons (never generated or stock — those draw ASL): `mkdir -p public/icons/easy-read && sips -Z 160 ../../../Logos/bsl-interpreter-logo.png --out public/icons/easy-read/bsl-interpreter.png && sips -Z 160 ../../../Logos/isl-interpreter-logo-white.png --out public/icons/easy-read/isl-interpreter-white.png`. **Do this first** — Task 10's wording already uses the BSL icon.
- Modify: `app/events/[slug]/page.tsx`, `app/venues/[slug]/page.tsx` and `app/events/in/[city]/page.tsx`. Insert `<EasyReadSummary page={…} />` after each page's header or hero.

- [ ] **Step 1: Write the failing test** in `scripts/easy-read-auto.test.mjs`. Run it with `node --test --experimental-strip-types scripts/easy-read-auto.test.mjs`. It imports `../lib/easy-read-auto.ts` and covers:
  - **Booked BSL event:** the points include the event name, `"It is on Sunday 15 November 2026."`, the venue and city, and `"A BSL interpreter is booked."` with the bsl-interpreter image icon. The first action is "Book tickets", linking to `eventUrl` when it starts with `https://`.
  - **On-request event:** says `"No interpreter is booked yet. You can ask for one."`. The first action is "Ask for an interpreter", linking to `/events/request?event=…&venue=…&date=…` with URL-encoded values. These are the params the request page reads.
  - **Time:** `"It starts at 7:30pm."` when `time` is set. No time sentence when `time` is empty or contains "TBC".
  - **Language:** ISL uses the isl-interpreter-white icon and "An ISL interpreter is booked.". BSL_AND_ISL gives "BSL and ISL interpreters are booked.".
  - **Sold out:** sold-out events add `{ icon: "⚠️", text: "Tickets are sold out." }`.
  - **City pages:** `cityEasyRead("Leeds", 3)` gives a title of "Events in Leeds" and the point "There are 3 events with BSL or ISL here.". With 1 event it says "There is 1 event with BSL or ISL here.".
- [ ] **Step 2: Run it** and confirm it FAILS, because the module is missing.
- [ ] **Step 3: Implement `lib/easy-read-auto.ts`.**
  - **Exports:** `eventEasyRead(ev: Pick<Event, "name"|"isoDate"|"time"|"venue"|"city"|"language"|"interpreterStatus"|"soldOut"|"eventUrl">)`, `cityEasyRead(city: string, count: number)` and `venueEasyRead(v)`. All return `EasyReadPage`.
  - **Dates:** format with `toLocaleDateString("en-GB", { timeZone: "UTC", weekday: "long", day: "numeric", month: "long", year: "numeric" })` and strip the comma.
  - **Venues:** first read `app/venues/[slug]/page.tsx` to find the venue data shape. Points are the venue name and city, "You can contact their access team." if an email or phone exists, and "You can ask us for an interpreter here.". The actions are the first of email (`mailto:`) or phone (`tel:`), plus "Ask for an interpreter" (`/events/request?venue=…`).
- [ ] **Step 4: Run the test** and confirm it PASSES.
- [ ] **Step 5: Wire the 3 dynamic pages.** Then run `npx tsc --noEmit -p . && npm run lint`.
- [ ] **Step 6: Commit.** Commit with `feat(easy-read): event, venue and city summaries built from data`.

### Task 13: Accessibility statement and editing guide

- [ ] **Step 1: Accessibility statement.** In `content/pages/accessibility.json`, add a section headed "Easy Read mode". Use the same section shape as its neighbours. Its standard copy covers:
  - what Easy Read does: bigger text, plain-English summary at the top of each page, nothing moving, PIPA writes simply
  - how to turn it on: the "Easy Read" button at the top of every page, or in the menu on phones
  - that the setting is remembered on this device
  - that the summaries are new and we welcome feedback through the contact page
- [ ] **Step 2: Editing guide.** In `EDITING-GUIDE.md`, add a short "Easy Read wording" section:
  - the copy is in `content/easy-read.json`, one entry per page
  - the rules are in `scripts/check-easy-read.mjs`
  - run `npm run check:easy-read` before pushing
  - event, venue and city pages build their own summaries
- [ ] **Step 3: Commit.** Commit with `docs(easy-read): accessibility statement and editing guide`.

### Task 14: Final verification, then ship

- [ ] **Step 1: Run every check.** Run `node --test scripts/check-easy-read.test.mjs && node --test --experimental-strip-types scripts/easy-read-auto.test.mjs && npm run check:easy-read && npx tsc --noEmit -p . && npm run lint && npm run build`. All must pass.
- [ ] **Step 2: Browser check.** Use the dev server with Easy Read on, at desktop width and at 390px phone width.
  - **Pages:** `/`, `/events/`, one event page, `/events/request/`, `/deaf-community/`, `/festivals/`, `/privacy/` and one venue page.
  - **Confirm:**
    - the summary appears under the hero
    - icons line up with the text
    - the signed clip plays in BSL and switches to ISL
    - action buttons work
    - the full page follows
    - no horizontal scroll at 390px
    - the header toggle fits next to the menu button at 390px
  - **Then turn Easy Read off** and confirm the summary boxes are gone and the pages are unchanged.
- [ ] **Step 3: Final review.** The planning model reviews the full diff with a three-way verdict: ship / correct / redo.
- [ ] **Step 4: Ship.** Merge `feat/easy-read-sitewide` into `main` with a fast-forward or merge commit, from the main checkout. Push `origin main`, then confirm the live site serves the new markup: the summary `er-only` section is in the `/about/` HTML.
- [ ] **Step 5: Ledger.** Add a PI ledger item: "Marie: review Easy Read wording on the website (content/easy-read.json, shipped 13 Nov)".
