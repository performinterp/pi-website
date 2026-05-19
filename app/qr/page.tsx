import type { Metadata } from "next";
import Image from "next/image";

export const metadata: Metadata = {
  title: "QR Bank — Staff | Performance Interpreting",
  description: "Internal QR code reference for PI staff at events.",
  robots: { index: false, follow: false, nocache: true },
};

type Tile = {
  slug: string;
  label: string;
  caption: string;
  url: string;
  displayUrl: string;
};

type Section = { title: string; tiles: Tile[] };

const sections: Section[] = [
  {
    title: "Before / At an event",
    tiles: [
      {
        slug: "pi-website",
        label: "PI website",
        caption: "All things Performance Interpreting",
        url: "https://performanceinterpreting.co.uk/",
        displayUrl: "performanceinterpreting.co.uk",
      },
      {
        slug: "app-guide",
        label: "App guide",
        caption: "Read about the PI Events app",
        url: "https://performanceinterpreting.co.uk/app-guide/",
        displayUrl: "/app-guide",
      },
      {
        slug: "get-app",
        label: "Get the app",
        caption: "Auto-opens iOS App Store or Google Play",
        url: "https://performanceinterpreting.co.uk/get-app/",
        displayUrl: "/get-app",
      },
      {
        slug: "volunteer",
        label: "Volunteer with PI",
        caption: "Register your interest in volunteering",
        url: "https://tally.so/r/wvQ0Kl",
        displayUrl: "tally.so/r/wvQ0Kl",
      },
      {
        slug: "photo-consent",
        label: "Photo & video consent",
        caption: "Happy to appear in event photos or videos?",
        url: "https://performanceinterpreting.co.uk/photo-consent",
        displayUrl: "/photo-consent",
      },
    ],
  },
  {
    title: "After an event",
    tiles: [
      {
        slug: "feedback",
        label: "Event feedback",
        caption: "Share your experience — text or BSL/ISL video",
        url: "https://performanceinterpreting.co.uk/deaf-community/#feedback",
        displayUrl: "/deaf-community#feedback",
      },
    ],
  },
  {
    title: "Merchandise",
    tiles: [
      {
        slug: "apparel",
        label: "PI apparel",
        caption: "Browse and order PI merch",
        url: "https://performanceinterpreting.deco-apparel.com/",
        displayUrl: "deco-apparel.com",
      },
    ],
  },
];

function Tile({ tile }: { tile: Tile }) {
  return (
    <a
      href={tile.url}
      target="_blank"
      rel="noopener noreferrer"
      className="group relative flex flex-col items-center gap-3.5 overflow-hidden rounded-2xl border border-pi-ink/10 bg-white p-4 pb-4 text-center transition-all hover:-translate-y-0.5 hover:border-pi-gold-dark/40 hover:shadow-[0_8px_24px_rgba(10,30,63,0.08)] print:rounded-lg print:shadow-none"
    >
      <span className="absolute inset-x-0 top-0 h-[3px] bg-pi-gold-dark opacity-0 transition-opacity group-hover:opacity-100 print:opacity-100" />
      <div className="aspect-square w-full max-w-[200px] p-1.5">
        <Image
          src={`/qr-codes/${tile.slug}.svg`}
          alt=""
          width={400}
          height={400}
          className="h-full w-full"
          unoptimized
        />
      </div>
      <div className="w-full">
        <p className="text-[15px] font-semibold text-pi-navy">{tile.label}</p>
        <p className="mt-0.5 min-h-[2.6em] text-[12.5px] leading-snug text-pi-ink/60">
          {tile.caption}
        </p>
        <p className="mt-1.5 break-words font-mono text-[10.5px] text-pi-ink/40">
          {tile.displayUrl}
        </p>
      </div>
    </a>
  );
}

export default function QRBankPage() {
  return (
    <>
      {/* Slim staff-utility header (not the marketing PageHero) */}
      <section className="bg-pi-navy px-5 py-6 text-white md:px-8">
        <div className="mx-auto flex max-w-5xl flex-wrap items-center gap-x-6 gap-y-3">
          <Image
            src="/icons/pi-logo-wide.svg"
            alt="Performance Interpreting"
            width={220}
            height={44}
            className="h-10 w-auto md:h-11"
            priority
          />
          <div className="flex flex-col">
            <span className="text-[10px] font-bold uppercase tracking-[2.5px] text-white/60">
              QR Bank · Staff
            </span>
            <h1 className="font-display text-lg leading-tight md:text-xl">
              Show, scan, share
            </h1>
          </div>
          <p className="mt-2 w-full border-t border-white/10 pt-3 text-[13px] leading-snug text-white/70">
            Tap a tile to open the link, or show the QR to a guest at the venue.
          </p>
        </div>
      </section>

      <main className="mx-auto max-w-5xl px-5 pb-20 pt-7 md:px-8">
        {sections.map((section) => (
          <section key={section.title} className="mb-9">
            <h2 className="mb-4 inline-flex items-center gap-2.5 text-[11px] font-bold uppercase tracking-[2px] text-pi-gold-dark">
              <span className="block h-[2px] w-5 bg-pi-gold-dark" />
              {section.title}
            </h2>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 print:grid-cols-3">
              {section.tiles.map((tile) => (
                <Tile key={tile.slug} tile={tile} />
              ))}
            </div>
          </section>
        ))}

        <section className="mb-9">
          <h2 className="mb-4 inline-flex items-center gap-2.5 text-[11px] font-bold uppercase tracking-[2px] text-pi-gold-dark">
            <span className="block h-[2px] w-5 bg-pi-gold-dark" />
            Festival WhatsApp groups
          </h2>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 print:grid-cols-3">
            {[1, 2, 3].map((n) => (
              <div
                key={n}
                className="flex min-h-[280px] flex-col items-center justify-center rounded-2xl border-2 border-dashed border-pi-ink/10 p-7 text-center text-[12.5px] text-pi-ink/55"
              >
                <strong className="mb-1.5 text-[14px] font-semibold text-pi-ink/70">
                  Add per festival
                </strong>
                WhatsApp invite QRs go here.
              </div>
            ))}
          </div>
        </section>

        <p className="border-t border-pi-ink/10 pt-5 text-center text-[11px] text-pi-ink/40">
          Bookmark this page on your phone — it stays up to date.
        </p>
      </main>
    </>
  );
}
