"use client";

import { useState, useEffect, useCallback } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { Smartphone, X } from "lucide-react";
import { useEasyRead } from "@/lib/easy-read";

const HIDE_ON = ["/deaf-community", "/app-guide"];
const DISMISSED_KEY = "app-promo-dismissed";

// Loaded with ssr:false (deferred-shell.tsx), so storage is safe to read
// on first render. Blocked storage (private mode, strict settings) throws;
// the banner then just shows again on the next page.
function wasDismissed(): boolean {
  try {
    return !!sessionStorage.getItem(DISMISSED_KEY);
  } catch {
    return false;
  }
}

// A slim strip at the bottom of the screen. It used to be a full-screen
// pop-up, which opened just as people scrolled to the event filters and
// swallowed their taps. This covers nothing and needs no focus handling.
export default function AppPromoBanner() {
  const pathname = usePathname();
  const { on: easyRead } = useEasyRead();
  const [shown, setShown] = useState(false);
  const [dismissed, setDismissed] = useState(wasDismissed);

  const hidden = HIDE_ON.some((p) => pathname.startsWith(p));
  const visible = shown && !dismissed && !hidden && !easyRead;

  useEffect(() => {
    if (hidden || easyRead || dismissed) return;

    const onScroll = () => {
      if (window.scrollY > 500) {
        setShown(true);
        window.removeEventListener("scroll", onScroll);
      }
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [hidden, easyRead, dismissed]);

  // While the strip is up, keep anything focused by Tab clear of it
  // (WCAG 2.4.11: focus not hidden by sticky content).
  useEffect(() => {
    if (!visible) return;
    const root = document.documentElement;
    root.style.scrollPaddingBottom = "6rem";
    return () => {
      root.style.scrollPaddingBottom = "";
    };
  }, [visible]);

  const dismiss = useCallback(() => {
    setDismissed(true);
    try {
      sessionStorage.setItem(DISMISSED_KEY, "1");
    } catch {
      // Blocked storage: it may show again on the next page.
    }
  }, []);

  if (!visible) return null;

  // right-[5.5rem] leaves PIPA's button (bottom-right) uncovered on phones.
  return (
    <aside
      aria-label="PI Events app"
      className="fixed bottom-5 left-4 right-[5.5rem] z-30 flex items-center overflow-hidden rounded-2xl border border-white/10 bg-pi-navy text-white shadow-2xl shadow-black/40 transition duration-300 starting:translate-y-4 starting:opacity-0 motion-reduce:transition-none print:hidden md:bottom-6 md:left-6 md:right-auto md:max-w-md"
    >
      <Link
        href="/app-guide"
        onClick={dismiss}
        className="flex min-w-0 flex-1 items-center gap-3 py-3 pl-4 pr-2 hover:bg-white/5"
      >
        <Smartphone size={22} aria-hidden="true" className="shrink-0" />
        <span className="min-w-0">
          <span className="block text-base font-semibold leading-tight">Get the PI Events app</span>
          <span className="block text-sm leading-snug text-white/80">A free toolkit for Deaf audiences</span>
        </span>
      </Link>
      <button
        type="button"
        onClick={dismiss}
        aria-label="Dismiss app banner"
        className="flex h-11 w-11 shrink-0 items-center justify-center text-white/70 transition-colors hover:text-white"
      >
        <X size={18} aria-hidden="true" />
      </button>
    </aside>
  );
}
