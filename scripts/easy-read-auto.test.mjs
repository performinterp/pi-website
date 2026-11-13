import test from "node:test";
import assert from "node:assert/strict";
import { eventEasyRead, cityEasyRead, venueEasyRead } from "../lib/easy-read-auto.ts";

const base = {
  name: "Taylor Swift",
  isoDate: "2026-11-15",
  time: "",
  venue: "Wembley Stadium",
  city: "London",
  language: "BSL",
  interpreterStatus: "booked",
  soldOut: false,
  eventUrl: "https://tickets.example.com/x",
};
const texts = (p) => p.points.map((x) => x.text);

test("booked BSL event", () => {
  const p = eventEasyRead(base);
  const t = texts(p);
  assert.ok(t.some((x) => x.includes("Taylor Swift")));
  assert.ok(t.includes("It is on Sunday 15 November 2026."));
  assert.ok(t.some((x) => x.includes("Wembley Stadium") && x.includes("London")));
  const pt = p.points.find((x) => x.text === "A BSL interpreter is booked.");
  assert.equal(pt.icon, "/icons/easy-read/bsl-interpreter.png");
  assert.equal(p.actions[0].label, "Book tickets");
  assert.equal(p.actions[0].href, base.eventUrl);
});

test("on-request event", () => {
  const p = eventEasyRead({ ...base, interpreterStatus: "on-request", name: "A & B" });
  assert.ok(texts(p).includes("No interpreter is booked yet. You can ask for one."));
  assert.equal(p.actions[0].label, "Ask for an interpreter");
  assert.equal(
    p.actions[0].href,
    `/events/request?event=${encodeURIComponent("A & B")}&venue=${encodeURIComponent("Wembley Stadium")}&date=${encodeURIComponent("2026-11-15")}`,
  );
});

test("time sentence", () => {
  assert.ok(texts(eventEasyRead({ ...base, time: "7:30pm" })).includes("It starts at 7:30pm."));
  assert.ok(!texts(eventEasyRead(base)).some((x) => x.includes("starts at")));
  assert.ok(!texts(eventEasyRead({ ...base, time: "TBC" })).some((x) => x.includes("starts at")));
});

test("language", () => {
  const isl = eventEasyRead({ ...base, language: "ISL" });
  const pt = isl.points.find((x) => x.text === "An ISL interpreter is booked.");
  assert.equal(pt.icon, "/icons/easy-read/isl-interpreter-white.png");
  const both = eventEasyRead({ ...base, language: "BSL_AND_ISL" });
  const pb = both.points.find((x) => x.text === "BSL and ISL interpreters are booked.");
  assert.equal(pb.icon, "/icons/easy-read/bsl-interpreter.png");
});

test("sold out", () => {
  const p = eventEasyRead({ ...base, soldOut: true });
  assert.deepEqual(p.points.find((x) => x.text === "Tickets are sold out."), { icon: "⚠️", text: "Tickets are sold out." });
});

test("city pages", () => {
  const p = cityEasyRead("Leeds", 3);
  assert.equal(p.title, "Events in Leeds");
  assert.ok(texts(p).includes("There are 3 events with BSL or ISL here."));
  assert.ok(texts(cityEasyRead("Leeds", 1)).includes("There is 1 event with BSL or ISL here."));
});

test("venue pages", () => {
  const p = venueEasyRead({ name: "The O2", city: "London", email: "a@b.co" });
  assert.ok(texts(p).includes("You can contact their access team."));
  assert.equal(p.actions[0].href, "mailto:a@b.co");
  assert.equal(p.actions.at(-1).href, "/events/request?venue=" + encodeURIComponent("The O2"));
  const q = venueEasyRead({ name: "X", city: "Y" });
  assert.ok(!texts(q).includes("You can contact their access team."));
});
