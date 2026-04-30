"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

export default function CookieBanner() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const consent = localStorage.getItem("cookie-consent");
    if (!consent) setVisible(true);
  }, []);

  function accept() {
    localStorage.setItem("cookie-consent", "accepted");
    setVisible(false);
  }

  function reject() {
    localStorage.setItem("cookie-consent", "rejected");
    setVisible(false);
  }

  if (!visible) return null;

  return (
    <div className="fixed inset-x-0 bottom-0 z-50 p-2 md:p-4">
      <div className="mx-auto max-w-3xl rounded-xl border border-white/10 bg-pi-navy/95 p-3 shadow-2xl backdrop-blur-md md:flex md:items-center md:gap-6 md:rounded-2xl md:p-6">
        <p className="flex-1 text-xs leading-snug text-white/70 md:text-sm md:leading-relaxed">
          We use cookies to make this site work and to understand how it&apos;s used. See our{" "}
          <Link href="/privacy" className="text-pi-accent underline hover:text-white">
            Privacy Policy
          </Link>
          .
        </p>
        <div className="mt-2 flex gap-2 md:mt-0 md:shrink-0 md:gap-3">
          <button
            onClick={reject}
            className="flex-1 rounded-full border border-white/15 px-4 py-1.5 text-xs font-semibold text-white/70 transition-colors hover:border-white/30 hover:text-white md:flex-none md:px-5 md:py-2 md:text-sm"
          >
            Reject
          </button>
          <button
            onClick={accept}
            className="flex-1 rounded-full bg-pi-accent px-4 py-1.5 text-xs font-semibold text-white transition-colors hover:brightness-110 md:flex-none md:px-5 md:py-2 md:text-sm"
          >
            Accept
          </button>
        </div>
      </div>
    </div>
  );
}
