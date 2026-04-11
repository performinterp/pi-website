import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import PageHero from "@/components/page-hero";
import ContactCta from "@/components/contact-cta";
import AnimateIn from "@/components/animate-in";
import AppStoreButtons from "@/components/app-store-buttons";
import AppScreenshotCarousel from "@/components/app-screenshot-carousel";
import TestimonialQuote from "@/components/testimonial-quote";
import VideoFeedback from "@/components/video-feedback";
import Icon from "@/components/icon";

export const metadata: Metadata = {
  title: "For the Deaf Community - Performance Interpreting",
  description:
    "Find BSL and ISL interpreted events across the UK and Ireland with the PI Events App. Communication cards, festival checklists, speech-to-text, and more.",
};

const appFeatures = [
  {
    icon: "calendar",
    title: "Find events",
    description:
      "Search BSL and ISL interpreted events by date, location or type. Push notifications for new events near you.",
  },
  {
    icon: "check",
    title: "Check interpreting status",
    description:
      "Enter any event name to check if sign language interpreting is confirmed. No more calling venues.",
  },
  {
    icon: "hand-metal",
    title: "Request access",
    description:
      "Want an interpreter at an event that doesn't have it? Submit a request and we'll contact the organiser.",
  },
  {
    icon: "shield",
    title: "Know your rights",
    description:
      "The Equality Act 2010 says BSL access at live events is a legal right. The app explains how - in plain English.",
  },
];

const eventDayTools: {
  icon: string;
  title: string;
  description: string;
  comingSoon?: boolean;
}[] = [
  {
    icon: "users",
    title: "Communication cards",
    description: "Show staff 'I am Deaf' or 'Where is the BSL interpreter?' - one tap, full screen.",
  },
  {
    icon: "coffee",
    title: "Food & drink orders",
    description: "Build your order and show it as text. No shouting at the bar.",
  },
  {
    icon: "zap",
    title: "Emergency info",
    description: "Pre-filled safety templates. Large text, high contrast, always ready.",
  },
  {
    icon: "music",
    title: "Feel the Music",
    description: "Live sound converted to vibrations on your phone. Feel the bass and the beat.",
    comingSoon: true,
  },
  {
    icon: "settings",
    title: "Speech-to-text",
    description: "Real-time transcription of what people say around you. Tap to start.",
  },
  {
    icon: "clipboard-check",
    title: "Festival checklist",
    description: "What to bring, how to prepare, tips for Deaf attendees at outdoor events.",
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

      {/* ─── App intro ──────────────────────────────────── */}
      <section className="section-padding section-gap">
        <div className="mx-auto max-w-4xl text-center">
          <AnimateIn>
            <p className="text-xs font-semibold uppercase tracking-widest text-pi-accent">
              The PI Events App
            </p>
            <h2 className="mt-3 font-display text-3xl text-white md:text-4xl">
              Your toolkit for live events
            </h2>
            <p className="mx-auto mt-5 max-w-2xl text-lg leading-relaxed text-white/80">
              Free on iOS, Android and web. Find interpreted events, get support on the day, share feedback after.
            </p>
          </AnimateIn>
        </div>

        {/* Feature grid - 4 cards */}
        <div className="mx-auto mt-12 grid max-w-5xl gap-6 sm:grid-cols-2">
          {appFeatures.map((feature, i) => (
            <AnimateIn key={feature.title} delay={i * 80}>
              <div className="flex gap-4 rounded-2xl border border-white/10 bg-white/[0.02] p-6">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-pi-accent/10">
                  <Icon name={feature.icon} size={22} className="text-pi-accent" />
                </div>
                <div>
                  <h3 className="font-display text-lg text-white">{feature.title}</h3>
                  <p className="mt-1 text-sm leading-relaxed text-white/70">
                    {feature.description}
                  </p>
                </div>
              </div>
            </AnimateIn>
          ))}
        </div>
      </section>

      {/* ─── App screenshots carousel ──────────────────── */}
      <section className="section-padding section-gap bg-pi-deep">
        <AnimateIn>
          <div className="mx-auto max-w-4xl text-center">
            <p className="text-xs font-semibold uppercase tracking-widest text-pi-accent">
              See it in action
            </p>
            <h2 className="mt-3 font-display text-3xl text-white md:text-4xl">
              Everything you need, in your pocket
            </h2>
          </div>
        </AnimateIn>
        <AnimateIn delay={150}>
          <div className="mt-12">
            <AppScreenshotCarousel />
          </div>
        </AnimateIn>
      </section>

      {/* ─── Attendee quote ────────────────────────────── */}
      <section className="section-padding pb-0">
        <TestimonialQuote
          quote="Interpreters are nearer the main stage this year. I was pleased so I can stand watch the interpreters AND the performances."
          name="Sarah Jones"
          context="BST Hyde Park attendee"
        />
      </section>

      {/* ─── On the day ─────────────────────────────────── */}
      <section className="section-padding section-gap bg-pi-deep">
        <div className="mx-auto max-w-4xl text-center">
          <AnimateIn>
            <p className="text-xs font-semibold uppercase tracking-widest text-pi-accent">
              At the event
            </p>
            <h2 className="mt-3 font-display text-3xl text-white md:text-4xl">
              Tools you can use on the day
            </h2>
          </AnimateIn>
        </div>

        <div className="mx-auto mt-12 grid max-w-5xl gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {eventDayTools.map((tool, i) => (
            <AnimateIn key={tool.title} delay={i * 60}>
              <div className="relative rounded-2xl border border-white/10 bg-white/[0.02] p-6 text-center">
                {tool.comingSoon && (
                  <span className="absolute -right-2 -top-2 rounded-full bg-pi-gold px-3 py-1 text-[10px] font-bold uppercase tracking-wide text-pi-navy shadow-lg">
                    Coming soon
                  </span>
                )}
                <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-pi-accent/10">
                  <Icon name={tool.icon} size={22} className="text-pi-accent" />
                </div>
                <h3 className="mt-4 font-display text-lg text-white">{tool.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-white/70">
                  {tool.description}
                </p>
              </div>
            </AnimateIn>
          ))}
        </div>
      </section>

      {/* ─── What it looks like ────────────────────────── */}
      <section className="section-padding section-gap">
        <div className="mx-auto max-w-4xl text-center">
          <AnimateIn>
            <p className="text-xs font-semibold uppercase tracking-widest text-pi-accent">
              What to expect
            </p>
            <h2 className="mt-3 font-display text-3xl text-white md:text-4xl">
              What interpreted events look like
            </h2>
          </AnimateIn>
        </div>

        <div className="mx-auto mt-12 grid max-w-5xl gap-6 md:grid-cols-3">
          <AnimateIn delay={0}>
            <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-6">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-pi-accent/10">
                <Icon name="music" size={22} className="text-pi-accent" />
              </div>
              <h3 className="mt-4 font-display text-xl text-white">Concerts</h3>
              <p className="mt-2 text-sm leading-relaxed text-white/70">
                The interpreter is positioned on a raised platform near the stage
                with dedicated lighting. For longer shows, a team rotates to
                maintain quality. You'll typically be in a reserved viewing area
                with clear sight lines to both the interpreter and the
                performer.
              </p>
            </div>
          </AnimateIn>

          <AnimateIn delay={80}>
            <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-6">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-pi-accent/10">
                <Icon name="star" size={22} className="text-pi-accent" />
              </div>
              <h3 className="mt-4 font-display text-xl text-white">Festivals</h3>
              <p className="mt-2 text-sm leading-relaxed text-white/70">
                Interpreters work across multiple stages throughout the day. A
                dedicated viewing platform is set up at each interpreted stage
                with its own lighting rig. The team coordinates with production
                so you know exactly where to go for each act.
              </p>
            </div>
          </AnimateIn>

          <AnimateIn delay={160}>
            <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-6">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-pi-accent/10">
                <Icon name="heart" size={22} className="text-pi-accent" />
              </div>
              <h3 className="mt-4 font-display text-xl text-white">Sport</h3>
              <p className="mt-2 text-sm leading-relaxed text-white/70">
                At Premier League and international matches, interpreters cover
                the PA announcements, crowd atmosphere, commentary highlights
                and key moments. You'll be seated in a designated accessible
                area with a clear view of the interpreter and the pitch.
              </p>
            </div>
          </AnimateIn>
        </div>

        <AnimateIn delay={200}>
          <p className="mx-auto mt-8 max-w-2xl text-center text-sm leading-relaxed text-white/60">
            If you have specific seating requirements or questions about a
            particular event, contact us in advance and we'll do everything we
            can to help.
          </p>
        </AnimateIn>
      </section>

      {/* ─── Repeat booker quote ───────────────────────── */}
      <section className="section-padding pb-0">
        <TestimonialQuote
          quote="Great communication, great help, great organisation. Booked again for Coldplay at Wembley. More people using this service more awareness this will be!"
          name="Karen Rutter"
          context="Concert attendee, Liverpool M&S Arena"
        />
      </section>

      {/* ─── Feedback - text + video recorder ────────────── */}
      <section className="section-padding section-gap bg-pi-deep">
        <div className="grid items-start gap-10 md:grid-cols-2 md:gap-16">
          <AnimateIn>
            <div>
              <p className="text-xs font-semibold uppercase tracking-widest text-pi-accent">
                After the event
              </p>
              <h2 className="mt-3 font-display text-2xl leading-snug text-white md:text-3xl">
                Your feedback shapes future events
              </h2>
              <p className="mt-5 text-lg leading-relaxed text-white/80">
                Share your experience - written or sign language video. Your feedback goes straight to us and helps hold venues to account.
              </p>
              <div className="mt-8 flex flex-wrap gap-4">
                <a
                  href="https://tally.so/r/Y5Dd20"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-6 py-3 text-sm font-semibold text-white transition-all hover:border-pi-accent/30 hover:bg-pi-accent/10"
                >
                  <Icon name="mail" size={16} />
                  Written feedback
                </a>
                <Link
                  href="/contact"
                  className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-6 py-3 text-sm font-semibold text-white transition-all hover:border-pi-accent/30 hover:bg-pi-accent/10"
                >
                  <Icon name="clipboard-check" size={16} />
                  Photo &amp; video consent
                </Link>
              </div>
              <p className="mt-6 text-sm text-white/60">
                Or use the{" "}
                <a
                  href="https://app.performanceinterpreting.co.uk"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-semibold text-pi-accent transition-colors hover:text-white"
                >
                  PI Events App
                </a>
                {" "}for the full experience - events, tools, and feedback all in one place.
              </p>
            </div>
          </AnimateIn>

          <AnimateIn delay={150}>
            <VideoFeedback />
          </AnimateIn>
        </div>
      </section>

      {/* ─── Volunteering ─────────────────────────────────── */}
      <section className="section-padding section-gap">
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
                Volunteering is a way to be part of something bigger - welcoming Deaf attendees, supporting interpreter teams on site, and being at the heart of live access. We welcome Deaf volunteers who are fluent in BSL, and hearing volunteers at BSL Level 6 or above.
              </p>

              <div className="mt-6 space-y-3">
                <div className="flex items-start gap-3">
                  <Icon name="heart" size={18} className="mt-0.5 shrink-0 text-pi-accent" />
                  <p className="text-base text-white/70">Free entry to events and festivals</p>
                </div>
                <div className="flex items-start gap-3">
                  <Icon name="users" size={18} className="mt-0.5 shrink-0 text-pi-accent" />
                  <p className="text-base text-white/70">Meet the community and make connections</p>
                </div>
                <div className="flex items-start gap-3">
                  <Icon name="star" size={18} className="mt-0.5 shrink-0 text-pi-accent" />
                  <p className="text-base text-white/70">Experience live-access environments first-hand</p>
                </div>
              </div>

              <p className="mt-6 text-sm italic text-white/60">
                &ldquo;It&rsquo;s a community, not a commitment - I came to help, and left inspired.&rdquo;
              </p>

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

{/* ContactCta removed - doesn't fit this page */}
    </>
  );
}
