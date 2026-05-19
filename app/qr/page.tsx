import type { Metadata } from "next";
import QrTile, { type QrTileData } from "@/components/qr-tile";

export const metadata: Metadata = {
  title: "QR Bank — Staff | Performance Interpreting",
  description: "Internal QR code reference for PI staff at events.",
  robots: { index: false, follow: false, nocache: true },
};

type Section = { title: string; tiles: QrTileData[] };

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
    title: "Staff Uniform",
    tiles: [
      {
        slug: "apparel",
        label: "PI apparel",
        caption: "Order your kit — not customer-facing, share if inspired",
        url: "https://performanceinterpreting.deco-apparel.com/",
        displayUrl: "deco-apparel.com",
      },
    ],
  },
];

export default function QRBankPage() {
  return (
    <>
      {/* Slim staff-utility header (no PI logo — site nav already shows it).
          pt-24 / md:pt-32 clears the fixed site nav. */}
      <section className="bg-pi-navy px-5 pb-6 pt-24 text-white md:px-8 md:pb-8 md:pt-32">
        <div className="mx-auto max-w-5xl">
          <span className="text-[10px] font-bold uppercase tracking-[2.5px] text-white/60">
            QR Bank · Staff
          </span>
          <h1 className="font-display text-xl leading-tight md:text-2xl">
            Show, scan, share
          </h1>
          <p className="mt-3 border-t border-white/10 pt-3 text-[13px] leading-snug text-white/70">
            Tap a title to reveal its QR code. Show the QR to a guest at the venue.
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
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-4 lg:grid-cols-3 print:grid-cols-3">
              {section.tiles.map((tile) => (
                <QrTile key={tile.slug} tile={tile} />
              ))}
            </div>
          </section>
        ))}

        <section className="mb-9">
          <h2 className="mb-4 inline-flex items-center gap-2.5 text-[11px] font-bold uppercase tracking-[2px] text-pi-gold-dark">
            <span className="block h-[2px] w-5 bg-pi-gold-dark" />
            Festival WhatsApp groups
          </h2>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-4 lg:grid-cols-3 print:grid-cols-3">
            {[1, 2, 3].map((n) => (
              <div
                key={n}
                className="flex min-h-[120px] flex-col items-center justify-center rounded-2xl border-2 border-dashed border-pi-ink/10 p-5 text-center text-[12.5px] text-pi-ink/55 sm:min-h-[280px] sm:p-7"
              >
                <strong className="mb-1.5 text-[14px] font-semibold text-pi-ink/70">
                  Add per festival
                </strong>
                WhatsApp invite QRs go here.
              </div>
            ))}
          </div>
        </section>

        <p className="mt-6 border-t border-pi-ink/10 pt-5 text-center text-[11px] text-pi-ink/40">
          Bookmark this page on your phone — it stays up to date.
        </p>
      </main>
    </>
  );
}
