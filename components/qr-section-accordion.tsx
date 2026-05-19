"use client";
import { useState, type ReactNode } from "react";

export default function QrSectionAccordion({
  title,
  count,
  defaultOpen = false,
  children,
}: {
  title: string;
  count?: number;
  defaultOpen?: boolean;
  children: ReactNode;
}) {
  const [open, setOpen] = useState(defaultOpen);

  return (
    <section className="mb-3 sm:mb-4">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
        className="flex w-full items-center justify-between gap-3 rounded-xl border border-pi-ink/10 bg-white px-4 py-3.5 text-left transition-colors hover:border-pi-gold-dark/30 print:border-none print:bg-transparent print:p-0"
      >
        <span className="inline-flex items-center gap-2.5 text-[11px] font-bold uppercase tracking-[2px] text-pi-gold-dark">
          <span className="block h-[2px] w-5 bg-pi-gold-dark" />
          {title}
          {typeof count === "number" && (
            <span className="ml-1 rounded-full bg-pi-gold-dark/10 px-2 py-0.5 text-[10px] tracking-wider text-pi-gold-dark/80 print:hidden">
              {count}
            </span>
          )}
        </span>
        <svg
          className={`shrink-0 text-pi-ink/45 transition-transform print:hidden ${open ? "rotate-180" : ""}`}
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

      {/* Open on click; force open in print so a printed sheet shows everything. */}
      <div
        className={`mt-3 grid grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-4 lg:grid-cols-3 print:grid! print:grid-cols-3 ${
          open ? "" : "hidden"
        }`}
      >
        {children}
      </div>
    </section>
  );
}
