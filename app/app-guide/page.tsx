import type { Metadata } from "next";
import Link from "next/link";
import PageHero from "@/components/page-hero";
import AnimateIn from "@/components/animate-in";
import ScrollVideo from "@/components/scroll-video";
import AppStoreButtons from "@/components/app-store-buttons";
import Icon from "@/components/icon";

export const metadata: Metadata = {
  title: "The PI Events App - Full Guide",
  description:
    "See the PI Events App in action. A feature-by-feature walkthrough - find interpreted events, request access, order at the bar, know your rights, and more.",
};

type Step = {
  n: string;
  kicker: string;
  heading: string;
  bullets: string[];
  video: string;
};

// /app-guide is for the Deaf community directly \u2014 BSL-first audience.
// Bullets stay short, plain, and avoid English-sophisticated words like
// "trawl" or "friction" (which fit the organiser/B2B audience on
// /organisers, where Marie's review-language landed). Easy-Read
// principles guide the wording here.
const steps: Step[] = [
  {
    n: "01",
    kicker: "Find events",
    heading: "All BSL & ISL events in one place",
    bullets: [
      "See every event with BSL or ISL",
      "Filter by city, date, or type",
      "Get told when new events are added",
      "See tickets before they sell out",
    ],
    video: "/videos/app-guide/browse.mp4",
  },
  {
    n: "02",
    kicker: "Smart search",
    heading: "Type anything \u2014 find any event",
    bullets: [
      "Type a name, place, or city",
      "Typos are OK",
      "Find the event in seconds",
    ],
    video: "/videos/app-guide/search.mp4",
  },
  {
    n: "03",
    kicker: "Request an interpreter",
    heading: "No interpreter? Ask for one",
    bullets: [
      "Pick the event",
      "Tell us what you need",
      "The app writes the message",
      "Send it with one tap",
    ],
    video: "/videos/app-guide/request.mp4",
  },
  {
    n: "04",
    kicker: "Push notifications",
    heading: "Get told about new events",
    bullets: [
      "Pick artists, venues, or cities you like",
      "Get an alert when a new event is added",
      "See last-minute tickets too",
    ],
    video: "/videos/app-guide/notifications.mp4",
  },
  {
    n: "05",
    kicker: "BSL & ISL videos",
    heading: "All guides in BSL and ISL",
    bullets: [
      "How to book a ticket",
      "How to ask for BSL access",
      "What to do if a venue says no",
      "Made with Deaf consultants",
    ],
    video: "/videos/app-guide/videos.mp4",
  },
  {
    n: "06",
    kicker: "At-event tools",
    heading: "Help on the day",
    bullets: [
      "Show staff: \u201cI am Deaf\u201d",
      "Build a food order on screen",
      "Emergency info one tap away",
      "Works without Wi-Fi",
    ],
    video: "/videos/app-guide/order.mp4",
  },
  {
    n: "07",
    kicker: "Know your rights",
    heading: "Plain English. No legal words.",
    bullets: [
      "UK: Equality Act 2010",
      "Northern Ireland: Disability Discrimination Act 1995",
      "Ireland: Irish Sign Language Act 2017",
      "What to say if a venue refuses",
    ],
    video: "/videos/app-guide/rights.mp4",
  },
];

export default function AppGuidePage() {
  return (
    <>
      <PageHero
        title="The PI Events App"
        subtitle="A dedicated toolkit for Deaf audiences at live events."
        hideSubtitleOnMobile
        backgroundImage="/images/deaf-app-user.png"
        imagePosition="65% 30%"
        mobileImagePosition="50% 30%"
      />

      {/* ─── Download strip (top-of-page CTA) ─────────────── */}
      <section className="bg-pi-navy section-padding py-6 md:py-8">
        <div className="mx-auto flex max-w-5xl flex-col items-center gap-4 text-center md:flex-row md:justify-between md:text-left">
          <div>
            <p className="text-xs font-semibold uppercase tracking-widest text-pi-accent">
              The PI Events App - free
            </p>
            <p className="mt-1 font-display text-xl text-white md:text-2xl">
              Download now on iPhone or any other phone
            </p>
          </div>
          <AppStoreButtons variant="dark" hideSubtextOnMobile />
        </div>
      </section>

      {/* ─── Intro ────────────────────────────────────────── */}
      <section className="section-padding section-gap pb-0">
        <div className="mx-auto max-w-3xl text-center">
          <AnimateIn>
            <p className="text-xs font-semibold uppercase tracking-widest text-pi-gold-dark">
              See it in action
            </p>
            <h2 className="mt-3 font-display text-2xl leading-snug text-pi-ink md:text-3xl">
              Seven features. One short video each.
            </h2>
            <p className="mt-5 text-lg leading-relaxed text-pi-ink/80">
              Each clip plays as you scroll. No other interpreting service offers anything like this.
            </p>
            <div className="mt-6">
              <Link
                href="/deaf-community"
                className="inline-flex items-center gap-1.5 text-sm font-semibold text-pi-accent transition-colors hover:text-pi-ink"
              >
                <Icon name="arrow-right" size={14} className="rotate-180" />
                Back to Deaf Community
              </Link>
            </div>
          </AnimateIn>
        </div>
      </section>

      {/* ─── Step sections ────────────────────────────────── */}
      {steps.map((step, i) => {
        const cycle = i % 3;
        const layout = cycle === 0 ? "left" : cycle === 1 ? "right" : "center";

        return (
          <section
            key={step.n}
            className={`section-padding section-gap ${
              i % 2 === 1 ? "bg-pi-canvas-soft" : ""
            }`}
          >
            {layout === "center" ? (
              <div className="flex flex-col">
                <div className="order-2 mx-auto mt-10 max-w-3xl text-center md:order-1 md:mt-0">
                  <AnimateIn>
                    <p className="text-xs font-semibold uppercase tracking-widest text-pi-gold-dark">
                      {step.n} &middot; {step.kicker}
                    </p>
                    <h2 className="mt-3 font-display text-2xl leading-snug text-pi-ink md:text-4xl">
                      {step.heading}
                    </h2>
                    <ul className="mx-auto mt-5 max-w-2xl space-y-3 text-left text-lg leading-relaxed text-pi-ink/85 md:text-xl">
                      {step.bullets.map((b) => (
                        <li key={b} className="flex items-start gap-3">
                          <span aria-hidden="true" className="mt-2 h-2 w-2 shrink-0 rounded-full bg-pi-accent" />
                          <span>{b}</span>
                        </li>
                      ))}
                    </ul>
                  </AnimateIn>
                </div>
                <AnimateIn delay={120} className="order-1 md:order-2">
                  <div className="relative mx-auto aspect-[1700/1004] w-full max-w-5xl overflow-hidden rounded-2xl border border-pi-ink/10 bg-black shadow-2xl shadow-pi-ink/15 md:mt-10">
                    <ScrollVideo src={step.video} />
                  </div>
                </AnimateIn>
              </div>
            ) : (
              <div
                className={`mx-auto grid max-w-7xl items-center gap-8 md:grid-cols-[5fr_2fr] md:gap-12 ${
                  layout === "right" ? "md:[direction:rtl]" : ""
                }`}
              >
                <AnimateIn>
                  <div className="relative aspect-[1700/1004] w-full overflow-hidden rounded-2xl border border-pi-ink/10 bg-black shadow-2xl shadow-pi-ink/15 md:[direction:ltr]">
                    <ScrollVideo src={step.video} />
                  </div>
                </AnimateIn>
                <AnimateIn delay={120}>
                  <div className="md:[direction:ltr]">
                    <p className="text-xs font-semibold uppercase tracking-widest text-pi-gold-dark">
                      {step.n} &middot; {step.kicker}
                    </p>
                    <h2 className="mt-3 font-display text-2xl leading-snug text-pi-ink md:text-3xl">
                      {step.heading}
                    </h2>
                    <ul className="mt-4 space-y-3 text-base leading-relaxed text-pi-ink/85 md:text-lg">
                      {step.bullets.map((b) => (
                        <li key={b} className="flex items-start gap-3">
                          <span aria-hidden="true" className="mt-2 h-2 w-2 shrink-0 rounded-full bg-pi-accent" />
                          <span>{b}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </AnimateIn>
              </div>
            )}
          </section>
        );
      })}

      {/* ─── Download CTA ─────────────────────────────────── */}
      <section className="section-padding section-gap bg-pi-canvas-soft">
        <div className="mx-auto max-w-3xl text-center">
          <AnimateIn>
            <p className="text-xs font-semibold uppercase tracking-widest text-pi-gold-dark">
              Available now
            </p>
            <h2 className="mt-3 font-display text-3xl text-pi-ink md:text-4xl">
              Free on every phone
            </h2>
            <p className="mx-auto mt-5 max-w-xl text-lg leading-relaxed text-pi-ink/80">
              The PI Events App is live in both stores. Free to download, with everything you&apos;ve seen here ready to use.
            </p>
          </AnimateIn>
          <AnimateIn delay={100}>
            <div className="mt-8 flex justify-center">
              <AppStoreButtons variant="light" />
            </div>
          </AnimateIn>
        </div>
      </section>

      {/* ─── AI imagery note ──────────────────────────────── */}
      <div className="section-padding py-3">
        <p className="text-center text-[11px] tracking-wide text-pi-ink/40">
          Header image generated with AI for illustrative purposes.
        </p>
      </div>
    </>
  );
}
