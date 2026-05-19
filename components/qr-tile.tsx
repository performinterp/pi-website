"use client";
import { useState } from "react";
import Image from "next/image";

export type QrTileData = {
  slug: string;
  label: string;
  caption: string;
  url: string;
  displayUrl: string;
};

export default function QrTile({ tile }: { tile: QrTileData }) {
  const [open, setOpen] = useState(false);

  return (
    <div className="group relative overflow-hidden rounded-2xl border border-pi-ink/10 bg-white transition-all hover:border-pi-gold-dark/40 hover:shadow-[0_8px_24px_rgba(10,30,63,0.08)] print:rounded-lg print:shadow-none">
      <span className="absolute inset-x-0 top-0 h-[3px] bg-pi-gold-dark opacity-0 transition-opacity group-hover:opacity-100 print:opacity-100" />

      {/* Title row — interactive on mobile (toggle), static on sm+ */}
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
        className="flex w-full items-center justify-between gap-3 px-4 py-3 text-left sm:cursor-default sm:justify-center sm:px-5 sm:pb-2 sm:pt-5"
      >
        <span className="text-[15px] font-semibold text-pi-navy sm:text-center">
          {tile.label}
        </span>
        <svg
          className={`shrink-0 text-pi-ink/45 transition-transform sm:hidden ${open ? "rotate-180" : ""}`}
          width="18"
          height="18"
          viewBox="0 0 24 24"
          fill="none"
          aria-hidden="true"
        >
          <path
            d="M6 9l6 6 6-6"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </button>

      {/*
        Expanded body: QR → caption → URL link.
        Hidden on mobile when closed; always visible on sm+ and print.
      */}
      <div
        className={`px-4 pb-4 sm:px-5 sm:pb-5 sm:block! print:block! ${
          open ? "" : "hidden"
        }`}
      >
        <div className="mx-auto aspect-square w-full max-w-[200px] p-1.5">
          <Image
            src={`/qr-codes/${tile.slug}.svg`}
            alt=""
            width={400}
            height={400}
            className="h-full w-full"
            unoptimized
          />
        </div>
        <p className="mt-2 text-center text-[12.5px] leading-snug text-pi-ink/60">
          {tile.caption}
        </p>
        <a
          href={tile.url}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-2 block break-words text-center font-mono text-[10.5px] text-pi-ink/40 transition-colors hover:text-pi-accent"
        >
          {tile.displayUrl} ↗
        </a>
      </div>
    </div>
  );
}
