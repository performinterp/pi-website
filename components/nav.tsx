import Image from "next/image";
import Link from "next/link";
import { getNavigation } from "@/lib/content";
import NavClient from "./nav-client";

export default function Nav() {
  const nav = getNavigation();

  return (
    <header className="fixed inset-x-0 top-0 z-30 w-full">
      {/* Gradient fade so text below is readable over the hero */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-gradient-to-b from-black/60 via-black/20 to-transparent"
      />

      <div className="section-padding relative flex h-16 items-center justify-between md:h-20">
        {/* Logo */}
        <Link
          href="/"
          aria-label="Performance Interpreting — home"
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

        {/* Desktop nav */}
        <nav
          aria-label="Main navigation"
          className="hidden md:flex items-center gap-8"
        >
          {nav.mainNav.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="relative text-sm font-medium tracking-wide text-white/80 transition-colors duration-200 hover:text-white after:absolute after:left-0 after:-bottom-0.5 after:h-px after:w-0 after:bg-pi-accent after:transition-all after:duration-300 after:ease-out hover:after:w-full focus:outline-none focus:ring-2 focus:ring-pi-accent focus:ring-offset-2 focus:ring-offset-transparent rounded-sm"
            >
              {item.label}
            </Link>
          ))}

          <Link
            href={nav.ctaButton.href}
            className="ml-4 rounded-full bg-pi-accent px-5 py-2.5 text-sm font-semibold tracking-wide text-white shadow-md shadow-pi-accent/30 transition-all duration-200 hover:brightness-110 hover:shadow-pi-accent/50 focus:outline-none focus:ring-2 focus:ring-pi-accent focus:ring-offset-2 focus:ring-offset-pi-navy"
          >
            {nav.ctaButton.label}
          </Link>
        </nav>

        {/* Mobile: hamburger + slide-out drawer (client island) */}
        <NavClient nav={nav} />
      </div>
    </header>
  );
}
