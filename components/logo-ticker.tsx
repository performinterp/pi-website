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
      {/* Mobile: 3 hero logos + reveal-all expander */}
      <MobileLogoReveal clients={clients} />

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
        mobile ? "h-10" : "h-10"
      }`}
    />
  );
}

const HERO_NAMES = ["Wembley Stadium", "Live Nation", "Arsenal"];

function MobileLogoReveal({ clients }: { clients: Client[] }) {
  const [open, setOpen] = useState(false);

  const heroClients = HERO_NAMES.map((name) =>
    clients.find((c) => c.name === name)
  ).filter((c): c is Client => Boolean(c));
  const restClients = clients.filter((c) => !HERO_NAMES.includes(c.name));

  return (
    <div className="md:hidden section-padding py-6">
      {/* Hero row — 3 prestige logos, larger */}
      <div className="grid grid-cols-3 items-center justify-items-center gap-x-4">
        {heroClients.map((client) => (
          <div key={client.name} className="flex h-12 items-center justify-center">
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

      {/* See more pill */}
      {!open && (
        <div className="mt-5 flex justify-center">
          <button
            type="button"
            onClick={() => setOpen(true)}
            className="inline-flex items-center gap-2 rounded-full border border-pi-ink/15 bg-white px-5 py-2 text-xs font-semibold tracking-wide text-pi-ink/80 transition-all duration-200 hover:border-pi-accent/40 hover:text-pi-ink active:scale-[0.98]"
          >
            See all {clients.length} clients
            <svg
              width="12"
              height="12"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <polyline points="6 9 12 15 18 9" />
            </svg>
          </button>
        </div>
      )}

      {/* Expanded grid — reveals smoothly, stays open */}
      <div
        className={`grid transition-[grid-template-rows] duration-500 ease-out ${
          open ? "grid-rows-[1fr]" : "grid-rows-[0fr]"
        }`}
      >
        <div className="overflow-hidden">
          <div
            className={`mt-5 grid grid-cols-3 items-center justify-items-center gap-x-4 gap-y-6 border-t border-pi-ink/10 pt-6 transition-opacity duration-500 ease-out ${
              open ? "opacity-100" : "opacity-0"
            }`}
            style={{ transitionDelay: open ? "120ms" : "0ms" }}
          >
            {restClients.map((client) => (
              <div key={client.name} className="flex h-10 items-center justify-center">
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
      </div>
    </div>
  );
}
