import AnimateIn from "./animate-in";
import Icon from "./icon";

interface ContentSectionProps {
  label?: string;
  heading?: string;
  body: string[];
  items?: { title: string; description: string }[];
  alternate?: boolean;
}

export default function ContentSection({
  label,
  heading,
  body,
  items,
  alternate = false,
}: ContentSectionProps) {
  return (
    <section
      className={`section-padding section-gap ${alternate ? "bg-pi-deep" : ""}`}
    >
      <div className="mx-auto max-w-4xl">
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
                </div>
              </AnimateIn>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
