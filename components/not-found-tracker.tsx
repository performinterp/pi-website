"use client";

import { useEffect } from "react";
import { track } from "@vercel/analytics";

export default function NotFoundTracker() {
  useEffect(() => {
    // Pathname and the referring site only: query strings and full referrer
    // URLs can carry personal details (emails, tokens) into analytics.
    const path = window.location.pathname;
    let referrer = "(direct)";
    try {
      if (document.referrer) referrer = new URL(document.referrer).origin;
    } catch {
      referrer = "(unknown)";
    }
    track("404", { path, referrer });
  }, []);
  return null;
}
