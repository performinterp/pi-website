"use client";

import { useState } from "react";
import Image from "next/image";

interface MobileEventCardProps {
  title: string;
  image: string;
  description: string;
}

export default function MobileEventCard({
  title,
  image,
  description,
}: MobileEventCardProps) {
  const [open, setOpen] = useState(false);

  return (
    <button
      type="button"
      onClick={() => setOpen((v) => !v)}
      aria-expanded={open}
      aria-label={
        open ? `Hide details for ${title}` : `Show details for ${title}`
      }
      className="group relative block w-full overflow-hidden rounded-2xl shadow-md focus:outline-none focus-visible:ring-2 focus-visible:ring-pi-accent focus-visible:ring-offset-2 focus-visible:ring-offset-pi-canvas"
    >
      <div className="relative aspect-[16/10] w-full overflow-hidden">
        <Image
          src={image}
          alt={`BSL interpreter at a ${title.toLowerCase()} event`}
          fill
          sizes="(max-width: 768px) 100vw, 50vw"
          className={`object-cover transition-all duration-500 ease-out ${
            open ? "scale-105 blur-sm brightness-50" : ""
          }`}
        />

        {/* Title — visible always, drops to bottom-left on closed,
            stays prominent. Slides up to top-left on open. */}
        <div
          className={`pointer-events-none absolute inset-x-0 bottom-0 bg-gradient-to-t from-pi-navy/85 via-pi-navy/35 to-transparent p-5 transition-all duration-300 ease-out ${
            open ? "h-1/2" : "h-2/5"
          }`}
        />
        <div
          className={`absolute left-5 right-5 transition-all duration-400 ease-out ${
            open ? "top-5 bottom-auto" : "bottom-5 top-auto"
          }`}
        >
          <h3
            className="font-display text-2xl text-white"
            style={{ textShadow: "0 2px 12px rgba(2,1,66,0.6)" }}
          >
            {title}
          </h3>
        </div>

        {/* Tap-for-more affordance, hides on open */}
        <div
          className={`absolute right-4 top-4 flex h-8 w-8 items-center justify-center rounded-full bg-white/90 text-pi-ink/70 transition-all duration-300 ease-out ${
            open ? "opacity-0 scale-75" : "opacity-100 scale-100"
          }`}
          aria-hidden="true"
        >
          <svg
            width="14"
            height="14"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <line x1="12" y1="8" x2="12" y2="16" />
            <line x1="8" y1="12" x2="16" y2="12" />
          </svg>
        </div>

        {/* Body — clean white card slides up over blurred image */}
        <div
          className={`absolute inset-x-5 bottom-5 rounded-xl bg-white/95 p-5 shadow-lg backdrop-blur-md transition-all duration-400 ease-out ${
            open
              ? "translate-y-0 opacity-100"
              : "pointer-events-none translate-y-6 opacity-0"
          }`}
        >
          <p className="text-sm leading-relaxed text-pi-ink/85 text-left">
            {description}
          </p>
          <div className="mt-3 flex items-center justify-end gap-1 text-[10px] font-semibold uppercase tracking-widest text-pi-ink/40">
            Tap to close
          </div>
        </div>
      </div>
    </button>
  );
}
