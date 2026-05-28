import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import PageHero from "@/components/page-hero";
import ContactCta from "@/components/contact-cta";
import TestimonialQuote from "@/components/testimonial-quote";
import AnimateIn from "@/components/animate-in";
import Icon from "@/components/icon";

export const metadata: Metadata = {
  title: "For Interpreters - Performance Interpreting",
  description:
    "Join Performance Interpreting as a BSL or ISL event interpreter. Work at festivals, arenas and Premier League clubs. Explore training and development at the PI Academy.",
};

const SITE = "https://performanceinterpreting.co.uk";

const INTERPRETER_FAQS: Array<{ question: string; answer: string }> = [
  {
    question: "Do I need to be NRCPD-registered to work with PI?",
    answer:
      "Yes — current NRCPD registration is required for every interpreter PI works with. This is the standard the NHS, courts and government require, and it's non-negotiable for live event work too. If you're not yet registered, the PI Academy can help with the development pathway.",
  },
  {
    question: "Do I need prior live events experience?",
    answer:
      "Prior live events experience is highly valued but not always essential. We've brought interpreters across from community, conference and educational settings — what matters more is your adaptability under pressure, your team-working, and your willingness to learn the specific demands of festivals, arenas and broadcast.",
  },
  {
    question: "How do I apply to work with PI?",
    answer:
      "Get in touch via our contact form. Tell us about your NRCPD registration, the types of events you've worked at (or would like to), your specialist vocabulary areas, and your availability. We're always building our pool ahead of festival summer and the autumn arena circuit — the earlier the better.",
  },
  {
    question: "What's the difference between PI Academy and joining PI as an interpreter?",
    answer:
      "PI Academy is our training arm — NRCPD-approved CPD courses, mentoring and the Song Club for any interpreter wanting to develop performance interpreting skills, whether or not they'll ever work for PI. Joining PI as an interpreter means being part of the team we book onto live events — festivals, arenas, broadcast and beyond. Many of our interpreters started with the Academy first.",
  },
  {
    question: "What domains does PI specialise in?",
    answer:
      "Music (concerts, festivals, tours, broadcast), sport (Premier League clubs, stadium events, broadcast), comedy, political events, awards ceremonies, broadcast and corporate. We're the appointed Deaf Access provider for Wembley Stadium and have delivered access at every major UK festival circuit. We refer dedicated theatre work to specialist partners on a case-by-case basis.",
  },
  {
    question: "Is volunteering with PI a route into interpreting work?",
    answer:
      "Volunteering gives you a real feel for live-access environments before you commit. It's open to Deaf volunteers fluent in BSL and hearing volunteers at Level 6 or above. Selected volunteers may be invited to shadow interpreters where appropriate. It's not a guaranteed pathway into paid work, but it's a great way to test whether live events is for you.",
  },
  {
    question: "Does PI provide kit and uniform?",
    answer:
      "Yes — every interpreter receives a complimentary PI t-shirt for work. Our extended kit portal offers hoodies, jackets, hats and more for interpreters who want to add to their collection, delivered direct to your door.",
  },
];

export default function InterpretersPage() {
  return (
    <>
      {/* FAQ schema for recruitment-funnel agent queries:
          'how do I join PI as an interpreter', 'do I need NRCPD?', etc. */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "FAQPage",
            mainEntity: INTERPRETER_FAQS.map((f) => ({
              "@type": "Question",
              name: f.question,
              acceptedAnswer: { "@type": "Answer", text: f.answer },
            })),
          }),
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "BreadcrumbList",
            itemListElement: [
              { "@type": "ListItem", position: 1, name: "Home", item: `${SITE}/` },
              { "@type": "ListItem", position: 2, name: "For Interpreters", item: `${SITE}/interpreters/` },
            ],
          }),
        }}
      />
      <PageHero
        title="For Interpreters"
        subtitle="Join the team shaping Deaf access at the UK and Ireland's biggest live events."
        backgroundImage="/images/interpreters-team.jpg"
      />

      {/* ─── Working with PI - image + text ────────────── */}
      <section className="section-padding section-gap">
        <div className="grid items-center gap-10 md:grid-cols-2 md:gap-16">
          <AnimateIn>
            <div className="relative aspect-[4/3] overflow-hidden rounded-2xl">
              <Image
                src="/images/arsenal-pitchside.jpg"
                alt="PI team pitchside at Arsenal's Emirates Stadium"
                fill
                className="object-cover"
              />
            </div>
          </AnimateIn>

          <AnimateIn delay={150}>
            <div>
              <p className="text-xs font-semibold uppercase tracking-widest text-pi-gold-dark">
                Working with PI
              </p>
              <h2 className="mt-3 font-display text-2xl leading-snug text-pi-ink md:text-3xl">
                Live events interpreting is its own specialism
              </h2>
              <p className="mt-5 text-lg leading-relaxed text-pi-ink/80">
                Interpreting at a festival or a Premier League match is a different discipline from a boardroom or a medical setting. The vocabulary, the pace, the physical environment, the team dynamics - all of it demands skills you won&rsquo;t pick up in a standard RSLI/CSW pathway.
              </p>
              <p className="mt-4 text-lg leading-relaxed text-pi-ink/80">
                Performance Interpreting has built a team of interpreters who thrive in this environment. If you&rsquo;re curious about live events work - or already doing it and want to work with a team that takes it seriously - we&rsquo;d like to hear from you.
              </p>
            </div>
          </AnimateIn>
        </div>
      </section>

      {/* ─── What we look for - text + image ─────────────── */}
      <section className="section-padding section-gap bg-pi-canvas-soft">
        <div className="grid items-center gap-10 md:grid-cols-2 md:gap-16">
          <AnimateIn>
            <div>
              <p className="text-xs font-semibold uppercase tracking-widest text-pi-gold-dark">
                What we look for
              </p>
              <h2 className="mt-3 font-display text-2xl leading-snug text-pi-ink md:text-3xl">
                Skills and standards
              </h2>
              <p className="mt-5 text-lg leading-relaxed text-pi-ink/80">
                All interpreters working with PI must hold current NRCPD registration. Beyond that, we look for people who are comfortable in high-energy environments and work well as part of a team under production constraints.
              </p>

              <div className="mt-8 space-y-5">
                <div className="flex items-start gap-4">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-pi-gold/10">
                    <Icon name="shield" size={18} className="text-pi-gold" />
                  </div>
                  <div>
                    <h3 className="text-sm font-semibold text-pi-ink">NRCPD registered</h3>
                    <p className="mt-0.5 text-base text-pi-ink/65">Current registration required for all PI interpreters.</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-pi-gold/10">
                    <Icon name="music" size={18} className="text-pi-gold" />
                  </div>
                  <div>
                    <h3 className="text-sm font-semibold text-pi-ink">Live event experience</h3>
                    <p className="mt-0.5 text-base text-pi-ink/65">Prior experience at concerts, festivals, sport, or theatre is highly valued.</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-pi-gold/10">
                    <Icon name="users" size={18} className="text-pi-gold" />
                  </div>
                  <div>
                    <h3 className="text-sm font-semibold text-pi-ink">Team player</h3>
                    <p className="mt-0.5 text-base text-pi-ink/65">Large events run with interpreter teams and rotation schedules.</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-pi-gold/10">
                    <Icon name="zap" size={18} className="text-pi-gold" />
                  </div>
                  <div>
                    <h3 className="text-sm font-semibold text-pi-ink">Adaptable under pressure</h3>
                    <p className="mt-0.5 text-base text-pi-ink/65">Live events don&rsquo;t always go to plan. We need calm under changing conditions.</p>
                  </div>
                </div>
              </div>
            </div>
          </AnimateIn>

          <AnimateIn delay={150} className="order-first md:order-none">
            <div className="relative aspect-[4/3] overflow-hidden rounded-2xl">
              <Image
                src="/images/festival-wide.jpg"
                alt="BSL interpreter signing at a festival with stage behind"
                fill
                className="object-cover"
              />
            </div>
          </AnimateIn>
        </div>
      </section>

      {/* ─── Academy trainee quote ──────────────────────── */}
      <section className="section-padding pt-12 md:pt-16 pb-4 md:pb-6">
        <TestimonialQuote
          quote="I attended the two day festival training weekend and was absolutely blown away by how much I came away with! They created a really supportive and safe space."
        />
      </section>

      {/* ─── PI Academy - image + text with CTA ────────── */}
      <section className="section-padding pt-6 md:pt-8 pb-16 md:pb-24">
        <div className="grid items-center gap-10 md:grid-cols-2 md:gap-16">
          <AnimateIn>
            <div className="relative aspect-[4/3] overflow-hidden rounded-2xl">
              <Image
                src="/images/pi-academy.jpg"
                alt="PI Academy participants gathered together after a training weekend"
                fill
                className="object-cover"
              />
            </div>
          </AnimateIn>

          <AnimateIn delay={150}>
            <div>
              <p className="text-xs font-semibold uppercase tracking-widest text-pi-gold-dark">
                Training &amp; Development
              </p>
              <h2 className="mt-3 font-display text-2xl leading-snug text-pi-ink md:text-3xl">
                The PI Academy
              </h2>
              <p className="mt-5 text-lg leading-relaxed text-pi-ink/80">
                Performance Interpreting&rsquo;s dedicated training platform - built specifically for interpreters who want to specialise in live events. Structured courses, hands-on mentoring and ongoing CPD you won&rsquo;t find anywhere else.
              </p>

              <div className="mt-6 space-y-3">
                <div className="flex items-start gap-3">
                  <Icon name="music" size={16} className="mt-0.5 shrink-0 text-pi-accent" />
                  <p className="text-base text-pi-ink/75">Live event vocabulary for music, sport, comedy and entertainment</p>
                </div>
                <div className="flex items-start gap-3">
                  <Icon name="users" size={16} className="mt-0.5 shrink-0 text-pi-accent" />
                  <p className="text-base text-pi-ink/75">Team interpreting at scale - rotations, handovers, long events</p>
                </div>
                <div className="flex items-start gap-3">
                  <Icon name="settings" size={16} className="mt-0.5 shrink-0 text-pi-accent" />
                  <p className="text-base text-pi-ink/75">Production coordination - sight-lines, lighting, stage comms</p>
                </div>
                <div className="flex items-start gap-3">
                  <Icon name="shield" size={16} className="mt-0.5 shrink-0 text-pi-accent" />
                  <p className="text-base text-pi-ink/75">Legal and ethical framework - Equality Act, reasonable adjustments</p>
                </div>
              </div>

              <a
                href="https://academy.performanceinterpreting.co.uk"
                target="_blank"
                rel="noopener noreferrer"
                className="mt-8 inline-flex items-center gap-2 rounded-full bg-pi-accent px-7 py-3 text-sm font-semibold text-white shadow-lg shadow-pi-accent/25 transition-all duration-200 hover:brightness-110 hover:shadow-pi-accent/40"
              >
                Explore courses at the PI Academy
                <Icon name="arrow-right" size={16} />
              </a>
            </div>
          </AnimateIn>
        </div>
      </section>

      {/* ─── Second quote ───────────────────────────────── */}
      <section className="section-padding pt-4 md:pt-6 pb-12 md:pb-16">
        <TestimonialQuote
          quote="The training offered by Performance Interpreting is invaluable. The trainers made the whole programme so welcoming. I enjoyed pushing through the boundaries of my comfort zone."
        />
      </section>

      {/* ─── Volunteering - text + image ───────────────── */}
      <section className="section-padding section-gap bg-pi-canvas-soft">
        <div className="grid items-center gap-10 md:grid-cols-2 md:gap-16">
          <AnimateIn>
            <div>
              <p className="text-xs font-semibold uppercase tracking-widest text-pi-gold-dark">
                Start here
              </p>
              <h2 className="mt-3 font-display text-2xl leading-snug text-pi-ink md:text-3xl">
                Volunteer your way in
              </h2>
              <p className="mt-5 text-lg leading-relaxed text-pi-ink/80">
                Volunteering with Performance Interpreting gives you a real feel for live-access environments before you commit to training. You&rsquo;ll support interpreter teams on site, help with logistics, and see first-hand how events run. Open to Deaf volunteers fluent in BSL, and hearing volunteers at Level 6 or above.
              </p>

              <div className="mt-6 space-y-3">
                <div className="flex items-start gap-3">
                  <Icon name="check" size={18} className="mt-0.5 shrink-0 text-pi-accent" />
                  <p className="text-base text-pi-ink/75">Welcome Deaf attendees and support coordinators</p>
                </div>
                <div className="flex items-start gap-3">
                  <Icon name="check" size={18} className="mt-0.5 shrink-0 text-pi-accent" />
                  <p className="text-base text-pi-ink/75">Help with set-up - banners, equipment, access areas</p>
                </div>
                <div className="flex items-start gap-3">
                  <Icon name="check" size={18} className="mt-0.5 shrink-0 text-pi-accent" />
                  <p className="text-base text-pi-ink/75">Free entry to events and festivals</p>
                </div>
                <div className="flex items-start gap-3">
                  <Icon name="check" size={18} className="mt-0.5 shrink-0 text-pi-accent" />
                  <p className="text-base text-pi-ink/75">Selected volunteers may be invited to shadow interpreters</p>
                </div>
              </div>

              <p className="mt-6 text-sm italic text-pi-ink/70">
                &ldquo;Working with Performance Interpreting has been such a supportive journey. Beginning as a volunteer, I was able to observe first-hand the passion and dedication of the team.&rdquo;
              </p>

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

          <AnimateIn delay={150} className="order-first md:order-none">
            <div className="relative aspect-[4/3] overflow-hidden rounded-2xl">
              <Image
                src="/images/volunteers-2.jpg"
                alt="PI volunteers at a festival"
                fill
                className="object-cover"
              />
            </div>
          </AnimateIn>
        </div>
      </section>

      {/* ─── Get in Touch - text + image ──────────────── */}
      <section className="section-padding section-gap">
        <div className="grid items-center gap-10 md:grid-cols-2 md:gap-16">
          <AnimateIn>
            <div className="relative aspect-[4/3] overflow-hidden rounded-2xl">
              <Image
                src="/images/working-with-pi.jpg"
                alt="PI interpreter signing in front of festival main stage crowd at dusk"
                fill
                className="object-cover"
              />
            </div>
          </AnimateIn>

          <AnimateIn delay={150}>
            <div>
              <p className="text-xs font-semibold uppercase tracking-widest text-pi-gold-dark">
                Get in Touch
              </p>
              <h2 className="mt-3 font-display text-2xl leading-snug text-pi-ink md:text-3xl">
                Interested in working with PI?
              </h2>
              <p className="mt-5 text-lg leading-relaxed text-pi-ink/80">
                If you hold NRCPD registration and are interested in live events interpreting work, get in touch. Tell us about your experience, the types of events you&rsquo;ve worked at (or would like to) and any specialist vocabulary areas.
              </p>
              <p className="mt-4 text-lg leading-relaxed text-pi-ink/80">
                We&rsquo;re always building our pool of interpreters ahead of our busiest seasons - festival summer and the autumn arena circuit. The earlier you&rsquo;re in touch, the better.
              </p>
              <Link
                href="/contact"
                className="mt-8 inline-flex items-center gap-2 rounded-full bg-pi-accent px-7 py-3.5 text-sm font-semibold text-white shadow-lg shadow-pi-accent/25 transition-all duration-200 hover:brightness-110 hover:shadow-pi-accent/40"
              >
                Get in touch
                <Icon name="arrow-right" size={16} />
              </Link>
            </div>
          </AnimateIn>
        </div>
      </section>

      {/* FAQs — accordion paired with FAQPage schema above */}
      <section className="section-padding pb-12">
        <div className="max-w-3xl mx-auto">
          <AnimateIn>
            <p className="text-xs font-semibold uppercase tracking-widest text-pi-gold-dark text-center">
              Common questions
            </p>
            <h2 className="mt-3 font-display text-2xl text-center text-pi-ink md:text-3xl mb-8">
              For interpreters — FAQs
            </h2>
          </AnimateIn>
          <div className="space-y-3">
            {INTERPRETER_FAQS.map((faq, i) => (
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

      {/* ─── PI Uniform ─────────────────────────────────── */}
      <section className="section-padding section-gap bg-pi-canvas-soft">
        <div className="mx-auto max-w-4xl">
          <div className="overflow-hidden rounded-2xl border border-pi-ink/10 bg-white shadow-sm">
            <div className="flex flex-col items-center gap-8 p-8 text-center md:flex-row md:text-left md:p-12 md:gap-12">
              <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-2xl bg-pi-gold/10 p-3">
                <Image
                  src="/icons/pi-icon-navy.svg"
                  alt="Performance Interpreting"
                  width={56}
                  height={56}
                  className="h-full w-full object-contain"
                />
              </div>
              <div className="flex-1">
                <p className="text-xs font-semibold uppercase tracking-widest text-pi-gold-dark">
                  Team kit
                </p>
                <h2 className="mt-2 font-display text-2xl text-pi-ink md:text-3xl">
                  Extended PI gear
                </h2>
                <p className="mt-3 text-base leading-relaxed text-pi-ink/70">
                  Every interpreter receives a complimentary PI t-shirt for work. Beyond that, our kit portal offers an extended range of branded gear - hoodies, jackets, hats and more - for those who want to add to their collection. Delivered direct to your door.
                </p>
              </div>
              <a
                href="http://performanceinterpreting.deco-apparel.com/"
                target="_blank"
                rel="noopener noreferrer"
                className="shrink-0 inline-flex items-center gap-2 rounded-full bg-pi-accent px-7 py-3.5 text-sm font-semibold text-white shadow-lg shadow-pi-accent/25 transition-all duration-200 hover:brightness-110 hover:shadow-pi-accent/40"
              >
                Browse kit
                <Icon name="arrow-right" size={16} />
              </a>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
