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

        {/* Closed-state title gradient + label */}
        <div
          className={`pointer-events-none absolute inset-x-0 bottom-0 h-2/5 bg-gradient-to-t from-pi-navy/85 via-pi-navy/35 to-transparent p-5 transition-opacity duration-300 ease-out ${
            open ? "opacity-0" : "opacity-100"
          }`}
        />
        <div
          className={`absolute bottom-5 left-5 right-5 transition-opacity duration-300 ease-out ${
            open ? "opacity-0" : "opacity-100"
          }`}
        >
          <h3
            className="font-display text-2xl text-white text-left"
            style={{ textShadow: "0 2px 12px rgba(2,1,66,0.6)" }}
          >
            {title}
          </h3>
        </div>

        {/* Closed-state info affordance */}
        <div
          className={`absolute right-4 top-4 flex h-8 w-8 items-center justify-center rounded-full bg-white/90 text-pi-ink/75 transition-all duration-300 ease-out ${
            open ? "opacity-0 scale-75" : "opacity-100 scale-100"
          }`}
          aria-hidden="true"
        >
          <span className="font-display text-base italic leading-none">i</span>
        </div>

        {/* Open-state body card — fills image area with breathing room,
            content vertically centred, title becomes a small gold kicker */}
        <div
          className={`absolute inset-3 flex flex-col rounded-xl bg-white/95 p-5 shadow-xl backdrop-blur-md transition-all duration-400 ease-out ${
            open
              ? "translate-y-0 opacity-100"
              : "pointer-events-none translate-y-4 opacity-0"
          }`}
        >
          <p className="text-[10px] font-semibold uppercase tracking-widest text-pi-gold">
            {title}
          </p>
          <p className="mt-2 flex-1 text-sm leading-relaxed text-pi-ink/85 text-left">
            {description}
          </p>
          <div className="mt-2 flex items-center justify-end gap-1 text-[10px] font-semibold uppercase tracking-widest text-pi-ink/40">
            Tap to close
          </div>
        </div>
      </div>
    </button>
  );
}
