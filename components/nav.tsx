import Image from "next/image";
import Link from "next/link";
import { getNavigation } from "@/lib/content";
import NavClient from "@/components/nav-client";

export default function Nav() {
  const nav = getNavigation();

  return (
    <header className="fixed inset-x-0 top-0 z-30 w-full">
      {/* Persistent dark backdrop for text legibility on all scroll positions */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-0 h-28 bg-gradient-to-b from-pi-navy/95 via-pi-navy/80 to-pi-navy/0 md:h-32"
      />

      <div className="section-padding relative flex h-16 items-center justify-between md:h-20">
        {/* Logo */}
        <Link
          href="/"
          aria-label="Performance Interpreting - home"
          className="relative z-10 flex-shrink-0 focus:outline-none focus:ring-2 focus:ring-pi-accent focus:ring-offset-2 focus:ring-offset-transparent rounded-sm"
        >
          <Image
            src="/icons/pi-logo-wide.svg"
            alt="Performance Interpreting"
            width={180}
            height={40}
            priority
            className="h-8 w-auto md:h-9"
          />
        </Link>

        {/* Desktop nav + Mobile hamburger (client component for active states) */}
        <NavClient nav={nav} />
      </div>
    </header>
  );
}
