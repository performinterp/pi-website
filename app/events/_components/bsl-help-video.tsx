"use client";

import { useState } from "react";

// BSL "how to search" intro video. Sourced from the same media bucket the
// standalone app uses (media.performanceinterpreting.co.uk/bsl-search.mp4).
// Collapsed by default — expanded on tap. Signals that this site is *for*
// Deaf users, not just *accessible to* them, while not consuming page real
// estate from users who don't want it.

const BSL_VIDEO_URL = "https://media.performanceinterpreting.co.uk/bsl-search.mp4";
const ISL_VIDEO_URL = "https://media.performanceinterpreting.co.uk/isl-search.mp4";

export default function BslHelpVideo() {
  const [open, setOpen] = useState(false);
  const [language, setLanguage] = useState<"BSL" | "ISL">("BSL");
  const src = language === "BSL" ? BSL_VIDEO_URL : ISL_VIDEO_URL;

  return (
    <div className="mb-6 overflow-hidden rounded-2xl border border-pi-accent/30 bg-pi-accent/5">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        aria-controls="bsl-help-video-panel"
        className="flex w-full items-center justify-between gap-3 px-5 py-4 text-left transition hover:bg-pi-accent/10"
      >
        <span className="flex items-center gap-3">
          <span aria-hidden="true" className="text-2xl">
            👋
          </span>
          <span>
            <span className="block font-display text-lg leading-tight text-pi-ink">
              Watch in BSL or ISL
            </span>
            <span className="block text-sm text-pi-ink/65">
              How to find your event
            </span>
          </span>
        </span>
        <span
          aria-hidden="true"
          className={`text-pi-ink/60 transition-transform ${open ? "rotate-180" : ""}`}
        >
          ▼
        </span>
      </button>
      {open && (
        <div id="bsl-help-video-panel" className="border-t border-pi-accent/20 p-4">
          <div className="mb-3 flex gap-2">
            <button
              type="button"
              onClick={() => setLanguage("BSL")}
              aria-pressed={language === "BSL"}
              className={`rounded-full px-4 py-1.5 text-sm font-semibold transition ${
                language === "BSL"
                  ? "bg-pi-accent text-white"
                  : "bg-white text-pi-ink/70 hover:bg-pi-accent/10"
              }`}
            >
              BSL
            </button>
            <button
              type="button"
              onClick={() => setLanguage("ISL")}
              aria-pressed={language === "ISL"}
              className={`rounded-full px-4 py-1.5 text-sm font-semibold transition ${
                language === "ISL"
                  ? "bg-pi-accent text-white"
                  : "bg-white text-pi-ink/70 hover:bg-pi-accent/10"
              }`}
            >
              ISL
            </button>
          </div>
          <video
            key={src}
            src={src}
            controls
            preload="metadata"
            className="aspect-video w-full rounded-lg bg-black"
            aria-label={`How to find your event, in ${language}`}
          >
            <track kind="captions" />
          </video>
          <p className="mt-3 text-xs text-pi-ink/60">
            Captions may be available in the video player. If the video does
            not load, your network may be blocking media.performanceinterpreting.co.uk.
          </p>
        </div>
      )}
    </div>
  );
}
