"use client";

import { useEffect, useId, useRef, useState } from "react";
import { Pause, Play } from "lucide-react";
import { getSignVideo, type VideoKey } from "@/lib/sign-videos";

// Signed (BSL / ISL) video player, shared by /events and Easy Read summaries.
// Hosted on Cloudflare R2 at
// media.performanceinterpreting.co.uk (progressive download, HTTP range
// requests supported for instant scrub). Player mirrors the PI Academy
// pattern: no native browser controls (Safari's huge play/pause overlay
// blocks the signer's hands), autoplay-loop on open. Click anywhere on the
// video to pause/resume; the controls sit below the video, so keyboard and
// screen reader users can pause and seek without covering the signer.

interface SignedClipProps {
  /** Second line on the button, and the video's accessible name. */
  label: string;
  /** A clip from the catalogue in lib/sign-videos.ts. */
  videoKey?: VideoKey;
  /** Or direct URLs (override the catalogue clip). */
  bslUrl?: string;
  islUrl?: string;
}

export default function SignedClip({ label, videoKey, bslUrl, islUrl }: SignedClipProps) {
  const panelId = useId();
  const bslSrc = bslUrl ?? (videoKey ? getSignVideo(videoKey, "BSL")?.src : undefined);
  const islSrc = islUrl ?? (videoKey ? getSignVideo(videoKey, "ISL")?.src : undefined);
  const [open, setOpen] = useState(false);
  const [chosen, setChosen] = useState<"BSL" | "ISL">("BSL");
  const [time, setTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [paused, setPaused] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  // Fall back to whichever language exists when only one is available.
  const language = chosen === "ISL" && islSrc ? "ISL" : bslSrc ? "BSL" : "ISL";
  const src = language === "BSL" ? bslSrc : islSrc;

  // Restart playback when drawer opens or language changes.
  useEffect(() => {
    if (!open) return;
    const v = videoRef.current;
    if (!v) return;
    v.currentTime = 0;
    setPaused(false);
    // Browser blocked autoplay: show Play so the visitor can start it.
    void v.play().catch(() => setPaused(true));
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

  const seek = (to: number) => {
    const v = videoRef.current;
    if (!v || !duration) return;
    v.currentTime = to;
    setTime(to);
  };

  if (!src) return null;

  return (
    <div className="mb-6 overflow-hidden rounded-2xl border border-pi-accent/30 bg-pi-accent/5">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        aria-controls={panelId}
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
            <span className="block text-base text-pi-ink/65">
              {label}
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
        <div id={panelId} className="border-t border-pi-accent/20 p-4">
          {bslSrc && islSrc && (
          <div className="mb-3 flex gap-2">
            <button
              type="button"
              onClick={() => setChosen("BSL")}
              aria-pressed={language === "BSL"}
              className={`rounded-full px-4 py-1.5 text-base font-semibold transition ${
                language === "BSL"
                  ? "bg-pi-accent text-white"
                  : "bg-white text-pi-ink/70 hover:bg-pi-accent/10"
              }`}
            >
              BSL
            </button>
            <button
              type="button"
              onClick={() => setChosen("ISL")}
              aria-pressed={language === "ISL"}
              className={`rounded-full px-4 py-1.5 text-base font-semibold transition ${
                language === "ISL"
                  ? "bg-pi-accent text-white"
                  : "bg-white text-pi-ink/70 hover:bg-pi-accent/10"
              }`}
            >
              ISL
            </button>
          </div>
          )}
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
              aria-label={`${label}, in ${language}`}
              className="block w-full aspect-video object-contain cursor-pointer"
            />
            {/* Centred play sign — only shown when paused, gone on resume
                so it doesn't block the signer. A tap reaches the video. */}
            {paused && (
              <span
                aria-hidden="true"
                className="pointer-events-none absolute inset-0 flex items-center justify-center"
              >
                <span className="flex h-14 w-14 items-center justify-center rounded-full bg-black/55 text-white backdrop-blur-sm">
                  <Play size={24} className="translate-x-0.5" fill="currentColor" />
                </span>
              </span>
            )}
          </div>
          <div className="mt-2 flex items-center gap-3">
            <button
              type="button"
              onClick={togglePlay}
              aria-label={paused ? "Play video" : "Pause video"}
              className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-pi-accent text-white transition hover:brightness-110"
            >
              {paused ? (
                <Play size={18} fill="currentColor" aria-hidden="true" />
              ) : (
                <Pause size={18} fill="currentColor" aria-hidden="true" />
              )}
            </button>
            {/* Native range: arrow keys move a second, Home/End jump to the
                ends, and screen readers hear the time. */}
            <input
              type="range"
              min={0}
              max={duration || 0}
              step={1}
              value={time}
              onChange={(e) => seek(Number(e.target.value))}
              disabled={!duration}
              aria-label="Seek"
              aria-valuetext={`${clock(time)} of ${clock(duration)}`}
              className="h-2 min-w-0 flex-1 cursor-pointer accent-pi-accent"
            />
            <span aria-hidden="true" className="shrink-0 text-sm tabular-nums text-pi-ink/70">
              {clock(time)} / {clock(duration)}
            </span>
          </div>
          <p className="mt-3 text-sm text-pi-ink/60">
            Tap the video or the button to play or pause. If the video does not load, your
            network may be blocking media.performanceinterpreting.co.uk.
          </p>
        </div>
      )}
    </div>
  );
}

function clock(seconds: number): string {
  const s = Math.floor(seconds || 0);
  return `${Math.floor(s / 60)}:${String(s % 60).padStart(2, "0")}`;
}
