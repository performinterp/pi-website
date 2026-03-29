"use client";

import { useEffect, useRef, useState } from "react";

interface AnimatedCounterProps {
  value: number | string;
  suffix?: string;
}

export default function AnimatedCounter({ value, suffix = "" }: AnimatedCounterProps) {
  const ref = useRef<HTMLSpanElement>(null);
  const [count, setCount] = useState(0);
  const [hasAnimated, setHasAnimated] = useState(false);

  const numericValue = typeof value === "number" ? value : parseInt(value.replace(/[^0-9]/g, ""), 10) || 0;

  useEffect(() => {
    if (!ref.current || hasAnimated) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasAnimated) {
          setHasAnimated(true);
          const duration = 1500;
          const steps = 40;
          const stepTime = duration / steps;
          let current = 0;

          const timer = setInterval(() => {
            current++;
            const progress = current / steps;
            // ease-out curve
            const eased = 1 - Math.pow(1 - progress, 3);
            setCount(Math.round(eased * numericValue));

            if (current >= steps) {
              setCount(numericValue);
              clearInterval(timer);
            }
          }, stepTime);
        }
      },
      { threshold: 0.3 }
    );

    observer.observe(ref.current);
    return () => observer.disconnect();
  }, [numericValue, hasAnimated]);

  return (
    <span ref={ref}>
      {count}
      <span className="text-pi-accent">{suffix}</span>
    </span>
  );
}
