"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight } from "lucide-react";

const screenshots = [
  { src: "/images/screenshots/browse-categories.png", label: "Browse by Category" },
  { src: "/images/screenshots/event-detail.png", label: "Event Detail" },
  { src: "/images/screenshots/my-events.png", label: "My Events" },
  { src: "/images/screenshots/support-show-staff.png", label: "Support at Events" },
  { src: "/images/screenshots/order-food.png", label: "Food & Drink Orders" },
  { src: "/images/screenshots/bsl-isl-videos.png", label: "BSL & ISL Videos" },
  { src: "/images/screenshots/search-interpreter.png", label: "Interpreter Search" },
  { src: "/images/screenshots/request-interpreter.png", label: "Request an Interpreter" },
];

export default function AppScreenshotCarousel() {
  const total = screenshots.length;
  const [pos, setPos] = useState(total);
  const [transitioning, setTransitioning] = useState(true);
  const [paused, setPaused] = useState(false);
  const [perView, setPerView] = useState(3);

  const activeIndex = ((pos % total) + total) % total;

  // Detect mobile/desktop
  useEffect(() => {
    const check = () => setPerView(window.innerWidth < 768 ? 1 : 3);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  const next = useCallback(() => {
    setTransitioning(true);
    setPos((p) => p + 1);
  }, []);

  const prev = useCallback(() => {
    setTransitioning(true);
    setPos((p) => p - 1);
  }, []);

  const goTo = useCallback(
    (i: number) => {
      setTransitioning(true);
      setPos(total + i);
    },
    [total]
  );

  // Seamless loop reset
  const handleTransitionEnd = useCallback(() => {
    if (pos >= total * 2) {
      setTransitioning(false);
      setPos((p) => p - total);
    } else if (pos < 0) {
      setTransitioning(false);
      setPos((p) => p + total);
    }
  }, [pos, total]);

  // Safety net
  useEffect(() => {
    if (pos < 0 || pos >= total * 2) {
      const timer = setTimeout(() => {
        setTransitioning(false);
        setPos(((pos % total) + total) % total + total);
      }, 600);
      return () => clearTimeout(timer);
    }
  }, [pos, total]);

  // Auto-advance
  useEffect(() => {
    if (paused) return;
    const interval = setInterval(next, perView === 1 ? 2000 : 3000);
    return () => clearInterval(interval);
  }, [next, paused, perView]);

  const items = [...screenshots, ...screenshots, ...screenshots];
  const itemWidth = 100 / perView;

  return (
    <div
      className="flex flex-col items-center gap-8"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      <div className="mx-auto flex w-full max-w-4xl items-center gap-2 md:gap-4">
        <button
          onClick={prev}
          aria-label="Previous screenshot"
          className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-white/15 bg-white/5 text-white/60 transition-all hover:border-pi-accent/30 hover:bg-pi-accent/10 hover:text-white"
        >
          <ChevronLeft size={20} />
        </button>

        <div className="flex-1 overflow-hidden">
          <div
            className={transitioning ? "transition-transform duration-500 ease-in-out" : ""}
            style={{
              display: "flex",
              transform: `translateX(-${pos * itemWidth}%)`,
            }}
            onTransitionEnd={handleTransitionEnd}
          >
            {items.map((shot, i) => (
              <div
                key={`${shot.src}-${i}`}
                className="shrink-0"
                style={{ width: `${itemWidth}%` }}
              >
                <div className="flex flex-col items-center gap-3 px-3">
                  <div className="overflow-hidden rounded-[2rem] border-[5px] border-white/15 bg-black shadow-2xl shadow-black/40">
                    <div className="relative aspect-[9/19.5] w-[200px] md:w-[210px]">
                      <Image
                        src={shot.src}
                        alt={shot.label}
                        fill
                        className="object-cover"
                      />
                    </div>
                  </div>
                  <p className="text-center text-sm font-medium text-white/60">
                    {shot.label}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <button
          onClick={next}
          aria-label="Next screenshot"
          className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-white/15 bg-white/5 text-white/60 transition-all hover:border-pi-accent/30 hover:bg-pi-accent/10 hover:text-white"
        >
          <ChevronRight size={20} />
        </button>
      </div>

      {/* Dot indicators */}
      <div className="flex gap-2">
        {screenshots.map((shot, i) => (
          <button
            key={shot.src}
            onClick={() => goTo(i)}
            aria-label={`View ${shot.label}`}
            className={`h-2.5 rounded-full transition-all duration-300 ${
              i === activeIndex
                ? "w-8 bg-pi-accent"
                : "w-2.5 bg-white/20 hover:bg-white/40"
            }`}
          />
        ))}
      </div>
    </div>
  );
}
