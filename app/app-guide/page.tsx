import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import PageHero from "@/components/page-hero";
import AnimateIn from "@/components/animate-in";
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
  body: string;
  image: string;
  imageAlt: string;
};

// Step copy applies Marie's review notes from her CityLit slide audit
// (2026-05-08) \u2014 landing here on the website rather than re-rendering the
// slides with text baked in, so future copy edits stay in code (and so
// screen readers can read them).
const steps: Step[] = [
  {
    n: "01",
    kicker: "Find events with BSL & ISL",
    heading: "Every confirmed interpreted event, in one place",
    body: "Before this, finding an accessible event meant trawling venue websites, not being able to call box offices, trying to book any ticket and hoping for the best. The app only shows events where BSL or ISL is confirmed or available on request, and push notifications alert you the moment a new event is added \u2014 so you find out early. Not after it sells out.",
    image: "/images/app-guide/01-browse-events.png",
    imageAlt: "PI Events app: Browse Events screen showing categories (Concert, Sports, Festival, Comedy, Family, Literature, Theatre, Dance, Other) with event counts.",
  },
  {
    n: "02",
    kicker: "Smart search",
    heading: "Find any event \u2014 even with a vague search",
    body: "Type-ahead with fuzzy matching across events, venues, interpreters and categories. Search for what you're thinking of, even if you're not sure of the spelling, and the app surfaces what's interpreted.",
    image: "/images/app-guide/02-search.png",
    imageAlt: "PI Events app: Search screen showing fuzzy match results for an event with confirmed interpreters.",
  },
  {
    n: "03",
    kicker: "Request an interpreter \u2014 guided",
    heading: "No interpreter listed? Request one directly",
    body: "For many Deaf people, requesting an interpreter is something they've never done. Who do you contact? What do you say? Will they refuse access? The app removes all of that. Choose the event, describe your needs and it generates a request ready to send. No drafting, no uncertainty, no phone calls.",
    image: "/images/app-guide/03-request.png",
    imageAlt: "PI Events app: Request an interpreter screen showing a generated message ready to send to the venue.",
  },
  {
    n: "04",
    kicker: "Push notifications",
    heading: "New interpreted events, straight to your lock screen",
    body: "Follow artists, venues and cities. Get a push alert the moment interpreting is confirmed or last-minute tickets are released.",
    image: "/images/app-guide/04-notifications.png",
    imageAlt: "PI Events app: Events list showing newly added interpreted events.",
  },
  {
    n: "05",
    kicker: "BSL & ISL video guides",
    heading: "How to book, your rights, FAQs \u2014 in BSL and ISL",
    body: "A full library of BSL and ISL video guides covering how to book, how to request an interpreter, what to do if a venue says no, and more. Recorded with Deaf consultants \u2014 everyone arrives informed.",
    image: "/images/app-guide/05-bsl-videos.png",
    imageAlt: "PI Events app: BSL & ISL Videos screen listing topic videos including App Guide, How to Book, Request Interpreter, Browse & Search, At the Event, Booking Guidance and Know Your Rights.",
  },
  {
    n: "06",
    kicker: "At-event tools",
    heading: "Communication cards, food orders and emergency info \u2014 no Wi-Fi needed",
    body: "Pre-made communication cards work the moment you walk through the doors \u2014 no Wi-Fi required. Build a food and drink order on screen and show it at the bar. Emergency information is one tap away. Designed for noisy, crowded, signal-poor venues.",
    image: "/images/app-guide/06-order.png",
    imageAlt: "PI Events app: At-event order builder showing items selected and ready to show to bar staff.",
  },
  {
    n: "07",
    kicker: "Know your rights",
    heading: "Plain English guide to your rights",
    body: "Many Deaf people don't ask for access because they don't know they're entitled to it, or they've been turned down before and assume it'll happen again. The app explains your rights plainly \u2014 without legal jargon. The Equality Act 2010 (England, Scotland, Wales). The Disability Discrimination Act 1995 (Northern Ireland). The Irish Sign Language Act 2017 (Ireland).",
    image: "/images/app-guide/07-rights.png",
    imageAlt: "PI Events app: Know Your Rights screen with plain-English explanation of disability access law in the UK and Ireland.",
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
                    <p className="mx-auto mt-5 max-w-2xl text-lg leading-relaxed text-pi-ink/80">
                      {step.body}
                    </p>
                  </AnimateIn>
                </div>
                <AnimateIn delay={120} className="order-1 md:order-2">
                  <div className="relative mx-auto w-full max-w-[300px] md:mt-10">
                    <Image
                      src={step.image}
                      alt={step.imageAlt}
                      width={1206}
                      height={2622}
                      sizes="(min-width: 768px) 300px, 80vw"
                      className="h-auto w-full rounded-[2rem]"
                    />
                  </div>
                </AnimateIn>
              </div>
            ) : (
              <div
                className={`mx-auto grid max-w-5xl items-center gap-8 md:grid-cols-[1fr_2fr] md:gap-12 ${
                  layout === "right" ? "md:[direction:rtl]" : ""
                }`}
              >
                <AnimateIn>
                  <div className="relative mx-auto w-full max-w-[280px] md:[direction:ltr]">
                    <Image
                      src={step.image}
                      alt={step.imageAlt}
                      width={1206}
                      height={2622}
                      sizes="(min-width: 768px) 280px, 80vw"
                      className="h-auto w-full rounded-[2rem]"
                    />
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
                    <p className="mt-4 text-base leading-relaxed text-pi-ink/80 md:text-lg">
                      {step.body}
                    </p>
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
