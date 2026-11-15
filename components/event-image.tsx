"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";

// An event's picture, falling back step by step: the sheet's own picture,
// then `fallback` if that fails to load (some Safari content blockers strip
// third-party images), then `placeholder` (or nothing).
export default function EventImage({
  src,
  fallback,
  className,
  lazy,
  placeholder = null,
}: {
  src: string;
  fallback: string;
  className?: string;
  lazy?: boolean;
  placeholder?: ReactNode;
}) {
  const sources = [src, fallback].filter(Boolean);
  const [step, setStep] = useState(0);
  const current = sources[step];
  const ref = useRef<HTMLImageElement>(null);

  // A picture that failed before React hydrated never fires onError.
  useEffect(() => {
    const img = ref.current;
    if (img && img.complete && img.naturalWidth === 0) setStep((s) => s + 1);
  }, [current]);

  if (!current) return <>{placeholder}</>;
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      key={current}
      ref={ref}
      src={current}
      alt=""
      loading={lazy ? "lazy" : undefined}
      onError={() => setStep((s) => s + 1)}
      className={className}
    />
  );
}
