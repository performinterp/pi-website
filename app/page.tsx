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
} from "@/lib/content";
import LogoTicker from "@/components/logo-ticker";
import AnimateIn from "@/components/animate-in";
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

  return (
    <>
      {/* ─── Hero ─────────────────────────────────────────── */}
      <section className="relative flex min-h-[85vh] items-end overflow-hidden">
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
              <Link
                href={hero.secondaryCta.href}
                className="inline-flex items-center gap-2 rounded-full border border-white/25 bg-white/5 px-7 py-3.5 text-sm font-semibold text-white backdrop-blur-sm transition-all duration-200 hover:border-white/40 hover:bg-white/10"
              >
                {hero.secondaryCta.label}
              </Link>
            </div>
          </div>
        </div>

        {/* Bottom fade into logo ticker */}
        <div className="absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-pi-deep to-transparent" />
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
                  {stat.value}
                  <span className="text-pi-accent">{stat.suffix}</span>
                </p>
                <p className="mt-2 text-sm text-white/50">{stat.label}</p>
              </div>
            </AnimateIn>
          ))}
        </div>
      </section>

      {/* ─── Sectors ──────────────────────────────────────── */}
      <section className="section-padding section-gap bg-pi-deep">
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
                        +{sector.clients.length - 6} more
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

        <div className="mt-12 grid gap-6 md:grid-cols-3">
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
      <section className="section-padding section-gap bg-pi-deep">
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

      {/* ─── Contact CTA ──────────────────────────────────── */}
      <ContactCta />
    </>
  );
}
