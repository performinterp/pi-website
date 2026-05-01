import type { Event, InterpreterStatus } from "./types";

function classifyInterpreterStatus(
  interpreters: string,
  language: Event["language"]
): { status: InterpreterStatus; label: string } {
  const trimmed = interpreters.trim();
  const lower = trimmed.toLowerCase();
  const isRequestOrTbc =
    lower === "" ||
    lower === "tbc" ||
    lower === "to be confirmed" ||
    lower === "request interpreter" ||
    lower === "on request" ||
    lower === "available on request";

  const langLabel =
    language === "BSL_AND_ISL"
      ? "BSL & ISL"
      : language === "OTHER"
        ? "Interpreter"
        : language;

  if (!isRequestOrTbc) {
    return { status: "booked", label: `${langLabel} Interpreter Booked` };
  }
  return { status: "on-request", label: `${langLabel} Available on Request` };
}

const CSV_URL =
  "https://docs.google.com/spreadsheets/d/e/2PACX-1vTVxv88y3c-1VMujoz2bupvSCnUkoC-r0W-QogbkhivAAvY-EBff7-vp76b7NxYeSQMK43rOb7PI830/pub?gid=57149695&single=true&output=csv";

const REVALIDATE_SECONDS = 60 * 30;

const COLUMNS = [
  "DATE",
  "EVENT",
  "VENUE",
  "CITY",
  "TIME",
  "INTERPRETERS",
  "INTERPRETATION",
  "CATEGORY",
  "IMAGE URL",
  "EVENT URL",
  "STATUS",
  "SOURCE",
  "DESCRIPTION",
  "FORMAT",
  "SOLD_OUT",
  "ADDED_DATE",
] as const;

function parseCsv(text: string): string[][] {
  const rows: string[][] = [];
  let row: string[] = [];
  let field = "";
  let inQuotes = false;

  for (let i = 0; i < text.length; i++) {
    const char = text[i];
    const next = text[i + 1];

    if (inQuotes) {
      if (char === '"' && next === '"') {
        field += '"';
        i++;
      } else if (char === '"') {
        inQuotes = false;
      } else {
        field += char;
      }
      continue;
    }

    if (char === '"') {
      inQuotes = true;
    } else if (char === ",") {
      row.push(field);
      field = "";
    } else if (char === "\n" || char === "\r") {
      if (char === "\r" && next === "\n") i++;
      row.push(field);
      rows.push(row);
      row = [];
      field = "";
    } else {
      field += char;
    }
  }

  if (field.length > 0 || row.length > 0) {
    row.push(field);
    rows.push(row);
  }

  return rows.filter((r) => r.some((cell) => cell.trim().length > 0));
}

function parseDdMmYy(input: string): string | null {
  const match = input.trim().match(/^(\d{1,2})[./-](\d{1,2})[./-](\d{2,4})$/);
  if (!match) return null;
  const day = match[1].padStart(2, "0");
  const month = match[2].padStart(2, "0");
  let year = match[3];
  if (year.length === 2) year = `20${year}`;
  const iso = `${year}-${month}-${day}`;
  const date = new Date(`${iso}T00:00:00Z`);
  if (Number.isNaN(date.getTime())) return null;
  return iso;
}

function rowToEvent(row: string[]): Event | null {
  const cell = (col: (typeof COLUMNS)[number]) => {
    const idx = COLUMNS.indexOf(col);
    return (row[idx] ?? "").trim();
  };

  const name = cell("EVENT");
  const rawDate = cell("DATE");
  const venue = cell("VENUE");
  if (!name || !rawDate || !venue) return null;

  const isoDate = parseDdMmYy(rawDate);
  if (!isoDate) return null;

  const interpretation = cell("INTERPRETATION").toUpperCase();
  let language: Event["language"] = "OTHER";
  if (interpretation === "BSL") language = "BSL";
  else if (interpretation === "ISL") language = "ISL";
  else if (interpretation.includes("BSL") && interpretation.includes("ISL"))
    language = "BSL_AND_ISL";

  const addedDateRaw = cell("ADDED_DATE");
  const addedDate = parseDdMmYy(addedDateRaw) ?? null;

  const interpreters = cell("INTERPRETERS");
  const { status: interpreterStatus, label: interpreterStatusLabel } =
    classifyInterpreterStatus(interpreters, language);

  return {
    name,
    rawDate,
    isoDate,
    venue,
    city: cell("CITY"),
    time: cell("TIME"),
    interpreters,
    interpretation: cell("INTERPRETATION"),
    language,
    category: cell("CATEGORY"),
    imageUrl: cell("IMAGE URL"),
    eventUrl: cell("EVENT URL"),
    status: cell("STATUS"),
    source: cell("SOURCE"),
    description: cell("DESCRIPTION"),
    format: cell("FORMAT"),
    soldOut: cell("SOLD_OUT").toLowerCase() === "true",
    addedDate,
    interpreterStatus,
    interpreterStatusLabel,
  };
}

export async function fetchEvents(): Promise<Event[]> {
  const res = await fetch(CSV_URL, {
    next: { revalidate: REVALIDATE_SECONDS },
    redirect: "follow",
  });
  if (!res.ok) {
    throw new Error(`Failed to fetch events CSV: ${res.status} ${res.statusText}`);
  }

  const text = await res.text();
  const rows = parseCsv(text);
  if (rows.length < 2) return [];

  const header = rows[0].map((c) => c.trim());
  const expected = COLUMNS.join(",");
  if (header.join(",") !== expected) {
    console.warn("Events CSV header drift", { expected, actual: header.join(",") });
  }

  const events: Event[] = [];
  for (let i = 1; i < rows.length; i++) {
    const ev = rowToEvent(rows[i]);
    if (ev) events.push(ev);
  }

  events.sort((a, b) => a.isoDate.localeCompare(b.isoDate));
  return events;
}

export function uniqueValues<K extends keyof Event>(events: Event[], key: K): string[] {
  const set = new Set<string>();
  for (const ev of events) {
    const value = ev[key];
    if (typeof value === "string" && value.length > 0) set.add(value);
  }
  return Array.from(set).sort((a, b) => a.localeCompare(b));
}
