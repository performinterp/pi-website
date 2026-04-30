"use client";

import { useEffect, useRef, useCallback } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { X } from "lucide-react";
import type { NavigationContent } from "@/lib/types";

interface MobileNavProps {
  nav: NavigationContent;
  isOpen: boolean;
  onClose: () => void;
}

export default function MobileNav({ nav, isOpen, onClose }: MobileNavProps) {
  const overlayRef = useRef<HTMLDivElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const firstLinkRef = useRef<HTMLAnchorElement>(null);
  const pathname = usePathname();

  // Close on Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        onClose();
      }
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  // Focus management: move focus to close button when opened
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
      // Small delay to allow transition to start before focusing
      const timer = setTimeout(() => {
        closeButtonRef.current?.focus();
      }, 50);
      return () => clearTimeout(timer);
    } else {
      document.body.style.overflow = "";
    }
    return undefined;
  }, [isOpen]);

  // Focus trap
  const handleKeyDownTrap = useCallback(
    (e: React.KeyboardEvent<HTMLDivElement>) => {
      if (e.key !== "Tab" || !overlayRef.current) return;

      const focusableSelectors =
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])';
      const focusable = Array.from(
        overlayRef.current.querySelectorAll<HTMLElement>(focusableSelectors)
      ).filter((el) => !el.hasAttribute("disabled"));

      if (focusable.length === 0) return;

      const first = focusable[0];
      const last = focusable[focusable.length - 1];

      if (e.shiftKey) {
        if (document.activeElement === first) {
          e.preventDefault();
          last.focus();
        }
      } else {
        if (document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    },
    []
  );

  return (
    <>
      {/* Backdrop */}
      <div
        aria-hidden="true"
        className={`fixed inset-0 z-40 bg-black/60 backdrop-blur-sm transition-opacity duration-300 ease-out ${
          isOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        }`}
        onClick={onClose}
      />

      {/* Panel — outer wrapper handles fixed positioning + slide animation;
          inner solid layer handles bg. Splitting these defeats an iOS Safari
          stacking-context bug where transform on a fixed element drops the
          bg-color in some compositing paths. */}
      <div
        ref={overlayRef}
        role="dialog"
        aria-modal="true"
        aria-label="Navigation menu"
        onKeyDown={handleKeyDownTrap}
        className={`fixed inset-y-0 right-0 z-50 w-full max-w-sm transition-transform duration-300 ease-out ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div
          className="flex h-full w-full flex-col shadow-2xl"
          style={{ backgroundColor: "#020142" }}
        >
        {/* Header row */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-white/10" style={{ backgroundColor: "#020142" }}>
          <span className="text-sm font-medium tracking-widest uppercase text-pi-muted">
            Menu
          </span>
          <button
            ref={closeButtonRef}
            onClick={onClose}
            aria-label="Close menu"
            className="flex h-10 w-10 items-center justify-center rounded-full text-white/70 hover:text-white hover:bg-white/10 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-pi-accent focus:ring-offset-2 focus:ring-offset-pi-navy"
          >
            <X size={20} aria-hidden="true" />
          </button>
        </div>

        {/* Nav links */}
        <nav
          aria-label="Mobile navigation"
          className="flex flex-col flex-1 px-6 py-8 gap-1"
          style={{ backgroundColor: "#020142" }}
        >
          {nav.mainNav.map((item, i) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                ref={i === 0 ? firstLinkRef : undefined}
                onClick={onClose}
                aria-current={isActive ? "page" : undefined}
                className={`group flex items-center justify-between rounded-lg px-4 py-4 text-lg font-medium tracking-wide transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-pi-accent focus:ring-inset ${
                  isActive
                    ? "text-white bg-pi-accent/10 border-l-2 border-pi-accent"
                    : "text-white/80 hover:text-white hover:bg-white/5"
                }`}
              >
                <span>{item.label}</span>
                <span className="text-pi-accent opacity-0 group-hover:opacity-100 transition-opacity duration-200 text-xl leading-none">
                  →
                </span>
              </Link>
            );
          })}
        </nav>

        {/* CTA */}
        <div
          className="px-6 pb-10 pt-4 border-t border-white/10"
          style={{ backgroundColor: "#020142" }}
        >
          <Link
            href={nav.ctaButton.href}
            onClick={onClose}
            className="flex w-full items-center justify-center rounded-full bg-pi-accent px-6 py-4 text-base font-semibold tracking-wide text-white shadow-lg shadow-pi-accent/25 hover:brightness-110 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-pi-accent focus:ring-offset-2 focus:ring-offset-pi-navy"
          >
            {nav.ctaButton.label}
          </Link>
        </div>
        </div>
      </div>
    </>
  );
}
