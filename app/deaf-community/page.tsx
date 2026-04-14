import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import PageHero from "@/components/page-hero";
import AnimateIn from "@/components/animate-in";
import AppStoreButtons from "@/components/app-store-buttons";
import AppScreenshotCarousel from "@/components/app-screenshot-carousel";
import ReviewCarousel from "@/components/review-carousel";
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
      "We couldn\u2019t be more grateful to Performance Interpreting for their incredible work. Their amazing team of BSL interpreters brought energy, passion, and accessibility to every performance.",
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
    image: "/images/football-stadium.jpg",
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
        backgroundImage="/images/festival-wide.jpg"
      />

      {/* ─── The PI Events App — carousel first ──────────── */}
      <section className="section-padding relative overflow-hidden pt-8 pb-16 md:pt-12 md:pb-20">

        <AnimateIn>
          <div className="mx-auto max-w-4xl text-center">
            <p className="text-xs font-semibold uppercase tracking-widest text-pi-accent">
              The PI Events App
            </p>
            <div className="btn-shimmer mx-auto mt-1 mb-4 inline-flex items-center rounded-full bg-gradient-to-r from-pi-gold via-yellow-300 to-pi-gold px-6 py-2 shadow-xl shadow-pi-gold/20">
              <span className="text-base font-black uppercase tracking-[0.25em] text-pi-navy md:text-lg">
                100% Free
              </span>
            </div>
            <h2 className="font-display text-3xl text-white md:text-4xl">
              Everything you need, in your pocket
            </h2>
            <p className="mx-auto mt-4 max-w-xl text-base leading-relaxed text-white/70">
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
          <div className="mt-10 flex justify-center">
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
      <section className="section-padding section-gap bg-pi-deep">
        <AnimateIn>
          <div className="mx-auto mb-10 max-w-4xl text-center">
            <p className="text-xs font-semibold uppercase tracking-widest text-pi-accent">
              From the community
            </p>
          </div>
        </AnimateIn>
        <AnimateIn delay={100}>
          <ReviewCarousel reviews={reviews} />
        </AnimateIn>
      </section>

      {/* ─── What interpreted events look like — visual ──── */}
      <section className="section-padding section-gap">
        <AnimateIn>
          <div className="mx-auto max-w-4xl text-center">
            <p className="text-xs font-semibold uppercase tracking-widest text-pi-accent">
              What to expect
            </p>
            <h2 className="mt-3 font-display text-3xl text-white md:text-4xl">
              What interpreted events look like
            </h2>
          </div>
        </AnimateIn>

        <div className="mx-auto mt-12 grid max-w-6xl gap-6 md:grid-cols-2">
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
                  <div className="absolute inset-0 bg-gradient-to-t from-pi-navy via-pi-navy/50 to-transparent" />
                  <div className="absolute inset-x-0 bottom-0 p-6">
                    <h3 className="font-display text-2xl text-white">
                      {event.title}
                    </h3>
                    <p className="mt-2 text-sm leading-relaxed text-white/80">
                      {event.description}
                    </p>
                  </div>
                </div>
              </div>
            </AnimateIn>
          ))}
        </div>

        <AnimateIn delay={400}>
          <p className="mx-auto mt-8 max-w-2xl text-center text-sm leading-relaxed text-white/60">
            Specific seating requirements? Contact us in advance and
            we&rsquo;ll do everything we can to help.
          </p>
        </AnimateIn>
      </section>

      {/* ─── Volunteering ─────────────────────────────────── */}
      <section className="section-padding section-gap bg-pi-deep">
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
              <p className="text-xs font-semibold uppercase tracking-widest text-pi-accent">
                Get involved
              </p>
              <h2 className="mt-3 font-display text-2xl leading-snug text-white md:text-3xl">
                Volunteer with Performance Interpreting
              </h2>
              <p className="mt-5 text-lg leading-relaxed text-white/80">
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
                  <p className="text-base text-white/70">
                    Free entry to events and festivals
                  </p>
                </div>
                <div className="flex items-start gap-3">
                  <Icon
                    name="users"
                    size={18}
                    className="mt-0.5 shrink-0 text-pi-accent"
                  />
                  <p className="text-base text-white/70">
                    Meet the community and make connections
                  </p>
                </div>
                <div className="flex items-start gap-3">
                  <Icon
                    name="star"
                    size={18}
                    className="mt-0.5 shrink-0 text-pi-accent"
                  />
                  <p className="text-base text-white/70">
                    Experience live-access environments first-hand
                  </p>
                </div>
              </div>

              <a
                href="https://tally.so/r/wvQ0Kl"
                target="_blank"
                rel="noopener noreferrer"
                className="mt-8 inline-flex items-center gap-2 text-sm font-semibold text-pi-accent transition-colors hover:text-white"
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
            <p className="text-xs font-semibold uppercase tracking-widest text-pi-accent">
              After the event
            </p>
            <h2 className="mt-3 font-display text-2xl leading-snug text-white md:text-3xl">
              Your feedback shapes future events
            </h2>
            <p className="mt-4 text-base leading-relaxed text-white/70">
              Share your experience - written or sign language video. Your
              feedback goes straight to us and helps hold venues to account.
            </p>
          </div>
        </AnimateIn>

        <div className="mx-auto mt-10 grid max-w-5xl items-stretch gap-8 md:grid-cols-2 md:gap-10">
          {/* Tally embed */}
          <AnimateIn>
            <div className="h-full overflow-hidden rounded-2xl border border-white/10 bg-white">
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
          <div className="mx-auto mt-10 max-w-2xl rounded-2xl border border-white/10 bg-white/[0.03] px-6 py-6 text-center">
            <div className="flex flex-col items-center gap-3 sm:flex-row sm:justify-center sm:gap-4">
              <div className="text-left sm:text-center">
                <p className="text-sm font-semibold text-white">
                  Happy to appear in event photos or videos?
                </p>
                <p className="mt-1 text-xs text-white/50">
                  Entirely optional. You can withdraw consent at any time.
                </p>
              </div>
              <a
                href="https://docs.google.com/forms/d/e/1FAIpQLSeUKd3cA2qrMl3mbri1ASi0l4CAKci7THRdG6lVxdGShoGC7g/viewform"
                target="_blank"
                rel="noopener noreferrer"
                className="shrink-0 inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-5 py-2.5 text-sm font-semibold text-white transition-all hover:border-pi-accent/30 hover:bg-pi-accent/10"
              >
                <Icon name="clipboard-check" size={16} />
                Photo &amp; video consent
              </a>
            </div>
          </div>
        </AnimateIn>
      </section>

      {/* ─── Download ───────────────────────────────────── */}
      <section className="section-padding section-gap bg-pi-deep">
        <div className="mx-auto max-w-3xl text-center">
          <AnimateIn>
            <p className="text-xs font-semibold uppercase tracking-widest text-pi-accent">
              Download the app
            </p>
            <h2 className="mt-3 font-display text-3xl text-white md:text-4xl">
              Free on iOS and Android
            </h2>
            <p className="mx-auto mt-5 max-w-xl text-lg leading-relaxed text-white/80">
              Events, tools, rights, feedback - all in one place.
            </p>
          </AnimateIn>
          <AnimateIn delay={100}>
            <div className="mt-8 flex justify-center">
              <AppStoreButtons />
            </div>
          </AnimateIn>
        </div>
      </section>
    </>
  );
}
