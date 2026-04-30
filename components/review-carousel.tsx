"use client";

import { useState, useEffect, useCallback } from "react";

type Review = {
  quote: string;
  name: string;
  context: string;
  rating?: number;
};

export default function ReviewCarousel({ reviews }: { reviews: Review[] }) {
  const [active, setActive] = useState(0);

  const next = useCallback(
    () => setActive((a) => (a + 1) % reviews.length),
    [reviews.length]
  );

  useEffect(() => {
    const id = setInterval(next, 5000);
    return () => clearInterval(id);
  }, [next]);

  return (
    <div className="relative mx-auto max-w-3xl text-center">
      <div className="relative min-h-[200px] md:min-h-[160px]">
        {reviews.map((review, i) => (
          <div
            key={review.name}
            className={`absolute inset-0 flex flex-col items-center justify-center transition-all duration-700 ${
              i === active
                ? "translate-y-0 opacity-100"
                : "translate-y-4 opacity-0 pointer-events-none"
            }`}
          >
            {review.rating && (
              <div className="mb-4 flex gap-1">
                {Array.from({ length: review.rating }).map((_, j) => (
                  <svg
                    key={j}
                    className="h-4 w-4 fill-pi-gold"
                    viewBox="0 0 20 20"
                  >
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                ))}
              </div>
            )}
            <p className="font-display text-xl italic leading-relaxed text-pi-ink/90 md:text-2xl">
              &ldquo;{review.quote}&rdquo;
            </p>
            <p className="mt-4 text-sm font-semibold text-pi-ink">
              {review.name}
            </p>
            <p className="text-xs text-pi-ink/55">{review.context}</p>
          </div>
        ))}
      </div>

      {/* Dots */}
      <div className="mt-8 flex items-center justify-center gap-2">
        {reviews.map((_, i) => (
          <button
            key={i}
            onClick={() => setActive(i)}
            className={`h-2 rounded-full transition-all duration-300 ${
              i === active
                ? "w-6 bg-pi-accent"
                : "w-2 bg-pi-ink/25 hover:bg-pi-ink/45"
            }`}
            aria-label={`Review ${i + 1}`}
          />
        ))}
      </div>
    </div>
  );
}
