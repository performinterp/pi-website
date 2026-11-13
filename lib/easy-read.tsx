"use client";

// Easy-Read mode — global toggle for cognitively accessible rendering.
//
// What this provides:
//   - <EasyReadProvider> wrapping children, persisting the flag to
//     localStorage and reflecting it as data-easy-read="on|off" on the
//     <html> element so CSS hooks and external scripts can react too.
//   - useEasyRead() hook returning { on, toggle, setOn }.
//
// Hydration strategy:
//   - The actual data attribute is set BEFORE React hydrates via an inline
//     <script> in the root layout (see EasyReadInitScript below). This
//     prevents the "flash of standard content" users would otherwise see
//     on first paint when their preference is Easy-Read.
//   - On mount, the provider reads the same key from localStorage and
//     hydrates the React state so consumers can read it as a prop.
//   - Server renders always treat the flag as `false` (the default) — no
//     hydration mismatch because React isn't actually rendering different
//     content based on the flag at SSR time. The flag is read client-side.

import { createContext, useCallback, useContext, useEffect, useState } from "react";
import type { ReactNode } from "react";

const STORAGE_KEY = "pi-easy-read";

interface EasyReadContextValue {
  on: boolean;
  toggle: () => void;
  setOn: (next: boolean) => void;
}

const EasyReadContext = createContext<EasyReadContextValue>({
  on: false,
  toggle: () => {},
  setOn: () => {},
});

export function EasyReadProvider({ children }: { children: ReactNode }) {
  const [on, setOnState] = useState(false);
  // The inline <head> script already set data-easy-read for first paint.
  // Don't mirror state back until localStorage has been read, or the first
  // commit (on=false) would overwrite "on" with "off" and flash the page.
  const [ready, setReady] = useState(false);

  // Hydrate from localStorage on mount. Keep server render as `off` to
  // avoid hydration mismatch — the inline script handles the visual
  // pre-paint via the data attribute, and the React state catches up
  // a tick later.
  useEffect(() => {
    try {
      const stored = window.localStorage.getItem(STORAGE_KEY);
      // eslint-disable-next-line react-hooks/set-state-in-effect
      if (stored === "on") setOnState(true);
    } catch {
      // localStorage may be unavailable (private mode, etc.) — ignore
    }
    setReady(true);
  }, []);

  // Mirror the React state to the data attribute and localStorage so the
  // two stay in sync after the user toggles. (The inline script handles
  // the *initial* paint; this handles every change after, once hydrated.)
  useEffect(() => {
    if (!ready || typeof document === "undefined") return;
    document.documentElement.dataset.easyRead = on ? "on" : "off";
    try {
      window.localStorage.setItem(STORAGE_KEY, on ? "on" : "off");
    } catch {
      // localStorage may be unavailable — ignore
    }
  }, [on, ready]);

  const toggle = useCallback(() => setOnState((v) => !v), []);
  const setOn = useCallback((next: boolean) => setOnState(next), []);

  return (
    <EasyReadContext.Provider value={{ on, toggle, setOn }}>
      {children}
    </EasyReadContext.Provider>
  );
}

export function useEasyRead(): EasyReadContextValue {
  return useContext(EasyReadContext);
}

// True when moving parts should stay still: Easy Read is on, or the
// visitor's system asks for reduced motion. Carousels, counters, the app
// pop-up and looping demo videos read this instead of starting timers.
export function useCalmMotion(): boolean {
  const { on } = useEasyRead();
  const [reduced, setReduced] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setReduced(mq.matches);
    const onChange = (e: MediaQueryListEvent) => setReduced(e.matches);
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);
  return on || reduced;
}

// Inline script for the document <head>. Run by the browser before React
// hydrates — sets data-easy-read on <html> based on the persisted
// preference so first paint matches user's choice. Must be inlined; can't
// be a separate file or it'd race the paint.
//
// Use as: <EasyReadInitScript /> inside the <head> of the root layout.
// (Or rendered as a string before the <body> tag — Next.js places `<head>`
// content via the layout's children.)
export const EASY_READ_INIT_SCRIPT = `
try {
  var v = localStorage.getItem('${STORAGE_KEY}');
  document.documentElement.dataset.easyRead = v === 'on' ? 'on' : 'off';
} catch (e) {
  document.documentElement.dataset.easyRead = 'off';
}
`;
