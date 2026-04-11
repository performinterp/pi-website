import Image from "next/image";

interface PageHeroProps {
  title: string;
  subtitle?: string;
  backgroundImage?: string;
}

export default function PageHero({ title, subtitle, backgroundImage }: PageHeroProps) {
  return (
    <section className="relative flex min-h-[50vh] items-end section-padding">
      {/* Background gradient fallback */}
      <div className="absolute inset-0 bg-gradient-to-br from-pi-deep to-pi-navy" />

      {/* Background image with dark overlay */}
      {backgroundImage && (
        <>
          <Image
            src={backgroundImage}
            alt=""
            fill
            priority
            className="object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-pi-navy from-5% via-pi-navy/70 via-40% to-pi-deep/40" />
        </>
      )}

      {/* Content - bottom-left aligned like homepage hero */}
      <div className="relative z-10 w-full pb-12 pt-32 md:pb-16">
        <div className="max-w-3xl">
          <h1
            className="font-display text-4xl leading-tight text-white md:text-5xl lg:text-6xl"
            style={{ textShadow: "0 2px 16px rgba(2,1,66,0.5)" }}
          >
            {title}
          </h1>
          {subtitle && (
            <p
              className="mt-4 max-w-2xl text-lg leading-relaxed text-white/80 md:text-xl"
              style={{ textShadow: "0 1px 8px rgba(2,1,66,0.4)" }}
            >
              {subtitle}
            </p>
          )}
        </div>
      </div>
    </section>
  );
}
