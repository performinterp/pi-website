import type { Metadata } from "next";
import Image from "next/image";
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

export default function InterpretersPage() {
  return (
    <>
      <PageHero
        title="For Interpreters"
        subtitle="Join the team shaping Deaf access at the UK and Ireland's biggest live events."
        backgroundImage="/images/festival-crowd-wide.jpg"
      />

      {/* ─── Working with PI - image + text ────────────── */}
      <section className="section-padding section-gap">
        <div className="grid items-center gap-10 md:grid-cols-2 md:gap-16">
          <AnimateIn>
            <div className="relative aspect-[4/3] overflow-hidden rounded-2xl">
              <Image
                src="/images/festival-energy.jpg"
                alt="PI interpreter celebrating at a festival"
                fill
                className="object-cover"
              />
            </div>
          </AnimateIn>

          <AnimateIn delay={150}>
            <div>
              <p className="text-xs font-semibold uppercase tracking-widest text-pi-accent">
                Working with PI
              </p>
              <h2 className="mt-3 font-display text-2xl leading-snug text-white md:text-3xl">
                Live events interpreting is its own specialism
              </h2>
              <p className="mt-5 text-lg leading-relaxed text-white/80">
                Interpreting at a festival or a Premier League match is a different discipline from a boardroom or a medical setting. The vocabulary, the pace, the physical environment, the team dynamics - all of it demands skills you won&rsquo;t pick up in a standard RSLI/CSW pathway.
              </p>
              <p className="mt-4 text-lg leading-relaxed text-white/80">
                Performance Interpreting has built a team of interpreters who thrive in this environment. If you&rsquo;re curious about live events work - or already doing it and want to work with a team that takes it seriously - we&rsquo;d like to hear from you.
              </p>
            </div>
          </AnimateIn>
        </div>
      </section>

      {/* ─── What we look for - text + image ─────────────── */}
      <section className="section-padding section-gap bg-pi-deep">
        <div className="grid items-center gap-10 md:grid-cols-2 md:gap-16">
          <AnimateIn>
            <div>
              <p className="text-xs font-semibold uppercase tracking-widest text-pi-accent">
                What we look for
              </p>
              <h2 className="mt-3 font-display text-2xl leading-snug text-white md:text-3xl">
                Skills and standards
              </h2>
              <p className="mt-5 text-lg leading-relaxed text-white/80">
                All interpreters working with PI must hold current NRCPD registration. Beyond that, we look for people who are comfortable in high-energy environments and work well as part of a team under production constraints.
              </p>

              <div className="mt-8 space-y-5">
                <div className="flex items-start gap-4">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-pi-accent/10">
                    <Icon name="shield" size={18} className="text-pi-accent" />
                  </div>
                  <div>
                    <h3 className="text-sm font-semibold text-white">NRCPD registered</h3>
                    <p className="mt-0.5 text-base text-white/60">Current registration required for all PI interpreters.</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-pi-accent/10">
                    <Icon name="music" size={18} className="text-pi-accent" />
                  </div>
                  <div>
                    <h3 className="text-sm font-semibold text-white">Live event experience</h3>
                    <p className="mt-0.5 text-base text-white/60">Prior experience at concerts, festivals, sport, or theatre is highly valued.</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-pi-accent/10">
                    <Icon name="users" size={18} className="text-pi-accent" />
                  </div>
                  <div>
                    <h3 className="text-sm font-semibold text-white">Team player</h3>
                    <p className="mt-0.5 text-base text-white/60">Large events run with interpreter teams and rotation schedules.</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-pi-accent/10">
                    <Icon name="zap" size={18} className="text-pi-accent" />
                  </div>
                  <div>
                    <h3 className="text-sm font-semibold text-white">Adaptable under pressure</h3>
                    <p className="mt-0.5 text-base text-white/60">Live events don&rsquo;t always go to plan. We need calm under changing conditions.</p>
                  </div>
                </div>
              </div>
            </div>
          </AnimateIn>

          <AnimateIn delay={150}>
            <div className="relative aspect-[4/3] overflow-hidden rounded-2xl">
              <Image
                src="/images/festival-signing.jpg"
                alt="BSL interpreter signing at a festival with stage behind"
                fill
                className="object-cover"
              />
            </div>
          </AnimateIn>
        </div>
      </section>

      {/* ─── Academy trainee quote ──────────────────────── */}
      <section className="section-padding pb-0">
        <TestimonialQuote
          quote="I attended the two day festival training weekend and was absolutely blown away by how much I came away with! They created a really supportive and safe space."
          name="Leah Jewiss"
          context="PI Academy participant"
        />
      </section>

      {/* ─── PI Academy - image + text with CTA ────────── */}
      <section className="section-padding section-gap">
        <div className="grid items-center gap-10 md:grid-cols-2 md:gap-16">
          <AnimateIn>
            <div className="relative aspect-[4/3] overflow-hidden rounded-2xl">
              <Image
                src="/images/festival-night.jpg"
                alt="BSL interpreter performing at night with stage lights"
                fill
                className="object-cover"
              />
            </div>
          </AnimateIn>

          <AnimateIn delay={150}>
            <div>
              <p className="text-xs font-semibold uppercase tracking-widest text-pi-accent">
                Training &amp; Development
              </p>
              <h2 className="mt-3 font-display text-2xl leading-snug text-white md:text-3xl">
                The PI Academy
              </h2>
              <p className="mt-5 text-lg leading-relaxed text-white/80">
                Performance Interpreting&rsquo;s dedicated training platform - built specifically for interpreters who want to specialise in live events. Structured courses, hands-on mentoring and ongoing CPD you won&rsquo;t find anywhere else.
              </p>

              <div className="mt-6 space-y-3">
                <div className="flex items-start gap-3">
                  <Icon name="music" size={16} className="mt-0.5 shrink-0 text-pi-accent" />
                  <p className="text-base text-white/70">Live event vocabulary for music, sport, comedy and entertainment</p>
                </div>
                <div className="flex items-start gap-3">
                  <Icon name="users" size={16} className="mt-0.5 shrink-0 text-pi-accent" />
                  <p className="text-base text-white/70">Team interpreting at scale - rotations, handovers, long events</p>
                </div>
                <div className="flex items-start gap-3">
                  <Icon name="settings" size={16} className="mt-0.5 shrink-0 text-pi-accent" />
                  <p className="text-base text-white/70">Production coordination - sight-lines, lighting, stage comms</p>
                </div>
                <div className="flex items-start gap-3">
                  <Icon name="shield" size={16} className="mt-0.5 shrink-0 text-pi-accent" />
                  <p className="text-base text-white/70">Legal and ethical framework - Equality Act, reasonable adjustments</p>
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
      <section className="section-padding pb-0">
        <TestimonialQuote
          quote="The training offered by Performance Interpreting is invaluable. The trainers made the whole programme so welcoming. I enjoyed pushing through the boundaries of my comfort zone."
          name="Hayley Wiseman"
          context="PI Academy participant"
        />
      </section>

      {/* ─── Volunteering - text + image ───────────────── */}
      <section className="section-padding section-gap bg-pi-deep">
        <div className="grid items-center gap-10 md:grid-cols-2 md:gap-16">
          <AnimateIn>
            <div>
              <p className="text-xs font-semibold uppercase tracking-widest text-pi-accent">
                Start here
              </p>
              <h2 className="mt-3 font-display text-2xl leading-snug text-white md:text-3xl">
                Volunteer your way in
              </h2>
              <p className="mt-5 text-lg leading-relaxed text-white/80">
                Volunteering with Performance Interpreting gives you a real feel for live-access environments before you commit to training. You&rsquo;ll support interpreter teams on site, help with logistics, and see first-hand how events run. Open to Deaf volunteers fluent in BSL, and hearing volunteers at Level 6 or above.
              </p>

              <div className="mt-6 space-y-3">
                <div className="flex items-start gap-3">
                  <Icon name="check" size={18} className="mt-0.5 shrink-0 text-pi-accent" />
                  <p className="text-base text-white/70">Welcome Deaf attendees and support coordinators</p>
                </div>
                <div className="flex items-start gap-3">
                  <Icon name="check" size={18} className="mt-0.5 shrink-0 text-pi-accent" />
                  <p className="text-base text-white/70">Help with set-up - banners, equipment, access areas</p>
                </div>
                <div className="flex items-start gap-3">
                  <Icon name="check" size={18} className="mt-0.5 shrink-0 text-pi-accent" />
                  <p className="text-base text-white/70">Free entry to events and festivals</p>
                </div>
                <div className="flex items-start gap-3">
                  <Icon name="check" size={18} className="mt-0.5 shrink-0 text-pi-accent" />
                  <p className="text-base text-white/70">Selected volunteers may be invited to shadow interpreters</p>
                </div>
              </div>

              <p className="mt-6 text-sm italic text-white/60">
                &ldquo;Working with Performance Interpreting has been such a supportive journey. Beginning as a volunteer, I was able to observe first-hand the passion and dedication of the team.&rdquo;
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

          <AnimateIn delay={150}>
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
                src="/images/arsenal-pitchside.jpg"
                alt="PI team pitchside at Arsenal's Emirates Stadium"
                fill
                className="object-cover"
              />
            </div>
          </AnimateIn>

          <AnimateIn delay={150}>
            <div>
              <p className="text-xs font-semibold uppercase tracking-widest text-pi-accent">
                Get in Touch
              </p>
              <h2 className="mt-3 font-display text-2xl leading-snug text-white md:text-3xl">
                Interested in working with PI?
              </h2>
              <p className="mt-5 text-lg leading-relaxed text-white/80">
                If you hold NRCPD registration and are interested in live events interpreting work, get in touch. Tell us about your experience, the types of events you&rsquo;ve worked at (or would like to) and any specialist vocabulary areas.
              </p>
              <p className="mt-4 text-lg leading-relaxed text-white/80">
                We&rsquo;re always building our pool of interpreters ahead of our busiest seasons - festival summer and the autumn arena circuit. The earlier you&rsquo;re in touch, the better.
              </p>
            </div>
          </AnimateIn>
        </div>
      </section>

{/* ContactCta removed - doesn't fit this page */}
    </>
  );
}
