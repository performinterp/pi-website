import type { Metadata } from "next";
import Link from "next/link";
import PageHero from "@/components/page-hero";
import AnimateIn from "@/components/animate-in";
import ScrollVideo from "@/components/scroll-video";
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
  video: string;
};

const steps: Step[] = [
  {
    n: "01",
    kicker: "Browse events",
    heading: "Every confirmed interpreted event, in one place",
    body: "Concerts, sports, festivals, comedy, theatre, family, literature. If interpreting is confirmed, it\u2019s listed. No guesswork for attendees, instant visibility for organisers.",
    video: "/videos/app-guide/browse.mp4",
  },
  {
    n: "02",
    kicker: "Smart search",
    heading: "Find any event - even with a vague search",
    body: "Type-ahead with fuzzy matching across events, venues and categories. Check any event to see whether interpreting is booked and confirmed.",
    video: "/videos/app-guide/search.mp4",
  },
  {
    n: "03",
    kicker: "Request access",
    heading: "No interpreter listed? Request one directly",
    body: "The app helps you build and send an access request for any event. Your voice, your rights. For organisers, every request is direct evidence of demand.",
    video: "/videos/app-guide/request.mp4",
  },
  {
    n: "04",
    kicker: "Push notifications",
    heading: "New interpreted events, straight to your lock screen",
    body: "Follow artists, venues and cities. Get a push alert the moment interpreting is confirmed or last-minute tickets are released.",
    video: "/videos/app-guide/notifications.mp4",
  },
  {
    n: "05",
    kicker: "BSL video guides",
    heading: "How to book, your rights, FAQs - all in BSL",
    body: "Seven videos recorded with Deaf consultants. Covers booking, rights, app orientation, requesting access and quick tips. Everyone arrives informed.",
    video: "/videos/app-guide/videos.mp4",
  },
  {
    n: "06",
    kicker: "Order at the bar",
    heading: "Build your order on screen and show it",
    body: "Pick items, set quantities, hand your phone over. No shouting, no repeating yourself. Works offline - useful at festivals with patchy signal.",
    video: "/videos/app-guide/order.mp4",
  },
  {
    n: "07",
    kicker: "Know your rights",
    heading: "Plain-English guide to the law behind access",
    body: "The Equality Act 2010 in England, Scotland and Wales. The DDA 1995 in Northern Ireland. The Equal Status Acts in Ireland. No legal jargon - just what you need to know.",
    video: "/videos/app-guide/rights.mp4",
  },
];

export default function AppGuidePage() {
  return (
    <>
      <PageHero
        title="The PI Events App"
        subtitle="A dedicated toolkit for Deaf audiences at live events. Coming soon to iOS and Android."
        backgroundImage="/images/deaf-app-user.png"
        imagePosition="65% 30%"
        mobileImagePosition="50% 30%"
      />

      {/* ─── Intro ────────────────────────────────────────── */}
      <section className="section-padding section-gap pb-0">
        <div className="mx-auto max-w-3xl text-center">
          <AnimateIn>
            <p className="text-xs font-semibold uppercase tracking-widest text-pi-gold">
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
              <>
                <div className="mx-auto max-w-3xl text-center">
                  <AnimateIn>
                    <p className="text-xs font-semibold uppercase tracking-widest text-pi-gold">
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
                <AnimateIn delay={120}>
                  <div className="relative mx-auto mt-10 aspect-[1700/1004] w-full max-w-5xl overflow-hidden rounded-2xl border border-pi-ink/10 bg-black shadow-2xl shadow-pi-ink/15">
                    <ScrollVideo src={step.video} />
                  </div>
                </AnimateIn>
              </>
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
                    <p className="text-xs font-semibold uppercase tracking-widest text-pi-gold">
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
            <p className="text-xs font-semibold uppercase tracking-widest text-pi-gold">
              Coming soon
            </p>
            <h2 className="mt-3 font-display text-3xl text-pi-ink md:text-4xl">
              Available soon - free on iOS and Android
            </h2>
            <p className="mx-auto mt-5 max-w-xl text-lg leading-relaxed text-pi-ink/80">
              The app is in the final stages of App Store review. Once approved, it&apos;ll be free to download on iOS and Android.
            </p>
          </AnimateIn>
          <AnimateIn delay={100}>
            <div className="mt-8 flex justify-center">
              <span className="inline-flex items-center gap-2 rounded-full border border-pi-ink/15 bg-white px-5 py-2.5 text-sm font-medium text-pi-ink/75 shadow-sm">
                <span className="h-2 w-2 rounded-full bg-pi-warmth" aria-hidden="true" />
                Awaiting Apple App Store approval
              </span>
            </div>
          </AnimateIn>
        </div>
      </section>

      {/* ─── AI imagery note ──────────────────────────────── */}
      <div className="section-padding pb-4 pt-0">
        <p className="text-center text-xs tracking-wide text-pi-ink/40">
          Header image generated with AI for illustrative purposes.
        </p>
      </div>
    </>
  );
}
