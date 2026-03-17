import Image from "next/image";

interface PageHeroProps {
  title: string;
  subtitle?: string;
  backgroundImage?: string;
}

export default function PageHero({ title, subtitle, backgroundImage }: PageHeroProps) {
  return (
    <section className="relative flex min-h-[40vh] items-center justify-center section-padding">
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
          <div className="absolute inset-0 bg-pi-deep/80" />
        </>
      )}

      {/* Content */}
      <div className="relative z-10 py-16 text-center">
        <h1 className="font-display text-4xl text-white md:text-5xl">
          {title}
        </h1>
        {subtitle && (
          <p className="mx-auto mt-4 max-w-2xl text-lg text-white/60">
            {subtitle}
          </p>
        )}
      </div>
    </section>
  );
}
