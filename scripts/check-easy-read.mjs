// Checks the Easy Read wording in content/easy-read.json against the
// Mencap / gov.uk Easy Read rules (short sentences, few points, plain words).
// Run: npm run check:easy-read   (or: node scripts/check-easy-read.mjs [file])
// With a file argument the page-coverage check is skipped (used by tests).
import { existsSync, readdirSync, readFileSync, statSync } from "node:fs";
import { join, relative, sep } from "node:path";
import process from "node:process";

// Mirrors VideoKey in lib/sign-videos.ts. Keep the two in sync.
const VIDEO_KEYS = [
  "how-to-book", "know-rights", "orientation", "categories", "search", "request",
  "booking", "faqs", "tips", "at-event", "notifications", "volunteer",
];
const BANNED = [
  /\bspeak(s|ing)?\b/i, /\butili[sz]e/i, /\bfacilitate/i, /\bensure\b/i,
  /\bleverage/i, /\bseamless/i, /\bin order to\b/i, /\bprior to\b/i, /\be\.g\./i, /;/,
];
const HREF = /^(\/|https:\/\/|mailto:|tel:)/;
const EXCLUDED_ROUTES = new Set(["/qr"]);

const problems = [];
const fail = (route, msg) => problems.push(`${route}: ${msg}`);

const sentences = (s) => s.split(/(?<=[.!?])(?:\s+|$)/).filter((x) => x.trim());
const words = (s) => s.trim().split(/\s+/).filter(Boolean).length;

function checkSentences(route, where, s) {
  for (const sent of sentences(s)) {
    const n = words(sent);
    if (n > 15) fail(route, `${where} has a sentence of ${n} words (max 15): "${sent}"`);
  }
}

function checkBanned(route, where, s) {
  for (const re of BANNED) {
    if (re.test(s)) fail(route, `${where} contains banned wording ${re}: "${s}"`);
  }
}

function checkEntry(route, e) {
  if (!route.startsWith("/")) fail(route, "key must start with /");
  if (!e || typeof e !== "object") return fail(route, "entry must be an object");

  if (typeof e.title !== "string" || !e.title.trim()) fail(route, "missing title");
  else {
    if (words(e.title) > 6) fail(route, `title has ${words(e.title)} words (max 6)`);
    checkSentences(route, "title", e.title);
    checkBanned(route, "title", e.title);
  }

  if (!Array.isArray(e.points) || e.points.length < 2 || e.points.length > 6) {
    fail(route, `points must have 2 to 6 items (has ${Array.isArray(e.points) ? e.points.length : 0})`);
  }
  (Array.isArray(e.points) ? e.points : []).forEach((p, i) => {
    const w = `point ${i + 1}`;
    if (!p || typeof p.icon !== "string" || !p.icon.trim()) fail(route, `${w} missing icon`);
    if (!p || typeof p.text !== "string" || !p.text.trim()) return fail(route, `${w} missing text`);
    const n = sentences(p.text).length;
    if (n < 1 || n > 2) fail(route, `${w} has ${n} sentences (need 1 to 2)`);
    checkSentences(route, w, p.text);
    checkBanned(route, w, p.text);
  });

  if (e.actions !== undefined) {
    if (!Array.isArray(e.actions) || e.actions.length > 2) fail(route, "actions must have at most 2 items");
    (Array.isArray(e.actions) ? e.actions : []).forEach((a, i) => {
      const w = `action ${i + 1}`;
      if (typeof a?.label !== "string" || !a.label.trim()) return fail(route, `${w} missing label`);
      if (words(a.label) > 5) fail(route, `${w} label has ${words(a.label)} words (max 5)`);
      checkSentences(route, `${w} label`, a.label);
      checkBanned(route, `${w} label`, a.label);
      if (typeof a.href !== "string" || !HREF.test(a.href)) {
        fail(route, `${w} href must start with /, https://, mailto: or tel:`);
      }
    });
  }

  if (e.signed !== undefined) {
    const s = e.signed;
    if (typeof s?.label !== "string" || !s.label.trim()) fail(route, "signed needs a label");
    else checkBanned(route, "signed label", s.label);
    const urlOk = (u) => typeof u === "string" && u.startsWith("https://");
    if (s?.videoKey !== undefined && !VIDEO_KEYS.includes(s.videoKey)) {
      fail(route, `signed videoKey "${s.videoKey}" is not in the catalogue`);
    } else if (s?.videoKey === undefined && !urlOk(s?.bslUrl) && !urlOk(s?.islUrl)) {
      fail(route, "signed needs a videoKey, or a bslUrl / islUrl starting with https://");
    }
    for (const k of ["bslUrl", "islUrl"]) {
      if (s?.[k] !== undefined && !urlOk(s[k])) fail(route, `signed ${k} must start with https://`);
    }
  }
}

function pageRoutes(dir, out = []) {
  for (const name of readdirSync(dir)) {
    const p = join(dir, name);
    if (statSync(p).isDirectory()) pageRoutes(p, out);
    else if (name === "page.tsx") out.push(p);
  }
  return out;
}

function staticRoutes() {
  return pageRoutes("app")
    .map((f) => relative("app", f).split(sep).slice(0, -1))
    .filter((segs) => !segs.some((s) => s.includes("[")))
    .map((segs) => "/" + segs.join("/"))
    .filter((r) => !EXCLUDED_ROUTES.has(r) && r !== "/api" && !r.startsWith("/api/"));
}

const arg = process.argv[2];
const file = arg ?? "content/easy-read.json";

if (!existsSync(file)) {
  console.log(`easy-read: file not found: ${file}`);
  process.exit(1);
}

let data;
try {
  data = JSON.parse(readFileSync(file, "utf8"));
} catch (err) {
  console.log(`easy-read: ${file} is not valid JSON (${err.message})`);
  process.exit(1);
}

for (const [route, entry] of Object.entries(data)) checkEntry(route, entry);

if (!arg) {
  for (const r of staticRoutes()) if (!(r in data)) fail(r, "no Easy Read entry for this page");
}

if (problems.length) {
  console.log(problems.join("\n"));
  process.exit(1);
}
console.log(`easy-read: ${Object.keys(data).length} pages OK`);
