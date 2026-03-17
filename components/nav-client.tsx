"use client";

import { useState } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { Menu } from "lucide-react";
import MobileNav from "./mobile-nav";
import type { NavigationContent } from "@/lib/types";

interface NavClientProps {
  nav: NavigationContent;
}

export default function NavClient({ nav }: NavClientProps) {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();

  return (
    <>
      {/* Desktop nav */}
      <nav
        aria-label="Main navigation"
        className="hidden md:flex items-center gap-8"
      >
        {nav.mainNav.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              aria-current={isActive ? "page" : undefined}
              className={`relative text-sm font-medium tracking-wide transition-colors duration-200 after:absolute after:left-0 after:-bottom-0.5 after:h-px after:bg-pi-accent after:transition-all after:duration-300 after:ease-out focus:outline-none focus:ring-2 focus:ring-pi-accent focus:ring-offset-2 focus:ring-offset-transparent rounded-sm ${
                isActive
                  ? "text-white after:w-full"
                  : "text-white/80 hover:text-white after:w-0 hover:after:w-full"
              }`}
            >
              {item.label}
            </Link>
          );
        })}

        <Link
          href={nav.ctaButton.href}
          className="ml-4 rounded-full bg-pi-accent px-5 py-2.5 text-sm font-semibold tracking-wide text-white shadow-md shadow-pi-accent/30 transition-all duration-200 hover:brightness-110 hover:shadow-pi-accent/50 focus:outline-none focus:ring-2 focus:ring-pi-accent focus:ring-offset-2 focus:ring-offset-pi-navy"
        >
          {nav.ctaButton.label}
        </Link>
      </nav>

      {/* Hamburger button — visible only below md */}
      <button
        onClick={() => setIsOpen(true)}
        aria-label="Open menu"
        aria-expanded={isOpen}
        aria-controls="mobile-nav-panel"
        className="relative z-10 flex md:hidden h-10 w-10 items-center justify-center rounded-full text-white/80 hover:text-white hover:bg-white/10 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-pi-accent focus:ring-offset-2 focus:ring-offset-transparent"
      >
        <Menu size={22} aria-hidden="true" />
      </button>

      <MobileNav
        nav={nav}
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
      />
    </>
  );
}
