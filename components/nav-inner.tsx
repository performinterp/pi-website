"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import NavClient from "@/components/nav-client";
import type { NavigationContent } from "@/lib/types";

interface NavInnerProps {
  nav: NavigationContent;
}

export default function NavInner({ nav }: NavInnerProps) {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 80);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`fixed inset-x-0 top-0 z-30 w-full transition-colors duration-300 ${
        scrolled
          ? "bg-pi-canvas/95 backdrop-blur-md border-b border-pi-ink/10 shadow-sm"
          : "bg-transparent"
      }`}
    >
      <div className="section-padding relative flex h-16 items-center justify-between md:h-20">
        {/* Logo */}
        <Link
          href="/"
          aria-label="Performance Interpreting - home"
          className="relative z-10 flex-shrink-0 focus:outline-none focus:ring-2 focus:ring-pi-accent focus:ring-offset-2 focus:ring-offset-transparent rounded-sm"
        >
          <Image
            src={scrolled ? "/icons/pi-logo-wide-black.svg" : "/icons/pi-logo-wide.svg"}
            alt="Performance Interpreting"
            width={180}
            height={40}
            priority
            className="h-8 w-auto md:h-9"
          />
        </Link>

        {/* Desktop nav + Mobile hamburger */}
        <NavClient nav={nav} scrolled={scrolled} />
      </div>
    </header>
  );
}
