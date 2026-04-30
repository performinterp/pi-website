"use client";

import { useState } from "react";
import type { Client } from "@/lib/types";

interface LogoTickerProps {
  clients: Client[];
}

export default function LogoTicker({ clients }: LogoTickerProps) {
  const [paused, setPaused] = useState(false);

  // Duplicate for seamless loop - animation moves -50% so the second copy
  // lines up perfectly when it wraps.
  const allClients = [...clients, ...clients];

  return (
    <section
      className="group/ticker relative bg-pi-canvas border-b border-pi-ink/10"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      {/* Mobile: static 3-column grid — every logo visible, no animation jank */}
      <div className="md:hidden section-padding py-6">
        <div className="grid grid-cols-3 gap-x-4 gap-y-5 items-center justify-items-center">
          {clients.map((client) => (
            <div key={client.name} className="flex items-center justify-center">
              {client.url ? (
                <a
                  href={client.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={client.name}
                  className="block"
                >
                  <LogoImage client={client} mobile />
                </a>
              ) : (
                <LogoImage client={client} mobile />
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Desktop: marquee */}
      <div className="hidden md:flex flex-col items-center justify-center pt-6 pb-6">
        <div className="w-full overflow-hidden">
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
                className="flex flex-shrink-0 items-center justify-center px-8"
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

function LogoImage({ client, mobile = false }: { client: Client; mobile?: boolean }) {
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={client.logo}
      alt={client.name}
      loading="lazy"
      decoding="async"
      className={`w-auto max-w-full object-contain transition-opacity duration-300 hover:opacity-80 ${
        mobile ? "h-8" : "h-10"
      }`}
    />
  );
}
