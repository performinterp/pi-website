"use client";

import { useState } from "react";
import { Pause, Play } from "lucide-react";
import type { Client } from "@/lib/types";

interface LogoTickerProps {
  clients: Client[];
}

export default function LogoTicker({ clients }: LogoTickerProps) {
  const [paused, setPaused] = useState(false);

  // Duplicate for seamless loop — animation moves -50% so the second copy
  // lines up perfectly when it wraps.
  const allClients = [...clients, ...clients];

  return (
    <section
      className="group/ticker relative bg-pi-deep py-10"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      <p className="mb-4 text-center text-xs uppercase tracking-widest text-white/35">
        Trusted by
      </p>

      {/* Track wrapper */}
      <div className="overflow-hidden">
        <div
          className="flex w-max"
          style={{
            animation: "ticker-scroll 40s linear infinite",
            animationPlayState: paused ? "paused" : "running",
          }}
        >
          {allClients.map((client, i) => (
            <div
              key={`${client.name}-${i}`}
              className="flex flex-shrink-0 items-center justify-center px-6 md:px-8"
            >
              {client.url ? (
                <a
                  href={client.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={client.name}
                  className="block"
                >
                  <LogoImage client={client} />
                </a>
              ) : (
                <LogoImage client={client} />
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Accessible pause control — visible on hover/focus only */}
      <button
        type="button"
        onClick={() => setPaused((p) => !p)}
        aria-label={paused ? "Play logo ticker" : "Pause logo ticker"}
        className="absolute bottom-2 left-1/2 -translate-x-1/2 flex items-center gap-1.5 rounded-full bg-white/5 px-3 py-1 text-xs text-white/0 opacity-0 transition-all duration-300 group-hover/ticker:text-white/40 group-hover/ticker:opacity-100 focus:text-white/60 focus:opacity-100 focus:outline-none focus:ring-2 focus:ring-pi-accent"
      >
        {paused ? (
          <>
            <Play className="h-3 w-3" aria-hidden="true" />
            <span>Play</span>
          </>
        ) : (
          <>
            <Pause className="h-3 w-3" aria-hidden="true" />
            <span>Pause</span>
          </>
        )}
      </button>
    </section>
  );
}

function LogoImage({ client }: { client: Client }) {
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={client.logo}
      alt={client.name}
      className="h-8 w-auto object-contain opacity-80 transition-opacity duration-300 hover:opacity-100 md:h-10"
    />
  );
}
