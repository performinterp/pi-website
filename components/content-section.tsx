import Image from "next/image";
import AnimateIn from "./animate-in";
import Icon from "./icon";

interface ContentSectionProps {
  label?: string;
  heading?: string;
  body: string[];
  items?: { title: string; description: string; url?: string }[];
  stats?: { number: string; label: string }[];
  image?: string;
  imageAlt?: string;
  variant?: "achievements" | "press" | "stats";
  ctaLabel?: string;
  ctaHref?: string;
  ctaExternal?: boolean;
}

export default function ContentSection({
  label,
  heading,
  body,
  items,
  stats,
  image,
  imageAlt,
  variant,
  ctaLabel,
  ctaHref,
  ctaExternal,
}: ContentSectionProps) {
  const hasImage = Boolean(image);

  return (
    <section className="section-padding pt-10 pb-14 md:pt-12 md:pb-20">
      <div className={`mx-auto border-t border-pi-ink/10 pt-10 md:pt-12 ${hasImage ? "max-w-6xl" : "max-w-4xl"}`}>
        <AnimateIn>
          {label && (
            <p className="text-xs font-semibold uppercase tracking-widest text-pi-gold">
              {label}
            </p>
          )}
          {heading && (
            <h2 className="mt-3 font-display text-2xl text-pi-ink md:text-3xl">
              {heading}
            </h2>
          )}
        </AnimateIn>

        {hasImage ? (
          <div className="mt-8 grid gap-8 md:grid-cols-5 md:gap-12 md:items-center">
            <AnimateIn delay={100}>
              <div className="space-y-4 md:col-span-3">
                {body.map((paragraph, i) => (
                  <p key={i} className="text-base leading-relaxed text-pi-ink/80">
                    {paragraph}
                  </p>
                ))}
              </div>
            </AnimateIn>
            <AnimateIn delay={150}>
              <div className="md:col-span-2">
                <div className="relative aspect-[4/5] overflow-hidden rounded-2xl border border-pi-ink/10 shadow-xl shadow-pi-ink/10">
                  <Image
                    src={image!}
                    alt={imageAlt ?? ""}
                    fill
                    sizes="(min-width: 768px) 40vw, 100vw"
                    className="object-cover"
                  />
                </div>
              </div>
            </AnimateIn>
          </div>
        ) : (
          <AnimateIn delay={100}>
            <div className="mt-6 space-y-4">
              {body.map((paragraph, i) => (
                <p key={i} className="text-base leading-relaxed text-pi-ink/80">
                  {paragraph}
                </p>
              ))}
            </div>
          </AnimateIn>
        )}

        {stats && stats.length > 0 && variant === "stats" && (
          <AnimateIn delay={150}>
            <div className="mt-10 grid grid-cols-2 gap-6 rounded-2xl border border-pi-ink/10 bg-pi-canvas-soft p-8 md:grid-cols-4 md:gap-8 md:p-10">
              {stats.map((stat) => (
                <div key={stat.label} className="text-center">
                  <p className="font-display text-4xl text-pi-ink md:text-5xl">
                    {stat.number}
                  </p>
                  <p className="mt-2 text-xs font-semibold uppercase tracking-wider text-pi-ink/65">
                    {stat.label}
                  </p>
                </div>
              ))}
            </div>
          </AnimateIn>
        )}

        {items && items.length > 0 && variant === "achievements" && (
          <AnimateIn delay={150}>
            <div className="mt-8 grid gap-x-12 gap-y-6 md:grid-cols-2">
              {items.map((item) => (
                <div key={item.title} className="flex gap-3">
                  <div className="mt-1 h-4 w-0.5 shrink-0 bg-pi-gold" />
                  <div>
                    <h3 className="text-sm font-semibold text-pi-ink">{item.title}</h3>
                    <p className="mt-1 text-sm leading-relaxed text-pi-ink/65">{item.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </AnimateIn>
        )}

        {items && items.length > 0 && variant === "press" && (
          <div className="mt-8 divide-y divide-pi-ink/10">
            {items.map((item, i) => (
              <AnimateIn key={item.title} delay={i * 60}>
                {item.url ? (
                  <a
                    href={item.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group flex items-start justify-between gap-6 py-5"
                  >
                    <div>
                      <h3 className="text-sm font-semibold text-pi-ink transition-colors group-hover:text-pi-accent">
                        {item.title}
                      </h3>
                      <p className="mt-1 text-sm leading-relaxed text-pi-ink/65">{item.description}</p>
                    </div>
                    <span className="mt-0.5 shrink-0 text-pi-accent transition-transform group-hover:translate-x-0.5">→</span>
                  </a>
                ) : (
                  <div className="py-5">
                    <h3 className="text-sm font-semibold text-pi-ink">{item.title}</h3>
                    <p className="mt-1 text-sm leading-relaxed text-pi-ink/65">{item.description}</p>
                  </div>
                )}
              </AnimateIn>
            ))}
          </div>
        )}

        {items && items.length > 0 && !variant && (
          <div className="mt-10 grid gap-6 md:grid-cols-2">
            {items.map((item, i) => (
              <AnimateIn key={item.title} delay={i * 80}>
                <div className="rounded-xl border border-pi-ink/10 bg-white p-6 shadow-sm">
                  <h3 className="font-display text-lg text-pi-ink">
                    {item.title}
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-pi-ink/70">
                    {item.description}
                  </p>
                  {item.url && (
                    <a
                      href={item.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mt-3 inline-flex items-center gap-1 text-xs font-semibold text-pi-accent transition-colors hover:text-pi-ink"
                    >
                      Read more →
                    </a>
                  )}
                </div>
              </AnimateIn>
            ))}
          </div>
        )}

        {ctaLabel && ctaHref && (
          <AnimateIn delay={200}>
            <div className="mt-10">
              {ctaExternal ? (
                <a
                  href={ctaHref}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 rounded-full bg-pi-accent px-8 py-3.5 text-sm font-semibold text-white shadow-lg shadow-pi-accent/25 transition-all duration-200 hover:brightness-110 hover:shadow-pi-accent/40"
                >
                  {ctaLabel}
                  <Icon name="arrow-right" size={16} />
                </a>
              ) : (
                <a
                  href={ctaHref}
                  className="inline-flex items-center gap-2 rounded-full bg-pi-accent px-8 py-3.5 text-sm font-semibold text-white shadow-lg shadow-pi-accent/25 transition-all duration-200 hover:brightness-110 hover:shadow-pi-accent/40"
                >
                  {ctaLabel}
                  <Icon name="arrow-right" size={16} />
                </a>
              )}
            </div>
          </AnimateIn>
        )}
      </div>
    </section>
  );
}
