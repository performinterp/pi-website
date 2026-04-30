import Image from "next/image";
import Link from "next/link";
import {
  getHero,
  getStats,
  getClients,
  getSectors,
  getMilestones,
  getAboutTeaser,
  getAudienceCards,
  getConsultancy,
  getTestimonials,
} from "@/lib/content";
import LogoTicker from "@/components/logo-ticker";
import AnimateIn from "@/components/animate-in";
import AnimatedCounter from "@/components/animated-counter";
import ContactCta from "@/components/contact-cta";
import Icon from "@/components/icon";
import MobileExpander from "@/components/mobile-expander";
import MobileTestimonialsCarousel from "@/components/mobile-testimonials-carousel";

export default function Home() {
  const hero = getHero();
  const stats = getStats();
  const clients = getClients();
  const sectors = getSectors();
  const milestones = getMilestones();
  const about = getAboutTeaser();
  const audienceCards = getAudienceCards();
  const consultancy = getConsultancy();
  const testimonials = getTestimonials();

  return (
    <>
      {/* ─── Hero ─────────────────────────────────────────── */}
      <section className="relative flex min-h-[72vh] items-end overflow-hidden">
        {/* Background image */}
        <Image
          src={hero.posterImage}
          alt=""
          fill
          priority
          fetchPriority="high"
          sizes="100vw"
          quality={75}
          className="object-cover"
        />
        {/* Focused overlay - heavy bottom-left behind copy, image breathes elsewhere */}
        <div className="absolute inset-0 bg-gradient-to-tr from-pi-navy/85 from-0% via-pi-navy/30 via-45% to-transparent to-70%" />
        {/* Subtle bottom band so the section break into next is clean */}
        <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-pi-navy/60 to-transparent" />

        <div className="section-padding relative z-10 w-full pb-12 pt-28 md:pb-16 md:pt-32">
          <div className="max-w-3xl">
            <h1
              className="font-display text-3xl leading-tight text-white sm:text-4xl md:text-5xl lg:text-6xl"
              style={{ textShadow: "0 2px 20px rgba(2,1,66,0.6)" }}
            >
              {hero.tagline}
            </h1>
            <p
              className="mt-5 max-w-xl text-base leading-relaxed text-white/85 md:text-lg"
              style={{ textShadow: "0 1px 10px rgba(2,1,66,0.5)" }}
            >
              {hero.subtitle}
            </p>
            <div className="mt-10 flex flex-wrap gap-4">
              <Link
                href={hero.primaryCta.href}
                className="inline-flex items-center gap-2 rounded-full bg-pi-accent px-7 py-3.5 text-sm font-semibold text-white shadow-lg shadow-pi-accent/25 transition-all duration-200 hover:brightness-110 hover:shadow-pi-accent/40"
              >
                {hero.primaryCta.label}
              </Link>
              <a
                href={hero.secondaryCta.href}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-full border border-white/25 bg-white/5 px-7 py-3.5 text-sm font-semibold text-white backdrop-blur-sm transition-all duration-200 hover:border-white/40 hover:bg-white/10"
              >
                {hero.secondaryCta.label}
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* ─── Logo Ticker ──────────────────────────────────── */}
      <LogoTicker clients={clients} />

      {/* ─── Stats ────────────────────────────────────────── */}
      <section className="section-padding bg-pi-navy py-10 md:py-14">
        <div className="mx-auto max-w-5xl">
          <div className="grid grid-cols-2 gap-8 md:grid-cols-4">
            {stats.map((stat, i) => (
              <AnimateIn key={stat.label} delay={i * 100}>
                <div className="text-center">
                  <p className="font-display text-4xl text-white md:text-5xl">
                    <AnimatedCounter value={stat.value} suffix={stat.suffix} />
                  </p>
                  <p className="mt-2 text-sm text-white/70">{stat.label}</p>
                </div>
              </AnimateIn>
            ))}
          </div>
        </div>
      </section>

      {/* ─── Consultancy ───────────────────────────────────── */}
      <section className="section-padding section-gap bg-pi-canvas-soft">
        <div className="mx-auto max-w-5xl">
          <AnimateIn>
            <p className="text-xs font-semibold uppercase tracking-widest text-pi-gold">
              {consultancy.label}
            </p>
            <h2 className="mt-3 font-display text-3xl text-pi-ink md:text-4xl">
              {consultancy.heading}
            </h2>
          </AnimateIn>
          <AnimateIn delay={100}>
            <p className="mt-6 max-w-3xl text-lg leading-relaxed text-pi-ink/80">
              {consultancy.body}
            </p>
          </AnimateIn>

          {/* Desktop: card grid */}
          <div className="mt-12 hidden gap-6 md:grid md:grid-cols-2">
            {consultancy.services.map((service, i) => (
              <AnimateIn key={service.title} delay={i * 100}>
                <div className="rounded-2xl border border-pi-ink/10 bg-white p-6 shadow-sm md:p-8">
                  <Icon
                    name={service.icon}
                    size={24}
                    className="text-pi-gold"
                  />
                  <h3 className="mt-4 font-display text-xl text-pi-ink">
                    {service.title}
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-pi-ink/70">
                    {service.description}
                  </p>
                </div>
              </AnimateIn>
            ))}
          </div>

          {/* Mobile: premium expanders */}
          <div className="mt-10 flex flex-col gap-3 md:hidden">
            {consultancy.services.map((service) => (
              <MobileExpander
                key={service.title}
                icon={service.icon}
                title={service.title}
              >
                {service.description}
              </MobileExpander>
            ))}
          </div>

          <AnimateIn delay={400}>
            <div className="mt-10">
              <Link
                href={consultancy.ctaHref}
                className="inline-flex items-center gap-2 text-sm font-semibold text-pi-accent transition-colors hover:text-pi-ink"
              >
                {consultancy.ctaLabel}
                <Icon name="arrow-right" size={16} />
              </Link>
            </div>
          </AnimateIn>
        </div>
      </section>

      {/* ─── Sectors ──────────────────────────────────────── */}
      <section className="section-padding section-gap">
        <AnimateIn>
          <p className="text-center text-xs font-semibold uppercase tracking-widest text-pi-gold">
            Where we work
          </p>
          <h2 className="mt-3 text-center font-display text-3xl text-pi-ink md:text-4xl">
            Sectors we serve
          </h2>
        </AnimateIn>

        <div className="mt-12 grid gap-6 md:grid-cols-2">
          {sectors.map((sector) => (
            <AnimateIn
              key={sector.name}
              className={sector.size === "large" ? "md:col-span-2" : ""}
            >
              <div className="group relative overflow-hidden rounded-2xl">
                <div className="relative aspect-[4/3] md:aspect-[21/9] overflow-hidden">
                  <Image
                    src={sector.photo}
                    alt={sector.name}
                    fill
                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                  {/* Subtle bottom-only gradient — image breathes, just enough to anchor the title */}
                  <div className="absolute inset-x-0 bottom-0 h-2/5 bg-gradient-to-t from-pi-navy/85 via-pi-navy/40 to-transparent" />
                  <div className="absolute inset-x-0 bottom-0 p-5 md:p-7">
                    <h3 className="font-display text-2xl text-white md:text-3xl">{sector.name}</h3>
                  </div>
                </div>
              </div>
            </AnimateIn>
          ))}
        </div>
      </section>

      {/* ─── Milestones - horizontal strip, visually distinct ── */}
      <section className="section-padding section-gap bg-gradient-to-r from-pi-deep via-pi-navy to-pi-deep">
        <AnimateIn>
          <p className="text-center text-xs font-semibold uppercase tracking-widest text-pi-gold">
            Track record
          </p>
          <h2 className="mt-3 text-center font-display text-3xl text-white md:text-4xl">
            Five industry firsts
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-center text-base leading-relaxed text-white/75 md:text-lg">
            No other UK performance interpreting service can match them.
          </p>
        </AnimateIn>

        {/* Desktop: 5-column card grid */}
        <div className="mx-auto mt-12 hidden max-w-6xl grid-cols-1 gap-6 md:grid md:grid-cols-2 lg:grid-cols-5">
          {milestones.map((milestone, i) => (
            <AnimateIn key={milestone.title} delay={i * 120}>
              <div className="h-full rounded-xl border border-pi-gold/15 bg-pi-gold/[0.03] p-6 md:p-7">
                <Icon name={milestone.icon} size={28} className="text-pi-gold" />
                <h3 className="mt-4 font-display text-lg text-white">{milestone.title}</h3>
                {milestone.description.split("\n\n").map((para, idx) => (
                  <p
                    key={idx}
                    className={`text-sm leading-relaxed text-white/70 ${idx === 0 ? "mt-2" : "mt-3"}`}
                  >
                    {para}
                  </p>
                ))}
              </div>
            </AnimateIn>
          ))}
        </div>

        {/* Mobile: premium expanders, dark variant */}
        <div className="mx-auto mt-10 flex max-w-2xl flex-col gap-3 md:hidden">
          {milestones.map((milestone) => (
            <MobileExpander
              key={milestone.title}
              icon={milestone.icon}
              title={milestone.title}
              variant="dark"
            >
              {milestone.description.split("\n\n").map((para, idx) => (
                <p key={idx} className={idx === 0 ? "" : "mt-3"}>
                  {para}
                </p>
              ))}
            </MobileExpander>
          ))}
        </div>
      </section>

      {/* ─── About Teaser ─────────────────────────────────── */}
      <section className="section-padding section-gap">
        <div className="grid items-center gap-10 md:grid-cols-2 md:gap-16">
          <AnimateIn>
            <div className="relative aspect-[4/5] overflow-hidden rounded-2xl">
              <Image
                src={about.photo}
                alt="PI interpreter performing at a live event"
                fill
                className="object-cover"
                style={{ objectPosition: "75% 20%" }}
              />
            </div>
          </AnimateIn>

          <AnimateIn delay={150}>
            <div>
              <p className="text-xs font-semibold uppercase tracking-widest text-pi-gold">
                {about.label}
              </p>
              <h2 className="mt-3 font-display text-2xl leading-snug text-pi-ink md:text-3xl">
                {about.heading}
              </h2>
              <p className="mt-5 text-lg leading-relaxed text-pi-ink/80">
                {about.body}
              </p>
              <Link
                href={about.ctaHref}
                className="mt-8 inline-flex items-center gap-2 text-sm font-semibold text-pi-accent transition-colors hover:text-pi-ink"
              >
                {about.ctaLabel}
                <Icon name="arrow-right" size={16} />
              </Link>
            </div>
          </AnimateIn>
        </div>
      </section>

      {/* ─── Testimonials ───────────────────────────────── */}
      <section className="section-padding section-gap bg-pi-canvas-soft">
        <AnimateIn>
          <div className="mx-auto max-w-4xl text-center">
            <p className="text-xs font-semibold uppercase tracking-widest text-pi-gold">
              What people say
            </p>
            <h2 className="mt-3 font-display text-3xl text-pi-ink md:text-4xl">
              100% recommended
            </h2>
            <p className="mt-3 text-sm text-pi-ink/60">
              5.0 on Google  ·  33 recommendations on Facebook  ·  10K+ followers
            </p>
          </div>
        </AnimateIn>

        {/* Desktop: 3-column grid */}
        <div className="mx-auto mt-12 hidden max-w-5xl gap-6 md:grid md:grid-cols-2 lg:grid-cols-3">
          {testimonials.slice(0, 6).map((t, i) => (
            <AnimateIn key={t.name} delay={i * 80}>
              <div className="flex h-full flex-col rounded-2xl border border-pi-ink/10 bg-white p-6 shadow-sm md:p-8">
                {t.rating && (
                  <div className="mb-4 flex gap-0.5">
                    {Array.from({ length: t.rating }).map((_, j) => (
                      <svg
                        key={j}
                        className="h-4 w-4 fill-pi-gold"
                        viewBox="0 0 20 20"
                      >
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                    ))}
                  </div>
                )}
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

        {/* Mobile: horizontal snap carousel */}
        <div className="mt-10">
          <MobileTestimonialsCarousel testimonials={testimonials.slice(0, 6)} />
        </div>
      </section>

      {/* ─── Audience Cards ───────────────────────────────── */}
      <section className="section-padding section-gap">
        <AnimateIn>
          <p className="text-center text-xs font-semibold uppercase tracking-widest text-pi-gold">
            How can we help?
          </p>
          <h2 className="mt-3 text-center font-display text-3xl text-pi-ink md:text-4xl">
            Who we work with
          </h2>
        </AnimateIn>

        {/* Desktop: 3-column cards */}
        <div className="mt-12 hidden gap-6 md:grid md:grid-cols-3">
          {audienceCards.map((card, i) => {
            const isExternal = card.external;
            const Tag = isExternal ? "a" : Link;
            const linkProps = isExternal
              ? { href: card.href, target: "_blank", rel: "noopener noreferrer" }
              : { href: card.href };

            return (
              <AnimateIn key={card.title} delay={i * 120}>
                <div className="group flex h-full flex-col rounded-2xl border-l-4 border-l-pi-gold border border-pi-ink/10 bg-white p-6 shadow-sm transition-all duration-300 hover:bg-pi-accent/5 hover:border-pi-accent/40 md:p-8">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-pi-gold/10">
                    <Icon
                      name={card.icon}
                      size={22}
                      className="text-pi-gold"
                    />
                  </div>
                  <h3 className="mt-5 font-display text-xl text-pi-ink">
                    {card.title}
                  </h3>
                  <p className="mt-2 flex-1 text-base leading-relaxed text-pi-ink/70">
                    {card.description}
                  </p>
                  <Tag
                    {...linkProps}
                    className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-pi-accent transition-colors group-hover:text-pi-ink"
                  >
                    {card.ctaLabel}
                    <Icon name="arrow-right" size={14} />
                  </Tag>
                </div>
              </AnimateIn>
            );
          })}
        </div>

        {/* Mobile: premium expanders with linked CTA inside */}
        <div className="mt-10 flex flex-col gap-3 md:hidden">
          {audienceCards.map((card) => {
            const isExternal = card.external;
            const Tag = isExternal ? "a" : Link;
            const linkProps = isExternal
              ? { href: card.href, target: "_blank", rel: "noopener noreferrer" }
              : { href: card.href };
            return (
              <MobileExpander key={card.title} icon={card.icon} title={card.title}>
                <p>{card.description}</p>
                <Tag
                  {...linkProps}
                  className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-pi-accent transition-colors hover:text-pi-ink"
                >
                  {card.ctaLabel}
                  <Icon name="arrow-right" size={14} />
                </Tag>
              </MobileExpander>
            );
          })}
        </div>
      </section>

      {/* ─── Stay in the Loop ─────────────────────────────── */}
      <section className="section-padding section-gap bg-pi-canvas-soft">
        <div className="mx-auto max-w-3xl text-center">
          <AnimateIn>
            <p className="text-xs font-semibold uppercase tracking-widest text-pi-gold">
              Stay in the loop
            </p>
            <h2 className="mt-3 font-display text-3xl text-pi-ink md:text-4xl">
              Never miss an interpreted event
            </h2>
          </AnimateIn>
          <AnimateIn delay={100}>
            <p className="mx-auto mt-6 max-w-xl text-lg leading-relaxed text-pi-ink/80">
              Love live music? Sports? Festivals? Dance? Comedy? Follow us to be
              the first to know about:
            </p>
            <ul className="mx-auto mt-6 max-w-md space-y-3 text-left text-sm text-pi-ink/80">
              <li className="flex items-start gap-2">
                <span className="mt-0.5 text-pi-accent">→</span>
                Upcoming BSL/ISL interpreted shows
              </li>
              <li className="flex items-start gap-2">
                <span className="mt-0.5 text-pi-accent">→</span>
                Last-minute ticket releases
              </li>
              <li className="flex items-start gap-2">
                <span className="mt-0.5 text-pi-accent">→</span>
                Access tips and venue info
              </li>
              <li className="flex items-start gap-2">
                <span className="mt-0.5 text-pi-accent">→</span>
                Behind-the-scenes with our interpreters
              </li>
              <li className="flex items-start gap-2">
                <span className="mt-0.5 text-pi-accent">→</span>
                Event highlights and community news
              </li>
            </ul>
          </AnimateIn>
          <AnimateIn delay={200}>
            <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
              <a
                href="https://instagram.com/performanceinterpreting"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-full border border-pi-ink/15 bg-white px-5 py-2.5 text-sm font-semibold text-pi-ink transition-all hover:border-pi-accent/40 hover:bg-pi-accent/5"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/></svg>
                Instagram
              </a>
              <a
                href="https://www.facebook.com/performanceinterpreting"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-full border border-pi-ink/15 bg-white px-5 py-2.5 text-sm font-semibold text-pi-ink transition-all hover:border-pi-accent/40 hover:bg-pi-accent/5"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
                Facebook
              </a>
              <a
                href="https://x.com/performinterp"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-full border border-pi-ink/15 bg-white px-5 py-2.5 text-sm font-semibold text-pi-ink transition-all hover:border-pi-accent/40 hover:bg-pi-accent/5"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
                X
              </a>
            </div>
          </AnimateIn>
        </div>
      </section>

      {/* ─── Closing CTA with quote ──────────────────────── */}
      <section className="section-padding section-gap bg-pi-deep">
        <div className="rounded-2xl border border-pi-accent/20 bg-gradient-to-br from-pi-accent/15 to-pi-accent/5 p-10 text-center md:p-16">
          <AnimateIn>
            <blockquote className="mx-auto max-w-2xl">
              <p className="font-display text-2xl italic leading-relaxed text-white/95 md:text-3xl">
                &ldquo;Inclusivity is more than a word; it&rsquo;s an{" "}
                <span className="text-pi-warmth">experience</span>.&rdquo;
              </p>
            </blockquote>
            <div className="mx-auto my-8 h-px w-24 bg-white/20" />
            <h2 className="font-display text-2xl text-white md:text-3xl">
              Ready to make your event accessible?
            </h2>
            <p className="mx-auto mt-4 max-w-md text-base text-white/80">
              Tell us about your event and we&rsquo;ll put together a plan.
            </p>
            <div className="mt-8">
              <Link
                href="/contact"
                className="inline-flex items-center gap-2 rounded-full bg-pi-accent px-8 py-3.5 text-sm font-semibold text-white shadow-lg shadow-pi-accent/25 transition-all duration-200 hover:brightness-110 hover:shadow-pi-accent/40"
              >
                Get a Quote
              </Link>
            </div>
          </AnimateIn>
        </div>
      </section>
    </>
  );
}
