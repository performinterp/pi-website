"use client";

// Easy Read toggle. Two places:
//   - "pill" (header): icon + the words "Easy Read" on every screen size.
//     An icon alone wasn't recognisable, and the people who need this
//     most are the least likely to guess what an eye symbol means.
//   - "menu" (mobile menu): a full-width row that says On / Off.
// Screen readers get the visible words "Easy Read" plus aria-pressed
// (on/off), so the state is announced once, not twice.

import { BookOpen, Check } from "lucide-react";
import { useEasyRead } from "@/lib/easy-read";

interface Props {
  variant?: "pill" | "menu";
}

export default function EasyReadToggle({ variant = "pill" }: Props) {
  const { on, toggle } = useEasyRead();

  if (variant === "menu") {
    return (
      <button
        type="button"
        onClick={toggle}
        aria-pressed={on}
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
