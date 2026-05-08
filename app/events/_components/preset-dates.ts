// Preset date-range helpers.
//
// Each preset returns ISO yyyy-mm-dd strings for the From/To date filters,
// computed in the user's local timezone. UI is plain English ("This weekend",
// "Next 7 days") because date-format strings (dd/mm/yyyy vs mm/dd/yyyy) are
// a known accessibility friction for English-as-second-language users.

export interface DateRange {
  from: string; // yyyy-mm-dd
  to: string; // yyyy-mm-dd
}

export type DatePresetKey = "today" | "weekend" | "week" | "month";

export interface DatePreset {
  key: DatePresetKey;
  label: string;
  compute(): DateRange;
}

function iso(d: Date): string {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

function startOfToday(): Date {
  const d = new Date();
  d.setHours(0, 0, 0, 0);
  return d;
}

function addDays(d: Date, n: number): Date {
  const x = new Date(d);
  x.setDate(x.getDate() + n);
  return x;
}

export const DATE_PRESETS: DatePreset[] = [
  {
    key: "today",
    label: "Today",
    compute() {
      const t = startOfToday();
      return { from: iso(t), to: iso(t) };
    },
  },
  {
    key: "weekend",
    label: "This weekend",
    compute() {
      // Today through the next Sunday. If today is Saturday or Sunday,
      // include today + remaining weekend day. Otherwise, jump to Saturday.
      const today = startOfToday();
      const dow = today.getDay(); // 0=Sun ... 6=Sat
      let from: Date;
      let to: Date;
      if (dow === 6) {
        from = today;
        to = addDays(today, 1);
      } else if (dow === 0) {
        from = today;
        to = today;
      } else {
        const daysToSat = 6 - dow;
        from = addDays(today, daysToSat);
        to = addDays(today, daysToSat + 1);
      }
      return { from: iso(from), to: iso(to) };
    },
  },
  {
    key: "week",
    label: "Next 7 days",
    compute() {
      const today = startOfToday();
      return { from: iso(today), to: iso(addDays(today, 6)) };
    },
  },
  {
    key: "month",
    label: "Next 30 days",
    compute() {
      const today = startOfToday();
      return { from: iso(today), to: iso(addDays(today, 29)) };
    },
  },
];

// Identify which preset (if any) matches the current From/To values, so the
// active button can be highlighted. Returns null if no preset matches.
export function activePresetKey(from: string, to: string): DatePresetKey | null {
  for (const p of DATE_PRESETS) {
    const r = p.compute();
    if (r.from === from && r.to === to) return p.key;
  }
  return null;
}
