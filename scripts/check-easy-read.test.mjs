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
