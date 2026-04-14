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
    <section className="section-padding section-gap">
      <div className={`mx-auto border-t border-white/[0.06] pt-16 ${hasImage ? "max-w-6xl" : "max-w-4xl"}`}>
        <AnimateIn>
          {label && (
            <p className="text-xs font-semibold uppercase tracking-widest text-pi-accent">
              {label}
            </p>
          )}
          {heading && (
            <h2 className="mt-3 font-display text-2xl text-white md:text-3xl">
              {heading}
            </h2>
          )}
        </AnimateIn>

        {hasImage ? (
          <div className="mt-8 grid gap-8 md:grid-cols-5 md:gap-12 md:items-center">
            <AnimateIn delay={100}>
              <div className="space-y-4 md:col-span-3">
                {body.map((paragraph, i) => (
                  <p key={i} className="text-base leading-relaxed text-white/80">
                    {paragraph}
                  </p>
                ))}
              </div>
            </AnimateIn>
            <AnimateIn delay={150}>
              <div className="md:col-span-2">
                <div className="relative aspect-[4/5] overflow-hidden rounded-2xl border border-white/10 shadow-2xl shadow-black/40">
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
                <p key={i} className="text-base leading-relaxed text-white/80">
                  {paragraph}
                </p>
              ))}
            </div>
          </AnimateIn>
        )}

        {stats && stats.length > 0 && variant === "stats" && (
          <AnimateIn delay={150}>
            <div className="mt-10 grid grid-cols-2 gap-6 rounded-2xl border border-white/10 bg-white/[0.02] p-8 md:grid-cols-4 md:gap-8 md:p-10">
              {stats.map((stat) => (
                <div key={stat.label} className="text-center">
                  <p className="font-display text-4xl text-pi-accent md:text-5xl">
                    {stat.number}
                  </p>
                  <p className="mt-2 text-xs font-semibold uppercase tracking-wider text-white/60">
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
                  <div className="mt-1 h-4 w-0.5 shrink-0 bg-pi-accent/50" />
                  <div>
                    <h3 className="text-sm font-semibold text-white">{item.title}</h3>
                    <p className="mt-1 text-sm leading-relaxed text-white/60">{item.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </AnimateIn>
        )}

        {items && items.length > 0 && variant === "press" && (
          <div className="mt-8 divide-y divide-white/[0.06]">
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
                      <h3 className="text-sm font-semibold text-white transition-colors group-hover:text-pi-accent">
                        {item.title}
                      </h3>
                      <p className="mt-1 text-sm leading-relaxed text-white/60">{item.description}</p>
                    </div>
                    <span className="mt-0.5 shrink-0 text-pi-accent transition-transform group-hover:translate-x-0.5">→</span>
                  </a>
                ) : (
                  <div className="py-5">
                    <h3 className="text-sm font-semibold text-white">{item.title}</h3>
                    <p className="mt-1 text-sm leading-relaxed text-white/60">{item.description}</p>
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
                <div className="rounded-xl border border-white/10 bg-white/[0.02] p-6">
                  <h3 className="font-display text-lg text-white">
                    {item.title}
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-white/70">
                    {item.description}
                  </p>
                  {item.url && (
                    <a
                      href={item.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mt-3 inline-flex items-center gap-1 text-xs font-semibold text-pi-accent transition-colors hover:text-white"
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
