"use client";

import { useState, type ReactNode } from "react";
import Icon from "@/components/icon";

interface MobileExpanderProps {
  icon?: string;
  iconNode?: ReactNode;
  title: string;
  subtitle?: string;
  children: ReactNode;
  defaultOpen?: boolean;
  variant?: "light" | "dark";
}

export default function MobileExpander({
  icon,
  iconNode,
  title,
  subtitle,
  children,
  defaultOpen = false,
  variant = "light",
}: MobileExpanderProps) {
  const [open, setOpen] = useState(defaultOpen);

  const isDark = variant === "dark";
  const cardBg = isDark ? "bg-white/[0.04]" : "bg-white";
  const cardBorder = isDark ? "border-white/10" : "border-pi-ink/10";
  const ruleColor = "bg-pi-gold";
  const titleColor = isDark ? "text-white" : "text-pi-ink";
  const subtitleColor = isDark ? "text-white/60" : "text-pi-ink/60";
  const chevronColor = isDark ? "text-white/50" : "text-pi-ink/40";
  const bodyColor = isDark ? "text-white/75" : "text-pi-ink/75";
  const dividerColor = isDark ? "border-white/10" : "border-pi-ink/10";

  return (
    <div
      className={`relative overflow-hidden rounded-2xl border ${cardBorder} ${cardBg} shadow-sm transition-shadow duration-300 ${
        open ? "shadow-md" : ""
      }`}
    >
      {/* Gold left-rule — 1px closed, 3px open. Visual marker of "active". */}
      <div
        className={`absolute left-0 top-0 h-full ${ruleColor} transition-all duration-300 ease-out ${
          open ? "w-[3px]" : "w-px"
        }`}
        aria-hidden="true"
      />

      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        className="flex w-full items-center gap-4 px-5 py-5 text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-pi-accent focus-visible:ring-offset-2 focus-visible:ring-offset-transparent"
      >
        {(icon || iconNode) && (
          <div
            className={`flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl ${
              isDark ? "bg-pi-gold/15" : "bg-pi-gold/10"
            }`}
          >
            {iconNode ?? <Icon name={icon!} size={18} className="text-pi-gold" />}
          </div>
        )}
        <div className="min-w-0 flex-1">
          <h3 className={`font-display text-lg leading-tight ${titleColor}`}>
            {title}
          </h3>
          {subtitle && (
            <p className={`mt-1 text-xs ${subtitleColor}`}>{subtitle}</p>
          )}
        </div>
        <svg
          width="14"
          height="14"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          className={`flex-shrink-0 ${chevronColor} transition-transform duration-300 ease-out ${
            open ? "rotate-180" : ""
          }`}
          aria-hidden="true"
        >
          <polyline points="6 9 12 15 18 9" />
        </svg>
      </button>

      {/* Body — grid-rows trick for smooth height animation */}
      <div
        className={`grid transition-[grid-template-rows] duration-300 ease-out ${
          open ? "grid-rows-[1fr]" : "grid-rows-[0fr]"
        }`}
      >
        <div className="overflow-hidden">
          <div
            className={`border-t ${dividerColor} px-5 pb-6 pt-5 text-sm leading-relaxed ${bodyColor} transition-opacity duration-300 ease-out ${
              open ? "opacity-100" : "opacity-0"
            }`}
            style={{ transitionDelay: open ? "80ms" : "0ms" }}
          >
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}
