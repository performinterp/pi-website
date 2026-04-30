import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import PageHero from "@/components/page-hero";
import ContactCta from "@/components/contact-cta";
import TestimonialQuote from "@/components/testimonial-quote";
import AnimateIn from "@/components/animate-in";
import AppScreenshotCarousel from "@/components/app-screenshot-carousel";
import MobileTestimonialsCarousel from "@/components/mobile-testimonials-carousel";
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
        backgroundImage="/images/organisers-silverstone.jpg"
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
              <p className="text-xs font-semibold uppercase tracking-widest text-pi-gold">
                What we offer
              </p>
              <h2 className="mt-3 font-display text-2xl leading-snug text-pi-ink md:text-3xl">
                Deaf access consultancy and full-service interpreting
              </h2>
              <p className="mt-5 text-lg leading-relaxed text-pi-ink/80">
                We don&rsquo;t just supply interpreters - we consult, plan and deliver. From advising on your legal obligations under the Equality Act 2010, through to designing your access plan and managing the interpreter team on the day.
              </p>

              <div className="mt-8 space-y-5">
                <div className="flex items-start gap-4">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-pi-gold/10">
                    <Icon name="hand-metal" size={18} className="text-pi-gold" />
                  </div>
                  <div>
                    <h3 className="text-sm font-semibold text-pi-ink">BSL &amp; ISL Interpreting</h3>
                    <p className="mt-0.5 text-base text-pi-ink/65">British and Irish Sign Language for concerts, festivals, sport, theatre, comedy and more.</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-pi-gold/10">
                    <Icon name="settings" size={18} className="text-pi-gold" />
                  </div>
                  <div>
                    <h3 className="text-sm font-semibold text-pi-ink">Full access packages</h3>
                    <p className="mt-0.5 text-base text-pi-ink/65">BSL, ISL, live captions, induction loops - tailored to your venue and audience.</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-pi-gold/10">
                    <Icon name="users" size={18} className="text-pi-gold" />
                  </div>
                  <div>
                    <h3 className="text-sm font-semibold text-pi-ink">On-site coordination</h3>
                    <p className="mt-0.5 text-base text-pi-ink/65">A PI coordinator manages the interpreter team, liaises with production and adapts in real time.</p>
                  </div>
                </div>
              </div>
            </div>
          </AnimateIn>
        </div>
      </section>

      {/* ─── Organiser quote — desktop only; mobile gets it via the
            testimonials carousel below ─────────────────── */}
      <section className="section-padding py-12 md:py-16 hidden md:block">
        <TestimonialQuote
          wide
          quote="We couldn't be more grateful to Performance Interpreting for their incredible work. Their amazing team of BSL interpreters brought energy, passion, and accessibility to every performance."
          name="Adam"
          context="Event Organiser, Croydon PrideFest"
        />
      </section>

      {/* ─── How It Works - text + image with steps ──────── */}
      <section className="section-padding section-gap bg-pi-canvas-soft">
        <div className="grid items-center gap-10 md:grid-cols-2 md:gap-16">
          <AnimateIn>
            <div>
              <p className="text-xs font-semibold uppercase tracking-widest text-pi-gold">
                How it works
              </p>
              <h2 className="mt-3 font-display text-2xl leading-snug text-pi-ink md:text-3xl">
                From enquiry to curtain up
              </h2>
              <p className="mt-5 text-lg leading-relaxed text-pi-ink/80">
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
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-pi-accent text-base font-bold text-white shadow-md shadow-pi-accent/25">
                      {item.step}
                    </div>
                    <div>
                      <h3 className="text-base font-semibold text-pi-ink">{item.title}</h3>
                      <p className="mt-1 text-base text-pi-ink/70">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </AnimateIn>

          <AnimateIn delay={150} className="order-first md:order-none">
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
              <p className="text-xs font-semibold uppercase tracking-widest text-pi-gold">
                Only with PI
              </p>
              <h2 className="mt-3 font-display text-2xl leading-snug text-pi-ink md:text-3xl">
                A dedicated app for your Deaf audience
              </h2>
              <p className="mt-5 text-lg leading-relaxed text-pi-ink/80">
                No other interpreting service offers this. The PI Events App gives your Deaf attendees a free toolkit - event listings with interpreter names, speech-to-text, communication cards for bars and staff, festival checklists and direct feedback after the event.
              </p>
              <p className="mt-4 text-lg leading-relaxed text-pi-ink/80">
                For organisers, it means better engagement, measurable access impact and evidence you can use in your reporting. Your event appears in the app automatically when you book with PI.
              </p>

              <div className="mt-6 space-y-3">
                <div className="flex items-start gap-3">
                  <Icon name="check" size={18} className="mt-0.5 shrink-0 text-pi-accent" />
                  <p className="text-base text-pi-ink/75">Your event listed with interpreting status and interpreter names</p>
                </div>
                <div className="flex items-start gap-3">
                  <Icon name="check" size={18} className="mt-0.5 shrink-0 text-pi-accent" />
                  <p className="text-base text-pi-ink/75">On-site tools your Deaf audience can use on the day</p>
                </div>
                <div className="flex items-start gap-3">
                  <Icon name="check" size={18} className="mt-0.5 shrink-0 text-pi-accent" />
                  <p className="text-base text-pi-ink/75">Post-event feedback direct from attendees</p>
                </div>
              </div>

              <Link
                href="/app-guide"
                className="mt-8 inline-flex items-center gap-2 text-sm font-semibold text-pi-accent transition-colors hover:text-pi-ink"
              >
                Watch the full app tour
                <Icon name="arrow-right" size={16} />
              </Link>
            </div>
          </AnimateIn>
        </div>
      </section>


{/* ─── Why PI - image + text ───────────────────────── */}
      <section className="section-padding section-gap bg-pi-canvas-soft">
        <div className="grid items-center gap-10 md:grid-cols-2 md:gap-16">
          <AnimateIn>
            <div>
              <p className="text-xs font-semibold uppercase tracking-widest text-pi-gold">
                Why PI
              </p>
              <h2 className="mt-3 font-display text-2xl leading-snug text-pi-ink md:text-3xl">
                The difference between a supplier and a consultancy
              </h2>
              <p className="mt-5 text-lg leading-relaxed text-pi-ink/80">
                Most agencies provide a name and a DBS check. They let you figure out positioning, lighting, rotation schedules and legal compliance on your own. We&rsquo;ve seen the results - interpreters placed where nobody can see them, no rotation plan for a twelve-hour festival and organisers exposed to legal risk they didn&rsquo;t know existed.
              </p>
              <p className="mt-4 text-lg leading-relaxed text-pi-ink/80">
                Performance Interpreting operates as a consultancy. That&rsquo;s why Wembley, The O2, Live Nation and the Premier League choose PI &mdash; a service that integrates seamlessly with theirs.
              </p>

              <div className="mt-6 space-y-3">
                <div className="flex items-start gap-3">
                  <Icon name="star" size={16} className="mt-0.5 shrink-0 text-pi-gold" />
                  <p className="text-base text-pi-ink/75">Event-specialist interpreters - not generalists</p>
                </div>
                <div className="flex items-start gap-3">
                  <Icon name="shield" size={16} className="mt-0.5 shrink-0 text-pi-gold" />
                  <p className="text-base text-pi-ink/75">NRCPD-registered, every time - no exceptions</p>
                </div>
                <div className="flex items-start gap-3">
                  <Icon name="zap" size={16} className="mt-0.5 shrink-0 text-pi-gold" />
                  <p className="text-base text-pi-ink/75">600+ events including six Premier League clubs and national arenas</p>
                </div>
                <div className="flex items-start gap-3">
                  <Icon name="shield" size={16} className="mt-0.5 shrink-0 text-pi-gold" />
                  <p className="text-base text-pi-ink/75">Legal compliance confidence - our testimony set the precedent</p>
                </div>
              </div>
            </div>
          </AnimateIn>

          <AnimateIn delay={150} className="order-first md:order-none">
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

      {/* ─── Voices — mix of organiser + attendee feedback ── */}
      <section className="section-padding section-gap bg-pi-canvas-soft">
        <AnimateIn>
          <div className="mx-auto max-w-3xl text-center">
            <p className="text-xs font-semibold uppercase tracking-widest text-pi-gold">
              What people say
            </p>
            <h2 className="mt-3 font-display text-2xl text-pi-ink md:text-3xl">
              Trusted by organisers and audiences alike
            </h2>
          </div>
        </AnimateIn>

        {(() => {
          const reviews = [
            {
              quote: "We couldn't be more grateful to Performance Interpreting for their incredible work. Their amazing team of BSL interpreters brought energy, passion, and accessibility to every performance.",
              name: "Adam",
              context: "Event Organiser, Croydon PrideFest",
              rating: 5,
            },
            {
              quote: "Great communication, great help, great organisation. Booked again for Coldplay at Wembley. More people using this service more awareness this will be!",
              name: "Karen Rutter",
              context: "Concert attendee, Liverpool M&S Arena",
              rating: 5,
            },
            {
              quote: "Interpreters are nearer the main stage this year. I was pleased so I can stand watch the interpreters AND the performances.",
              name: "Sarah Jones",
              context: "BST Hyde Park attendee",
              rating: 5,
            },
          ];
          return (
            <>
              {/* Desktop: 3-col grid */}
              <div className="mx-auto mt-12 hidden max-w-5xl gap-6 md:grid md:grid-cols-3">
                {reviews.map((t, i) => (
                  <AnimateIn key={t.name} delay={i * 80}>
                    <div className="flex h-full flex-col rounded-2xl border border-pi-ink/10 bg-white p-6 shadow-sm md:p-8">
                      <div className="mb-4 flex gap-0.5">
                        {Array.from({ length: t.rating }).map((_, j) => (
                          <svg key={j} className="h-4 w-4 fill-pi-gold" viewBox="0 0 20 20">
                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                          </svg>
                        ))}
                      </div>
                      <p className="flex-1 text-base italic leading-relaxed text-pi-ink/85">
                        &ldquo;{t.quote}&rdquo;
                      </p>
                      <div className="mt-5 border-t border-pi-ink/10 pt-5">
                        <p className="text-sm font-semibold text-pi-ink">{t.name}</p>
                        <p className="text-xs text-pi-ink/60">{t.context}</p>
                      </div>
                    </div>
                  </AnimateIn>
                ))}
              </div>

              {/* Mobile: snap-scroll, same as home page */}
              <div className="mt-10">
                <MobileTestimonialsCarousel testimonials={reviews} />
              </div>
            </>
          );
        })()}
      </section>

      <ContactCta />
    </>
  );
}
