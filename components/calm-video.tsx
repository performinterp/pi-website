"use client";

// A muted demo <video> that autoplays and loops normally, but in Easy
// Read (or with reduced motion) stays paused with controls so the visitor
// chooses when to play it. The server render still has autoPlay, so we
// pause it after hydration if needed.
import { useEffect, useRef, type ComponentProps } from "react";
import { useCalmMotion } from "@/lib/easy-read";

export default function CalmVideo(props: ComponentProps<"video">) {
  const calm = useCalmMotion();
  const ref = useRef<HTMLVideoElement>(null);
  useEffect(() => {
    const v = ref.current;
    if (!v) return;
    // pause() clears the autoplay flag, so turning Easy Read off again has
    // to restart playback by hand.
    if (calm) v.pause();
    else if (props.autoPlay) v.play().catch(() => {});
  }, [calm, props.autoPlay]);
  return <video ref={ref} {...props} autoPlay={!calm && props.autoPlay} loop={!calm && props.loop} controls={calm || props.controls} />;
}
