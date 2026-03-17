"use client";

import { useState } from "react";
import { Menu } from "lucide-react";
import MobileNav from "./mobile-nav";
import type { NavigationContent } from "@/lib/types";

interface NavClientProps {
  nav: NavigationContent;
}

export default function NavClient({ nav }: NavClientProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
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
