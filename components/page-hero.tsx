interface PageHeroProps {
  title: string;
  subtitle?: string;
  backgroundImage?: string;
  imagePosition?: string;
  tall?: boolean;
}

export default function PageHero({ title, subtitle, backgroundImage, imagePosition, tall }: PageHeroProps) {
  return (
    <section
      className={`relative w-full overflow-hidden bg-pi-navy ${tall ? "min-h-[70vh]" : "min-h-[55vh]"}`}
      style={
        backgroundImage
          ? {
              backgroundImage: `url(${backgroundImage})`,
              backgroundSize: "cover",
              backgroundPosition: imagePosition ?? "center",
              backgroundRepeat: "no-repeat",
            }
          : undefined
      }
    >
      {backgroundImage ? (
        /* Bottom-left corner darken — radial fade so it has no hard edges */
        <div
          className="absolute inset-0"
          style={{
            background:
              "radial-gradient(ellipse 130% 65% at 0% 100%, rgba(2,1,66,0.92) 0%, rgba(2,1,66,0.6) 30%, rgba(2,1,66,0.2) 60%, transparent 85%)",
          }}
        />
      ) : (
        <div className="absolute inset-0 bg-gradient-to-br from-pi-deep to-pi-navy" />
      )}

      {/* Content drives section height — no separate min-h on the section */}
      <div className={`section-padding relative z-10 flex flex-col justify-end pt-24 pb-12 md:pb-16 ${tall ? "min-h-[70vh] md:pt-40" : "min-h-[55vh] md:pt-32"}`}>
        <div className="max-w-3xl">
          <h1
            className="font-display text-4xl leading-tight text-white md:text-5xl lg:text-6xl"
            style={{ textShadow: "0 2px 16px rgba(2,1,66,0.5)" }}
          >
            {title}
          </h1>
          {subtitle && (
            <p
              className="mt-4 max-w-2xl text-lg leading-relaxed text-white/90 md:text-xl"
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
