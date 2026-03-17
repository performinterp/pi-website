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
    <section className="bg-pi-deep py-10">
      <p className="text-center text-xs uppercase tracking-widest text-white/35 mb-4">
        Trusted by
      </p>

      {/* Track wrapper — hides overflow so logos scroll into view cleanly */}
      <div className="overflow-hidden">
        <div
          className="flex"
          style={{
            animation: "ticker-scroll 30s linear infinite",
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

      {/* Accessible pause control — WCAG 2.2.2 */}
      <div className="flex justify-center mt-4">
        <button
          type="button"
          onClick={() => setPaused((p) => !p)}
          aria-label={paused ? "Play logo ticker" : "Pause logo ticker"}
          className="flex items-center gap-1.5 text-white/30 hover:text-white/60 transition-colors text-xs"
        >
          {paused ? (
            <>
              <Play className="w-3 h-3" aria-hidden="true" />
              <span>Play</span>
            </>
          ) : (
            <>
              <Pause className="w-3 h-3" aria-hidden="true" />
              <span>Pause</span>
            </>
          )}
        </button>
      </div>
    </section>
  );
}

function LogoImage({ client }: { client: Client }) {
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={client.logo}
      alt={client.name}
      className="h-8 md:h-10 w-auto object-contain"
      style={{
        filter: "grayscale(1) opacity(0.5)",
        transition: "filter 300ms ease",
      }}
      onMouseEnter={(e) => {
        (e.currentTarget as HTMLImageElement).style.filter =
          "grayscale(0) opacity(1)";
      }}
      onMouseLeave={(e) => {
        (e.currentTarget as HTMLImageElement).style.filter =
          "grayscale(1) opacity(0.5)";
      }}
    />
  );
}
