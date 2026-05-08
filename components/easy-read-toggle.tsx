"use client";

// Easy-Read toggle pill. Sits inline in the header. Two states:
//   - off (default): "Easy Read" — neutral, indicates a mode is available
//   - on: "Easy Read ✓" — visibly active, indicates the user is in it
//
// Accessible name updates with state so screen readers announce "Easy Read
// mode is on, button" vs "Easy Read mode is off, button".

import { useEasyRead } from "@/lib/easy-read";

interface Props {
  // Visual variant — "compact" hides the label on narrow viewports and
  // shows just the icon, "full" always shows the label.
  variant?: "compact" | "full";
}

export default function EasyReadToggle({ variant = "compact" }: Props) {
  const { on, toggle } = useEasyRead();
  return (
    <button
      type="button"
      onClick={toggle}
      aria-pressed={on}
      aria-label={on ? "Easy Read mode is on. Tap to turn off." : "Easy Read mode is off. Tap to turn on."}
      className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-semibold transition ${
        on
          ? "border-pi-accent bg-pi-accent text-white shadow-sm"
          : "border-pi-ink/20 bg-white text-pi-ink hover:border-pi-accent/40 hover:bg-pi-accent/5"
      }`}
    >
      <span aria-hidden="true">{on ? "✓" : "👁"}</span>
      <span className={variant === "compact" ? "hidden sm:inline" : ""}>
        Easy Read
      </span>
    </button>
  );
}
