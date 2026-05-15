"use client";

import { useEffect } from "react";
import { track } from "@vercel/analytics";

export default function NotFoundTracker() {
  useEffect(() => {
    const path = window.location.pathname + window.location.search;
    const referrer = document.referrer || "(direct)";
    track("404", { path, referrer });
  }, []);
  return null;
}
