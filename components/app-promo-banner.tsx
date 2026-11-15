"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { Pause, Play } from "lucide-react";
import AppStoreButtons from "@/components/app-store-buttons";
import { useEasyRead } from "@/lib/easy-read";

const HIDE_ON = ["/deaf-community", "/app-guide"];
const DISMISSED_KEY = "app-promo-dismissed";

// Loaded with ssr:false (deferred-shell.tsx), so storage is safe to read
// on first render. Blocked storage (private mode, strict settings) throws;
// the pop-up then just shows again on the next page.
function wasDismissed(): boolean {
  try {
    return !!sessionStorage.getItem(DISMISSED_KEY);
  } catch {
    return false;
  }
}

export default function AppPromoBanner() {
  const pathname = usePathname();
  const { on: easyRead } = useEasyRead();
  const [open, setOpen] = useState(false);
  const [dismissed, setDismissed] = useState(wasDismissed);
  const [playing, setPlaying] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);
  const returnFocusRef = useRef<HTMLElement | null>(null);

  const hidden = HIDE_ON.some((p) => pathname.startsWith(p));

  useEffect(() => {
    if (hidden || easyRead || dismissed) return;

    const onScroll = () => {
      if (window.scrollY > 500) {
        setOpen(true);
        window.removeEventListener("scroll", onScroll);
      }
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [hidden, easyRead, dismissed]);

  const dismiss = useCallback(() => {
    setOpen(false);
    setDismissed(true);
    try {
      sessionStorage.setItem(DISMISSED_KEY, "1");
    } catch {
      // Blocked storage: it may show again on the next page.
    }
    returnFocusRef.current?.focus();
    returnFocusRef.current = null;
  }, []);

  // It's a modal, so focus moves in when it opens and Escape closes it.
  useEffect(() => {
    if (!open) return;
    returnFocusRef.current = document.activeElement as HTMLElement | null;
    const timer = setTimeout(() => closeRef.current?.focus(), 50);
    // Calm motion: leave the video still until the visitor presses Play.
    // Browsers may refuse autoplay; the button then simply shows Play.
    if (!window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      videoRef.current?.play().catch(() => {});
    }
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") dismiss();
    };
    document.addEventListener("keydown", onKey);
    return () => {
      clearTimeout(timer);
      document.removeEventListener("keydown", onKey);
    };
  }, [open, dismiss]);

  // Keep Tab inside the pop-up while it's open (same as the mobile menu).
  function trapFocus(e: React.KeyboardEvent<HTMLDivElement>) {
    if (e.key !== "Tab" || !panelRef.current) return;
    const focusable = Array.from(
      panelRef.current.querySelectorAll<HTMLElement>(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
      )
    ).filter((el) => !el.hasAttribute("disabled"));
    if (focusable.length === 0) return;
    const first = focusable[0];
    const last = focusable[focusable.length - 1];
    if (e.shiftKey && document.activeElement === first) {
      e.preventDefault();
      last.focus();
    } else if (!e.shiftKey && document.activeElement === last) {
      e.preventDefault();
      first.focus();
    }
  }

  function togglePlay() {
    const video = videoRef.current;
    if (!video) return;
    if (video.paused) video.play().catch(() => {});
    else video.pause();
  }

  if (dismissed || hidden) return null;
  if (easyRead && !open) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        aria-hidden="true"
        className={`fixed inset-0 z-50 bg-black/70 backdrop-blur-sm transition-opacity duration-400 motion-reduce:transition-none ${
          open ? "opacity-100" : "pointer-events-none opacity-0"
        }`}
        onClick={dismiss}
      />

      {/* Modal. It sits in the page from the start so it can fade in;
          inert keeps its controls out of the Tab order and away from
          screen readers until it opens. */}
      <div
        inert={!open}
        className={`fixed inset-0 z-50 flex items-center justify-center p-4 transition-all duration-400 motion-reduce:transition-none ${
          open
            ? "scale-100 opacity-100"
            : "pointer-events-none scale-95 opacity-0"
        }`}
      >
        <div
          ref={panelRef}
          role="dialog"
          aria-modal={open ? true : undefined}
          aria-labelledby="app-promo-title"
          onKeyDown={trapFocus}
          className="relative w-full max-w-3xl overflow-hidden rounded-3xl border border-white/10 bg-pi-navy shadow-2xl shadow-black/60"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Close button */}
          <button
            ref={closeRef}
            onClick={dismiss}
            className="absolute right-4 top-4 z-10 flex h-8 w-8 items-center justify-center rounded-full bg-white/10 text-white/60 transition-colors hover:bg-white/20 hover:text-white"
            aria-label="Close"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="M18 6 6 18" />
              <path d="m6 6 12 12" />
            </svg>
          </button>

          {/* Video: a silent screen recording of the app, so decorative.
              The button lets anyone stop the motion (WCAG 2.2.2). */}
          <div className="relative aspect-[1700/1004] w-full bg-black">
            <video
              ref={videoRef}
              src="/videos/app-guide/order.mp4"
              muted
              loop
              playsInline
              preload="metadata"
              aria-hidden="true"
              onPlay={() => setPlaying(true)}
              onPause={() => setPlaying(false)}
              className="h-full w-full object-cover"
            />
            <button
              type="button"
              onClick={togglePlay}
              aria-label={playing ? "Pause video" : "Play video"}
              className="absolute bottom-3 left-3 flex h-10 w-10 items-center justify-center rounded-full bg-black/60 text-white transition-colors hover:bg-black/80"
            >
              {playing ? <Pause size={16} aria-hidden="true" /> : <Play size={16} aria-hidden="true" />}
            </button>
          </div>

          {/* Content */}
          <div className="px-6 py-6 text-center sm:px-8 sm:py-8">
            <p className="text-xs font-semibold uppercase tracking-widest text-pi-accent">
              The PI Events App - now available
            </p>
            <h2 id="app-promo-title" className="mt-2 font-display text-2xl text-white sm:text-3xl">
              A free toolkit for Deaf audiences
            </h2>
            <div className="mt-6 flex justify-center">
              <AppStoreButtons variant="dark" />
            </div>
            <div className="mt-5 flex flex-wrap items-center justify-center gap-3">
              <Link
                href="/app-guide"
                onClick={dismiss}
                className="inline-flex items-center gap-2 rounded-full bg-pi-accent px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-pi-accent/25 transition-all hover:brightness-110"
              >
                Download the app for FREE
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
