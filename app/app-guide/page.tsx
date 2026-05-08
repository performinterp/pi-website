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

// Step copy applies Marie's review notes from her CityLit slide audit
// (2026-05-08), kept as short bullets \u2014 the original slide format \u2014
// because the audience is BSL-first and reads visuals/motion before text.
// Long paragraphs lose this audience; bullets stay scannable.
const steps: Step[] = [
  {
    n: "01",
    kicker: "Find events with BSL & ISL",
    heading: "Every confirmed event, in one place",
    bullets: [
      "Only events with BSL or ISL confirmed or on request",
      "No more trawling venue websites",
      "Push alerts the moment a new event is added",
      "Find out early \u2014 not after it sells out",
    ],
    video: "/videos/app-guide/browse.mp4",
  },
  {
    n: "02",
    kicker: "Smart search",
    heading: "Find any event \u2014 even with a vague search",
    bullets: [
      "Type-ahead with fuzzy matching",
      "Searches event names, venues, interpreters, cities",
      "Typos are fine",
    ],
    video: "/videos/app-guide/search.mp4",
  },
  {
    n: "03",
    kicker: "Request an interpreter \u2014 guided",
    heading: "No interpreter listed? Request one",
    bullets: [
      "Choose the event",
      "Describe your needs",
      "The app writes the message for you",
      "No drafting, no phone calls, no uncertainty",
    ],
    video: "/videos/app-guide/request.mp4",
  },
  {
    n: "04",
    kicker: "Push notifications",
    heading: "New events, straight to your lock screen",
    bullets: [
      "Follow artists, venues and cities",
      "Alerts the moment interpreting is confirmed",
      "Last-minute ticket releases too",
    ],
    video: "/videos/app-guide/notifications.mp4",
  },
  {
    n: "05",
    kicker: "BSL & ISL video guides",
    heading: "All in BSL and ISL",
    bullets: [
      "How to book",
      "How to request an interpreter",
      "What to do if a venue says no",
      "Recorded with Deaf consultants",
    ],
    video: "/videos/app-guide/videos.mp4",
  },
  {
    n: "06",
    kicker: "At-event tools",
    heading: "Communication cards, food orders, emergency info",
    bullets: [
      "Show staff cards \u2014 \u201cI am Deaf\u201d, \u201cplease face me\u201d",
      "Build a food order on screen",
      "Emergency info one tap away",
      "Works without Wi-Fi",
    ],
    video: "/videos/app-guide/order.mp4",
  },
  {
    n: "07",
    kicker: "Know your rights",
    heading: "Plain English. No legal jargon.",
    bullets: [
      "Equality Act 2010 (England, Scotland, Wales)",
      "Disability Discrimination Act 1995 (Northern Ireland)",
      "Irish Sign Language Act 2017 (Ireland)",
      "What to do if a venue says no",
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
