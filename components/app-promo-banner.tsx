"use client";

import { useState, useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";

const HIDE_ON = ["/deaf-community", "/app-guide"];

export default function AppPromoBanner() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [dismissed, setDismissed] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  const hidden = HIDE_ON.some((p) => pathname.startsWith(p));

  useEffect(() => {
    if (hidden) return;
    if (sessionStorage.getItem("app-promo-dismissed")) {
      setDismissed(true);
      return;
    }

    const onScroll = () => {
      if (window.scrollY > 500) {
        setOpen(true);
        window.removeEventListener("scroll", onScroll);
      }
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [hidden]);

  useEffect(() => {
    if (open && videoRef.current) {
      videoRef.current.play().catch(() => {});
    }
  }, [open]);

  function dismiss() {
    setOpen(false);
    setDismissed(true);
    sessionStorage.setItem("app-promo-dismissed", "1");
  }

  if (dismissed || hidden) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className={`fixed inset-0 z-50 bg-black/70 backdrop-blur-sm transition-opacity duration-400 ${
          open ? "opacity-100" : "pointer-events-none opacity-0"
        }`}
        onClick={dismiss}
      />

      {/* Modal */}
      <div
        className={`fixed inset-0 z-50 flex items-center justify-center p-4 transition-all duration-400 ${
          open
            ? "scale-100 opacity-100"
            : "pointer-events-none scale-95 opacity-0"
        }`}
      >
        <div
          className="relative w-full max-w-3xl overflow-hidden rounded-3xl border border-white/10 bg-pi-navy shadow-2xl shadow-black/60"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Close button */}
          <button
            onClick={dismiss}
            className="absolute right-4 top-4 z-10 flex h-8 w-8 items-center justify-center rounded-full bg-white/10 text-white/60 transition-colors hover:bg-white/20 hover:text-white"
            aria-label="Close"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M18 6 6 18" />
              <path d="m6 6 12 12" />
            </svg>
          </button>

          {/* Video */}
          <div className="aspect-[1700/1004] w-full bg-black">
            <video
              ref={videoRef}
              src="/videos/app-guide/order.mp4"
              muted
              loop
              playsInline
              preload="metadata"
              className="h-full w-full object-cover"
            />
          </div>

          {/* Content */}
          <div className="px-6 py-6 text-center sm:px-8 sm:py-8">
            <p className="text-xs font-semibold uppercase tracking-widest text-pi-accent">
              The PI Events App
            </p>
            <h2 className="mt-2 font-display text-2xl text-white sm:text-3xl">
              See the app in action
            </h2>
            <p className="mx-auto mt-3 max-w-lg text-sm leading-relaxed text-white/70 sm:text-base">
              Find events, order at the bar, know your rights - a free toolkit for Deaf audiences at live events.
            </p>
            <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
              <Link
                href="/app-guide"
                onClick={dismiss}
                className="inline-flex items-center gap-2 rounded-full bg-pi-accent px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-pi-accent/25 transition-all hover:brightness-110"
              >
                Watch the full tour
              </Link>
              <button
                onClick={dismiss}
                className="rounded-full border border-white/15 bg-white/5 px-6 py-3 text-sm font-semibold text-white/70 transition-all hover:border-white/30 hover:text-white"
              >
                Maybe later
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
