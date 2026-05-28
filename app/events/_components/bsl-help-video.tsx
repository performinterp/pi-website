"use client";

import { useEffect, useRef, useState } from "react";

// BSL & ISL "how to search" intro videos. Hosted on Cloudflare R2 at
// media.performanceinterpreting.co.uk (progressive download, HTTP range
// requests supported for instant scrub). Player mirrors the PI Academy
// pattern: no native browser controls (Safari's huge play/pause overlay
// blocks the signer's hands), custom minimal scrubber, autoplay-loop on
// open. Click anywhere on the video to pause/resume.

const BSL_VIDEO_URL = "https://media.performanceinterpreting.co.uk/bsl-search.mp4";
const ISL_VIDEO_URL = "https://media.performanceinterpreting.co.uk/isl-search.mp4";

export default function BslHelpVideo() {
  const [open, setOpen] = useState(false);
  const [language, setLanguage] = useState<"BSL" | "ISL">("BSL");
  const [time, setTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [paused, setPaused] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const src = language === "BSL" ? BSL_VIDEO_URL : ISL_VIDEO_URL;
  const progress = duration > 0 ? (time / duration) * 100 : 0;

  // Restart playback when drawer opens or language changes.
  useEffect(() => {
    if (!open) return;
    const v = videoRef.current;
    if (!v) return;
    v.currentTime = 0;
    setPaused(false);
    void v.play().catch(() => {
      /* Browser blocked autoplay — user can tap to start. */
    });
  }, [open, src]);

  const togglePlay = () => {
    const v = videoRef.current;
    if (!v) return;
    if (v.paused) {
      void v.play().catch(() => {});
    } else {
      v.pause();
    }
  };

  const seek = (e: React.MouseEvent<HTMLDivElement>) => {
    const v = videoRef.current;
    if (!v || !duration) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const frac = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
    v.currentTime = frac * duration;
  };

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
          <div className="relative w-full overflow-hidden rounded-lg bg-black">
            <video
              ref={videoRef}
              key={src}
              src={src}
              autoPlay
              muted
              playsInline
              loop
              preload="metadata"
              controls={false}
              onClick={togglePlay}
              onTimeUpdate={(e) => setTime(e.currentTarget.currentTime)}
              onLoadedMetadata={(e) => setDuration(e.currentTarget.duration)}
              onPlay={() => setPaused(false)}
              onPause={() => setPaused(true)}
              aria-label={`How to find your event, in ${language}`}
              className="block w-full aspect-video object-contain cursor-pointer"
            />
            {/* Centred play overlay — only shown when paused, fades out
                immediately on resume so it doesn't block the signer. */}
            {paused && (
              <button
                type="button"
                onClick={togglePlay}
                aria-label="Play video"
                className="pointer-events-none absolute inset-0 flex items-center justify-center"
              >
                <span className="pointer-events-auto flex h-14 w-14 items-center justify-center rounded-full bg-black/55 text-white backdrop-blur-sm">
                  <svg className="h-6 w-6 translate-x-0.5" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
                    <path d="M8 5v14l11-7z" />
                  </svg>
                </span>
              </button>
            )}
            {/* Minimal scrubber — thin bar at the bottom, click to seek */}
            <div
              role="slider"
              aria-label="Seek"
              aria-valuemin={0}
              aria-valuemax={Math.round(duration)}
              aria-valuenow={Math.round(time)}
              onClick={seek}
              className="absolute bottom-0 left-0 right-0 h-1.5 bg-white/15 cursor-pointer hover:h-2 transition-all"
            >
              <div
                className="h-full bg-pi-accent/85 transition-[width] duration-100"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
          <p className="mt-3 text-xs text-pi-ink/60">
            Tap the video to play or pause. If the video does not load, your
            network may be blocking media.performanceinterpreting.co.uk.
          </p>
        </div>
      )}
    </div>
  );
}
