#!/usr/bin/env node
// Extract venue data from the standalone app's app.js into a JSON file the
// website can consume. Re-run whenever the app's venue tables change.
//
// Usage: node scripts/sync-venue-data.mjs

import { readFileSync, writeFileSync, copyFileSync, mkdirSync, existsSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const PROJECT = resolve(__dirname, "..");
const APP_JS = resolve(
  PROJECT,
  "../Events-App/pi-events-standalone-app/public/app.js"
);
const APP_ICONS = resolve(
  PROJECT,
  "../Events-App/pi-events-standalone-app/public/icons"
);
const OUT_DATA = resolve(PROJECT, "lib/venue-data.json");
const OUT_ICONS = resolve(PROJECT, "public/access-icons");

function extractDeclaration(source, name) {
  const startMarker = `const ${name} = {`;
  const start = source.indexOf(startMarker);
  if (start === -1) throw new Error(`Could not find: ${name}`);

  let depth = 0;
  let i = start + startMarker.length - 1;
  for (; i < source.length; i++) {
    const ch = source[i];
    if (ch === "{") depth++;
    else if (ch === "}") {
      depth--;
      if (depth === 0) return source.slice(start, i + 1) + ";";
    }
  }
  throw new Error(`Unbalanced braces for: ${name}`);
}

function evaluateSnippet(snippet) {
  const fn = new Function(`${snippet}\nreturn arguments[0];`);
  // We rebuild as an expression: rewrite `const X = {...};` → return X
  const match = snippet.match(/^const (\w+) = ([\s\S]+);\s*$/);
  if (!match) throw new Error("Cannot parse declaration");
  const [, name, expr] = match;
  return new Function(`return ${expr};`)();
}

const ICONS = [
  "access-parking.png",
  "access-toilets.png",
  "access-viewing.png",
  "assist-dogs.png",
  "assistive-listening.png",
  "changing-places.png",
  "closed-captions.png",
  "PA-companion.png",
  "quiet-rooms.png",
  "step-free-access.png",
  "visual-alarms.png",
  "wheelchair-access.png",
];

function main() {
  if (!existsSync(APP_JS)) {
    throw new Error(`Source app.js not found: ${APP_JS}`);
  }

  const source = readFileSync(APP_JS, "utf-8");

  const tables = [
    "ACCESS_FEATURE_DEFS",
    "VENUE_ACCESS_FEATURES",
    "VENUE_DETAILS",
    "VENUE_CONTACTS",
  ];

  const out = {};
  for (const name of tables) {
    const snippet = extractDeclaration(source, name);
    out[name] = evaluateSnippet(snippet);
    const count = Object.keys(out[name]).length;
    console.log(`  ${name}: ${count} entries`);
  }

  writeFileSync(OUT_DATA, JSON.stringify(out, null, 2) + "\n", "utf-8");
  console.log(`Wrote ${OUT_DATA}`);

  if (!existsSync(OUT_ICONS)) mkdirSync(OUT_ICONS, { recursive: true });
  for (const icon of ICONS) {
    const src = join(APP_ICONS, icon);
    const dst = join(OUT_ICONS, icon);
    if (!existsSync(src)) {
      console.warn(`  missing icon: ${icon}`);
      continue;
    }
    copyFileSync(src, dst);
  }
  console.log(`Copied ${ICONS.length} icons to ${OUT_ICONS}`);
}

main();
