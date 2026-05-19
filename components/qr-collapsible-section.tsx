"use client";
import { useState, type ReactNode } from "react";

export default function QrCollapsibleSection({
  title,
  children,
}: {
  title: string;
  children: ReactNode;
}) {
  const [open, setOpen] = useState(false);

  return (
    <section className="mb-3 sm:mb-9">
      {/* Mobile: tappable header (hidden on sm+) */}
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
        className="flex w-full items-center justify-between gap-3 rounded-xl border border-pi-ink/10 bg-white px-4 py-3 text-left transition-colors hover:border-pi-gold-dark/30 sm:hidden"
      >
        <span className="text-[11px] font-bold uppercase tracking-[2px] text-pi-gold-dark">
          {title}
        </span>
        <svg
          className={`shrink-0 text-pi-ink/50 transition-transform ${open ? "rotate-180" : ""}`}
          width="18"
          height="18"
          viewBox="0 0 24 24"
          fill="none"
          aria-hidden="true"
        >
          <path
            d="M6 9l6 6 6-6"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </button>

      {/* Desktop: static heading (hidden below sm) */}
      <h2 className="mb-4 hidden items-center gap-2.5 text-[11px] font-bold uppercase tracking-[2px] text-pi-gold-dark sm:inline-flex">
        <span className="block h-[2px] w-5 bg-pi-gold-dark" />
        {title}
      </h2>

      {/*
        Content: hidden on mobile when closed, always visible on sm+ and print.
        Tailwind v4 uses postfix `!` for important (e.g. `grid!`).
      */}
      <div
        className={`mt-3 grid grid-cols-1 gap-4 sm:mt-0 sm:grid-cols-2 sm:grid! lg:grid-cols-3 print:grid-cols-3 print:grid! ${
          open ? "" : "hidden"
        }`}
      >
        {children}
      </div>
    </section>
  );
}
