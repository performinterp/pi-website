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

const DEAF_COMMUNITY_FAQS: Array<{ question: string; answer: string }> = [
  {
    question: "How do I find a BSL or ISL interpreted event?",
    answer:
      "The PI Events App lists every BSL and ISL interpreted event Performance Interpreting is involved with — festivals, sport, arenas, theatre, comedy, broadcast. You'll see the date, venue, performers, and the names of the interpreters working that show. Download is free.",
  },
  {
    question: "Is the PI Events App free?",
    answer:
      "Yes — completely free on iOS and Android. No ads, no in-app purchases. We built it as part of our commitment to the Deaf community, not as a revenue product.",
  },
  {
    question: "Can I request an interpreter at an event that isn't listed?",
    answer:
      "Yes. If you've spotted an event you'd like access at, you can request interpretation through the app or directly via our website. We'll talk to the organiser and try to make it happen — whether that's a one-off request or pushing for proactive access on future shows.",
  },
  {
    question: "Are PI interpreters NRCPD-registered?",
    answer:
      "Yes — every interpreter PI works with is NRCPD-registered (or, in Ireland, equivalently qualified). NRCPD is the national regulator for BSL interpreting in the UK. You can verify any of our interpreters on the NRCPD public register.",
  },
  {
    question: "Do you cover ISL events in Ireland?",
    answer:
      "Yes. We provide Irish Sign Language interpreting across Ireland and Northern Ireland for events using ISL, and BSL interpreting where that's the appropriate language. ISL and BSL are distinct languages — we'll always provide the right one for the audience.",
  },
  {
    question: "What is 'proactive access' and which events have it?",
    answer:
      "Proactive access means BSL interpreting is provided as standard at every event — without anyone needing to request it. Wembley Stadium is the leading example, where PI provides BSL interpreting at every event as default. We're working to extend this model across more venues.",
  },
  {
    question: "What if I have feedback about an interpreted event I attended?",
    answer:
      "We welcome it — good or bad. The PI Events App has a built-in feedback tool for any event you attend, and it goes directly to the team. We use this to improve provision at future events.",
  },
];

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

      {/* ─── Easy-Read variant ─────────────────────────────
          Three core actions for low-fluency users: get the app, find an
          event, ask for an interpreter. Hidden by default. */}
      <section className="er-only section-padding section-gap">
        <div className="mx-auto max-w-2xl">
          <h2 className="font-display text-3xl text-pi-ink md:text-4xl">
            Welcome
          </h2>
          <p className="mt-4 text-lg leading-relaxed text-pi-ink/80">
            We help Deaf people enjoy live events.
          </p>
          <p className="mt-3 text-lg leading-relaxed text-pi-ink/80">
            Three ways to use this site:
          </p>

          <div className="mt-8 space-y-4">
            <div className="rounded-2xl border border-pi-ink/10 bg-white p-5">
              <h3 className="font-display text-xl text-pi-ink">
                <span aria-hidden="true">📱</span> 1. Get the app
              </h3>
              <p className="mt-2 text-base leading-relaxed text-pi-ink/80">
                Free. See all our events on your phone.
              </p>
              <div className="mt-4">
                <AppStoreButtons variant="light" hideSubtextOnMobile />
              </div>
            </div>

            <div className="rounded-2xl border border-pi-ink/10 bg-white p-5">
              <h3 className="font-display text-xl text-pi-ink">
                <span aria-hidden="true">👁</span> 2. Find an event
              </h3>
              <p className="mt-2 text-base leading-relaxed text-pi-ink/80">
                See concerts, sport, festivals, theatre and comedy.
              </p>
              <Link
                href="/events"
                className="mt-4 inline-flex items-center gap-2 rounded-full bg-pi-accent px-6 py-2.5 text-base font-bold text-white transition hover:brightness-110"
              >
                See events →
              </Link>
            </div>

            <div className="rounded-2xl border border-pi-ink/10 bg-white p-5">
              <h3 className="font-display text-xl text-pi-ink">
                <span aria-hidden="true">✉️</span> 3. Ask for an interpreter
              </h3>
              <p className="mt-2 text-base leading-relaxed text-pi-ink/80">
                Want an event in BSL or ISL? We will ask the venue for you.
              </p>
              <Link
                href="/events/request"
                className="mt-4 inline-flex items-center gap-2 rounded-full bg-pi-warmth-strong px-6 py-2.5 text-base font-bold text-white transition hover:brightness-110"
              >
                Ask now →
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ─── Standard variant — hidden in Easy-Read ─────── */}
      <div className="er-hide contents">

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
              Available now on iPhone and any other phone.
            </p>
            <div className="mt-6 flex justify-center">
              <AppStoreButtons variant="light" hideSubtextOnMobile />
            </div>
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
            <div
              id="volunteer"
              className="relative aspect-[4/3] overflow-hidden rounded-2xl scroll-mt-40"
            >
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
                className="mt-8 inline-flex items-center gap-2 rounded-full bg-pi-accent px-6 py-3 text-base font-bold text-white shadow-md shadow-pi-accent/25 transition-all hover:brightness-110 hover:shadow-lg hover:shadow-pi-accent/35 hover:scale-[1.02]"
              >
                Register your interest
                <Icon name="arrow-right" size={16} />
              </a>
            </div>
          </AnimateIn>
        </div>
      </section>

      {/* ─── Feedback — Tally embed + video recorder ────── */}
      <section id="feedback" className="scroll-mt-24 section-padding section-gap">
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
                href="/photo-consent"
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

      {/* ─── Download the app ──────────────────────────── */}
      <section className="section-padding section-gap bg-pi-canvas-soft">
        <div className="mx-auto max-w-3xl text-center">
          <AnimateIn>
            <p className="text-xs font-semibold uppercase tracking-widest text-pi-gold-dark">
              The PI Events App
            </p>
            <h2 className="mt-3 font-display text-3xl text-pi-ink md:text-4xl">
              Free on every phone
            </h2>
            <p className="mx-auto mt-5 max-w-xl text-lg leading-relaxed text-pi-ink/80">
              Events, tools, rights, feedback - all in one place. Download free from the App Store (iPhone) or the Google Play Store (every other phone — Samsung, Sony, OnePlus, Huawei, Google Pixel and more, already installed on yours).
            </p>
          </AnimateIn>
          <AnimateIn delay={100}>
            <div className="mt-8 flex justify-center">
              <AppStoreButtons variant="light" />
            </div>
          </AnimateIn>
          <AnimateIn delay={180}>
            <div className="mt-6 flex justify-center">
              <Link
                href="/app-guide"
                className="inline-flex items-center gap-2 text-sm font-semibold text-pi-accent transition-colors hover:text-pi-ink"
              >
                See the full app guide
                <Icon name="arrow-right" size={16} />
              </Link>
            </div>
          </AnimateIn>
        </div>
      </section>

      {/* FAQs — visible accordion mirrored by FAQPage schema */}
      <section className="section-padding pb-16">
        <div className="max-w-3xl mx-auto">
          <AnimateIn>
            <h2 className="font-display text-2xl font-bold text-center mb-2 text-pi-ink md:text-3xl">
              Common questions
            </h2>
            <p className="text-sm text-pi-ink/55 text-center mb-8">
              From the Deaf community on access, the PI Events App, and how to request interpretation.
            </p>
          </AnimateIn>
          <div className="space-y-3">
            {DEAF_COMMUNITY_FAQS.map((faq, i) => (
              <AnimateIn key={i}>
                <details className="group rounded-2xl border border-pi-ink/15 bg-white overflow-hidden">
                  <summary className="px-6 py-5 cursor-pointer font-medium text-pi-ink/80 hover:text-pi-ink flex items-center justify-between transition-colors">
                    {faq.question}
                    <svg className="w-5 h-5 text-pi-ink/40 group-open:rotate-180 transition-transform flex-shrink-0 ml-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </summary>
                  <div className="px-6 pb-5 text-sm text-pi-ink/65 leading-relaxed">{faq.answer}</div>
                </details>
              </AnimateIn>
            ))}
          </div>
        </div>
      </section>

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "FAQPage",
            mainEntity: DEAF_COMMUNITY_FAQS.map((f) => ({
              "@type": "Question",
              name: f.question,
              acceptedAnswer: { "@type": "Answer", text: f.answer },
            })),
          }),
        }}
      />

      </div>
    </>
  );
}
