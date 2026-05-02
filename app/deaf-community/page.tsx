import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import PageHero from "@/components/page-hero";
import AnimateIn from "@/components/animate-in";
import AppStoreButtons from "@/components/app-store-buttons";
import AppScreenshotCarousel from "@/components/app-screenshot-carousel";
import ReviewCarousel from "@/components/review-carousel";
import MobileTestimonialsCarousel from "@/components/mobile-testimonials-carousel";
import MobileEventCard from "@/components/mobile-event-card";
import VideoFeedback from "@/components/video-feedback";
import Icon from "@/components/icon";

export const metadata: Metadata = {
  title: "For the Deaf Community - Performance Interpreting",
  description:
    "Find BSL and ISL interpreted events across the UK and Ireland with the PI Events App. Communication cards, festival checklists, speech-to-text, and more.",
};

const reviews = [
  {
    quote:
      "Interpreters are nearer the main stage this year. I was pleased so I can stand watch the interpreters AND the performances.",
    name: "Sarah Jones",
    context: "BST Hyde Park attendee",
    rating: 5,
  },
  {
    quote:
      "Absolutely amazing people. Wish they were at every gig. Really got everyone in the mood.",
    name: "John Williams",
    context: "Concert attendee",
    rating: 5,
  },
  {
    quote:
      "Great communication, great help, great organisation. Booked again for Coldplay at Wembley. More people using this service more awareness this will be!",
    name: "Karen Rutter",
    context: "Concert attendee, Liverpool M&S Arena",
  },
  {
    quote:
      "We couldn’t be more grateful to Performance Interpreting for their incredible work. Their amazing team of BSL interpreters brought energy, passion, and accessibility to every performance.",
    name: "Adam",
    context: "Event Organiser, Croydon PrideFest",
    rating: 5,
  },
];

const eventTypes = [
  {
    title: "Concerts",
    image: "/images/concert.jpg",
    description:
      "Interpreters on a raised platform near the stage. Reserved viewing area with clear sight lines.",
  },
  {
    title: "Festivals",
    image: "/images/festival-paul.png",
    description:
      "Interpreters across multiple stages all day. Dedicated viewing platforms with their own lighting.",
  },
  {
    title: "Sport",
    image: "/images/arsenal-pitchside.jpg",
    description:
      "PA announcements, crowd atmosphere and key moments - all interpreted. Accessible seating with a clear view.",
  },
  {
    title: "Comedy",
    image: "/images/theatre-interpreting.jpg",
    description:
      "Interpreters match the timing, tone and punchlines. Every joke lands the way it was meant to.",
  },
];

export default function DeafCommunityPage() {
  return (
    <>
      <PageHero
        title="For the Deaf Community"
        subtitle="Find interpreted events. Get support at the venue. Never miss out."
        backgroundImage="/images/deaf-community-info-point.jpg"
      />

      {/* ─── The PI Events App — carousel first ──────────── */}
      <section className="section-padding relative overflow-hidden pt-12 pb-16 md:pt-16 md:pb-20">

        <AnimateIn>
          <div className="mx-auto max-w-4xl text-center">
            <p className="text-xs font-semibold uppercase tracking-widest text-pi-gold-dark">
              The PI Events App
            </p>
            <div className="btn-shimmer mx-auto mt-2 mb-4 inline-flex items-center rounded-full bg-gradient-to-r from-pi-gold via-yellow-300 to-pi-gold px-6 py-2 shadow-xl shadow-pi-gold/20">
              <span className="text-base font-black uppercase tracking-[0.25em] text-pi-navy md:text-lg">
                100% Free
              </span>
            </div>
            <h2 className="font-display text-3xl text-pi-ink md:text-4xl">
              Everything you need, in your pocket
            </h2>
            <p className="mx-auto mt-4 max-w-xl text-base leading-relaxed text-pi-ink/70">
              Coming soon to iOS and Android.
            </p>
          </div>
        </AnimateIn>
        <AnimateIn delay={150}>
          <div className="mt-12">
            <AppScreenshotCarousel />
          </div>
        </AnimateIn>
        <AnimateIn delay={220}>
          <div className="mt-10 flex flex-col items-center justify-center gap-3 sm:flex-row sm:flex-wrap">
            <Link
              href="/events"
              className="group inline-flex items-center gap-2 rounded-full bg-pi-warmth px-7 py-3.5 text-base font-bold text-white shadow-lg shadow-pi-warmth/30 transition-all duration-200 hover:brightness-110 hover:shadow-xl hover:shadow-pi-warmth/40 hover:scale-[1.03]"
            >
              <Icon name="calendar" size={18} className="shrink-0" />
              Find interpreted events
              <Icon name="arrow-right" size={18} className="transition-transform group-hover:translate-x-1" />
            </Link>
            <Link
              href="/app-guide"
              className="btn-shimmer group inline-flex items-center gap-3 rounded-full bg-pi-accent px-8 py-4 text-base font-bold text-white shadow-lg shadow-pi-accent/30 transition-all duration-200 hover:brightness-110 hover:shadow-xl hover:shadow-pi-accent/40 hover:scale-[1.03]"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" className="shrink-0">
                <polygon points="5 3 19 12 5 21 5 3" />
              </svg>
              Watch every feature in action
              <Icon name="arrow-right" size={18} className="transition-transform group-hover:translate-x-1" />
            </Link>
          </div>
        </AnimateIn>
      </section>

      {/* ─── Reviews — rotating ──────────────────────────── */}
      <section className="section-padding section-gap bg-pi-canvas-soft">
        <AnimateIn>
          <div className="mx-auto mb-10 max-w-4xl text-center">
            <p className="text-xs font-semibold uppercase tracking-widest text-pi-gold-dark">
              From the community
            </p>
          </div>
        </AnimateIn>
        {/* Desktop: existing rotating review */}
        <AnimateIn delay={100}>
          <div className="hidden md:block">
            <ReviewCarousel reviews={reviews} />
          </div>
        </AnimateIn>

        {/* Mobile: same snap-scroll style as the home page */}
        <div className="mt-2">
          <MobileTestimonialsCarousel testimonials={reviews} />
        </div>
      </section>

      {/* ─── What interpreted events look like — visual ──── */}
      <section className="section-padding section-gap">
        <AnimateIn>
          <div className="mx-auto max-w-4xl text-center">
            <p className="text-xs font-semibold uppercase tracking-widest text-pi-gold-dark">
              What to expect
            </p>
            <h2 className="mt-3 font-display text-3xl text-pi-ink md:text-4xl">
              What interpreted events look like
            </h2>
          </div>
        </AnimateIn>

        {/* Desktop: image cards with full overlay text */}
        <div className="mx-auto mt-12 hidden max-w-6xl gap-6 md:grid md:grid-cols-2">
          {eventTypes.map((event, i) => (
            <AnimateIn key={event.title} delay={i * 100}>
              <div className="group relative overflow-hidden rounded-2xl">
                <div className="relative aspect-[16/10]">
                  <Image
                    src={event.image}
                    alt={`BSL interpreter at a ${event.title.toLowerCase()} event`}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-pi-navy/85 via-pi-navy/40 to-transparent" />
                  <div className="absolute inset-x-0 bottom-0 p-6">
                    <h3 className="font-display text-2xl text-white">
                      {event.title}
                    </h3>
                    <p className="mt-2 text-sm leading-relaxed text-white/85">
                      {event.description}
                    </p>
                  </div>
                </div>
              </div>
            </AnimateIn>
          ))}
        </div>

        {/* Mobile: title-only cards, tap to reveal description */}
        <div className="mx-auto mt-10 flex max-w-2xl flex-col gap-4 md:hidden">
          {eventTypes.map((event) => (
            <MobileEventCard
              key={event.title}
              title={event.title}
              image={event.image}
              description={event.description}
            />
          ))}
        </div>

        <AnimateIn delay={400}>
          <div className="mx-auto mt-8 flex max-w-2xl flex-col items-center gap-4 text-center">
            <p className="text-sm leading-relaxed text-pi-ink/65">
              Specific seating requirements? Contact us in advance and
              we&rsquo;ll do everything we can to help.
            </p>
            <Link
              href="/contact"
              className="inline-flex items-center gap-2 rounded-full border border-pi-accent/30 bg-pi-accent/5 px-5 py-2.5 text-sm font-semibold text-pi-accent transition-all hover:bg-pi-accent hover:text-white"
            >
              Get in touch
              <Icon name="arrow-right" size={14} />
            </Link>
          </div>
        </AnimateIn>
      </section>

      {/* ─── Volunteering ─────────────────────────────────── */}
      <section className="section-padding section-gap bg-pi-canvas-soft">
        <div className="grid items-center gap-10 md:grid-cols-2 md:gap-16">
          <AnimateIn>
            <div className="relative aspect-[4/3] overflow-hidden rounded-2xl">
              <Image
                src="/images/volunteers.jpg"
                alt="Volunteers at a PI event"
                fill
                className="object-cover"
              />
            </div>
          </AnimateIn>

          <AnimateIn delay={150}>
            <div>
              <p className="text-xs font-semibold uppercase tracking-widest text-pi-gold-dark">
                Get involved
              </p>
              <h2 className="mt-3 font-display text-2xl leading-snug text-pi-ink md:text-3xl">
                Volunteer with Performance Interpreting
              </h2>
              <p className="mt-5 text-lg leading-relaxed text-pi-ink/80">
                Welcome Deaf attendees, support interpreter teams on site, be at
                the heart of live access. We welcome Deaf volunteers fluent in
                BSL, and hearing volunteers at BSL Level 6 or above.
              </p>

              <div className="mt-6 space-y-3">
                <div className="flex items-start gap-3">
                  <Icon
                    name="heart"
                    size={18}
                    className="mt-0.5 shrink-0 text-pi-accent"
                  />
                  <p className="text-base text-pi-ink/75">
                    Free entry to events and festivals
                  </p>
                </div>
                <div className="flex items-start gap-3">
                  <Icon
                    name="users"
                    size={18}
                    className="mt-0.5 shrink-0 text-pi-accent"
                  />
                  <p className="text-base text-pi-ink/75">
                    Meet the community and make connections
                  </p>
                </div>
                <div className="flex items-start gap-3">
                  <Icon
                    name="star"
                    size={18}
                    className="mt-0.5 shrink-0 text-pi-accent"
                  />
                  <p className="text-base text-pi-ink/75">
                    Experience live-access environments first-hand
                  </p>
                </div>
              </div>

              <a
                href="https://tally.so/r/wvQ0Kl"
                target="_blank"
                rel="noopener noreferrer"
                className="mt-8 inline-flex items-center gap-2 text-sm font-semibold text-pi-accent transition-colors hover:text-pi-ink"
              >
                Register your interest
                <Icon name="arrow-right" size={16} />
              </a>
            </div>
          </AnimateIn>
        </div>
      </section>

      {/* ─── Feedback — Tally embed + video recorder ────── */}
      <section className="section-padding section-gap">
        <AnimateIn>
          <div className="mx-auto max-w-4xl text-center">
            <p className="text-xs font-semibold uppercase tracking-widest text-pi-gold-dark">
              After the event
            </p>
            <h2 className="mt-3 font-display text-2xl leading-snug text-pi-ink md:text-3xl">
              Your feedback shapes future events
            </h2>
            <p className="mt-4 text-base leading-relaxed text-pi-ink/70">
              Share your experience - written or sign language video. Your
              feedback goes straight to us and helps hold venues to account.
            </p>
          </div>
        </AnimateIn>

        <div className="mx-auto mt-10 grid max-w-5xl items-stretch gap-8 md:grid-cols-2 md:gap-10">
          {/* Tally embed */}
          <AnimateIn>
            <div className="h-full overflow-hidden rounded-2xl border border-pi-ink/10 bg-white shadow-sm">
              <iframe
                src="https://tally.so/embed/Y5Dd20?alignLeft=1&hideTitle=1&transparentBackground=1"
                title="Event feedback form"
                width="100%"
                height="100%"
                style={{ minHeight: 360 }}
                className="border-0"
                loading="lazy"
              />
            </div>
          </AnimateIn>

          {/* Video feedback */}
          <AnimateIn delay={150}>
            <div className="flex h-full flex-col">
              <VideoFeedback />
            </div>
          </AnimateIn>
        </div>

        {/* Photo & video consent — separate container */}
        <AnimateIn delay={200}>
          <div className="mx-auto mt-10 max-w-2xl rounded-2xl border border-pi-ink/10 bg-white px-6 py-6 text-center shadow-sm">
            <div className="flex flex-col items-center gap-3 sm:flex-row sm:justify-center sm:gap-4">
              <div className="text-left sm:text-center">
                <p className="text-sm font-semibold text-pi-ink">
                  Happy to appear in event photos or videos?
                </p>
                <p className="mt-1 text-xs text-pi-ink/65">
                  Entirely optional. You can withdraw consent at any time.
                </p>
              </div>
              <a
                href="https://docs.google.com/forms/d/e/1FAIpQLSeUKd3cA2qrMl3mbri1ASi0l4CAKci7THRdG6lVxdGShoGC7g/viewform"
                target="_blank"
                rel="noopener noreferrer"
                className="shrink-0 inline-flex items-center gap-2 rounded-full border border-pi-ink/15 bg-pi-canvas-soft px-5 py-2.5 text-sm font-semibold text-pi-ink transition-all hover:border-pi-accent/40 hover:bg-pi-accent/10"
              >
                <Icon name="clipboard-check" size={16} />
                Photo &amp; video consent
              </a>
            </div>
          </div>
        </AnimateIn>
      </section>

      {/* ─── Coming soon ───────────────────────────────── */}
      <section className="section-padding section-gap bg-pi-canvas-soft">
        <div className="mx-auto max-w-3xl text-center">
          <AnimateIn>
            <p className="text-xs font-semibold uppercase tracking-widest text-pi-gold-dark">
              The PI Events App
            </p>
            <h2 className="mt-3 font-display text-3xl text-pi-ink md:text-4xl">
              Available soon - free on iOS and Android
            </h2>
            <p className="mx-auto mt-5 max-w-xl text-lg leading-relaxed text-pi-ink/80">
              Events, tools, rights, feedback - all in one place. Awaiting Apple App Store approval.
            </p>
          </AnimateIn>
          <AnimateIn delay={100}>
            <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
              <span className="inline-flex items-center gap-2 rounded-full border border-pi-warmth/40 bg-pi-warmth/10 px-5 py-2.5 text-sm font-semibold text-pi-ink">
                <span className="h-2 w-2 rounded-full bg-pi-warmth" />
                Awaiting App Store approval
              </span>
              <Link
                href="/app-guide"
                className="inline-flex items-center gap-2 rounded-full bg-pi-accent px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-pi-accent/25 transition-all hover:brightness-110"
              >
                See the full app guide
                <Icon name="arrow-right" size={16} />
              </Link>
            </div>
          </AnimateIn>
        </div>
      </section>
    </>
  );
}
