import AnimateIn from "./animate-in";
import Icon from "./icon";

interface ContentSectionProps {
  label?: string;
  heading?: string;
  body: string[];
  items?: { title: string; description: string; url?: string }[];
}

export default function ContentSection({
  label,
  heading,
  body,
  items,
}: ContentSectionProps) {
  return (
    <section className="section-padding section-gap">
      <div className="mx-auto max-w-4xl border-t border-white/[0.06] pt-16">
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

        <AnimateIn delay={100}>
          <div className="mt-6 space-y-4">
            {body.map((paragraph, i) => (
              <p key={i} className="text-base leading-relaxed text-white/60">
                {paragraph}
              </p>
            ))}
          </div>
        </AnimateIn>

        {items && items.length > 0 && (
          <div className="mt-10 grid gap-6 md:grid-cols-2">
            {items.map((item, i) => (
              <AnimateIn key={item.title} delay={i * 80}>
                <div className="rounded-xl border border-white/10 bg-white/[0.02] p-6">
                  <h3 className="font-display text-lg text-white">
                    {item.title}
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-white/50">
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
      </div>
    </section>
  );
}
