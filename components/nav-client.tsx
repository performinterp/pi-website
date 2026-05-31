"use client";

import { useState } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { Menu, ChevronDown } from "lucide-react";
import MobileNav from "./mobile-nav";
import type { NavigationContent, NavItem } from "@/lib/types";

interface NavClientProps {
  nav: NavigationContent;
  scrolled?: boolean;
}

export default function NavClient({ nav, scrolled = false }: NavClientProps) {
  const [isOpen, setIsOpen] = useState(false);
  const rawPathname = usePathname();
  const pathname = rawPathname.length > 1 ? rawPathname.replace(/\/$/, "") : rawPathname;

  const linkActive = scrolled ? "text-pi-ink" : "text-white";
  const linkIdle = scrolled
    ? "text-pi-ink/75 hover:text-pi-ink"
    : "text-white/85 hover:text-white";

  const isItemActive = (item: NavItem): boolean =>
    pathname === item.href ||
    (item.children?.some((c) => pathname === c.href) ?? false);

  return (
    <>
      {/* Desktop nav */}
      <nav
        aria-label="Main navigation"
        className="hidden md:flex items-center gap-8"
      >
        {nav.mainNav.map((item) => {
          const isActive = isItemActive(item);
          const linkClass = `relative text-sm font-medium tracking-wide transition-colors duration-200 after:absolute after:left-0 after:-bottom-0.5 after:h-px after:bg-pi-accent after:transition-all after:duration-300 after:ease-out focus:outline-none focus-visible:ring-2 focus-visible:ring-pi-accent focus-visible:ring-offset-2 focus-visible:ring-offset-transparent rounded-sm ${
            isActive
              ? `${linkActive} after:w-full`
              : `${linkIdle} after:w-0 hover:after:w-full`
          }`;

          if (item.children && item.children.length > 0) {
            return (
              <div key={item.label} className="relative group">
                <button
                  type="button"
                  aria-haspopup="menu"
                  className={`${linkClass} inline-flex items-center gap-1`}
                >
                  {item.label}
                  <ChevronDown
                    size={14}
                    aria-hidden="true"
                    className="opacity-70 transition-transform duration-200 group-hover:rotate-180 group-focus-within:rotate-180"
                  />
                </button>
                {/* Hover/focus dropdown — opens on hover OR keyboard focus inside the group */}
                <div
                  role="menu"
                  aria-label={`${item.label} submenu`}
                  className="invisible opacity-0 translate-y-1 group-hover:visible group-hover:opacity-100 group-hover:translate-y-0 group-focus-within:visible group-focus-within:opacity-100 group-focus-within:translate-y-0 absolute right-0 mt-3 min-w-[200px] rounded-xl bg-white shadow-xl ring-1 ring-pi-ink/10 p-2 transition-all duration-150"
                >
                  {item.children.map((child) => {
                    const childActive = pathname === child.href;
                    return (
                      <Link
                        key={child.href}
                        href={child.href}
                        role="menuitem"
                        aria-current={childActive ? "page" : undefined}
                        className={`block rounded-md px-3 py-2 text-sm transition-colors ${
                          childActive
                            ? "bg-pi-accent/10 text-pi-ink font-semibold"
                            : "text-pi-ink/80 hover:bg-pi-canvas hover:text-pi-ink"
                        }`}
                      >
                        {child.label}
                      </Link>
                    );
                  })}
                </div>
              </div>
            );
          }

          return (
            <Link
              key={item.href}
              href={item.href}
              aria-current={isActive ? "page" : undefined}
              className={linkClass}
            >
              {item.label}
            </Link>
          );
        })}

        <Link
          href={nav.ctaButton.href}
          className="ml-4 rounded-full bg-pi-accent px-5 py-2.5 text-sm font-semibold tracking-wide text-white shadow-md shadow-pi-accent/30 transition-all duration-200 hover:brightness-110 hover:shadow-pi-accent/50 focus:outline-none focus-visible:ring-2 focus-visible:ring-pi-accent focus-visible:ring-offset-2 focus-visible:ring-offset-transparent"
        >
          {nav.ctaButton.label}
        </Link>
      </nav>

      {/* Hamburger button - visible only below md */}
      <button
        onClick={() => setIsOpen(true)}
        aria-label="Open menu"
        aria-expanded={isOpen}
        aria-controls="mobile-nav-panel"
        className="relative z-10 flex md:hidden h-10 w-10 items-center justify-center rounded-full bg-white text-pi-ink shadow-md ring-1 ring-pi-ink/10 transition-colors duration-200 hover:bg-white/95 focus:outline-none focus-visible:ring-2 focus-visible:ring-pi-accent focus-visible:ring-offset-2 focus-visible:ring-offset-transparent"
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
