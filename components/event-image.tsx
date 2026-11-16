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

  // Move past `failed` only if it's still the picture showing. A picture
  // that fails the instant it mounts is reported twice (the check below and
  // onError); counting both skipped the fallback straight to the placeholder.
  const fail = (failed: string) =>
    setStep((s) => (sources[s] === failed ? s + 1 : s));

  // A picture that failed before React hydrated never fires onError.
  useEffect(() => {
    const img = ref.current;
    if (img && img.complete && img.naturalWidth === 0) fail(current);
    // eslint-disable-next-line react-hooks/exhaustive-deps
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
      onError={() => fail(current)}
      className={className}
    />
  );
}
