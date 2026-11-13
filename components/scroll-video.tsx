"use client";

import { useEffect, useRef, useState } from "react";
import { useCalmMotion } from "@/lib/easy-read";

type Props = {
  src: string;
  poster?: string;
  className?: string;
};

export default function ScrollVideo({ src, poster, className }: Props) {
  const ref = useRef<HTMLVideoElement>(null);
  const [progress, setProgress] = useState(0);
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
          el.play().catch(() => {});
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
        className={className ?? "h-full w-full object-cover"}
      />
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
