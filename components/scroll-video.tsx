"use client";

import { useEffect, useRef, useState } from "react";
import { useCalmMotion } from "@/lib/easy-read";
import MotionToggle from "./motion-toggle";

type Props = {
  src: string;
  poster?: string;
  className?: string;
};

export default function ScrollVideo({ src, poster, className }: Props) {
  const ref = useRef<HTMLVideoElement>(null);
  const [progress, setProgress] = useState(0);
  const [paused, setPaused] = useState(true);
  // A visitor's Pause sticks: scrolling away and back doesn't restart it.
  const pausedByVisitor = useRef(false);
  const calm = useCalmMotion();

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    // Easy Read / reduced motion: stay paused (controls are shown instead).
    if (calm) {
      el.pause();
      return;
    }

    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          if (!pausedByVisitor.current) el.play().catch(() => {});
        } else {
          el.pause();
        }
      },
      { threshold: 0.4 }
    );

    io.observe(el);

    let raf = 0;
    const tick = () => {
      if (el.duration > 0 && !el.paused) {
        setProgress((el.currentTime / el.duration) * 100);
      }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);

    return () => {
      io.disconnect();
      cancelAnimationFrame(raf);
    };
  }, [calm]);

  const toggle = () => {
    const el = ref.current;
    if (!el) return;
    pausedByVisitor.current = !el.paused;
    if (el.paused) el.play().catch(() => {});
    else el.pause();
  };

  return (
    <div className="relative h-full w-full">
      <video
        ref={ref}
        src={src}
        poster={poster}
        muted
        loop={!calm}
        controls={calm}
        playsInline
        preload="metadata"
        onPlay={() => setPaused(false)}
        onPause={() => setPaused(true)}
        className={className ?? "h-full w-full object-cover"}
      />
      {!calm && (
        <MotionToggle
          paused={paused}
          onToggle={toggle}
          name="video"
          overlay
          className="absolute bottom-3 right-3"
        />
      )}
      {/* Subtle progress bar - lighter pi-accent, low-key but legible */}
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-1 bg-white/10">
        <div
          className="h-full bg-pi-accent/70"
          style={{ width: `${progress}%` }}
        />
      </div>
    </div>
  );
}
