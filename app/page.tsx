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
} from "@/lib/content";
import LogoTicker from "@/components/logo-ticker";
import AnimateIn from "@/components/animate-in";
import AnimatedCounter from "@/components/animated-counter";
import ContactCta from "@/components/contact-cta";
import Icon from "@/components/icon";

export default function Home() {
  const hero = getHero();
  const stats = getStats();
  const clients = getClients();
  const sectors = getSectors();
  const milestones = getMilestones();
  const about = getAboutTeaser();
  const audienceCards = getAudienceCards();
  const consultancy = getConsultancy();

  return (
    <>
      {/* ─── Hero ─────────────────────────────────────────── */}
      <section className="relative flex min-h-[70vh] items-end overflow-hidden">
        {/* Background image */}
        <Image
          src={hero.posterImage}
          alt=""
          fill
          priority
          className="object-cover"
        />
        {/* Dark overlay — strong bottom half for text legibility */}
        <div className="absolute inset-0 bg-gradient-to-t from-pi-navy from-10% via-pi-navy/70 via-50% to-transparent" />

        <div className="section-padding relative z-10 w-full pb-20 pt-48 md:pb-24">
          <div className="max-w-3xl">
            <h1
              className="font-display text-4xl leading-tight text-white sm:text-5xl md:text-6xl lg:text-7xl"
              style={{ textShadow: "0 2px 20px rgba(2,1,66,0.6)" }}
            >
              {hero.tagline}
            </h1>
            <p
              className="mt-6 max-w-xl text-lg leading-relaxed text-white/80 md:text-xl"
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

        {/* Bottom fade into logo ticker */}
        <div className="absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-pi-navy to-transparent" />
      </section>

      {/* ─── Logo Ticker ──────────────────────────────────── */}
      <LogoTicker clients={clients} />

      {/* ─── Stats ────────────────────────────────────────── */}
      <section className="section-padding section-gap">
        <div className="grid grid-cols-2 gap-8 md:grid-cols-4">
          {stats.map((stat, i) => (
            <AnimateIn key={stat.label} delay={i * 100}>
              <div className="text-center">
                <p className="font-display text-4xl text-white md:text-5xl">
                  <AnimatedCounter value={stat.value} suffix={stat.suffix} />
                </p>
                <p className="mt-2 text-sm text-white/50">{stat.label}</p>
              </div>
            </AnimateIn>
          ))}
        </div>
      </section>

      {/* ─── Consultancy ───────────────────────────────────── */}
      <section className="section-padding section-gap bg-pi-deep">
        <div className="mx-auto max-w-5xl">
          <AnimateIn>
            <p className="text-xs font-semibold uppercase tracking-widest text-pi-accent">
              {consultancy.label}
            </p>
            <h2 className="mt-3 font-display text-3xl text-white md:text-4xl">
              {consultancy.heading}
            </h2>
          </AnimateIn>
          <AnimateIn delay={100}>
            <p className="mt-6 max-w-3xl text-base leading-relaxed text-white/60">
              {consultancy.body}
            </p>
          </AnimateIn>

          <div className="mt-12 grid gap-6 md:grid-cols-2">
            {consultancy.services.map((service, i) => (
              <AnimateIn key={service.title} delay={i * 100}>
                <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-6 md:p-8">
                  <Icon
                    name={service.icon}
                    size={24}
                    className="text-pi-accent"
                  />
                  <h3 className="mt-4 font-display text-xl text-white">
                    {service.title}
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-white/50">
                    {service.description}
                  </p>
                </div>
              </AnimateIn>
            ))}
          </div>

          <AnimateIn delay={400}>
            <div className="mt-10">
              <Link
                href={consultancy.ctaHref}
                className="inline-flex items-center gap-2 text-sm font-semibold text-pi-accent transition-colors hover:text-white"
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
          <p className="text-center text-xs font-semibold uppercase tracking-widest text-pi-accent">
            Where we work
          </p>
          <h2 className="mt-3 text-center font-display text-3xl text-white md:text-4xl">
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
                {/* Background image */}
                <div className="relative aspect-[16/9] md:aspect-[21/9]">
                  <Image
                    src={sector.photo}
                    alt={sector.name}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-pi-navy via-pi-navy/60 to-transparent" />
                </div>

                {/* Content overlay */}
                <div className="absolute inset-x-0 bottom-0 p-6 md:p-8">
                  <h3 className="font-display text-2xl text-white md:text-3xl">
                    {sector.name}
                  </h3>
                  <p className="mt-2 max-w-lg text-sm leading-relaxed text-white/60">
                    {sector.description}
                  </p>
                  <div className="mt-4 flex flex-wrap gap-2">
                    {sector.clients.slice(0, 6).map((client) => (
                      <span
                        key={client}
                        className="rounded-full bg-white/10 px-3 py-1 text-xs text-white/70"
                      >
                        {client}
                      </span>
                    ))}
                    {sector.clients.length > 6 && (
                      <span className="rounded-full bg-white/10 px-3 py-1 text-xs text-white/50">
                        + many more
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </AnimateIn>
          ))}
        </div>
      </section>

      {/* ─── Milestones ───────────────────────────────────── */}
      <section className="section-padding section-gap">
        <AnimateIn>
          <p className="text-center text-xs font-semibold uppercase tracking-widest text-pi-gold">
            Track record
          </p>
          <h2 className="mt-3 text-center font-display text-3xl text-white md:text-4xl">
            Industry firsts
          </h2>
        </AnimateIn>

        <div className="mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {milestones.map((milestone, i) => {
            const accentClass =
              milestone.accentColor === "gold"
                ? "text-pi-gold border-pi-gold/20 bg-pi-gold/5"
                : "text-pi-accent border-pi-accent/20 bg-pi-accent/5";
            return (
              <AnimateIn key={milestone.title} delay={i * 120}>
                <div
                  className={`rounded-2xl border p-6 md:p-8 ${accentClass}`}
                >
                  <Icon
                    name={milestone.icon}
                    size={28}
                    className={
                      milestone.accentColor === "gold"
                        ? "text-pi-gold"
                        : "text-pi-accent"
                    }
                  />
                  <h3 className="mt-4 font-display text-xl text-white">
                    {milestone.title}
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-white/50">
                    {milestone.description}
                  </p>
                </div>
              </AnimateIn>
            );
          })}
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
              />
            </div>
          </AnimateIn>

          <AnimateIn delay={150}>
            <div>
              <p className="text-xs font-semibold uppercase tracking-widest text-pi-accent">
                {about.label}
              </p>
              <h2 className="mt-3 font-display text-2xl leading-snug text-white md:text-3xl">
                {about.heading}
              </h2>
              <p className="mt-5 text-base leading-relaxed text-white/60">
                {about.body}
              </p>
              <Link
                href={about.ctaHref}
                className="mt-8 inline-flex items-center gap-2 text-sm font-semibold text-pi-accent transition-colors hover:text-white"
              >
                {about.ctaLabel}
                <Icon name="arrow-right" size={16} />
              </Link>
            </div>
          </AnimateIn>
        </div>
      </section>

      {/* ─── Audience Cards ───────────────────────────────── */}
      <section className="section-padding section-gap">
        <AnimateIn>
          <p className="text-center text-xs font-semibold uppercase tracking-widest text-pi-accent">
            How can we help?
          </p>
          <h2 className="mt-3 text-center font-display text-3xl text-white md:text-4xl">
            Who we work with
          </h2>
        </AnimateIn>

        <div className="mt-12 grid gap-6 md:grid-cols-3">
          {audienceCards.map((card, i) => {
            const isExternal = card.external;
            const Tag = isExternal ? "a" : Link;
            const linkProps = isExternal
              ? { href: card.href, target: "_blank", rel: "noopener noreferrer" }
              : { href: card.href };

            return (
              <AnimateIn key={card.title} delay={i * 120}>
                <div className="group flex h-full flex-col rounded-2xl border border-white/10 bg-white/[0.02] p-6 transition-colors duration-300 hover:border-pi-accent/30 hover:bg-pi-accent/5 md:p-8">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-pi-accent/10">
                    <Icon
                      name={card.icon}
                      size={22}
                      className="text-pi-accent"
                    />
                  </div>
                  <h3 className="mt-5 font-display text-xl text-white">
                    {card.title}
                  </h3>
                  <p className="mt-2 flex-1 text-sm leading-relaxed text-white/50">
                    {card.description}
                  </p>
                  <Tag
                    {...linkProps}
                    className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-pi-accent transition-colors group-hover:text-white"
                  >
                    {card.ctaLabel}
                    <Icon name="arrow-right" size={14} />
                  </Tag>
                </div>
              </AnimateIn>
            );
          })}
        </div>
      </section>

      {/* ─── Stay in the Loop ─────────────────────────────── */}
      <section className="section-padding section-gap bg-pi-deep">
        <div className="mx-auto max-w-3xl text-center">
          <AnimateIn>
            <p className="text-xs font-semibold uppercase tracking-widest text-pi-accent">
              Stay in the loop
            </p>
            <h2 className="mt-3 font-display text-3xl text-white md:text-4xl">
              Never miss an interpreted event
            </h2>
          </AnimateIn>
          <AnimateIn delay={100}>
            <p className="mx-auto mt-6 max-w-xl text-base leading-relaxed text-white/60">
              Love live music? Sports? Festivals? Dance? Comedy? Follow us to be
              the first to know about:
            </p>
            <ul className="mx-auto mt-6 max-w-md space-y-3 text-left text-sm text-white/60">
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
                className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-5 py-2.5 text-sm font-semibold text-white transition-all hover:border-pi-accent/30 hover:bg-pi-accent/10"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/></svg>
                Instagram
              </a>
              <a
                href="https://www.facebook.com/performanceinterpreting"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-5 py-2.5 text-sm font-semibold text-white transition-all hover:border-pi-accent/30 hover:bg-pi-accent/10"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
                Facebook
              </a>
              <a
                href="https://x.com/performinterp"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-5 py-2.5 text-sm font-semibold text-white transition-all hover:border-pi-accent/30 hover:bg-pi-accent/10"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
                X
              </a>
            </div>
          </AnimateIn>
        </div>
      </section>

      {/* ─── Closing Quote ────────────────────────────────── */}
      <section className="section-padding section-gap">
        <AnimateIn>
          <blockquote className="mx-auto max-w-2xl text-center">
            <p className="font-display text-2xl italic leading-relaxed text-white md:text-3xl">
              &ldquo;Inclusivity is more than a word; it&rsquo;s an{" "}
              <span className="text-pi-accent">experience</span>.&rdquo;
            </p>
          </blockquote>
        </AnimateIn>
      </section>

      {/* ─── Contact CTA ──────────────────────────────────── */}
      <ContactCta />
    </>
  );
}
