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
      className="group/ticker relative"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      <div className="bg-pi-navy pb-2 pt-6">
        <p className="text-center text-sm font-semibold uppercase tracking-widest text-white/50">
          Trusted by
        </p>
      </div>
      <div className="bg-[#f5f5f0] py-5">

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
      className="h-10 w-auto object-contain transition-opacity duration-300 hover:opacity-80 md:h-12"
    />
  );
}
