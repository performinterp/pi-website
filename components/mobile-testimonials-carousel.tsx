"use client";

import { useEffect, useRef, useState } from "react";

interface Testimonial {
  name: string;
  context?: string;
  quote: string;
  rating?: number;
}

interface MobileTestimonialsCarouselProps {
  testimonials: Testimonial[];
}

export default function MobileTestimonialsCarousel({
  testimonials,
}: MobileTestimonialsCarouselProps) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    const onScroll = () => {
      const cardWidth = el.children[0]?.clientWidth ?? 1;
      const gap = 16;
      const idx = Math.round(el.scrollLeft / (cardWidth + gap));
      setActiveIndex(Math.min(testimonials.length - 1, Math.max(0, idx)));
    };
    el.addEventListener("scroll", onScroll, { passive: true });
    return () => el.removeEventListener("scroll", onScroll);
  }, [testimonials.length]);

  function scrollTo(idx: number) {
    const el = scrollRef.current;
    if (!el) return;
    const card = el.children[idx] as HTMLElement | undefined;
    if (!card) return;
    el.scrollTo({ left: card.offsetLeft, behavior: "smooth" });
  }

  return (
    <div className="md:hidden -mx-5">
      <div
        ref={scrollRef}
        className="flex snap-x snap-mandatory gap-4 overflow-x-auto scroll-smooth px-5 pb-2 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        style={{ scrollPaddingLeft: "20px" }}
      >
        {testimonials.map((t) => (
          <article
            key={t.name}
            className="flex w-[85%] flex-shrink-0 snap-start flex-col rounded-2xl border border-pi-ink/10 bg-white p-6 shadow-sm"
          >
            {t.rating && (
              <div className="mb-4 flex gap-0.5">
                {Array.from({ length: t.rating }).map((_, j) => (
                  <svg
                    key={j}
                    className="h-4 w-4 fill-pi-gold"
                    viewBox="0 0 20 20"
                    aria-hidden="true"
                  >
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                ))}
              </div>
            )}
            <p className="flex-1 text-base italic leading-relaxed text-pi-ink/85">
              &ldquo;{t.quote}&rdquo;
            </p>
            <div className="mt-5 border-t border-pi-ink/10 pt-5">
              <p className="text-sm font-semibold text-pi-ink">{t.name}</p>
              {t.context && (
                <p className="text-xs text-pi-ink/60">{t.context}</p>
              )}
            </div>
          </article>
        ))}
      </div>

      {/* Pagination dots */}
      <div className="mt-5 flex justify-center gap-1.5">
        {testimonials.map((_, i) => (
          <button
            key={i}
            type="button"
            onClick={() => scrollTo(i)}
            aria-label={`Go to review ${i + 1}`}
            className={`h-1.5 rounded-full transition-all duration-300 ease-out ${
              i === activeIndex
                ? "w-6 bg-pi-gold"
                : "w-1.5 bg-pi-ink/20 hover:bg-pi-ink/40"
            }`}
          />
        ))}
      </div>
    </div>
  );
}
