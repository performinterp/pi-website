"use client";

// A muted demo <video> that autoplays and loops normally, with a Pause
// button in the corner (WCAG 2.2.2). In Easy Read (or with reduced motion)
// it stays paused with controls so the visitor chooses when to play it.
// The server render still has autoPlay, so we pause it after hydration if
// needed.
import { useEffect, useRef, useState, type ComponentProps } from "react";
import { useCalmMotion } from "@/lib/easy-read";
import MotionToggle from "./motion-toggle";

export default function CalmVideo(props: ComponentProps<"video">) {
  const calm = useCalmMotion();
  const ref = useRef<HTMLVideoElement>(null);
  const [paused, setPaused] = useState(!props.autoPlay);
  useEffect(() => {
    const v = ref.current;
    if (!v) return;
    // pause() clears the autoplay flag, so turning Easy Read off again has
    // to restart playback by hand.
    if (calm) v.pause();
    else if (props.autoPlay) v.play().catch(() => setPaused(true));
  }, [calm, props.autoPlay]);

  const toggle = () => {
    const v = ref.current;
    if (!v) return;
    if (v.paused) v.play().catch(() => setPaused(true));
    else v.pause();
  };

  return (
    <div className="relative">
      <video
        ref={ref}
        {...props}
        autoPlay={!calm && props.autoPlay}
        loop={!calm && props.loop}
        controls={calm || props.controls}
        onPlay={(e) => {
          setPaused(false);
          props.onPlay?.(e);
        }}
        onPause={(e) => {
          setPaused(true);
          props.onPause?.(e);
        }}
      />
      {!calm && !props.controls && (
        <MotionToggle
          paused={paused}
          onToggle={toggle}
          name="video"
          overlay
          className="absolute bottom-3 right-3"
        />
      )}
    </div>
  );
}
