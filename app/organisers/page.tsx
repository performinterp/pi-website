import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import PageHero from "@/components/page-hero";
import ContactCta from "@/components/contact-cta";
import TestimonialQuote from "@/components/testimonial-quote";
import AnimateIn from "@/components/animate-in";
import AppScreenshotCarousel from "@/components/app-screenshot-carousel";
import Icon from "@/components/icon";

export const metadata: Metadata = {
  title: "For Event Organisers - Performance Interpreting",
  description:
    "Performance Interpreting provides BSL and ISL interpreting for festivals, sport, arenas and live entertainment across the UK and Ireland. Expert logistics, NRCPD-registered interpreters, end-to-end coordination.",
};

export default function OrganisersPage() {
  return (
    <>
      <PageHero
        title="For Event Organisers"
        subtitle="Deaf access consultancy and sign language interpreting that fits your event - not the other way around."
        backgroundImage="/images/concert.jpg"
      />

      {/* ─── What We Offer - image + text ────────────────── */}
      <section className="section-padding section-gap">
        <div className="grid items-center gap-10 md:grid-cols-2 md:gap-16">
          <AnimateIn>
            <div className="relative aspect-[4/3] overflow-hidden rounded-2xl">
              <Image
                src="/images/festival-signing.jpg"
                alt="BSL interpreter signing at a festival with stage behind"
                fill
                className="object-cover"
              />
            </div>
          </AnimateIn>

          <AnimateIn delay={150}>
            <div>
              <p className="text-xs font-semibold uppercase tracking-widest text-pi-accent">
                What we offer
              </p>
              <h2 className="mt-3 font-display text-2xl leading-snug text-white md:text-3xl">
                Deaf access consultancy and full-service interpreting
              </h2>
              <p className="mt-5 text-lg leading-relaxed text-white/80">
                We don&rsquo;t just supply interpreters - we consult, plan and deliver. From advising on your legal obligations under the Equality Act 2010, through to designing your access plan and managing the interpreter team on the day.
              </p>

              <div className="mt-8 space-y-5">
                <div className="flex items-start gap-4">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-pi-accent/10">
                    <Icon name="hand-metal" size={18} className="text-pi-accent" />
                  </div>
                  <div>
                    <h3 className="text-sm font-semibold text-white">BSL &amp; ISL Interpreting</h3>
                    <p className="mt-0.5 text-base text-white/60">British and Irish Sign Language for concerts, festivals, sport, theatre, comedy and more.</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-pi-accent/10">
                    <Icon name="settings" size={18} className="text-pi-accent" />
                  </div>
                  <div>
                    <h3 className="text-sm font-semibold text-white">Full access packages</h3>
                    <p className="mt-0.5 text-base text-white/60">BSL, ISL, live captions, induction loops - tailored to your venue and audience.</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-pi-accent/10">
                    <Icon name="users" size={18} className="text-pi-accent" />
                  </div>
                  <div>
                    <h3 className="text-sm font-semibold text-white">On-site coordination</h3>
                    <p className="mt-0.5 text-base text-white/60">A PI coordinator manages the interpreter team, liaises with production and adapts in real time.</p>
                  </div>
                </div>
              </div>
            </div>
          </AnimateIn>
        </div>
      </section>

      {/* ─── Organiser quote ────────────────────────────── */}
      <section className="section-padding pb-0">
        <TestimonialQuote
          quote="We couldn't be more grateful to Performance Interpreting for their incredible work. Their amazing team of BSL interpreters brought energy, passion, and accessibility to every performance."
          name="Adam"
          context="Event Organiser, Croydon PrideFest"
        />
      </section>

      {/* ─── How It Works - text + image with steps ──────── */}
      <section className="section-padding section-gap bg-pi-deep">
        <div className="grid items-center gap-10 md:grid-cols-2 md:gap-16">
          <AnimateIn>
            <div>
              <p className="text-xs font-semibold uppercase tracking-widest text-pi-accent">
                How it works
              </p>
              <h2 className="mt-3 font-display text-2xl leading-snug text-white md:text-3xl">
                From enquiry to curtain up
              </h2>
              <p className="mt-5 text-lg leading-relaxed text-white/80">
                We&rsquo;ve refined the process over hundreds of events. Low-friction for your team, nothing missed on the day.
              </p>

              <div className="mt-8 space-y-6">
                {[
                  { step: "1", title: "Tell us about your event", desc: "Share the basics - event type, venue, date, expected audience size. We'll come back with questions and a plan." },
                  { step: "2", title: "We build your access plan", desc: "Interpreter numbers, team composition, rotation schedules and venue logistics - all confirmed." },
                  { step: "3", title: "Pre-event briefing", desc: "Interpreters are briefed on your programme - setlist, speakers, running order, specialist vocabulary." },
                  { step: "4", title: "On-the-day delivery", desc: "Our team arrives early, coordinates with your crew and manages everything throughout." },
                ].map((item) => (
                  <div key={item.step} className="flex items-start gap-4">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-pi-accent text-base font-bold text-white shadow-lg shadow-pi-accent/20">
                      {item.step}
                    </div>
                    <div>
                      <h3 className="text-base font-semibold text-white">{item.title}</h3>
                      <p className="mt-1 text-base text-white/70">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </AnimateIn>

          <AnimateIn delay={150}>
            <div className="relative aspect-[4/3] overflow-hidden rounded-2xl">
              <Image
                src="/images/festival-energy.jpg"
                alt="PI interpreter celebrating at a festival"
                fill
                className="object-cover"
              />
            </div>
          </AnimateIn>
        </div>
      </section>

      {/* ─── The App - unique selling point ──────────────── */}
      <section className="section-padding section-gap">
        <div className="grid items-center gap-10 md:grid-cols-[2fr_3fr] md:gap-16">
          <AnimateIn>
            <AppScreenshotCarousel compact />
          </AnimateIn>

          <AnimateIn delay={150}>
            <div>
              <p className="text-xs font-semibold uppercase tracking-widest text-pi-accent">
                Only with PI
              </p>
              <h2 className="mt-3 font-display text-2xl leading-snug text-white md:text-3xl">
                A dedicated app for your Deaf audience
              </h2>
              <p className="mt-5 text-lg leading-relaxed text-white/80">
                No other interpreting service offers this. The PI Events App gives your Deaf attendees a free toolkit - event listings with interpreter names, speech-to-text, communication cards for bars and staff, festival checklists and direct feedback after the event.
              </p>
              <p className="mt-4 text-lg leading-relaxed text-white/80">
                For organisers, it means better engagement, measurable access impact and evidence you can use in your reporting. Your event appears in the app automatically when you book with PI.
              </p>

              <div className="mt-6 space-y-3">
                <div className="flex items-start gap-3">
                  <Icon name="check" size={18} className="mt-0.5 shrink-0 text-pi-accent" />
                  <p className="text-base text-white/70">Your event listed with interpreting status and interpreter names</p>
                </div>
                <div className="flex items-start gap-3">
                  <Icon name="check" size={18} className="mt-0.5 shrink-0 text-pi-accent" />
                  <p className="text-base text-white/70">On-site tools your Deaf audience can use on the day</p>
                </div>
                <div className="flex items-start gap-3">
                  <Icon name="check" size={18} className="mt-0.5 shrink-0 text-pi-accent" />
                  <p className="text-base text-white/70">Post-event feedback direct from attendees</p>
                </div>
              </div>
            </div>
          </AnimateIn>
        </div>
      </section>


{/* ─── Why PI - image + text ───────────────────────── */}
      <section className="section-padding section-gap">
        <div className="grid items-center gap-10 md:grid-cols-2 md:gap-16">
          <AnimateIn>
            <div>
              <p className="text-xs font-semibold uppercase tracking-widest text-pi-accent">
                Why PI
              </p>
              <h2 className="mt-3 font-display text-2xl leading-snug text-white md:text-3xl">
                The difference between a supplier and a consultancy
              </h2>
              <p className="mt-5 text-lg leading-relaxed text-white/80">
                Most agencies provide a name and a DBS check. They let you figure out positioning, lighting, rotation schedules and legal compliance on your own. We&rsquo;ve seen the results - interpreters placed where nobody can see them, no rotation plan for a twelve-hour festival and organisers exposed to legal risk they didn&rsquo;t know existed.
              </p>
              <p className="mt-4 text-lg leading-relaxed text-white/80">
                PI operates as a consultancy. That&rsquo;s why Wembley, The O2, Download and the Premier League keep coming back.
              </p>

              <div className="mt-6 space-y-3">
                <div className="flex items-start gap-3">
                  <Icon name="star" size={16} className="mt-0.5 shrink-0 text-pi-gold" />
                  <p className="text-base text-white/70">Event-specialist interpreters - not generalists</p>
                </div>
                <div className="flex items-start gap-3">
                  <Icon name="shield" size={16} className="mt-0.5 shrink-0 text-pi-gold" />
                  <p className="text-base text-white/70">NRCPD-registered, every time - no exceptions</p>
                </div>
                <div className="flex items-start gap-3">
                  <Icon name="zap" size={16} className="mt-0.5 shrink-0 text-pi-gold" />
                  <p className="text-base text-white/70">500+ events including six Premier League clubs and national arenas</p>
                </div>
                <div className="flex items-start gap-3">
                  <Icon name="shield" size={16} className="mt-0.5 shrink-0 text-pi-gold" />
                  <p className="text-base text-white/70">Legal compliance confidence - our testimony set the precedent</p>
                </div>
              </div>
            </div>
          </AnimateIn>

          <AnimateIn delay={150}>
            <div className="relative aspect-[4/3] overflow-hidden rounded-2xl">
              <Image
                src="/images/arsenal-pitchside.jpg"
                alt="PI team pitchside at Arsenal's Emirates Stadium"
                fill
                className="object-cover"
              />
            </div>
          </AnimateIn>
        </div>
      </section>

      {/* ─── Attendee quote ─────────────────────────────── */}
      <section className="section-padding pb-0">
        <TestimonialQuote
          quote="Absolutely amazing people. Wish they were at every gig. Really got everyone in the mood."
          name="John Williams"
          context="Concert attendee"
        />
      </section>

      <ContactCta />
    </>
  );
}
