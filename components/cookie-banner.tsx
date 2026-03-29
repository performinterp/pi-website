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
    <div className="fixed inset-x-0 bottom-0 z-50 p-4">
      <div className="mx-auto max-w-3xl rounded-2xl border border-white/10 bg-pi-navy/95 p-5 shadow-2xl backdrop-blur-md md:flex md:items-center md:gap-6 md:p-6">
        <p className="flex-1 text-sm leading-relaxed text-white/70">
          We use essential cookies to make this site work. We also use analytics
          cookies to understand how you use our site so we can improve it. See
          our{" "}
          <Link href="/privacy" className="text-pi-accent underline hover:text-white">
            Privacy Policy
          </Link>{" "}
          for details.
        </p>
        <div className="mt-4 flex gap-3 md:mt-0 md:shrink-0">
          <button
            onClick={reject}
            className="rounded-full border border-white/15 px-5 py-2 text-sm font-semibold text-white/70 transition-colors hover:border-white/30 hover:text-white"
          >
            Reject
          </button>
          <button
            onClick={accept}
            className="rounded-full bg-pi-accent px-5 py-2 text-sm font-semibold text-white transition-colors hover:brightness-110"
          >
            Accept
          </button>
        </div>
      </div>
    </div>
  );
}
