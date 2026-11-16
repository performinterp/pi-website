"use client";

import { useState } from "react";
import type { Client } from "@/lib/types";
import { useCalmMotion } from "@/lib/easy-read";
import MotionToggle, { stopOnFocus } from "./motion-toggle";

interface LogoTickerProps {
  clients: Client[];
}

export default function LogoTicker({ clients }: LogoTickerProps) {
  // hovered: paused while the pointer is over it. stopped: the visitor
  // pressed Pause or tabbed onto a logo; only Play restarts it.
  const [hovered, setHovered] = useState(false);
  const [stopped, setStopped] = useState(false);
  const calm = useCalmMotion();

  // Duplicate for seamless loop - animation moves -50% so the second copy
  // lines up perfectly when it wraps.
  // In Easy Read (calm) there is no loop, so no duplicate set.
  const allClients = calm ? clients : [...clients, ...clients];

  return (
    <section
      className="group/ticker relative bg-pi-canvas border-b border-pi-ink/10"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onFocus={stopOnFocus(() => setStopped(true))}
    >
      {/* Mobile: 3 hero logos + reveal-all expander */}
      <MobileLogoReveal clients={clients} />

      {/* Desktop: marquee */}
      <div className="hidden md:flex flex-col items-center justify-center pt-6 pb-6">
        <div className="w-full overflow-hidden">
          <div
            data-ticker=""
            className="flex w-max"
            style={{
              animation: "ticker-scroll 40s linear infinite",
              animationPlayState: hovered || stopped ? "paused" : "running",
            }}
          >
            {allClients.map((client, i) => {
              const dup = i >= clients.length;
              return (
                <div
                  key={`${client.name}-${i}`}
                  data-ticker-dup={dup ? "" : undefined}
                  aria-hidden={dup ? true : undefined}
                  className="flex flex-shrink-0 items-center justify-center px-8"
                >
                  {client.url ? (
                    <a
                      href={client.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={client.name}
                      tabIndex={dup ? -1 : undefined}
                      className="block"
                    >
                      <LogoImage client={client} />
                    </a>
                  ) : (
                    <LogoImage client={client} />
                  )}
                </div>
              );
            })}
          </div>
        </div>
        {!calm && (
          <MotionToggle
            paused={stopped}
            onToggle={() => setStopped((s) => !s)}
            name="logos"
            className="mt-4"
          />
        )}
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

      {/* Trusted by — eyebrow + chevron, classy reveal trigger */}
      {!open && (
        <button
          type="button"
          onClick={() => setOpen(true)}
          aria-label="Trusted by — show more clients"
          className="group mt-5 flex w-full flex-col items-center gap-1.5 focus:outline-none focus-visible:ring-2 focus-visible:ring-pi-accent focus-visible:ring-offset-4 focus-visible:ring-offset-pi-canvas rounded-md"
        >
          <span className="text-[11px] font-semibold uppercase tracking-[0.2em] text-pi-ink/65 transition-colors group-hover:text-pi-ink/80">
            Trusted by
          </span>
          <svg
            width="14"
            height="14"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="text-pi-gold transition-transform duration-300 ease-out group-hover:translate-y-0.5"
            aria-hidden="true"
          >
            <polyline points="6 9 12 15 18 9" />
          </svg>
        </button>
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
