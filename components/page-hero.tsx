interface PageHeroProps {
  title: string;
  subtitle?: string;
  backgroundImage?: string;
}

export default function PageHero({ title, subtitle, backgroundImage }: PageHeroProps) {
  return (
    <section
      className="relative flex items-center justify-center section-padding"
      style={{ minHeight: "40vh" }}
    >
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-pi-deep to-pi-navy" />

      {/* Background image with dark overlay */}
      {backgroundImage && (
        <>
          <div
            className="absolute inset-0 bg-cover bg-center"
            style={{ backgroundImage: `url(${backgroundImage})` }}
          />
          <div className="absolute inset-0 bg-pi-deep/80" />
        </>
      )}

      {/* Content */}
      <div className="relative z-10 text-center py-16">
        <h1 className="font-display text-4xl md:text-5xl text-white">
          {title}
        </h1>
        {subtitle && (
          <p className="mt-4 text-lg text-pi-muted max-w-2xl mx-auto">
            {subtitle}
          </p>
        )}
      </div>
    </section>
  );
}
