import type { FocusEvent } from "react";
import { Pause, Play } from "lucide-react";

// The Pause/Play button for anything on the page that moves by itself
// (WCAG 2.2.2). Callers hide it in Easy Read / reduced motion, where
// nothing moves.
export default function MotionToggle({
  paused,
  onToggle,
  name,
  overlay = false,
  className = "",
}: {
  paused: boolean;
  onToggle: () => void;
  /** What moves, e.g. "slideshow": the label reads "Pause slideshow". */
  name: string;
  /** Icon-only round button for sitting on top of a video. */
  overlay?: boolean;
  className?: string;
}) {
  const label = `${paused ? "Play" : "Pause"} ${name}`;
  const Icon = paused ? Play : Pause;
  return (
    <button
      type="button"
      data-motion-toggle=""
      onClick={onToggle}
      aria-label={overlay ? label : undefined}
      className={`${
        overlay
          ? "flex h-10 w-10 items-center justify-center rounded-full bg-black/60 text-white backdrop-blur-sm hover:bg-black/75"
          : "inline-flex min-h-10 items-center gap-2 rounded-full border border-pi-ink/15 bg-white px-4 text-sm font-semibold text-pi-ink/80 transition-colors hover:border-pi-accent/40 hover:text-pi-ink"
      } ${className}`}
    >
      <Icon size={16} aria-hidden="true" />
      {!overlay && label}
    </button>
  );
}

// Carousels stop rotating for good once keyboard focus enters them (the
// WAI-ARIA carousel pattern), until the visitor presses Play. Focus on the
// toggle itself doesn't count, or pressing Play would stop it again.
export function stopOnFocus(stop: () => void) {
  return (e: FocusEvent<HTMLElement>) => {
    if (!(e.target as HTMLElement).closest("[data-motion-toggle]")) stop();
  };
}
